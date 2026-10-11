import React, { useState } from 'react';
import type { Traveller, Booking } from '../types';
import { BookingStatusBadge } from './Badge';
import { Plane, Hotel, Car, Info } from 'lucide-react';

interface DependencyGraphProps {
  travellers: Traveller[];
  bookings: Booking[];
  incidentId: string;
}

export const DependencyGraph: React.FC<DependencyGraphProps> = ({
  travellers,
  bookings,
  incidentId
}) => {
  const [selectedNode, setSelectedNode] = useState<{
    type: 'traveller' | 'booking';
    data: Traveller | Booking;
  } | null>(null);

  // Categorize bookings for the affected travellers
  const affectedBookings = bookings.filter(b => travellers.some(t => t.id === b.travellerId));

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'Flight': return <Plane size={14} />;
      case 'Hotel': return <Hotel size={14} />;
      case 'Transfer':
      case 'Activity': return <Car size={14} />;
      default: return <Info size={14} />;
    }
  };

  // SVG node positioning parameters
  const colTravellerX = 40;
  const colBookingX = 380;
  const colDownstreamX = 720;
  const nodeWidth = 260;
  const nodeHeight = 60;
  const rowSpacing = 85;

  // Compute node Y positions
  const travellerPositions: Record<string, { x: number; y: number }> = {};
  travellers.forEach((t, index) => {
    travellerPositions[t.id] = {
      x: colTravellerX,
      y: 40 + index * rowSpacing * 1.5
    };
  });

  const bookingPositions: Record<string, { x: number; y: number }> = {};
  affectedBookings.forEach((b, index) => {
    // If it's a flight or initial transit, place in column 2; hotels/activities in column 3
    const isDownstream = b.type === 'Hotel' || b.type === 'Transfer' || b.type === 'Activity';
    bookingPositions[b.id] = {
      x: isDownstream ? colDownstreamX : colBookingX,
      y: 40 + index * rowSpacing
    };
  });

  const totalHeight = Math.max(
    travellers.length * rowSpacing * 1.6 + 60,
    affectedBookings.length * rowSpacing + 60,
    420
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Itinerary Dependency & Cascade Graph</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Visualizes multi-modal dependencies: Traveller &rarr; Transport Segment &rarr; Ground Service. Highlighted borders indicate verified disruption. Click any node to inspect.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--status-critical-bg)', border: '1px solid var(--status-critical)', borderRadius: '2px' }} />
            Disrupted Node
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '2px' }} />
            Connected Node
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedNode ? '1fr 340px' : '1fr', gap: '16px', alignItems: 'start' }}>
        {/* SVG Graph Container */}
        <div 
          style={{ 
            backgroundColor: 'var(--bg-canvas)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius)', 
            overflowX: 'auto', 
            padding: '16px',
            minHeight: '440px'
          }}
        >
          {/* Column Headers */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '1020px', paddingBottom: '12px', borderBottom: '1px dashed var(--border-color)', marginBottom: '16px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            <span style={{ width: '280px', paddingLeft: '8px' }}>1. Impacted Travellers</span>
            <span style={{ width: '320px', paddingLeft: '24px' }}>2. Flight / Inbound Sectors</span>
            <span style={{ width: '320px', paddingLeft: '24px' }}>3. Tied Hotels & Ground Transfers</span>
          </div>

          <svg 
            width="1040" 
            height={totalHeight} 
            style={{ display: 'block', overflow: 'visible' }}
          >
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#94A3B8" />
              </marker>
              <marker id="arrow-critical" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#DC2626" />
              </marker>
            </defs>

            {/* Connecting Edges */}
            {affectedBookings.map(booking => {
              const trvPos = travellerPositions[booking.travellerId];
              const bkgPos = bookingPositions[booking.id];
              if (!trvPos || !bkgPos) return null;

              const isDisrupted = booking.impactedByIncidentId === incidentId || booking.status === 'Disrupted';
              const startX = trvPos.x + nodeWidth;
              const startY = trvPos.y + nodeHeight / 2;
              const endX = bkgPos.x;
              const endY = bkgPos.y + nodeHeight / 2;
              const midX = (startX + endX) / 2;

              return (
                <path
                  key={`edge-t-${booking.id}`}
                  d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                  fill="none"
                  stroke={isDisrupted ? 'var(--status-critical)' : '#CBD5E1'}
                  strokeWidth={isDisrupted ? '2' : '1.5'}
                  strokeDasharray={isDisrupted ? '4 2' : 'none'}
                  markerEnd={isDisrupted ? 'url(#arrow-critical)' : 'url(#arrow)'}
                />
              );
            })}

            {/* Traveller Nodes */}
            {travellers.map(traveller => {
              const pos = travellerPositions[traveller.id];
              if (!pos) return null;
              const isSelected = selectedNode?.type === 'traveller' && selectedNode.data.id === traveller.id;

              return (
                <g 
                  key={`node-${traveller.id}`} 
                  transform={`translate(${pos.x}, ${pos.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedNode({ type: 'traveller', data: traveller })}
                >
                  <rect
                    width={nodeWidth}
                    height={nodeHeight}
                    rx="6"
                    fill={isSelected ? 'var(--accent-light)' : '#FFFFFF'}
                    stroke={isSelected ? 'var(--accent)' : 'var(--border-color)'}
                    strokeWidth={isSelected ? '2' : '1'}
                  />
                  <circle cx="20" cy="22" r="10" fill="var(--bg-subtle)" stroke="var(--border-color)" />
                  <text x="20" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--accent)">
                    {traveller.name.slice(0, 1)}
                  </text>
                  <text x="38" y="24" fontSize="13" fontWeight="600" fill="var(--text-primary)">
                    {traveller.name}
                  </text>
                  <text x="38" y="42" fontSize="11" fill="var(--text-muted)">
                    {traveller.id} • {traveller.tier}
                  </text>
                  <text x={nodeWidth - 12} y="42" textAnchor="end" fontSize="11" fontWeight="600" fill="var(--text-secondary)">
                    Limit: ₹{traveller.budgetLimitINR.toLocaleString('en-IN')}
                  </text>
                </g>
              );
            })}

            {/* Booking Nodes */}
            {affectedBookings.map(booking => {
              const pos = bookingPositions[booking.id];
              if (!pos) return null;
              const isDisrupted = booking.impactedByIncidentId === incidentId || booking.status === 'Disrupted';
              const isSelected = selectedNode?.type === 'booking' && selectedNode.data.id === booking.id;

              return (
                <g 
                  key={`node-${booking.id}`} 
                  transform={`translate(${pos.x}, ${pos.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedNode({ type: 'booking', data: booking })}
                >
                  <rect
                    width={nodeWidth}
                    height={nodeHeight}
                    rx="6"
                    fill={isSelected ? 'var(--accent-light)' : isDisrupted ? 'var(--status-critical-bg)' : '#FFFFFF'}
                    stroke={isSelected ? 'var(--accent)' : isDisrupted ? 'var(--status-critical)' : 'var(--border-color)'}
                    strokeWidth={isDisrupted || isSelected ? '1.5' : '1'}
                  />
                  {/* Service icon label */}
                  <rect x="8" y="10" width="22" height="22" rx="4" fill={isDisrupted ? '#FEE2E2' : 'var(--bg-subtle)'} />
                  <text x="19" y="26" textAnchor="middle" fontSize="11" fill={isDisrupted ? 'var(--status-critical)' : 'var(--text-secondary)'}>
                    {booking.type === 'Flight' ? '✈' : booking.type === 'Hotel' ? '⌂' : '→'}
                  </text>
                  <text x="36" y="22" fontSize="12" fontWeight="600" fill="var(--text-primary)">
                    {booking.reference} — {booking.supplier.slice(0, 18)}
                  </text>
                  <text x="36" y="38" fontSize="11" fill="var(--text-secondary)">
                    {booking.serviceName.length > 30 ? booking.serviceName.slice(0, 30) + '...' : booking.serviceName}
                  </text>
                  <text x="36" y="52" fontSize="10" fill="var(--text-muted)">
                    {booking.departureOrCheckIn} • ₹{booking.costINR.toLocaleString('en-IN')}
                  </text>

                  {isDisrupted && (
                    <circle cx={nodeWidth - 14} cy="16" r="5" fill="var(--status-critical)" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Node Inspection Pane */}
        {selectedNode && (
          <div className="card" style={{ padding: '16px', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                {selectedNode.type === 'traveller' ? 'Traveller Profile' : 'Booking Metadata'}
              </span>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedNode(null)}
                style={{ padding: '2px 8px', fontSize: '11px' }}
              >
                Close
              </button>
            </div>

            {selectedNode.type === 'traveller' ? (
              (() => {
                const trv = selectedNode.data as Traveller;
                return (
                  <div>
                    <h4 style={{ fontSize: '16px', marginBottom: '2px' }}>{trv.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      ID: {trv.id} • {trv.tier}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                      <div>
                        <strong>Email:</strong> {trv.email}
                      </div>
                      <div>
                        <strong>Phone:</strong> {trv.phone}
                      </div>
                      <div>
                        <strong>Base City:</strong> {trv.baseCity}
                      </div>
                      <div>
                        <strong>Emergency Contact:</strong> {trv.emergencyContact}
                      </div>
                      <div style={{ padding: '8px', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                          Disruption Threshold: ₹{trv.budgetLimitINR.toLocaleString('en-IN')}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                          Preferences: {trv.preferences.seat}; {trv.preferences.meal}; {trv.preferences.hotelRoom}.
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>
                          Flexibility: {trv.preferences.transitFlexibility}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              (() => {
                const bkg = selectedNode.data as Booking;
                return (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <BookingStatusBadge status={bkg.status} />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{bkg.id}</span>
                    </div>
                    <h4 style={{ fontSize: '15px', marginBottom: '2px' }}>{bkg.serviceName}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      Ref: {bkg.reference} • {bkg.supplier}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                      <div>
                        <strong>Type:</strong> {bkg.type} ({bkg.location})
                      </div>
                      <div>
                        <strong>Timing:</strong> {bkg.departureOrCheckIn} to {bkg.arrivalOrCheckOut}
                      </div>
                      <div>
                        <strong>Cost:</strong> ₹{bkg.costINR.toLocaleString('en-IN')}
                      </div>
                      {bkg.disruptionNote && (
                        <div style={{ padding: '8px', backgroundColor: 'var(--status-critical-bg)', border: '1px solid var(--status-critical-border)', borderRadius: 'var(--radius)', marginTop: '6px', color: 'var(--status-critical)' }}>
                          <div style={{ fontWeight: 600, fontSize: '11px', marginBottom: '2px' }}>Disruption Assessment:</div>
                          <div style={{ fontSize: '11px' }}>{bkg.disruptionNote}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}
      </div>

      {/* Alternative tabular summary for accessibility */}
      <div style={{ marginTop: '8px' }}>
        <h5 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
          Tabular Itinerary Manifest
        </h5>
        <div className="table-container">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Traveller</th>
                <th>Booking Ref</th>
                <th>Service Name</th>
                <th>Schedule</th>
                <th>Location</th>
                <th>Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {affectedBookings.map(b => {
                const trv = travellers.find(t => t.id === b.travellerId);
                return (
                  <tr key={b.id}>
                    <td>
                      <strong>{trv ? trv.name : b.travellerId}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{trv?.tier}</div>
                    </td>
                    <td><code>{b.reference}</code></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {getServiceIcon(b.type)}
                        <span>{b.serviceName}</span>
                      </div>
                    </td>
                    <td>{b.departureOrCheckIn}</td>
                    <td>{b.location}</td>
                    <td>₹{b.costINR.toLocaleString('en-IN')}</td>
                    <td><BookingStatusBadge status={b.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
