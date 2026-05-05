from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class SymptomInput(BaseModel):
    text: str
    patient_id: Optional[str] = None

@router.post("/analyze")
async def analyze_symptoms(body: SymptomInput, request: Request):
    nlp: "NLPPipeline" = request.app.state.nlp
    result = nlp.analyze(body.text)
    return {"success": True, "data": result}
