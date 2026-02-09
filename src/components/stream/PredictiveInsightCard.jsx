import React from 'react';
import './PredictiveInsightCard.css';

export default function PredictiveInsightCard({ icon, title, description, confidence, timeframe, background }) {
  return (
    <div className="predictive-card" style={{ background }}>
      <div className="predictive-card-content">
        <div className="predictive-card-header">
          <span className="predictive-icon">{icon}</span>
          <h4 className="predictive-title">{title}</h4>
        </div>
        <p className="predictive-description">{description}</p>
        <p className="predictive-confidence">
          <span>🛡️</span> Confidence: {confidence}
        </p>
      </div>
      <span className="timeframe-tag">{timeframe}</span>
    </div>
  );
}