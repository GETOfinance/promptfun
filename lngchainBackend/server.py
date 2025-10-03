import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pinecone import Pinecone, ServerlessSpec, CloudProvider, AwsRegion, VectorType
import PyPDF2
import uuid
from typing import List, Dict, Optional
from docx import Document
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

# Load environment variables
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "aptos-rag")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
MONGO_URL = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup
client = MongoClient(MONGO_URL)
db = client["promptfun"]
launched_tokens = db["launched_tokens"]

# Models for marketplace endpoints
class LaunchTokenRequest(BaseModel):
    symbol: str
    name: str
    tx_hash: str
    creator: Optional[str] = None
    supply: Optional[int] = None
    base_price: Optional[float] = None

class LaunchedToken(BaseModel):
    symbol: str
    name: str
    tx_hash: str
    creator: Optional[str] = None
    supply: Optional[int] = None
    base_price: Optional[float] = None

# Marketplace endpoints
@app.post("/api/marketplace/launch", response_model=LaunchedToken)
def launch_token(token: LaunchTokenRequest):
    doc = token.dict()
    launched_tokens.update_one({"symbol": doc["symbol"]}, {"$set": doc}, upsert=True)
    return doc

@app.get("/api/marketplace/launched", response_model=List[LaunchedToken])
def get_launched_tokens():
    tokens = list(launched_tokens.find({}, {"_id": 0}))
    return tokens

@app.get("/api/marketplace/launched/{symbol}", response_model=LaunchedToken)
def get_launched_token(symbol: str):
    token = launched_tokens.find_one({"symbol": symbol}, {"_id": 0})
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    return token

class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    history: List[ChatMessage]
    message: str
    top_k: int = 5

# Globals
index = None
embeddings = None

# Helper: Load and chunk files
def load_and_chunk():
    docs = []
    # Prompt_Fun_Context_Document.docx (upload first)
    def extract_docx_text(docx_path):
        doc = Document(docx_path)
        return "\n".join([para.text for para in doc.paragraphs])
    text = extract_docx_text("Prompt_Fun_Context_Document.docx")
    print(f"Prompt_Fun_Context_Document.docx length: {len(text)} sample: {text[:100]}")
    docs.append({"text": text, "source": "Prompt_Fun_Context_Document.docx"})
    # aptos-whitepaper_en.pdf (upload second)
    with open("aptos-whitepaper_en.pdf", "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            print(f"aptos-whitepaper_en.pdf:p{i+1} length: {len(page_text) if page_text else 0} sample: {page_text[:100] if page_text else ''}")
            docs.append({"text": page_text, "source": f"aptos-whitepaper_en.pdf:p{i+1}"})
    # Split into chunks
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    all_chunks = []
    for doc in docs:
        for chunk in splitter.split_text(doc["text"]):
            print("Chunk text:", chunk[:100])
            all_chunks.append({"text": chunk, "source": doc["source"]})
    print(f"Total chunks to embed: {len(all_chunks)}")
    print("Sample sources:", [c['source'] for c in all_chunks[:5]])
    # Prepare metadata and vectors for upsert
    texts = [c["text"] for c in all_chunks]
    metadatas = [{"source": c["source"], "text": c["text"]} for c in all_chunks]
    batch_vecs = embeddings.embed_documents(texts)
    vectors = []
    for i, (vec, meta) in enumerate(zip(batch_vecs, metadatas)):
        print("Upserting meta:", meta)
        vectors.append((f"chunk-{i}", vec, meta))
    # Upsert in batches of 32
    BATCH_SIZE = 32
    for i in range(0, len(vectors), BATCH_SIZE):
        batch = vectors[i:i+BATCH_SIZE]
        index.upsert(vectors=batch, namespace="default")
    return all_chunks

@app.on_event("startup")
async def startup_event():
    global index, embeddings
    # 1. Init Pinecone v3
    pc = Pinecone(api_key=PINECONE_API_KEY)
    if PINECONE_INDEX_NAME not in [i.name for i in pc.list_indexes()]:
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=768,  # Gemini embedding-001 is 768
            metric="cosine",
            spec=ServerlessSpec(
                cloud=CloudProvider.AWS,
                region=AwsRegion.US_EAST_1
            ),
            vector_type=VectorType.DENSE
        )
    index = pc.Index(PINECONE_INDEX_NAME)
    # 2. Initialize embeddings for retrieval only
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GOOGLE_API_KEY)

