// import React, { useState, useEffect } from 'react';

// // Import all the child components for this page
// import PageBanner from '../components/matching/PageBanner.jsx';
// import MatchResultCard from '../components/matching/MatchResultCard.jsx';

// // Import the stylesheet for this page
// import './MatchingPage.css';

// // --- MAIN PAGE COMPONENT ---

// export default function MatchingPage() {
//     // State for main filters
//     const [showResults, setShowResults] = useState(false);
//     const [selectedRole, setSelectedRole] = useState('buyer');
//     const [companyName, setCompanyName] = useState('');
    
//     // State for Autocomplete
//     const [allCompanies, setAllCompanies] = useState([]);
//     const [suggestions, setSuggestions] = useState([]);
//     const [showSuggestions, setShowSuggestions] = useState(false);
    
//     // State for advanced filters
//     const [industry, setIndustry] = useState(''); // Default to empty (Any)
//     const [creditRating, setCreditRating] = useState('');
//     const [annualRevenue, setAnnualRevenue] = useState('');
//     const [netProfit, setNetProfit] = useState('');
//     const [debtToEquity, setDebtToEquity] = useState('');
//     const [ebitdaMargin, setEbitdaMargin] = useState('');
//     const [prodCapacity, setProdCapacity] = useState('');
//     const [ncltCases, setNcltCases] = useState('any');

//     // State for toggling advanced filters
//     const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

//     // State for API results
//     const [matchData, setMatchData] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // Fetch all companies for autocomplete
//     useEffect(() => {
//         const fetchCompanies = async () => {
//             try {
//                 const response = await fetch('https://api-dealpulse.logicleap.in/api/marketIntelligence/company');
//                 const data = await response.json();
//                 if (data && data.companies) {
//                     setAllCompanies(data.companies);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch companies:", error);
//             }
//         };
//         fetchCompanies();
//     }, []);

//     // API call to your backend
//     const handleFindMatches = async () => {
//         setIsLoading(true);
//         setError(null);
//         setShowResults(true); 
//         setMatchData([]); 

//         // 1. Create the complete filter object
//         const allFilters = { 
//             role: selectedRole, 
//             companyName: companyName,
//             industry,
//         };
        
//         // 2. Add advanced filters only if they are shown
//         if (showAdvancedFilters) {
//             allFilters.creditRating = creditRating;
//             allFilters.annualRevenue = annualRevenue;
//             allFilters.netProfit = netProfit;
//             allFilters.debtToEquity = debtToEquity;
//             allFilters.ebitdaMargin = ebitdaMargin;
//             allFilters.prodCapacity = prodCapacity;
//             allFilters.ncltCases = ncltCases;
//         }
        
//         console.log("Finding matches with filters:", allFilters);

//         try {
//             const response = await fetch('https://api-dealpulse.logicleap.in/api/matching/match', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 // 3. Send the entire 'allFilters' object
//                 body: JSON.stringify(allFilters),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || data.message || 'Failed to fetch matches');
//             }

//             setMatchData(data.matches || []);

//         } catch (err) {
//             console.error("Error finding matches:", err);
//             setError(err.message.includes("JSON") ? "Failed to parse Python output." : err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Handler for company name input
//     const handleCompanyChange = (e) => {
//         const value = e.target.value;
//         setCompanyName(value);

//         if (value.length > 0) {
//             // Use 'company_name' which is what the API now returns
//             const filteredSuggestions = allCompanies.filter(company =>
//                 company.company_name.toLowerCase().includes(value.toLowerCase())
//             );
//             setSuggestions(filteredSuggestions);
//             setShowSuggestions(true);
//         } else {
//             setSuggestions([]);
//             setShowSuggestions(false);
//         }
//     };

//     // Handler for clicking a suggestion
//     const handleSuggestionClick = (company) => {
//         setCompanyName(company.company_name);
//         setSuggestions([]);
//         setShowSuggestions(false);
//     };

//     return (
//         <div className="matching-page-container">
//             <PageBanner
//                 icon="🤝"
//                 title="Buyer-Seller Matching"
//                 subtitle="AI-powered matching engine for perfect deal partners"
//             />
//             <div className="filter-card">
//                 <div className="filter-row three-columns">
//                     <div className="filter-group">
//                         <label>I am a</label>
//                         <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
//                             <option value="buyer">Buyer</option>
//                             <option value="seller">Seller</option>
//                         </select>
//                     </div>
                    
//                     <div className="filter-group autocomplete-wrapper">
//                         <label>Name of my company is</label>
//                         <input
//                           type="text"
//                           value={companyName}
//                           onChange={handleCompanyChange}
//                           placeholder="Start typing company name..."
//                           autoComplete="off"
//                           onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} 
//                           onFocus={handleCompanyChange}
//                         />
//                         {showSuggestions && suggestions.length > 0 && (
//                           <ul className="suggestions-list">
//                             {suggestions.map((company) => (
//                               <li
//                                 key={company.company_name}
//                                 className="suggestion-item"
//                                 onMouseDown={() => handleSuggestionClick(company)}
//                               >
//                                 {company.company_name}
//                               </li>
//                             ))}
//                           </ul>
//                         )}
//                     </div>

//                     <div className="filter-group">
//                         <label>Industry</label>
//                         {/* --- UPDATED Industry List --- */}
//                         <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
//                             <option value="">Any Industry</option>
//                             <option value="Iron">Iron</option>
//                             <option value="Steel">Steel</option>
//                             <option value="Ferro Alloys">Ferro Alloys</option>
//                             <option value="Manufacturing">Manufacturing</option>
//                             <option value="Technology">Technology</option>
//                             <option value="Healthcare">Healthcare</option>
//                             <option value="Retail">Retail</option>
//                             <option value="Energy & Utilities">Energy & Utilities</option>
//                             <option value="Financial">Financial</option>
//                             <option value="Telecom">Telecom</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="toggle-filter-wrapper">
//                     <button 
//                         className="toggle-filters-btn" 
//                         onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
//                         {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
//                     </button>
//                 </div>
                
//                 {showAdvancedFilters && (
//                     <>
//                         <div className="filter-row four-columns">
//                             <div className="filter-group">
//                                 <label>Credit Rating</label>
//                                 {/* --- THIS IS THE FULL, CORRECTED LIST --- */}
//                                 <select value={creditRating} onChange={(e) => setCreditRating(e.target.value)}>
//                                     <option value="">Any</option>
                                    
//                                     <option value="CRISIL AAA">CRISIL AAA</option>
//                                     <option value="CRISIL AA+">CRISIL AA+</option>
//                                     <option value="CRISIL AA">CRISIL AA</option>
//                                     <option value="CRISIL AA-">CRISIL AA-</option>
//                                     <option value="CRISIL A+">CRISIL A+</option>
//                                     <option value="CRISIL A">CRISIL A</option>
//                                     <option value="CRISIL A-">CRISIL A-</option>
//                                     <option value="CRISIL BBB+">CRISIL BBB+</option>
//                                     <option value="CRISIL BBB">CRISIL BBB</option>
//                                     <option value="CRISIL BBB-">CRISIL BBB-</option>
//                                     <option value="CRISIL BB+">CRISIL BB+</option>
//                                     <option value="CRISIL BB">CRISIL BB</option>
//                                     <option value="CRISIL BB-">CRISIL BB-</option>
//                                     <option value="CRISIL D">CRISIL D</option>

//                                     <option value="CARE AAA">CARE AAA</option>
//                                     <option value="CARE AA+">CARE AA+</option>
//                                     <option value="CARE AA">CARE AA</option>
//                                     <option value="CARE AA-">CARE AA-</option>
//                                     <option value="CARE A+">CARE A+</option>
//                                     <option value="CARE A">CARE A</option>
//                                     <option value="CARE A-">CARE A-</option>
//                                     <option value="CARE BBB+">CARE BBB+</option>
//                                     <option value="CARE BBB">CARE BBB</option>
//                                     <option value="CARE BBB-">CARE BBB-</option>
//                                     <option value="CARE BB+">CARE BB+</option>
//                                     <option value="CARE BB">CARE BB</option>
//                                     <option value="CARE BB-">CARE BB-</option>
//                                     <option value="CARE D">CARE D</option>

//                                     <option value="IND AAA">IND AAA</option>
//                                     <option value="IND AA+">IND AA+</option>
//                                     <option value="IND AA">IND AA</option>
//                                     <option value="IND AA-">IND AA-</option>
//                                     <option value="IND A+">IND A+</option>
//                                     <option value="IND A">IND A</option>
//                                     <option value="IND A-">IND A-</option>
//                                     <option value="IND BBB+">IND BBB+</option>
//                                     <option value="IND BBB">IND BBB</option>
//                                     <option value="IND BBB-">IND BBB-</option>
//                                     <option value="IND BB+">IND BB+</option>
//                                     <option value="IND BB">IND BB</option>
//                                     <option value="IND BB-">IND BB-</option>
//                                     <option value="IND D">IND D</option>

//                                     <option value="Not Rated">Not Rated</option>
//                                     <option value="Not Available">Not Available</option>
//                                 </select>
//                             </div>
//                             <div className="filter-group"></div>
//                             <div className="filter-group"></div>
//                             <div className="filter-group"></div>
//                         </div>

//                         {/* Row 3: Financials */}
//                         <div className="filter-row four-columns">
//                             <div className="filter-group">
//                                 <label>Annual Revenue (Cr)</label>
//                                 <input 
//                                     type="text"
//                                     value={annualRevenue}
//                                     onChange={(e) => setAnnualRevenue(e.target.value)}
//                                     placeholder="e.g. >100 or 100-500"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>Net Profit (Cr)</label>
//                                 <input 
//                                     type="text"
//                                     value={netProfit}
//                                     onChange={(e) => setNetProfit(e.target.value)}
//                                     placeholder="e.g. >20"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>Debt-to-Equity Ratio</label>
//                                 <input 
//                                     type="text"
//                                     value={debtToEquity}
//                                     onChange={(e) => setDebtToEquity(e.target.value)}
//                                     placeholder="e.g. <1.5"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>EBITDA Margin (%)</label>
//                                 <input 
//                                     type="text"
//                                     value={ebitdaMargin}
//                                     onChange={(e) => setEbitdaMargin(e.target.value)}
//                                     placeholder="e.g. >15"
//                                 />
//                             </div>
//                         </div>
                        
