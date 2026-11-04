# KisanJaivik AI — Organic Farming Guide & RAG Assistant

A full-stack, production-grade AI-powered Organic Farming Guide engineered specifically for Indian farmers, students, agricultural researchers, and extension specialists. 

The core feature is a **grounded Retrieval-Augmented Generation (RAG) pipeline** that retrieves verified agronomic documentation from premier Indian institutions (**ICAR, NCOF Ghaziabad, CRIDA, CICR, IIHR, IIRR, TNAU, and PJTSAU**) before synthesizing recommendations. The assistant prevents hallucinations in pesticide dosages, chemical treatments, and fake government schemes by strictly grounding answers in verified agricultural documents.

---

## 🌟 Key Application Features

1. **AI Farming Chatbot (`/chat`)**:
   - Conversational RAG interface with multilingual query support (**English, తెలుగు - Telugu, हिन्दी - Hindi**).
   - Voice Input (Web Speech API) and Text-to-Speech audio reader for rural accessibility.
   - Grounded responses with **Source Citations** (Document Title, Publishing Institute, Page Number, and Relevance Score) rendered under every answer.
   - Crop, Topic, and State/Region metadata filter drawer.
   - Dynamic suggested follow-up questions.

2. **Crop-Specific Farming Guide (`/crops`)**:
   - Interactive parameters: Crop name, State / District, Soil type, Season (Kharif, Rabi, Zaid).
   - Comprehensive **9-stage organic package of practices**:
     1. Land Preparation & Soil Amending
     2. Seed Selection & Bio-Treatment (Bijamrutham / Trichoderma)
     3. Sowing & Ideal Spacing Geometry
     4. Organic Nutrient Management (Basal, Tillering, Panicle initiation)
     5. Irrigation Protocol & Alternate Wetting and Drying (AWD)
     6. Ecological Weed Management & Organic Straw Mulching
     7. Integrated Pest & Disease Prevention
     8. Maturity Indices & Harvesting
     9. Post-Harvest Handling & Hermetic Organic Storage
   - Printable / PDF export summary for offline field reference.

3. **Standardized Organic Fertilizer Guide (`/fertilizers`)**:
   - Detailed step-by-step preparation recipes, ingredients per acre, microbial active shelf life, and precautions for:
     - **Jeevamrutham** (Liquid bio-enhancer: Desi cow dung, urine, jaggery, besan, living soil)
     - **Panchagavya** (5 sacred cow products: dung, ghee, milk, curd, urine, coconut water, bananas)
     - **Vermicompost** (*Eisenia fetida* earthworm beds, pre-decomposition, 3 mm sifting)
     - **Farmyard Manure (FYM)** (Aerobic compost pit methods)
     - **Green Manuring** (Dhaincha *Sesbania aculeata* & Sunnhemp *Crotalaria juncea*)
     - **Biofertilizers** (*Rhizobium*, *Azospirillum*, *Azotobacter*, Phosphate Solubilizing Bacteria - PSB, Potash Mobilizer - KMB)
     - **Neem-Based Inputs** (Neem Astra, Neem Seed Kernel Extract - NSKE 5%, Cold-pressed Neem Oil 1500 ppm).

4. **Integrated Pest & Disease Management (`/pests`)**:
   - Interactive Diagnostic Assistant: select crop, input observed leaf/stem symptoms, or attach photos.
   - Biological controls (*Trichogramma chilonis* egg parasitoids, *Chrysoperla carnea* green lacewings, *Beauveria bassiana*, *HaNPV*).
   - Pheromone traps (Gossyplure, Helilure) and yellow sticky trap thresholds.
   - Explicit uncertainty scoring and emergency referral to local **Krishi Vigyan Kendra (KVK)**.

5. **Verified Knowledge Directory (`/sources`)**:
   - Searchable repository of all indexed manuals, research circulars, and university packages with chunk counts and original URLs.

6. **Admin Ingestion Hub (`/admin`)**:
   - Role-protected document ingestion dashboard (`X-Admin-Key` or Bearer token).
   - Ingest agricultural PDFs, DOCX files, TXT manuals, or live research URLs.
   - Real-time ingestion queue, chunk counts, vector database stats, and document deletion.

7. **RAG Evaluation Suite (`/eval`)**:
   - Benchmark testing across 30 verified Indian organic farming test cases.
   - Evaluates: **Retrieval Precision**, **Context Coverage**, **Answer Faithfulness**, **Citation Correctness**, and **Unsupported-Answer Detection**.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 6, TypeScript, Tailwind CSS, Lucide React icons.
