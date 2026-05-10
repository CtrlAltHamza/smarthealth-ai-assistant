from pathlib import Path
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spacy
import pickle
import json
import numpy as np
import pandas as pd
from typing import List

# ─── Init ────────────────────────────────────
app = FastAPI(title="SmartHealth AI Services API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load NLP model ──────────────────────────
nlp = spacy.load("en_core_web_sm")

# ─── Load ML models ──────────────────────────
BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"

with open(MODELS_DIR / "disease_model.pkl", "rb") as f:
    disease_model = pickle.load(f)
with open(MODELS_DIR / "label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)
with open(MODELS_DIR / "symptoms_list.json", encoding="utf-8") as f:
    SYMPTOMS = json.load(f)

MODEL_METADATA = {
    "dataset": "Final_Augmented_dataset_Diseases_and_Symptoms.csv",
    "trained_at_utc": datetime.fromtimestamp(
        (MODELS_DIR / "disease_model.pkl").stat().st_mtime, tz=timezone.utc
    ).isoformat(),
    "feature_count": len(SYMPTOMS),
    "class_count": len(getattr(disease_model, "classes_", [])),
    "model_type": type(disease_model).__name__,
}

# ─── Rich Disease Knowledge Base ─────────────
DISEASE_KNOWLEDGE: dict = {
    "Influenza": {
        "overview": "Influenza (the flu) is a contagious respiratory illness caused by influenza viruses. It can cause mild to severe illness, and at times can lead to hospitalization or death.",
        "causes": ["Influenza A or B viruses", "Airborne droplets from coughs or sneezes", "Touching contaminated surfaces then touching face"],
        "key_symptoms": ["High fever (100–104°F)", "Severe muscle aches", "Fatigue and weakness", "Dry cough", "Headache", "Chills and sweats"],
        "treatments": ["Rest and plenty of fluids", "Antiviral medications (e.g., Oseltamivir/Tamiflu) within 48 hrs", "OTC fever reducers (ibuprofen, acetaminophen)", "Avoid aspirin in children"],
        "prevention": ["Annual flu vaccine", "Frequent handwashing", "Avoid close contact with sick people", "Cover mouth when coughing"],
        "when_to_see_doctor": "If you have difficulty breathing, persistent chest pain, severe vomiting, or symptoms that improve then return with fever.",
        "specialist": "General Physician or Infectious Disease Specialist",
        "recovery_time": "1–2 weeks",
        "contagious": True,
    },
    "Common Cold": {
        "overview": "The common cold is a viral infection of your nose and throat. It's usually harmless, although it might not feel that way. Many types of viruses can cause a cold.",
        "causes": ["Rhinovirus (most common, >50% of colds)", "Coronavirus strains", "RSV and parainfluenza viruses", "Direct contact with infected person"],
        "key_symptoms": ["Runny or stuffy nose", "Sore throat", "Cough", "Mild body aches", "Low-grade fever", "Sneezing"],
        "treatments": ["Rest and hydration", "Saline nasal drops", "OTC decongestants and antihistamines", "Throat lozenges", "Honey and lemon tea"],
        "prevention": ["Frequent handwashing", "Avoid touching face", "Disinfect frequently touched surfaces"],
        "when_to_see_doctor": "If symptoms last more than 10 days, fever above 103°F, or you have difficulty breathing.",
        "specialist": "General Physician",
        "recovery_time": "7–10 days",
        "contagious": True,
    },
    "Pneumonia": {
        "overview": "Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm, fever, chills, and difficulty breathing.",
        "causes": ["Bacterial: Streptococcus pneumoniae (most common)", "Viral: Influenza, COVID-19, RSV", "Fungal infections (in immunocompromised)", "Aspiration of food or liquid"],
        "key_symptoms": ["Chest pain when breathing or coughing", "Confusion (older adults)", "Cough with phlegm", "Fatigue", "Fever, sweating, chills", "Shortness of breath"],
        "treatments": ["Antibiotics (for bacterial pneumonia)", "Antiviral medications (viral)", "Fever-reducing medications", "Cough medicine", "Hospitalization may be required"],
        "prevention": ["Pneumococcal vaccine", "Flu vaccine annually", "Good hygiene practices", "Quit smoking"],
        "when_to_see_doctor": "IMMEDIATELY if breathing is difficult, bluish lips/fingertips, chest pain, or high fever.",
        "specialist": "Pulmonologist or Infectious Disease Specialist",
        "recovery_time": "1–3 weeks (mild), up to 6 weeks (severe)",
        "contagious": True,
    },
    "Gastroenteritis": {
        "overview": "Gastroenteritis is inflammation of the stomach and intestines, typically resulting from a bacterial or viral infection. Also called 'stomach flu', it is not related to influenza.",
        "causes": ["Norovirus (most common)", "Rotavirus", "Bacterial: Salmonella, E. coli, Campylobacter", "Contaminated food or water"],
        "key_symptoms": ["Diarrhea", "Nausea and vomiting", "Stomach cramps", "Low-grade fever", "Headache", "Muscle aches"],
        "treatments": ["Oral rehydration (water, sports drinks, broth)", "BRAT diet (bananas, rice, applesauce, toast)", "Antiemetics (for vomiting)", "Probiotics", "Antibiotics only for bacterial causes"],
        "prevention": ["Frequent handwashing", "Proper food handling and storage", "Avoid sharing utensils with sick people", "Safe water practices"],
        "when_to_see_doctor": "If dehydration signs appear (dry mouth, sunken eyes, no urination), blood in stool, or high fever.",
        "specialist": "Gastroenterologist",
        "recovery_time": "1–3 days (viral), up to a week (bacterial)",
        "contagious": True,
    },
    "Malaria": {
        "overview": "Malaria is a life-threatening disease caused by Plasmodium parasites transmitted through the bite of an infected female Anopheles mosquito.",
        "causes": ["Plasmodium falciparum (most dangerous)", "Plasmodium vivax, ovale, malariae", "Bite from infected Anopheles mosquito", "Rare: blood transfusion, sharing needles"],
        "key_symptoms": ["Cyclic fever and chills", "Profuse sweating", "Headache", "Nausea and vomiting", "Muscle pain", "Fatigue", "Anemia"],
        "treatments": ["Artemisinin-based combination therapies (ACTs)", "Chloroquine (for non-resistant strains)", "Primaquine (to prevent relapse)", "Hospitalization for severe cases"],
        "prevention": ["Antimalarial prophylactic medications when traveling", "Insect repellent (DEET)", "Sleep under insecticide-treated mosquito nets", "Wear long sleeves at night"],
        "when_to_see_doctor": "IMMEDIATELY — malaria can become life-threatening within 24 hours if untreated.",
        "specialist": "Infectious Disease Specialist",
        "recovery_time": "1–4 weeks with proper treatment",
        "contagious": False,
    },
    "COVID-19": {
        "overview": "COVID-19 is a respiratory illness caused by the SARS-CoV-2 coronavirus. It ranges from mild illness to severe respiratory failure and can cause long-term symptoms (Long COVID).",
        "causes": ["SARS-CoV-2 virus", "Airborne transmission (coughs, sneezes, talking)", "Close contact with infected person", "Touching contaminated surfaces (less common)"],
        "key_symptoms": ["Fever or chills", "Dry cough", "Shortness of breath", "Fatigue", "Loss of taste or smell", "Sore throat", "Headache", "Muscle aches"],
        "treatments": ["Rest and hydration", "Antiviral drugs (Paxlovid, Remdesivir for high-risk)", "Fever reducers", "Pulse oximeter monitoring", "Isolation for at least 5 days"],
        "prevention": ["COVID-19 vaccination", "Wearing masks in crowded areas", "Social distancing", "Frequent handwashing", "Improve indoor ventilation"],
        "when_to_see_doctor": "If you have difficulty breathing, persistent chest pain, confusion, or bluish lips/face — call emergency services.",
        "specialist": "General Physician / Pulmonologist (severe cases)",
        "recovery_time": "1–2 weeks (mild), weeks to months (severe/Long COVID)",
        "contagious": True,
    },
    "Migraine": {
        "overview": "Migraine is a neurological condition characterized by recurring attacks of moderate-to-severe headache, often affecting one side of the head, accompanied by nausea and light sensitivity.",
        "causes": ["Genetic predisposition", "Hormonal changes (estrogen fluctuations)", "Stress and anxiety", "Sensory stimuli (bright lights, loud sounds)", "Sleep disruption", "Certain foods (aged cheese, caffeine, alcohol)"],
        "key_symptoms": ["Throbbing pain on one side of head", "Nausea and vomiting", "Sensitivity to light (photophobia)", "Sensitivity to sound (phonophobia)", "Visual aura (flashing lights, blind spots)", "Pain lasting 4–72 hours"],
        "treatments": ["Triptans (sumatriptan, rizatriptan) — most effective", "OTC pain relievers (ibuprofen, aspirin)", "Anti-nausea medications", "Dark, quiet room rest", "Cold or hot compress on head", "Preventive medications (topiramate, beta-blockers)"],
        "prevention": ["Identify and avoid personal triggers", "Maintain consistent sleep schedule", "Stay hydrated", "Regular exercise", "Stress management techniques"],
        "when_to_see_doctor": "If headache is sudden and severe ('thunderclap'), accompanied by fever, neck stiffness, vision loss, or neurological symptoms.",
        "specialist": "Neurologist",
        "recovery_time": "4–72 hours per attack",
        "contagious": False,
    },
    "Appendicitis": {
        "overview": "Appendicitis is inflammation of the appendix, a finger-like pouch attached to the large intestine. It causes severe abdominal pain and is a medical emergency requiring surgery.",
        "causes": ["Blockage in the lining of the appendix (stool, foreign bodies)", "Infection causing the appendix to swell", "Inflammatory bowel disease (rare)"],
        "key_symptoms": ["Sudden severe pain starting around navel, moving to lower right abdomen", "Pain worsens with movement or coughing", "Nausea and vomiting", "Fever", "Loss of appetite", "Abdominal bloating"],
        "treatments": ["Appendectomy (surgical removal) — standard treatment", "Laparoscopic or open surgery", "Antibiotics (for mild uncomplicated cases — controversial)", "Pain management pre-surgery"],
        "prevention": ["High-fiber diet may reduce risk", "No proven definitive prevention method"],
        "when_to_see_doctor": "⚠️ EMERGENCY — Go to ER immediately if you suspect appendicitis. A ruptured appendix is life-threatening.",
        "specialist": "General Surgeon / Emergency Medicine",
        "recovery_time": "1–3 weeks after surgery",
        "contagious": False,
    },
    "Urinary Tract Infection": {
        "overview": "A urinary tract infection (UTI) is an infection in any part of the urinary system — kidneys, ureters, bladder, or urethra. Most infections involve the lower urinary tract (bladder and urethra).",
        "causes": ["Bacteria (usually E. coli from gut entering urethra)", "Sexual activity", "Female anatomy (shorter urethra)", "Urinary catheters", "Weakened immune system", "Kidney stones"],
        "key_symptoms": ["Burning sensation when urinating", "Frequent, urgent need to urinate", "Cloudy, dark, or strong-smelling urine", "Pelvic pain (women)", "Blood in urine", "Fever (if infection reaches kidneys)"],
        "treatments": ["Antibiotics (trimethoprim, nitrofurantoin, ciprofloxacin)", "Complete the full course of antibiotics", "Drink plenty of water", "Avoid irritants (caffeine, alcohol, spicy food)", "Phenazopyridine for pain relief"],
        "prevention": ["Drink 6–8 glasses of water daily", "Urinate after sexual intercourse", "Wipe front to back (women)", "Avoid holding urine for long periods", "Cranberry products (limited evidence)"],
        "when_to_see_doctor": "If you have fever, back/side pain, shaking/chills, or symptoms don't improve after 2–3 days of antibiotics.",
        "specialist": "Urologist (recurrent cases) / General Physician",
        "recovery_time": "3–7 days with antibiotics",
        "contagious": False,
    },
    "Dengue Fever": {
        "overview": "Dengue fever is a mosquito-borne tropical disease caused by the dengue virus. Severe dengue (dengue hemorrhagic fever) can be fatal.",
        "causes": ["Dengue virus (4 serotypes: DENV-1 to DENV-4)", "Bite of Aedes aegypti or Aedes albopictus mosquito", "No direct human-to-human transmission"],
        "key_symptoms": ["High fever (104°F/40°C)", "Severe headache", "Pain behind the eyes", "Severe joint/muscle/bone pain ('breakbone fever')", "Rash", "Mild bleeding (nose, gums)", "Nausea and vomiting"],
        "treatments": ["No specific antiviral treatment", "Pain relievers with acetaminophen (NOT ibuprofen or aspirin)", "Plenty of fluids and bed rest", "Hospitalization for severe dengue", "Monitor platelet count closely"],
        "prevention": ["Eliminate mosquito breeding sites (standing water)", "Use mosquito repellent (DEET)", "Wear long sleeves and pants", "Dengue vaccine (Dengvaxia) for previously infected individuals"],
        "when_to_see_doctor": "IMMEDIATELY if severe abdominal pain, persistent vomiting, rapid breathing, bleeding, or fatigue occurs — these are warning signs of severe dengue.",
        "specialist": "Infectious Disease Specialist",
        "recovery_time": "1–2 weeks",
        "contagious": False,
    },
}


SPECIALIST_KEYWORDS = {
    "cardio": "Cardiologist",
    "heart": "Cardiologist",
    "lung": "Pulmonologist",
    "respir": "Pulmonologist",
    "pneumo": "Pulmonologist",
    "skin": "Dermatologist",
    "dermat": "Dermatologist",
    "kidney": "Nephrologist",
    "renal": "Nephrologist",
    "neuro": "Neurologist",
    "brain": "Neurologist",
    "migrain": "Neurologist",
    "psych": "Psychiatrist",
    "anxiety": "Psychiatrist",
    "depress": "Psychiatrist",
    "eye": "Ophthalmologist",
    "vision": "Ophthalmologist",
    "ear": "ENT Specialist",
    "nose": "ENT Specialist",
    "throat": "ENT Specialist",
    "gastro": "Gastroenterologist",
    "stomach": "Gastroenterologist",
    "liver": "Gastroenterologist",
    "diabet": "Endocrinologist",
    "thyroid": "Endocrinologist",
    "pregnan": "Gynecologist",
    "uter": "Gynecologist",
    "prostate": "Urologist",
    "urinar": "Urologist",
    "joint": "Orthopedic Specialist",
    "bone": "Orthopedic Specialist",
    "arthritis": "Orthopedic Specialist",
    "allerg": "Allergist",
    "append": "General Surgeon",
    "malaria": "Infectious Disease Specialist",
    "dengue": "Infectious Disease Specialist",
    "influ": "General Physician",
    "cold": "General Physician",
}

# ─── Schemas ─────────────────────────────────
class SymptomRequest(BaseModel):
    text: str

class PredictionRequest(BaseModel):
    symptoms: List[str]


def recommend_specialist(disease_name: str) -> str:
    lower_name = disease_name.lower()
    for keyword, specialist in SPECIALIST_KEYWORDS.items():
        if keyword in lower_name:
            return specialist
    return "General Physician"


def generate_follow_up_questions(text: str, matched_symptoms: List[str]) -> List[str]:
    lower_text = text.lower()
    questions: List[str] = []
    if "pain" in lower_text:
        questions.append("On a scale of 1-10, how severe is your pain?")
    if "fever" in lower_text:
        questions.append("How long have you had fever, and what is the highest temperature?")
    if "cough" in lower_text or "breath" in lower_text:
        questions.append("Are you experiencing chest pain or worsening shortness of breath?")
    if "headache" in lower_text or "migrain" in lower_text:
        questions.append("Is the headache on one side or both sides of your head?")
    if "stomach" in lower_text or "nausea" in lower_text or "vomit" in lower_text:
        questions.append("Have you consumed any potentially contaminated food or water recently?")
    if not questions and matched_symptoms:
        questions.append("How long have these symptoms been present?")
    if not questions:
        questions.append("Did these symptoms start suddenly or gradually?")
    questions.append("Do you have any pre-existing medical conditions or allergies?")
    return questions[:3]


def run_ml_prediction(matched_symptoms: List[str]) -> dict:
    """Run the ML model on a given list of symptom keys and return top predictions."""
    feature_vector = np.zeros(len(SYMPTOMS))
    for symptom in matched_symptoms:
        norm = symptom.replace(" ", "_")
        if norm in SYMPTOMS:
            feature_vector[SYMPTOMS.index(norm)] = 1

    if feature_vector.sum() == 0:
        return {"predictions": [], "recommended_specialist": "General Physician"}

    feature_df = pd.DataFrame([feature_vector], columns=SYMPTOMS)
    proba = disease_model.predict_proba(feature_df)[0]
    model_classes = disease_model.classes_
    class_names = label_encoder.inverse_transform(model_classes)

    ranked = sorted(
        [
            {"disease": class_names[i], "confidence": round(float(proba[i]) * 100, 1)}
            for i in range(len(model_classes))
        ],
        key=lambda x: x["confidence"],
        reverse=True,
    )
    top3 = [r for r in ranked if r["confidence"] > 0][:3]

    for item in top3:
        disease_name = item["disease"]
        knowledge = DISEASE_KNOWLEDGE.get(disease_name, {})
        item["specialist"] = knowledge.get("specialist", recommend_specialist(disease_name))
        item["overview"] = knowledge.get("overview", "Consult a doctor for an accurate diagnosis.")
        item["causes"] = knowledge.get("causes", [])
        item["key_symptoms"] = knowledge.get("key_symptoms", [])
        item["treatments"] = knowledge.get("treatments", [])
        item["prevention"] = knowledge.get("prevention", [])
        item["when_to_see_doctor"] = knowledge.get("when_to_see_doctor", "Consult a healthcare professional.")
        item["recovery_time"] = knowledge.get("recovery_time", "Varies")
        item["contagious"] = knowledge.get("contagious", False)

    specialist = top3[0]["specialist"] if top3 else "General Physician"
    return {"predictions": top3, "recommended_specialist": specialist}


# ─── Health ──────────────────────────────────
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "AI Services are running"}


@app.get("/model-metadata")
def model_metadata():
    return MODEL_METADATA


# ─── Symptom Analysis (NLP + ML) ─────────────
@app.post("/analyze-symptoms")
def analyze_symptoms(request: SymptomRequest):
    doc = nlp(request.text)

    # Extract noun phrases
    extracted_phrases = [chunk.text.strip() for chunk in doc.noun_chunks if chunk.text.strip()]
    
    # Also extract individual meaningful tokens
    extracted_tokens = [
        token.text for token in doc
        if not token.is_stop and not token.is_punct and token.pos_ in ("NOUN", "ADJ", "VERB")
    ]

    # Determine severity
    severity = "low"
    severe_keywords = ["severe", "extreme", "intense", "emergency", "unbearable", "bleeding", "acute", "sudden", "sharp"]
    medium_keywords = ["moderate", "mild", "some", "slight", "occasional"]
    if any(word in request.text.lower() for word in severe_keywords):
        severity = "high"
    elif any(word in request.text.lower() for word in medium_keywords):
        severity = "medium"
    elif "fever" in request.text.lower() or "pain" in request.text.lower():
        severity = "medium"

    # Match against known symptoms list
    matched_known_symptoms = [
        s for s in SYMPTOMS
        if s.replace("_", " ") in request.text.lower() or s in request.text.lower()
    ]

    # Run the ML prediction on matched symptoms
    ml_result = run_ml_prediction(matched_known_symptoms)

    follow_up = generate_follow_up_questions(request.text, matched_known_symptoms)

    return {
        "original_text": request.text,
        "extracted_symptoms": extracted_phrases,
        "extracted_tokens": extracted_tokens,
        "matched_known_symptoms": matched_known_symptoms,
        "severity": severity,
        "follow_up_questions": follow_up,
        "predictions": ml_result["predictions"],
        "recommended_specialist": ml_result["recommended_specialist"],
        "disclaimer": "This is an AI-based prediction tool, not a medical diagnosis. Always consult a qualified healthcare professional.",
    }


# ─── Disease Prediction (ML only) ────────────
@app.post("/predict-disease")
def predict_disease(request: PredictionRequest):
    result = run_ml_prediction(request.symptoms)
    return {
        "input_symptoms": request.symptoms,
        "predictions": result["predictions"],
        "recommended_specialist": result["recommended_specialist"],
        "disclaimer": "This is an AI-based prediction tool, not a medical diagnosis. Always consult a qualified healthcare professional.",
    }


# ─── Available Symptoms List ─────────────────
@app.get("/symptoms-list")
def get_symptoms_list():
    return {"symptoms": SYMPTOMS}
