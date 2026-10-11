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
  RotateCcw 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

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
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/travellers" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Users size={16} />
            <span>Travellers</span>
          </NavLink>
          <NavLink 
            to="/policies" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            <span>Policy Library</span>
          </NavLink>
          <NavLink 
            to="/model-eval" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Cpu size={16} />
            <span>Model Evaluation</span>
          </NavLink>
          <NavLink 
            to="/architecture" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Network size={16} />
            <span>Architecture</span>
          </NavLink>
          <NavLink 
            to="/audit" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <History size={16} />
            <span>Audit Trail</span>
          </NavLink>
        </nav>

        <div className="nav-meta">
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
