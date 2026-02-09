import React from 'react';
import './TrendIndicator.css';

export default function TrendIndicator({ icon, title, subtitle, progress }) {
  return (
    <div className="trend-indicator">
      <div className="trend-header">
        <span className="trend-icon">{icon}</span>
        <div className="trend-info">
          <p className="trend-title">{title}</p>
          <p className="trend-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}