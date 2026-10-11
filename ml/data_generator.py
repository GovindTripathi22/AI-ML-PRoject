"""
Big Data Travel Disruption Corpus Generator for TripShield InTravel Classifier.

Generates high-fidelity, high-entropy realistic Indian domestic travel disruption
bulletins across 5 operational categories with realistic variations, regulatory
codes (NOTAM, IMD, CAR, KSDMA), airport identifiers, airline callsigns, and noise.
"""

import argparse
import os
from pathlib import Path
import random
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "ml" / "data"

CATEGORIES = [
    "Severe Weather / Cyclone",
    "Runway / ATC NOTAM Closure",
    "Natural Hazard / Flood & Landslide",
    "Labour Stoppage / Ground Strike",
    "Facility / Structural Safety Order"
]

AIRPORTS = [
    ("BOM", "Mumbai Chhatrapati Shivaji Maharaj Intl"),
    ("DEL", "Delhi Indira Gandhi Intl"),
    ("GOI", "Goa Dabolim Airport"),
    ("GOX", "Goa Manohar Intl Mopa"),
    ("BLR", "Bengaluru Kempegowda Intl"),
    ("CCU", "Kolkata Netaji Subhash Chandra Bose Intl"),
    ("MAA", "Chennai Intl"),
    ("COK", "Cochin International Airport"),
    ("HYD", "Hyderabad Rajiv Gandhi Intl"),
    ("JAI", "Jaipur Intl"),
    ("IXC", "Chandigarh Shaheed Bhagat Singh Intl"),
    ("BBI", "Bhubaneswar Biju Patnaik Intl")
]

AIRLINES = ["IndiGo (6E)", "Air India (AI)", "Akasa Air (QP)", "SpiceJet (SG)", "Vistara (UK)"]

# Seed phrase templates per category
WEATHER_TEMPLATES = [
    "IMD Bulletin #{num}: Deep depression in {sea} intensified to {intensity} cyclonic storm '{name}'. Sustained wind gusts of {wind} knots approaching {station} coastline. Runway operations suspended and co-terminal diversion protocols initiated.",
    "Indian Meteorological Department Red Alert issued for {station} coastal sector. Severe convective thunderstorm and gale force winds exceeding {wind} km/h. Flight movements halted due to crosswind limits exceeding operating envelope.",
    "Cyclone '{name}' landfall expected within {hours} hours near {station}. Coastal surge of {surge} meters reported. Airport Emergency Management Committee ordered suspension of commercial departures at {station}.",
    "Met Office Special Weather Advisory: Heavy to extremely heavy rainfall ({rain} mm) with severe lightning and squalls affecting {station} terminal area. Multiple holding patterns and diversions to alternate aerodromes.",
    "Doppler weather radar detects intense convective squall line across {station} approach corridor. Visibility dropped to {vis} meters in driving monsoon rain. Severe wind shear advisory in effect.",
    "Tropical storm warning #{num} issued for southwest coast. High sea state and wind gusts to {wind} kts grounding short-haul ATR and A320 sectors connecting {station}."
]

RUNWAY_TEMPLATES = [
    "DGCA NOTAM {notam}: Primary runway {rwy} at {station} closed for emergency asphalt milling and resurfacing between {time1} and {time2} IST. Departure slot delays averaging {delay} minutes.",
    "Airport Operations Control Centre (AOCC) Notice: Runway {rwy} at {station} temporarily unavailable due to disabled aircraft tyre burst on rapid exit taxiway. Operations diverted to secondary cross-runway with 50% capacity reduction.",
    "NOTAM {notam}: Instrument Landing System (ILS) Localizer CAT III calibration flight in progress on runway {rwy} at {station}. Low visibility procedures suspended for all scheduled arrivals.",
    "Runway surface friction degradation bulletin: Emergency rubber deposit descaling ordered on main runway {rwy} at {station}. Slot suspension notice active for all narrowbody domestic flights.",
    "AOCC Alert: Scheduled runway intersection rehabilitation extended beyond planned window at {station}. MIAL/DIAL operations advisory enforces involuntary slot re-accommodation.",
    "DGCA Safety Directorate Directive: Temporary runway length reduction of {metres}m on {station} runway {rwy} due to tarmac micro-trenching for precision approach lighting."
]

