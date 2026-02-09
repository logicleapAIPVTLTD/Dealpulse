import React from 'react';
import './CaseCard.css';

const getStatusStyles = (status) => {
    switch (status.toLowerCase()) {
        case 'active':
            return { backgroundColor: '#EBF4FF', color: '#0052FF' };
        case 'judgment reserved':
            return { backgroundColor: '#FFFBE6', color: '#ffc107' };
        default:
            return {};
    }
};

export default function CaseCard({ title, caseId, status, nextHearing, impactScore, affectedDeals }) {
  const statusStyle = getStatusStyles(status);
  
  return (
    <div className="case-card">
      <div className="case-header">
        <div className="case-title-group">
          <h3>{title}</h3>
          <p>Case ID: {caseId}</p>
        </div>
        <span className="case-status-tag" style={statusStyle}>{status}</span>
      </div>
      <div className="case-metrics">
        <div className="metric-item">
            <label>Next Hearing</label>
            <p>{nextHearing}</p>
        </div>
        <div className="metric-item">
            <label>Impact Score</label>
            <p className="impact-score">{impactScore}</p>
        </div>
        <div className="metric-item">
            <label>Affected Deals</label>
            <p>{affectedDeals}</p>
        </div>
      </div>
    </div>
  );
}