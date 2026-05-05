from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import logging

from routers import symptom_router, prediction_router, health_router
from utils.nlp_pipeline import NLPPipeline
from utils.ml_model import DiseasePredictor

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SmartHealth AI Service",
    description="NLP & ML microservice for symptom analysis and disease prediction",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://backend:5000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Startup: load models ─────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    logger.info("Loading NLP pipeline and ML models...")
    app.state.nlp = NLPPipeline()
    app.state.predictor = DiseasePredictor()
    logger.info("AI service ready")

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(health_router.router, prefix="/health", tags=["Health"])
app.include_router(symptom_router.router, prefix="/symptoms", tags=["Symptoms"])
app.include_router(prediction_router.router, prefix="/predict", tags=["Predictions"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
