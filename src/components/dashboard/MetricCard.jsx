import React from 'react';
import './MetricCard.css';

export default function MetricCard({ title, value, subtitle, icon, valueColor }) {
  return (
    <div className="metric-card">
      <div className="metric-card-content">
        <p className="metric-title">{title}</p>
        <p className="metric-value" style={{ color: valueColor || 'inherit' }}>{value}</p>
        <p className="metric-subtitle">{subtitle}</p>
      </div>
      <div className="metric-card-icon">
        {icon}
      </div>
    </div>
  );
}