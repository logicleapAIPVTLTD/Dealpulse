import React from 'react';
import './PillarSummaryCard.css';

export default function PillarSummaryCard({ title, subtitle, background, onClick }) {
  return (
    <div 
      className="pillar-summary-card" 
      style={{ background }} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <div className="summary-card-content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <span className="summary-card-prompt">
        View Details →
      </span>
    </div>
  );
}