import React from 'react';
import PageBanner from '../components/prediction/PageBanner';
import PredictionCard from '../components/prediction/PredictionCard';
import './PredictionPage.css';

// Mock Data
const predictionData = [
    { 
        name: 'TechnoSoft Ltd', 
        status: 'Seeking buyer', 
        catalyst: 'PE investor fund nearing exit window (9th year)', 
        tags: ['Declining profits', 'Competitor acquired', 'Strategic isolation'], 
        probability: 90 
    },
    { 
        name: 'GrowthCo Industries', 
        status: 'Raising funds', 
        catalyst: 'Rapid expansion with declining cash runway', 
        tags: ['Aggressive hiring', 'New market entry', '6 months runway left'], 
        probability: 85 
    },
];

export default function PredictionPage() {
    return (
        <div className="prediction-page-container">
            <PageBanner 
                icon="🎯"
                title="Deal Predictions"
                subtitle="AI-powered predictions of upcoming M&A opportunities"
            />

            <div className="prediction-list">
                {predictionData.map(item => (
                    <PredictionCard key={item.name} {...item} />
                ))}
            </div>
        </div>
    );
}