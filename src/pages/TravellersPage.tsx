import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  X 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Traveller } from '../types';
import { Badge, BookingStatusBadge } from '../components/Badge';

export const TravellersPage: React.FC = () => {
  const { travellers, bookings, isLoading } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [selectedTraveller, setSelectedTraveller] = useState<Traveller | null>(null);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');

  // Filter travellers
  const filteredTravellers = useMemo(() => {
    return travellers.filter(t => {
      const matchSearch = 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.baseCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phone.includes(searchTerm);

      const matchTier = tierFilter === 'All' || t.tier === tierFilter;

      return matchSearch && matchTier;
    });
  }, [travellers, searchTerm, tierFilter]);

  // Distinct tiers
  const tiers = useMemo(() => {
    return Array.from(new Set(travellers.map(t => t.tier)));
  }, [travellers]);

  // Selected traveller bookings
  const travellerBookings = useMemo(() => {
    if (!selectedTraveller) return [];
    return bookings.filter(b => {
      const belongs = b.travellerId === selectedTraveller.id;
      const matchesStatus = bookingStatusFilter === 'All' || b.status === bookingStatusFilter;
      return belongs && matchesStatus;
    });
  }, [selectedTraveller, bookings, bookingStatusFilter]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Travellers & Bookings Manifest</h1>
          <p className="page-subtitle">
            Passenger disruption profiles, corporate thresholds, and associated multi-modal booking inventories.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        {/* Search & Filters */}
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search by passenger name, PNR, email, phone or base city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Tier:</span>
            <select
              className="form-select"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '12px' }}
            >
              <option value="All">All Tiers ({travellers.length})</option>
              {tiers.map(tier => (
                <option key={tier} value={tier}>{tier}</option>
              ))}
            </select>

            {(searchTerm || tierFilter !== 'All') && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setTierFilter('All');
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="state-box">
            <div className="spinner" />
            <div className="state-title">Loading Passenger Manifest...</div>
          </div>
        ) : filteredTravellers.length === 0 ? (
          <div className="state-box">
            <div className="state-icon"><Users size={24} /></div>
            <div className="state-title">No Travellers Match Query</div>
            <div className="state-desc">Try searching for other names or resetting the tier filter.</div>
          </div>
        ) : (
          <div className="table-container">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>Passenger ID</th>
                  <th>Name & Base</th>
                  <th>Corporate / Tier</th>
                  <th>Contact Details</th>
                  <th>Disruption Cap</th>
                  <th>Active Bookings</th>
                  <th>Insurance</th>
                  <th style={{ textAlign: 'right' }}>Profile</th>
                </tr>
              </thead>
              <tbody>
                {filteredTravellers.map(t => {
                  const bkgCount = bookings.filter(b => b.travellerId === t.id).length;
                  const hasDisrupted = bookings.some(b => b.travellerId === t.id && b.status === 'Disrupted');

                  return (
                    <tr 
                      key={t.id} 
                      className="clickable-row"
                      onClick={() => {
                        setSelectedTraveller(t);
                        setBookingStatusFilter('All');
                      }}
                    >
                      <td>
                        <strong style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{t.id}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.baseCity}</div>
                      </td>
                      <td>
                        <Badge variant="teal">{t.tier}</Badge>
                      </td>
                      <td>
                        <div style={{ fontSize: '12px' }}>{t.email}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.phone}</div>
                      </td>
                      <td>
                        <strong style={{ fontSize: '13px' }}>₹{t.budgetLimitINR.toLocaleString('en-IN')}</strong>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{bkgCount} segments</span>
                        {hasDisrupted && (
                          <div style={{ color: 'var(--status-critical)', fontSize: '11px', fontWeight: 600 }}>
                            Disrupted Active
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: t.insuranceActive ? 'var(--status-approved)' : 'var(--text-muted)' }}>
                          {t.insuranceActive ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                          <span>{t.insuranceActive ? 'Active' : 'None'}</span>
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="btn btn-secondary btn-sm" style={{ padding: '3px 8px', fontSize: '11px' }}>
                          View
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-Over Profile Drawer */}
      {selectedTraveller && (
        <div 
          className="drawer-backdrop" 
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTraveller(null);
          }}
        >
          <div className="drawer-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 600 }}>{selectedTraveller.name}</h3>
                  <Badge variant="teal">{selectedTraveller.tier}</Badge>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  ID: <code style={{ color: 'var(--accent)' }}>{selectedTraveller.id}</code> • Base: {selectedTraveller.baseCity}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedTraveller(null)}
                style={{ padding: '4px' }}
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Detail Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', fontSize: '12px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Corporate Email</span>
                  <strong>{selectedTraveller.email}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Mobile Phone</span>
                  <strong>{selectedTraveller.phone}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Emergency Contact</span>
                  <strong>{selectedTraveller.emergencyContact}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Disruption Budget Limit</span>
                  <strong style={{ color: 'var(--accent)', fontSize: '14px' }}>₹{selectedTraveller.budgetLimitINR.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Preferences Section */}
              <div style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', backgroundColor: '#FFFFFF' }}>
                <h5 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                  Traveller Profile Preferences
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Seat Preference:</span>
                    <div>{selectedTraveller.preferences.seat}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Meal Specification:</span>
                    <div>{selectedTraveller.preferences.meal}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Hotel Room Type:</span>
                    <div>{selectedTraveller.preferences.hotelRoom}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Transit Flexibility:</span>
                    <div>{selectedTraveller.preferences.transitFlexibility}</div>
                  </div>
                </div>
              </div>

              {/* Associated Bookings */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h5 style={{ fontSize: '14px', fontWeight: 600 }}>
                    Associated Booking Records ({travellerBookings.length})
                  </h5>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Filter:</span>
                    <select
                      className="form-select"
                      style={{ padding: '2px 6px', fontSize: '11px' }}
                      value={bookingStatusFilter}
                      onChange={(e) => setBookingStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="On Schedule">On Schedule</option>
                      <option value="Disrupted">Disrupted</option>
                      <option value="Rebooked">Rebooked</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {travellerBookings.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '12px' }}>
                    No bookings found matching status filter "{bookingStatusFilter}".
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {travellerBookings.map(bkg => {
                      return (
                        <div 
                          key={bkg.id}
                          style={{
                            padding: '12px',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius)',
                            backgroundColor: bkg.status === 'Disrupted' ? 'var(--status-critical-bg)' : '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <strong style={{ fontSize: '13px' }}>{bkg.reference}</strong>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({bkg.type})</span>
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>• {bkg.supplier}</span>
                            </div>
                            <BookingStatusBadge status={bkg.status} />
                          </div>

                          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                            {bkg.serviceName}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <span>Schedule: {bkg.departureOrCheckIn}</span>
                            <span>Cost: <strong>₹{bkg.costINR.toLocaleString('en-IN')}</strong></span>
                          </div>

                          {bkg.disruptionNote && (
                            <div style={{ marginTop: '6px', fontSize: '11px', padding: '6px 8px', backgroundColor: '#FFFFFF', border: '1px solid var(--status-critical-border)', borderRadius: 'var(--radius-sm)', color: 'var(--status-critical)' }}>
                              <strong>Disruption Note:</strong> {bkg.disruptionNote}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
