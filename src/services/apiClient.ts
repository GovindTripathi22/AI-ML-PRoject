/**
 * TripShield API Client Adapter Layer
 * 
 * Provides unified data access for TripShield:
 * - When `VITE_API_BASE_URL` is configured, routes requests to live REST/FastAPI endpoints.
 * - When running offline or unconfigured, seamlessly falls back to the in-browser StorageService.
 */

import type { 
  Incident, 
  Traveller, 
  Booking, 
  RecoveryPlan, 
  AuditLogEntry, 
  PlanStatus,
  ItineraryChange 
} from '../types';
import { StorageService } from './storageService';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || '';

export const ApiClient = {
  isLiveApiEnabled: (): boolean => Boolean(API_BASE_URL),

  getIncidents: async (): Promise<Incident[]> => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/incidents`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('TripShield API: Falling back to local StorageService for incidents', err);
      }
    }
    return StorageService.getIncidents();
  },

  getIncidentById: async (id: string): Promise<Incident | null> => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/incidents/${encodeURIComponent(id)}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn(`TripShield API: Falling back to local StorageService for incident ${id}`, err);
      }
    }
    return StorageService.getIncidentById(id);
  },

  getTravellers: async (): Promise<Traveller[]> => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/travellers`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('TripShield API: Falling back to local StorageService for travellers', err);
      }
    }
    return StorageService.getTravellers();
  },

  getBookings: async (): Promise<Booking[]> => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/bookings`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('TripShield API: Falling back to local StorageService for bookings', err);
      }
    }
    return StorageService.getBookings();
  },

  getRecoveryPlans: async (incidentId?: string): Promise<RecoveryPlan[]> => {
    if (API_BASE_URL) {
      try {
        const url = incidentId 
          ? `${API_BASE_URL}/api/recovery-plans?incidentId=${encodeURIComponent(incidentId)}`
          : `${API_BASE_URL}/api/recovery-plans`;
        const res = await fetch(url);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('TripShield API: Falling back to local StorageService for recovery plans', err);
      }
    }
    return StorageService.getRecoveryPlans(incidentId);
  },

  updatePlanStatus: async (
    planId: string,
    status: PlanStatus,
    comment?: string,
    editedChanges?: ItineraryChange[],
    editedCostDiff?: number
  ): Promise<RecoveryPlan | null> => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/recovery-plans/${encodeURIComponent(planId)}/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, comment, editedChanges, editedCostDiff })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn(`TripShield API: Falling back to local StorageService for plan ${planId}`, err);
      }
    }
    return StorageService.updatePlanStatus(planId, status, comment, editedChanges, editedCostDiff);
  },

  getAuditLogs: async (): Promise<AuditLogEntry[]> => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/audit-logs`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('TripShield API: Falling back to local StorageService for audit logs', err);
      }
    }
    return StorageService.getAuditLogs();
  },

  addAuditLog: async (log: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/audit-logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('TripShield API: Falling back to local StorageService for audit entry', err);
      }
    }
    return StorageService.addAuditLog(log);
  },

  verifyForensics: async (params: {
    airlineClaimedReason: string;
    metarWindKts?: number;
    metarVisibilityKm?: number;
    inboundTailDelayMins?: number;
    runwayPeerDeparturesOnTimePct?: number;
    jurisdiction?: string;
  }) => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/forensics/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            airline_claimed_reason: params.airlineClaimedReason,
            metar_wind_kts: params.metarWindKts ?? 12.0,
            metar_visibility_km: params.metarVisibilityKm ?? 10.0,
            inbound_tail_delay_mins: params.inboundTailDelayMins ?? 15,
            runway_peer_departures_on_time_pct: params.runwayPeerDeparturesOnTimePct ?? 85.0,
            jurisdiction: params.jurisdiction ?? 'DGCA'
          })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('TripShield API: Falling back to local forensics evaluation', err);
      }
    }
    return null;
  },

  getFactoringQuote: async (params: {
    flightDistanceKm: number;
    arrivalDelayMins: number;
    forensics: Record<string, unknown>;
    jurisdiction?: string;
  }) => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/factoring/quote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            flight_distance_km: params.flightDistanceKm,
            arrival_delay_mins: params.arrivalDelayMins,
            forensics: params.forensics,
            jurisdiction: params.jurisdiction ?? 'DGCA'
          })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('TripShield API: Falling back to local factoring quote', err);
      }
    }
    return null;
  },

  evaluateGhostHold: async (params: {
    inboundTailDelayMins: number;
    turnaroundBufferMins: number;
    connectionWindowMins: number;
    seatsRemainingOnAlternate: number;
    rebookCost: number;
    travellerHourlySla: number;
    hotelOvernightCost?: number;
    currency?: string;
  }) => {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ghost-hold/evaluate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inbound_tail_delay_mins: params.inboundTailDelayMins,
            turnaround_buffer_mins: params.turnaroundBufferMins,
            connection_window_mins: params.connectionWindowMins,
            seats_remaining_on_alternate: params.seatsRemainingOnAlternate,
            rebook_cost: params.rebookCost,
            traveller_hourly_sla: params.travellerHourlySla,
            hotel_overnight_cost: params.hotelOvernightCost ?? 6000.0,
            currency: params.currency ?? 'INR'
          })
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('TripShield API: Falling back to local ghost-hold calculation', err);
      }
    }
    return null;
  }
};

