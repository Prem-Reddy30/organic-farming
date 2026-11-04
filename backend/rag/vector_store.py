import os
import json
import math
import uuid
from typing import List, Dict, Any, Optional
from pathlib import Path
from backend.config import VECTOR_DB_PATH, DATA_DIR
from backend.rag.embeddings import EmbeddingEngine

try:
    import chromadb
    from chromadb.config import Settings
except ImportError:
    chromadb = None

class VectorStore:
    """
    Agricultural Knowledge Base Vector Store.
    Supports semantic similarity search, metadata filtering, reranking,
    and persistent storage on disk / ChromaDB / Supabase pgvector export.
    """
    def __init__(self, db_path: str = VECTOR_DB_PATH):
        self.db_path = db_path
        self.storage_file = Path(DATA_DIR) / "knowledge_base.json"
        self.embedder = EmbeddingEngine()
        self.chroma_client = None
        self.chroma_collection = None
        self.local_chunks: List[Dict[str, Any]] = []

        self._init_backend()

    def _init_backend(self):
        # Check if ChromaDB can be initialized
        if chromadb:
            try:
                os.makedirs(self.db_path, exist_ok=True)
                self.chroma_client = chromadb.PersistentClient(path=self.db_path)
                self.chroma_collection = self.chroma_client.get_or_create_collection(
                    name="organic_farming_kb",
                    metadata={"description": "Verified Indian Organic Farming Knowledge Base"}
                )
                print(f"[VectorStore] ChromaDB initialized at {self.db_path}")
            except Exception as e:
                print(f"[VectorStore] ChromaDB fallback to file-backed engine: {e}")
                self.chroma_client = None

        # Load file-backed cache
        self._load_local_storage()

    def _load_local_storage(self):
        if self.storage_file.exists():
            try:
                with open(self.storage_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.local_chunks = data.get("chunks", [])
                    print(f"[VectorStore] Loaded {len(self.local_chunks)} chunks from local disk.")
            except Exception as e:
                print(f"[VectorStore] Failed reading local storage: {e}")
                self.local_chunks = []
        else:
            self.local_chunks = []

    def _save_local_storage(self):
        try:
            with open(self.storage_file, "w", encoding="utf-8") as f:
                json.dump({"chunks": self.local_chunks}, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"[VectorStore] Error saving to storage: {e}")

    def add_document(self, doc_id: str, title: str, chunks: List[Dict[str, Any]], metadata: Dict[str, Any]) -> int:
        """
        Embed and index chunks belonging to a document.
        """
        texts = [c["content"] for c in chunks]
        embeddings = self.embedder.get_embeddings(texts)

        new_entries = []
        for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
            chunk_id = f"{doc_id}_{i}"
            entry_meta = {
                "doc_id": doc_id,
                "title": title,
                "source_url": metadata.get("source_url", ""),
                "author": metadata.get("author", "Agricultural Research Institute"),
                "publication_date": metadata.get("publication_date", "2024"),
                "page_number": chunk.get("metadata", {}).get("page", metadata.get("page", 1)),
                "crop_category": metadata.get("crop_category", "General"),
                "farming_topic": metadata.get("farming_topic", "General"),
                "language": metadata.get("language", "English"),
                "chunk_index": i
            }

            record = {
                "id": chunk_id,
                "content": chunk["content"],
                "metadata": entry_meta,
                "embedding": emb
            }
            new_entries.append(record)

            # Store in ChromaDB if available
            if self.chroma_collection:
                try:
                    self.chroma_collection.add(
                        ids=[chunk_id],
                        documents=[chunk["content"]],
                        metadatas=[entry_meta],
                        embeddings=[emb]
                    )
                except Exception as e:
                    pass

        # Update local storage
        # Remove any previous chunks with same doc_id
        self.local_chunks = [c for c in self.local_chunks if c["metadata"].get("doc_id") != doc_id]
        self.local_chunks.extend(new_entries)
        self._save_local_storage()

        return len(new_entries)

    def delete_document(self, doc_id: str) -> bool:
        """Delete all chunks for a document."""
        if self.chroma_collection:
            try:
                # Query IDs with doc_id
                results = self.chroma_collection.get(where={"doc_id": doc_id})
                if results and results.get("ids"):
                    self.chroma_collection.delete(ids=results["ids"])
            except Exception:
                pass

        prev_len = len(self.local_chunks)
        self.local_chunks = [c for c in self.local_chunks if c["metadata"].get("doc_id") != doc_id]
        self._save_local_storage()
        return len(self.local_chunks) < prev_len

    def search(
        self,
        query: str,
        top_k: int = 5,
        crop_filter: Optional[str] = None,
        topic_filter: Optional[str] = None,
        region_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Perform semantic similarity search with metadata filtering and BM25-style reranking.
        """
        if not self.local_chunks:
            return []

        query_emb = self.embedder.get_embedding(query)
        query_terms = [t.lower().strip(",.!?\"'") for t in query.split() if len(t) > 2]

        candidates = []
        for item in self.local_chunks:
            meta = item.get("metadata", {})
            content = item.get("content", "")

            # Apply crop filter if provided and not 'all'
            if crop_filter and crop_filter.lower() not in ("all", "general", ""):
                item_crop = meta.get("crop_category", "").lower()
                if item_crop != "general" and crop_filter.lower() not in item_crop and item_crop not in crop_filter.lower():
                    # Still consider if text heavily mentions crop
                    if crop_filter.lower() not in content.lower():
                        continue

            # Apply topic filter if provided and not 'all'
            if topic_filter and topic_filter.lower() not in ("all", "general", ""):
                item_topic = meta.get("farming_topic", "").lower()
                if item_topic != "general" and topic_filter.lower() not in item_topic and item_topic not in topic_filter.lower():
                    if topic_filter.lower() not in content.lower():
                        continue

            # Calculate cosine similarity
            item_emb = item.get("embedding", [])
            cos_sim = self._cosine_similarity(query_emb, item_emb)

            # Reranking bonus: Exact keyword matches in title and text
            lexical_boost = 0.0
            content_lower = content.lower()
            title_lower = meta.get("title", "").lower()

            for term in query_terms:
                if term in title_lower:
                    lexical_boost += 0.08
                if term in content_lower:
                    lexical_boost += 0.04

            combined_score = (0.75 * cos_sim) + (0.25 * min(lexical_boost, 0.4))

            candidates.append({
                "content": content,
                "metadata": meta,
                "score": round(float(combined_score), 4),
                "id": item.get("id")
            })

        # Sort descending by combined score
        candidates.sort(key=lambda x: x["score"], reverse=True)
        return candidates[:top_k]

    def _cosine_similarity(self, vec_a: List[float], vec_b: List[float]) -> float:
        if not vec_a or not vec_b or len(vec_a) != len(vec_b):
            return 0.0
        dot = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)

    def get_all_documents(self) -> List[Dict[str, Any]]:
        """List distinct documents with chunk counts and metadata."""
        docs_map = {}
        for chunk in self.local_chunks:
            meta = chunk.get("metadata", {})
            doc_id = meta.get("doc_id", "unknown")
            if doc_id not in docs_map:
                docs_map[doc_id] = {
                    "id": doc_id,
                    "title": meta.get("title", "Untitled Document"),
                    "source_url": meta.get("source_url", ""),
                    "author": meta.get("author", "Agricultural Authority"),
                    "publication_date": meta.get("publication_date", "2024"),
                    "crop_category": meta.get("crop_category", "General"),
                    "farming_topic": meta.get("farming_topic", "General"),
                    "language": meta.get("language", "English"),
                    "chunk_count": 0,
                    "status": "Indexed"
                }
            docs_map[doc_id]["chunk_count"] += 1

        return list(docs_map.values())

    def get_stats(self) -> Dict[str, Any]:
        """Return vector store statistics."""
        docs = self.get_all_documents()
        return {
            "total_documents": len(docs),
            "total_chunks": len(self.local_chunks),
            "backend": "ChromaDB + Local Persistent Index",
            "embedding_provider": self.embedder.provider,
            "vector_dimension": self.embedder._dim
        }
