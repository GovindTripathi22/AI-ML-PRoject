import React from 'react';
import type { ClassPerformance, ConfusionMatrixData } from '../types';

interface ClassBarChartProps {
  data: ClassPerformance[];
}

export const ClassBarChart: React.FC<ClassBarChartProps> = ({ data }) => {
  const chartHeight = 260;
  const barGroupWidth = 140;
  const chartWidth = Math.max(data.length * barGroupWidth + 80, 680);
  const maxF1 = 1.0;

  return (
    <div style={{ overflowX: 'auto', padding: '8px 0' }}>
      <svg width={chartWidth} height={chartHeight} style={{ overflow: 'visible', display: 'block' }}>
        {/* Y Axis Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((val, idx) => {
          const y = chartHeight - 40 - (val / maxF1) * (chartHeight - 70);
          return (
            <g key={idx}>
              <line x1="50" y1={y} x2={chartWidth - 20} y2={y} stroke="var(--border-subtle)" strokeDasharray="3 3" />
              <text x="42" y={y + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">
                {val.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const groupX = 70 + index * barGroupWidth;
          const baselineHeight = (item.baselineF1 / maxF1) * (chartHeight - 70);
          const transformerHeight = (item.transformerF1 / maxF1) * (chartHeight - 70);
          const baselineY = chartHeight - 40 - baselineHeight;
          const transformerY = chartHeight - 40 - transformerHeight;

          return (
            <g key={item.className}>
              {/* Baseline Bar (Muted Slate) */}
              <rect
                x={groupX}
                y={baselineY}
                width="28"
                height={baselineHeight}
                fill="#94A3B8"
                rx="2"
              />
              <text
                x={groupX + 14}
                y={baselineY - 5}
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="var(--text-secondary)"
              >
                {item.baselineF1.toFixed(2)}
              </text>

              {/* Transformer Bar (Deep Teal) */}
              <rect
                x={groupX + 32}
                y={transformerY}
                width="28"
                height={transformerHeight}
                fill="var(--accent)"
                rx="2"
              />
              <text
                x={groupX + 46}
                y={transformerY - 5}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="var(--accent)"
              >
                {item.transformerF1.toFixed(2)}
              </text>

              {/* X Axis Label */}
              <text
                x={groupX + 30}
                y={chartHeight - 20}
                textAnchor="middle"
                fontSize="11"
                fill="var(--text-primary)"
                fontWeight="500"
              >
                {item.className.length > 16 ? item.className.split('/')[0].trim() : item.className}
              </text>
              <text
                x={groupX + 30}
                y={chartHeight - 6}
                textAnchor="middle"
                fontSize="10"
                fill="var(--text-muted)"
              >
                (N={item.support})
              </text>
            </g>
          );
        })}

        {/* X Axis baseline */}
        <line x1="50" y1={chartHeight - 40} x2={chartWidth - 20} y2={chartHeight - 40} stroke="var(--border-color)" />
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '12px', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#94A3B8', borderRadius: '2px' }} />
          <span>Baseline (TF-IDF + LogReg)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--accent)', borderRadius: '2px' }} />
          <span>Fine-Tuned Transformer (InTravel-RoBERTa-v2)</span>
        </div>
      </div>
    </div>
  );
};

interface ConfusionMatrixProps {
  data: ConfusionMatrixData;
}

export const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({ data }) => {
  const { labels, matrix } = data;

  // Find max value in off-diagonal and diagonal to normalize color
  const maxVal = Math.max(...matrix.flat());

  const getCellBg = (val: number, isDiagonal: boolean) => {
    if (val === 0) return '#FFFFFF';
    const intensity = Math.min(val / maxVal, 1);
    if (isDiagonal) {
      // Teal tint
      const alpha = Math.max(0.12, intensity * 0.85);
      return `rgba(15, 118, 110, ${alpha.toFixed(2)})`;
    } else {
      // Muted light red/amber tint for errors
      const alpha = Math.min(0.6, (val / 10) * 0.4);
      return `rgba(220, 38, 38, ${alpha.toFixed(2)})`;
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'inline-block', minWidth: '480px' }}>
        <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Predicted Class &rarr;
        </div>

        <table style={{ borderCollapse: 'collapse', margin: '0 auto', fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right', border: 'none' }}>
                Actual &darr;
              </th>
              {labels.map((label, idx) => (
                <th 
                  key={idx} 
                  style={{ 
                    padding: '8px 12px', 
                    fontWeight: 600, 
                    color: 'var(--text-secondary)', 
                    borderBottom: '1px solid var(--border-color)',
                    textAlign: 'center',
                    fontSize: '11px'
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rIdx) => (
              <tr key={rIdx}>
                <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right', fontSize: '11px', whiteSpace: 'nowrap' }}>
                  {labels[rIdx]}
                </td>
                {row.map((cell, cIdx) => {
                  const isDiagonal = rIdx === cIdx;
                  return (
                    <td
                      key={cIdx}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'center',
                        backgroundColor: getCellBg(cell, isDiagonal),
                        border: '1px solid var(--border-color)',
                        fontWeight: isDiagonal ? 700 : cell > 0 ? 500 : 400,
                        color: isDiagonal ? '#064E3B' : cell > 0 ? '#991B1B' : 'var(--text-muted)',
                        fontFamily: 'monospace',
                        fontSize: '12px'
                      }}
                      title={`Actual: ${labels[rIdx]} | Predicted: ${labels[cIdx]} (${cell} incidents)`}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
