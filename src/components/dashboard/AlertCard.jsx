import React, { useState } from 'react';
import './AlertCard.css';

export default function AlertCard({ tag, headline, source, time, relevance, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="alert-card">
      <div className="alert-header">
        <span className="alert-tag">{tag}</span>
        <h3 className="alert-headline">{headline}</h3>
        <button className="expand-btn" onClick={() => setIsOpen(!isOpen)}>
          <svg className={isOpen ? 'open' : ''} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>
      {isOpen && (
        <div className="alert-body">
          {children}
        </div>
      )}
      <div className="alert-footer">
        <p className="alert-metadata">{source} • {time}</p>
        <span className="relevance-tag">RELEVANCE: {relevance}</span>
      </div>
    </div>
  );
}