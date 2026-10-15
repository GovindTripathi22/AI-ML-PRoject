"""
Direct unit tests for FastAPI Microservice Bridge endpoints (ml/server.py).
"""

from ml.server import (
    health,
    api_classify,
    api_verify_forensics,
    api_factoring_quote,
    api_ghost_hold,
    ClassifyRequest,
    ForensicsRequest,
    FactoringRequest,
    GhostHoldRequest,
)


def test_api_health():
    res = health()
    assert res["status"] == "healthy"
    assert res["model_loaded"] is True
    assert "DGCA" in res["supported_jurisdictions"]


def test_api_classify():
    req = ClassifyRequest(text="DGCA NOTAM A1492/26: Primary runway 09/27 at Mumbai BOM closed for emergency resurfacing")
    res = api_classify(req)
    assert "predicted_category" in res
    assert res["predicted_category"] == "Runway / ATC NOTAM Closure"
    assert res["confidence"] >= 50.0


def test_api_forensics_verify():
    req = ForensicsRequest(
        airline_claimed_reason="Adverse weather and thunderstorm at hub",
        metar_wind_kts=10.0,
        metar_visibility_km=10.0,
        inbound_tail_delay_mins=105,
        runway_peer_departures_on_time_pct=92.0,
        jurisdiction="DGCA",
    )
    res = api_verify_forensics(req)
    assert res["is_airline_excuse_false"] is True
    assert "Knock-on aircraft rotation delay" in res["verified_root_cause"]


def test_api_factoring_quote():
    forensics_dict = {
        "airline_claimed_reason": "Weather",
        "verified_root_cause": "Knock-on rotation",
        "is_airline_excuse_false": True,
        "fraud_confidence_score": 0.94,
        "metar_wind_kts": 12.0,
        "runway_peer_departures_on_time_pct": 88.0,
        "inbound_tail_delay_mins": 95,
        "legal_precedent_citation": "DGCA CAR Section 3",
        "recommended_authority": "AirSewa",
        "jurisdiction": "DGCA",
    }
    req = FactoringRequest(
        flight_distance_km=1500.0,
        arrival_delay_mins=240,
        forensics=forensics_dict,
        jurisdiction="DGCA",
    )
    res = api_factoring_quote(req)
    assert res["eligible_for_instant_buyout"] is True
    assert res["currency"] == "INR"
    assert res["instant_payout"] > 5000.0


def test_api_ghost_hold():
    req = GhostHoldRequest(
        inbound_tail_delay_mins=120,
        turnaround_buffer_mins=40,
        connection_window_mins=30,
        seats_remaining_on_alternate=4,
        rebook_cost=5000.0,
        traveller_hourly_sla=1800.0,
        hotel_overnight_cost=6500.0,
        currency="INR",
    )
    res = api_ghost_hold(req)
    assert res["ghost_hold_triggered"] is True
    assert res["safe_harbor_actuarial_proof"]["auto_approved"] is True
