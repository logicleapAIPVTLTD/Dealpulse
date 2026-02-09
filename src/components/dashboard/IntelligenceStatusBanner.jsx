import React from 'react';
import './IntelligenceStatusBanner.css';

const statuses = [
  { name: 'News', status: 'Limited', icon: '📰' },
  { name: 'Markets', status: 'Limited access', icon: '📈' },
  { name: 'Macro', status: 'Basic data only', icon: '🌍' },
];

export default function IntelligenceStatusBanner() {
  return (
    <div className="status-banner">
      <strong>Real-time intelligence active</strong>
      <div className="statuses">
        {statuses.map(item => (
          <div key={item.name} className="status-item">
            {item.icon} {item.name}: <span>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}