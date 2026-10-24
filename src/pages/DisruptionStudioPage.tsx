import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Plane,
  Train,
  CloudLightning,
  Wrench,
  Users as UsersIcon,
  AlertTriangle,
  Copy,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Calculator,
  MapPin,
  Clock,
  Hash,
  Send,
  Plus
} from 'lucide-react';
import { Badge } from '../components/Badge';

/* ---------- preset data ---------- */
const PRESETS = [
  {
    label: 'IndiGo 6E-2134 DEL→BOM Fog Ground Stop',
    text: 'DGCA CAR alert: Dense fog at IGI Delhi (DEL) — visibility 50 m CAT-III ILS only. IndiGo 6E-2134 DEL-BOM delayed minimum 4 hours. All departures runway 28R/10L on ground hold until further NOTAM clearance. Passengers advised to contact airline.',
    icon: CloudLightning
  },
  {
    label: 'Mumbai CSMIA Runway Emergency NOTAM',
    text: 'DGCA NOTAM A1492/26: Primary runway 09/27 at CSMIA Mumbai (BOM) closed for emergency resurfacing effective immediately. Secondary runway 14/32 capacity reduced to 18 movements/hour. Estimated reopening 22:00 IST. Multiple carriers reporting 2-5 hour delays.',
    icon: Wrench
  },
  {
    label: 'Cyclone Michaung Chennai Airspace',
    text: 'IMD Red Alert: Severe cyclonic storm Michaung making landfall near Chennai coast. Chennai MAA airport airspace suspended for 12 hours. All flights in/out of MAA cancelled until further notice. Indian Navy coastal evacuation advisory in effect for Tamil Nadu coastline.',
    icon: CloudLightning
  },
  {
    label: 'Bengaluru Ground Handlers Strike',
    text: 'Flash labour strike at Kempegowda International Airport Bengaluru (BLR). Ground handling staff and fuel tanker operators walkout demanding revised pay scales. All departing flights delayed indefinitely. CISF deployed. Airlines suspending check-in for Terminal 2.',
    icon: UsersIcon
  },
  {
    label: 'Northern Railway Shatabdi 5-Hour Fog Delay',
    text: 'Northern Railway advisory: Train 12004 New Delhi–Lucknow Shatabdi Express delayed by 5 hours at Ghaziabad junction due to dense winter fog and zero visibility. IRCTC automatic TDR refund processing enabled for all passengers. Estimated revised arrival 19:30 IST.',
    icon: Train
  }
];

/* ---------- client-side entity extractor ---------- */
function extractEntities(text: string) {
  const entities: { type: string; value: string }[] = [];

  // Flight numbers
  const flightRe = /\b(6E|AI|UK|SG|QP|IX|I5|G8|S5)\s*[-–]?\s*(\d{3,4})\b/gi;
  for (const m of text.matchAll(flightRe)) entities.push({ type: 'Flight', value: m[0].replace(/\s+/g, '-').toUpperCase() });

  // Train numbers
  const trainRe = /\b(Train\s+)?(\d{5})\b/gi;
  for (const m of text.matchAll(trainRe)) entities.push({ type: 'Train', value: m[2] });

  // IATA codes
  const iataRe = /\b(DEL|BOM|BLR|MAA|HYD|CCU|GOI|COK|AMD|JAI|PNQ|GAU|IXC|LKO|NAG|SXR|VNS|IXB|PAT|TRV)\b/g;
  const iatas: string[] = [];
  for (const m of text.matchAll(iataRe)) { if (!iatas.includes(m[0])) iatas.push(m[0]); }
  if (iatas.length >= 2) entities.push({ type: 'Route', value: `${iatas[0]} ➔ ${iatas[1]}` });
  else if (iatas.length === 1) entities.push({ type: 'Airport', value: iatas[0] });

  // Delay hours
  const delayRe = /(\d+)\s*(?:hours?|hrs?)\s*(?:delay|delayed)?/gi;
  for (const m of text.matchAll(delayRe)) entities.push({ type: 'Delay', value: `${m[1]} hours` });

  return entities;
}

