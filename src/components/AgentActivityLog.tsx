import React, { useState } from 'react';
import type { AgentStep } from '../types';
import { Play, CheckCircle2, Loader2, Code, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context';

interface AgentActivityLogProps {
  incidentId: string;
  steps: AgentStep[];
}

export const AgentActivityLog: React.FC<AgentActivityLogProps> = ({
  incidentId,
  steps
}) => {
  const { replayIncidentAnalysis } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [expandedPayloads, setExpandedPayloads] = useState<Record<number, boolean>>({});

  const handleRunAnalysis = async () => {
    setIsRunning(true);
    try {
      await replayIncidentAnalysis(incidentId);
    } finally {
      setIsRunning(false);
    }
  };

  const togglePayload = (stepNum: number) => {
    setExpandedPayloads(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Autonomous Pipeline Execution Timeline</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Sequential agent orchestration trace (Ingest &rarr; Graph Traversal &rarr; Dense Policy Retrieval &rarr; Multi-Option Synthesis).
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleRunAnalysis}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 size={13} className="spinner" style={{ borderTopColor: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }} />
              <span>Running Analysis...</span>
            </>
          ) : (
            <>
              <Play size={13} />
              <span>Run Analysis (Replay)</span>
            </>
          )}
        </button>
      </div>

      <div className="timeline">
        {steps.map((step) => {
          const isCompleted = step.status === 'Completed';
          const isInProgress = step.status === 'In Progress';
          const isPayloadExpanded = expandedPayloads[step.step];

          return (
            <div 
              key={step.step} 
              className={`timeline-item ${isCompleted ? 'completed' : isInProgress ? 'in-progress' : 'pending'}`}
            >
              <div className="timeline-marker">
                {isCompleted ? (
                  <CheckCircle2 size={18} />
                ) : isInProgress ? (
                  <Loader2 size={18} className="spinner" />
                ) : (
                  <span>{step.step}</span>
                )}
              </div>

              <div className="timeline-content">
                <div className="timeline-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="timeline-title">
                      Step {step.step}: {step.name}
                    </span>
                    <span 
                      className={`badge ${isCompleted ? 'badge-approved' : isInProgress ? 'badge-teal' : 'badge-neutral'}`}
                      style={{ fontSize: '10px' }}
                    >
                      {step.status}
                    </span>
                  </div>
                  <div className="timeline-meta">
                    {step.timestamp} {step.durationMs ? `(${step.durationMs}ms)` : ''}
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.45' }}>
                  {step.details}
                </p>

                {step.payloadSummary && (
                  <div style={{ marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => togglePayload(step.step)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0
                      }}
                    >
                      <Code size={12} />
                      <span>{isPayloadExpanded ? 'Hide Payload JSON' : 'Inspect Pipeline Payload'}</span>
                      {isPayloadExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {isPayloadExpanded && (
                      <pre className="timeline-payload">
                        {(() => {
                          try {
                            return JSON.stringify(JSON.parse(step.payloadSummary), null, 2);
                          } catch {
                            return step.payloadSummary;
                          }
                        })()}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
