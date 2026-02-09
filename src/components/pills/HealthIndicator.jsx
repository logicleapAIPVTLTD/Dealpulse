import React from 'react';
import './HealthIndicator.css';

// Helper to convert hex color to rgba for the background
const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function HealthIndicator({ label, value, sentimentColor }) {
  const itemStyle = {
    borderLeft: `4px solid ${sentimentColor}`,
    backgroundColor: hexToRgba(sentimentColor, 0.08)
  };

  return (
    <div className="health-indicator" style={itemStyle}>
      <p className="health-label">{label}</p>
      <p className="health-value" style={{ color: sentimentColor }}>{value}</p>
    </div>
  );
}