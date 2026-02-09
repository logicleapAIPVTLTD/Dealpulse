import React from 'react';
import './CompanyCard.css';

export default function CompanyCard({ name, rating, ratingColor, description, metric }) {
  const ratingStyle = {
    backgroundColor: ratingColor,
    color: '#fff',
  };

  return (
    <div className="company-card">
      <div className="company-info">
        <p className="company-name">{name}</p>
        <span className="rating-tag" style={ratingStyle}>{rating}</span>
        <p className="company-description">{description}</p>
      </div>
      <p className="company-metric">{metric}</p>
    </div>
  );
}