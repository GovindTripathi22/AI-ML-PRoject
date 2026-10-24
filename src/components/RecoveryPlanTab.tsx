import React, { useState } from 'react';
import type { RecoveryPlan, Traveller, ItineraryChange } from '../types';
import { PlanStatusBadge, Badge } from './Badge';
import { Modal } from './Modal';
import { Check, X, Edit3, ArrowRight } from 'lucide-react';
import { useApp } from '../context';

interface RecoveryPlanTabProps {
  plans: RecoveryPlan[];
  travellers: Traveller[];
  onOpenCitation?: (index: number) => void;
}

export const RecoveryPlanTab: React.FC<RecoveryPlanTabProps> = ({
  plans,
  travellers,
  onOpenCitation
}) => {
  const { updatePlanStatus } = useApp();

  // Rejection modal state
  const [rejectingPlan, setRejectingPlan] = useState<RecoveryPlan | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectError, setRejectError] = useState<string>('');

  // Edit modal state
  const [editingPlan, setEditingPlan] = useState<RecoveryPlan | null>(null);
  const [editedCost, setEditedCost] = useState<number>(0);
  const [editedChanges, setEditedChanges] = useState<ItineraryChange[]>([]);
  const [editNotes, setEditNotes] = useState<string>('');

  // Group plans by traveller
  const travellerIds = Array.from(new Set(plans.map(p => p.travellerId)));

  const handleApprove = (planId: string) => {
    updatePlanStatus(planId, 'Approved');
  };

  const handleOpenReject = (plan: RecoveryPlan) => {
    setRejectingPlan(plan);
    setRejectReason('');
    setRejectError('');
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      setRejectError('A factual rejection comment is strictly required for operations audit compliance.');
      return;
    }
    if (rejectingPlan) {
      updatePlanStatus(rejectingPlan.id, 'Rejected', rejectReason.trim());
      setRejectingPlan(null);
    }
  };

  const handleOpenEdit = (plan: RecoveryPlan) => {
    setEditingPlan(plan);
    setEditedCost(plan.costDifferenceINR);
    setEditedChanges(JSON.parse(JSON.stringify(plan.itineraryChanges)));
    setEditNotes('');
  };

  const handleConfirmEdit = () => {
    if (editingPlan) {
      updatePlanStatus(
        editingPlan.id,
        'Edited & Approved',
        editNotes.trim() || 'Adjusted itinerary details and cost delta before approval.',
        editedChanges,
        Number(editedCost)
      );
      setEditingPlan(null);
    }
  };

  // Helper to format text with clickable citation badges
  const renderRationaleWithCitations = (text: string) => {
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationNum = parseInt(match[1], 10);
        return (
          <button
            key={index}
            type="button"
            className="citation-badge"
            onClick={() => onOpenCitation && onOpenCitation(citationNum)}
            title={`View evidence snippet [${citationNum}]`}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 600 }}>1-Click Rebooking & Compensation Options</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            TripShield has prepared validated travel alternatives for each stranded passenger. Click &quot;Approve Plan&quot; to instantly issue confirmed tickets or dispatch compensation payments.
          </p>
        </div>
      </div>

      {travellerIds.map(trvId => {
        const traveller = travellers.find(t => t.id === trvId);
        const travellerPlans = plans.filter(p => p.travellerId === trvId);

        return (
          <div 
            key={trvId} 
            className="card"
            style={{ padding: '20px', borderLeft: '4px solid var(--accent)' }}
          >
            {/* Traveller Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{traveller ? traveller.name : trvId}</h4>
                  <Badge variant="teal">{traveller?.tier}</Badge>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {trvId}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Base: {traveller?.baseCity} • Contact: {traveller?.phone} • Preferences: {traveller?.preferences.seat}; {traveller?.preferences.meal}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Disruption Allowance Limit</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{traveller?.budgetLimitINR.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Plan Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {travellerPlans.map(plan => {
                const isApproved = plan.status === 'Approved' || plan.status === 'Edited & Approved';
                const isRejected = plan.status === 'Rejected';

                return (
                  <div 
                    key={plan.id}
                    style={{
                      border: `1px solid ${isApproved ? 'var(--status-approved)' : isRejected ? 'var(--status-critical-border)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius)',
                      backgroundColor: isApproved ? '#FAFDFB' : isRejected ? '#FDF8F8' : 'var(--bg-surface)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    {/* Plan Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.04em' }}>
                          {plan.planLabel}
                        </span>
                        <h5 style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px', color: 'var(--text-primary)' }}>
                          {plan.title}
                        </h5>
                      </div>
                      <PlanStatusBadge status={plan.status} />
                    </div>

                    {/* Itinerary Changes List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Proposed Itinerary Modifications:
                      </span>
                      {plan.itineraryChanges.map((change, cIdx) => (
                        <div 
                          key={cIdx} 
                          style={{ 
                            fontSize: '12px', 
                            padding: '8px 10px', 
                            backgroundColor: 'var(--bg-canvas)', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: 'var(--radius-sm)' 
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{change.changeType}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{change.bookingId}</span>
                          </div>
                          <div style={{ color: 'var(--text-secondary)', textDecoration: 'line-through', fontSize: '11px' }}>
                            {change.originalDetails}
                          </div>
                          <div style={{ color: 'var(--accent)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <ArrowRight size={11} />
                            <span>{change.proposedDetails}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cost & Budget Validation */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Cost Variance</div>
                        <div style={{ fontWeight: 700, color: plan.costDifferenceINR > 0 ? 'var(--text-primary)' : 'var(--status-approved)' }}>
                          {plan.costDifferenceINR > 0 ? `+₹${plan.costDifferenceINR.toLocaleString('en-IN')}` : plan.costDifferenceINR < 0 ? `-₹${Math.abs(plan.costDifferenceINR).toLocaleString('en-IN')} (Refund)` : '₹0 (Neutral)'}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Budget Limit Check</div>
                        <div style={{ fontWeight: 600, color: plan.withinBudget ? 'var(--status-approved)' : 'var(--status-critical)' }}>
                          {plan.withinBudget ? 'Within Policy Cap' : 'Exceeds Cap (Waiver Req.)'}
                        </div>
                      </div>
                    </div>

                    {/* Preference Alignment */}
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span><strong>Preference Match:</strong> {plan.preferenceMatchScore}%</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{plan.preferenceSummary}</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${plan.preferenceMatchScore}%`, 
                            height: '100%', 
                            backgroundColor: plan.preferenceMatchScore >= 85 ? 'var(--accent)' : 'var(--status-warning)' 
                          }} 
                        />
                      </div>
                    </div>

                    {/* Short Operational Rationale with Citations */}
                    <div style={{ fontSize: '12px', lineHeight: '1.5', padding: '8px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Rationale: </span>
                      {renderRationaleWithCitations(plan.rationale)}
                    </div>

                    {/* Review Notes if available */}
                    {plan.reviewerComment && (
                      <div style={{ fontSize: '11px', padding: '6px 10px', backgroundColor: isRejected ? '#FEE2E2' : '#DCFCE7', color: isRejected ? '#991B1B' : '#166534', borderRadius: 'var(--radius-sm)' }}>
                        <strong>Operator Comment:</strong> {plan.reviewerComment} (by {plan.reviewedBy} at {plan.reviewedAt})
                      </div>
                    )}

                    {/* Human Approval Controls */}
                    <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleApprove(plan.id)}
                        disabled={isApproved}
                        style={{ flex: 1 }}
                      >
                        <Check size={13} />
                        <span>{isApproved ? 'Approved' : 'Approve Plan'}</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEdit(plan)}
                        disabled={isApproved}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleOpenReject(plan)}
                        disabled={isRejected}
                      >
                        <X size={13} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Reject Modal with Mandatory Comment */}
      <Modal
        isOpen={Boolean(rejectingPlan)}
        onClose={() => setRejectingPlan(null)}
        title="Confirm Recovery Plan Rejection"
        footer={
          <>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={() => setRejectingPlan(null)}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-danger btn-sm" 
              onClick={handleConfirmReject}
            >
              Confirm Rejection & Log Audit
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            You are rejecting <strong>{rejectingPlan?.planLabel} ({rejectingPlan?.title})</strong> for passenger ID <strong>{rejectingPlan?.travellerId}</strong>.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="reject-comment">
              Reason for Rejection (Strictly Required for Audit Trail) *
            </label>
            <textarea
              id="reject-comment"
              className="form-textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value);
                if (rejectError) setRejectError('');
              }}
              placeholder="e.g. Passenger declined overnight train substitution; prefers next day morning flight and corporate transit hotel."
            />
            {rejectError && (
              <span style={{ color: 'var(--status-critical)', fontSize: '12px', marginTop: '4px' }}>
                {rejectError}
              </span>
            )}
          </div>
        </div>
      </Modal>

      {/* Edit Modal to Modify Plan Parameters before Approval */}
      <Modal
        isOpen={Boolean(editingPlan)}
        onClose={() => setEditingPlan(null)}
        title={`Edit Plan Parameters — ${editingPlan?.planLabel}`}
        maxWidth="640px"
        footer={
          <>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={() => setEditingPlan(null)}
            >
              Discard Changes
            </button>
            <button 
              type="button" 
              className="btn btn-success btn-sm" 
              onClick={handleConfirmEdit}
            >
              Save Edits & Approve Plan
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Adjust itinerary changes or agreed financial settlement before approving this recovery candidate.
          </div>

          <div className="form-group">
            <label className="form-label">Cost Difference (INR)</label>
            <input
              type="number"
              className="form-input"
              value={editedCost}
              onChange={(e) => setEditedCost(Number(e.target.value))}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Positive numbers indicate additional cost; negative numbers indicate refund due to traveller.
            </span>
          </div>

          <div>
            <label className="form-label">Itinerary Modification Details</label>
            {editedChanges.map((change, idx) => (
              <div key={idx} style={{ marginBottom: '10px', padding: '10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}>
                  Booking {change.bookingId} ({change.changeType})
                </div>
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '100%', marginBottom: '4px' }}
                  value={change.proposedDetails}
                  onChange={(e) => {
                    const next = [...editedChanges];
                    next[idx].proposedDetails = e.target.value;
                    setEditedChanges(next);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Staff Adjustment Notes (Audit Trail)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Negotiated waiver with duty manager; adjusted room category."
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
