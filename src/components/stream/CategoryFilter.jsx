import React, { useState } from 'react';
import './CategoryFilter.css';

const options = [
  { label: 'All', value: 'all', color: '#0052FF' },
  { label: 'Macro', value: 'macro', color: '#28a745' },
  { label: 'Industry', value: 'industry', color: '#17a2b8' },
  { label: 'Company', value: 'company', color: '#ffc107' },
  { label: 'Deals', value: 'deals', color: '#dc3545' },
];

export default function CategoryFilter() {
  const [selected, setSelected] = useState('all');
  return (
    <div className="category-filter">
      {options.map(opt => (
        <button
          key={opt.value}
          className={selected === opt.value ? 'active' : ''}
          style={{ '--active-color': opt.color }}
          onClick={() => setSelected(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}