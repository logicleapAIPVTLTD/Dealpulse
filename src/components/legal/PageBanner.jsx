import React from 'react';
// We can reuse the CSS from the matching page's banner if desired,
// but for clarity, we'll create a new one for this distinct style.
import './PageBanner.css';

export default function PageBanner({ icon, title, subtitle }) {
  return (
    <div className="legal-page-banner">
      <div className="banner-icon">{icon}</div>
      <div className="banner-text">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}