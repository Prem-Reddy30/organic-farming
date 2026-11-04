import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file if present
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Gemini API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

# Embedding Configuration: 'sentence-transformers', 'gemini', or 'local'
EMBEDDING_PROVIDER = os.getenv("EMBEDDING_PROVIDER", "sentence-transformers")
SENTENCE_TRANSFORMER_MODEL = os.getenv("SENTENCE_TRANSFORMER_MODEL", "all-MiniLM-L6-v2")

# Vector Database Configuration
VECTOR_DB_TYPE = os.getenv("VECTOR_DB_TYPE", "chromadb")  # 'chromadb', 'faiss', or 'json'
VECTOR_DB_PATH = str(DATA_DIR / "vector_db")

# Supabase (Optional for cloud sync)
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# Admin Authentication Secret
ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY", "organic-admin-kisan-2026")

# Server settings
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("DEBUG", "true").lower() == "true"
