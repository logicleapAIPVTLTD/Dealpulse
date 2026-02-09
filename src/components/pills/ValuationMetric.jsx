import React from 'react';
import './ValuationMetric.css';

export default function ValuationMetric({ label, value, comparison, sentimentColor }) {
  return (
    <div className="valuation-metric">
      <div className="sentiment-bar" style={{ backgroundColor: sentimentColor }}></div>
      <div className="valuation-content">
        <p className="valuation-label">{label}</p>
        <p className="valuation-value">
          {value}
          <span className="value-icon">↕️</span>
        </p>
        <p className="valuation-comparison">{comparison}</p>
      </div>
    </div>
  );
}