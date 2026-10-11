import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../context';
import { DashboardPage } from './DashboardPage';

describe('DashboardPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders summary indicators and incident table after loading', async () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <DashboardPage />
        </AppProvider>
      </BrowserRouter>
    );

    await act(async () => {
      await new Promise(r => setTimeout(r, 450));
    });

    expect(screen.getByText('Active Incidents')).toBeInTheDocument();
    expect(screen.getByText('Travellers Affected')).toBeInTheDocument();
    expect(screen.getByText('Bookings at Risk')).toBeInTheDocument();
    expect(screen.getByText('Plans Awaiting Approval')).toBeInTheDocument();

    // Check incident IDs are displayed
    expect(screen.getByText('INC-2026-0841')).toBeInTheDocument();
  });

  it('filters incidents when searching by location or code', async () => {
    render(
      <BrowserRouter>
        <AppProvider>
          <DashboardPage />
        </AppProvider>
      </BrowserRouter>
    );

    await act(async () => {
      await new Promise(r => setTimeout(r, 450));
    });

    const searchInput = screen.getByPlaceholderText(/Search by ID/i);
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Mumbai' } });
    });

    expect(screen.getByText('INC-2026-0842')).toBeInTheDocument();
    expect(screen.queryByText('INC-2026-0841')).not.toBeInTheDocument();
  });
});
