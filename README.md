# TripShield — Travel Disruption Detection & Recovery Suite

TripShield is an internal operations web application built for travel agency operations personnel to detect travel disruptions, map itinerary dependencies, retrieve statutory and supplier policies, draft policy-grounded recovery candidates, and govern customer re-accommodations via human-in-the-loop approvals.

The application runs entirely on realistic seeded mock data with zero external dependencies.

---

## Operational Features

1. **Operations Console (Dashboard)**
   - Real-time incident summary indicators: Active Incidents, Travellers Affected, Bookings at Risk, Plans Awaiting Approval.
   - Filterable and searchable incident manifest (by severity, status, station, or keywords).
   - One-click navigation into incident management dossiers.

2. **Incident Management Dossier (Core Page)**
   - Header with disruption category, station location, coordinates, detector source (IMD weather warnings, DGCA NOTAMs, GDS feeds), and classifier confidence score.
   - **Affected Itineraries & Dependency Graph**:
     - Interactive SVG dependency graph (`Traveller` &rarr; `Inbound Flight / Sector` &rarr; `Downstream Hotel / Transfer`).
     - Highlighted disruption paths with direct node selection to inspect passenger constraints and booking PNR details.
     - Tabular manifest fallback for high-density review.
   - **Policy Evidence Tab**:
     - Vector-retrieved policy snippets from airline charters, hotel force majeure clauses, and DGCA Civil Aviation Requirements (CAR Section 3, Series M, Part IV).
     - Relevance match scores and direct "Source Doc" reader modals.
   - **Recovery Plan Tab**:
     - 2–3 alternative recovery candidates per impacted traveller.
     - Quantified cost variance in Indian Rupees (INR), traveller budget threshold checks, and preference alignment scoring.
     - Factual operational rationales citing evidence snippets directly (`[1]`, `[2]`).
     - Human-in-the-loop approval actions: **Approve**, **Edit** (modify itinerary details and negotiated cost delta before sign-off), and **Reject** (enforcing a mandatory audit justification).
   - **Autonomous Pipeline Execution Timeline**:
     - 6-stage sequential agent orchestration timeline (`Detect` &rarr; `Identify affected` &rarr; `Retrieve policies` &rarr; `Evaluate alternatives` &rarr; `Compare costs` &rarr; `Draft plan`).
     - "Run Analysis (Replay)" button simulating autonomous pipeline re-execution with live step-by-step progress and inspectable JSON payloads.

3. **Travellers & Bookings Manifest**
   - Searchable database of 12 travellers across Corporate Platinum, Leisure Gold, and Executive tiers.
   - Slide-over profile drawer with emergency contacts, dietary and seat preferences, disruption budget caps in INR, and associated multi-modal booking histories.

4. **Statutory & Supplier Policy Library**
   - Searchable repository of 8 supplier policy documents (IndiGo, Air India, Taj Hotels/IHCL, MakeMyTrip B2B, IRCTC Railways, The Oberoi Group, SpiceJet, Vistara/Air India Transition).
   - Real-time keyword ranking and scoring against codified policy sections.
   - Document reader modal for complete regulatory clauses.

5. **Disruption Classifier Model Evaluation**
   - Offline evaluation benchmark comparing the production fine-tuned transformer (`InTravel-RoBERTa-v2`) against the baseline (`TF-IDF + Logistic Regression`).
   - Metrics table reporting Precision, Recall, Macro-F1, Latency (p95), and Inference Throughput.
   - Clean SVG bar chart displaying per-class Macro-F1 across 5 disruption categories.
   - 5x5 confusion matrix grid visualizing prediction distributions.

6. **System Architecture & Data Flow**
   - SVG architecture diagram depicting the end-to-end pipeline: `Data Sources` &rarr; `FastAPI Ingestion Engine` &rarr; `InTravel Classifier` &rarr; `Neo4j Graph Database` &rarr; `Dense Vector Retrieval & Reranker` &rarr; `Agent Drafter` &rarr; `Human-in-the-Loop Gateway`.
   - Plain text technology stack tags and operational SLAs.

7. **Compliance Audit Trail**
   - Complete ledger of operator approvals, rejections with required reasons, edits, analysis replays, and system creation events.
   - Persistent across browser sessions via `localStorage`.
   - Filter by action type, search by actor/comment, and single-click JSON ledger export.

---

## Design System Specifications

TripShield enforces strict internal operations software design standards:
- **Palette**: Warm off-white canvas (`#FAF8F4`), clean white surfaces (`#FFFFFF`), dark slate text (`#1F2933`), and light grey borders (`#E4E0D8`).
- **Accent**: Deep teal (`#0F766E`).
- **Status Indicators**: Used sparingly: amber for warning (`#D97706`), red for critical (`#DC2626`), and green for approved (`#16A34A`).
- **Typography**: "Inter" for data-dense body text and "Source Serif 4" for page headers.
- **Visuals**: Clean line icons (`lucide-react`), SVG dependency trees, plain charts, and structured data tables. No AI buzzwords, no emojis, no dark mode, no glowing effects, and no glassmorphism.
- **Accessibility**: Keyboard navigable with visible focus outlines (`outline: 2px solid #0F766E`).

---

## Seeded Mock Data Summary

- **5 Incidents**:
  - `INC-2026-0841`: Severe Cyclonic Storm Alert (IMD Warning) — South Goa Coast (Critical)
  - `INC-2026-0842`: Runway Emergency Resurfacing & Slot Suspension — Mumbai BOM (High)
  - `INC-2026-0843`: Structural Safety Order & Heritage Wing Closure — The Leela Palace Jaipur (Medium)
  - `INC-2026-0844`: Flash Flood & Hill Route Inundation — Munnar & Alappuzha Kerala (High)
  - `INC-2026-0845`: Ground Crew & Fuel Tanker Wildcat Stoppage — Delhi T3 (Low)
- **12 Travellers**: Realistic Indian names, phone numbers, corporate and leisure tiers, disruption caps (₹12,000 to ₹40,000 INR).
- **25 Bookings**: Flights (IndiGo, Air India, Akasa), heritage resorts (Taj Exotica, Rambagh Palace, Kumarakom Lake Resort), transfers, and rail connections.
- **8 Policy Documents**: 24 codified sections citing real DGCA regulations and hotel force majeure protocols.

---

## Running the Application

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup & Launch
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open your browser to `http://localhost:5173` (or the URL printed by Vite).

### Production Build
```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```
