import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { IncidentDetailPage } from './pages/IncidentDetailPage';
import { TravellersPage } from './pages/TravellersPage';
import { PolicyLibraryPage } from './pages/PolicyLibraryPage';
import { ModelEvalPage } from './pages/ModelEvalPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map(toast => {
        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {toast.type === 'success' && <CheckCircle size={16} style={{ color: 'var(--status-approved)' }} />}
              {toast.type === 'warning' && <AlertTriangle size={16} style={{ color: 'var(--status-warning)' }} />}
              {toast.type === 'error' && <AlertCircle size={16} style={{ color: 'var(--status-critical)' }} />}
              {toast.type === 'info' && <Info size={16} style={{ color: 'var(--accent)' }} />}
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content" role="main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          <Route path="/travellers" element={<TravellersPage />} />
          <Route path="/policies" element={<PolicyLibraryPage />} />
          <Route path="/model-eval" element={<ModelEvalPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/audit" element={<AuditTrailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="app-footer" role="contentinfo">
        <div className="footer-inner">
          <div>
            <strong>TripShield Operations Console</strong> &bull; Travel Disruption Detection & Recovery Suite
          </div>
          <div>
            DGCA Civil Aviation Requirements compliant &bull; INR Currency Native &bull; Human-in-the-Loop Gateway
          </div>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
