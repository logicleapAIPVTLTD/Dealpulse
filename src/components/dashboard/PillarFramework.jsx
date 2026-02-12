import React, { useState, useEffect } from 'react';

// Main imports
import SectionHeader from '../shared/SectionHeader.jsx';
import PillarHeader from '../pills/PillarHeader.jsx';
import PillarSummaryCard from './PillarSummaryCard.jsx';
// Pillar components
import MetricItem from '../pills/MetricItem.jsx';
import CompetitorItem from '../pills/CompetitorItem.jsx';
import ValuationMetric from '../pills/ValuationMetric.jsx';
import CompanyCard from '../pills/CompanyCard.jsx';
import DealCard from '../pills/DealCard.jsx';
import BuyerCard from '../pills/BuyerCard.jsx';
import ConditionIndicator from '../pills/ConditionIndicator.jsx';
import HealthIndicator from '../pills/HealthIndicator.jsx';
import CatalystIndicator from '../pills/CatalystIndicator.jsx';

// Styles
import './PillarFramework.css';
import '../pills/PillarFramework.css';

// --- CONSTANTS ---
const API_BASE_URL = 'https://api-dealpulse.logicleap.in/api/marketIntelligence';
const PILLAR_ENDPOINTS = { p1: '/latestMacro', p2: '/latestSector', p3: '/company', p4: '/deals' };

const summaryCardData = [
    { key: 'p1', title: 'Pillar 1: Macro-Level Intelligence', subtitle: 'Global tides driving capital flows', background: 'linear-gradient(90deg, #4e54c8, #8f94fb)' },
    { key: 'p2', title: 'Pillar 2: Industry & Sector Intelligence', subtitle: 'Sector dynamics & competitive landscape', background: 'linear-gradient(90deg, #f857a6, #ff5858)' },
    { key: 'p3', title: 'Pillar 3: Company-Specific Intelligence', subtitle: 'Individual company analysis & positioning', background: 'linear-gradient(90deg, #00c6ff, #0072ff)' },
    { key: 'p4', title: 'Pillar 4: Deal & Transactional Intelligence', subtitle: 'Active deals & M&A market dynamics', background: 'linear-gradient(90deg, #45B649, #DCE35B)' }
];

// --- HELPER FUNCTION ---
const getSafeValue = (obj, path, defaultValue = 'N/A') => {
    if (obj === null || typeof obj === 'undefined') return defaultValue;
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
        if (typeof result === 'object' && result !== null && key in result) {
            result = result[key];
            if (result === null || typeof result === 'undefined') return defaultValue;
        } else { return defaultValue; }
    }
    // Formatting numbers
    if (typeof result === 'number' && result > 1000000000) return (result / 1000000000).toFixed(1) + 'B';
    if (typeof result === 'number' && result > 1000000) return (result / 1000000).toFixed(1) + 'M';
    if (typeof result === 'number' && result > 100000) return (result / 1000).toFixed(0) + 'K';
    if (typeof result === 'number' && Number.isInteger(result) && result >= 1000) return result.toLocaleString();
    if (typeof result === 'number' && !Number.isInteger(result)) return Math.abs(result) < 10 ? result.toFixed(2) : result.toFixed(1);
    
    return (result === null || typeof result === 'undefined' || result === "") ? defaultValue : result;
};


