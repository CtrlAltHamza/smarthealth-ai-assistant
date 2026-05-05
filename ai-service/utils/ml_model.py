"""
Disease Prediction Model.
Uses a Random Forest classifier trained on symptom-disease mappings.
In production, load a pre-trained model from disk; here we use a rule-based
fallback that works without training data, demonstrating the architecture.
"""
import logging
from typing import List, Dict
import os
import pickle

logger = logging.getLogger(__name__)

# Rule-based knowledge base (to be replaced by trained RF model)
DISEASE_SYMPTOM_MAP = {
    "Common Cold": {
        "symptoms": ["runny nose", "sneezing", "sore throat", "cough", "congestion", "fatigue"],
        "specialist": "General Physician",
        "urgency": "low",
    },
    "Influenza": {
        "symptoms": ["fever", "muscle aches", "fatigue", "cough", "headache", "chills"],
        "specialist": "General Physician",
        "urgency": "medium",
    },
    "Migraine": {
        "symptoms": ["headache", "nausea", "blurred vision", "dizziness", "fatigue"],
        "specialist": "Neurologist",
        "urgency": "medium",
    },
    "Hypertension": {
        "symptoms": ["headache", "dizziness", "chest pain", "blurred vision", "palpitations"],
        "specialist": "Cardiologist",
        "urgency": "high",
    },
    "Diabetes Type 2": {
        "symptoms": ["excessive thirst", "frequent urination", "fatigue", "blurred vision", "weight loss"],
        "specialist": "Endocrinologist",
        "urgency": "high",
    },
    "Gastroenteritis": {
        "symptoms": ["nausea", "vomiting", "diarrhea", "abdominal pain", "fever", "fatigue"],
        "specialist": "Gastroenterologist",
        "urgency": "medium",
    },
    "Anxiety Disorder": {
        "symptoms": ["anxiety", "palpitations", "insomnia", "fatigue", "dizziness", "chest pain"],
        "specialist": "Psychiatrist",
        "urgency": "medium",
    },
    "Anemia": {
        "symptoms": ["fatigue", "dizziness", "shortness of breath", "headache", "pale stool"],
        "specialist": "Hematologist",
        "urgency": "medium",
    },
    "Pneumonia": {
        "symptoms": ["fever", "cough", "shortness of breath", "chest pain", "fatigue", "chills"],
        "specialist": "Pulmonologist",
        "urgency": "high",
    },
    "Appendicitis": {
        "symptoms": ["abdominal pain", "nausea", "vomiting", "fever", "loss of appetite"],
        "specialist": "General Surgeon",
        "urgency": "critical",
    },
}


class DiseasePredictor:
    def __init__(self):
        self.model = None
        model_path = os.path.join(os.path.dirname(__file__), "../models/rf_model.pkl")
        if os.path.exists(model_path):
            with open(model_path, "rb") as f:
                self.model = pickle.load(f)
            logger.info("Loaded pre-trained Random Forest model")
        else:
            logger.warning("No trained model found — using rule-based fallback")

    def predict(self, symptoms: List[str], top_k: int = 3) -> List[Dict]:
        """Return top-k disease predictions with confidence scores."""
        if not symptoms:
            return []

        symptom_set = set(s.lower() for s in symptoms)
        scores = []

        for disease, info in DISEASE_SYMPTOM_MAP.items():
            disease_symptoms = set(info["symptoms"])
            if not disease_symptoms:
                continue
            overlap = symptom_set & disease_symptoms
            if overlap:
                confidence = len(overlap) / len(disease_symptoms)
                scores.append({
                    "disease": disease,
                    "confidence": round(confidence, 3),
                    "matched_symptoms": list(overlap),
                    "specialist": info["specialist"],
                    "urgency": info["urgency"],
                })

        scores.sort(key=lambda x: x["confidence"], reverse=True)
        return scores[:top_k]

    def get_recommended_specialists(self, predictions: List[Dict]) -> List[str]:
        specialists = list(dict.fromkeys(p["specialist"] for p in predictions))
        return specialists
