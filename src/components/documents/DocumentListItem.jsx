import React from 'react';
import './DocumentListItem.css';

// Helper to determine status color
const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'processed': return '#28a745';
        case 'pending': return '#ffc107';
        case 'error': return '#dc3545';
        default: return '#6c757d';
    }
};

export default function DocumentListItem({ name, size, date, status }) {
  const statusColor = getStatusColor(status);

  return (
    <div className="doc-list-item">
      <div className="doc-icon">
        {/* PDF Icon SVG */}
        <svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      </div>
      <div className="doc-details">
        <p className="doc-name">{name}</p>
        <p className="doc-meta">{size} MB • Uploaded on {date}</p>
      </div>
      <div className="doc-status">
        <span className="status-pill" style={{ backgroundColor: statusColor }}>
          {status}
        </span>
      </div>
      <div className="doc-actions">
        <button className="action-btn view">View</button>
        <button className="action-btn delete">Delete</button>
      </div>
    </div>
  );
}