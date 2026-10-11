import type { 
  Incident, 
  Traveller, 
  Booking, 
  PolicyDocument, 
  EvidenceSnippet, 
  RecoveryPlan, 
  AuditLogEntry, 
  PlanStatus,
  ItineraryChange
} from '../types';
import {
  INITIAL_INCIDENTS,
  INITIAL_TRAVELLERS,
  INITIAL_BOOKINGS,
  INITIAL_POLICY_DOCUMENTS,
  INITIAL_EVIDENCE_SNIPPETS,
  INITIAL_RECOVERY_PLANS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

const STORAGE_KEYS = {
  INCIDENTS: 'tripshield_incidents',
  TRAVELLERS: 'tripshield_travellers',
  BOOKINGS: 'tripshield_bookings',
  RECOVERY_PLANS: 'tripshield_recovery_plans',
  AUDIT_LOGS: 'tripshield_audit_logs'
};

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const StorageService = {
  getIncidents: async (): Promise<Incident[]> => {
    await delay(180);
    const stored = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(INITIAL_INCIDENTS));
      return INITIAL_INCIDENTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_INCIDENTS;
    }
  },

  getIncidentById: async (id: string): Promise<Incident | null> => {
    const incidents = await StorageService.getIncidents();
    return incidents.find(inc => inc.id === id) || null;
  },

  getTravellers: async (): Promise<Traveller[]> => {
    await delay(150);
    const stored = localStorage.getItem(STORAGE_KEYS.TRAVELLERS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.TRAVELLERS, JSON.stringify(INITIAL_TRAVELLERS));
      return INITIAL_TRAVELLERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_TRAVELLERS;
    }
  },

  getTravellerById: async (id: string): Promise<Traveller | null> => {
    const travellers = await StorageService.getTravellers();
    return travellers.find(t => t.id === id) || null;
  },

  getBookings: async (): Promise<Booking[]> => {
    await delay(150);
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  getPolicies: async (): Promise<PolicyDocument[]> => {
    await delay(120);
    return INITIAL_POLICY_DOCUMENTS;
  },

  getEvidenceSnippets: async (): Promise<EvidenceSnippet[]> => {
    await delay(120);
    return INITIAL_EVIDENCE_SNIPPETS;
  },

  getRecoveryPlans: async (incidentId?: string): Promise<RecoveryPlan[]> => {
    await delay(160);
    const stored = localStorage.getItem(STORAGE_KEYS.RECOVERY_PLANS);
    let plans: RecoveryPlan[] = INITIAL_RECOVERY_PLANS;
    if (stored) {
      try {
        plans = JSON.parse(stored);
      } catch {
        plans = INITIAL_RECOVERY_PLANS;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.RECOVERY_PLANS, JSON.stringify(INITIAL_RECOVERY_PLANS));
    }
    if (incidentId) {
      return plans.filter(p => p.incidentId === incidentId);
    }
    return plans;
  },

  getAuditLogs: async (): Promise<AuditLogEntry[]> => {
    await delay(140);
    const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  addAuditLog: async (log: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> => {
    const logs = await StorageService.getAuditLogs();
    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST ' + new Date().toISOString().slice(0, 10),
      ...log
    };
    const updated = [newLog, ...logs];
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
    return newLog;
  },

  updatePlanStatus: async (
    planId: string,
    status: PlanStatus,
    comment?: string,
    editedChanges?: ItineraryChange[],
    editedCostDiff?: number
  ): Promise<RecoveryPlan | null> => {
    const plans = await StorageService.getRecoveryPlans();
    const index = plans.findIndex(p => p.id === planId);
    if (index === -1) return null;

    const previousPlan = plans[index];
    const previousStatus = previousPlan.status;
    const nowStr = new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST ' + new Date().toISOString().slice(0, 10);

    const updatedPlan: RecoveryPlan = {
      ...previousPlan,
      status,
      reviewedBy: 'Operations Desk (Staff)',
      reviewedAt: nowStr,
      reviewerComment: comment || previousPlan.reviewerComment
    };

    if (editedChanges) {
      updatedPlan.itineraryChanges = editedChanges;
    }
    if (typeof editedCostDiff === 'number') {
      updatedPlan.costDifferenceINR = editedCostDiff;
    }

    plans[index] = updatedPlan;
    localStorage.setItem(STORAGE_KEYS.RECOVERY_PLANS, JSON.stringify(plans));

    // Log this action to the audit trail
    await StorageService.addAuditLog({
      actor: 'Operations Staff (Desk User)',
      action: status === 'Approved' ? 'Plan Approved' : status === 'Rejected' ? 'Plan Rejected' : 'Plan Edited & Approved',
      incidentId: previousPlan.incidentId,
      travellerId: previousPlan.travellerId,
      planId: previousPlan.id,
      previousState: previousStatus,
      newState: status,
      comment: comment || (status === 'Approved' ? `Approved ${previousPlan.planLabel} - ${previousPlan.title}` : `Modified plan parameters`)
    });

    // If approved, check if we should update associated bookings
    if (status === 'Approved' || status === 'Edited & Approved') {
      const bookings = await StorageService.getBookings();
      const updatedBookings = bookings.map(b => {
        const change = updatedPlan.itineraryChanges.find(c => c.bookingId === b.id);
        if (change) {
          return {
            ...b,
            status: change.changeType === 'Full Refund & Cancel' ? 'Cancelled' : ('Rebooked' as const),
            disruptionNote: `Rebooked via ${updatedPlan.planLabel}: ${change.proposedDetails}`
          };
        }
        return b;
      });
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));

      // Check if all plans for this incident are approved, and update incident status if appropriate
      const incidentPlans = plans.filter(p => p.incidentId === previousPlan.incidentId);
      const allApproved = incidentPlans.length > 0 && incidentPlans.every(p => p.status === 'Approved' || p.status === 'Edited & Approved');
      if (allApproved) {
        const incidents = await StorageService.getIncidents();
        const incIndex = incidents.findIndex(i => i.id === previousPlan.incidentId);
        if (incIndex !== -1 && incidents[incIndex].status !== 'Resolved') {
          incidents[incIndex] = {
            ...incidents[incIndex],
            status: 'In Recovery'
          };
          localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
        }
      }
    }

    return updatedPlan;
  },

  updateIncidentAgentSteps: async (incidentId: string, steps: Incident['agentSteps']): Promise<void> => {
    const incidents = await StorageService.getIncidents();
    const index = incidents.findIndex(i => i.id === incidentId);
    if (index !== -1) {
      incidents[index].agentSteps = steps;
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
    }
  },

  resetAllData: (): void => {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(INITIAL_INCIDENTS));
    localStorage.setItem(STORAGE_KEYS.TRAVELLERS, JSON.stringify(INITIAL_TRAVELLERS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.RECOVERY_PLANS, JSON.stringify(INITIAL_RECOVERY_PLANS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
};
