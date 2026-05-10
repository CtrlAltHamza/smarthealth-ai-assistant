import main


def test_model_metadata_shape() -> None:
    metadata = main.model_metadata()
    assert metadata["dataset"] == "Final_Augmented_dataset_Diseases_and_Symptoms.csv"
    assert metadata["feature_count"] > 0
    assert metadata["class_count"] > 0


def test_analyze_symptoms_returns_follow_up_questions() -> None:
    request = main.SymptomRequest(text="I have fever and cough with chest pain")
    result = main.analyze_symptoms(request)
    assert "follow_up_questions" in result
    assert len(result["follow_up_questions"]) >= 1


def test_predict_disease_returns_specialist() -> None:
    request = main.PredictionRequest(symptoms=["fever", "cough"])
    result = main.predict_disease(request)
    assert "recommended_specialist" in result
    assert isinstance(result["predictions"], list)