- **Backend**: Python 3.13, FastAPI, Uvicorn, Pydantic v2.
- **RAG & NLP Orchestration**:
  - **Vector Database**: ChromaDB (with local persistent disk fallback).
  - **Embeddings**: `sentence-transformers` (`all-MiniLM-L6-v2`) or Google Gemini embeddings (`text-embedding-004`).
  - **LLM**: Google Gemini API (`gemini-1.5-flash`, `gemini-2.0-flash`, or configurable model).
  - **Document Loaders**: PyPDF, Python-Docx, UTF-8 text loader, and Web URL crawler.
  - **Text Chunking**: `RecursiveCharacterTextSplitter` (750 chunk size, 120 chunk overlap).
  - **Database & Sync**: Supabase PostgreSQL + `pgvector` extension schema provided.

---

## 📂 Project Architecture

```
calls/
├── backend/
│   ├── main.py                  # FastAPI server & route orchestration
│   ├── config.py                # Environment and model settings
│   ├── rag/
│   │   ├── document_loaders.py  # PDF, DOCX, TXT & Web URL text extractors
│   │   ├── text_splitter.py     # Recursive Character Text Splitter
│   │   ├── embeddings.py        # SentenceTransformers / Gemini embeddings
│   │   ├── vector_store.py      # ChromaDB & persistent vector database
│   │   ├── rag_engine.py        # Strict System Prompt, Retrieval, LLM & Citations
│   │   └── seed_data.py         # Pre-indexed ICAR / NCOF / KVK manuals
│   ├── routes/
│   │   ├── chat.py              # POST /api/chat, GET /api/chat/history
│   │   ├── ingest.py            # POST /api/ingest/upload, /api/ingest/url, /api/sources
│   │   ├── crops.py             # GET /api/crops, /api/crop-guide/{crop}
│   │   ├── fertilizers.py       # GET /api/fertilizers, /api/fertilizers/{slug}
│   │   ├── pests.py             # GET /api/pests, POST /api/pests/diagnose
│   │   └── evaluation.py        # GET /api/evaluation/run
│   └── evaluation/
│       ├── test_dataset.py      # 30 benchmark test questions
│       └── evaluator.py         # Automated precision & faithfulness runner
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Multilingual nav & language switcher
│   │   ├── Home.tsx             # 5 Dashboard cards & verified source badges
│   │   ├── ChatView.tsx         # Voice-enabled chat with source citations
│   │   ├── CropGuideView.tsx    # 9-stage agronomic planner & printable PDF
│   │   ├── FertilizerGuideView.tsx # Step-by-step bio-input recipes
│   │   ├── PestManagementView.tsx  # Symptom & photo diagnostic doctor
│   │   ├── KnowledgeSourcesView.tsx # Verified document library
│   │   ├── AdminDashboard.tsx   # Document uploader & ingestion queue
│   │   ├── EvaluationDashboard.tsx # Interactive RAG benchmark UI
│   │   └── AuthModal.tsx        # Farmer profile & language selection
│   ├── services/
│   │   └── api.ts               # Frontend API client
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── App.tsx                  # Root component
│   └── main.tsx                 # Entry point
├── database_schema.sql          # Supabase PostgreSQL + pgvector schema
├── requirements.txt             # Python backend dependencies
├── package.json                 # Frontend dependencies
└── .env.example                 # Configuration template
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
1. Open a terminal in the project root:
   ```bash
   pip install -r requirements.txt
   ```
2. Configure `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   *(Optional)* Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   ```
   *(Note: The system includes a verified knowledge synthesis engine that runs 100% offline even if no API key is set!)*
3. Start the FastAPI server:
   ```bash
   python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   Verify backend at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
1. In another terminal:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 📊 RAG Benchmark Evaluation (30 Test Inquiries)

The application includes an automated evaluation benchmark runner testing 30 real-world organic farming questions:
- *How to prepare vermicompost?*
- *Organic pest management for cotton?*
- *How to manage fungal diseases in tomatoes?*
- *Organic nutrient management for paddy?*
- *How to improve soil health naturally?*
- *జీవామృతం ఎలా తయారు చేయాలి? (Telugu)*
- *केंचुआ खाद कैसे बनाएं? (Hindi)*
- ...and 23 more.

To run the evaluation:
- Navigate to the **RAG Benchmark** tab in the web UI, OR
- Make an API call to: `GET http://127.0.0.1:8000/api/evaluation/run`

---

## 🗄️ Database & Cloud Deployment

### Supabase / PostgreSQL (Production)
Run the script `database_schema.sql` in the Supabase SQL Editor to initialize:
- `agricultural_documents`
- `document_chunks` with `vector(384)` and HNSW index
- `chat_sessions` & `chat_messages`
- Stored procedure `match_agricultural_chunks`

### Deployment
- **Frontend**: Deploy to **Vercel** (`npm run build`, output directory: `dist`).
- **Backend**: Deploy to **Render** or **Railway** (`uvicorn backend.main:app --host 0.0.0.0 --port $PORT`).
