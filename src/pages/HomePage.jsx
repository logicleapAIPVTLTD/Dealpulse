import React, { useState, useEffect } from 'react'; // Import useEffect

// Main Page Components
import InfoBanner from '../components/InfoBanner';
import ConnectionStatus from '../components/ConnectionStatus';
import CustomDropdown from '../components/CustomDropdown';

// Dashboard Components
import IntelligenceStatusBanner from '../components/dashboard/IntelligenceStatusBanner';
import MetricCard from '../components/dashboard/MetricCard';
import AlertCard from '../components/dashboard/AlertCard';
import PillarFramework from '../components/dashboard/PillarFramework';
import IntelligenceSummaryCard from '../components/dashboard/IntelligenceSummaryCard';
import MetricListItem from '../components/dashboard/MetricListItem';

// Shared Components
import SectionHeader from '../components/shared/SectionHeader';
import ToggleButtonGroup from '../components/shared/ToggleButtonGroup';

// Page-specific CSS
import './HomePage.css';

// --- MOCK DATA ---
const regionOptions = [ { value: 'us', label: 'US United States (NYSE/NASDAQ)', icon: null }, { value: 'in', label: 'IN India (NSE/BSE)', icon: null }, { value: 'eu', label: 'EU Europe (LSE/Euronext)', icon: null }, { value: 'apac', label: 'Asia-Pacific', icon: <span className="icon">🟢</span> }, { value: 'global', label: 'Global Markets', icon: <span className="icon">🟢</span> }, ];

// --- REMOVED: const industryOptions = [...] ---
// This will now be fetched from the API

