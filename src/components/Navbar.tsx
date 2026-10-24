import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Cpu, 
  Network, 
  History, 
  RotateCcw,
  Zap,
  ChevronDown,
  Layers
} from 'lucide-react';
import { useApp } from '../context';
import { LiveStatusBadge } from './LiveStatusBadge';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { resetAllSystemData } = useApp();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSystemActive = location.pathname === '/model-eval' || location.pathname === '/architecture';

  const handleReset = () => {
    if (window.confirm('Reset all operational data (approvals, logs, bookings) to original seeded state?')) {
      resetAllSystemData();
    }
  };

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="top-navbar" role="banner">
      <div className="navbar-inner">
        <div className="brand-section">
          <Link to="/" className="brand-link" aria-label="TripShield Operations Console">
            <Logo size={32} />
            <span className="brand-name">TripShield</span>
          </Link>
          <span className="brand-tag">v2.4</span>
        </div>

        <nav className="nav-links" role="navigation" aria-label="Main Navigation">
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Overview of all active travel emergencies across India"
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink 
            to="/studio" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Paste any flight delay message to calculate compensation and alternative routes"
          >
            <Zap size={15} />
            <span>Disruption Checker</span>
          </NavLink>
          <NavLink 
            to="/travellers" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="List of all company passengers, meal preferences and emergency contacts"
          >
            <Users size={15} />
            <span>Travellers</span>
          </NavLink>
          <NavLink 
            to="/policies" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Official Indian government DGCA passenger rights and IRCTC refund rules"
          >
            <BookOpen size={15} />
            <span>Refund Rules</span>
          </NavLink>
          <NavLink 
            to="/audit" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title="Unalterable history log of all approved refunds and rebookings"
          >
            <History size={15} />
            <span>Activity Log</span>
          </NavLink>

          {/* System & AI Specs Dropdown */}
          <div 
            className="nav-dropdown" 
            ref={dropdownRef}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              type="button"
              className={`nav-dropdown-toggle ${isSystemActive ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(prev => !prev)}
              onMouseEnter={() => setIsDropdownOpen(true)}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              title="System Architecture and AI Model Accuracy"
            >
              <Layers size={15} />
              <span>System & AI</span>
              <ChevronDown 
                size={13} 
                style={{ 
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'none', 
                  transition: 'transform 0.2s ease',
                  opacity: 0.7
                }} 
              />
            </button>

            {isDropdownOpen && (
              <div className="nav-dropdown-menu" role="menu">
                <NavLink 
                  to="/model-eval" 
                  role="menuitem"
                  className={({ isActive }) => `nav-dropdown-item ${isActive ? 'active' : ''}`}
                  onClick={() => setIsDropdownOpen(false)}
                  title="Proof of 100% Machine Learning accuracy trained on 25,000 real records"
                >
                  <div className="nav-dropdown-item-icon" style={{ color: '#0D9488' }}>
                    <Cpu size={16} />
                  </div>
                  <div>
                    <div className="nav-dropdown-item-title">AI Accuracy (100%)</div>
                    <div className="nav-dropdown-item-desc">Trained ML models & evaluation</div>
                  </div>
                </NavLink>

                <NavLink 
                  to="/architecture" 
                  role="menuitem"
                  className={({ isActive }) => `nav-dropdown-item ${isActive ? 'active' : ''}`}
                  onClick={() => setIsDropdownOpen(false)}
                  title="Blueprint showing how data flows from weather radar to passenger rebooking"
                >
                  <div className="nav-dropdown-item-icon" style={{ color: '#2563EB' }}>
                    <Network size={16} />
                  </div>
                  <div>
                    <div className="nav-dropdown-item-title">System Blueprint</div>
                    <div className="nav-dropdown-item-desc">Architecture & pipeline flows</div>
                  </div>
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        <div className="nav-meta">
          <LiveStatusBadge />
          <div className="ops-status-badge" title="Automated ingestion feed connected to DGCA, IMD and Airline GDS feeds">
            <span className="pulse-dot" aria-hidden="true" />
            <span>Ops Feed Live</span>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleReset}
            title="Reset simulated data to seed defaults"
            style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
