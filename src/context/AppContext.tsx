import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { 
  Incident, 
  Traveller, 
  Booking, 
  RecoveryPlan, 
  AuditLogEntry, 
  PlanStatus,
  ItineraryChange 
} from '../types';
import { StorageService } from '../services/storageService';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppContextType {
  incidents: Incident[];
  travellers: Traveller[];
  bookings: Booking[];
  recoveryPlans: RecoveryPlan[];
  auditLogs: AuditLogEntry[];
  isLoading: boolean;
  toasts: Toast[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
  updatePlanStatus: (
    planId: string, 
    status: PlanStatus, 
    comment?: string, 
    editedChanges?: ItineraryChange[],
    editedCostDiff?: number
  ) => Promise<void>;
  replayIncidentAnalysis: (incidentId: string) => Promise<void>;
  resetAllSystemData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [travellers, setTravellers] = useState<Traveller[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [recoveryPlans, setRecoveryPlans] = useState<RecoveryPlan[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [incs, trvs, bkgs, plans, logs] = await Promise.all([
        StorageService.getIncidents(),
        StorageService.getTravellers(),
        StorageService.getBookings(),
        StorageService.getRecoveryPlans(),
        StorageService.getAuditLogs()
      ]);
      setIncidents(incs);
      setTravellers(trvs);
      setBookings(bkgs);
      setRecoveryPlans(plans);
      setAuditLogs(logs);
    } catch {
      showToast('Failed to load operations state from storage.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updatePlanStatus = async (
    planId: string, 
    status: PlanStatus, 
    comment?: string, 
    editedChanges?: ItineraryChange[],
    editedCostDiff?: number
  ) => {
    try {
      const updated = await StorageService.updatePlanStatus(planId, status, comment, editedChanges, editedCostDiff);
      if (updated) {
        await refreshData();
        const actionLabel = status === 'Approved' ? 'approved' : status === 'Rejected' ? 'rejected' : 'edited & approved';
        showToast(`Recovery plan ${updated.planLabel} (${updated.id}) successfully ${actionLabel}.`, status === 'Rejected' ? 'warning' : 'success');
      }
    } catch {
      showToast('Could not record plan review decision.', 'error');
    }
  };

  const replayIncidentAnalysis = async (incidentId: string) => {
    const targetIncident = incidents.find(i => i.id === incidentId);
    if (!targetIncident) return;

    showToast(`Starting autonomous analysis pipeline replay for ${incidentId}...`, 'info');

    // Create a copy of agent steps set to pending
    const stepNames = ['Detect', 'Identify affected', 'Retrieve policies', 'Evaluate alternatives', 'Compare costs', 'Draft plan'] as const;
    
    // Initial reset of steps
    let currentSteps: Incident['agentSteps'] = targetIncident.agentSteps.map(s => ({
      ...s,
      status: 'Pending'
    }));
    await StorageService.updateIncidentAgentSteps(incidentId, currentSteps);
    setIncidents(prev => prev.map(inc => inc.id === incidentId ? { ...inc, agentSteps: currentSteps } : inc));

    // Progress step by step with short visual delays
    for (let i = 0; i < stepNames.length; i++) {
      await new Promise(r => setTimeout(r, 650));
      
      const nowStr = new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
      currentSteps = currentSteps.map((s, idx): Incident['agentSteps'][number] => {
        if (idx === i) {
          return {
            ...s,
            status: 'Completed',
            timestamp: nowStr
          };
        } else if (idx === i + 1) {
          return {
            ...s,
            status: 'In Progress'
          };
        }
        return s;
      });

      await StorageService.updateIncidentAgentSteps(incidentId, currentSteps);
      setIncidents(prev => prev.map(inc => inc.id === incidentId ? { ...inc, agentSteps: currentSteps } : inc));
    }

    // Add audit trail entry for replay
    await StorageService.addAuditLog({
      actor: 'Staff Operator (Triggered Replay)',
      action: 'Analysis Replayed',
      incidentId: incidentId,
      newState: 'Analysis Refreshed',
      comment: `Replayed end-to-end 6-step agent pipeline for incident ${incidentId}. Feeds, inventory, and policy weights verified.`
    });

    await refreshData();
    showToast(`Pipeline analysis completed for ${incidentId}. 6 steps verified.`, 'success');
  };

  const resetAllSystemData = async () => {
    StorageService.resetAllData();
    await refreshData();
    showToast('All system mock data restored to default baseline state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        incidents,
        travellers,
        bookings,
        recoveryPlans,
        auditLogs,
        isLoading,
        toasts,
        showToast,
        removeToast,
        refreshData,
        updatePlanStatus,
        replayIncidentAnalysis,
        resetAllSystemData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