//                         {/* Row 4: Ops + Legal */}
//                         <div className="filter-row four-columns">
//                             <div className="filter-group">
//                                 <label>Production Capacity (MT)</label>
//                                 <input 
//                                     type="text"
//                                     value={prodCapacity}
//                                     onChange={(e) => setProdCapacity(e.target.value)}
//                                     placeholder="e.g. >1000"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>Active NCLT Cases</label>
//                                 <select value={ncltCases} onChange={(e) => setNcltCases(e.target.value)}>
//                                     <option value="any">Any</option>
//                                     <option value="no">No</option>
//                                     <option value="yes">Yes</option>
//                                 </select>
//                             </div>
//                             <div className="filter-group"></div>
//                             <div className="filter-group"></div>
//                         </div>
//                     </>
//                 )}

//                 <button className="find-matches-btn" onClick={handleFindMatches} disabled={isLoading}>
//                     {isLoading ? 'Finding...' : (
//                         <>
//                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
//                             Find Matches
//                         </>
//                     )}
//                 </button>
//             </div>

//             {/* Conditional rendering for results */}
//             {showResults && (
//                 <div className="results-section">
//                     {isLoading && <p className="loading-message">Loading Matches...</p>}
//                     {error && <p className="error-message">{error}</p>}
//                     {!isLoading && !error && matchData.length === 0 && (
//                         <p className="info-message">No matches found for this company.</p>
//                     )}
//                     {!isLoading && !error && matchData.length > 0 && (
//                         matchData.map(match => (
//                             <MatchResultCard 
//                                 key={match.company} 
//                                 name={match.company}
//                                 // We use the "criteria" as the description
//                                 description={match.criteria ? match.criteria.join(' • ') : 'No criteria specified.'}
//                                 location={match.city}
//                             />
//                         ))
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }


// import React, { useState, useEffect } from 'react';

// // Import all the child components for this page
// import PageBanner from '../components/matching/PageBanner.jsx';
// import MatchResultCard from '../components/matching/MatchResultCard.jsx';

// // Import the stylesheet for this page
// import './MatchingPage.css';

// // --- MAIN PAGE COMPONENT ---

// export default function MatchingPage() {
//     // State for main filters
//     const [showResults, setShowResults] = useState(false);
//     const [selectedRole, setSelectedRole] = useState('buyer');
//     const [companyName, setCompanyName] = useState('');
    
//     // State for Autocomplete
//     const [allCompanies, setAllCompanies] = useState([]);
//     const [suggestions, setSuggestions] = useState([]);
//     const [showSuggestions, setShowSuggestions] = useState(false);
    
//     // State for advanced filters
//     const [industry, setIndustry] = useState(''); // Default to empty (Any)
//     const [creditRating, setCreditRating] = useState('');
//     const [annualRevenue, setAnnualRevenue] = useState('');
//     const [netProfit, setNetProfit] = useState('');
//     const [debtToEquity, setDebtToEquity] = useState('');
//     const [ebitdaMargin, setEbitdaMargin] = useState('');
//     const [prodCapacity, setProdCapacity] = useState('');
//     const [ncltCases, setNcltCases] = useState('any');

//     // State for toggling advanced filters
//     const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

//     // State for API results
//     const [matchData, setMatchData] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // State for detail modal
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [showDetailModal, setShowDetailModal] = useState(false);

//     // Fetch all companies for autocomplete
//     useEffect(() => {
//         const fetchCompanies = async () => {
//             try {
//                 const response = await fetch('https://api-dealpulse.logicleap.in/api/marketIntelligence/company');
//                 const data = await response.json();
//                 if (data && data.companies) {
//                     setAllCompanies(data.companies);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch companies:", error);
//             }
//         };
//         fetchCompanies();
//     }, []);

//     // API call to your backend
//     const handleFindMatches = async () => {
//         setIsLoading(true);
//         setError(null);
//         setShowResults(true); 
//         setMatchData([]); 

//         // 1. Create the complete filter object
//         const allFilters = { 
//             role: selectedRole, 
//             companyName: companyName,
//             industry,
//         };
        
//         // 2. Add advanced filters only if they are shown
//         if (showAdvancedFilters) {
//             allFilters.creditRating = creditRating;
//             allFilters.annualRevenue = annualRevenue;
//             allFilters.netProfit = netProfit;
//             allFilters.debtToEquity = debtToEquity;
//             allFilters.ebitdaMargin = ebitdaMargin;
//             allFilters.prodCapacity = prodCapacity;
//             allFilters.ncltCases = ncltCases;
//         }
        
//         console.log("Finding matches with filters:", allFilters);

//         // 3. Determine which API endpoint to use based on industry
//         let apiEndpoint = 'https://api-dealpulse.logicleap.in/api/matching/match';
        
//         // Check if industry is Financial
//         if (industry && industry.toLowerCase() === 'financial') {
//             apiEndpoint = 'https://api-dealpulse.logicleap.in/api/matching/financeMatch';
//         }

//         try {
//             const response = await fetch(apiEndpoint, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 // Send the entire 'allFilters' object
//                 body: JSON.stringify(allFilters),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || data.message || 'Failed to fetch matches');
//             }

//             setMatchData(data.matches || []);

//         } catch (err) {
//             console.error("Error finding matches:", err);
//             setError(err.message.includes("JSON") ? "Failed to parse Python output." : err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Handler for company name input
//     const handleCompanyChange = (e) => {
//         const value = e.target.value;
//         setCompanyName(value);

//         if (value.length > 0) {
//             // Use 'company_name' which is what the API now returns
//             const filteredSuggestions = allCompanies.filter(company =>
//                 company.company_name.toLowerCase().includes(value.toLowerCase())
//             );
//             setSuggestions(filteredSuggestions);
//             setShowSuggestions(true);
//         } else {
//             setSuggestions([]);
//             setShowSuggestions(false);
//         }
//     };

//     // Handler for clicking a suggestion
//     const handleSuggestionClick = (company) => {
//         setCompanyName(company.company_name);
//         setSuggestions([]);
//         setShowSuggestions(false);
//     };

//     // Handler for viewing company details
//     const handleViewDetails = (company) => {
//         setSelectedCompany(company);
//         setShowDetailModal(true);
//     };

//     // Handler for closing detail modal
//     const handleCloseModal = () => {
//         setShowDetailModal(false);
//         setSelectedCompany(null);
//     };

//     return (
//         <div className="matching-page-container">
//             <PageBanner
//                 icon="🤝"
//                 title="Buyer-Seller Matching"
//                 subtitle="AI-powered matching engine for perfect deal partners"
//             />
//             <div className="filter-card">
//                 <div className="filter-row three-columns">
//                     <div className="filter-group">
//                         <label>I am a</label>
//                         <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
//                             <option value="buyer">Buyer</option>
//                             <option value="seller">Seller</option>
//                         </select>
//                     </div>
                    
//                     <div className="filter-group autocomplete-wrapper">
//                         <label>Name of my company is</label>
//                         <input
//                           type="text"
//                           value={companyName}
//                           onChange={handleCompanyChange}
//                           placeholder="Start typing company name..."
//                           autoComplete="off"
//                           onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} 
//                           onFocus={handleCompanyChange}
//                         />
//                         {showSuggestions && suggestions.length > 0 && (
//                           <ul className="suggestions-list">
//                             {suggestions.map((company) => (
//                               <li
//                                 key={company.company_name}
//                                 className="suggestion-item"
//                                 onMouseDown={() => handleSuggestionClick(company)}
//                               >
//                                 {company.company_name}
//                               </li>
//                             ))}
//                           </ul>
//                         )}
//                     </div>

//                     <div className="filter-group">
//                         <label>Industry</label>
//                         {/* --- UPDATED Industry List --- */}
//                         <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
//                             <option value="">Any Industry</option>
//                             <option value="Iron">Iron</option>
//                             <option value="Steel">Steel</option>
//                             <option value="Ferro Alloys">Ferro Alloys</option>
//                             <option value="Manufacturing">Manufacturing</option>
//                             <option value="Technology">Technology</option>
//                             <option value="Healthcare">Healthcare</option>
//                             <option value="Retail">Retail</option>
//                             <option value="Energy & Utilities">Energy & Utilities</option>
//                             <option value="Financial">Financial</option>
//                             <option value="Telecom">Telecom</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="toggle-filter-wrapper">
//                     <button 
//                         className="toggle-filters-btn" 
//                         onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
//                         {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
//                     </button>
//                 </div>
                
//                 {showAdvancedFilters && (
//                     <>
//                         <div className="filter-row four-columns">
//                             <div className="filter-group">
//                                 <label>Credit Rating</label>
//                                 {/* --- THIS IS THE FULL, CORRECTED LIST --- */}
//                                 <select value={creditRating} onChange={(e) => setCreditRating(e.target.value)}>
//                                     <option value="">Any</option>
                                    
//                                     <option value="CRISIL AAA">CRISIL AAA</option>
//                                     <option value="CRISIL AA+">CRISIL AA+</option>
//                                     <option value="CRISIL AA">CRISIL AA</option>
//                                     <option value="CRISIL AA-">CRISIL AA-</option>
//                                     <option value="CRISIL A+">CRISIL A+</option>
//                                     <option value="CRISIL A">CRISIL A</option>
//                                     <option value="CRISIL A-">CRISIL A-</option>
//                                     <option value="CRISIL BBB+">CRISIL BBB+</option>
//                                     <option value="CRISIL BBB">CRISIL BBB</option>
//                                     <option value="CRISIL BBB-">CRISIL BBB-</option>
//                                     <option value="CRISIL BB+">CRISIL BB+</option>
//                                     <option value="CRISIL BB">CRISIL BB</option>
//                                     <option value="CRISIL BB-">CRISIL BB-</option>
//                                     <option value="CRISIL D">CRISIL D</option>

