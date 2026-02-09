import React from 'react';
import './IntelligenceSummaryCard.css';

export default function IntelligenceSummaryCard({ icon, title, titleColor, children }) {
  return (
    <div className="summary-card">
      <div className="summary-card-header">
        <span className="summary-card-icon">{icon}</span>
        <h4 style={{ color: titleColor }}>{title}</h4>
      </div>
      <div className="summary-card-body">
        {children}
      </div>
    </div>
  );
}