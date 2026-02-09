import React from 'react';
import './ConnectionStatus.css';

export default function ConnectionStatus() {
  return (
    <div className="connection-status">
      {/* Wi-Fi Icon SVG */}
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a8 8 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16a4 4 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
      <span>Connected - Real-time updates active</span>
    </div>
  );
}