//                                     <option value="CARE AAA">CARE AAA</option>
//                                     <option value="CARE AA+">CARE AA+</option>
//                                     <option value="CARE AA">CARE AA</option>
//                                     <option value="CARE AA-">CARE AA-</option>
//                                     <option value="CARE A+">CARE A+</option>
//                                     <option value="CARE A">CARE A</option>
//                                     <option value="CARE A-">CARE A-</option>
//                                     <option value="CARE BBB+">CARE BBB+</option>
//                                     <option value="CARE BBB">CARE BBB</option>
//                                     <option value="CARE BBB-">CARE BBB-</option>
//                                     <option value="CARE BB+">CARE BB+</option>
//                                     <option value="CARE BB">CARE BB</option>
//                                     <option value="CARE BB-">CARE BB-</option>
//                                     <option value="CARE D">CARE D</option>

//                                     <option value="IND AAA">IND AAA</option>
//                                     <option value="IND AA+">IND AA+</option>
//                                     <option value="IND AA">IND AA</option>
//                                     <option value="IND AA-">IND AA-</option>
//                                     <option value="IND A+">IND A+</option>
//                                     <option value="IND A">IND A</option>
//                                     <option value="IND A-">IND A-</option>
//                                     <option value="IND BBB+">IND BBB+</option>
//                                     <option value="IND BBB">IND BBB</option>
//                                     <option value="IND BBB-">IND BBB-</option>
//                                     <option value="IND BB+">IND BB+</option>
//                                     <option value="IND BB">IND BB</option>
//                                     <option value="IND BB-">IND BB-</option>
//                                     <option value="IND D">IND D</option>

//                                     <option value="Not Rated">Not Rated</option>
//                                     <option value="Not Available">Not Available</option>
//                                 </select>
//                             </div>
//                             <div className="filter-group"></div>
//                             <div className="filter-group"></div>
//                             <div className="filter-group"></div>
//                         </div>

//                         {/* Row 3: Financials */}
//                         <div className="filter-row four-columns">
//                             <div className="filter-group">
//                                 <label>Annual Revenue (Cr)</label>
//                                 <input 
//                                     type="text"
//                                     value={annualRevenue}
//                                     onChange={(e) => setAnnualRevenue(e.target.value)}
//                                     placeholder="e.g. >100 or 100-500"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>Net Profit (Cr)</label>
//                                 <input 
//                                     type="text"
//                                     value={netProfit}
//                                     onChange={(e) => setNetProfit(e.target.value)}
//                                     placeholder="e.g. >20"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>Debt-to-Equity Ratio</label>
//                                 <input 
//                                     type="text"
//                                     value={debtToEquity}
//                                     onChange={(e) => setDebtToEquity(e.target.value)}
//                                     placeholder="e.g. <1.5"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>EBITDA Margin (%)</label>
//                                 <input 
//                                     type="text"
//                                     value={ebitdaMargin}
//                                     onChange={(e) => setEbitdaMargin(e.target.value)}
//                                     placeholder="e.g. >15"
//                                 />
//                             </div>
//                         </div>
                        
//                         {/* Row 4: Ops + Legal */}
//                         <div className="filter-row four-columns">
//                             <div className="filter-group">
//                                 <label>Production Capacity (MT)</label>
//                                 <input 
//                                     type="text"
//                                     value={prodCapacity}
//                                     onChange={(e) => setProdCapacity(e.target.value)}
//                                     placeholder="e.g. >1000"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>Active NCLT Cases</label>
//                                 <select value={ncltCases} onChange={(e) => setNcltCases(e.target.value)}>
//                                     <option value="any">Any</option>
//                                     <option value="no">No</option>
//                                     <option value="yes">Yes</option>
//                                 </select>
//                             </div>
//                             <div className="filter-group"></div>
//                             <div className="filter-group"></div>
//                         </div>
//                     </>
//                 )}

//                 <button className="find-matches-btn" onClick={handleFindMatches} disabled={isLoading}>
//                     {isLoading ? 'Finding...' : (
//                         <>
//                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
//                             Find Matches
//                         </>
//                     )}
//                 </button>
//             </div>

//             {/* Conditional rendering for results */}
//             {showResults && (
//                 <div className="results-section">
//                     {isLoading && <p className="loading-message">Loading Matches...</p>}
//                     {error && <p className="error-message">{error}</p>}
//                     {!isLoading && !error && matchData.length === 0 && (
//                         <p className="info-message">No matches found for this company.</p>
//                     )}
//                     {!isLoading && !error && matchData.length > 0 && (
//                         matchData.map((match, index) => (
//                             <MatchResultCard 
//                                 key={`${match.company}-${index}`} 
//                                 name={match.company}
//                                 // Use criteria or criteria_met based on API response
//                                 description={(match.criteria || match.criteria_met || []).join(' • ') || 'No criteria specified.'}
//                                 location={match.city}
//                                 onViewDetails={() => handleViewDetails(match)}
//                             />
//                         ))
//                     )}
//                 </div>
//             )}

//             {/* Detail Modal */}
//             {showDetailModal && selectedCompany && (
//                 <div className="modal-overlay" onClick={handleCloseModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <div className="modal-header">
//                             <h2>{selectedCompany.company}</h2>
//                             <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
//                         </div>
//                         <div className="modal-body">
//                             <div className="detail-section">
//                                 <h3>Location</h3>
//                                 <p>{selectedCompany.city}, {selectedCompany.state}</p>
//                             </div>
                            
//                             <div className="detail-section">
//                                 <h3>Financial Information</h3>
//                                 <div className="detail-grid">
//                                     <div className="detail-item">
//                                         <span className="detail-label">Credit Rating:</span>
//                                         <span className="detail-value">{selectedCompany.credit_rating || 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Credit Score:</span>
//                                         <span className="detail-value">{selectedCompany.credit_score || 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Revenue:</span>
//                                         <span className="detail-value">₹{selectedCompany.revenue} Cr</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">EBITDA Margin:</span>
//                                         <span className="detail-value">{selectedCompany.ebitda_margin ? `${selectedCompany.ebitda_margin}%` : 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Debt-to-Equity:</span>
//                                         <span className="detail-value">{selectedCompany.debt_to_equity || 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">NCLT Cases:</span>
//                                         <span className="detail-value">{selectedCompany.nclt_cases || selectedCompany.nclt_status || 'N/A'}</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {selectedCompany.criteria && (
//                                 <div className="detail-section">
//                                     <h3>Match Criteria</h3>
//                                     <ul className="criteria-list">
//                                         {selectedCompany.criteria.map((criterion, idx) => (
//                                             <li key={idx}>{criterion}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}

//                             {selectedCompany.criteria_met && (
//                                 <div className="detail-section">
//                                     <h3>Criteria Met</h3>
//                                     <ul className="criteria-list">
//                                         {selectedCompany.criteria_met.map((criterion, idx) => (
//                                             <li key={idx}>{criterion}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}

//                             {selectedCompany.reasons && (
//                                 <div className="detail-section">
//                                     <h3>Key Highlights</h3>
//                                     <ul className="criteria-list">
//                                         {selectedCompany.reasons.map((reason, idx) => (
//                                             <li key={idx}>{reason}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}

//                             {selectedCompany.cin && (
//                                 <div className="detail-section">
//                                     <h3>Company Information</h3>
//                                     <div className="detail-grid">
//                                         <div className="detail-item">
//                                             <span className="detail-label">CIN:</span>
//                                             <span className="detail-value">{selectedCompany.cin}</span>
//                                         </div>
//                                         {selectedCompany.nic_code && (
//                                             <div className="detail-item">
//                                                 <span className="detail-label">NIC Code:</span>
//                                                 <span className="detail-value">{selectedCompany.nic_code}</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}

//                             {selectedCompany.address && selectedCompany.address !== 'N/A' && (
//                                 <div className="detail-section">
//                                     <h3>Additional Information</h3>
//                                     <p className="detail-description">{selectedCompany.address}</p>
//                                 </div>
//                             )}

//                             {selectedCompany.nic_description && selectedCompany.nic_description !== 'Data not available' && (
//                                 <div className="detail-section">
//                                     <h3>Industry Description</h3>
//                                     <p className="detail-description">{selectedCompany.nic_description}</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// import React, { useState, useEffect } from 'react';

// // Import all the child components for this page
// import PageBanner from '../components/matching/PageBanner.jsx';
// import MatchResultCard from '../components/matching/MatchResultCard.jsx';

// // Import the stylesheet for this page
// import './MatchingPage.css';

// // --- MAIN PAGE COMPONENT ---

// export default function MatchingPage() {
//     // State for main filters
//     const [showResults, setShowResults] = useState(false);
//     const [selectedRole, setSelectedRole] = useState('buyer');
//     const [companyName, setCompanyName] = useState('');
    
//     // State for Autocomplete
//     const [allCompanies, setAllCompanies] = useState([]);
//     const [suggestions, setSuggestions] = useState([]);
//     const [showSuggestions, setShowSuggestions] = useState(false);
    
//     // State for advanced filters
//     const [industry, setIndustry] = useState(''); // Default to empty (Any)
//     const [creditRating, setCreditRating] = useState('');
//     const [annualRevenue, setAnnualRevenue] = useState('');
//     const [netProfit, setNetProfit] = useState('');
//     const [debtToEquity, setDebtToEquity] = useState('');
//     const [ebitdaMargin, setEbitdaMargin] = useState('');
//     const [prodCapacity, setProdCapacity] = useState('');
//     const [ncltCases, setNcltCases] = useState('any');

//     // State for toggling advanced filters
//     const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

//     // State for API results
//     const [matchData, setMatchData] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // State for detail modal
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [showDetailModal, setShowDetailModal] = useState(false);

