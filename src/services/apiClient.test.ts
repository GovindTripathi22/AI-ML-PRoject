import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiClient } from './apiClient';

describe('ApiClient Adapter Layer', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('reports live API status based on environment variable', () => {
    expect(typeof ApiClient.isLiveApiEnabled()).toBe('boolean');
  });

  it('delegates to StorageService when no API base URL is set', async () => {
    const incidents = await ApiClient.getIncidents();
    expect(incidents.length).toBe(5);

    const travellers = await ApiClient.getTravellers();
    expect(travellers.length).toBe(12);

    const bookings = await ApiClient.getBookings();
    expect(bookings.length).toBe(25);
  });

  it('fetches recovery plans with incident filter fallback', async () => {
    const plans = await ApiClient.getRecoveryPlans('INC-2026-0841');
    expect(plans.length).toBeGreaterThan(0);
    plans.forEach(p => expect(p.incidentId).toBe('INC-2026-0841'));
  });

  it('updates plan status and persists audit log', async () => {
    const plans = await ApiClient.getRecoveryPlans();
    const updated = await ApiClient.updatePlanStatus(plans[0].id, 'Approved', 'Signed off by test');
    expect(updated?.status).toBe('Approved');

    const logs = await ApiClient.getAuditLogs();
    expect(logs.some(l => l.planId === plans[0].id)).toBe(true);
  });
});
