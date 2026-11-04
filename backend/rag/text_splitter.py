from typing import List, Dict, Any

class RecursiveCharacterTextSplitter:
    """
    Splits text recursively by looking at characters in order:
    ["\n\n", "\n", ". ", " ", ""]
    """
    def __init__(
        self,
        chunk_size: int = 800,
        chunk_overlap: int = 150,
        separators: List[str] = None
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = separators or ["\n\n", "\n", ". ", " ", ""]

    def split_text(self, text: str) -> List[str]:
        if not text:
            return []
        return self._split(text, self.separators)

    def _split(self, text: str, separators: List[str]) -> List[str]:
        final_chunks: List[str] = []
        separator = separators[-1]
        new_separators = []

        for i, sep in enumerate(separators):
            if sep == "":
                separator = ""
                break
            if sep in text:
                separator = sep
                new_separators = separators[i + 1:]
                break

        splits = text.split(separator) if separator != "" else list(text)

        good_splits: List[str] = []
        for s in splits:
            if not s:
                continue
            if len(s) < self.chunk_size:
                good_splits.append(s)
            else:
                if new_separators:
                    sub_chunks = self._split(s, new_separators)
                    good_splits.extend(sub_chunks)
                else:
                    # Break into fixed size
                    for idx in range(0, len(s), self.chunk_size - self.chunk_overlap):
                        good_splits.append(s[idx:idx + self.chunk_size])

        # Merge splits into chunks with chunk_overlap
        current_chunk: List[str] = []
        current_len = 0

        for s in good_splits:
            add_len = len(s) + (len(separator) if current_chunk else 0)
            if current_len + add_len > self.chunk_size and current_chunk:
                merged = separator.join(current_chunk)
                final_chunks.append(merged)
                
                # Keep overlap from previous parts
                while current_chunk and current_len > self.chunk_overlap:
                    removed = current_chunk.pop(0)
                    current_len -= len(removed) + (len(separator) if current_chunk else 0)

            current_chunk.append(s)
            current_len += len(s) + (len(separator) if len(current_chunk) > 1 else 0)

        if current_chunk:
            final_chunks.append(separator.join(current_chunk))

        return [c.strip() for c in final_chunks if c.strip()]

    def create_documents(self, texts: List[str], metadatas: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        docs = []
        for i, text in enumerate(texts):
            meta = metadatas[i] if metadatas and i < len(metadatas) else {}
            chunks = self.split_text(text)
            for chunk_idx, chunk in enumerate(chunks):
                chunk_meta = dict(meta)
                chunk_meta["chunk_index"] = chunk_idx
                chunk_meta["total_chunks"] = len(chunks)
                docs.append({
                    "content": chunk,
                    "metadata": chunk_meta
                })
        return docs