//     // Fetch all companies for autocomplete
//     useEffect(() => {
//         const fetchCompanies = async () => {
//             try {
//                 const response = await fetch('https://api-dealpulse.logicleap.in/api/marketIntelligence/company');
//                 const data = await response.json();
//                 if (data && data.companies) {
//                     setAllCompanies(data.companies);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch companies:", error);
//             }
//         };
//         fetchCompanies();
//     }, []);

//     // API call to your backend
//     const handleFindMatches = async () => {
//         setIsLoading(true);
//         setError(null);
//         setShowResults(true); 
//         setMatchData([]); 

//         // Determine which API endpoint to use based on industry
//         let apiEndpoint = 'https://api-dealpulse.logicleap.in/api/matching/match';
//         let requestBody = {};
        
//         // Check if industry is Financial
//         if (industry && industry.toLowerCase() === 'financial') {
//             apiEndpoint = 'https://api-dealpulse.logicleap.in/api/matching/financeMatch';
            
//             // For finance API - send filters matching the backend controller
//             requestBody = { 
//                 role: selectedRole,
//                 companyName: companyName,
//                 industry: industry,
//             };

//             // Add advanced filters only if they are shown
//             if (showAdvancedFilters) {
//                 if (creditRating) requestBody.creditRating = creditRating;
//                 if (annualRevenue) requestBody.revenue = annualRevenue;
//                 if (netProfit) requestBody.netProfit = netProfit;
//                 if (debtToEquity) requestBody.debtToEquity = debtToEquity;
//                 if (ebitdaMargin) requestBody.ebitda = ebitdaMargin;
//                 if (prodCapacity) requestBody.capacity = prodCapacity;
//                 if (ncltCases) requestBody.nclt = ncltCases;
//             }
//         } else {
//             // For regular matching API - keep the original format
//             requestBody = { 
//                 role: selectedRole, 
//                 companyName: companyName,
//                 industry: industry,
//             };
            
//             // Add advanced filters only if they are shown
//             if (showAdvancedFilters) {
//                 requestBody.creditRating = creditRating;
//                 requestBody.annualRevenue = annualRevenue;
//                 requestBody.netProfit = netProfit;
//                 requestBody.debtToEquity = debtToEquity;
//                 requestBody.ebitdaMargin = ebitdaMargin;
//                 requestBody.prodCapacity = prodCapacity;
//                 requestBody.ncltCases = ncltCases;
//             }
//         }
        
//         console.log("Finding matches with endpoint:", apiEndpoint);
//         console.log("Request body:", requestBody);

//         try {
//             const response = await fetch(apiEndpoint, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestBody),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.error || data.message || 'Failed to fetch matches');
//             }

//             setMatchData(data.matches || []);

//         } catch (err) {
//             console.error("Error finding matches:", err);
//             setError(err.message.includes("JSON") ? "Failed to parse Python output." : err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Handler for company name input
//     const handleCompanyChange = (e) => {
//         const value = e.target.value;
//         setCompanyName(value);

//         if (value.length > 0) {
//             // Use 'company_name' which is what the API now returns
//             const filteredSuggestions = allCompanies.filter(company =>
//                 company.company_name.toLowerCase().includes(value.toLowerCase())
//             );
//             setSuggestions(filteredSuggestions);
//             setShowSuggestions(true);
//         } else {
//             setSuggestions([]);
//             setShowSuggestions(false);
//         }
//     };

//     // Handler for clicking a suggestion
//     const handleSuggestionClick = (company) => {
//         setCompanyName(company.company_name);
//         setSuggestions([]);
//         setShowSuggestions(false);
//     };

//     // Handler for viewing company details
//     const handleViewDetails = (company) => {
//         setSelectedCompany(company);
//         setShowDetailModal(true);
//     };

//     // Handler for closing detail modal
//     const handleCloseModal = () => {
//         setShowDetailModal(false);
//         setSelectedCompany(null);
//     };

//     return (
//         <div className="matching-page-container">
//             <PageBanner
//                 icon="🤝"
//                 title="Buyer-Seller Matching"
//                 subtitle="AI-powered matching engine for perfect deal partners"
//             />
//             <div className="filter-card">
//                 <div className="filter-row three-columns">
//                     <div className="filter-group">
//                         <label>I am a</label>
//                         <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
//                             <option value="buyer">Buyer</option>
//                             <option value="seller">Seller</option>
//                         </select>
//                     </div>
                    
//                     <div className="filter-group autocomplete-wrapper">
//                         <label>Name of my company is</label>
//                         <input
//                           type="text"
//                           value={companyName}
//                           onChange={handleCompanyChange}
//                           placeholder="Start typing company name..."
//                           autoComplete="off"
//                           onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} 
//                           onFocus={handleCompanyChange}
//                         />
//                         {showSuggestions && suggestions.length > 0 && (
//                           <ul className="suggestions-list">
//                             {suggestions.map((company) => (
//                               <li
//                                 key={company.company_name}
//                                 className="suggestion-item"
//                                 onMouseDown={() => handleSuggestionClick(company)}
//                               >
//                                 {company.company_name}
//                               </li>
//                             ))}
//                           </ul>
//                         )}
//                     </div>

//                     <div className="filter-group">
//                         <label>Industry</label>
//                         {/* --- UPDATED Industry List --- */}
//                         <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
//                             <option value="">Any Industry</option>
//                             <option value="Iron">Iron</option>
//                             <option value="Steel">Steel</option>
//                             <option value="Ferro Alloys">Ferro Alloys</option>
//                             <option value="Manufacturing">Manufacturing</option>
//                             <option value="Technology">Technology</option>
//                             <option value="Healthcare">Healthcare</option>
//                             <option value="Retail">Retail</option>
//                             <option value="Energy & Utilities">Energy & Utilities</option>
//                             <option value="Financial">Financial</option>
//                             <option value="Telecom">Telecom</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="toggle-filter-wrapper">
//                     <button 
//                         className="toggle-filters-btn" 
//                         onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
//                         {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
//                     </button>
//                 </div>
                
//                 {showAdvancedFilters && (
//                     <>
//                         <div className="filter-row four-columns">
//                             <div className="filter-group">
//                                 <label>Credit Rating</label>
//                                 {/* --- THIS IS THE FULL, CORRECTED LIST --- */}
//                                 <select value={creditRating} onChange={(e) => setCreditRating(e.target.value)}>
//                                     <option value="">Any</option>
                                    
//                                     <option value="CRISIL AAA">CRISIL AAA</option>
//                                     <option value="CRISIL AA+">CRISIL AA+</option>
//                                     <option value="CRISIL AA">CRISIL AA</option>
//                                     <option value="CRISIL AA-">CRISIL AA-</option>
//                                     <option value="CRISIL A+">CRISIL A+</option>
//                                     <option value="CRISIL A">CRISIL A</option>
//                                     <option value="CRISIL A-">CRISIL A-</option>
//                                     <option value="CRISIL BBB+">CRISIL BBB+</option>
//                                     <option value="CRISIL BBB">CRISIL BBB</option>
//                                     <option value="CRISIL BBB-">CRISIL BBB-</option>
//                                     <option value="CRISIL BB+">CRISIL BB+</option>
//                                     <option value="CRISIL BB">CRISIL BB</option>
//                                     <option value="CRISIL BB-">CRISIL BB-</option>
//                                     <option value="CRISIL D">CRISIL D</option>

//                                     <option value="CARE AAA">CARE AAA</option>
//                                     <option value="CARE AA+">CARE AA+</option>
//                                     <option value="CARE AA">CARE AA</option>
//                                     <option value="CARE AA-">CARE AA-</option>
//                                     <option value="CARE A+">CARE A+</option>
//                                     <option value="CARE A">CARE A</option>
//                                     <option value="CARE A-">CARE A-</option>
//                                     <option value="CARE BBB+">CARE BBB+</option>
//                                     <option value="CARE BBB">CARE BBB</option>
//                                     <option value="CARE BBB-">CARE BBB-</option>
//                                     <option value="CARE BB+">CARE BB+</option>
//                                     <option value="CARE BB">CARE BB</option>
//                                     <option value="CARE BB-">CARE BB-</option>
//                                     <option value="CARE D">CARE D</option>

//                                     <option value="IND AAA">IND AAA</option>
//                                     <option value="IND AA+">IND AA+</option>
//                                     <option value="IND AA">IND AA</option>
//                                     <option value="IND AA-">IND AA-</option>
//                                     <option value="IND A+">IND A+</option>
//                                     <option value="IND A">IND A</option>
//                                     <option value="IND A-">IND A-</option>
//                                     <option value="IND BBB+">IND BBB+</option>
//                                     <option value="IND BBB">IND BBB</option>
//                                     <option value="IND BBB-">IND BBB-</option>
//                                     <option value="IND BB+">IND BB+</option>
//                                     <option value="IND BB">IND BB</option>
//                                     <option value="IND BB-">IND BB-</option>
//                                     <option value="IND D">IND D</option>

//                                     <option value="Not Rated">Not Rated</option>
//                                     <option value="Not Available">Not Available</option>
//                                 </select>
//                             </div>
//                             <div className="filter-group"></div>
//                             <div className="filter-group"></div>
//                             <div className="filter-group"></div>
//                         </div>

//                         {/* Row 3: Financials */}
//                         <div className="filter-row four-columns">
//                             <div className="filter-group">
//                                 <label>Annual Revenue (Cr)</label>
//                                 <input 
//                                     type="text"
//                                     value={annualRevenue}
//                                     onChange={(e) => setAnnualRevenue(e.target.value)}
//                                     placeholder="e.g. >100 or 100-500"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>Net Profit (Cr)</label>
//                                 <input 
//                                     type="text"
//                                     value={netProfit}
//                                     onChange={(e) => setNetProfit(e.target.value)}
//                                     placeholder="e.g. >20"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>Debt-to-Equity Ratio</label>
//                                 <input 
//                                     type="text"
//                                     value={debtToEquity}
//                                     onChange={(e) => setDebtToEquity(e.target.value)}
//                                     placeholder="e.g. <1.5"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>EBITDA Margin (%)</label>
//                                 <input 
//                                     type="text"
//                                     value={ebitdaMargin}
//                                     onChange={(e) => setEbitdaMargin(e.target.value)}
//                                     placeholder="e.g. >15"
//                                 />
//                             </div>
//                         </div>
                        