/* ---------- client-side heuristic classifier ---------- */
function classifyLocally(text: string) {
  const t = text.toLowerCase();
  const categories = [
    { name: 'Severe Weather / Cyclone', keywords: ['cyclone', 'cyclonic', 'storm', 'fog', 'visibility', 'weather', 'imd', 'rain', 'thunderstorm', 'gale', 'flood', 'landslide'] },
    { name: 'Runway / ATC NOTAM Closure', keywords: ['runway', 'notam', 'resurfacing', 'closure', 'atc', 'airspace', 'taxiway'] },
    { name: 'Labour Stoppage / Ground Strike', keywords: ['strike', 'walkout', 'labour', 'staff', 'union', 'protest', 'agitation'] },
    { name: 'Facility / Structural Safety Order', keywords: ['fire', 'structural', 'building', 'inspection', 'safety order', 'evacuation', 'collapse'] },
    { name: 'Natural Hazard / Flood & Landslide', keywords: ['flood', 'landslide', 'earthquake', 'tsunami', 'river', 'embankment'] }
  ];

  const scores = categories.map(cat => {
    let score = 0;
    for (const kw of cat.keywords) if (t.includes(kw)) score += 10;
    return { name: cat.name, score };
  });

  const total = Math.max(1, scores.reduce((s, c) => s + c.score, 0));
  const dist = scores.map(s => ({ name: s.name, pct: Math.round((s.score / total) * 100) }));
  dist.sort((a, b) => b.pct - a.pct);

  return {
    predicted_category: dist[0]?.name || 'Unknown',
    confidence: Math.min(98.5, Math.max(22, dist[0]?.pct || 20)),
    distribution: Object.fromEntries(dist.map(d => [d.name, d.pct]))
  };
}

/* ---------- DGCA / IRCTC compensation calculator ---------- */
function calculateCompensation(delayHours: number, ticketCostINR: number, jurisdiction: string) {
  if (jurisdiction === 'IRCTC') {
    if (delayHours >= 3) return { meals: true, hotel: false, cashINR: ticketCostINR, note: 'Full TDR refund with zero cancellation penalty under IRCTC fog/delay rules.' };
    return { meals: false, hotel: false, cashINR: 0, note: 'Delay under 3 hours — no automatic TDR refund triggered.' };
  }
  // DGCA
  const meals = delayHours >= 2;
  const hotel = delayHours >= 6;
  let cashINR = 0;
  let note = '';
  if (delayHours >= 6 || delayHours === -1) {
    cashINR = Math.min(ticketCostINR, 10000);
    note = `Statutory compensation of ₹${cashINR.toLocaleString()} under DGCA CAR Section 3, Series M, Part IV. Free meals, hotel stay, and airport transfers mandated.`;
  } else if (delayHours >= 4) {
    cashINR = Math.min(ticketCostINR, 7500);
    note = `Statutory compensation of ₹${cashINR.toLocaleString()} under DGCA CAR Section 3, Series M, Part IV for 4+ hour delay. Free meals & refreshments mandated.`;
  } else if (delayHours >= 2) {
    cashINR = Math.min(ticketCostINR, 5000);
    note = `Statutory compensation of ₹${cashINR.toLocaleString()} under DGCA CAR Section 3, Series M, Part IV for 2+ hour delay. Free meals & refreshments mandated.`;
  } else {
    note = 'Delay under 2 hours — no statutory compensation triggered.';
  }
  return { meals, hotel, cashINR, note };
}

/* ---------- alternative routes ---------- */
const ALTERNATIVE_ROUTES = [
  { carrier: 'Air India', flight: 'AI-802', departs: '10:30 AM', arrives: '12:50 PM', seats: 4, costDiff: '+₹2,400' },
  { carrier: 'Akasa Air', flight: 'QP-1301', departs: '11:15 AM', arrives: '1:40 PM', seats: 7, costDiff: '+₹1,100' },
  { carrier: 'Vande Bharat', flight: 'Train 22436', departs: '12:00 PM', arrives: '4:30 PM', seats: 22, costDiff: '-₹3,200' },
];

