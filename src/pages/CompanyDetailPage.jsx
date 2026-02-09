import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CompanyDetailPage.css';

// A simple helper to safely get nested data
const getSafeValue = (obj, path, defaultValue = 'N/A') => {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
        if (result === null || typeof result === 'undefined') return defaultValue;
        result = result[key];
    }
    return (result === null || typeof result === 'undefined' || result === "") ? defaultValue : result;
};

export default function CompanyDetailPage() {
    const { companyName } = useParams(); // Get company name from URL
    const navigate = useNavigate();
    
    const [companyData, setCompanyData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Use the existing Pillar 3 API to get data for one company
                const response = await fetch(`http://localhost:3000/api/marketIntelligence/company?company=${companyName}`);
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || `Company not found`);
                }
                const data = await response.json();
                setCompanyData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanyDetails();
    }, [companyName]); // Re-fetch if the companyName in the URL changes

    const renderKeyMetrics = () => (
        <div className="metrics-grid">
            <div className="metric-box">
                <label>Credit Rating</label>
                <p>{getSafeValue(companyData, 'ratings')}</p>
            </div>
            <div className="metric-box">
                <label>Annual Revenue (Cr)</label>
                <p>{getSafeValue(companyData, 'financial_health.revenue', 'N/A')}</p>
            </div>
            <div className="metric-box">
                <label>Net Profit (Cr)</label>
                <p>{getSafeValue(companyData, 'financial_health.net_profit', 'N/A')}</p>
            </div>
            <div className="metric-box">
                <label>EBITDA Margin (%)</label>
                <p>{getSafeValue(companyData, 'financial_health.ebitda_margin', 'N/A')}</p>
            </div>
        </div>
    );

    const renderFullDetails = () => (
        <div className="details-list">
            <h4>Full Company Details</h4>
            <div className="detail-item">
                <label>Company Name</label>
                <p>{getSafeValue(companyData, 'company_name')}</p>
            </div>
            <div className="detail-item">
                <label>Address</label>
                <p>{getSafeValue(companyData, 'financial_health.address', 'N/A')}</p>
            </div>
            <div className="detail-item">
                <label>City</label>
                <p>{getSafeValue(companyData, 'financial_health.city', 'N/A')}</p>
            </div>
            <div className="detail-item">
                <label>State</label>
                <p>{getSafeValue(companyData, 'financial_health.state', 'N/A')}</p>
            </div>
            <div className="detail-item">
                <label>CIN</label>
                <p>{getSafeValue(companyData, 'financial_health.cin', 'N/A')}</p>
            </div>
            <div className="detail-item">
                <label>Website</label>
                <p>{getSafeValue(companyData, 'financial_health.website', 'N/A')}</p>
            </div>
            <div className="detail-item">
                <label>About</label>
                <p className="about-text">{getSafeValue(companyData, 'financial_health.about', 'N/A')}</p>
            </div>
        </div>
    );

    return (
        <div className="company-detail-page">
            <div className="detail-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    &larr; Back to Matches
                </button>
            </div>

            {isLoading && <p className="loading-message">Loading Company Details...</p>}
            {error && <p className="error-message">{error}</p>}
            
            {companyData && (
                <div className="company-detail-card">
                    <h2>{companyData.company_name}</h2>
                    <p className="detail-subtitle">{getSafeValue(companyData, 'financial_health.nic_description', 'Company Details')}</p>
                    
                    {renderKeyMetrics()}
                    {renderFullDetails()}
                </div>
            )}
        </div>
    );
}