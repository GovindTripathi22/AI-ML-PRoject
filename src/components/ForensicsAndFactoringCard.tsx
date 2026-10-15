import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Plane, 
  Wind, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Lock, 
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

export interface ForensicsProps {
  flightNumber?: string;
  tailNumber?: string;
  airlineClaimedExcuse?: string;
  metarWindKts?: number;
  metarVisibilityKm?: number;
  peerDeparturesOnTimePct?: number;
  inboundTailDelayMins?: number;
  statutoryAmount?: number;
  instantBuyoutAmount?: number;
  winProbabilityPct?: number;
  expectedCfoSavings?: number;
  initialJurisdiction?: 'DGCA' | 'EU261' | 'DOT';
}

export const ForensicsAndFactoringCard: React.FC<ForensicsProps> = ({
  flightNumber = '6E-2134',
  tailNumber = 'VT-IKR',
  airlineClaimedExcuse = 'Adverse weather & severe air traffic flow control at departure runway',
  metarWindKts = 11.0,
  metarVisibilityKm = 9.5,
  peerDeparturesOnTimePct = 86.0,
  inboundTailDelayMins = 105,
  statutoryAmount = 7500,
  instantBuyoutAmount = 6120,
  winProbabilityPct = 94,
  expectedCfoSavings = 8450,
  initialJurisdiction = 'DGCA',
}) => {
  const [jurisdiction, setJurisdiction] = useState<'DGCA' | 'EU261' | 'DOT'>(initialJurisdiction);
  const [payoutClaimed, setPayoutClaimed] = useState(false);
  const [ghostHoldConverted, setGhostHoldConverted] = useState(false);

  // Dynamic values based on selected jurisdiction
  const currencySymbol = jurisdiction === 'DGCA' ? '₹' : jurisdiction === 'EU261' ? '€' : '$';
  const currencyCode = jurisdiction === 'DGCA' ? 'INR' : jurisdiction === 'EU261' ? 'EUR' : 'USD';
  
  const displayStatutory = jurisdiction === 'DGCA' ? statutoryAmount : jurisdiction === 'EU261' ? 600 : 450;
  const displayBuyout = jurisdiction === 'DGCA' ? instantBuyoutAmount : jurisdiction === 'EU261' ? 485 : 365;
  const displayCfoSavings = jurisdiction === 'DGCA' ? expectedCfoSavings : jurisdiction === 'EU261' ? 680 : 740;
  
  const precedentCitation = jurisdiction === 'DGCA'
    ? 'DGCA CAR Section 3, Series M, Part IV (Clause 3.3.2) - Carrier cannot claim extraordinary weather exemption when rotational fleet delay is primary root cause.'
    : jurisdiction === 'EU261'
    ? 'CJEU Case C-549/07 (Wallentin-Hermann) & C-294/10 (Eglītis) - Upstream aircraft rotation delays do NOT constitute extraordinary circumstances under Art 5(3).'
    : 'US DOT 14 CFR Part 259 - Controllable carrier delay restitution; meteorological defense refuted by local surface telemetry.';

  const recommendedAuthority = jurisdiction === 'DGCA'
    ? 'MoCA AirSewa Portal & DGCA Consumer Cell (India)'
    : jurisdiction === 'EU261'
    ? 'SÖP (Germany) / AESA (Spain) / CAA (UK261)'
    : 'US DOT Aviation Consumer Protection Division';

  const payoutRail = jurisdiction === 'DGCA'
    ? 'Instant UPI (VPA) / IMPS Direct Bank Transfer'
    : jurisdiction === 'EU261'
    ? 'TripShield Virtual Visa (EUR Instant Token)'
    : 'TripShield Virtual Mastercard (USD)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '16px' }}>
      
      {/* 1. AIRLINE LIE-DETECTOR FORENSICS PANEL */}
      <div 
        className="card" 
        style={{ 
          padding: '20px', 
          borderLeft: '4px solid var(--status-critical)',
          backgroundColor: '#0F172A',
          color: '#F8FAFC'
        }}
      >
        {/* Header Strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span 
              style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.2)', 
                color: '#F87171', 
                border: '1px solid rgba(239, 68, 68, 0.4)',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <ShieldAlert size={13} />
              Exemption Fraud Detected ({winProbabilityPct}% Confidence)
            </span>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#94A3B8' }}>
              Tail #{tailNumber} &bull; Flight {flightNumber}
            </span>
          </div>

          {/* Jurisdiction Selector Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {(['DGCA', 'EU261', 'DOT'] as const).map(j => (
              <button
                key={j}
                type="button"
                onClick={() => setJurisdiction(j)}
                style={{
                  background: jurisdiction === j ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                  color: jurisdiction === j ? '#FFFFFF' : '#94A3B8',
                  border: '1px solid ' + (jurisdiction === j ? 'var(--accent)' : 'rgba(255,255,255,0.15)'),
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {j === 'DGCA' ? 'DGCA (India ₹)' : j === 'EU261' ? 'EU261 (Europe €)' : 'US DOT ($)'}
              </button>
            ))}
          </div>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>
          Aviation Forensics: Airline &ldquo;Extraordinary Circumstance&rdquo; Rebuttal Engine
        </h3>
        <p style={{ fontSize: '12px', color: '#CBD5E1', marginBottom: '14px', lineHeight: '1.45' }}>
          Cross-examines the carrier&apos;s claimed defense against live NOAA/IMD METAR surface observations, runway peer departure rates, and upstream aircraft tail-number rotation logs.
        </p>

        {/* 3 Telemetry Evidence Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '14px' }}>
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <AlertTriangle size={12} style={{ color: '#F87171' }} />
              Airline Claimed Excuse
            </div>
            <div style={{ color: '#F87171', fontWeight: 600, fontSize: '12px', marginTop: '6px', lineHeight: '1.4' }}>
              &ldquo;{airlineClaimedExcuse}&rdquo;
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Wind size={12} style={{ color: '#34D399' }} />
              Surface METAR Telemetry
            </div>
            <div style={{ color: '#34D399', fontWeight: 600, fontSize: '12px', marginTop: '6px', lineHeight: '1.4' }}>
              {metarWindKts} kts wind &bull; {metarVisibilityKm} km vis &bull; {peerDeparturesOnTimePct}% runway peers departed on time
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={12} style={{ color: '#FBBF24' }} />
              True Upstream Root Cause
            </div>
            <div style={{ color: '#FBBF24', fontWeight: 600, fontSize: '12px', marginTop: '6px', lineHeight: '1.4' }}>
              Inbound Tail {tailNumber} arrived {inboundTailDelayMins}m late (2 legs prior in rotational chain)
            </div>
          </div>
        </div>

        {/* Legal Precedent Match & Rebuttal Box */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid #334155', borderRadius: '6px', padding: '10px 14px', fontSize: '12px', color: '#E2E8F0', lineHeight: '1.5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--accent)', marginBottom: '4px' }}>
            <FileCheck2 size={14} />
            Statutory Legal Precedent Citation:
          </div>
          <div>{precedentCitation}</div>
          <div style={{ marginTop: '6px', fontSize: '11px', color: '#94A3B8' }}>
            Escalation Authority: <strong style={{ color: '#E2E8F0' }}>{recommendedAuthority}</strong>
          </div>
        </div>
      </div>

      {/* 2. INSTANT PARAMETRIC FACTORING & GHOST-HOLD PANEL */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        
        {/* Instant Buyout Card */}
        <div 
          className="card" 
          style={{ 
            padding: '20px', 
            backgroundColor: '#0F172A', 
            color: '#F8FAFC',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#34D399', letterSpacing: '0.05em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={13} />
              TripShield Instant Liquidity (Zero 6-Month Wait)
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
              Instant Gate Buyout: {currencySymbol}{displayBuyout.toLocaleString()}{' '}
              <span style={{ fontSize: '12px', fontWeight: 400, color: '#94A3B8' }}>
                (of {currencySymbol}{displayStatutory.toLocaleString()} {currencyCode} statutory claim)
              </span>
            </h4>
            <p style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: '1.5', marginBottom: '14px' }}>
              Airlines take 6 to 18 months to pay claims. Based on our <strong>{winProbabilityPct}% verified ML legal probability</strong>, TripShield factors your claim instantly and wires funds in under 45 seconds.
            </p>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '16px' }}>
              Disbursement Rail: <code style={{ color: '#34D399', backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{payoutRail}</code>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPayoutClaimed(true)}
            disabled={payoutClaimed}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: payoutClaimed ? 'default' : 'pointer',
              backgroundColor: payoutClaimed ? '#065F46' : '#10B981',
              color: payoutClaimed ? '#A7F3D0' : '#042F2E',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.2s ease'
            }}
          >
            {payoutClaimed ? (
              <>
                <CheckCircle2 size={14} />
                <span>✓ {currencySymbol}{displayBuyout.toLocaleString()} Dispatched via {jurisdiction === 'DGCA' ? 'UPI' : 'Virtual Card'}</span>
              </>
            ) : (
              <>
                <DollarSign size={14} />
                <span>Accept Instant {currencySymbol}{displayBuyout.toLocaleString()} Payout (Subrogate Claim)</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>

        {/* Pre-Cancellation Ghost-Hold & CFO Actuarial Proof */}
        <div 
          className="card" 
          style={{ 
            padding: '20px', 
            backgroundColor: '#0F172A', 
            color: '#F8FAFC',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#60A5FA', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Plane size={13} />
                Pre-Cancellation Ghost-Hold
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93C5FD', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                Seat 4A Locked &bull; TTL 2h 41m
              </span>
            </div>
            
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
              CFO Safe-Harbor Net Savings: +{currencySymbol}{displayCfoSavings.toLocaleString()}
            </h4>
            <p style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: '1.5', marginBottom: '14px' }}>
              Upstream tail rotation lag detected 2.5 hours before official carrier announcement. The expected cost of inaction (hotel + executive SLA loss + surge fare) exceeds rebooking cost by <strong>+{currencySymbol}{displayCfoSavings.toLocaleString()}</strong>.
            </p>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '16px' }}>
              Actuarial Status: <span style={{ color: '#60A5FA', fontWeight: 600 }}>Auto-Approved by Policy Safe-Harbor Engine</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setGhostHoldConverted(true)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: ghostHoldConverted ? 'default' : 'pointer',
              backgroundColor: ghostHoldConverted ? '#1E3A8A' : '#2563EB',
              color: ghostHoldConverted ? '#BFDBFE' : '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.2s ease'
            }}
          >
            {ghostHoldConverted ? (
              <>
                <CheckCircle2 size={14} />
                <span>✓ Boarding Pass Issued (Seat 4A) & Logged to Audit Trail</span>
              </>
            ) : (
              <>
                <Lock size={13} />
                <span>Convert Ghost-Hold to Confirmed Boarding Pass (1-Tap)</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
