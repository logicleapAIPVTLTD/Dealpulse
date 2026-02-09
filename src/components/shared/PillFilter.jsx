import React from 'react';
import './PillFilter.css';

// The component now takes the currently selected pill and an `onSelect` function as props.
export default function PillFilter({ options, selectedPill, onPillSelect }) {
  return (
    <div className="pill-filter">
      {options.map(opt => (
        <button
          key={opt.value}
          // The 'active' class is now determined by the prop from the parent
          className={`pill-btn ${selectedPill === opt.value ? 'active' : ''}`}
          // Clicking a button now calls the function passed down from the parent
          onClick={() => onPillSelect(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}