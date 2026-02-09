import React from 'react';
import './SentimentCard.css';

// Child component for a single sentiment bar
function SentimentBar({ label, color, percentage }) {
  return (
    <div className="sentiment-bar">
      <div className="sentiment-label">
        <span className="color-dot" style={{ backgroundColor: color }}></span>
        {label}
      </div>
      <div className="sentiment-progress-container">
        <div className="sentiment-progress" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
      </div>
      <div className="sentiment-percentage">{percentage}%</div>
    </div>
  );
}

// Child component for the "Market Mood" banner
function StatusBanner() {
    return (
        <div className="status-banner-mood">
            <strong>Market Mood:</strong> Neutral - Balanced market conditions
        </div>
    );
}

// Main SentimentCard component
export default function SentimentCard({ sentimentData }) {
  return (
    <div className="analytics-card">
      <h3 className="analytics-card-title">Market Sentiment</h3>
      <div className="sentiment-list">
        {sentimentData.map(item => (
          <SentimentBar key={item.label} {...item} />
        ))}
      </div>
      <StatusBanner />
    </div>
  );
}