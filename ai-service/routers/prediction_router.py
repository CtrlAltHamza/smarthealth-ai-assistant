from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import List

router = APIRouter()

class PredictionInput(BaseModel):
    symptoms: List[str]
    top_k: int = 3

@router.post("/disease")
async def predict_disease(body: PredictionInput, request: Request):
    predictor = request.app.state.predictor
    predictions = predictor.predict(body.symptoms, top_k=body.top_k)
    specialists = predictor.get_recommended_specialists(predictions)
    return {
        "success": True,
        "data": {
            "predictions": predictions,
            "recommended_specialists": specialists,
            "model_version": "1.0.0-rule-based",
        },
    }
