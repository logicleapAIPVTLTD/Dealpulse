import React from 'react';
import './SectionHeader.css';

export default function SectionHeader({ icon, title, children }) {
  return (
    <div className="section-header">
      <div className="section-header-title">
        {icon}
        <h2>{title}</h2>
      </div>
      <div className="section-header-actions">
        {children}
      </div>
    </div>
  );
}