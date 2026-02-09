import React from 'react';
import './PredictionCard.css';

export default function PredictionCard({ name, status, catalyst, tags, probability }) {
  const probabilityColor = probability > 85 ? '#dc3545' : '#ffc107';

  return (
    <div className="prediction-card">
      <div className="prediction-info">
        <h3>{name}</h3>
        <p className="prediction-status">{status}</p>
        
        <div className="catalyst-section">
          <h4>Primary Catalyst</h4>
          <p>{catalyst}</p>
        </div>
        
        <div className="tags-section">
          {tags.map((tag, index) => (
            <span key={index} className="prediction-tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="prediction-probability-container">
        <p className="prediction-probability" style={{ color: probabilityColor }}>{probability}%</p>
        <p className="prediction-probability-label">Probability</p>
      </div>
    </div>
  );
}