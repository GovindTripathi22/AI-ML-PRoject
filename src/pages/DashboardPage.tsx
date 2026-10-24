import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertOctagon, 
  Users, 
  CalendarX2, 
  FileCheck, 
  Search, 
  Filter, 
  ArrowUpRight,
  RefreshCw,
  Zap 
} from 'lucide-react';
import { useApp } from '../context';
import { SeverityBadge, IncidentStatusBadge } from '../components/Badge';

export const DashboardPage: React.FC = () => {
  const { incidents, travellers, bookings, recoveryPlans, isLoading, refreshData } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Summary Metrics calculations
  const activeIncidentsCount = useMemo(() => {
    return incidents.filter(i => i.status === 'Active Investigation' || i.status === 'In Recovery').length;
  }, [incidents]);

  const uniqueAffectedTravellersCount = useMemo(() => {
    const ids = new Set<string>();
    incidents
      .filter(i => i.status !== 'Resolved')
      .forEach(i => i.affectedTravellerIds.forEach(id => ids.add(id)));
    return ids.size;
  }, [incidents]);

  const bookingsAtRiskCount = useMemo(() => {
    return bookings.filter(b => b.status === 'Disrupted').length;
  }, [bookings]);

  const plansAwaitingApprovalCount = useMemo(() => {
    return recoveryPlans.filter(p => p.status === 'Pending').length;
  }, [recoveryPlans]);

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      const matchSearch = 
        incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.source.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSeverity = 
        selectedSeverity === 'All' || incident.severity === selectedSeverity;

      const matchStatus = 
        selectedStatus === 'All' || incident.status === selectedStatus;

      return matchSearch && matchSeverity && matchStatus;
    });
  }, [incidents, searchTerm, selectedSeverity, selectedStatus]);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Operations Console</h1>
          <p className="page-subtitle">
            Live domestic transit disruption monitoring, automated risk graphing, and agent recovery dispatch.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/studio')}
            title="Open Disruption Studio to analyze alerts or ingest new disruptions"
          >
            <Zap size={13} />
            <span>Ingest & Analyze Disruption</span>
          </button>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={() => refreshData()}
            title="Refresh current state from storage"
          >
            <RefreshCw size={13} />
            <span>Sync Live Feed</span>
          </button>
        </div>
      </div>

      {/* How TripShield Works: Simple 3-Step Guide for Users */}
      <div 
        className="card" 
        style={{ 
          padding: '20px 24px', 
          marginBottom: '24px', 
          backgroundColor: '#FFFFFF', 
          border: '1px solid #CCFBF1',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #0D9488 0%, #10B981 50%, #3B82F6 100%)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#F0FDFA', border: '1px solid #99F6E4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '18px' }}>
              🛡️
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                How TripShield Protects Travellers in 3 Simple Steps
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                Automated real-time monitoring and legal protection compliant with national civil aviation protocols.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>⚖️</span>
            <strong style={{ fontSize: '11px', color: 'var(--text-primary)' }}>DGCA CAR Section 3 Compliant &bull; 0.3ms AI Detection</strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginTop: '16px' }}>
          <div style={{ padding: '14px 16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Stage 01</span>
              <span>📡</span>
            </div>
            <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>1. Instant Crisis Detection</strong>
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.4' }}>
              Scans weather radar, dense fog alerts, and airport NOTAM closures before airlines announce delays.
            </span>
          </div>

          <div style={{ padding: '14px 16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-approved)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Stage 02</span>
              <span>💰</span>
            </div>
            <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>2. Protect Your Rights & Money</strong>
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.4' }}>
              Automatically calculates statutory cash compensation (up to ₹10,000) and unlocks free meals/hotel vouchers.
            </span>
          </div>

          <div style={{ padding: '14px 16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Stage 03</span>
              <span>⚡</span>
            </div>
            <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>3. 1-Click Fast Rebooking</strong>
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.4' }}>
              Rebooks you on the next available flight, high-speed Vande Bharat train, or dispatches instant UPI cash refund.
            </span>
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div>
            <div className="metric-label">Active Incidents</div>
            <div className="metric-value">{activeIncidentsCount}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Active travel crises &bull; {incidents.length} total monitored
            </div>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--status-critical)' }}>
            <AlertOctagon size={22} />
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-label">Travellers Affected</div>
            <div className="metric-value">{uniqueAffectedTravellersCount}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Stranded passengers across {travellers.length} active bookings
            </div>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--accent)' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-label">Bookings at Risk</div>
            <div className="metric-value">{bookingsAtRiskCount}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Flights, resorts & ground legs
            </div>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--status-warning)' }}>
            <CalendarX2 size={22} />
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-label">Plans Awaiting Approval</div>
            <div className="metric-value" style={{ color: plansAwaitingApprovalCount > 0 ? 'var(--status-warning)' : 'var(--text-primary)' }}>
              {plansAwaitingApprovalCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              1-Click Rebooking options ready
            </div>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--status-approved)' }}>
            <FileCheck size={22} />
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout: Incidents Grid + Quick Recovery Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Incidents Table Card */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Detected Operational Incidents</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Click any incident row to inspect affected PNRs, retrieved supplier policies, and autonomous recovery plans.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search size={16} />
              <input
                type="text"
                className="form-input search-input"
                placeholder="Search by ID, disruption type, station or source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Severity:</span>
                <select
                  className="form-select"
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                >
                  <option value="All">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Status:</span>
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '12px' }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active Investigation">Active Investigation</option>
                  <option value="In Recovery">In Recovery</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Monitoring">Monitoring</option>
                </select>
              </div>

              {(searchTerm || selectedSeverity !== 'All' || selectedStatus !== 'All') && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSeverity('All');
                    setSelectedStatus('All');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Table / Empty State / Loading State */}
          {isLoading ? (
            <div className="state-box">
              <div className="spinner" />
              <div className="state-title">Loading Operations Manifest...</div>
              <div className="state-desc">Synchronizing local state with persistent operations storage.</div>
            </div>
          ) : filteredIncidents.length === 0 ? (
            <div className="state-box">
              <div className="state-icon">
                <Filter size={24} />
              </div>
              <div className="state-title">No matching incidents found</div>
              <div className="state-desc">
                No active operational incidents match your filter criteria ({searchTerm ? `"${searchTerm}"` : ''}). Try resetting filters.
              </div>
            </div>
          ) : (
            <div className="table-container">
              <table className="ops-table">
                <thead>
                  <tr>
                    <th>Incident ID</th>
                    <th>Disruption Type</th>
                    <th>Location & Station</th>
                    <th>Severity</th>
                    <th>Detected Time</th>
                    <th>Status</th>
                    <th>Affected Travellers</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncidents.map((incident) => {
                    return (
                      <tr
                        key={incident.id}
                        className="clickable-row"
                        onClick={() => navigate(`/incidents/${incident.id}`)}
                      >
                        <td>
                          <strong style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>
                            {incident.id}
                          </strong>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {incident.type}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', maxWidth: '360px', lineHeight: '1.3' }}>
                            {incident.summary.length > 95 ? incident.summary.slice(0, 95) + '...' : incident.summary}
                          </div>
                        </td>
                        <td>
                          <span>{incident.location}</span>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {incident.coordinates}
                          </div>
                        </td>
                        <td>
                          <SeverityBadge severity={incident.severity} />
                        </td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>
                          {incident.detectedTime}
                        </td>
                        <td>
                          <IncidentStatusBadge status={incident.status} />
                        </td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{incident.affectedTravellerIds.length} pax</span>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {incident.affectedBookingIds.length} bookings tied
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span 
                            className="btn btn-primary btn-sm"
                            style={{ padding: '5px 10px', fontSize: '11px', pointerEvents: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <span>View Options & Money</span>
                            <ArrowUpRight size={12} />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Quick Recovery & Money Preview (Inspired by Stitch MCP) */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span className="badge badge-teal" style={{ fontSize: '11px', fontWeight: 700 }}>
                ⚡ 1-Click Recovery Engine
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Sample: <strong>Rahul Sharma (DEL→BOM)</strong>
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Live Solution Preview
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              How TripShield instantly protects passengers stranded by flight IndiGo 6E-2134:
            </p>
          </div>

          {/* Option A: Next Flight */}
          <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>✈️ Switch to Flight AI-802</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Departs 09:30 AM (T3) &bull; Arrives 11:45 AM Mumbai</div>
              </div>
              <span className="badge badge-approved" style={{ fontSize: '10px' }}>Fastest (1h delay)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 600 }}>4 seats held</span>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/incidents/INC-2026-0841')}
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                Rebook Zero-Fee →
              </button>
            </div>
          </div>

          {/* Option B: Vande Bharat Express */}
          <div style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>🚆 Vande Bharat Express 22436</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Fog-immune ground route &bull; Executive Chair Car</div>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: '10px' }}>100% Reliable</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Station taxi transfer covered</span>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => navigate('/incidents/INC-2026-0841')}
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                Book Train Seat →
              </button>
            </div>
          </div>

          {/* Option C: Instant Payout */}
          <div style={{ padding: '14px', border: '1.5px solid #10B981', borderRadius: 'var(--radius)', backgroundColor: '#F0FDF4', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#065F46' }}>💰 Accept Instant ₹6,120 UPI Payout</strong>
                <div style={{ fontSize: '11px', color: '#166534', marginTop: '2px' }}>
                  ₹4,120 airfare refund + ₹2,000 DGCA statutory delay allowance
                </div>
              </div>
              <span className="badge badge-approved" style={{ fontSize: '10px' }}>Instant Bank UPI</span>
            </div>
            <button 
              type="button" 
              className="btn btn-success btn-sm"
              onClick={() => navigate('/incidents/INC-2026-0841')}
              style={{ width: '100%', padding: '7px 12px', fontSize: '12px', fontWeight: 600 }}
            >
              ✓ Dispatched via UPI in seconds →
            </button>
          </div>

          {/* DGCA Rule Clarification Box */}
          <div style={{ padding: '10px 12px', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
            ⚖️ <strong>DGCA Passenger Charter:</strong> For delays over 2 hours, airlines must provide free meals. For delays over 6 hours or cancellations, passengers are legally entitled to full cash compensation up to <strong>₹10,000</strong> directly.
          </div>
        </div>
      </div>
    </div>
  );
};
