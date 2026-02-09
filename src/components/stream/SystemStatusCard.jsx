import React from 'react';
import './SystemStatusCard.css';

// This is the reusable row component from your list
function StatusIndicatorItem({ label, status, metric }) {
    return (
        <div className="status-indicator-item">
            <p className="status-label">{label}</p>
            <div className="status-details">
                {status && (
                    <>
                        <div className="status-line"></div>
                        <span className="status-pill">{status}</span>
                    </>
                )}
                {metric && <p className="status-metric">{metric}</p>}
            </div>
        </div>
    );
}

// Main card component
export default function SystemStatusCard({ systemStatusData }) {
  return (
    <div className="analytics-card">
      <h3 className="analytics-card-title">System Status</h3>
      <div className="status-list">
        {systemStatusData.map(item => (
            <StatusIndicatorItem key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}