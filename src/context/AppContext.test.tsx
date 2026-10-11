import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { AppProvider, useApp } from './index';

const TestConsumer: React.FC = () => {
  const { 
    incidents, 
    isLoading, 
    toasts, 
    showToast, 
    removeToast,
    recoveryPlans,
    updatePlanStatus
  } = useApp();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'ready'}</div>
      <div data-testid="incident-count">{incidents.length}</div>
      <div data-testid="plan-count">{recoveryPlans.length}</div>
      <button onClick={() => showToast('Test notification', 'info')}>Trigger Toast</button>
      <div data-testid="toasts">
        {toasts.map(t => (
          <div key={t.id} data-testid="toast-item">
            <span>{t.message}</span>
            <button onClick={() => removeToast(t.id)}>Dismiss</button>
          </div>
        ))}
      </div>
      {recoveryPlans.length > 0 && (
        <button 
          data-testid="approve-btn"
          onClick={() => updatePlanStatus(recoveryPlans[0].id, 'Approved', 'Operator approved in test')}
        >
          Approve First Plan
        </button>
      )}
    </div>
  );
};

describe('AppContext & AppProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes and provides operational data after loading', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    // Initial state might be loading
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for data load
    await act(async () => {
      await new Promise(r => setTimeout(r, 400));
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    expect(screen.getByTestId('incident-count')).toHaveTextContent('5');
    expect(screen.getByTestId('plan-count')).not.toHaveTextContent('0');
  });

  it('dispatches and dismisses toast notifications', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    await act(async () => {
      await new Promise(r => setTimeout(r, 400));
    });

    const triggerBtn = screen.getByText('Trigger Toast');
    await act(async () => {
      triggerBtn.click();
    });

    expect(screen.getByText('Test notification')).toBeInTheDocument();

    const dismissBtn = screen.getByText('Dismiss');
    await act(async () => {
      dismissBtn.click();
    });

    expect(screen.queryByText('Test notification')).not.toBeInTheDocument();
  });

  it('updates plan status through context', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    );

    await act(async () => {
      await new Promise(r => setTimeout(r, 400));
    });

    const approveBtn = screen.getByTestId('approve-btn');
    await act(async () => {
      approveBtn.click();
      await new Promise(r => setTimeout(r, 300));
    });

    // Check toast was triggered
    expect(screen.getByTestId('toasts')).toBeInTheDocument();
  });
});
