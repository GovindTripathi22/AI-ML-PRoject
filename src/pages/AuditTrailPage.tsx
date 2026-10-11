import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Download, 
  User, 
  Bot 
} from 'lucide-react';
import { useApp } from '../context';
import { Badge } from '../components/Badge';

export const AuditTrailPage: React.FC = () => {
  const { auditLogs } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  // Filter logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchSearch = 
        log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.incidentId && log.incidentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.travellerId && log.travellerId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.comment && log.comment.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchAction = actionFilter === 'All' || log.action === actionFilter;

      return matchSearch && matchAction;
    });
  }, [auditLogs, searchTerm, actionFilter]);

  const distinctActions = useMemo(() => {
    return Array.from(new Set(auditLogs.map(l => l.action)));
  }, [auditLogs]);

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tripshield_audit_trail_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getActionBadge = (action: string) => {
    if (action.includes('Approved')) {
      return <Badge variant="approved">{action}</Badge>;
    }
    if (action.includes('Rejected')) {
      return <Badge variant="critical">{action}</Badge>;
    }
    if (action.includes('Edited')) {
      return <Badge variant="teal">{action}</Badge>;
    }
    if (action.includes('Replayed') || action.includes('Drafted')) {
      return <Badge variant="teal">{action}</Badge>;
    }
    return <Badge variant="neutral">{action}</Badge>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Operations Audit Trail & Compliance Ledger</h1>
          <p className="page-subtitle">
            Immutable timeline of human approvals, rejection justifications, agent pipeline re-evaluations, and system incident ingest.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleExportJSON}
            title="Export full audit log as JSON"
          >
            <Download size={13} />
            <span>Export JSON Ledger</span>
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        {/* Search & Filter */}
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search audit trail by actor, incident, passenger ID, or operator comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Action:</span>
            <select
              className="form-select"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '12px' }}
            >
              <option value="All">All Actions ({auditLogs.length})</option>
              {distinctActions.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>

            {(searchTerm || actionFilter !== 'All') && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setActionFilter('All');
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Audit Log Table */}
        {filteredLogs.length === 0 ? (
          <div className="state-box">
            <div className="state-icon"><History size={24} /></div>
            <div className="state-title">No Audit Records Found</div>
            <div className="state-desc">No events match the selected filter. Perform an approval or reset filters.</div>
          </div>
        ) : (
          <div className="table-container">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Timestamp</th>
                  <th>Actor / Role</th>
                  <th>Action</th>
                  <th>Scope & Incident</th>
                  <th>State Transition</th>
                  <th>Audited Comments & Justification</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => {
                  const isAgent = log.actor.includes('Engine') || log.actor.includes('Agent') || log.actor.includes('Pipeline');

                  return (
                    <tr key={log.id}>
                      <td>
                        <strong style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: '12px' }}>
                          {log.id}
                        </strong>
                      </td>
                      <td style={{ fontSize: '11px', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                        {log.timestamp}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isAgent ? (
                            <span style={{ width: '18px', height: '18px', borderRadius: '3px', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                              <Bot size={12} />
                            </span>
                          ) : (
                            <span style={{ width: '18px', height: '18px', borderRadius: '3px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                              <User size={12} />
                            </span>
                          )}
                          <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>
                            {log.actor}
                          </span>
                        </div>
                      </td>
                      <td>
                        {getActionBadge(log.action)}
                      </td>
                      <td>
                        <div style={{ fontSize: '12px' }}>
                          {log.incidentId && <code>{log.incidentId}</code>}
                          {log.travellerId && <span style={{ marginLeft: '6px', color: 'var(--text-muted)' }}>Pax: {log.travellerId}</span>}
                        </div>
                        {log.planId && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Plan: {log.planId}</div>
                        )}
                      </td>
                      <td>
                        {log.previousState && log.newState ? (
                          <div style={{ fontSize: '11px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>{log.previousState}</span>
                            <span style={{ margin: '0 4px', color: 'var(--text-muted)' }}>&rarr;</span>
                            <strong style={{ color: 'var(--text-primary)' }}>{log.newState}</strong>
                          </div>
                        ) : log.newState ? (
                          <span style={{ fontSize: '11px', fontWeight: 600 }}>{log.newState}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>—</span>
                        )}
                      </td>
                      <td style={{ maxWidth: '380px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                          {log.comment || 'System state update recorded.'}
                        </div>
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
