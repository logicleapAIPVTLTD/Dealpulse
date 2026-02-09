import React from 'react';
import './EntitiesCard.css';

// Reusing .analytics-card styles, so this component is simpler

// Child component for the circular progress bar
function CircularProgressBar({ percentage }) {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100 * circumference);

    return (
        <svg className="circular-progress" width="50" height="50" viewBox="0 0 50 50">
            <circle className="bg" cx="25" cy="25" r={radius} />
            <circle className="fg" cx="25" cy="25" r={radius} style={{ strokeDashoffset: offset, strokeDasharray: circumference }} />
            <text x="50%" y="50%" dy=".3em" textAnchor="middle" className="text">{percentage}%</text>
        </svg>
    );
}

// Child component for a single entity item
function EntityListItem({ name, tags, percentage, metadata }) {
    return (
        <div className="entity-list-item">
            <div className="entity-info">
                <p className="entity-name">{name}</p>
                <div className="entity-tags">
                    {tags.map(tag => <span key={tag} className="entity-tag">{tag}</span>)}
                </div>
                <p className="entity-metadata">{metadata}</p>
            </div>
            <CircularProgressBar percentage={percentage} />
        </div>
    );
}

// Main EntitiesCard component
export default function EntitiesCard({ entitiesData }) {
  return (
    <div className="analytics-card">
      <h3 className="analytics-card-title">Top Entities</h3>
      <div className="entities-list">
        {entitiesData.map(item => (
          <EntityListItem key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}