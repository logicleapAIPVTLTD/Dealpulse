import React from 'react';
import SectionHeader from '../shared/SectionHeader';
import PillFilter from '../shared/PillFilter';
import PillarHeader from '../pills/PillarHeader';
import MetricItem from '../pills/MetricItem';
import './PillarFramework.css';

const pillFilterOptions = [
    { label: 'All Pillars', value: 'all' },
    { label: 'Pillar 1: Macro', value: 'p1' },
    { label: 'Pillar 2: Industry', value: 'p2' },
    { label: 'Pillar 3: Company', value: 'p3' },
    { label: 'Pillar 4: Deals', value: 'p4' },
];

const pillar1Data = {
    'Central Bank Policy': [
        { label: 'Fed Funds Rate', value: '5.25%', sentimentColor: '#dc3545' },
        { label: 'RBI Repo Rate', value: '6.50%', sentimentColor: '#ffc107' },
        { label: 'Policy Stance', value: 'Hawkish', sentimentColor: '#dc3545' },
    ],
    'Economic Indicators': [
        { label: 'GDP Growth', value: '+6.3% YoY', sentimentColor: '#28a745' },
        { label: 'Inflation Rate', value: '5.7%', sentimentColor: '#ffc107' },
        { label: 'Market Volatility', value: '22.5', sentimentColor: '#dc3545' },
    ],
    'Geopolitical Climate': [
        { label: 'Trade Tension Index', value: 'Moderate', sentimentColor: '#ffc107' },
        { label: 'Regulatory Environment', value: 'Stable', sentimentColor: '#28a745' },
    ],
    'Capital Flows': [
        { label: 'PE Dry Powder', value: '$3.2T Available', sentimentColor: '#28a745' },
        { label: 'IPO Window', value: 'Selective', sentimentColor: '#ffc107' },
    ],
};


export default function PillarFramework({ selectedRegionName }) {
    return (
        <div className="pillar-framework-container">
            <SectionHeader title="4-Pillar Intelligence Framework" icon={'🏛️'}>
                <PillFilter options={pillFilterOptions} defaultSelected="p1" />
            </SectionHeader>

            <PillarHeader 
                title="Pillar 1: Macro-Level Intelligence"
                subtitle="The 30,000-foot view - Global tides driving capital flows"
                chipText={selectedRegionName} // Pass the selected region name here
                background="linear-gradient(90deg, #4e54c8, #8f94fb)"
            />

            <div className="pillar-content-grid">
                {Object.entries(pillar1Data).map(([title, metrics]) => (
                    <div key={title} className="pillar-column">
                        <h4>{title}</h4>
                        <div className="metrics-list">
                            {metrics.map(metric => <MetricItem key={metric.label} {...metric} />)}
                        </div>
                    </div>
                ))}
            </div>

             {/* Placeholder for Pillar 2 Header to match screenshot */}
            <PillarHeader 
                title="Pillar 2: Industry & Sector Intelligence"
                subtitle="The playing field - Sector dynamics and competitive landscape"
                chipText="TECHNOLOGY"
                background="linear-gradient(90deg, #f857a6, #ff5858)"
            />
        </div>
    );
}