import React from 'react';
import { 
  MODEL_EVALUATION_METRICS, 
  CLASS_PERFORMANCE_METRICS, 
  CONFUSION_MATRIX_DATA 
} from '../data/mockData';
import { ClassBarChart, ConfusionMatrix } from '../components/PlainCharts';
import { Badge } from '../components/Badge';

export const ModelEvalPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Disruption Classifier Evaluation</h1>
          <p className="page-subtitle">
            Offline benchmark results comparing the production Fine-Tuned InTravel Transformer against the legacy TF-IDF baseline.
          </p>
        </div>
        <div>
          <Badge variant="teal">Sample Benchmark Results (Indian Transit Corpus)</Badge>
        </div>
      </div>

      {/* Primary Comparison Metric Table */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Classification Performance Comparison</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Evaluated on an annotated holdout test set of 1,200 Indian transit incident bulletins (IMD, DGCA NOTAMs, GDS alerts, port bulletins).
            </p>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Validation Split: 80% Train / 10% Dev / 10% Test
          </span>
        </div>

        <div className="table-container">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Architecture / Model Pipeline</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>Macro-F1</th>
                <th>Latency (p95)</th>
                <th>Inference Throughput</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_EVALUATION_METRICS.map((row, idx) => {
                const isProduction = idx === 2;
                const statusLabel = idx === 2 ? 'Active Model' : idx === 1 ? 'Benchmark' : 'Deprecated';
                const statusDesc = idx === 2 
                  ? 'Production active in FastAPI endpoint (0.3ms CPU latency)' 
                  : idx === 1 
                  ? 'Transformer benchmark (82.6ms latency)' 
                  : 'Historical baseline (v1.0)';
                return (
                  <tr key={idx} style={{ backgroundColor: isProduction ? '#FAFDFB' : 'transparent' }}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {row.modelName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {statusDesc}
                      </div>
                    </td>
                    <td>
                      <strong>{(row.precision * 100).toFixed(1)}%</strong>
                    </td>
                    <td>
                      <strong>{(row.recall * 100).toFixed(1)}%</strong>
                    </td>
                    <td>
                      <strong style={{ color: isProduction ? 'var(--accent)' : 'inherit', fontSize: '14px' }}>
                        {(row.macroF1 * 100).toFixed(1)}%
                      </strong>
                    </td>
                    <td>{row.latencyP95Ms} ms</td>
                    <td>{row.throughputSamplesSec.toLocaleString()} samples/sec</td>
                    <td>
                      <Badge variant={isProduction ? 'approved' : 'neutral'}>
                        {statusLabel}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Bar Chart & Confusion Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
        {/* Per-Class Bar Chart */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Per-Class Macro-F1 Breakdown</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Comparison across 5 transit disruption event categories. Muted slate indicates baseline; deep teal indicates fine-tuned transformer.
            </p>
          </div>
          <ClassBarChart data={CLASS_PERFORMANCE_METRICS} />
        </div>

        {/* Confusion Matrix */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Transformer Confusion Matrix</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Prediction distribution matrix on 1,200 holdout incidents. Rows represent ground truth labels; columns indicate model predictions.
            </p>
          </div>
          <ConfusionMatrix data={CONFUSION_MATRIX_DATA} />
        </div>
      </div>

      {/* Evaluation Methodology Notes */}
      <div className="card" style={{ padding: '20px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '10px' }}>
          Operational Annotation & Calibration Notes
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          <div>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              Corpus Stratification
            </strong>
            Data collected over 18 months from civil aviation bulletins (DGCA NOTAMs, AOCC), IMD meteorological radars, and railway TDR records. Dual-annotated by two senior travel operations leads with an inter-annotator agreement (Cohen's Kappa) of 0.91.
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              Severe Weather vs Landslide Differentiation
            </strong>
            The transformer backbone achieved its highest gain (+19% F1) on complex compound events like coastal monsoons triggering hill road mudslides (e.g., Kerala Gap Road), which the bag-of-words baseline routinely misclassified as generic rain delays.
          </div>
          <div>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              Confidence Threshold Calibration
            </strong>
            Incidents with classifier confidence below 90.0% automatically bypass autonomous recovery drafting and trigger an "Operations Desk Manual Review" task before traveller notifications can be dispatched.
          </div>
        </div>
      </div>
    </div>
  );
};
