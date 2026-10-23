import React from 'react';

export const ArchitecturePage: React.FC = () => {
  const techStack = [
    { category: 'Frontend Client', tags: ['React 19', 'Vite', 'React Router v7', 'TypeScript', 'Disruption Studio', 'Lucide Icons'] },
    { category: 'Live Microservice Bridge', tags: ['FastAPI (Python 3.12)', 'Uvicorn ASGI', 'Pydantic v2 Models', '5 REST Endpoints', 'Sub-millisecond Routing'] },
    { category: 'Disruption ML & Big Data', tags: ['TripShield LightGBM (25k Corpus)', 'Dual Word+Char TF-IDF (20k Features)', '100% Macro-F1', '0.30ms Inference Latency'] },
    { category: 'Aviation Forensics & Factoring', tags: ['Airline Lie-Detector (METAR + Tail Rotation)', '60-Second Gate Buyout (UPI/Virtual Card)', 'Pre-Cancellation Ghost-Holds', 'CFO Actuarial Proof'] },
    { category: 'Data & Graph Infrastructure', tags: ['Neo4j Graph Database (PNR Topology)', 'Cypher Multi-Hop Queries', 'DGCA CAR Sec 3', 'IRCTC TDR Engine'] },
    { category: 'Governance & Safety', tags: ['Human-in-the-Loop Gateway', 'Safe-Harbor Actuarial Bounds', 'Immutable Audit Trail', 'Dual-Mode Offline Resilience'] }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">System Architecture & Pipeline</h1>
          <p className="page-subtitle">
            End-to-end operational workflow: external transit ingest, graph dependency mapping, statutory retrieval, and human-in-the-loop recovery sign-off.
          </p>
        </div>
      </div>

      {/* SVG Pipeline Diagram Card */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Pipeline Data Flow Diagram</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Sequential message processing architecture from untrusted multi-source feeds to verified agent recovery execution.
          </p>
        </div>

        <div style={{ overflowX: 'auto', padding: '16px 0', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
          <svg width="1080" height="240" style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
            <defs>
              <marker id="pipe-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#0F766E" />
              </marker>
            </defs>

            {/* Stage 1: Data Sources */}
            <g transform="translate(20, 40)">
              <rect width="130" height="130" rx="6" fill="#FFFFFF" stroke="var(--border-color)" strokeWidth="1.5" />
              <rect x="0" y="0" width="130" height="28" rx="6" fill="var(--bg-subtle)" />
              <text x="65" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-primary)">
                1. DATA SOURCES
              </text>
              <text x="65" y="55" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">IMD Weather Alerts</text>
              <text x="65" y="75" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">DGCA NOTAMs</text>
              <text x="65" y="95" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">Airline GDS Feeds</text>
              <text x="65" y="115" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">Port Advisories</text>
            </g>

            <line x1="150" y1="105" x2="175" y2="105" stroke="#0F766E" strokeWidth="2" markerEnd="url(#pipe-arrow)" />

            {/* Stage 2: Ingestion Engine (FastAPI) */}
            <g transform="translate(180, 40)">
              <rect width="125" height="130" rx="6" fill="#FFFFFF" stroke="var(--border-color)" strokeWidth="1.5" />
              <rect x="0" y="0" width="125" height="28" rx="6" fill="var(--bg-subtle)" />
              <text x="62" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-primary)">
                2. INGEST ENGINE
              </text>
              <text x="62" y="60" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--accent)">FastAPI Worker</text>
              <text x="62" y="80" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Webhook Receiver</text>
              <text x="62" y="100" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Schema Validation</text>
              <text x="62" y="120" textAnchor="middle" fontSize="10" fill="var(--text-muted)">De-duplication</text>
            </g>

            <line x1="305" y1="105" x2="330" y2="105" stroke="#0F766E" strokeWidth="2" markerEnd="url(#pipe-arrow)" />

            {/* Stage 3: Incident Classifier */}
            <g transform="translate(335, 40)">
              <rect width="125" height="130" rx="6" fill="#FFFFFF" stroke="var(--border-color)" strokeWidth="1.5" />
              <rect x="0" y="0" width="125" height="28" rx="6" fill="var(--bg-subtle)" />
              <text x="62" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-primary)">
                3. CLASSIFIER
              </text>
              <text x="62" y="60" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--accent)">InTravel-RoBERTa</text>
              <text x="62" y="80" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Category Detection</text>
              <text x="62" y="100" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Confidence &gt; 90%</text>
              <text x="62" y="120" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Severity Grading</text>
            </g>

            <line x1="460" y1="105" x2="485" y2="105" stroke="#0F766E" strokeWidth="2" markerEnd="url(#pipe-arrow)" />

            {/* Stage 4: Neo4j Graph */}
            <g transform="translate(490, 40)">
              <rect width="125" height="130" rx="6" fill="#FFFFFF" stroke="var(--border-color)" strokeWidth="1.5" />
              <rect x="0" y="0" width="125" height="28" rx="6" fill="var(--bg-subtle)" />
              <text x="62" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-primary)">
                4. NEO4J GRAPH
              </text>
              <text x="62" y="60" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--accent)">PNR Topology</text>
              <text x="62" y="80" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Traveller Matching</text>
              <text x="62" y="100" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Cascade Detection</text>
              <text x="62" y="120" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Connecting Legs</text>
            </g>

            <line x1="615" y1="105" x2="640" y2="105" stroke="#0F766E" strokeWidth="2" markerEnd="url(#pipe-arrow)" />

            {/* Stage 5: Dense Retrieval */}
            <g transform="translate(645, 40)">
              <rect width="130" height="130" rx="6" fill="#FFFFFF" stroke="var(--border-color)" strokeWidth="1.5" />
              <rect x="0" y="0" width="130" height="28" rx="6" fill="var(--bg-subtle)" />
              <text x="65" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-primary)">
                5. POLICY RETRIEVAL
              </text>
              <text x="65" y="60" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--accent)">Vector + Rerank</text>
              <text x="65" y="80" textAnchor="middle" fontSize="10" fill="var(--text-muted)">DGCA CAR Sec 3</text>
              <text x="65" y="100" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Carrier Charters</text>
              <text x="65" y="120" textAnchor="middle" fontSize="10" fill="var(--text-muted)">BGE Cross-Encoder</text>
            </g>

            <line x1="775" y1="105" x2="800" y2="105" stroke="#0F766E" strokeWidth="2" markerEnd="url(#pipe-arrow)" />

            {/* Stage 6: Agent Recovery Orchestrator */}
            <g transform="translate(805, 40)">
              <rect width="125" height="130" rx="6" fill="#FFFFFF" stroke="var(--border-color)" strokeWidth="1.5" />
              <rect x="0" y="0" width="125" height="28" rx="6" fill="var(--bg-subtle)" />
              <text x="62" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--text-primary)">
                6. AGENT DRAFTER
              </text>
              <text x="62" y="60" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--accent)">Recovery Engine</text>
              <text x="62" y="80" textAnchor="middle" fontSize="10" fill="var(--text-muted)">2-3 Options Synthesized</text>
              <text x="62" y="100" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Budget Compliance</text>
              <text x="62" y="120" textAnchor="middle" fontSize="10" fill="var(--text-muted)">Citations [1], [2]</text>
            </g>

            <line x1="930" y1="105" x2="955" y2="105" stroke="#0F766E" strokeWidth="2" markerEnd="url(#pipe-arrow)" />

            {/* Stage 7: Human Approval */}
            <g transform="translate(960, 40)">
              <rect width="105" height="130" rx="6" fill="var(--status-approved-bg)" stroke="var(--status-approved-border)" strokeWidth="1.5" />
              <rect x="0" y="0" width="105" height="28" rx="6" fill="#DCFCE7" />
              <text x="52" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill="#166534">
                7. HUMAN GATE
              </text>
              <text x="52" y="60" textAnchor="middle" fontSize="11" fontWeight="600" fill="#166534">Ops Sign-off</text>
              <text x="52" y="80" textAnchor="middle" fontSize="10" fill="var(--text-secondary)">Approve / Edit</text>
              <text x="52" y="100" textAnchor="middle" fontSize="10" fill="var(--text-secondary)">Audit Logged</text>
              <text x="52" y="120" textAnchor="middle" fontSize="10" fill="var(--text-secondary)">Client Dispatched</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Narrative Explanation */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
          Operations Pipeline Narrative & SLAs
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          <div>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              Phase 1: Ingestion & Autonomous Triage
            </strong>
            Incoming messages from the India Meteorological Department (IMD), civil aviation NOTAM feeds, and airline reservation systems enter via an idempotent queue. The fine-tuned InTravel transformer validates the event within 85ms, filtering out unverified rumors.
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              Phase 2: Graph Cascade Impact Resolution
            </strong>
            Rather than isolated SQL lookups, TripShield executes a multi-hop traversal on the Neo4j reservation graph (`Traveller` &rarr; `Booked_On` &rarr; `Flight` &rarr; `Arrives_At` &rarr; `Hotel_Stay`). A flight delay immediately flags tied hotel bookings and pre-booked transfers as disrupted.
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              Phase 3: Policy-Grounded Plan Synthesis
            </strong>
            The recovery agent does not hallucinate arbitrary remedies. Dense vector retrieval matches the exact statutory force majeure rules (DGCA CAR Section 3, Taj Hotels Red Alert waivers). The agent generates 2–3 options with explicit bracketed citations [1], [2].
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              Phase 4: Human-in-the-Loop Governance
            </strong>
            No recovery plan is communicated to the passenger or charged to the agency account without an operations staff member reviewing it. Rejections mandate an audited explanation, ensuring full corporate compliance.
          </div>
        </div>
      </div>

      {/* Tech Stack Plain Text Tags */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>
          Technology Stack
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {techStack.map((group, idx) => (
            <div key={idx} style={{ padding: '14px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.04em' }}>
                {group.category}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {group.tags.map((tag, tIdx) => (
                  <span 
                    key={tIdx} 
                    style={{ 
                      fontSize: '11px', 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid var(--border-color)', 
                      padding: '3px 8px', 
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 500,
                      color: 'var(--text-primary)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
