import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec, CloudProvider, VectorType
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from docx import Document
import PyPDF2
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Load environment variables
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "aptos-rag")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Helper: Load and chunk files
def load_and_chunk():
    docs = []
    # DOCX
    def extract_docx_text(docx_path):
        doc = Document(docx_path)
        return "\n".join([para.text for para in doc.paragraphs])
    text = extract_docx_text("Prompt_Fun_Context_Document.docx")
    docs.append({"text": text, "source": "Prompt_Fun_Context_Document.docx"})
    # PDF
    with open("aptos-whitepaper_en.pdf", "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            docs.append({"text": page_text, "source": f"aptos-whitepaper_en.pdf:p{i+1}"})
    # Chunking
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    all_chunks = []
    for doc in docs:
        for chunk in splitter.split_text(doc["text"]):
            all_chunks.append({"text": chunk, "source": doc["source"]})
    return all_chunks

def main():
    # 1. Init Pinecone
    pc = Pinecone(api_key=PINECONE_API_KEY)
    if PINECONE_INDEX_NAME not in [i.name for i in pc.list_indexes()]:
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=768,
            metric="cosine",
            spec=ServerlessSpec(
                cloud=CloudProvider.AWS,
                region=CloudProvider.AWS,
            ),
            vector_type=VectorType.DENSE
        )
    index = pc.Index(PINECONE_INDEX_NAME)
    # 2. Init embeddings
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GOOGLE_API_KEY)
    # 3. Load and chunk docs
    chunks = load_and_chunk()
    texts = [c["text"] for c in chunks]
    metadatas = [{"source": c["source"], "text": c["text"]} for c in chunks]
    batch_vecs = embeddings.embed_documents(texts)
    vectors = []
    for i, (vec, meta) in enumerate(zip(batch_vecs, metadatas)):
        vectors.append((f"chunk-{i}", vec, meta))
    # 4. Upsert in batches
    BATCH_SIZE = 32
    for i in range(0, len(vectors), BATCH_SIZE):
        batch = vectors[i:i+BATCH_SIZE]
        index.upsert(vectors=batch, namespace="default")
    print("Upload complete.")

if __name__ == "__main__":
    main() 