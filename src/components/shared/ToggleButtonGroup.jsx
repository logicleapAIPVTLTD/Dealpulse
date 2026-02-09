import React, { useState } from 'react';
import './ToggleButtonGroup.css';

export default function ToggleButtonGroup({ options }) {
  const [selected, setSelected] = useState(options[0].value);
  return (
    <div className="toggle-group">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`toggle-btn ${selected === opt.value ? 'active' : ''}`}
          onClick={() => setSelected(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}