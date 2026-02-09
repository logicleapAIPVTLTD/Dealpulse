import React from 'react';
import './PageBanner.css';

export default function PageBanner({ icon, title, subtitle }) {
  return (
    <div className="prediction-page-banner">
      <div className="banner-icon">{icon}</div>
      <div className="banner-text">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}