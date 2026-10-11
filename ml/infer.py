"""
Real-time Inference CLI for TripShield Disruption Classifier.

Takes raw disruption text from arguments or stdin and outputs the predicted
category, calibrated confidence score, and probability distribution across classes.
"""

import argparse
from pathlib import Path
import sys
import joblib
import numpy as np

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT_ROOT / "ml" / "models" / "disruption_classifier.joblib"


def load_classifier():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Run python ml/train.py first.")
    return joblib.load(MODEL_PATH)


def predict(text: str, model=None):
    if model is None:
        model = load_classifier()

    probs = model.predict_proba([text])[0]
    classes = model.classes_
    best_idx = np.argmax(probs)
    best_class = classes[best_idx]
    confidence = float(probs[best_idx])

    distribution = {cls: float(round(p * 100, 2)) for cls, p in zip(classes, probs)}
    return {
        "text": text,
        "predicted_category": best_class,
        "confidence": float(round(confidence * 100, 2)),
        "distribution": distribution
    }


def main():
    parser = argparse.ArgumentParser(description="Run inference with TripShield Disruption Classifier")
    parser.add_argument("--text", type=str, help="Disruption text to classify")
    args = parser.parse_args()

    model = load_classifier()

    if args.text:
        res = predict(args.text, model)
        print("\n" + "=" * 65)
        print("          TripShield InTravel Classifier - Inference Result")
        print("=" * 65)
        print(f"Input Text : {res['text']}")
        print(f"Prediction : {res['predicted_category']}")
        print(f"Confidence : {res['confidence']:.2f}%")
        print("-" * 65)
        print("Class Probabilities:")
        for cls, prob in sorted(res['distribution'].items(), key=lambda x: x[1], reverse=True):
            bar = "#" * int(prob / 4)
            print(f"  {cls:<38} : {prob:>6.2f}% | {bar}")
        print("=" * 65)
    else:
        # Interactive mode
        print("TripShield Disruption Classifier (Interactive Mode - type 'exit' to quit)")
        while True:
            try:
                user_text = input("\nEnter disruption text > ").strip()
                if not user_text or user_text.lower() in ["exit", "quit", "q"]:
                    break
                res = predict(user_text, model)
                print(f"--> Predicted: [{res['predicted_category']}] ({res['confidence']:.1f}% confidence)")
            except (KeyboardInterrupt, EOFError):
                break


if __name__ == "__main__":
    main()
