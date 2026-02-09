// import React from 'react';
// import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
// import './MatchResultCard.css';

// export default function MatchResultCard({ name, description, location }) {
//   const navigate = useNavigate(); // 2. Get the navigate function

//   // 3. Create a handler for the button click
//   const handleViewClick = () => {
//     // 4. Navigate to the new route, passing the company name
//     navigate(`/company/${encodeURIComponent(name)}`);
//   };

//   return (
//     <div className="match-card">
//       <div className="match-info">
//         <div className="match-header">
//           <h3>{name}</h3>
//         </div>
        
//         <p className="match-description">{description}</p>
        
//         <div className="match-details-list">
//             <p className="match-detail-item"><span>📍</span> {location}</p>
//         </div>

//         <div className="match-actions">
//             {/* 5. Attach the click handler to the button */}
//             <button className="view-results-btn" onClick={handleViewClick}>
//               View Results
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import './MatchResultCard.css';

export default function MatchResultCard({ name, description, location, onViewDetails }) {

  return (
    <div className="match-card">
      <div className="match-info">
        <div className="match-header">
          <h3>{name}</h3>
        </div>
        
        <p className="match-description">{description}</p>
        
        <div className="match-details-list">
            <p className="match-detail-item"><span>📍</span> {location}</p>
        </div>

        <div className="match-actions">
            <button className="view-results-btn" onClick={onViewDetails}>
              View Details
            </button>
        </div>
      </div>
    </div>
  );
}
