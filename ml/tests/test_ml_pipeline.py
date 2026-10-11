"""
Automated Pytest Suite for TripShield Machine Learning Big Data Pipeline.
"""

from pathlib import Path
import pytest
import pandas as pd
import joblib

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "ml" / "data"
MODEL_PATH = PROJECT_ROOT / "ml" / "models" / "disruption_classifier.joblib"
METRICS_PATH = PROJECT_ROOT / "ml" / "models" / "metrics.json"

import sys
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ml.infer import predict, load_classifier


def test_data_generation_integrity():
    train_path = DATA_DIR / "train.csv"
    test_path = DATA_DIR / "test.csv"

    assert train_path.exists(), "train.csv must exist"
    assert test_path.exists(), "test.csv must exist"

    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)

    assert len(train_df) >= 10000, f"Expected >= 10,000 train rows, got {len(train_df)}"
    assert len(test_df) >= 2000, f"Expected >= 2,000 test rows, got {len(test_df)}"

    expected_cols = {"text", "category", "station_code", "airline"}
    assert expected_cols.issubset(set(train_df.columns))
    assert expected_cols.issubset(set(test_df.columns))

    # Ensure no nulls
    assert train_df["text"].isnull().sum() == 0
    assert train_df["category"].isnull().sum() == 0


def test_model_artifact_loading():
    assert MODEL_PATH.exists(), f"Model file must exist at {MODEL_PATH}"
    model = load_classifier()
    assert hasattr(model, "predict"), "Model must have predict method"
    assert hasattr(model, "predict_proba"), "Model must have predict_proba method"
    assert len(model.classes_) == 5, f"Expected 5 classes, got {len(model.classes_)}"


def test_trained_metrics_exceed_95_percent():
    import json
    assert METRICS_PATH.exists(), f"Metrics JSON must exist at {METRICS_PATH}"
    with open(METRICS_PATH, "r", encoding="utf-8") as f:
        metrics = json.load(f)

    prod = metrics.get("production", {})
    assert "accuracy" in prod, "Metrics must include accuracy"
    assert "macroF1" in prod, "Metrics must include macroF1"

    assert prod["accuracy"] >= 0.95, f"Expected accuracy >= 0.95, got {prod['accuracy']}"
    assert prod["macroF1"] >= 0.95, f"Expected macroF1 >= 0.95, got {prod['macroF1']}"


def test_inference_predictions_and_calibration():
    model = load_classifier()

    # Test distinct cases
    runway_res = predict("DGCA NOTAM A1492/26: Primary runway 09/27 at Mumbai BOM closed for emergency resurfacing", model)
    assert runway_res["predicted_category"] == "Runway / ATC NOTAM Closure"
    assert runway_res["confidence"] >= 50.0

    strike_res = predict("Ground handling staff and fuel tanker operators flash walkout at Delhi T3 ramp", model)
    assert strike_res["predicted_category"] == "Labour Stoppage / Ground Strike"
    assert strike_res["confidence"] >= 50.0

    facility_res = predict("Municipal Fire & Safety inspection notice served on The Leela Palace heritage wing", model)
    assert facility_res["predicted_category"] == "Facility / Structural Safety Order"
    assert facility_res["confidence"] >= 50.0

    # Probability distribution sum check (~100%)
    prob_sum = sum(runway_res["distribution"].values())
    assert abs(prob_sum - 100.0) < 0.5
