import React from 'react';
import './SummaryStatCard.css';

export default function SummaryStatCard({ title, value, subtitle, icon }) {
  return (
    <div className="summary-stat-card">
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
        <p className="stat-subtitle">{subtitle}</p>
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  );
}