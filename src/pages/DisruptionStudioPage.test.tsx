import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DisruptionStudioPage } from './DisruptionStudioPage';

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
});

describe('DisruptionStudioPage Component', () => {
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <DisruptionStudioPage />
      </BrowserRouter>
    );
  };

  it('renders page header and preset buttons', () => {
    renderWithRouter();

    expect(screen.getByText('Disruption Studio')).toBeInTheDocument();
    expect(screen.getByText(/Paste or select any travel disruption text/i)).toBeInTheDocument();
    expect(screen.getByText('IndiGo 6E-2134 DEL→BOM Fog Ground Stop')).toBeInTheDocument();
    expect(screen.getByText('Mumbai CSMIA Runway Emergency NOTAM')).toBeInTheDocument();
  });

  it('runs analysis when a preset button is clicked', () => {
    renderWithRouter();

    const presetBtn = screen.getByText('IndiGo 6E-2134 DEL→BOM Fog Ground Stop');
    fireEvent.click(presetBtn);

    // AI Classification card should appear
    expect(screen.getByText('AI Classification')).toBeInTheDocument();
    expect(screen.getByText('Transit Entity Recognition')).toBeInTheDocument();
    expect(screen.getByText('Statutory Compensation Calculator')).toBeInTheDocument();
    expect(screen.getByText('Alternative Recovery Routes')).toBeInTheDocument();
  });

  it('calculates statutory compensation and shows free meals/hotel', () => {
    renderWithRouter();

    const presetBtn = screen.getByText('IndiGo 6E-2134 DEL→BOM Fog Ground Stop');
    fireEvent.click(presetBtn);

    // Delays >= 4h show compensation and meal badges
    expect(screen.getByText(/DGCA CAR Section 3/i)).toBeInTheDocument();
    expect(screen.getAllByText(/🍽️ Free Meals/i).length).toBeGreaterThan(0);
  });

  it('handles customer notification copying and promotion', () => {
    renderWithRouter();

    const presetBtn = screen.getByText('IndiGo 6E-2134 DEL→BOM Fog Ground Stop');
    fireEvent.click(presetBtn);

    // Promote button
    const promoteBtn = screen.getByRole('button', { name: /Promote to Live Incident/i });
    fireEvent.click(promoteBtn);

    expect(screen.getByText(/Promoted to Dashboard/i)).toBeInTheDocument();
  });
});
