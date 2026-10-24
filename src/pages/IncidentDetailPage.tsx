import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Percent, 
  GitFork, 
  FileText, 
  CheckSquare, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../context';
import { SeverityBadge, IncidentStatusBadge } from '../components/Badge';
import { DependencyGraph } from '../components/DependencyGraph';
import { EvidenceTab } from '../components/EvidenceTab';
import { RecoveryPlanTab } from '../components/RecoveryPlanTab';
import { AgentActivityLog } from '../components/AgentActivityLog';
import { INITIAL_EVIDENCE_SNIPPETS } from '../data/mockData';

export const IncidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { incidents, travellers, bookings, recoveryPlans, isLoading } = useApp();

  const [activeTab, setActiveTab] = useState<'itineraries' | 'evidence' | 'recovery'>('recovery');

  const incident = useMemo(() => {
    return incidents.find(i => i.id === id);
  }, [incidents, id]);

  const affectedTravellers = useMemo(() => {
    if (!incident) return [];
    return travellers.filter(t => incident.affectedTravellerIds.includes(t.id));
  }, [incident, travellers]);

  const affectedBookings = useMemo(() => {
    if (!incident) return [];
    return bookings.filter(b => incident.affectedBookingIds.includes(b.id) || b.impactedByIncidentId === incident.id);
  }, [incident, bookings]);

  const relevantSnippets = useMemo(() => {
    if (!incident) return [];
    return INITIAL_EVIDENCE_SNIPPETS.filter(s => incident.evidenceSnippetIds.includes(s.id));
  }, [incident]);

  const incidentRecoveryPlans = useMemo(() => {
    if (!incident) return [];
    return recoveryPlans.filter(p => p.incidentId === incident.id);
  }, [incident, recoveryPlans]);

  const pendingPlansCount = useMemo(() => {
    return incidentRecoveryPlans.filter(p => p.status === 'Pending').length;
  }, [incidentRecoveryPlans]);

  const approvedPlansCount = useMemo(() => {
    return incidentRecoveryPlans.filter(p => p.status === 'Approved' || p.status === 'Edited & Approved').length;
  }, [incidentRecoveryPlans]);

  if (isLoading) {
    return (
      <div className="state-box">
        <div className="spinner" />
        <div className="state-title">Loading Incident Dossier...</div>
        <div className="state-desc">Retrieving graph topology, policy weights, and recovery plans.</div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="card">
        <div className="state-box">
          <div className="state-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="state-title">Incident Dossier Not Found</div>
          <div className="state-desc">The requested incident ID "{id}" does not exist in local operations storage.</div>
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/')}
            style={{ marginTop: '12px' }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Breadcrumb & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn btn-secondary btn-sm"
          style={{ padding: '4px 10px' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Operations Dashboard</span>
        </button>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Incident Protocol: <code style={{ color: 'var(--accent)', fontWeight: 600 }}>{incident.id}</code>
        </div>
      </div>

      {/* Incident Header Card */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '15px', color: 'var(--accent)' }}>
                {incident.id}
              </span>
              <SeverityBadge severity={incident.severity} />
              <IncidentStatusBadge status={incident.status} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {incident.type}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '900px', lineHeight: '1.45' }}>
              {incident.summary}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', minWidth: '180px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '4px 10px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              <Percent size={13} style={{ color: 'var(--accent)' }} />
              <span>Classifier Confidence: <strong>{incident.classifierConfidence}%</strong></span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Model: InTravel-RoBERTa-v2 (Transformer)
            </div>
          </div>
        </div>

        {/* Incident Metadata Strip */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '12px', 
            padding: '14px 16px', 
            backgroundColor: 'var(--bg-canvas)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius)',
            fontSize: '12px'
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Location & Sector</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{incident.location}</span>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{incident.coordinates}</div>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Detection Source</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{incident.source}</span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Detected Time</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{incident.detectedTime}</span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Recovery Approval Status</span>
            <span style={{ fontWeight: 600, color: pendingPlansCount === 0 ? 'var(--status-approved)' : 'var(--status-warning)' }}>
              {pendingPlansCount === 0 ? 'All Decisions Recorded' : `${pendingPlansCount} Options Awaiting Sign-Off`}
            </span>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{approvedPlansCount} approved</div>
          </div>
        </div>

        {/* User Guidance Banner */}
        <div style={{ padding: '12px 16px', backgroundColor: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 'var(--radius)', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>💡</span>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>What should you do? </strong>
            Review the suggested rebooking flights and cash compensation below. 1-click approve to book the alternate seat or issue an instant UPI payout to the stranded traveller.
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'recovery' ? 'active' : ''}`}
          onClick={() => setActiveTab('recovery')}
          title="Review alternative flights, train options, or instant UPI compensation payouts"
        >
          <CheckSquare size={16} />
          <span>1. Recovery Options (Rebook / Refund)</span>
          <span className="tab-count">{incidentRecoveryPlans.length}</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'itineraries' ? 'active' : ''}`}
          onClick={() => setActiveTab('itineraries')}
          title="See which flights, connecting legs, and hotel stays are at risk"
        >
          <GitFork size={16} />
          <span>2. Flights & Hotels Graph</span>
          <span className="tab-count">{affectedTravellers.length}</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
          onClick={() => setActiveTab('evidence')}
          title="See radar telemetry, NOTAM evidence, and DGCA policy rules"
        >
          <FileText size={16} />
          <span>3. Airline Lie-Detector & Legal Proof</span>
          <span className="tab-count">{relevantSnippets.length}</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'recovery' && (
        <RecoveryPlanTab
          plans={incidentRecoveryPlans}
          travellers={affectedTravellers}
          onOpenCitation={(_index) => {
            setActiveTab('evidence');
          }}
        />
      )}

      {activeTab === 'itineraries' && (
        <DependencyGraph
          travellers={affectedTravellers}
          bookings={affectedBookings}
          incidentId={incident.id}
        />
      )}

      {activeTab === 'evidence' && (
        <EvidenceTab
          snippets={relevantSnippets}
          flightNumber={affectedBookings.find(b => b.type === 'Flight')?.serviceName || '6E-2134'}
          tailNumber={affectedBookings.find(b => b.type === 'Flight')?.reference.includes('6E') ? 'VT-IKR' : 'VT-EXQ'}
        />
      )}

      {/* Agent Activity Execution Log */}
      <AgentActivityLog
        incidentId={incident.id}
        steps={incident.agentSteps}
      />
    </div>
  );
};
