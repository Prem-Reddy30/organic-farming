from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
import datetime
from backend.rag.rag_engine import RAGEngine

router = APIRouter(prefix="/api/chat", tags=["AI Farming Chatbot"])

# Global or dependency-injected engine
rag_engine = RAGEngine()

# In-memory session store (can sync with Supabase or SQLite)
CHAT_HISTORY: Dict[str, List[Dict[str, Any]]] = {}

class ChatRequest(BaseModel):
    query: str = Field(..., description="The farmer's question")
    session_id: Optional[str] = Field(default=None, description="Session ID for conversation history")
    crop_filter: Optional[str] = Field(default=None, description="Optional crop filter, e.g. 'Paddy', 'Cotton', 'Tomato'")
    topic_filter: Optional[str] = Field(default=None, description="Optional topic filter, e.g. 'Pest', 'Nutrient', 'Soil'")
    region_filter: Optional[str] = Field(default=None, description="Optional state/region filter")
    language_override: Optional[str] = Field(default=None, description="'en', 'te', or 'hi'")

class ChatMessageSave(BaseModel):
    session_id: str
    role: str
    content: str
    sources: Optional[List[Dict[str, Any]]] = None

@router.post("")
def chat_endpoint(payload: ChatRequest):
    """
    Main RAG Chatbot endpoint.
    Retrieves grounded agricultural knowledge from verified sources and generates answers.
    """
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    session_id = payload.session_id or str(uuid.uuid4())
    history = CHAT_HISTORY.get(session_id, [])

    result = rag_engine.generate_answer(
        query=payload.query.strip(),
        chat_history=history,
        crop_filter=payload.crop_filter,
        topic_filter=payload.topic_filter,
        region_filter=payload.region_filter,
        language_override=payload.language_override
    )

    # Save to history
    user_turn = {
        "id": str(uuid.uuid4()),
        "role": "user",
        "content": payload.query,
        "timestamp": datetime.datetime.now().isoformat()
    }
    ai_turn = {
        "id": str(uuid.uuid4()),
        "role": "assistant",
        "content": result["answer"],
        "sources": result["sources"],
        "language": result["language"],
        "used_llm": result["used_llm"],
        "suggested_questions": result["suggested_questions"],
        "timestamp": datetime.datetime.now().isoformat()
    }

    if session_id not in CHAT_HISTORY:
        CHAT_HISTORY[session_id] = []
    CHAT_HISTORY[session_id].extend([user_turn, ai_turn])

    return {
        "session_id": session_id,
        "query": payload.query,
        "answer": result["answer"],
        "language": result["language"],
        "sources": result["sources"],
        "retrieved_count": result["retrieved_count"],
        "used_llm": result["used_llm"],
        "suggested_questions": result["suggested_questions"]
    }

@router.get("/history")
def get_chat_history(session_id: Optional[str] = None):
    """Retrieve history for a session or list of active sessions."""
    if session_id:
        return {"session_id": session_id, "messages": CHAT_HISTORY.get(session_id, [])}
    
    # Return summary of all sessions
    summaries = []
    for s_id, msgs in CHAT_HISTORY.items():
        if msgs:
            first_user_msg = next((m["content"] for m in msgs if m["role"] == "user"), "New Conversation")
            summaries.append({
                "session_id": s_id,
                "title": first_user_msg[:60] + ("..." if len(first_user_msg) > 60 else ""),
                "message_count": len(msgs),
                "last_active": msgs[-1].get("timestamp")
            })
    return {"sessions": summaries}
