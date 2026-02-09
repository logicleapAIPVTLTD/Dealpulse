import React from 'react';
import './BuyerCard.css';

export default function BuyerCard({ name, primaryDetail, secondaryDetail }) {
  return (
    <div className="buyer-card">
      <p className="buyer-name">{name}</p>
      <p className="buyer-primary">{primaryDetail}</p>
      <p className="buyer-secondary">{secondaryDetail}</p>
    </div>
  );
}