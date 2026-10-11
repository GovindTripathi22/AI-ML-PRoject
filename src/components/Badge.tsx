import React from 'react';
import type { Severity, IncidentStatus, PlanStatus, BookingStatus } from '../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'critical' | 'warning' | 'approved' | 'neutral' | 'teal';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  switch (severity) {
    case 'Critical':
      return <Badge variant="critical">Critical</Badge>;
    case 'High':
      return <Badge variant="warning">High</Badge>;
    case 'Medium':
      return <Badge variant="teal">Medium</Badge>;
    case 'Low':
      return <Badge variant="neutral">Low</Badge>;
    default:
      return <Badge variant="neutral">{severity}</Badge>;
  }
};

export const IncidentStatusBadge: React.FC<{ status: IncidentStatus }> = ({ status }) => {
  switch (status) {
    case 'Active Investigation':
      return <Badge variant="warning">Active Investigation</Badge>;
    case 'In Recovery':
      return <Badge variant="teal">In Recovery</Badge>;
    case 'Resolved':
      return <Badge variant="approved">Resolved</Badge>;
    case 'Monitoring':
      return <Badge variant="neutral">Monitoring</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const PlanStatusBadge: React.FC<{ status: PlanStatus }> = ({ status }) => {
  switch (status) {
    case 'Approved':
      return <Badge variant="approved">Approved</Badge>;
    case 'Edited & Approved':
      return <Badge variant="approved">Edited & Approved</Badge>;
    case 'Rejected':
      return <Badge variant="critical">Rejected</Badge>;
    case 'Pending':
    default:
      return <Badge variant="warning">Pending Review</Badge>;
  }
};

export const BookingStatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  switch (status) {
    case 'Disrupted':
      return <Badge variant="critical">Disrupted</Badge>;
    case 'Rebooked':
      return <Badge variant="approved">Rebooked</Badge>;
    case 'Cancelled':
      return <Badge variant="neutral">Cancelled</Badge>;
    case 'On Schedule':
    default:
      return <Badge variant="neutral">On Schedule</Badge>;
  }
};
