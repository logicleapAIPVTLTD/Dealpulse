import React from 'react';
import './CatalystIndicator.css';

export default function CatalystIndicator({ label, subtitle, percentage, sentimentColor }) {
  const barStyle = { backgroundColor: sentimentColor };
  const percentBoxStyle = { 
    backgroundColor: sentimentColor,
    color: '#fff' // Assuming white text for all colors
  };

  return (
    <div className="catalyst-indicator">
      <div className="curved-bar" style={barStyle}></div>
      <div className="catalyst-content">
        <p className="catalyst-label">{label}</p>
        <p className="catalyst-subtitle">{subtitle}</p>
      </div>
      <div className="percentage-box" style={percentBoxStyle}>
        {percentage}%
      </div>
    </div>
  );
}