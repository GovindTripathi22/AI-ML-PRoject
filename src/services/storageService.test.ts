import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from './storageService';
import type { ItineraryChange } from '../types';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads initial incidents and seeds localStorage', async () => {
    const incidents = await StorageService.getIncidents();
    expect(incidents.length).toBe(5);
    expect(incidents[0].id).toBe('INC-2026-0841');
    expect(localStorage.getItem('tripshield_incidents')).not.toBeNull();
  });

  it('retrieves incident by ID', async () => {
    const inc = await StorageService.getIncidentById('INC-2026-0842');
    expect(inc).not.toBeNull();
    expect(inc?.location).toContain('BOM');

    const missing = await StorageService.getIncidentById('NONEXISTENT');
    expect(missing).toBeNull();
  });

  it('retrieves travellers and bookings', async () => {
    const travellers = await StorageService.getTravellers();
    const bookings = await StorageService.getBookings();
    expect(travellers.length).toBe(12);
    expect(bookings.length).toBe(25);
  });

  it('retrieves recovery plans and filters by incident', async () => {
    const allPlans = await StorageService.getRecoveryPlans();
    expect(allPlans.length).toBeGreaterThan(0);

    const incidentPlans = await StorageService.getRecoveryPlansForIncident('INC-2026-0841');
    expect(incidentPlans.length).toBeGreaterThan(0);
    incidentPlans.forEach(p => expect(p.incidentId).toBe('INC-2026-0841'));
  });

  it('updates plan status to Approved and appends an audit log entry', async () => {
    const plans = await StorageService.getRecoveryPlans();
    const targetPlan = plans[0];

    const updated = await StorageService.updatePlanStatus(targetPlan.id, 'Approved', 'Operator sign-off');
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe('Approved');
    expect(updated?.reviewerComment).toBe('Operator sign-off');

    const logs = await StorageService.getAuditLogs();
    const matchingLog = logs.find(l => l.planId === targetPlan.id && l.action === 'Plan Approved');
    expect(matchingLog).toBeDefined();
    expect(matchingLog?.newState).toBe('Approved');
  });

  it('updates plan status with edits and modified cost difference', async () => {
    const plans = await StorageService.getRecoveryPlans();
    const targetPlan = plans[1];

    const editedChanges: ItineraryChange[] = [
      {
        bookingId: 'BKG-201',
        changeType: 'Route Diverted',
        originalDetails: 'Goa Dabolim departure',
        proposedDetails: 'Mopa airport departure reroute'
      }
    ];

    const updated = await StorageService.updatePlanStatus(
      targetPlan.id, 
      'Edited & Approved', 
      'Negotiated concession', 
      editedChanges, 
      1200
    );

    expect(updated?.status).toBe('Edited & Approved');
    expect(updated?.costDifferenceINR).toBe(1200);
    expect(updated?.itineraryChanges).toEqual(editedChanges);
  });

  it('adds and exports audit logs as JSON', async () => {
    await StorageService.addAuditLog({
      actor: 'Safety Officer',
      action: 'Emergency Freeze',
      incidentId: 'INC-2026-0841',
      newState: 'Frozen',
      comment: 'Runway icing hold'
    });

    const logs = await StorageService.getAuditLogs();
    expect(logs.some(l => l.action === 'Emergency Freeze')).toBe(true);

    const jsonExport = await StorageService.exportAuditLogsJson();
    const parsed = JSON.parse(jsonExport);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(logs.length);
  });

  it('resets all data back to baseline defaults', async () => {
    // Modify a plan
    const plans = await StorageService.getRecoveryPlans();
    await StorageService.updatePlanStatus(plans[0].id, 'Rejected', 'Invalid alternative');

    // Reset
    StorageService.resetAllData();
    expect(localStorage.getItem('tripshield_incidents')).not.toBeNull();

    // Fetch again
    const refreshedPlans = await StorageService.getRecoveryPlans();
    expect(refreshedPlans[0].status).toBe('Pending');
  });
});
