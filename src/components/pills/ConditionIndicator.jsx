import React from 'react';
import './ConditionIndicator.css';

export default function ConditionIndicator({ label, value, valueColor, sentimentColor }) {
  return (
    <div className="condition-indicator">
      <div className="condition-bar" style={{ backgroundColor: sentimentColor }}></div>
      <div className="condition-content">
        <p className="condition-label">{label}</p>
        <p className="condition-value" style={{ color: valueColor }}>{value}</p>
      </div>
    </div>
  );
}