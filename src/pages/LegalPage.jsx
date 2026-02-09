import React from 'react';
import PageBanner from '../components/legal/PageBanner';
import SummaryStatCard from '../components/legal/SummaryStatCard';
import CaseCard from '../components/legal/CaseCard';
import './LegalPage.css';

// Mock Data
const summaryData = [
    { title: 'Your Cases', value: '12', subtitle: '3 hearings this week', icon: '🗂️' },
    { title: 'New Updates', value: '27', subtitle: 'Last 24 hours', icon: '🔔' },
    { title: 'High Impact', value: '5', subtitle: 'Requiring attention', icon: '❗', iconClass: 'warning' },
];

const caseData = [
    { title: 'ABC Corp Merger', caseId: 'NCLT001', status: 'Active', nextHearing: '2025-10-20', impactScore: '9.5/10', affectedDeals: 2 },
    { title: 'XYZ Bankruptcy', caseId: 'NCLT002', status: 'Judgment Reserved', nextHearing: '2025-10-18', impactScore: '8.7/10', affectedDeals: 1 },
];

export default function LegalPage() {
    return (
        <div className="legal-page-container">
            <PageBanner 
                icon="⚖️"
                title="NCLT Legal Monitoring"
                subtitle="Real-time tracking of court cases and legal decisions"
            />

            <div className="summary-grid">
                {summaryData.map(item => (
                    <SummaryStatCard 
                        key={item.title} 
                        title={item.title}
                        value={item.value}
                        subtitle={item.subtitle}
                        icon={<div className={`stat-icon ${item.iconClass || ''}`}>{item.icon}</div>}
                    />
                ))}
            </div>

            <div className="case-list-section">
                <div className="case-list">
                    {caseData.map(item => (
                        <CaseCard key={item.caseId} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
}