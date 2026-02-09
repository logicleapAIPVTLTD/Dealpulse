import React from 'react';
import './CompetitorItem.css';

export default function CompetitorItem({ name, description, tagText, tagColor }) {
  const tagStyle = {
    backgroundColor: tagColor === 'green' ? '#E6F4EA' : '#EBF4FF',
    color: tagColor === 'green' ? '#28a745' : '#0052FF',
    border: `1px solid ${tagColor === 'green' ? '#C3E6CB' : '#B3D1FF'}`,
  };

  return (
    <div className="competitor-item">
      <p className="competitor-name">{name}</p>
      <p className="competitor-description">{description}</p>
      <span className="competitor-tag" style={tagStyle}>{tagText}</span>
    </div>
  );
}