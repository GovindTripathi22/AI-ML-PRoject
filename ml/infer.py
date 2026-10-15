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


# =====================================================================
# Real-World Aviation Forensics, Instant Factoring & Ghost-Hold Engine
# =====================================================================

from dataclasses import dataclass, asdict
from typing import Dict, Any, List
import math


@dataclass
class ForensicsVerdict:
    airline_claimed_reason: str
    verified_root_cause: str
    is_airline_excuse_false: bool
    fraud_confidence_score: float
    metar_wind_kts: float
    runway_peer_departures_on_time_pct: float
    inbound_tail_delay_mins: int
    legal_precedent_citation: str
    recommended_authority: str
    jurisdiction: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class FactoringQuote:
    eligible_for_instant_buyout: bool
    currency: str
    statutory_compensation: float
    win_probability: float
    instant_payout: float
    platform_fee: float
    payout_rail: str
    settlement_eta_seconds: int

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def verify_airline_extraordinary_claim(
    airline_claimed_reason: str,
    metar_wind_kts: float,
    metar_visibility_km: float,
    inbound_tail_delay_mins: int,
    runway_peer_departures_on_time_pct: float,
    jurisdiction: str = "DGCA",
) -> ForensicsVerdict:
    """
    Cross-examines the airline's 'Extraordinary Circumstances' / 'Force Majeure' excuse
    against live METAR weather telemetry, runway peer departure rates, and inbound aircraft rotation.
    Supports DGCA (India), EU261 (Europe), and US DOT (USA).
    """
    claimed = airline_claimed_reason.lower()
    claims_weather_or_atc = any(
        w in claimed for w in ["weather", "storm", "wind", "fog", "atc", "extraordinary", "unforeseen", "force majeure"]
    )

    # Check 1: Was the weather actually severe, or were 75%+ of peer flights departing fine?
    weather_actually_benign = (
        metar_wind_kts < 28.0
        and metar_visibility_km >= 5.0
        and runway_peer_departures_on_time_pct >= 75.0
    )

    # Check 2: Did the delay actually originate from a knock-on inbound tail-number rotation?
    knock_on_rotation_fault = inbound_tail_delay_mins >= 90

    is_false_excuse = claims_weather_or_atc and (
        weather_actually_benign or knock_on_rotation_fault
    )

    authority_map = {
        "DGCA": "MoCA AirSewa Portal & DGCA CAR Section 3, Series M, Part IV (India)",
        "EU261": "SÖP (Germany) / AESA (Spain) / DGAC (France) / CAA (UK261)",
        "DOT": "US DOT Aviation Consumer Protection Division (14 CFR Part 259)",
    }

    if is_false_excuse and knock_on_rotation_fault:
        root_cause = (
            f"Knock-on aircraft rotation delay ({inbound_tail_delay_mins} mins late on prior leg) "
            f"while {runway_peer_departures_on_time_pct:.0f}% of runway peers departed on schedule."
        )
        confidence = min(0.98, 0.70 + (inbound_tail_delay_mins / 400.0))
        if jurisdiction == "EU261":
            citation = (
                "CJEU Case C-549/07 (Wallentin-Hermann) & C-294/10 (Eglītis): "
                "Knock-on delays from prior aircraft rotations and routine operational "
                "issues do NOT constitute extraordinary circumstances under Article 5(3)."
            )
        elif jurisdiction == "DOT":
            citation = (
                "US DOT 14 CFR Part 259 & Airline Customer Service Commitments: "
                "Carriers cannot evade controllable delay assistance when incoming aircraft "
                "sequencing causes flight cancellation."
            )
        else:
            citation = (
                "DGCA CAR Section 3, Series M, Part IV, Clause 3.3.2: "
                "Airlines must establish that cancellation was caused by extraordinary circumstances; "
                "subsequent rotational delays on carrier's own fleet remain carrier's liability."
            )
    elif is_false_excuse and weather_actually_benign:
        root_cause = (
            f"METAR telemetry confirms benign conditions ({metar_wind_kts} kts wind, "
            f"{metar_visibility_km} km visibility) with {runway_peer_departures_on_time_pct:.0f}% peer departures."
        )
        confidence = 0.92
        if jurisdiction == "EU261":
            citation = (
                "EC 261/2004 Article 5(3) Burden of Proof: Carrier failed to demonstrate "
                "airport-wide meteorological closure; peer carriers operated normally."
            )
        elif jurisdiction == "DOT":
            citation = (
                "US DOT Aviation Consumer Protection Precedent: Fictitious meteorological claims "
                "disproved by local NOAA surface observations."
            )
        else:
            citation = (
                "DGCA CAR Section 3, Series M, Part IV: Invalidation of weather defense; "
                "IMD surface reports confirm operating conditions met Cat I/II minimums."
            )
    else:
        root_cause = airline_claimed_reason
        confidence = 0.20
        citation = "Standard carrier exemption review (preliminary verification pending)."

    return ForensicsVerdict(
        airline_claimed_reason=airline_claimed_reason,
        verified_root_cause=root_cause,
        is_airline_excuse_false=is_false_excuse,
        fraud_confidence_score=round(confidence, 2),
        metar_wind_kts=metar_wind_kts,
        runway_peer_departures_on_time_pct=runway_peer_departures_on_time_pct,
        inbound_tail_delay_mins=inbound_tail_delay_mins,
        legal_precedent_citation=citation,
        recommended_authority=authority_map.get(jurisdiction, authority_map["DGCA"]),
        jurisdiction=jurisdiction,
    )


