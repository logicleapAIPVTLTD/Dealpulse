import React from 'react';
import './MetricListItem.css';

export default function MetricListItem({ label, value, valueColor }) {
  return (
    <div className="metric-list-item">
      <p className="metric-list-label">{label}</p>
      <p className="metric-list-value" style={{ color: valueColor || 'inherit' }}>{value}</p>
    </div>
  );
}