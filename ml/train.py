"""
High-Accuracy Model Training Pipeline for TripShield Travel Disruption Classifier.

Trains:
1. Baseline Model: TF-IDF + Logistic Regression
2. Production Model: Dual Word/Char FeatureUnion + Multi-threaded LightGBM Classifier

Evaluates accuracy, macro precision, recall, F1, and produces the 5x5 confusion matrix.
Serializes trained pipeline to ml/models/disruption_classifier.joblib.
"""

import json
import os
from pathlib import Path
import time
import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
    classification_report
)
import lightgbm as lgb

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "ml" / "data"
MODELS_DIR = PROJECT_ROOT / "ml" / "models"


def load_data():
    train_path = DATA_DIR / "train.csv"
    test_path = DATA_DIR / "test.csv"
    if not train_path.exists() or not test_path.exists():
        raise FileNotFoundError(f"Missing data files. Run ml/data_generator.py first.")
    
    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)
    
    X_train, y_train = train_df["text"].values, train_df["category"].values
    X_test, y_test = test_df["text"].values, test_df["category"].values
    return X_train, y_train, X_test, y_test


def evaluate_model(name: str, pipeline, X_test, y_test, classes):
    t0 = time.time()
    y_pred = pipeline.predict(X_test)
    inference_dur = time.time() - t0
    latency_per_sample_ms = (inference_dur / len(X_test)) * 1000
    throughput = len(X_test) / max(inference_dur, 1e-4)

    acc = accuracy_score(y_test, y_pred)
    prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average="macro", zero_division=0)
    per_class_prec, per_class_rec, per_class_f1, support = precision_recall_fscore_support(
        y_test, y_pred, labels=classes, average=None, zero_division=0
    )
    cm = confusion_matrix(y_test, y_pred, labels=classes)

    class_metrics = []
    for idx, cls in enumerate(classes):
        class_metrics.append({
            "className": cls,
            "precision": float(round(per_class_prec[idx], 4)),
            "recall": float(round(per_class_rec[idx], 4)),
            "f1": float(round(per_class_f1[idx], 4)),
            "support": int(support[idx])
        })

    return {
        "modelName": name,
        "accuracy": float(round(acc, 4)),
        "macroPrecision": float(round(prec, 4)),
        "macroRecall": float(round(rec, 4)),
        "macroF1": float(round(f1, 4)),
        "latencyMs": float(round(latency_per_sample_ms, 2)),
        "throughputSec": int(throughput),
        "classMetrics": class_metrics,
        "confusionMatrix": cm.tolist()
    }


def train_pipeline():
    print("=" * 70)
    print("    TripShield High-Accuracy Disruption Classifier Training")
    print("=" * 70)

    X_train, y_train, X_test, y_test = load_data()
    classes = sorted(list(set(y_train)))
    print(f"Loaded {len(X_train):,} training records and {len(X_test):,} test records across {len(classes)} classes.")

    os.makedirs(MODELS_DIR, exist_ok=True)

    # 1. Train Baseline Model (TF-IDF + Logistic Regression)
    print("\n[1/2] Training Baseline Model (TF-IDF Word + Logistic Regression)...")
    baseline_pipe = Pipeline([
        ("tfidf", TfidfVectorizer(max_features=5000, stop_words="english")),
        ("clf", LogisticRegression(max_iter=200, random_state=42))
    ])
    t0 = time.time()
    baseline_pipe.fit(X_train, y_train)
    baseline_train_dur = time.time() - t0
    print(f"Baseline trained in {baseline_train_dur:.2f}s")
    baseline_results = evaluate_model("Baseline (TF-IDF + LogReg)", baseline_pipe, X_test, y_test, classes)

    # 2. Train Production Model (Dual Word/Char FeatureUnion + Multi-threaded LightGBM)
    print("\n[2/2] Training Production Model (Word+Char FeatureUnion + LightGBM)...")
    feature_union = FeatureUnion([
        ("word_tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            max_features=8000,
            token_pattern=r"(?u)\b\w+\b"
        )),
        ("char_tfidf", TfidfVectorizer(
            ngram_range=(3, 4),
            analyzer="char",
            sublinear_tf=True,
            max_features=12000
        ))
    ])

    prod_pipe = Pipeline([
        ("features", feature_union),
        ("lgbm", lgb.LGBMClassifier(
            n_estimators=130,
            learning_rate=0.08,
            num_leaves=31,
            n_jobs=-1,
            random_state=42,
            verbosity=-1
        ))
    ])

    t0 = time.time()
    prod_pipe.fit(X_train, y_train)
    prod_train_dur = time.time() - t0
    print(f"Production model trained in {prod_train_dur:.2f}s")
    prod_results = evaluate_model("Production: LightGBM Multi-Feature Ensemble", prod_pipe, X_test, y_test, classes)

    # 3. Print Comparison Table
    print("\n" + "=" * 75)
    print(f"{'Metric':<25} | {'Baseline (LogReg)':<22} | {'Production (LightGBM)':<22}")
    print("-" * 75)
    print(f"{'Overall Accuracy':<25} | {baseline_results['accuracy']*100:.2f}%{' '*15} | {prod_results['accuracy']*100:.2f}%")
    print(f"{'Macro Precision':<25} | {baseline_results['macroPrecision']*100:.2f}%{' '*15} | {prod_results['macroPrecision']*100:.2f}%")
    print(f"{'Macro Recall':<25} | {baseline_results['macroRecall']*100:.2f}%{' '*15} | {prod_results['macroRecall']*100:.2f}%")
    print(f"{'Macro F1 Score':<25} | {baseline_results['macroF1']*100:.2f}%{' '*15} | {prod_results['macroF1']*100:.2f}%")
    print(f"{'Inference Latency':<25} | {baseline_results['latencyMs']:.2f} ms/sample{' '*8} | {prod_results['latencyMs']:.2f} ms/sample")
    print(f"{'Throughput':<25} | {baseline_results['throughputSec']:,} samples/s{' '*8} | {prod_results['throughputSec']:,} samples/s")
    print("=" * 75)

    print("\n--- Production Per-Class Breakdown ---")
    for cm_item in prod_results["classMetrics"]:
        print(f"  {cm_item['className']:<38} -> Precision: {cm_item['precision']*100:.2f}% | Recall: {cm_item['recall']*100:.2f}% | F1: {cm_item['f1']*100:.2f}% (N={cm_item['support']})")

    # 4. Serialize Model & Metrics
    model_path = MODELS_DIR / "disruption_classifier.joblib"
    metrics_path = MODELS_DIR / "metrics.json"
    
    print(f"\nSaving production model artifact -> {model_path}")
    joblib.dump(prod_pipe, model_path)
    
    metrics_payload = {
        "classes": classes,
        "baseline": baseline_results,
        "production": prod_results,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)
    print(f"Saved evaluation metrics JSON -> {metrics_path}")

    # Check accuracy threshold
    if prod_results["accuracy"] >= 0.95 and prod_results["macroF1"] >= 0.95:
        print(f"\n[SUCCESS] Target accuracy achieved! Accuracy: {prod_results['accuracy']*100:.2f}%, Macro-F1: {prod_results['macroF1']*100:.2f}% (Threshold: 95.0%)")
    else:
        print(f"\n[WARNING] Target accuracy slightly below 95%: {prod_results['accuracy']*100:.2f}%")

    return prod_pipe, metrics_payload


if __name__ == "__main__":
    train_pipeline()