//                         {/* Row 4: Ops + Legal */}
//                         <div className="filter-row four-columns">
//                             <div className="filter-group">
//                                 <label>Production Capacity (MT)</label>
//                                 <input 
//                                     type="text"
//                                     value={prodCapacity}
//                                     onChange={(e) => setProdCapacity(e.target.value)}
//                                     placeholder="e.g. >1000"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>Active NCLT Cases</label>
//                                 <select value={ncltCases} onChange={(e) => setNcltCases(e.target.value)}>
//                                     <option value="any">Any</option>
//                                     <option value="no">No</option>
//                                     <option value="yes">Yes</option>
//                                 </select>
//                             </div>
//                             <div className="filter-group"></div>
//                             <div className="filter-group"></div>
//                         </div>
//                     </>
//                 )}

//                 <button className="find-matches-btn" onClick={handleFindMatches} disabled={isLoading}>
//                     {isLoading ? 'Finding...' : (
//                         <>
//                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
//                             Find Matches
//                         </>
//                     )}
//                 </button>
//             </div>

//             {/* Conditional rendering for results */}
//             {showResults && (
//                 <div className="results-section">
//                     {isLoading && <p className="loading-message">Loading Matches...</p>}
//                     {error && <p className="error-message">{error}</p>}
//                     {!isLoading && !error && matchData.length === 0 && (
//                         <p className="info-message">No matches found for this company.</p>
//                     )}
//                     {!isLoading && !error && matchData.length > 0 && (
//                         matchData.map((match, index) => (
//                             <MatchResultCard 
//                                 key={`${match.company}-${index}`} 
//                                 name={match.company}
//                                 // Use criteria or criteria_met based on API response
//                                 description={(match.criteria || match.criteria_met || []).join(' • ') || 'No criteria specified.'}
//                                 location={match.city}
//                                 onViewDetails={() => handleViewDetails(match)}
//                             />
//                         ))
//                     )}
//                 </div>
//             )}

//             {/* Detail Modal */}
//             {showDetailModal && selectedCompany && (
//                 <div className="modal-overlay" onClick={handleCloseModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <div className="modal-header">
//                             <h2>{selectedCompany.company}</h2>
//                             <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
//                         </div>
//                         <div className="modal-body">
//                             <div className="detail-section">
//                                 <h3>Location</h3>
//                                 <p>{selectedCompany.city}, {selectedCompany.state}</p>
//                             </div>
                            
//                             <div className="detail-section">
//                                 <h3>Financial Information</h3>
//                                 <div className="detail-grid">
//                                     <div className="detail-item">
//                                         <span className="detail-label">Credit Rating:</span>
//                                         <span className="detail-value">{selectedCompany.credit_rating || 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Credit Score:</span>
//                                         <span className="detail-value">{selectedCompany.credit_score || 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Revenue:</span>
//                                         <span className="detail-value">₹{selectedCompany.revenue} Cr</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">EBITDA Margin:</span>
//                                         <span className="detail-value">{selectedCompany.ebitda_margin ? `${selectedCompany.ebitda_margin}%` : 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Debt-to-Equity:</span>
//                                         <span className="detail-value">{selectedCompany.debt_to_equity || 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">NCLT Cases:</span>
//                                         <span className="detail-value">{selectedCompany.nclt_cases || selectedCompany.nclt_status || 'N/A'}</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {selectedCompany.criteria && (
//                                 <div className="detail-section">
//                                     <h3>Match Criteria</h3>
//                                     <ul className="criteria-list">
//                                         {selectedCompany.criteria.map((criterion, idx) => (
//                                             <li key={idx}>{criterion}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}

//                             {selectedCompany.criteria_met && (
//                                 <div className="detail-section">
//                                     <h3>Criteria Met</h3>
//                                     <ul className="criteria-list">
//                                         {selectedCompany.criteria_met.map((criterion, idx) => (
//                                             <li key={idx}>{criterion}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}

//                             {selectedCompany.reasons && (
//                                 <div className="detail-section">
//                                     <h3>Key Highlights</h3>
//                                     <ul className="criteria-list">
//                                         {selectedCompany.reasons.map((reason, idx) => (
//                                             <li key={idx}>{reason}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}

//                             {selectedCompany.cin && (
//                                 <div className="detail-section">
//                                     <h3>Company Information</h3>
//                                     <div className="detail-grid">
//                                         <div className="detail-item">
//                                             <span className="detail-label">CIN:</span>
//                                             <span className="detail-value">{selectedCompany.cin}</span>
//                                         </div>
//                                         {selectedCompany.nic_code && (
//                                             <div className="detail-item">
//                                                 <span className="detail-label">NIC Code:</span>
//                                                 <span className="detail-value">{selectedCompany.nic_code}</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}

//                             {selectedCompany.address && selectedCompany.address !== 'N/A' && (
//                                 <div className="detail-section">
//                                     <h3>Additional Information</h3>
//                                     <p className="detail-description">{selectedCompany.address}</p>
//                                 </div>
//                             )}

//                             {selectedCompany.nic_description && selectedCompany.nic_description !== 'Data not available' && (
//                                 <div className="detail-section">
//                                     <h3>Industry Description</h3>
//                                     <p className="detail-description">{selectedCompany.nic_description}</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// import React, { useState, useEffect } from 'react';

// // Import all the child components for this page
// import PageBanner from '../components/matching/PageBanner.jsx';
// import MatchResultCard from '../components/matching/MatchResultCard.jsx';

// // Import the stylesheet for this page
// import './MatchingPage.css';

// // --- MAIN PAGE COMPONENT ---

// export default function MatchingPage() {
//     // State for main filters
//     const [showResults, setShowResults] = useState(false);
//     const [selectedRole, setSelectedRole] = useState('buyer');
//     const [companyName, setCompanyName] = useState('');
    
//     // State for Autocomplete
//     const [allCompanies, setAllCompanies] = useState([]);
//     const [suggestions, setSuggestions] = useState([]);
//     const [showSuggestions, setShowSuggestions] = useState(false);
    
//     // State for advanced filters
//     const [industry, setIndustry] = useState(''); // Default to empty (Any)
//     const [creditRating, setCreditRating] = useState('');
//     const [annualRevenue, setAnnualRevenue] = useState('');
//     const [netProfit, setNetProfit] = useState('');
//     const [debtToEquity, setDebtToEquity] = useState('');
//     const [ebitdaMargin, setEbitdaMargin] = useState('');
//     const [prodCapacity, setProdCapacity] = useState('');
//     const [ncltCases, setNcltCases] = useState('any');

//     // State for toggling advanced filters
//     const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

//     // State for API results
//     const [matchData, setMatchData] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // State for detail modal
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [showDetailModal, setShowDetailModal] = useState(false);

//     // Fetch all companies for autocomplete
//     useEffect(() => {
//         const fetchCompanies = async () => {
//             try {
//                 const response = await fetch('https://api-dealpulse.logicleap.in/api/marketIntelligence/company');
//                 const data = await response.json();
//                 if (data && data.companies) {
//                     setAllCompanies(data.companies);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch companies:", error);
//             }
//         };
//         fetchCompanies();
//     }, []);

//     // API call to your backend
//     const handleFindMatches = async () => {
//         setIsLoading(true);
//         setError(null);
//         setShowResults(true); 
//         setMatchData([]); 

//         // Determine which API endpoint to use based on industry
//         let apiEndpoint = 'https://api-dealpulse.logicleap.in/api/matching/match';
//         let requestBody = {};
        
//         // Check if industry is Financial
//         if (industry && industry.toLowerCase() === 'financial') {
//             apiEndpoint = 'https://api-dealpulse.logicleap.in/api/match/financeMatch';
            
//             // For finance API - send filters matching the backend controller
//             requestBody = { 
//                 role: selectedRole,
//                 companyName: companyName,
//                 industry: industry,
//             };

//             // Add advanced filters only if they are shown
//             if (showAdvancedFilters) {
//                 if (creditRating) requestBody.creditRating = creditRating;
//                 if (annualRevenue) requestBody.revenue = annualRevenue;
//                 if (netProfit) requestBody.netProfit = netProfit;
//                 if (debtToEquity) requestBody.debtToEquity = debtToEquity;
//                 if (ebitdaMargin) requestBody.ebitda = ebitdaMargin;
//                 if (prodCapacity) requestBody.capacity = prodCapacity;
//                 if (ncltCases) requestBody.nclt = ncltCases;
//             }
//         } else {
//             // For regular matching API - keep the original format
//             requestBody = { 
//                 role: selectedRole, 
//                 companyName: companyName,
//                 industry: industry,
//             };
            
//             // Add advanced filters only if they are shown
//             if (showAdvancedFilters) {
//                 requestBody.creditRating = creditRating;
//                 requestBody.annualRevenue = annualRevenue;
//                 requestBody.netProfit = netProfit;
//                 requestBody.debtToEquity = debtToEquity;
//                 requestBody.ebitdaMargin = ebitdaMargin;
//                 requestBody.prodCapacity = prodCapacity;
//                 requestBody.ncltCases = ncltCases;
//             }
//         }
        
//         console.log("Finding matches with endpoint:", apiEndpoint);
//         console.log("Request body:", requestBody);

//         try {
//             const response = await fetch(apiEndpoint, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestBody),
//             });

//             // Try to get response as text first to see what we're receiving
//             const responseText = await response.text();
//             console.log("Raw response:", responseText);

//             let data;
//             try {
//                 data = JSON.parse(responseText);
//             } catch (parseError) {
//                 console.error("JSON Parse Error:", parseError);
//                 console.error("Response text:", responseText);
//                 throw new Error(`Failed to parse response: ${responseText.substring(0, 200)}...`);
//             }