// --- MAIN COMPONENT ---
export default function PillarFramework({ selectedRegionName, selectedIndustryName }) {
    const [activePill, setActivePill] = useState('all');

    const [pillarsState, setPillarsState] = useState({
        p1: { data: null, loading: false, error: null },
        p2: { data: null, loading: false, error: null },
        p3: { data: null, loading: false, error: null },
        p4: { data: null, loading: false, error: null },
    });

    // *** THIS IS THE FINAL, SIMPLIFIED DATA FETCHING HOOK ***
    useEffect(() => {
        // If we are on the 'all' screen, do nothing.
        if (activePill === 'all' || !PILLAR_ENDPOINTS[activePill]) {
            return;
        }

        const fetchPillarData = async () => {
            const pillarKey = activePill;
            
            // Set loading state for the *active* pill
            setPillarsState(s => ({ 
                ...s, 
                [pillarKey]: { data: null, loading: true, error: null } 
            }));

            const endpoint = PILLAR_ENDPOINTS[pillarKey];
            const queryParams = {};
            
            if (pillarKey === 'p2') {
                if (!selectedIndustryName) {
                    // This can happen if filters aren't selected, show an error.
                    setPillarsState(s => ({ ...s, [pillarKey]: { data: null, loading: false, error: 'No Industry Selected.' } }));
                    return;
                }
                queryParams.sector = selectedIndustryName;
            }
            
            const url = new URL(`${API_BASE_URL}${endpoint}`);
            Object.entries(queryParams).forEach(([key, value]) => url.searchParams.append(key, value));

            try {
                const response = await fetch(url.toString());
                const responseBody = await response.text();
                if (!response.ok) { 
                    let errorMsg = `HTTP error! status: ${response.status}`;
                    try { 
                        const errorData = JSON.parse(responseBody); 
                        errorMsg = errorData.message || errorMsg; 
                    } catch(e) {}
                    throw new Error(errorMsg); 
                }
                const data = JSON.parse(responseBody);
                setPillarsState(s => ({ ...s, [pillarKey]: { data: data, loading: false, error: null } }));
            } catch (error) {
                console.error(`Error fetching Pillar ${pillarKey} data:`, error);
                setPillarsState(s => ({ ...s, [pillarKey]: { data: null, loading: false, error: `Failed to load data: ${error.message}` } }));
            }
        };

        // We run this logic *only* when the user's selections change
        fetchPillarData();

    }, [activePill, selectedIndustryName]); // This effect re-runs ONLY when the user clicks a pill or changes the industry


    // --- RENDER HELPER ---
    const renderPillarContent = (pillarKey, contentRenderer) => {
        const state = pillarsState[pillarKey];

        if (state.loading) return <div className="loading-message">Loading Data...</div>;
        if (state.error) return <div className="error-message">{state.error}</div>;
        if (state.data) {
             try {
                return contentRenderer(state.data);
             } catch (renderError) {
                 console.error(`Error rendering content for ${pillarKey}:`, renderError);
                 return <div className="error-message">Error displaying data.</div>;
             }
        }
        // This catches the 'Initializing' state when a pill is active but
        // data is null and it's not loading or erroring (e.g., waiting for fetch to start)
        if (activePill === pillarKey) {
             return <div className="loading-message">Initializing...</div>;
        }
        return null;
    };

    return (
        <div className="pillar-framework-container">
            <SectionHeader title="4-Pillar Intelligence Framework" icon={'🏛️'}>
                {activePill !== 'all' && (
                    <button 
                        className="back-to-pillars-btn" 
                        onClick={() => setActivePill('all')}
                    >
                        ← Back to All Pillars
                    </button>
                )}
            </SectionHeader>

            {/* View 1: "All Pillars" shows the summary cards */}
            {activePill === 'all' && (
                <div className="pillar-summary-grid">
                    {summaryCardData.map(card => (
                        <PillarSummaryCard
                            key={card.key}
                            title={card.title}
                            subtitle={card.subtitle}
                            background={card.background}
                            onClick={() => setActivePill(card.key)} 
                        />
                    ))}
                </div>
            )}

            {/* View 2: "Pillar 1" shows the detailed view */}
            {activePill === 'p1' && (
                <React.Fragment key="p1-display">
                    <PillarHeader title="Pillar 1: Macro-Level Intelligence" chipText={selectedRegionName || 'Global Markets'} background="linear-gradient(90deg, #4e54c8, #8f94fb)" />
                    {renderPillarContent('p1', (data) => (
                        <div className="pillar-content-grid">
                           <div className="pillar-column"><h4>Central Bank Policy</h4><div className="metrics-list"><MetricItem label="Fed Funds Rate" value={getSafeValue(data, 'central_bank_policy.fed_funds_rate')} sentimentColor='#dc3545' /><MetricItem label="Fed Policy Stance" value={getSafeValue(data, 'central_bank_policy.fed_policy_stance')} sentimentColor='#dc3545' /><MetricItem label="RBI Repo Rate" value={getSafeValue(data, 'central_bank_policy.rbi_repo_rate')} sentimentColor='#ffc107' /><MetricItem label="RBI Policy Stance" value={getSafeValue(data, 'central_bank_policy.rbi_policy_stance')} sentimentColor='#ffc107' /></div></div>
                           <div className="pillar-column"><h4>Economic Indicators</h4><div className="metrics-list"><MetricItem label="GDP Growth" value={getSafeValue(data, 'economic_indicators.GDP_Growth')} sentimentColor='#28a745' /><MetricItem label="Inflation Rate" value={getSafeValue(data, 'economic_indicators.Inflation_Rate')} sentimentColor='#ffc107' /><MetricItem label="Unemployment Rate" value={getSafeValue(data, 'economic_indicators.Unemployment_Rate')} sentimentColor='#dc3545' /></div></div>
                           <div className="pillar-column"><h4>Geopolitical Climate</h4><div className="metrics-list"><MetricItem label="Trade Tension Index" value={getSafeValue(data, 'geopolitical_climate.trade_tension_index')} sentimentColor='#ffc107' /><MetricItem label="Sentiment Score" value={getSafeValue(data, 'geopolitical_climate.sentiment_score')} /></div></div>
                           <div className="pillar-column"><h4>Capital Flows</h4><div className="metrics-list"><MetricItem label="PE Dry Powder" value={`${getSafeValue(data, 'capital_flows.pe_dry_powder_usd_billions')}B USD`} sentimentColor='#28a745' /><MetricItem label="IPO Window Status" value={getSafeValue(data, 'capital_flows.ipo_window_status')} sentimentColor='#ffc107' /></div></div>
                        </div>
                    ))}
                </React.Fragment>
            )}

            {/* View 3: "Pillar 2" shows the detailed view */}
            {activePill === 'p2' && (
                <React.Fragment key="p2-display">
                    <PillarHeader title="Pillar 2: Industry & Sector Intelligence" chipText={selectedIndustryName || "Industry"} background="linear-gradient(90deg, #f857a6, #ff5858)" />
                    {renderPillarContent('p2', (data) => {
                        const sectorData = data?.sector?.[selectedIndustryName];
                        if (!sectorData) return <div className="error-message">{`Sector data for '${selectedIndustryName}' not found. Check API response.`}</div>;
                        return (
                           <div className="pillar-content-grid">
                               <div className="pillar-column"><h4>Growth Indicators</h4><div className="metrics-list"><MetricItem label="Avg Revenue Growth" value={`${getSafeValue(sectorData, 'growth_indicators.avg_revenue_growth_percent', 'N/A')}%`} /><MetricItem label="Growth Stage" value={getSafeValue(sectorData, 'growth_indicators.growth_stage')} /></div><h4>Risk Assessment</h4><div className="metrics-list"><MetricItem label="Risk Level" value={getSafeValue(sectorData, 'risk_assessment.risk_level')} /><MetricItem label="Competitive Intensity" value={getSafeValue(sectorData, 'risk_assessment.competitive_intensity')} /></div></div>
                               <div className="pillar-column"><h4>Competitive Landscape</h4><div className="metrics-list">{getSafeValue(sectorData, 'competitive_landscape', []).map((comp, index) => (<CompetitorItem key={index} name={getSafeValue(comp, 'name')} description={getSafeValue(comp, 'description')} tagText={getSafeValue(comp, 'position', 'N/A')} tagColor={getSafeValue(comp, 'position', '').toLowerCase() === 'leader' ? 'green' : 'blue'}/>))}{getSafeValue(sectorData, 'competitive_landscape', []).length === 0 && <p className="info-message">No competitor data.</p>}</div></div>
                               <div className="pillar-column"><h4>Valuation Metrics</h4><div className="metrics-list"><ValuationMetric label="Avg P/E Ratio" value={getSafeValue(sectorData, 'valuation_metrics.avg_pe_ratio')} sentimentColor="#dc3545" /><ValuationMetric label="Avg EV/EBITDA" value={getSafeValue(sectorData, 'valuation_metrics.avg_ev_ebitda')} sentimentColor="#ffc107" /><ValuationMetric label="Avg Dividend Yield" value={`${getSafeValue(sectorData, 'valuation_metrics.avg_dividend_yield', 'N/A')}%`} sentimentColor="#28a745" /></div></div>
                           </div>
                        );
                    })}
                </React.Fragment>
            )}
            
            {/* View 4: "Pillar 3" shows the detailed view */}
            {activePill === 'p3' && (
                 <React.Fragment key="p3-display">
                    <PillarHeader title="Pillar 3: Company-Specific Intelligence" chipStyle="outline" background="linear-gradient(90deg, #00c6ff, #0072ff)" />
                    {renderPillarContent('p3', (data) => {
                        return (
                            <div className="pillar-3-content-area">
                                <h4 className="watchlist-title">Watchlist Companies ({getSafeValue(data, 'total_companies', 0)})</h4>
                                <div className="watchlist-grid">
                                    {getSafeValue(data, 'companies', []).map(comp => (
                                        <CompanyCard
                                            key={comp.company_name}
                                            name={getSafeValue(comp, 'company_name')}
                                            rating={getSafeValue(comp, 'ratings')}
                                            ratingColor="#0052FF"
                                            description={`Price: ${getSafeValue(comp, 'current_price')}`}
                                            metric={`Market Cap: ${getSafeValue(comp, 'market_cap')}`}
                                            // onClick={() => setSelectedCompany(comp.company_name)} // This is for the next step
                                        />
                                    ))}
                                    {getSafeValue(data, 'companies', []).length === 0 && <p className="info-message">No companies found.</p>}
                                </div>
                            </div>
                        );
                    })}
                 </React.Fragment>
            )}

            {/* View 5: "Pillar 4" shows the detailed view */}
            {activePill === 'p4' && (
                 <React.Fragment key="p4-display">
                     <PillarHeader title="Pillar 4: Deal & Transactional Intelligence" chipStyle="solid" background="linear-gradient(90deg, #45B649, #DCE35B)" />
                    {renderPillarContent('p4', (data) => {
                         return (
                            <div className="pillar-content-grid">
                               <div className="pillar-column"><h4>Active Deals</h4><div className="metrics-list">{getSafeValue(data, 'active_deals', []).map((deal, index) => (<DealCard key={index} name={getSafeValue(deal, 'deal_name', 'Unknown Deal')} value={getSafeValue(deal, 'deal_size')} secondaryValue={getSafeValue(deal, 'details')} status={getSafeValue(deal, 'status')}/>))}{getSafeValue(data, 'active_deals', []).length === 0 && <p className="info-message">No active deals.</p>}</div></div>
                               <div className="pillar-column"><h4>Active Buyers</h4><div className="metrics-list">{getSafeValue(data, 'active_buyers', []).map((buyerName, index) => (<BuyerCard key={index} name={buyerName} primaryDetail={getSafeValue(data, `market_conditions.pe_dry_powder`, 'N/A')} secondaryDetail="Seeking Opportunities"/>))}{getSafeValue(data, 'active_buyers', []).length === 0 && <p className="info-message">No active buyers.</p>}</div></div>
                               <div className="pillar-column"><h4>Market Conditions</h4><div className="metrics-list"><ConditionIndicator label="Leverage Levels" value={getSafeValue(data, 'market_conditions.leverage_levels')} sentimentColor="#ffc107" /><ConditionIndicator label="Pricing" value={getSafeValue(data, 'market_conditions.pricing')} sentimentColor="#dc3545" /></div></div>
                               <div className="pillar-column"><h4>Deal Structures</h4><div className="metrics-list"><ConditionIndicator label="Typical Earnout" value={getSafeValue(data, 'deal_structures.typical_earnout')} sentimentColor="#0052FF" /><ConditionIndicator label="R&W Insurance" value={`${getSafeValue(data, 'deal_structures.rw_insurance_adoption', 'N/A')}% adoption`} sentimentColor="#28a745" /></div></div>
                            </div>
                         );
                    })}
                 </React.Fragment>
            )}
        </div>
    );
}