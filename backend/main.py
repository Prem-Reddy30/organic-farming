import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.config import HOST, PORT, DEBUG
from backend.routes.chat import router as chat_router
from backend.routes.ingest import router as ingest_router
from backend.routes.crops import router as crops_router
from backend.routes.fertilizers import router as fertilizers_router
from backend.routes.pests import router as pests_router
from backend.routes.evaluation import router as eval_router

app = FastAPI(
    title="Organic Farming Guide - RAG-Based AI Assistant",
    description="Retrieval-Augmented Generation (RAG) system for Indian Farmers, Agronomists, and Students.",
    version="1.0.0"
)

# Enable CORS for frontend applications (Vite dev server, Vercel, localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all route modules
app.include_router(chat_router)
app.include_router(ingest_router)
app.include_router(crops_router)
app.include_router(fertilizers_router)
app.include_router(pests_router)
app.include_router(eval_router)

@app.get("/")
def root():
    return {
        "project": "Organic Farming Guide – RAG-Based AI Assistant",
        "status": "Operational",
        "documentation": "/docs",
        "endpoints": {
            "chat": "/api/chat",
            "chat_history": "/api/chat/history",
            "sources": "/api/sources",
            "ingest_upload": "/api/ingest/upload",
            "ingest_url": "/api/ingest/url",
            "crops": "/api/crops",
            "crop_guide": "/api/crop-guide/{crop}",
            "fertilizers": "/api/fertilizers",
            "pests": "/api/pests",
            "diagnose": "/api/pests/diagnose",
            "evaluation": "/api/evaluation/run",
            "admin_status": "/api/admin/ingestion-status"
        }
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "kisan-organic-rag-backend",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=DEBUG)
