"""
NLP Pipeline for symptom extraction.
Uses spaCy for NER + custom symptom matching against a medical vocabulary.
"""
import re
import logging
from typing import List, Dict, Tuple

logger = logging.getLogger(__name__)

# Curated symptom vocabulary (expandable via dataset)
SYMPTOM_VOCABULARY = [
    "headache", "fever", "cough", "fatigue", "shortness of breath", "chest pain",
    "nausea", "vomiting", "diarrhea", "abdominal pain", "back pain", "joint pain",
    "muscle aches", "sore throat", "runny nose", "congestion", "sneezing",
    "dizziness", "blurred vision", "rash", "itching", "swelling", "weight loss",
    "weight gain", "loss of appetite", "excessive thirst", "frequent urination",
    "insomnia", "anxiety", "depression", "palpitations", "numbness", "tingling",
    "memory loss", "confusion", "difficulty swallowing", "hoarseness",
    "night sweats", "chills", "yellowing of skin", "dark urine", "pale stool",
]

SEVERITY_PATTERNS = {
    "severe": r"\b(severe|intense|extreme|excruciating|unbearable|worst)\b",
    "moderate": r"\b(moderate|significant|considerable|noticeable|bothersome)\b",
    "mild": r"\b(mild|slight|minor|little|bit|somewhat)\b",
}

DURATION_PATTERN = r"\b(\d+)\s*(day|days|week|weeks|month|months|hour|hours)\b"

class NLPPipeline:
    def __init__(self):
        self._symptoms = sorted(SYMPTOM_VOCABULARY, key=len, reverse=True)  # longer first for greedy match
        logger.info(f"NLPPipeline initialized with {len(self._symptoms)} symptom terms")

    def extract_symptoms(self, text: str) -> List[str]:
        """Extract recognized symptoms from free text."""
        text_lower = text.lower()
        found = []
        for symptom in self._symptoms:
            pattern = r"\b" + re.escape(symptom) + r"\b"
            if re.search(pattern, text_lower):
                found.append(symptom)
        # Deduplicate preserving order
        seen = set()
        return [s for s in found if not (s in seen or seen.add(s))]

    def detect_severity(self, text: str) -> str:
        text_lower = text.lower()
        for level, pattern in SEVERITY_PATTERNS.items():
            if re.search(pattern, text_lower):
                return level
        return "moderate"  # default

    def extract_duration(self, text: str) -> str | None:
        match = re.search(DURATION_PATTERN, text.lower())
        if match:
            return f"{match.group(1)} {match.group(2)}"
        return None

    def analyze(self, text: str) -> Dict:
        symptoms = self.extract_symptoms(text)
        severity = self.detect_severity(text)
        duration = self.extract_duration(text)
        return {
            "extracted_symptoms": symptoms,
            "symptom_count": len(symptoms),
            "severity": severity,
            "duration": duration,
            "has_emergency_keywords": self._check_emergency(text),
        }

    def _check_emergency(self, text: str) -> bool:
        emergency_terms = ["chest pain", "can't breathe", "cannot breathe", "loss of consciousness",
                           "stroke", "heart attack", "suicide", "overdose", "severe bleeding"]
        text_lower = text.lower()
        return any(term in text_lower for term in emergency_terms)
