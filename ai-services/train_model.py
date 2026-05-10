from pathlib import Path
import json
import pickle

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder


ROOT_DIR = Path(__file__).resolve().parent
DATASET_PATH = ROOT_DIR.parent / "Final_Augmented_dataset_Diseases_and_Symptoms.csv"
MODELS_DIR = ROOT_DIR / "models"


def main() -> None:
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {DATASET_PATH}")

    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(DATASET_PATH)
    if "diseases" not in df.columns:
        raise ValueError("Dataset must include a 'diseases' target column.")

    y_raw = df["diseases"].astype(str).str.strip()
    X = df.drop(columns=["diseases"]).fillna(0)
    X = X.apply(pd.to_numeric, errors="coerce").fillna(0).astype("uint8")

    symptom_names = [str(c).strip().replace(" ", "_") for c in X.columns]
    X.columns = symptom_names

    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(y_raw)

    class_counts = pd.Series(y).value_counts()
    use_stratify = bool((class_counts >= 2).all())
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y if use_stratify else None,
    )

    eval_model = RandomForestClassifier(
        n_estimators=120,
        max_depth=28,
        min_samples_split=3,
        random_state=42,
        class_weight="balanced_subsample",
        n_jobs=1,
    )
    eval_model.fit(X_train, y_train)

    y_pred = eval_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"Validation accuracy: {accuracy * 100:.2f}%")
    print(classification_report(y_test, y_pred, zero_division=0))

    final_model = RandomForestClassifier(
        n_estimators=120,
        max_depth=28,
        min_samples_split=3,
        random_state=42,
        class_weight="balanced_subsample",
        n_jobs=1,
    )
    final_model.fit(X, y)

    with open(MODELS_DIR / "disease_model.pkl", "wb") as f:
        pickle.dump(final_model, f)

    with open(MODELS_DIR / "label_encoder.pkl", "wb") as f:
        pickle.dump(label_encoder, f)

    with open(MODELS_DIR / "symptoms_list.json", "w", encoding="utf-8") as f:
        json.dump(symptom_names, f, ensure_ascii=True, indent=2)

    print("Saved model artifacts in ai-services/models/")


if __name__ == "__main__":
    main()
