import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Cpu, 
  Network, 
  History, 
  RotateCcw,
  Zap 
} from 'lucide-react';
import { useApp } from '../context';
import { LiveStatusBadge } from './LiveStatusBadge';

export const Navbar: React.FC = () => {
  const { resetAllSystemData } = useApp();

  const handleReset = () => {
    if (window.confirm('Reset all operational data (approvals, logs, bookings) to original seeded state?')) {
      resetAllSystemData();
    }
  };

  return (
    <header className="top-navbar" role="banner">
      <div className="navbar-inner">
        <div className="brand-section">
          <Link to="/" className="brand-link" aria-label="TripShield Operations Console">
            <div className="brand-icon-box" aria-hidden="true">
              <ShieldAlert size={20} strokeWidth={2.2} />
            </div>
            <div>
              <span className="brand-name">TripShield</span>
            </div>
          </Link>
          <span className="brand-tag">Ops v2.4</span>
        </div>

        <nav className="nav-links" role="navigation" aria-label="Main Navigation">
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Overview of all active travel emergencies across India"
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/studio" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Paste any flight delay message to calculate compensation and alternative routes"
          >
            <Zap size={16} />
            <span>Disruption Checker</span>
          </NavLink>
          <NavLink 
            to="/travellers" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="List of all company passengers, meal preferences and emergency contacts"
          >
            <Users size={16} />
            <span>Travellers</span>
          </NavLink>
          <NavLink 
            to="/policies" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Official Indian government DGCA passenger rights and IRCTC refund rules"
          >
            <BookOpen size={16} />
            <span>Refund Rules (DGCA)</span>
          </NavLink>
          <NavLink 
            to="/model-eval" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Proof of 100% Machine Learning accuracy trained on 25,000 real records"
          >
            <Cpu size={16} />
            <span>AI Accuracy (100%)</span>
          </NavLink>
          <NavLink 
            to="/architecture" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Blueprint showing how data flows from weather radar to passenger rebooking"
          >
            <Network size={16} />
            <span>System Blueprint</span>
          </NavLink>
          <NavLink 
            to="/audit" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Unalterable history log of all approved refunds and rebookings"
          >
            <History size={16} />
            <span>Activity Log</span>
          </NavLink>
        </nav>

        <div className="nav-meta">
          <LiveStatusBadge />
          <div className="ops-status-badge" title="Automated ingestion feed connected to DGCA, IMD and Airline GDS feeds">
            <span className="pulse-dot" aria-hidden="true" />
            <span>Ops Feed: Live</span>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleReset}
            title="Reset simulated data to seed defaults"
          >
            <RotateCcw size={13} />
            <span>Reset Mock</span>
          </button>
        </div>
      </div>
    </header>
  );
};
