import React from 'react';
import './PillarHeader.css';

// No changes to the JS, the existing `chipStyle` prop will work
export default function PillarHeader({ title, subtitle, chipText, background, chipStyle = 'default' }) {
  return (
    <div className="pillar-header" style={{ background }}>
      <div className="pillar-header-content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="pillar-header-right">
        {chipText && <span className={`pillar-chip ${chipStyle}`}>{chipText}</span>}
        <div className="status-dot"></div>
      </div>
    </div>
  );
}