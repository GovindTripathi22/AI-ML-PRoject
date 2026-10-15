import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ForensicsAndFactoringCard } from './ForensicsAndFactoringCard';

describe('ForensicsAndFactoringCard Component', () => {
  it('renders forensics panel with flight number and fraud detection badge', () => {
    render(
      <ForensicsAndFactoringCard 
        flightNumber="AI-802"
        tailNumber="VT-EXQ"
        winProbabilityPct={96}
      />
    );

    expect(screen.getByText(/Exemption Fraud Detected/i)).toBeInTheDocument();
    expect(screen.getByText(/96% Confidence/i)).toBeInTheDocument();
    expect(screen.getByText(/Tail #VT-EXQ/i)).toBeInTheDocument();
    expect(screen.getByText(/Flight AI-802/i)).toBeInTheDocument();
  });

  it('switches jurisdiction from DGCA to EU261 correctly', () => {
    render(<ForensicsAndFactoringCard initialJurisdiction="DGCA" />);

    // Default DGCA shows INR
    expect(screen.getByText(/DGCA CAR Section 3/i)).toBeInTheDocument();

    // Click EU261 pill
    const euBtn = screen.getByRole('button', { name: /EU261 \(Europe €\)/i });
    fireEvent.click(euBtn);

    // Now shows EU261 citation and EUR values
    expect(screen.getByText(/CJEU Case C-549\/07/i)).toBeInTheDocument();
    expect(screen.getByText(/Instant Gate Buyout: €485/i)).toBeInTheDocument();
  });

  it('handles instant buyout payout button click', () => {
    render(<ForensicsAndFactoringCard initialJurisdiction="DGCA" />);

    const payoutBtn = screen.getByRole('button', { name: /Accept Instant ₹6,120 Payout/i });
    fireEvent.click(payoutBtn);

    expect(screen.getByText(/✓ ₹6,120 Dispatched via UPI/i)).toBeInTheDocument();
  });

  it('handles ghost-hold boarding pass conversion click', () => {
    render(<ForensicsAndFactoringCard initialJurisdiction="DGCA" />);

    const convertBtn = screen.getByRole('button', { name: /Convert Ghost-Hold to Confirmed Boarding Pass/i });
    fireEvent.click(convertBtn);

    expect(screen.getByText(/✓ Boarding Pass Issued \(Seat 4A\) & Logged to Audit Trail/i)).toBeInTheDocument();
  });
});