//             if (!response.ok) {
//                 throw new Error(data.error || data.message || JSON.stringify(data));
//             }

//             console.log("Parsed data:", data);
//             setMatchData(data.matches || []);

//         } catch (err) {
//             console.error("Error finding matches:", err);
//             setError(err.message || "Unknown error occurred");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Handler for company name input
//     const handleCompanyChange = (e) => {
//         const value = e.target.value;
//         setCompanyName(value);

//         if (value.length > 0) {
//             // Use 'company_name' which is what the API now returns
//             const filteredSuggestions = allCompanies.filter(company =>
//                 company.company_name.toLowerCase().includes(value.toLowerCase())
//             );
//             setSuggestions(filteredSuggestions);
//             setShowSuggestions(true);
//         } else {
//             setSuggestions([]);
//             setShowSuggestions(false);
//         }
//     };

//     // Handler for clicking a suggestion
//     const handleSuggestionClick = (company) => {
//         setCompanyName(company.company_name);
//         setSuggestions([]);
//         setShowSuggestions(false);
//     };

//     // Handler for viewing company details
//     const handleViewDetails = (company) => {
//         setSelectedCompany(company);
//         setShowDetailModal(true);
//     };

//     // Handler for closing detail modal
//     const handleCloseModal = () => {
//         setShowDetailModal(false);
//         setSelectedCompany(null);
//     };

//     return (
//         <div className="matching-page-container">
//             <PageBanner
//                 icon="🤝"
//                 title="Buyer-Seller Matching"
//                 subtitle="AI-powered matching engine for perfect deal partners"
//             />
//             <div className="filter-card">
//                 <div className="filter-row three-columns">
//                     <div className="filter-group">
//                         <label>I am a</label>
//                         <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
//                             <option value="buyer">Buyer</option>
//                             <option value="seller">Seller</option>
//                         </select>
//                     </div>
                    
//                     <div className="filter-group autocomplete-wrapper">
//                         <label>Name of my company is</label>
//                         <input
//                           type="text"
//                           value={companyName}
//                           onChange={handleCompanyChange}
//                           placeholder="Start typing company name..."
//                           autoComplete="off"
//                           onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} 
//                           onFocus={handleCompanyChange}
//                         />
//                         {showSuggestions && suggestions.length > 0 && (
//                           <ul className="suggestions-list">
//                             {suggestions.map((company) => (
//                               <li
//                                 key={company.company_name}
//                                 className="suggestion-item"
//                                 onMouseDown={() => handleSuggestionClick(company)}
//                               >
//                                 {company.company_name}
//                               </li>
//                             ))}
//                           </ul>
//                         )}
//                     </div>

//                     <div className="filter-group">
//                         <label>Industry</label>
//                         {/* --- UPDATED Industry List --- */}
//                         <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
//                             <option value="">Any Industry</option>
//                             <option value="Iron">Iron</option>
//                             <option value="Steel">Steel</option>
//                             <option value="Ferro Alloys">Ferro Alloys</option>
//                             <option value="Manufacturing">Manufacturing</option>
//                             <option value="Technology">Technology</option>
//                             <option value="Healthcare">Healthcare</option>
//                             <option value="Retail">Retail</option>
//                             <option value="Energy & Utilities">Energy & Utilities</option>
//                             <option value="Financial">Financial</option>
//                             <option value="Telecom">Telecom</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="toggle-filter-wrapper">
//                     <button 
//                         className="toggle-filters-btn" 
//                         onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
//                         {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
//                     </button>
//                 </div>
                
//                 {showAdvancedFilters && (
//                     <>
//                         <div className="filter-row four-columns">
//                             <div className="filter-group">
//                                 <label>Credit Rating</label>
//                                 {/* --- THIS IS THE FULL, CORRECTED LIST --- */}
//                                 <select value={creditRating} onChange={(e) => setCreditRating(e.target.value)}>
//                                     <option value="">Any</option>
                                    
//                                     <option value="CRISIL AAA">CRISIL AAA</option>
//                                     <option value="CRISIL AA+">CRISIL AA+</option>
//                                     <option value="CRISIL AA">CRISIL AA</option>
//                                     <option value="CRISIL AA-">CRISIL AA-</option>
//                                     <option value="CRISIL A+">CRISIL A+</option>
//                                     <option value="CRISIL A">CRISIL A</option>
//                                     <option value="CRISIL A-">CRISIL A-</option>
//                                     <option value="CRISIL BBB+">CRISIL BBB+</option>
//                                     <option value="CRISIL BBB">CRISIL BBB</option>
//                                     <option value="CRISIL BBB-">CRISIL BBB-</option>
//                                     <option value="CRISIL BB+">CRISIL BB+</option>
//                                     <option value="CRISIL BB">CRISIL BB</option>
//                                     <option value="CRISIL BB-">CRISIL BB-</option>
//                                     <option value="CRISIL D">CRISIL D</option>

//                                     <option value="CARE AAA">CARE AAA</option>
//                                     <option value="CARE AA+">CARE AA+</option>
//                                     <option value="CARE AA">CARE AA</option>
//                                     <option value="CARE AA-">CARE AA-</option>
//                                     <option value="CARE A+">CARE A+</option>
//                                     <option value="CARE A">CARE A</option>
//                                     <option value="CARE A-">CARE A-</option>
//                                     <option value="CARE BBB+">CARE BBB+</option>
//                                     <option value="CARE BBB">CARE BBB</option>
//                                     <option value="CARE BBB-">CARE BBB-</option>
//                                     <option value="CARE BB+">CARE BB+</option>
//                                     <option value="CARE BB">CARE BB</option>
//                                     <option value="CARE BB-">CARE BB-</option>
//                                     <option value="CARE D">CARE D</option>

//                                     <option value="IND AAA">IND AAA</option>
//                                     <option value="IND AA+">IND AA+</option>
//                                     <option value="IND AA">IND AA</option>
//                                     <option value="IND AA-">IND AA-</option>
//                                     <option value="IND A+">IND A+</option>
//                                     <option value="IND A">IND A</option>
//                                     <option value="IND A-">IND A-</option>
//                                     <option value="IND BBB+">IND BBB+</option>
//                                     <option value="IND BBB">IND BBB</option>
//                                     <option value="IND BBB-">IND BBB-</option>
//                                     <option value="IND BB+">IND BB+</option>
//                                     <option value="IND BB">IND BB</option>
//                                     <option value="IND BB-">IND BB-</option>
//                                     <option value="IND D">IND D</option>

//                                     <option value="Not Rated">Not Rated</option>
//                                     <option value="Not Available">Not Available</option>
//                                 </select>
//                             </div>
//                             <div className="filter-group"></div>
//                             <div className="filter-group"></div>
//                             <div className="filter-group"></div>
//                         </div>

//                         {/* Row 3: Financials */}
//                         <div className="filter-row four-columns">
//                             <div className="filter-group">
//                                 <label>Annual Revenue (Cr)</label>
//                                 <input 
//                                     type="text"
//                                     value={annualRevenue}
//                                     onChange={(e) => setAnnualRevenue(e.target.value)}
//                                     placeholder="e.g. >100 or 100-500"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>Net Profit (Cr)</label>
//                                 <input 
//                                     type="text"
//                                     value={netProfit}
//                                     onChange={(e) => setNetProfit(e.target.value)}
//                                     placeholder="e.g. >20"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>Debt-to-Equity Ratio</label>
//                                 <input 
//                                     type="text"
//                                     value={debtToEquity}
//                                     onChange={(e) => setDebtToEquity(e.target.value)}
//                                     placeholder="e.g. <1.5"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>EBITDA Margin (%)</label>
//                                 <input 
//                                     type="text"
//                                     value={ebitdaMargin}
//                                     onChange={(e) => setEbitdaMargin(e.target.value)}
//                                     placeholder="e.g. >15"
//                                 />
//                             </div>
//                         </div>
                        
//                         {/* Row 4: Ops + Legal */}
//                         <div className="filter-row four-columns">
//                             <div className="filter-group">
//                                 <label>Production Capacity (MT)</label>
//                                 <input 
//                                     type="text"
//                                     value={prodCapacity}
//                                     onChange={(e) => setProdCapacity(e.target.value)}
//                                     placeholder="e.g. >1000"
//                                 />
//                             </div>
//                             <div className="filter-group">
//                                 <label>Active NCLT Cases</label>
//                                 <select value={ncltCases} onChange={(e) => setNcltCases(e.target.value)}>
//                                     <option value="any">Any</option>
//                                     <option value="no">No</option>
//                                     <option value="yes">Yes</option>
//                                 </select>
//                             </div>
//                             <div className="filter-group"></div>
//                             <div className="filter-group"></div>
//                         </div>
//                     </>
//                 )}

//                 <button className="find-matches-btn" onClick={handleFindMatches} disabled={isLoading}>
//                     {isLoading ? 'Finding...' : (
//                         <>
//                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
//                             Find Matches
//                         </>
//                     )}
//                 </button>
//             </div>

//             {/* Conditional rendering for results */}
//             {showResults && (
//                 <div className="results-section">
//                     {isLoading && <p className="loading-message">Loading Matches...</p>}
//                     {error && <p className="error-message">{error}</p>}
//                     {!isLoading && !error && matchData.length === 0 && (
//                         <p className="info-message">No matches found for this company.</p>
//                     )}
//                     {!isLoading && !error && matchData.length > 0 && (
//                         matchData.map((match, index) => (
//                             <MatchResultCard 
//                                 key={`${match.company}-${index}`} 
//                                 name={match.company}
//                                 // Use criteria or criteria_met based on API response
//                                 description={(match.criteria || match.criteria_met || []).join(' • ') || 'No criteria specified.'}
//                                 location={match.city}
//                                 onViewDetails={() => handleViewDetails(match)}
//                             />
//                         ))
//                     )}
//                 </div>
//             )}

