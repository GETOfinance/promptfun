import os
import sys
import argparse
import hashlib
from pathlib import Path
from typing import List, Dict, Iterable, Tuple

from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pinecone import Pinecone, ServerlessSpec, CloudProvider, AwsRegion, VectorType

# -------- Settings --------
DEFAULT_INCLUDE_EXTS = {
    ".py", ".ts", ".tsx", ".js", ".jsx", ".md", ".mdx", ".move",
    ".json", ".toml", ".yml", ".yaml", ".sh", ".mjs", ".cjs", ".sql"
}
DEFAULT_EXCLUDE_DIRS = {
    ".git", ".next", "node_modules", "dist", "build", "coverage",
    "__pycache__", ".venv", "venv", ".mypy_cache", ".pytest_cache", ".idea",
}
MAX_FILE_SIZE_BYTES = 1_000_000  # 1 MB per file cap for indexing

# -------- Helpers --------

def sha1(s: str) -> str:
    return hashlib.sha1(s.encode("utf-8", errors="ignore")).hexdigest()


def should_skip_dir(path: Path) -> bool:
    parts = set(p.name for p in path.parents) | {path.name}
    return any(ex in parts for ex in DEFAULT_EXCLUDE_DIRS)


def should_include_file(path: Path, include_exts: set) -> bool:
    if not path.is_file():
        return False
    if path.suffix.lower() not in include_exts:
        return False
    if path.stat().st_size > MAX_FILE_SIZE_BYTES:
        return False
    # Skip excluded dirs
    for parent in path.parents:
        if parent.name in DEFAULT_EXCLUDE_DIRS:
            return False
    return True


def scan_files(root: Path, include_exts: set) -> List[Path]:
    files: List[Path] = []
    for p in root.rglob("*"):
        if p.is_dir():
            # Short-circuit walking excluded directories
            if p.name in DEFAULT_EXCLUDE_DIRS:
                # Skip walking into excluded directory by clearing the iterator using continue
                continue
        else:
            if should_include_file(p, include_exts):
                files.append(p)
    return files


def chunk_texts(paths: List[Path], repo_root: Path, chunk_size: int, overlap: int) -> List[Dict]:
    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=overlap)
    chunks: List[Dict] = []
    for path in paths:
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            # Skip unreadable files
            continue
        rel_path = str(path.relative_to(repo_root))
        # Skip empty
        if not text.strip():
            continue
        for i, piece in enumerate(splitter.split_text(text)):
            chunks.append({
                "text": piece,
                "source": rel_path,
                "chunk_index": i,
            })
    return chunks


def vectors_from_chunks(
    chunks: List[Dict],
    repo_name: str,
    namespace: str,
    embeddings: GoogleGenerativeAIEmbeddings,
    batch_size: int = 100,
) -> Iterable[List[Tuple[str, List[float], Dict]]]:
    """
    Yields batches formatted for Pinecone v3 upsert. Each item is a tuple (id, vector, metadata).
    The ID is stable: sha1(source)+"-"+chunk_index
    """
    # Prepare metadata and texts
    texts = [c["text"] for c in chunks]
    metadatas = []
    ids = []
    for c in chunks:
        rel = c["source"]
        idx = c["chunk_index"]
        uid = f"{sha1(rel)}-{idx}"
        ids.append(uid)
        metadatas.append({
            "source": rel,
            "repo": repo_name,
            "chunk_index": idx,
            "namespace": namespace,
            "text": c["text"],  # keep a copy for easier debugging
        })

    # Embed in batches
    for i in range(0, len(texts), batch_size):
        tb = texts[i:i + batch_size]
        mb = metadatas[i:i + batch_size]
        ib = ids[i:i + batch_size]
        vecs = embeddings.embed_documents(tb)
        yield [(id_, vec, meta) for id_, vec, meta in zip(ib, vecs, mb)]


