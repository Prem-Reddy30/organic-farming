from fastapi import APIRouter, Query
from typing import Optional
from backend.evaluation.evaluator import RAGEvaluator
from backend.routes.chat import rag_engine

router = APIRouter(prefix="/api/evaluation", tags=["RAG Evaluation & Benchmarks"])

evaluator = RAGEvaluator(engine=rag_engine)

# Cache last evaluation run
CACHED_REPORT = None

@router.get("/run")
def run_evaluation(limit: Optional[int] = Query(30, ge=5, le=30)):
    """
    Run RAG evaluation across benchmark questions and return precision,
    faithfulness, relevance, and citation accuracy metrics.
    """
    global CACHED_REPORT
    report = evaluator.evaluate_benchmark(sample_limit=limit)
    CACHED_REPORT = report
    return report

@router.get("/last-report")
def get_last_report():
    """Retrieve the most recent evaluation report or generate if not run yet."""
    global CACHED_REPORT
    if not CACHED_REPORT:
        CACHED_REPORT = evaluator.evaluate_benchmark(sample_limit=30)
    return CACHED_REPORT
