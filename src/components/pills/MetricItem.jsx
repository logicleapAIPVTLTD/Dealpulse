import React from 'react';
import './MetricItem.css';

export default function MetricItem({ label, value, secondaryValue, sentimentColor }) {
  return (
    <div className="metric-item">
      {sentimentColor && <div className="sentiment-bar" style={{ backgroundColor: sentimentColor }}></div>}
      <div className="metric-item-content">
        <p className="metric-item-label">{label}</p>
        <p className="metric-item-value" style={{ color: sentimentColor }}>{value}</p>
        {secondaryValue && <p className="metric-item-secondary">{secondaryValue}</p>}
      </div>
    </div>
  );
}