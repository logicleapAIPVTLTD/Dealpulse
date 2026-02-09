import React from 'react';
import './DealCard.css';

export default function DealCard({ name, value, secondaryValue, status }) {
  return (
    <div className="deal-card">
      <p className="deal-name">{name}</p>
      <div className="deal-details">
        <div className="deal-main">
          <span className="value-tag">{value}</span>
          <p className="deal-status">{status}</p>
        </div>
        <p className="deal-secondary">{secondaryValue}</p>
      </div>
    </div>
  );
}