//             {/* Detail Modal */}
//             {showDetailModal && selectedCompany && (
//                 <div className="modal-overlay" onClick={handleCloseModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <div className="modal-header">
//                             <h2>{selectedCompany.company}</h2>
//                             <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
//                         </div>
//                         <div className="modal-body">
//                             <div className="detail-section">
//                                 <h3>Location</h3>
//                                 <p>{selectedCompany.city}, {selectedCompany.state}</p>
//                             </div>
                            
//                             <div className="detail-section">
//                                 <h3>Financial Information</h3>
//                                 <div className="detail-grid">
//                                     <div className="detail-item">
//                                         <span className="detail-label">Credit Rating:</span>
//                                         <span className="detail-value">{selectedCompany.credit_rating || 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Credit Score:</span>
//                                         <span className="detail-value">{selectedCompany.credit_score || 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Revenue:</span>
//                                         <span className="detail-value">₹{selectedCompany.revenue} Cr</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">EBITDA Margin:</span>
//                                         <span className="detail-value">{selectedCompany.ebitda_margin ? `${selectedCompany.ebitda_margin}%` : 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">Debt-to-Equity:</span>
//                                         <span className="detail-value">{selectedCompany.debt_to_equity || 'N/A'}</span>
//                                     </div>
//                                     <div className="detail-item">
//                                         <span className="detail-label">NCLT Cases:</span>
//                                         <span className="detail-value">{selectedCompany.nclt_cases || selectedCompany.nclt_status || 'N/A'}</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {selectedCompany.criteria && (
//                                 <div className="detail-section">
//                                     <h3>Match Criteria</h3>
//                                     <ul className="criteria-list">
//                                         {selectedCompany.criteria.map((criterion, idx) => (
//                                             <li key={idx}>{criterion}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}

//                             {selectedCompany.criteria_met && (
//                                 <div className="detail-section">
//                                     <h3>Criteria Met</h3>
//                                     <ul className="criteria-list">
//                                         {selectedCompany.criteria_met.map((criterion, idx) => (
//                                             <li key={idx}>{criterion}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}

//                             {selectedCompany.reasons && (
//                                 <div className="detail-section">
//                                     <h3>Key Highlights</h3>
//                                     <ul className="criteria-list">
//                                         {selectedCompany.reasons.map((reason, idx) => (
//                                             <li key={idx}>{reason}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             )}

//                             {selectedCompany.cin && (
//                                 <div className="detail-section">
//                                     <h3>Company Information</h3>
//                                     <div className="detail-grid">
//                                         <div className="detail-item">
//                                             <span className="detail-label">CIN:</span>
//                                             <span className="detail-value">{selectedCompany.cin}</span>
//                                         </div>
//                                         {selectedCompany.nic_code && (
//                                             <div className="detail-item">
//                                                 <span className="detail-label">NIC Code:</span>
//                                                 <span className="detail-value">{selectedCompany.nic_code}</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}

//                             {selectedCompany.address && selectedCompany.address !== 'N/A' && (
//                                 <div className="detail-section">
//                                     <h3>Additional Information</h3>
//                                     <p className="detail-description">{selectedCompany.address}</p>
//                                 </div>
//                             )}

//                             {selectedCompany.nic_description && selectedCompany.nic_description !== 'Data not available' && (
//                                 <div className="detail-section">
//                                     <h3>Industry Description</h3>
//                                     <p className="detail-description">{selectedCompany.nic_description}</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';

// Import all the child components for this page
import PageBanner from '../components/matching/PageBanner.jsx';
import MatchResultCard from '../components/matching/MatchResultCard.jsx';

// Import the stylesheet for this page
import './MatchingPage.css';

// --- MAIN PAGE COMPONENT ---

