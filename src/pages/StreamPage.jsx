import React from 'react';
// Reusable component
import AlertCard from '../components/dashboard/AlertCard'; 
// Stream components
import CategoryFilter from '../components/stream/CategoryFilter';
import SentimentCard from '../components/stream/SentimentCard';
import EntitiesCard from '../components/stream/EntitiesCard';
import PredictiveInsightCard from '../components/stream/PredictiveInsightCard';
import SystemStatusCard from '../components/stream/SystemStatusCard'; // New import
// Styles
import './StreamPage.css';

// --- FINAL MOCK DATA for this page ---
const streamData = [ { tag: 'INDUSTRY', headline: 'Hatchbacks will continue to exist despite ‘SUVisatlon’ of auto industry: FADA president', source: 'Economic Times', time: '3m ago', relevance: '5%' }, { tag: 'INDUSTRY', headline: 'Glenmark, Granules, Zydus recall products in US over manufacturing issues: USFDA', source: 'Economic Times', time: '3m ago', relevance: '0%' }, { tag: 'INDUSTRY', headline: 'Bengaluru to see 21% growth in housing sales in Jul-Sep at 16,840 units: PropEquity', source: 'Economic Times', time: '3m ago', relevance: '0%' }, ];
const sentimentData = [ { label: 'Positive', color: '#28a745', percentage: 33 }, { label: 'Neutral', color: '#6c757d', percentage: 67 }, { label: 'Negative', color: '#dc3545', percentage: 0 }, ];

const entitiesData = [
    { name: 'SEC', tags: ['REGULATORY'], percentage: 56, metadata: '16 mentions • Relevance: 84%' },
    { name: 'NSE', tags: ['COMPANY'], percentage: 55, metadata: '12 mentions • Relevance: 70%' },
    { name: 'BSE', tags: ['COMPANY'], percentage: 60, metadata: '7 mentions • Relevance: 94%' },
    { name: 'Fed', tags: ['REGULATORY'], percentage: 53, metadata: '6 mentions • Relevance: 88%' },
    { name: 'RBI', tags: ['REGULATORY'], percentage: 56, metadata: '6 mentions • Relevance: 88%' },
    { name: 'Reliance', tags: ['COMPANY'], percentage: 55, metadata: '5 mentions • Relevance: 90%' },
    { name: 'central', tags: ['COMPANY'], percentage: 53, metadata: '3 mentions • Relevance: 94%' },
    { name: 'Tata', tags: ['COMPANY'], percentage: 57, metadata: '3 mentions • Relevance: 79%' },
];

const predictiveInsightsData = [
    { icon: '📈', title: 'M&A Activity Surge', description: 'Technology M&A deals expected to increase 25% this quarter based on regulatory environment and cash positions.', confidence: '78%', timeframe: 'NEXT 3 MONTHS', background: 'linear-gradient(90deg, #4e54c8, #8f94fb)' },
    { icon: '💡', title: 'Capital Markets Opportunity', description: 'IPO window favorable for Technology companies. Optimal timing for public offerings in Q4.', confidence: '85%', timeframe: 'Q4 2024', background: 'linear-gradient(90deg, #f857a6, #ff5858)' },
    { icon: '🏦', title: 'Credit Conditions', description: 'High-yield spreads tightening. Refinancing opportunities emerging for leveraged companies.', confidence: '72%', timeframe: 'NEXT 6 MONTHS', background: 'linear-gradient(90deg, #00c6ff, #0072ff)' },
    { icon: '↔️', title: 'Cross-Border Flows', description: 'India attracting increased foreign investment. Currency hedging strategies recommended.', confidence: '68%', timeframe: 'NEXT QUARTER', background: 'linear-gradient(90deg, #45B649, #DCE35B)' },
];

const systemStatusData = [
    { label: 'Data Ingestion', status: 'ACTIVE' },
    { label: 'AI Processing', status: 'ACTIVE' },
    { label: 'Alert Generation', status: 'ACTIVE' },
    { label: 'System Uptime', metric: '99.8%' },
];


export default function StreamPage() {
  return (
    <div className="stream-page-grid">
      <div className="stream-left-column">
        {/* Real-Time Stream Section */}
        <div className="stream-header">
            <h3>Real-Time Intelligence Stream</h3>
            <CategoryFilter />
        </div>
        <div className="stream-list">
            {streamData.map((item, index) => (
                <AlertCard key={index} {...item} />
            ))}
        </div>

        {/* Predictive Insights Section */}
        <div className="predictive-insights-section">
            <h3 className="section-title">Predictive Insights</h3>
            <div className="predictive-insights-list">
                {predictiveInsightsData.map(item => (
                    <PredictiveInsightCard key={item.title} {...item} />
                ))}
            </div>
        </div>
      </div>

      <div className="stream-right-column">
        <SentimentCard sentimentData={sentimentData} />
        <EntitiesCard entitiesData={entitiesData} />
        {/* --- NEW: System Status Section --- */}
        <SystemStatusCard systemStatusData={systemStatusData} />
      </div>
    </div>
  );
}