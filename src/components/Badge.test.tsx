import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { 
  Badge, 
  SeverityBadge, 
  IncidentStatusBadge, 
  PlanStatusBadge, 
  BookingStatusBadge 
} from './Badge';

describe('Badge Components', () => {
  it('renders generic badge with appropriate variant class', () => {
    const { container } = render(<Badge variant="critical">Alert</Badge>);
    expect(screen.getByText('Alert')).toBeInTheDocument();
    expect(container.querySelector('.badge-critical')).toBeInTheDocument();
  });

  it('renders severity badges correctly', () => {
    const { rerender } = render(<SeverityBadge severity="Critical" />);
    expect(screen.getByText('Critical')).toHaveClass('badge-critical');

    rerender(<SeverityBadge severity="High" />);
    expect(screen.getByText('High')).toHaveClass('badge-warning');

    rerender(<SeverityBadge severity="Medium" />);
    expect(screen.getByText('Medium')).toHaveClass('badge-teal');

    rerender(<SeverityBadge severity="Low" />);
    expect(screen.getByText('Low')).toHaveClass('badge-neutral');
  });

  it('renders incident status badges correctly', () => {
    render(<IncidentStatusBadge status="Active Investigation" />);
    expect(screen.getByText('Active Investigation')).toHaveClass('badge-warning');
  });

  it('renders plan status badges correctly', () => {
    const { rerender } = render(<PlanStatusBadge status="Approved" />);
    expect(screen.getByText('Approved')).toHaveClass('badge-approved');

    rerender(<PlanStatusBadge status="Rejected" />);
    expect(screen.getByText('Rejected')).toHaveClass('badge-critical');

    rerender(<PlanStatusBadge status="Pending" />);
    expect(screen.getByText('Pending Review')).toHaveClass('badge-warning');
  });

  it('renders booking status badges correctly', () => {
    const { rerender } = render(<BookingStatusBadge status="Disrupted" />);
    expect(screen.getByText('Disrupted')).toHaveClass('badge-critical');

    rerender(<BookingStatusBadge status="Rebooked" />);
    expect(screen.getByText('Rebooked')).toHaveClass('badge-approved');
  });
});