const metricCardsData = [ { title: 'ACTIVE MONITORING', value: '6 Companies', subtitle: '5 Sectors | 12 Keywords', icon: <svg width="40" height="40" viewBox="0 0 24 24"><path fill="#0052FF" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> }, { title: 'URGENT ALERTS', value: '1', subtitle: 'Last 4 hours', icon: <svg width="40" height="40" viewBox="0 0 24 24"><path fill="#dc3545" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>, valueColor: '#dc3545' }, { title: 'MARKET PULSE', value: '▲ 56%', subtitle: 'Positive sentiment', icon: <svg width="40" height="40" viewBox="0 0 24 24"><path fill="#0052FF" d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 17.08z"/></svg> }, { title: 'DEAL IMPACT', value: '6 Active', subtitle: '2 under review', icon: <svg width="40" height="40" viewBox="0 0 24 24"><path fill="#ffc107" d="M18 11.03A6.002 6.002 0 0 0 7.42 6.13l-3.55.67.67-3.55L1 1l10.03 5.42c.42-1.29 1.48-2.24 2.77-2.4c2.16-.28 3.98 1.54 3.7 3.7c-.16 1.29-1.11 2.35-2.4 2.77L19 16.97l-3.55.67.67-3.55L15 13l-2.03-3.97zM15 15l-1-4-4-1 3 6 6 3z"/></svg> } ];
const alertToggleOptions = [ { label: 'All', value: 'all' }, { label: 'Urgent', value: 'urgent' }, { label: 'Unread', value: 'unread' } ];
const summaryCardsData = [ { icon: '👥', title: 'Human Capital Intelligence', titleColor: '#0052FF', metrics: [ { label: 'Executive Movement', value: 'Former Goldman MD → Reliance Retail' }, { label: 'Talent Risk', value: 'TCS: 15% AI/ML attrition', valueColor: '#ffc107' }, ] }, { icon: '🔬', title: 'Technology Intelligence', titleColor: '#28a745', metrics: [ { label: 'Patent Activity', value: 'Infosys: 12 AI patents filed' }, { label: 'R&D Investment', value: '+31% YoY in tech sector', valueColor: '#28a745' }, ] }, { icon: '🌿', title: 'ESG Risk Intelligence', titleColor: '#17a2b8', metrics: [ { label: 'Environmental Score', value: 'Adani Green: 7.8/10' }, { label: 'Governance Alert', value: '3 companies below threshold', valueColor: '#ffc107' }, ] } ];

// NEW: Helper function to map API sector names to icons
const getIconForSector = (sectorName) => {
    const lowerSector = sectorName.toLowerCase();
    if (lowerSector.includes('finance') || lowerSector.includes('financial')) return '🏦';
    if (lowerSector.includes('tech')) return '💻';
    if (lowerSector.includes('health')) return '⚕️';
    if (lowerSector.includes('energy')) return '⚡️';
    if (lowerSector.includes('manufacturing')) return '🏭';
    if (lowerSector.includes('retail')) return '🛒';
    if (lowerSector.includes('auto')) return '🚗';
    if (lowerSector.includes('telecom')) return '📡';
    if (lowerSector.includes('agri')) return '🌱';
    return '✨'; // Default icon
};


export default function HomePage() {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  
  // NEW: State to hold the industry options fetched from the API
  const [dynamicIndustryOptions, setDynamicIndustryOptions] = useState([]);

  // NEW: useEffect hook to fetch the list of sectors on page load
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch('https://api-dealpulse.logicleap.in/api/marketIntelligence/latestSector');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Transform the API's array of strings into an array of objects
        // (as seen in image_d24d89.png)
        const transformedOptions = data.available_sectors.map(sector => ({
          value: sector.toLowerCase(), // e.g., 'technology'
          label: sector,             // e.g., 'Technology'
          icon: <span className="icon">{getIconForSector(sector)}</span>
        }));
        
        setDynamicIndustryOptions(transformedOptions);
      } catch (error) {
        console.error("Error fetching industry options:", error);
        // You could set a fallback or error state here
      }
    };
    
    fetchSectors();
  }, []); // The empty array [] means this effect runs once when the component mounts


  const areFiltersSelected = selectedRegion && selectedIndustry;

  // Find the full option object for the selected region and industry
  const selectedRegionOption = regionOptions.find(opt => opt.value === selectedRegion);
  // UPDATE: Use the new dynamic state to find the industry label
  const selectedIndustryOption = dynamicIndustryOptions.find(opt => opt.value === selectedIndustry);

  const selectedRegionName = selectedRegionOption ? selectedRegionOption.label.split('(')[0].trim() : null;
  const selectedIndustryName = selectedIndustryOption ? selectedIndustryOption.label : null; // This is the 'label' (e.g., 'Technology')

  return (
    <div className="homepage-container">
      <div className="page-header">
        <div className="page-title">
          <span style={{ fontSize: '2rem' }}>📊</span>
          <h1>Market Intelligence Command Center</h1>
        </div>
        <div className="filters">
          <CustomDropdown
            label="REGION"
            options={regionOptions}
            value={selectedRegion}
            onChange={setSelectedRegion}
            placeholder="Select Region..."
          />
          <CustomDropdown
            label="INDUSTRY"
            options={dynamicIndustryOptions} // UPDATE: Use dynamic state
            value={selectedIndustry}
            onChange={setSelectedIndustry}
            placeholder="Select Industry..."
          />
          <div className="button-wrapper">
            <button className="apply-filters-btn" disabled={!areFiltersSelected}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>APPLY FILTERS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Rendering Logic */}
      {areFiltersSelected ? (
        <div className="dashboard-content">
            <IntelligenceStatusBanner />
            <div className="dashboard-metrics-grid">
                {metricCardsData.map(card => <MetricCard key={card.title} {...card} />)}
            </div>
            <SectionHeader title="Flash Alerts" icon={<span style={{fontSize: '1.5rem'}}>⚡️</span>}>
                <ToggleButtonGroup options={alertToggleOptions} />
            </SectionHeader>
            <AlertCard 
                tag="DEAL ALERT"
                headline="Hatchbacks will continue to exist despite 'SUVisatlon' of auto industry: FADA pr..."
                source="Economic Times"
                time="3m ago"
                relevance="5%">
                Hatchbacks will retain relevance despite the global “SUVisatlon” trend, the Federation of Automobile Dealers Associations (FADA) said...
            </AlertCard>
            
            <PillarFramework 
                selectedRegionName={selectedRegionName} 
                selectedIndustryName={selectedIndustryName} 
            />
            
            <div className="summary-cards-grid">
              {summaryCardsData.map((card) => (
                <IntelligenceSummaryCard 
                  key={card.title} 
                  icon={card.icon} 
                  title={card.title} 
                  titleColor={card.titleColor}
                >
                  {card.metrics.map((metric) => (
                    <MetricListItem 
                      key={metric.label} 
                      label={metric.label} 
                      value={metric.value} 
                      valueColor={metric.valueColor}
                    />
                  ))}
                </IntelligenceSummaryCard>
              ))}
            </div>
        </div>
      ) : (
        <InfoBanner />
      )}

      <ConnectionStatus />
    </div>
  );
}