def ensure_pinecone_index(pc: Pinecone, index_name: str) -> None:
    names = [i.name for i in pc.list_indexes()]
    if index_name in names:
        return
    pc.create_index(
        name=index_name,
        dimension=768,  # Gemini embedding-001
        metric="cosine",
        spec=ServerlessSpec(cloud=CloudProvider.AWS, region=AwsRegion.US_EAST_1),
        vector_type=VectorType.DENSE,
    )


# -------- Main entry --------

def main():
    parser = argparse.ArgumentParser(description="Index repository code into Pinecone (namespace: code)")
    parser.add_argument("--root", default=".", help="Root directory to index (default: .)")
    parser.add_argument("--namespace", default="code", help="Pinecone namespace (default: code)")
    parser.add_argument("--chunk-size", type=int, default=1200, help="Chunk size (chars)")
    parser.add_argument("--overlap", type=int, default=200, help="Chunk overlap (chars)")
    parser.add_argument("--batch-size", type=int, default=100, help="Embedding/upsert batch size")
    parser.add_argument("--max-files", type=int, default=0, help="Limit number of files (0 = no limit)")
    parser.add_argument("--dry-run", action="store_true", help="Do not embed/upsert; print summary only")
    parser.add_argument("--include-exts", nargs="*", help="Override include extensions (e.g. .py .ts .md)")

    args = parser.parse_args()

    load_dotenv()
    pinecone_api_key = os.getenv("PINECONE_API_KEY")
    index_name = os.getenv("PINECONE_INDEX_NAME", "aptos-rag")
    google_api_key = os.getenv("GOOGLE_API_KEY")

    if not pinecone_api_key:
        print("ERROR: PINECONE_API_KEY is not set.", file=sys.stderr)
        sys.exit(1)
    if not google_api_key and not args.dry_run:
        print("ERROR: GOOGLE_API_KEY is not set (required when not --dry-run).", file=sys.stderr)
        sys.exit(1)

    repo_root = Path(args.root).resolve()
    if not repo_root.exists():
        print(f"ERROR: root path not found: {repo_root}", file=sys.stderr)
        sys.exit(1)

    include_exts = set(args.include_exts) if args.include_exts else set(DEFAULT_INCLUDE_EXTS)

    print(f"Scanning for files in: {repo_root}")
    files = scan_files(repo_root, include_exts)
    if args.max_files and args.max_files > 0:
        files = files[: args.max_files]

    print(f"Found {len(files)} files to index.")
    if len(files) > 0:
        for sample in files[:5]:
            print(f"  - {sample.relative_to(repo_root)}")

    print("Chunking files...")
    chunks = chunk_texts(files, repo_root, args.chunk_size, args.overlap)
    print(f"Prepared {len(chunks)} chunks.")

    if args.dry_run:
        # Show a few sample chunks
        for c in chunks[:3]:
            print("--- Chunk sample ---")
            print("source:", c["source"], "#", c["chunk_index"])
            print(c["text"][:200].replace("\n", " ") + ("..." if len(c["text"]) > 200 else ""))
        print("Dry run complete. No embeddings or upserts were performed.")
        return

    # Initialize Pinecone and embeddings
    print("Initializing Pinecone and embeddings...")
    pc = Pinecone(api_key=pinecone_api_key)
    ensure_pinecone_index(pc, index_name)
    index = pc.Index(index_name)

    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=google_api_key)

    # Upsert in batches
    ns = args.namespace
    total = 0
    for batch in vectors_from_chunks(chunks, repo_root.name, ns, embeddings, batch_size=args.batch_size):
        index.upsert(vectors=batch, namespace=ns)
        total += len(batch)
        print(f"Upserted {total}/{len(chunks)} vectors into namespace '{ns}'.")

    print(f"Indexing complete. Total vectors upserted: {total} into index '{index_name}' namespace '{ns}'.")


if __name__ == "__main__":
    main()

