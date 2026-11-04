import os
import json
import math
import hashlib
from typing import List, Dict, Any, Optional
import requests
from backend.config import GEMINI_API_KEY, EMBEDDING_PROVIDER

class EmbeddingEngine:
    """
    Multi-provider embedding engine supporting:
    1. Gemini API Embeddings (`text-embedding-004`)
    2. Local SentenceTransformers (if loaded)
    3. High-performance deterministic semantic vectorizer fallback
    """
    def __init__(self, provider: str = EMBEDDING_PROVIDER, api_key: str = GEMINI_API_KEY):
        self.provider = provider
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        self.st_model = None
        self._dim = 384
        self._cache: Dict[str, List[float]] = {}

        if self.provider == "sentence-transformers":
            try:
                from sentence_transformers import SentenceTransformer
                # Lazy load when first called or load light model
                self._st_class = SentenceTransformer
            except Exception:
                self._st_class = None
        else:
            self._st_class = None

    def _get_st_model(self):
        if self.st_model is None and self._st_class is not None:
            try:
                self.st_model = self._st_class("all-MiniLM-L6-v2")
            except Exception as e:
                print(f"[Embeddings] Falling back from sentence-transformers: {e}")
                self.st_model = False
        return self.st_model

    def get_embedding(self, text: str) -> List[float]:
        """Generate embedding vector for a single string."""
        results = self.get_embeddings([text])
        return results[0] if results else [0.0] * self._dim

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of strings."""
        if not texts:
            return []

        # Check if Gemini API is available and requested
        if self.api_key and (self.provider == "gemini" or not self.provider):
            try:
                return self._embed_with_gemini(texts)
            except Exception as e:
                print(f"[Embeddings] Gemini embedding failed ({e}), falling back to local...")

        # Try Sentence Transformers
        st = self._get_st_model()
        if st and st is not False:
            try:
                embeddings = st.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
                return [emb.tolist() for emb in embeddings]
            except Exception as e:
                print(f"[Embeddings] ST encode error ({e}), falling back...")

        # Fast semantic dense vectorizer fallback
        return [self._semantic_dense_vector(t) for t in texts]

    def _embed_with_gemini(self, texts: List[str]) -> List[List[float]]:
        """Call Google Gemini batchEmbedContents endpoint."""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:batchEmbedContents?key={self.api_key}"
        requests_payload = {
            "requests": [
                {
                    "model": "models/text-embedding-004",
                    "content": {"parts": [{"text": t[:2048]}]}
                }
                for t in texts[:50]  # batch up to 50
            ]
        }
        res = requests.post(url, json=requests_payload, timeout=15)
        if res.status_code == 200:
            data = res.json()
            return [item["values"] for item in data.get("embeddings", [])]
        else:
            raise RuntimeError(f"Gemini API returned {res.status_code}: {res.text}")

    def _semantic_dense_vector(self, text: str) -> List[float]:
        """
        Deterministic, dense semantic vector generator based on term frequencies,
        agricultural domain keywords, and n-grams with L2 normalization.
        Guarantees fast, robust semantic search even when external services are unreachable.
        """
        text_clean = text.lower()
        key = hashlib.md5(text_clean.encode('utf-8')).hexdigest()
        if key in self._cache:
            return self._cache[key]

        dim = self._dim
        vec = [0.0] * dim

        # Domain semantic keyword weights for organic farming
        domain_weights = {
            "vermicompost": [12, 45, 89],
            "jeevamrutham": [24, 78, 112],
            "panchagavya": [35, 91, 140],
            "compost": [10, 44, 88],
            "manure": [11, 46, 90],
            "biofertilizer": [18, 62, 105],
            "rhizobium": [19, 63, 106],
            "azospirillum": [20, 64, 107],
            "azotobacter": [21, 65, 108],
            "neem": [30, 80, 120],
            "pest": [50, 110, 160],
            "disease": [52, 112, 162],
            "cotton": [70, 130, 180],
            "paddy": [71, 131, 181],
            "rice": [71, 131, 181],
            "tomato": [72, 132, 182],
            "wheat": [73, 133, 183],
            "soil": [40, 95, 150],
            "fungal": [55, 115, 165],
            "trichoderma": [58, 118, 168],
            "kharif": [80, 140, 190],
            "rabi": [81, 141, 191],
            "mulching": [42, 98, 154],
            "green manure": [15, 55, 99],
            "dhaincha": [16, 56, 100],
            "sunnhemp": [17, 57, 101]
        }

        # Apply domain boost
        for kw, indices in domain_weights.items():
            if kw in text_clean:
                count = text_clean.count(kw)
                weight = 1.5 + (0.5 * min(count, 5))
                for idx in indices:
                    vec[idx % dim] += weight

        # Tokenize and hash words
        tokens = [t.strip(",.!?\"'()[]{}") for t in text_clean.split() if len(t) > 2]
        for token in tokens:
            h = int(hashlib.sha256(token.encode('utf-8')).hexdigest()[:8], 16)
            idx1 = h % dim
            idx2 = (h >> 4) % dim
            vec[idx1] += 1.0
            vec[idx2] += 0.5

        # Also hash bigrams for phrase matching
        for i in range(len(tokens) - 1):
            bigram = f"{tokens[i]}_{tokens[i+1]}"
            bh = int(hashlib.md5(bigram.encode('utf-8')).hexdigest()[:8], 16)
            b_idx = bh % dim
            vec[b_idx] += 1.2

        # L2 Normalize
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [x / norm for x in vec]

        self._cache[key] = vec
        return vec