@app.get("/", response_class=HTMLResponse)
async def chat_ui(request: Request):
    return HTMLResponse(
        """
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Gemini RAG Chatbot</title>
            <style>
                body { background: #181c20; color: #f3f3f3; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; }
                .container { max-width: 600px; margin: 40px auto; background: #23272e; border-radius: 12px; box-shadow: 0 2px 16px #0003; padding: 32px 24px; }
                h1 { text-align: center; font-size: 2rem; margin-bottom: 1.5rem; }
                .chat { min-height: 320px; margin-bottom: 1.5rem; }
                .msg { margin: 12px 0; padding: 12px 16px; border-radius: 8px; max-width: 90%; word-break: break-word; }
                .user { background: #2d3748; align-self: flex-end; }
                .assistant { background: #3b4252; align-self: flex-start; }
                .chat { display: flex; flex-direction: column; }
                form { display: flex; gap: 8px; }
                input[type=text] { flex: 1; padding: 10px 14px; border-radius: 6px; border: none; font-size: 1rem; background: #22262b; color: #f3f3f3; }
                button { background: #4f8cff; color: #fff; border: none; border-radius: 6px; padding: 10px 22px; font-size: 1rem; cursor: pointer; transition: background 0.2s; }
                button:hover { background: #2563eb; }
                .sources { font-size: 0.9em; color: #a0aec0; margin-top: 6px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <h1>Gemini RAG Chatbot</h1>
                <div class='chat' id='chat'></div>
                <form id='chatForm'>
                    <input type='text' id='userInput' autocomplete='off' placeholder='Type your question...' required />
                    <button type='submit'>Send</button>
                </form>
            </div>
            <script>
                let history = [];
                const chatDiv = document.getElementById('chat');
                const form = document.getElementById('chatForm');
                const input = document.getElementById('userInput');
                function renderChat() {
                    chatDiv.innerHTML = '';
                    for (const msg of history) {
                        const div = document.createElement('div');
                        div.className = 'msg ' + msg.role;
                        div.textContent = msg.content;
                        chatDiv.appendChild(div);
                    }
                    chatDiv.scrollTop = chatDiv.scrollHeight;
                }
                form.onsubmit = async (e) => {
                    e.preventDefault();
                    const userMsg = input.value.trim();
                    if (!userMsg) return;
                    history.push({ role: 'user', content: userMsg });
                    renderChat();
                    input.value = '';
                    const res = await fetch('/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ history, message: userMsg })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        history.push({ role: 'assistant', content: data.response });
                        renderChat();
                        if (data.sources && data.sources.length) {
                            const srcDiv = document.createElement('div');
                            srcDiv.className = 'sources';
                            srcDiv.textContent = 'Sources: ' + data.sources.join(', ');
                            chatDiv.appendChild(srcDiv);
                        }
                    } else {
                        history.push({ role: 'assistant', content: 'Error: ' + (await res.text()) });
                        renderChat();
                    }
                };
                renderChat();
            </script>
        </body>
        </html>
        """
    )

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        # 1. Embed the user message
        query_vec = embeddings.embed_query(req.message)
        # 2. Query Pinecone for relevant docs
        results = index.query(vector=query_vec, top_k=req.top_k, include_metadata=True, namespace="default")
        print("Pinecone matches:", [m["metadata"]["source"] for m in results["matches"]])
        for match in results["matches"]:
            print("Match metadata:", match["metadata"])
        retrieved_chunks = [match["metadata"]["source"] + ": " + match["metadata"].get("text", "") for match in results["matches"]]
        context = "\n".join(retrieved_chunks)
        # 3. Build chat prompt with history and context
        history_str = "\n".join([f"{m.role.capitalize()}: {m.content}" for m in req.history])
        prompt = (
            "You are an expert assistant. Use the following context as your background knowledge to answer the user's question directly and naturally. "
            "Do not mention the context or your sources. Minimize speculation and hallucination. If you are unsure, answer concisely and do not make up information.\n\n"
            f"Context:\n{context}\n\n"
            f"Chat History:\n{history_str}\n\n"
            f"User: {req.message}\nAssistant:"
        )
        print("Prompt sent to Gemini:\n", prompt[:1000])
        # 4. Use Gemini to answer
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-pro", google_api_key=GOOGLE_API_KEY)
        response = llm.invoke(prompt)
        return {"response": response.content, "sources": [m["metadata"]["source"] for m in results["matches"]]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/test-pinecone")
async def test_pinecone():
    # Use a realistic query for embedding
    sample_query = "what is prompt.fun"
    query_vec = embeddings.embed_query(sample_query)
    results = index.query(vector=query_vec, top_k=5, include_metadata=True, namespace="default")
    output = []
    for match in results["matches"]:
        print("Score:", match.get("score"))
        print("Source:", match["metadata"].get("source"))
        print("Text:", match["metadata"].get("text", "")[:300])
        print("-" * 60)
        output.append({
            "id": match.get("id"),
            "score": match.get("score"),
            "source": match["metadata"].get("source"),
            "text": match["metadata"].get("text", "")[:300]
        })
    return {"results": output} 