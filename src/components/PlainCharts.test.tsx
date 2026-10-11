import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClassBarChart, ConfusionMatrix } from './PlainCharts';
import { CLASS_PERFORMANCE_METRICS, CONFUSION_MATRIX_DATA } from '../data/mockData';

describe('PlainCharts Components', () => {
  it('renders ClassBarChart with data items and SVG bars', () => {
    const { container } = render(<ClassBarChart data={CLASS_PERFORMANCE_METRICS} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();

    CLASS_PERFORMANCE_METRICS.forEach(item => {
      const shortName = item.className.length > 16 ? item.className.split('/')[0].trim() : item.className;
      expect(screen.getByText(shortName)).toBeInTheDocument();
    });
  });

  it('renders ConfusionMatrix with label headers and values', () => {
    render(<ConfusionMatrix data={CONFUSION_MATRIX_DATA} />);
    CONFUSION_MATRIX_DATA.labels.forEach(label => {
      const elements = screen.getAllByText(label);
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});
