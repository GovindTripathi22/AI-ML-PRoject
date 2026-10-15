"""
TripShield Live FastAPI Microservice Bridge
Connects the Python Machine Learning, Aviation Forensics, and Factoring Engines
directly to the React Operations Console.
"""

from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

from ml.infer import (
    load_classifier,
    predict,
    verify_airline_extraordinary_claim,
    compute_instant_factoring_quote,
    evaluate_ghost_hold_shadow_booking,
    ForensicsVerdict,
)

app = FastAPI(
    title="TripShield Aviation Forensics & ML Inference API",
    version="2.5.0",
    description="Enterprise API for real-time travel disruption classification, METAR weather forensics, parametric factoring, and GDS ghost-holds.",
)

# Enable CORS for Vite local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pre-load classifier on module import / startup
try:
    _classifier = load_classifier()
except Exception as e:
    _classifier = None
    print(f"Warning: Classifier artifact not loaded yet: {e}")


# --- Pydantic Request Models ---

class ClassifyRequest(BaseModel):
    text: str = Field(..., description="Raw disruption text, SMS, NOTAM, or bulletin")


class ForensicsRequest(BaseModel):
    airline_claimed_reason: str
    metar_wind_kts: float = 12.0
    metar_visibility_km: float = 10.0
    inbound_tail_delay_mins: int = 15
    runway_peer_departures_on_time_pct: float = 85.0
    jurisdiction: str = "DGCA"


class FactoringRequest(BaseModel):
    flight_distance_km: float = 1400.0
    arrival_delay_mins: int = 240
    forensics: Dict[str, Any]
    jurisdiction: str = "DGCA"


class GhostHoldRequest(BaseModel):
    inbound_tail_delay_mins: int = 110
    turnaround_buffer_mins: int = 40
    connection_window_mins: int = 30
    seats_remaining_on_alternate: int = 3
    rebook_cost: float = 4500.0
    traveller_hourly_sla: float = 1500.0
    hotel_overnight_cost: float = 6000.0
    currency: str = "INR"


# --- API Endpoints ---

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "TripShield Ops Microservice",
        "model_loaded": _classifier is not None,
        "supported_jurisdictions": ["DGCA", "EU261", "DOT"],
    }


@app.post("/api/disruptions/classify")
def api_classify(req: ClassifyRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    return predict(req.text, model=_classifier)


@app.post("/api/forensics/verify")
def api_verify_forensics(req: ForensicsRequest):
    verdict = verify_airline_extraordinary_claim(
        airline_claimed_reason=req.airline_claimed_reason,
        metar_wind_kts=req.metar_wind_kts,
        metar_visibility_km=req.metar_visibility_km,
        inbound_tail_delay_mins=req.inbound_tail_delay_mins,
        runway_peer_departures_on_time_pct=req.runway_peer_departures_on_time_pct,
        jurisdiction=req.jurisdiction,
    )
    return verdict.to_dict()


@app.post("/api/factoring/quote")
def api_factoring_quote(req: FactoringRequest):
    forensics_obj = ForensicsVerdict(**req.forensics)
    quote = compute_instant_factoring_quote(
        flight_distance_km=req.flight_distance_km,
        arrival_delay_mins=req.arrival_delay_mins,
        forensics=forensics_obj,
        jurisdiction=req.jurisdiction,
    )
    return quote.to_dict()


@app.post("/api/ghost-hold/evaluate")
def api_ghost_hold(req: GhostHoldRequest):
    return evaluate_ghost_hold_shadow_booking(
        inbound_tail_delay_mins=req.inbound_tail_delay_mins,
        turnaround_buffer_mins=req.turnaround_buffer_mins,
        connection_window_mins=req.connection_window_mins,
        seats_remaining_on_alternate=req.seats_remaining_on_alternate,
        rebook_cost=req.rebook_cost,
        traveller_hourly_sla=req.traveller_hourly_sla,
        hotel_overnight_cost=req.hotel_overnight_cost,
        currency=req.currency,
    )


if __name__ == "__main__":
    uvicorn.run("ml.server:app", host="127.0.0.1", port=8000, reload=False)