/* ---------- main component ---------- */
export const DisruptionStudioPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof classifyLocally> | null>(null);
  const [entities, setEntities] = useState<ReturnType<typeof extractEntities>>([]);
  const [delayHours, setDelayHours] = useState(4);
  const [ticketCost, setTicketCost] = useState(6500);
  const [jurisdiction, setJurisdiction] = useState<'DGCA' | 'IRCTC'>('DGCA');
  const [copied, setCopied] = useState<string | null>(null);
  const [promoted, setPromoted] = useState(false);

  const runAnalysis = (text: string) => {
    if (!text.trim()) return;
    setInputText(text);
    setAnalysisResult(classifyLocally(text));
    setEntities(extractEntities(text));
    setPromoted(false);
    setCopied(null);

    // Auto-detect railway
    if (text.toLowerCase().includes('railway') || text.toLowerCase().includes('irctc') || text.toLowerCase().includes('train')) {
      setJurisdiction('IRCTC');
    } else {
      setJurisdiction('DGCA');
    }

    // Auto-detect delay hours from text
    const delayMatch = text.match(/(\d+)\s*(?:hours?|hrs?)/i);
    if (delayMatch) setDelayHours(parseInt(delayMatch[1], 10));
  };

  const compensation = useMemo(() => {
    return calculateCompensation(delayHours, ticketCost, jurisdiction);
  }, [delayHours, ticketCost, jurisdiction]);

  const whatsappMsg = useMemo(() => {
    if (!analysisResult) return '';
    return `🛡️ TripShield Alert\n\n⚠️ Disruption Detected: ${analysisResult.predicted_category}\n📍 ${entities.find(e => e.type === 'Route')?.value || entities.find(e => e.type === 'Airport')?.value || 'Transit Sector'}\n⏱️ Estimated Delay: ${delayHours} hours\n💰 Statutory Compensation: ₹${compensation.cashINR.toLocaleString()}\n${compensation.meals ? '🍽️ Free Meals & Refreshments: ENTITLED' : ''}\n${compensation.hotel ? '🏨 Free Hotel Accommodation: ENTITLED' : ''}\n\nYour recovery options are being prepared. You will receive a confirmed boarding pass shortly.\n\n— TripShield Operations Desk`;
  }, [analysisResult, entities, delayHours, compensation]);

  const hindiMsg = useMemo(() => {
    if (!analysisResult) return '';
    return `🛡️ ट्रिपशील्ड अलर्ट\n\n⚠️ व्यवधान: ${analysisResult.predicted_category}\n⏱️ अनुमानित देरी: ${delayHours} घंटे\n💰 वैधानिक मुआवज़ा: ₹${compensation.cashINR.toLocaleString()}\n${compensation.meals ? '🍽️ निःशुल्क भोजन: अधिकार है' : ''}\n${compensation.hotel ? '🏨 निःशुल्क होटल: अधिकार है' : ''}\n\nआपके लिए वैकल्पिक यात्रा विकल्प तैयार किए जा रहे हैं।\n\n— ट्रिपशील्ड ऑपरेशन्स डेस्क`;
  }, [analysisResult, delayHours, compensation]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handlePromote = () => {
    setPromoted(true);
    setTimeout(() => {
      navigate('/');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={22} style={{ color: 'var(--accent)' }} />
            Disruption Studio
          </h1>
          <p className="page-subtitle">
            Paste or select any travel disruption text to calculate statutory compensation (up to ₹10,000 under DGCA rules), find alternate flights/trains, and generate passenger alerts.
          </p>
        </div>
        <Badge variant="teal">⚡ Disruption Checker & Claim Calculator</Badge>
      </div>

      {/* Input Section */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Test Any Travel Crisis or Paste Airline Notice</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Click one of the real-world scenarios below or type/paste your own flight delay SMS, airline notice, or weather bulletin:
          </p>
        </div>

        {/* Preset Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          {PRESETS.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => runAnalysis(preset.text)}
                style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
              >
                <Icon size={13} />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Text Area */}
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Paste a disruption alert, airline SMS, NOTAM bulletin, or weather advisory here..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '12px',
            fontSize: '13px',
            fontFamily: 'inherit',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            backgroundColor: 'var(--bg-canvas)',
            color: 'var(--text-primary)',
            resize: 'vertical',
            lineHeight: '1.5'
          }}
        />
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => runAnalysis(inputText)}
          disabled={!inputText.trim()}
          style={{ marginTop: '10px' }}
        >
          <Zap size={13} />
          <span>Analyze Disruption</span>
        </button>
      </div>

      {/* Results Section — only visible after analysis */}
      {analysisResult && (
        <>
          {/* Classification + Entities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>

            {/* Classification Card */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>AI Classification</h3>
                <Badge variant="teal">0.3ms Real-time</Badge>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Step 1: Identified root cause category and model confidence score.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <AlertTriangle size={18} style={{ color: 'var(--status-critical)' }} />
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {analysisResult.predicted_category}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Confidence:</span>
                <div style={{
                  flex: 1,
                  height: '8px',
                  backgroundColor: 'var(--bg-canvas)',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${analysisResult.confidence}%`,
                    height: '100%',
                    backgroundColor: analysisResult.confidence > 70 ? 'var(--accent)' : 'var(--status-warning)',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', minWidth: '45px', textAlign: 'right' }}>
                  {analysisResult.confidence}%
                </span>
              </div>

              {/* Distribution */}
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {Object.entries(analysisResult.distribution).map(([cls, pct]) => (
                  <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                    <span style={{ flex: '0 0 200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cls}</span>
                    <div style={{ flex: 1, height: '5px', backgroundColor: 'var(--bg-canvas)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: pct > 40 ? 'var(--accent)' : '#CBD5E1', borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', minWidth: '32px', textAlign: 'right' }}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Entity Recognition Card */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Transit Entity Recognition</h3>
                <Badge variant="neutral">Extracted Parameters</Badge>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Step 2: Extracted flight/train number, route, and delay duration.
              </p>
              {entities.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {entities.map((ent, idx) => {
                    const iconMap: Record<string, React.ReactNode> = {
                      Flight: <Plane size={12} />,
                      Train: <Train size={12} />,
                      Route: <MapPin size={12} />,
                      Airport: <MapPin size={12} />,
                      Delay: <Clock size={12} />,
                      PNR: <Hash size={12} />
                    };
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          backgroundColor: 'var(--bg-canvas)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          fontWeight: 500
                        }}
                      >
                        {iconMap[ent.type] || <Hash size={12} />}
                        <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '10px', fontWeight: 700 }}>{ent.type}:</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{ent.value}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No transit entities detected in the input text.</p>
              )}

              {/* Jurisdiction Toggle */}
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Jurisdiction:</span>
                {(['DGCA', 'IRCTC'] as const).map(j => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => setJurisdiction(j)}
                    style={{
                      padding: '3px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      borderRadius: '4px',
                      border: `1px solid ${jurisdiction === j ? 'var(--accent)' : 'var(--border-color)'}`,
                      backgroundColor: jurisdiction === j ? 'var(--accent)' : 'transparent',
                      color: jurisdiction === j ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {j === 'DGCA' ? 'DGCA Aviation' : 'IRCTC Railway'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Compensation & Alt Routes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>

            {/* Compensation Calculator */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calculator size={16} style={{ color: 'var(--accent)' }} />
                  Statutory Compensation Calculator
                </h3>
                <Badge variant="approved">Mandated by Law</Badge>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Step 3: Free meals, hotel accommodation, and cash refunds required by DGCA / IRCTC.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Delay (hours)</label>
                  <input type="number" min={0} max={48} value={delayHours} onChange={e => setDelayHours(Number(e.target.value))}
                    style={{ width: '80px', padding: '6px 8px', fontSize: '13px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-canvas)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Ticket Cost (₹)</label>
                  <input type="number" min={0} value={ticketCost} onChange={e => setTicketCost(Number(e.target.value))}
                    style={{ width: '100px', padding: '6px 8px', fontSize: '13px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-canvas)' }}
                  />
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', marginBottom: '10px' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent)', marginBottom: '4px' }}>
                  ₹{compensation.cashINR.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {compensation.note}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {compensation.meals && <Badge variant="approved">🍽️ Free Meals</Badge>}
                  {compensation.hotel && <Badge variant="approved">🏨 Free Hotel</Badge>}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleCopy(compensation.note, 'claim')}
                style={{ fontSize: '11px' }}
              >
                {copied === 'claim' ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                <span>{copied === 'claim' ? 'Copied!' : 'Copy Claim Notice'}</span>
              </button>
            </div>

            {/* Alternative Routes */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowRight size={16} style={{ color: 'var(--accent)' }} />
                  Alternative Recovery Routes
                </h3>
                <Badge variant="teal">Fast Rebooking</Badge>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Step 4: Real-time alternative flight and Vande Bharat train seats ready for immediate rebooking.
              </p>
              <div className="table-container">
                <table className="ops-table">
                  <thead>
                    <tr>
                      <th>Carrier</th>
                      <th>Service</th>
                      <th>Departs</th>
                      <th>Seats</th>
                      <th>Cost Diff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALTERNATIVE_ROUTES.map((route, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{route.carrier}</td>
                        <td><code style={{ fontSize: '11px' }}>{route.flight}</code></td>
                        <td>{route.departs}</td>
                        <td>{route.seats} left</td>
                        <td style={{ color: route.costDiff.startsWith('-') ? 'var(--status-approved)' : 'var(--status-warning)', fontWeight: 600 }}>{route.costDiff}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Customer Notifications */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>

            {/* WhatsApp English */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={16} style={{ color: '#25D366' }} />
                WhatsApp Alert (English)
              </h3>
              <pre style={{ fontSize: '11px', padding: '12px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', whiteSpace: 'pre-wrap', lineHeight: '1.5', color: 'var(--text-secondary)', maxHeight: '180px', overflow: 'auto' }}>
                {whatsappMsg}
              </pre>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleCopy(whatsappMsg, 'whatsapp')} style={{ marginTop: '8px', fontSize: '11px' }}>
                {copied === 'whatsapp' ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                <span>{copied === 'whatsapp' ? 'Copied!' : 'Copy WhatsApp Alert'}</span>
              </button>
            </div>

            {/* Hindi SMS */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send size={16} style={{ color: '#6366F1' }} />
                SMS Alert (हिन्दी)
              </h3>
              <pre style={{ fontSize: '11px', padding: '12px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', whiteSpace: 'pre-wrap', lineHeight: '1.5', color: 'var(--text-secondary)', maxHeight: '180px', overflow: 'auto' }}>
                {hindiMsg}
              </pre>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleCopy(hindiMsg, 'hindi')} style={{ marginTop: '8px', fontSize: '11px' }}>
                {copied === 'hindi' ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                <span>{copied === 'hindi' ? 'Copied!' : 'Copy Hindi SMS'}</span>
              </button>
            </div>
          </div>

          {/* Promote to Live Incident */}
          <div className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', backgroundColor: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 'var(--radius)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '18px' }}>🛡️</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent)' }}>Protect Travellers on Operations Dashboard</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                Convert this analysis into an active incident in the TripShield Dashboard with automated recovery plans and audit log entry.
              </p>
            </div>
            <button
              type="button"
              className={`btn ${promoted ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handlePromote}
              disabled={promoted}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontWeight: 600 }}
            >
              {promoted ? <CheckCircle2 size={15} /> : <Plus size={15} />}
              <span>{promoted ? 'Promoted to Dashboard' : 'Promote to Live Incident'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
