import React, { useState, useEffect, useCallback } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface HealthResponse {
  status: string;
  model_loaded: boolean;
  supported_jurisdictions?: string[];
}

export const LiveStatusBadge: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/health', { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data: HealthResponse = await res.json();
        setIsLive(data.status === 'healthy' && data.model_loaded);
      } else {
        setIsLive(false);
      }
    } catch {
      setIsLive(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    // Avoid synchronous setState in effect
    const timer = setTimeout(() => {
      checkHealth();
    }, 100);
    const interval = setInterval(checkHealth, 15000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [checkHealth]);

  return (
    <button
      type="button"
      onClick={checkHealth}
      title={isLive ? 'FastAPI Microservice is connected on port 8000' : 'FastAPI server not detected — using in-browser offline engine'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        fontSize: '11px',
        fontWeight: 600,
        borderRadius: '999px',
        border: `1px solid ${isLive ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}`,
        backgroundColor: isLive ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
        color: isLive ? '#059669' : '#D97706',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      {checking ? (
        <RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} />
      ) : isLive ? (
        <Wifi size={11} />
      ) : (
        <WifiOff size={11} />
      )}
      <span>{isLive ? 'ML Backend: Live' : 'Offline Engine'}</span>
    </button>
  );
};