def compute_instant_factoring_quote(
    flight_distance_km: float,
    arrival_delay_mins: int,
    forensics: ForensicsVerdict,
    jurisdiction: str = "DGCA",
    annual_discount_rate: float = 0.08,
    expected_settlement_months: float = 3.5,
    factoring_margin: float = 0.14,
) -> FactoringQuote:
    """
    Prices an instant 'Cash-at-the-Gate' buyout for the passenger's statutory claim.
    Supports DGCA (INR ₹ / UPI), EU261 (EUR €), and US DOT (USD $).
    """
    if arrival_delay_mins < 120 and jurisdiction == "DGCA":
        return FactoringQuote(False, "INR", 0.0, 0.0, 0.0, 0.0, "NONE", 0)
    elif arrival_delay_mins < 180 and jurisdiction in ["EU261", "DOT"]:
        return FactoringQuote(False, "EUR" if jurisdiction == "EU261" else "USD", 0.0, 0.0, 0.0, 0.0, "NONE", 0)

    # Statutory compensation tiers by jurisdiction
    if jurisdiction == "EU261":
        currency = "EUR"
        payout_rail = "TripShield Virtual Visa (EUR)"
        if flight_distance_km <= 1500:
            statutory_amount = 250.0
        elif flight_distance_km <= 3500:
            statutory_amount = 400.0
        else:
            statutory_amount = 600.0
    elif jurisdiction == "DOT":
        currency = "USD"
        payout_rail = "TripShield Virtual Mastercard (USD)"
        statutory_amount = 450.0
    else:  # DGCA India
        currency = "INR"
        payout_rail = "Instant UPI (VPA) / IMPS Direct Credit"
        if flight_distance_km <= 1000:
            statutory_amount = 5000.0
        elif flight_distance_km <= 2000:
            statutory_amount = 7500.0
        else:
            statutory_amount = 10000.0

    # Win probability based on forensics
    if forensics.is_airline_excuse_false:
        win_prob = forensics.fraud_confidence_score
    elif "technical" in forensics.verified_root_cause.lower() or "crew" in forensics.verified_root_cause.lower():
        win_prob = 0.95
    else:
        win_prob = 0.28

    if win_prob < 0.70:
        return FactoringQuote(False, currency, statutory_amount, win_prob, 0.0, 0.0, "STANDARD_ESCROW", 0)

    time_years = expected_settlement_months / 12.0
    time_discount = math.exp(-annual_discount_rate * time_years)
    instant_payout = round(
        statutory_amount * win_prob * time_discount * (1.0 - factoring_margin), 2
    )
    platform_fee = round(statutory_amount - instant_payout, 2)

    return FactoringQuote(
        eligible_for_instant_buyout=True,
        currency=currency,
        statutory_compensation=statutory_amount,
        win_probability=round(win_prob, 2),
        instant_payout=instant_payout,
        platform_fee=platform_fee,
        payout_rail=payout_rail,
        settlement_eta_seconds=45,
    )


def evaluate_ghost_hold_shadow_booking(
    inbound_tail_delay_mins: int,
    turnaround_buffer_mins: int,
    connection_window_mins: int,
    seats_remaining_on_alternate: int,
    rebook_cost: float,
    traveller_hourly_sla: float,
    hotel_overnight_cost: float = 6500.0,
    currency: str = "INR",
) -> Dict[str, Any]:
    """
    Evaluates whether to place a pre-cancellation 'Ghost-Hold' on a rival carrier
    and computes the Safe-Harbor Expected Value proof for corporate CFOs.
    """
    projected_departure_delay = max(0, inbound_tail_delay_mins - turnaround_buffer_mins)
    misconnection_gap = projected_departure_delay - connection_window_mins

    # Logistic probability of missing the connection
    prob_misconnect = 1.0 / (1.0 + math.exp(-0.08 * (misconnection_gap + 10)))

    # Expected cost of doing nothing (hotel + 10 hrs lost executive SLA + last-minute walk-up fare surge)
    cost_if_stranded = hotel_overnight_cost + (10.0 * traveller_hourly_sla) + (rebook_cost * 1.65)
    expected_loss_without_action = round(prob_misconnect * cost_if_stranded, 2)
    net_expected_savings = round(expected_loss_without_action - rebook_cost, 2)

    should_trigger_ghost_hold = (
        prob_misconnect >= 0.72 and seats_remaining_on_alternate <= 6
    )
    safe_harbor_auto_approved = net_expected_savings > 0

    return {
        "projected_departure_delay_mins": projected_departure_delay,
        "misconnection_probability": round(prob_misconnect, 3),
        "seats_remaining_on_alternate": seats_remaining_on_alternate,
        "ghost_hold_triggered": should_trigger_ghost_hold,
        "ghost_hold_ttl_minutes": 180 if should_trigger_ghost_hold else 0,
        "currency": currency,
        "safe_harbor_actuarial_proof": {
            "rebook_override_cost": rebook_cost,
            "expected_cost_of_inaction": expected_loss_without_action,
            "net_expected_cfo_savings": net_expected_savings,
            "auto_approved": safe_harbor_auto_approved,
        },
    }

