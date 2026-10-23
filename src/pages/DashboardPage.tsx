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

      {/* Summary Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div>
            <div className="metric-label">Active Incidents</div>
            <div className="metric-value">{activeIncidentsCount}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {incidents.length} total monitored sectors
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
              Across {travellers.length} active agency bookings
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
              Human sign-off required
            </div>
          </div>
          <div className="metric-icon-box" style={{ color: 'var(--status-approved)' }}>
            <FileCheck size={22} />
          </div>
        </div>
      </div>

      {/* Incidents Table Card */}
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
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Source: {incident.source.length > 36 ? incident.source.slice(0, 36) + '...' : incident.source}
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
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11px', pointerEvents: 'none' }}
                        >
                          <span>Review</span>
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
    </div>
  );
};