NATURAL_HAZARD_TEMPLATES = [
    "{sdma} Red Alert: Severe cloudburst triggered sudden flash flooding and major landslide debris across {corridor}. Transport corridors completely impassable, cutting off hill resorts.",
    "District Administration Order: Massive mudslide and boulder fall blocked national highway {corridor}. All commercial tourist transport, ghat taxis, and connecting transfers indefinitely halted.",
    "River {river} overflowed danger mark following torrential mountain catchment rains. Low-lying backwater resort access and houseboat waterways inundated around {region}.",
    "Disaster Management Authority Flash Warning: High-risk slope instability and embankment breach on {corridor}. Evacuation of tourist homestays underway, road connectivity severed.",
    "Flash flood inundation advisory: Valley highway bridge damaged on route to {region}. Local police closed vehicle checkpoints, stranding outbound travellers connecting to {station}.",
    "Geological Survey of India landslide warning: Active rockfall corridor identified along {corridor}. Tourist bus routes suspended by district magistrate with immediate effect."
]

LABOUR_TEMPLATES = [
    "AOCC Flash Incident Report: Ramp handling crew and aviation fuel tanker operators initiated unannounced wildcat stoppage at {station} Terminal {term}. Refuelling operations crippled.",
    "Ground Handling Workers Union Notice: Ramp staff walkout over roster disputes at {station}. Heavy baggage offloading bottlenecks and departure delays exceeding {delay} minutes.",
    "Aviation refuelling staff strike: Fuel bowser operators ceased bowser movements in {station} aprons {apron}. Domestic flight turnarounds held on remote bays without fuel supply.",
    "Ground support equipment technicians staged sudden sit-in strike at {station} cargo and ramp complex. Baggage belt stoppage delaying transit passenger baggage reconciliation.",
    "Contract baggage handlers wildcat work-to-rule agitation: Ramp handling throughput fallen by {pct}% at {station}. Airlines issuing fee waivers for missed connections.",
    "Airport Union flash strike notice: Ground marshallers and pushback tug operators walked off shifts at {station} Terminal {term}. Outbound aircraft pushbacks grounded."
]

FACILITY_TEMPLATES = [
    "Municipal Fire & Emergency Services Order #{num}: Structural safety notice served on {hotel}. Heritage pavilion wing suites sealed for 48 hours for emergency structural reinforcement.",
    "Hotel General Advisory: Sudden electrical substation transformer fault caused power isolation in {hotel} heritage block. Guests relocated to partner sister luxury hotels under force majeure.",
    "City Municipal Corporation Structural Preservation Order: Temporary sealing of heritage wing at {hotel} following ceiling plaster displacement inspection. Mandatory room upgrade protocol triggered.",
    "Emergency Hotel Maintenance Notice: Chilled water piping rupture flooded deluxe wing at {hotel}. Operational rooms capped, requiring immediate guest re-accommodation to unaffected sister properties.",
    "Fire Safety Compliance Order: Mandatory remediation of evacuation staircase in {hotel} heritage tower requires temporary closure of floors 3 through 6. Relocation vouchers issued.",
    "Heritage property structural advisory: Historic wing load inspection at {hotel} mandated temporary evacuation of occupied luxury pavilions pending civic clearance."
]

SEAS = ["Arabian Sea", "Bay of Bengal", "Indian Ocean"]
CYCLONE_NAMES = ["Shakhti", "Vayu", "Nisarga", "Tauktae", "Biparjoy", "Michaung", "Dana", "Remal", "Asna"]
HOTELS = ["The Leela Palace Jaipur", "Rambagh Palace Jaipur", "Taj Exotica Goa", "Taj Mahal Palace Mumbai", "Kumarakom Lake Resort", "The Oberoi Grand Kolkata"]
CORRIDORS = ["Munnar Gap Road NH-85", "Rohtang Pass Highway", "Jammu-Srinagar NH-44", "Nilgiris Ooty Ghat Road", "Valparai Hill Route", "Wayand Thamarassery Churam"]
RIVERS = ["Periyar", "Pamba", "Teesta", "Mandovi", "Zuari", "Ganga", "Yamuna"]
REGIONS = ["Munnar Ghats", "Alappuzha Backwaters", "Kumarakom", "Shimla Hills", "Dharamshala Valley", "Wayanad Hills"]