export default function MatchingPage() {
    // State for main filters
    const [showResults, setShowResults] = useState(false);
    const [selectedRole, setSelectedRole] = useState('buyer');
    const [companyName, setCompanyName] = useState('');
    
    // State for Autocomplete
    const [allCompanies, setAllCompanies] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // State for advanced filters
    const [industry, setIndustry] = useState(''); // Default to empty (Any)
    const [creditRating, setCreditRating] = useState('');
    const [annualRevenue, setAnnualRevenue] = useState('');
    const [netProfit, setNetProfit] = useState('');
    const [debtToEquity, setDebtToEquity] = useState('');
    const [ebitdaMargin, setEbitdaMargin] = useState('');
    const [prodCapacity, setProdCapacity] = useState('');
    const [ncltCases, setNcltCases] = useState('any');

    // State for toggling advanced filters
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // State for API results
    const [matchData, setMatchData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for detail modal
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Fetch all companies for autocomplete
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('https://api-dealpulse.logicleap.in/api/marketIntelligence/company');
                const data = await response.json();
                if (data && data.companies) {
                    setAllCompanies(data.companies);
                }
            } catch (error) {
                console.error("Failed to fetch companies:", error);
            }
        };
        fetchCompanies();
    }, []);

    // API call to your backend
    const handleFindMatches = async () => {
        setIsLoading(true);
        setError(null);
        setShowResults(true); 
        setMatchData([]); 

        // Determine which API endpoint to use based on industry
        let apiEndpoint = 'https://api-dealpulse.logicleap.in/api/matching/match';
        let requestBody = {};
        
        // Check if industry is Financial
        if (industry && industry.toLowerCase() === 'financial') {
            // Try different possible endpoint names for finance matching
            // Change this to match your actual backend route
            apiEndpoint = 'https://api-dealpulse.logicleap.in/api/match/financeMatch'; 
            
            
            // For finance API - send filters matching the backend controller
            requestBody = { 
                role: selectedRole,
                companyName: companyName,
                industry: industry,
            };

            // Add advanced filters only if they are shown
            if (showAdvancedFilters) {
                if (creditRating) requestBody.creditRating = creditRating;
                if (annualRevenue) requestBody.revenue = annualRevenue;
                if (netProfit) requestBody.netProfit = netProfit;
                if (debtToEquity) requestBody.debtToEquity = debtToEquity;
                if (ebitdaMargin) requestBody.ebitda = ebitdaMargin;
                if (prodCapacity) requestBody.capacity = prodCapacity;
                if (ncltCases) requestBody.nclt = ncltCases;
            }
        } else {
            // For regular matching API - keep the original format
            requestBody = { 
                role: selectedRole, 
                companyName: companyName,
                industry: industry,
            };
            
            // Add advanced filters only if they are shown
            if (showAdvancedFilters) {
                requestBody.creditRating = creditRating;
                requestBody.annualRevenue = annualRevenue;
                requestBody.netProfit = netProfit;
                requestBody.debtToEquity = debtToEquity;
                requestBody.ebitdaMargin = ebitdaMargin;
                requestBody.prodCapacity = prodCapacity;
                requestBody.ncltCases = ncltCases;
            }
        }
        
        console.log("Finding matches with endpoint:", apiEndpoint);
        console.log("Request body:", requestBody);

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            // Try to get response as text first to see what we're receiving
            const responseText = await response.text();
            console.log("Raw response:", responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error("JSON Parse Error:", parseError);
                console.error("Response text:", responseText);
                throw new Error(`Failed to parse response: ${responseText.substring(0, 200)}...`);
            }

            if (!response.ok) {
                throw new Error(data.error || data.message || JSON.stringify(data));
            }

            console.log("Parsed data:", data);
            setMatchData(data.matches || []);

        } catch (err) {
            console.error("Error finding matches:", err);
            setError(err.message || "Unknown error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for company name input
    const handleCompanyChange = (e) => {
        const value = e.target.value;
        setCompanyName(value);

        if (value.length > 0) {
            // Use 'company_name' which is what the API now returns
            const filteredSuggestions = allCompanies.filter(company =>
                company.company_name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Handler for clicking a suggestion
    const handleSuggestionClick = (company) => {
        setCompanyName(company.company_name);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    // Handler for viewing company details
    const handleViewDetails = (company) => {
        console.log("DETAIL OBJECT:", company);
        setSelectedCompany(company);
        setShowDetailModal(true);
        };
    // const handleViewDetails = (company) => {
    //     setSelectedCompany(company);
    //     setShowDetailModal(true);
    // };

    // Handler for closing detail modal
    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedCompany(null);
    };

    return (
        <div className="matching-page-container">
            <PageBanner
                icon="🤝"
                title="Buyer-Seller Matching"
                subtitle="AI-powered matching engine for perfect deal partners"
            />
            <div className="filter-card">
                <div className="filter-row three-columns">
                    <div className="filter-group">
                        <label>I am a</label>
                        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>
                    
                    <div className="filter-group autocomplete-wrapper">
                        <label>Name of my company is</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={handleCompanyChange}
                          placeholder="Start typing company name..."
                          autoComplete="off"
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} 
                          onFocus={handleCompanyChange}
                        />
                        {showSuggestions && suggestions.length > 0 && (
                          <ul className="suggestions-list">
                            {suggestions.map((company) => (
                              <li
                                key={company.company_name}
                                className="suggestion-item"
                                onMouseDown={() => handleSuggestionClick(company)}
                              >
                                {company.company_name}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>

                    <div className="filter-group">
                        <label>Industry</label>
                        {/* --- UPDATED Industry List --- */}
                        <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                            <option value="">Any Industry</option>
                            <option value="Iron">Iron</option>
                            <option value="Steel">Steel</option>
                            <option value="Ferro Alloys">Ferro Alloys</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Technology">Technology</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Retail">Retail</option>
                            <option value="Energy & Utilities">Energy & Utilities</option>
                            <option value="Financial">Financial</option>
                            <option value="Telecom">Telecom</option>
                        </select>
                    </div>
                </div>

                <div className="toggle-filter-wrapper">
                    <button 
                        className="toggle-filters-btn" 
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                        {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                    </button>
                </div>
                
                {showAdvancedFilters && (
                    <>
                        <div className="filter-row four-columns">
                            <div className="filter-group">
                                <label>Credit Rating</label>
                                {/* --- THIS IS THE FULL, CORRECTED LIST --- */}
                                <select value={creditRating} onChange={(e) => setCreditRating(e.target.value)}>
                                    <option value="">Any</option>
                                    
                                    <option value="CRISIL AAA">CRISIL AAA</option>
                                    <option value="CRISIL AA+">CRISIL AA+</option>
                                    <option value="CRISIL AA">CRISIL AA</option>
                                    <option value="CRISIL AA-">CRISIL AA-</option>
                                    <option value="CRISIL A+">CRISIL A+</option>
                                    <option value="CRISIL A">CRISIL A</option>
                                    <option value="CRISIL A-">CRISIL A-</option>
                                    <option value="CRISIL BBB+">CRISIL BBB+</option>
                                    <option value="CRISIL BBB">CRISIL BBB</option>
                                    <option value="CRISIL BBB-">CRISIL BBB-</option>
                                    <option value="CRISIL BB+">CRISIL BB+</option>
                                    <option value="CRISIL BB">CRISIL BB</option>
                                    <option value="CRISIL BB-">CRISIL BB-</option>
                                    <option value="CRISIL D">CRISIL D</option>

                                    <option value="CARE AAA">CARE AAA</option>
                                    <option value="CARE AA+">CARE AA+</option>
                                    <option value="CARE AA">CARE AA</option>
                                    <option value="CARE AA-">CARE AA-</option>
                                    <option value="CARE A+">CARE A+</option>
                                    <option value="CARE A">CARE A</option>
                                    <option value="CARE A-">CARE A-</option>
                                    <option value="CARE BBB+">CARE BBB+</option>
                                    <option value="CARE BBB">CARE BBB</option>
                                    <option value="CARE BBB-">CARE BBB-</option>
                                    <option value="CARE BB+">CARE BB+</option>
                                    <option value="CARE BB">CARE BB</option>
                                    <option value="CARE BB-">CARE BB-</option>
                                    <option value="CARE D">CARE D</option>

                                    <option value="IND AAA">IND AAA</option>
                                    <option value="IND AA+">IND AA+</option>
                                    <option value="IND AA">IND AA</option>
                                    <option value="IND AA-">IND AA-</option>
                                    <option value="IND A+">IND A+</option>
                                    <option value="IND A">IND A</option>
                                    <option value="IND A-">IND A-</option>
                                    <option value="IND BBB+">IND BBB+</option>
                                    <option value="IND BBB">IND BBB</option>
                                    <option value="IND BBB-">IND BBB-</option>
                                    <option value="IND BB+">IND BB+</option>
                                    <option value="IND BB">IND BB</option>
                                    <option value="IND BB-">IND BB-</option>
                                    <option value="IND D">IND D</option>

                                    <option value="Not Rated">Not Rated</option>
                                    <option value="Not Available">Not Available</option>
                                </select>
                            </div>
                            <div className="filter-group"></div>
                            <div className="filter-group"></div>
                            <div className="filter-group"></div>
                        </div>

                        {/* Row 3: Financials */}
                        <div className="filter-row four-columns">
                            <div className="filter-group">
                                <label>Annual Revenue (Cr)</label>
                                <input 
                                    type="text"
                                    value={annualRevenue}
                                    onChange={(e) => setAnnualRevenue(e.target.value)}
                                    placeholder="e.g. >100 or 100-500"
                                />
                            </div>
                            <div className="filter-group">
                                <label>Net Profit (Cr)</label>
                                <input 
                                    type="text"
                                    value={netProfit}
                                    onChange={(e) => setNetProfit(e.target.value)}
                                    placeholder="e.g. >20"
                                />
                            </div>
                            <div className="filter-group">
                                <label>Debt-to-Equity Ratio</label>
                                <input 
                                    type="text"
                                    value={debtToEquity}
                                    onChange={(e) => setDebtToEquity(e.target.value)}
                                    placeholder="e.g. <1.5"
                                />
                            </div>
                            <div className="filter-group">
                                <label>EBITDA Margin (%)</label>
                                <input 
                                    type="text"
                                    value={ebitdaMargin}
                                    onChange={(e) => setEbitdaMargin(e.target.value)}
                                    placeholder="e.g. >15"
                                />
                            </div>
                        </div>
                        
                        {/* Row 4: Ops + Legal */}
                        <div className="filter-row four-columns">
                            <div className="filter-group">
                                <label>Production Capacity (MT)</label>
                                <input 
                                    type="text"
                                    value={prodCapacity}
                                    onChange={(e) => setProdCapacity(e.target.value)}
                                    placeholder="e.g. >1000"
                                />
                            </div>
                            <div className="filter-group">
                                <label>Active NCLT Cases</label>
                                <select value={ncltCases} onChange={(e) => setNcltCases(e.target.value)}>
                                    <option value="any">Any</option>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                            <div className="filter-group"></div>
                            <div className="filter-group"></div>
                        </div>
                    </>
                )}

                <button className="find-matches-btn" onClick={handleFindMatches} disabled={isLoading}>
                    {isLoading ? 'Finding...' : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            Find Matches
                        </>
                    )}
                </button>
            </div>

            {/* Conditional rendering for results */}
            {showResults && (
                <div className="results-section">
                    {isLoading && <p className="loading-message">Loading Matches...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!isLoading && !error && matchData.length === 0 && (
                        <p className="info-message">No matches found for this company.</p>
                    )}
                    {!isLoading && !error && matchData.length > 0 && (
                        matchData.map((match, index) => (
                            <MatchResultCard 
                                key={`${match.company}-${index}`} 
                                name={match.company}
                                // Use criteria or criteria_met based on API response
                                description={(match.criteria || match.criteria_met || []).join(' • ') || 'No criteria specified.'}
                                location={match.city}
                                onViewDetails={() => handleViewDetails(match)}
                                
                                
                            />
                        ))
                    )}
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedCompany && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedCompany.company}</h2>
                            <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <h3>Location</h3>
                                <p>
                                    {selectedCompany.city && selectedCompany.city !== 'India' ? selectedCompany.city : ''}
                                    {selectedCompany.city && selectedCompany.city !== 'India' && selectedCompany.state ? ', ' : ''}
                                    {selectedCompany.state || 'N/A'}
                                </p>
                            </div>
                            
                            <div className="detail-section">
                                <h3>Financial Information</h3>
                                <div className="detail-grid">
                                    {selectedCompany.credit_rating && (
                                        <div className="detail-item">
                                            <span className="detail-label">Credit Rating:</span>
                                            <span className="detail-value">{selectedCompany.credit_rating}</span>
                                        </div>
                                    )}
                                    {selectedCompany.credit_score && (
                                        <div className="detail-item">
                                            <span className="detail-label">Credit Score:</span>
                                            <span className="detail-value">{selectedCompany.credit_score}</span>
                                        </div>
                                    )}
                                    {selectedCompany.revenue && (
                                        <div className="detail-item">
                                            <span className="detail-label">Revenue:</span>
                                            <span className="detail-value">₹{selectedCompany.revenue} Cr</span>
                                        </div>
                                    )}
                                    {selectedCompany.ebitda_margin !== null && selectedCompany.ebitda_margin !== undefined && (
                                        <div className="detail-item">
                                            <span className="detail-label">EBITDA Margin:</span>
                                            <span className="detail-value">{selectedCompany.ebitda_margin}%</span>
                                        </div>
                                    )}
                                    {selectedCompany.debt_to_equity !== null && selectedCompany.debt_to_equity !== undefined && (
                                        <div className="detail-item">
                                            <span className="detail-label">Debt-to-Equity:</span>
                                            <span className="detail-value">{selectedCompany.debt_to_equity}</span>
                                        </div>
                                    )}
                                    {(selectedCompany.nclt_cases !== null && selectedCompany.nclt_cases !== undefined) || selectedCompany.nclt_status && (
                                        <div className="detail-item">
                                            <span className="detail-label">NCLT Status:</span>
                                            <span className="detail-value">
                                                {selectedCompany.nclt_status || 
                                                 (selectedCompany.nclt_cases === 0 ? 'No Active Cases' : `${selectedCompany.nclt_cases} Cases`)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedCompany.criteria && selectedCompany.criteria.length > 0 && (
                                <div className="detail-section">
                                    <h3>Match Criteria</h3>
                                    <ul className="criteria-list">
                                        {selectedCompany.criteria.map((criterion, idx) => (
                                            <li key={idx}>{criterion}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedCompany.criteria_met && selectedCompany.criteria_met.length > 0 && (
                                <div className="detail-section">
                                    <h3>Criteria Met</h3>
                                    <ul className="criteria-list">
                                        {selectedCompany.criteria_met.map((criterion, idx) => (
                                            <li key={idx}>{criterion}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedCompany.reasons && selectedCompany.reasons.length > 0 && (
                                <div className="detail-section">
                                    <h3>Key Highlights</h3>
                                    <ul className="criteria-list">
                                        {selectedCompany.reasons.map((reason, idx) => (
                                            <li key={idx}>{reason}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedCompany.cin && (
                                <div className="detail-section">
                                    <h3>Company Information</h3>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">CIN:</span>
                                            <span className="detail-value">{selectedCompany.cin}</span>
                                        </div>
                                        {selectedCompany.nic_code && selectedCompany.nic_code !== 'Data not available' && (
                                            <div className="detail-item">
                                                <span className="detail-label">NIC Code:</span>
                                                <span className="detail-value">{selectedCompany.nic_code}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {selectedCompany.address && selectedCompany.address !== 'N/A' && (
                                <div className="detail-section">
                                    <h3>Additional Information</h3>
                                    <p className="detail-description">{selectedCompany.address}</p>
                                </div>
                            )}

                            {selectedCompany.nic_description && 
                             selectedCompany.nic_description !== 'Data not available' && 
                             selectedCompany.nic_description.length < 500 && (
                                <div className="detail-section">
                                    <h3>Industry Description</h3>
                                    <p className="detail-description">{selectedCompany.nic_description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}