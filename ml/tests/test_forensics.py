"""
Unit tests for Aviation Forensics, Instant Factoring & Ghost-Hold Engine.
"""

import pytest
from ml.infer import (
    verify_airline_extraordinary_claim,
    compute_instant_factoring_quote,
    evaluate_ghost_hold_shadow_booking,
)


def test_verify_airline_extraordinary_claim_detects_false_weather():
    # Carrier claims weather, but METAR is benign (12 kts wind, 10 km vis) and 88% peer flights left fine
    verdict = verify_airline_extraordinary_claim(
        airline_claimed_reason="Severe adverse weather and thunderstorm at departure",
        metar_wind_kts=12.0,
        metar_visibility_km=10.0,
        inbound_tail_delay_mins=15,
        runway_peer_departures_on_time_pct=88.0,
        jurisdiction="DGCA",
    )
    assert verdict.is_airline_excuse_false is True
    assert verdict.fraud_confidence_score >= 0.90
    assert "DGCA CAR Section 3" in verdict.legal_precedent_citation


def test_verify_airline_extraordinary_claim_detects_knock_on_rotation():
    # Carrier claims ATC/weather, but incoming tail was 110 minutes late on previous flight
    verdict = verify_airline_extraordinary_claim(
        airline_claimed_reason="Unforeseen ATC flow control and weather congestion",
        metar_wind_kts=20.0,
        metar_visibility_km=4.0,
        inbound_tail_delay_mins=110,
        runway_peer_departures_on_time_pct=80.0,
        jurisdiction="EU261",
    )
    assert verdict.is_airline_excuse_false is True
    assert "Knock-on aircraft rotation delay" in verdict.verified_root_cause
    assert "CJEU Case C-549/07" in verdict.legal_precedent_citation


def test_verify_airline_extraordinary_claim_valid_severe_weather():
    # Truly severe weather: 45 kts gale, 0.8 km visibility, only 20% departures
    verdict = verify_airline_extraordinary_claim(
        airline_claimed_reason="Severe cyclonic storm gale winds",
        metar_wind_kts=45.0,
        metar_visibility_km=0.8,
        inbound_tail_delay_mins=10,
        runway_peer_departures_on_time_pct=20.0,
        jurisdiction="DGCA",
    )
    assert verdict.is_airline_excuse_false is False
    assert verdict.fraud_confidence_score <= 0.30


def test_compute_instant_factoring_quote_dgca():
    # False excuse proven -> high win prob -> instant buyout eligible in INR
    verdict = verify_airline_extraordinary_claim(
        airline_claimed_reason="Inclement weather",
        metar_wind_kts=10.0,
        metar_visibility_km=8.0,
        inbound_tail_delay_mins=120,
        runway_peer_departures_on_time_pct=90.0,
        jurisdiction="DGCA",
    )
    quote = compute_instant_factoring_quote(
        flight_distance_km=1400,
        arrival_delay_mins=240,
        forensics=verdict,
        jurisdiction="DGCA",
    )
    assert quote.eligible_for_instant_buyout is True
    assert quote.currency == "INR"
    assert quote.statutory_compensation == 7500.0
    assert quote.instant_payout > 5000.0
    assert "UPI" in quote.payout_rail


def test_compute_instant_factoring_quote_eu261():
    verdict = verify_airline_extraordinary_claim(
        airline_claimed_reason="Inclement weather",
        metar_wind_kts=10.0,
        metar_visibility_km=8.0,
        inbound_tail_delay_mins=120,
        runway_peer_departures_on_time_pct=90.0,
        jurisdiction="EU261",
    )
    quote = compute_instant_factoring_quote(
        flight_distance_km=3800,
        arrival_delay_mins=240,
        forensics=verdict,
        jurisdiction="EU261",
    )
    assert quote.eligible_for_instant_buyout is True
    assert quote.currency == "EUR"
    assert quote.statutory_compensation == 600.0
    assert quote.instant_payout > 400.0


def test_evaluate_ghost_hold_shadow_booking():
    # Inbound tail 110 min late with only 40 min turnaround and 30 min connection window
    # Alternate flight has only 3 seats left
    result = evaluate_ghost_hold_shadow_booking(
        inbound_tail_delay_mins=110,
        turnaround_buffer_mins=40,
        connection_window_mins=30,
        seats_remaining_on_alternate=3,
        rebook_cost=4200.0,
        traveller_hourly_sla=1500.0,
        hotel_overnight_cost=6000.0,
        currency="INR",
    )
    assert result["ghost_hold_triggered"] is True
    assert result["misconnection_probability"] >= 0.72
    assert result["safe_harbor_actuarial_proof"]["auto_approved"] is True
    assert result["safe_harbor_actuarial_proof"]["net_expected_cfo_savings"] > 0