def generate_single_sample(category: str, rng: random.Random) -> dict:
    code, station_name = rng.choice(AIRPORTS)
    airline = rng.choice(AIRLINES)
    
    if category == "Severe Weather / Cyclone":
        tpl = rng.choice(WEATHER_TEMPLATES)
        text = tpl.format(
            num=rng.randint(10, 99),
            sea=rng.choice(SEAS),
            intensity=rng.choice(["severe", "very severe", "extremely severe", "super"]),
            name=rng.choice(CYCLONE_NAMES),
            wind=rng.randint(45, 95),
            station=f"{station_name} ({code})",
            hours=rng.randint(6, 36),
            surge=round(rng.uniform(1.5, 4.5), 1),
            rain=rng.randint(150, 420),
            vis=rng.randint(200, 800)
        )
    elif category == "Runway / ATC NOTAM Closure":
        tpl = rng.choice(RUNWAY_TEMPLATES)
        notam_letter = rng.choice(["A", "C", "G"])
        text = tpl.format(
            notam=f"{notam_letter}{rng.randint(1000, 9999)}/26",
            rwy=rng.choice(["09/27", "14/32", "08/26", "10/28", "11/29"]),
            station=f"{station_name} ({code})",
            time1=f"{rng.randint(0, 12):02d}:00",
            time2=f"{rng.randint(13, 23):02d}:00",
            delay=rng.randint(45, 240),
            metres=rng.randint(400, 1100)
        )
    elif category == "Natural Hazard / Flood & Landslide":
        tpl = rng.choice(NATURAL_HAZARD_TEMPLATES)
        text = tpl.format(
            sdma=rng.choice(["KSDMA", "SDMA", "State Disaster Authority"]),
            corridor=rng.choice(CORRIDORS),
            river=rng.choice(RIVERS),
            region=rng.choice(REGIONS),
            station=f"{station_name} ({code})"
        )
    elif category == "Labour Stoppage / Ground Strike":
        tpl = rng.choice(LABOUR_TEMPLATES)
        text = tpl.format(
            station=f"{station_name} ({code})",
            term=rng.choice(["1", "2", "3", "T2", "T3"]),
            delay=rng.randint(60, 300),
            apron=f"Bay {rng.randint(10, 65)}",
            pct=rng.randint(50, 85)
        )
    else:  # Facility / Structural Safety Order
        tpl = rng.choice(FACILITY_TEMPLATES)
        text = tpl.format(
            num=rng.randint(100, 999),
            hotel=rng.choice(HOTELS)
        )
        
    # Introduce natural variation: prefix with detector source or carrier
    prefix_types = [
        "",
        f"[AERODROME ADVISORY - {code}] ",
        f"[ALERT SOURCE: DGCA / {airline}] ",
        f"OPERATIONS FLASH #{rng.randint(100, 999)}: ",
        f"PRIORITY DISPATCH ({code}): "
    ]
    full_text = rng.choice(prefix_types) + text

    return {
        "text": full_text,
        "category": category,
        "station_code": code,
        "airline": airline
    }


def generate_dataset(total_samples: int = 25000, seed: int = 42):
    rng = random.Random(seed)
    samples_per_cat = total_samples // len(CATEGORIES)
    
    print(f"Generating {total_samples:,} disruption records ({samples_per_cat:,} per category)...")
    records = []
    for cat in CATEGORIES:
        for _ in range(samples_per_cat):
            records.append(generate_single_sample(cat, rng))
            
    # Shuffle entire dataset
    rng.shuffle(records)
    df = pd.DataFrame(records)
    
    # 80/20 train/test split
    split_idx = int(0.80 * len(df))
    train_df = df.iloc[:split_idx].copy()
    test_df = df.iloc[split_idx:].copy()
    
    os.makedirs(DATA_DIR, exist_ok=True)
    train_path = DATA_DIR / "train.csv"
    test_path = DATA_DIR / "test.csv"
    
    train_df.to_csv(train_path, index=False)
    test_df.to_csv(test_path, index=False)
    
    print(f"Generated train set: {len(train_df):,} records -> {train_path}")
    print(f"Generated test set : {len(test_df):,} records -> {test_path}")
    print("Class distribution in test set:")
    print(test_df["category"].value_counts())
    return train_path, test_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Big Data Travel Disruption Corpus")
    parser.add_argument("--samples", type=int, default=25000, help="Total samples to generate (default: 25000)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")
    args = parser.parse_args()
    
    generate_dataset(total_samples=args.samples, seed=args.seed)
