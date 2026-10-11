import { createContext } from 'react';
import type { 
  Incident, 
  Traveller, 
  Booking, 
  RecoveryPlan, 
  AuditLogEntry, 
  PlanStatus,
  ItineraryChange 
} from '../types';

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AppContextType {
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

export const AppContext = createContext<AppContextType | undefined>(undefined);
