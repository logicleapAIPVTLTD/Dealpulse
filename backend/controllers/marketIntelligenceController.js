// const  mongoose=require("mongoose");


// //finding latest macro news (1st pillar)

// exports.getLatestMacro = async (req, res) => {
//   try {
//     const db = mongoose.connection.client.db("market_intelligence_production");

//     const macroData = await db
//       .collection("pillar_1_macro_intelligence")
//       .find({})
//       .sort({ report_date: -1 })
//       .limit(1)
//       .toArray();

    
//     if (!macroData || macroData.length === 0) {
//       return res.status(404).json({ message: "No macro intelligence found" });
//     }

//     const data = macroData[0];
//     console.log("data is",data)

//     const result = {
//       _id: data._id,
//       report_date: data.report_date,
//       central_bank_policy: {
//         fed_funds_rate: data.central_bank_policy?.fed_funds_rate,
//         fed_policy_stance: data.central_bank_policy?.fed_policy_stance,
//         rbi_repo_rate: data.central_bank_policy?.rbi_repo_rate,
//         rbi_policy_stance: data.central_bank_policy?.rbi_policy_stance,
//       },
//       economic_indicators: {
//         GDP_Growth: data.economic_indicators?.GDP_Growth,
//         Inflation_Rate: data.economic_indicators?.Inflation_Rate,
//         Unemployment_Rate: data.economic_indicators?.Unemployment_Rate,
//       },
//       market_volatility: {
//         VIX_Index: data.market_volatility?.VIX_Index,
//         VIX_Level: data.market_volatility?.VIX_Level,
//         India_VIX: data.market_volatility?.India_VIX,
//         Nifty_Realized_Volatility_30d:
//           data.market_volatility?.Nifty_Realized_Volatility_30d,
//       },
//       geopolitical_climate: {
//         trade_tension_index: data.geopolitical_climate?.trade_tension_index,
//         sentiment_score: data.geopolitical_climate?.sentiment_score,
//         articles_monitored: data.geopolitical_climate?.articles_monitored,
//       },
//       regulatory_environment: {
//         status: data.regulatory_environment?.status,
//         recent_updates: data.regulatory_environment?.recent_updates,
//       },
//       capital_flows: {
//         pe_dry_powder_usd_billions:
//           data.capital_flows?.pe_dry_powder_usd_billions,
//         ipo_window_status: data.capital_flows?.ipo_window_status,
//         pe_activity_articles: data.capital_flows?.pe_activity_articles,
//         ipo_activity_articles: data.capital_flows?.ipo_activity_articles,
//       },
  
//       latest_headlines: data.regulatory_environment.latest_headlines || [],
//     };

   
//     return res.json(result);
//   } catch (error) {
//     console.error("Error fetching macro intelligence:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// //finding sector related news (2nd pillar)

// exports.getLatestSector = async (req, res) => {
//   try {
   
//     const db = mongoose.connection.client.db("market_intelligence_production");
//     const collection = db.collection("pillar_2_sector_intelligence");

    
//     const sectorName = req.query?.sector?.replace(/['"]/g, "");
//     console.log("Requested Sector:", sectorName);

   
//     const sectorData = await collection
//       .find({})
//       .sort({ report_date: -1 })
//       .limit(1)
//       .toArray();

   
//     if (!sectorData || sectorData.length === 0) {
//       return res.status(404).json({ message: "No sector intelligence found" });
//     }

//     const doc = sectorData[0];

//     if (sectorName) {
//       const sectorInfo = doc.sectors?.[sectorName];

//       if (!sectorInfo) {
//         return res
//           .status(404)
//           .json({ message: `Sector '${sectorName}' not found in latest report` });
//       }

//       const result = {
//         report_date: doc.report_date,
//         sector: {
//           [sectorName]: {
//             sector_name: sectorInfo.sector_name,
//             total_companies: sectorInfo.total_companies,
//             valuation_metrics: {
//               companies_with_data: sectorInfo.valuation_metrics?.companies_with_data,
//               avg_pe_ratio: sectorInfo.valuation_metrics?.avg_pe_ratio,
//               pe_range: sectorInfo.valuation_metrics?.pe_range,
//               median_pe: sectorInfo.valuation_metrics?.median_pe,
//               avg_pb_ratio: sectorInfo.valuation_metrics?.avg_pb_ratio,
//               avg_ev_ebitda: sectorInfo.valuation_metrics?.avg_ev_ebitda,
//               total_sector_market_cap: sectorInfo.valuation_metrics?.total_sector_market_cap,
//               avg_dividend_yield: sectorInfo.valuation_metrics?.avg_dividend_yield,
//               valuation_health: sectorInfo.valuation_metrics?.valuation_health,
//             },
//             competitive_landscape: sectorInfo.competitive_landscape || [],
//             news_sentiment: {
//               overall_sentiment: sectorInfo.news_sentiment?.overall_sentiment,
//               positive_percent: sectorInfo.news_sentiment?.positive_percent,
//               negative_percent: sectorInfo.news_sentiment?.negative_percent,
//               neutral_percent: sectorInfo.news_sentiment?.neutral_percent,
//               total_articles_analyzed: sectorInfo.news_sentiment?.total_articles_analyzed,
//             },
//             top_positive_signals: sectorInfo.news_sentiment?.top_positive_signals || [],
//             top_negative_signals: sectorInfo.news_sentiment?.top_negative_signals || [],
//             articles_by_sentiment: sectorInfo.news_sentiment?.articles_by_sentiment || {},
//             risk_assessment: {
//               risk_level: sectorInfo.risk_assessment?.risk_level,
//               risk_score: sectorInfo.risk_assessment?.risk_score,
//               regulatory_risk_articles: sectorInfo.risk_assessment?.regulatory_risk_articles,
//               liquidity_stress_percent: sectorInfo.risk_assessment?.liquidity_stress_percent,
//               competitive_intensity: sectorInfo.risk_assessment?.competitive_intensity,
//               market_concentration: sectorInfo.risk_assessment?.market_concentration,
//             },
//             growth_indicators: {
//               companies_with_growth_data: sectorInfo.growth_indicators?.companies_with_growth_data,
//               avg_revenue_growth_percent: sectorInfo.growth_indicators?.avg_revenue_growth_percent,
//               median_revenue_growth: sectorInfo.growth_indicators?.median_revenue_growth,
//               growth_range: sectorInfo.growth_indicators?.growth_range,
//               growth_stage: sectorInfo.growth_indicators?.growth_stage,
//               analysis_timestamp: sectorInfo.growth_indicators?.analysis_timestamp,
//             },
//           },
//         },
//       };

//       return res.json(result);
//     }

//     const sectors = {};
//     if (doc.sectors) {
//       for (const [name, info] of Object.entries(doc.sectors)) {
//         sectors[name] = {
//           sector_name: info.sector_name,
//           total_companies: info.total_companies,
//           valuation_metrics: info.valuation_metrics,
//           competitive_landscape: info.competitive_landscape,
//           news_sentiment: info.news_sentiment,
//           top_positive_signals: info.top_positive_signals,
//           top_negative_signals: info.top_negative_signals,
//           articles_by_sentiment: info.articles_by_sentiment,
//           risk_assessment: info.risk_assessment,
//           growth_indicators: info.growth_indicators,
//         };
//       }
//     }


//     const result = {
//       report_date: doc.report_date,
//       total_companies_analyzed: doc.sectors?.Telecom?.total_companies_analyzed,
//       sector_distribution: doc.sectors?.sector_distribution,
//       sectors,
//     };

//     return res.json(result);
//   } catch (error) {
//     console.error("Error fetching sector intelligence:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// //finding alerts

// exports.getAllDeals = async (req, res) => {
//   try {
//     const db = mongoose.connection.client.db("market_intelligence");
//     const collection = db.collection("alerts_by_priority");

//     const dealData = await collection
//       .find({})
//       .sort({ report_date: -1 })
//       .limit(1)
//       .toArray();

//     if (!dealData || dealData.length === 0) {
//       return res.status(404).json({ message: "No alerts found" });
//     }

//     const doc = dealData[0];

    
//     const result = {
//       report_date: doc.report_date,
//       urgent_count: doc.urgent_count || 0,
//       important_count: doc.important_count || 0,
//       informational_count: doc.informational_count || 0,
//       urgent_alerts: doc.urgent_alerts || [],
//       important_alerts: doc.important_alerts || [],
//       informational_alerts: doc.informational_alerts || [],
//     };

//     return res.json(result);
//   } catch (error) {
//     console.error("Error fetching deals/alerts:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// //pillar 3 company intelligence

// exports.getCompanyIntelligence = async (req, res) => {
//   try {
    
//     const db = mongoose.connection.client.db("market_intelligence_production");
//     const collection = db.collection("pillar_3_company_intelligence"); 
//     console.log("Requested company:", companyName);

    
//     if (companyName) {
//       const companyData = await collection
//         .findOne({ company_name: { $regex: new RegExp(`^${companyName}$`, "i") } });

//       if (!companyData) {
//         return res.status(404).json({
//           message: `Company '${companyName}' not found in database.`,
//         });
//       }

     
//       const result = {
//         company_name: companyData.company_name,
//         current_price: companyData.current_price,
//         market_cap: companyData.market_cap,
//         financial_health: companyData.financial_health || {},
//         deal_catalysts: companyData.deal_catalysts || {},
//         ratings: companyData.ratings || "Not Rated",
//       };

//       return res.json(result);
//     }

    
//     const allCompanies = await collection
//       .find({})
//       .project({
//         _id: 0,
//         company_name: 1,
//         current_price: 1,
//         market_cap: 1,
//         ratings: 1,
//       })
//       .toArray();

//     if (!allCompanies || allCompanies.length === 0) {
//       return res.status(404).json({ message: "No companies found" });
//     }

//     return res.json({
//       total_companies: allCompanies.length,
//       companies: allCompanies,
//     });
//   } catch (error) {
//     console.error("Error fetching company intelligence:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// //pillar 4 Deals  intelligence


// exports.getDealsByCompany = async (req, res) => {
//   try {
//     const db = mongoose.connection.client.db("market_intelligence_production");
//     const collection = db.collection("pillar_4_deal_intelligence"); 

//     const companyName = req.query?.company?.trim();
//     console.log("Company query:", companyName);

    
//     const latestReport = await collection
//       .find({})
//       .sort({ report_date: -1 })
//       .limit(1)
//       .toArray();

//     if (!latestReport || latestReport.length === 0) {
//       return res.status(404).json({ message: "No deal intelligence found" });
//     }

//     const report = latestReport[0];

    
//     if (!companyName) {
//       return res.json({
//         report_date: report.report_date,
//         active_deals: report.active_deals,
//         active_buyers: report.active_buyers,
//         active_sellers: report.active_sellers,
//         market_conditions: report.market_conditions,
//         deal_structures: report.deal_structures,
//         common_mechanisms: report.deal_structures?.common_mechanisms,
//       });
//     }

//     const isBuyer = report.active_buyers.includes(companyName);
//     const isSeller = report.active_sellers.includes(companyName);

//     if (!isBuyer && !isSeller) {
//       return res.status(404).json({
//         message: `No deal activity found for '${companyName}' in the latest report.`,
//       });
//     }

   
//     const result = {
//       report_date: report.report_date,
//       company: companyName,
//       role: isBuyer ? "Buyer" : "Seller",
//       related_deals: report.active_deals, 
//       market_conditions: report.market_conditions,
//       deal_structures: report.deal_structures,
//       common_mechanisms: report.deal_structures?.common_mechanisms,
//     };

//     return res.json(result);
//   } catch (error) {
//     console.error("Error fetching deals intelligence:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

//........................................................................................


// const  mongoose=require("mongoose");


// //finding latest macro news (1st pillar)

// exports.getLatestMacro = async (req, res) => {
//   try {
//     // Ensure connection is ready before querying
//     if (mongoose.connection.readyState !== 1) {
//         console.error("MongoDB not connected");
//         return res.status(503).json({ message: "Database not available" });
//     }
//     const db = mongoose.connection.client.db("market_intelligence_production");

//     const macroData = await db
//       .collection("pillar_1_macro_intelligence")
//       .find({})
//       .sort({ report_date: -1 })
//       .limit(1)
//       .toArray();


//     if (!macroData || macroData.length === 0) {
//       return res.status(404).json({ message: "No macro intelligence found" });
//     }

//     const data = macroData[0];
//     // console.log("Macro data is",data) // Optional logging

//     // Simplified result structure for clarity - expand as needed
//     const result = {
//       _id: data._id,
//       report_date: data.report_date,
//       central_bank_policy: data.central_bank_policy || {},
//       economic_indicators: data.economic_indicators || {},
//       market_volatility: data.market_volatility || {},
//       geopolitical_climate: data.geopolitical_climate || {},
//       regulatory_environment: data.regulatory_environment || {},
//       capital_flows: data.capital_flows || {},
//       latest_headlines: data.regulatory_environment?.latest_headlines || [],
//     };


//     return res.json(result);
//   } catch (error) {
//     console.error("Error fetching macro intelligence:", error);
//     // Check for specific connection errors if needed
//     if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
//          return res.status(503).json({ message: "Database connection error" });
//     }
//     res.status(500).json({ message: "Server error fetching macro data" });
//   }
// };


// //finding sector related news (2nd pillar)

// exports.getLatestSector = async (req, res) => {
//   try {
//      // Ensure connection is ready before querying
//     if (mongoose.connection.readyState !== 1) {
//         console.error("MongoDB not connected");
//         return res.status(503).json({ message: "Database not available" });
//     }
//     const db = mongoose.connection.client.db("market_intelligence_production");
//     const collection = db.collection("pillar_2_sector_intelligence");


//     const sectorName = req.query?.sector?.replace(/['"]/g, "").trim(); // Added trim()
//     console.log("Requested Sector:", sectorName);


//     const sectorData = await collection
//       .find({})
//       .sort({ report_date: -1 })
//       .limit(1)
//       .toArray();


//     if (!sectorData || sectorData.length === 0) {
//       return res.status(404).json({ message: "No sector intelligence found" });
//     }

//     const doc = sectorData[0];

//     // Handle case where a specific sector is requested
//     if (sectorName) {
//       // Use case-insensitive matching if needed, otherwise ensure exact match
//       const sectorKey = Object.keys(doc.sectors || {}).find(key => key.toLowerCase() === sectorName.toLowerCase());
//       const sectorInfo = sectorKey ? doc.sectors[sectorKey] : null;

//       if (!sectorInfo) {
//         return res
//           .status(404)
//           .json({ message: `Sector '${sectorName}' not found in latest report` });
//       }
//       // Return only the requested sector's data
//       const result = {
//         report_date: doc.report_date,
//         sector: {
//           // Use the original key from the database for consistency
//           [sectorKey]: sectorInfo // Send the full sectorInfo object
//         }
//       };
//       return res.json(result);
//     }

//     // --- If no specific sector is requested, return overview ---
//      const availableSectors = doc.sectors ? Object.keys(doc.sectors) : [];
//      return res.json({
//         report_date: doc.report_date,
//         available_sectors: availableSectors,
//         // Return summary data or indicate a sector is required
//         message: "Overview: Please specify a sector query parameter (e.g., ?sector=Technology) to get detailed data."
//      });
//     // --- End Overview Part ---

//   } catch (error) {
//     console.error("Error fetching sector intelligence:", error);
//      if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
//          return res.status(503).json({ message: "Database connection error" });
//     }
//     res.status(500).json({ message: "Server error fetching sector data" });
//   }
// };


// //finding alerts (Used by Stream Page - Check if frontend uses this)
// // This endpoint seems intended for the Stream Page alerts, not Pillar 4 deals
// exports.getAllDeals = async (req, res) => {
//   try {
//      // Ensure connection is ready before querying
//     if (mongoose.connection.readyState !== 1) {
//         console.error("MongoDB not connected for Alerts");
//         return res.status(503).json({ message: "Database not available" });
//     }
//     // Verify the correct database name for alerts
//     const db = mongoose.connection.client.db("market_intelligence"); // Different DB? Verify this is correct.
//     const collection = db.collection("alerts_by_priority");

//     // Fetch multiple alerts, not just the latest single document containing grouped alerts
//     const alerts = await collection
//       .find({})
//       .sort({ timestamp: -1 }) // Sort by timestamp or report_date if available
//       .limit(50) // Limit the number of alerts returned
//       .toArray();

//     if (!alerts || alerts.length === 0) {
//       // Return empty array if no alerts is a valid state
//       return res.json([]);
//     }

//     // Map the database documents to the structure expected by the frontend AlertCard
//     const result = alerts.map(doc => ({
//         _id: doc._id, // Include ID if needed
//         tag: doc.priority || doc.category || 'INFO', // Use relevant field for the tag
//         headline: doc.headline,
//         source: doc.source,
//         // Format the date/time appropriately
//         time: doc.timestamp ? new Date(doc.timestamp).toLocaleString() : (doc.report_date ? new Date(doc.report_date).toLocaleDateString() : 'N/A'),
//         relevance: doc.relevance_score ? `${doc.relevance_score}%` : 'N/A',
//         // Include description or content if available and needed when expanded
//         // content: doc.content || doc.description
//     }));

//     return res.json(result);
//   } catch (error) {
//     console.error("Error fetching deals/alerts:", error);
//     if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
//          return res.status(503).json({ message: "Database connection error" });
//     }
//     res.status(500).json({ message: "Server error fetching alerts" });
//   }
// };



// //pillar 3 company intelligence

// exports.getCompanyIntelligence = async (req, res) => {
//   try {
//      // Ensure connection is ready before querying
//     if (mongoose.connection.readyState !== 1) {
//         console.error("MongoDB not connected for Company Intelligence");
//         return res.status(503).json({ message: "Database not available" });
//     }

//     // *** FIX is included here: Define companyName from query ***
//     const companyName = req.query?.company?.trim();

//     const db = mongoose.connection.client.db("market_intelligence_production");
//     const collection = db.collection("pillar_3_company_intelligence");
//     console.log("Requested company:", companyName);


//     if (companyName) {
//       // Find a specific company (case-insensitive search)
//       const companyData = await collection
//         .findOne({ company_name: { $regex: new RegExp(`^${companyName}$`, "i") } });

//       if (!companyData) {
//         return res.status(404).json({
//           message: `Company '${companyName}' not found in database.`,
//         });
//       }

//       // Return detailed data for the specific company
//       const result = {
//         company_name: companyData.company_name,
//         current_price: companyData.current_price,
//         market_cap: companyData.market_cap,
//         financial_health: companyData.financial_health || {},
//         deal_catalysts: companyData.deal_catalysts || {},
//         ratings: companyData.ratings || "Not Rated",
//         // Add any other fields needed
//       };
//       return res.json(result);
//     }


//     // If no companyName query param, return a list of all companies
//     const allCompanies = await collection
//       .find({})
//       .project({ // Only select fields needed for the list view
//         _id: 0, // Exclude the default MongoDB _id
//         company_name: 1,
//         current_price: 1,
//         market_cap: 1,
//         ratings: 1,
//       })
//       .limit(50) // Add a limit to avoid returning too much data
//       .toArray();

//     if (!allCompanies || allCompanies.length === 0) {
//        // Return empty array instead of 404
//        return res.json({ total_companies: 0, companies: [] });
//     }

//     return res.json({
//       total_companies: allCompanies.length, // Consider getting total count separately if needed for pagination
//       companies: allCompanies,
//     });
//   } catch (error) {
//     console.error("Error fetching company intelligence:", error);
//     if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
//          return res.status(503).json({ message: "Database connection error" });
//     }
//     // Specific check for the ReferenceError if needed
//     if (error instanceof ReferenceError) {
//          console.error("ReferenceError specifically:", error); // Log the specific error
//          return res.status(500).json({ message: "Internal Server Error: Variable not defined." });
//     }
//     res.status(500).json({ message: "Server error fetching company data" });
//   }
// };


// //pillar 4 Deals intelligence
// // Renamed function for clarity, as getAllDeals seems to be for alerts
// exports.getDealIntelligence = async (req, res) => {
//   try {
//      // Ensure connection is ready before querying
//     if (mongoose.connection.readyState !== 1) {
//         console.error("MongoDB not connected for Deal Intelligence");
//         return res.status(503).json({ message: "Database not available" });
//     }
//     const db = mongoose.connection.client.db("market_intelligence_production");
//     const collection = db.collection("pillar_4_deal_intelligence");

//     const companyName = req.query?.company?.trim(); // Check if frontend will send this
//     console.log("Company query for Pillar 4 deals:", companyName);


//     const latestReport = await collection
//       .find({})
//       .sort({ report_date: -1 })
//       .limit(1)
//       .toArray();

//     if (!latestReport || latestReport.length === 0) {
//       return res.status(404).json({ message: "No Pillar 4 deal intelligence found" });
//     }

//     const report = latestReport[0];


//     // Return the general overview from the latest report
//     // Modify this if specific company filtering is needed later
//     return res.json({
//         report_date: report.report_date,
//         active_deals: report.active_deals || [], // Ensure arrays are returned
//         active_buyers: report.active_buyers || [],
//         active_sellers: report.active_sellers || [],
//         market_conditions: report.market_conditions || {},
//         deal_structures: report.deal_structures || {},
//     });

//   } catch (error) {
//     console.error("Error fetching Pillar 4 deals intelligence:", error);
//      if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
//          return res.status(503).json({ message: "Database connection error" });
//     }
//     res.status(500).json({ message: "Server error fetching Pillar 4 deals data" });
//   }
// };
//.........................................................................................

// const  mongoose=require("mongoose");


// //finding latest macro news (1st pillar)
// exports.getLatestMacro = async (req, res) => {
//   try {
//     // Ensure connection is ready before querying
//     if (mongoose.connection.readyState !== 1) {
//         console.error("MongoDB not connected");
//         return res.status(503).json({ message: "Database not available" });
//     }
//     const db = mongoose.connection.client.db("market_intelligence_production");

//     const macroData = await db
//       .collection("pillar_1_macro_intelligence")
//       .find({})
//       .sort({ report_date: -1 })
//       .limit(1)
//       .toArray();

//     if (!macroData || macroData.length === 0) {
//       return res.status(404).json({ message: "No macro intelligence found" });
//     }

//     const data = macroData[0];
//     const result = {
//       _id: data._id,
//       report_date: data.report_date,
//       central_bank_policy: data.central_bank_policy || {},
//       economic_indicators: data.economic_indicators || {},
//       market_volatility: data.market_volatility || {},
//       geopolitical_climate: data.geopolitical_climate || {},
//       regulatory_environment: data.regulatory_environment || {},
//       capital_flows: data.capital_flows || {},
//       latest_headlines: data.regulatory_environment?.latest_headlines || [],
//     };
//     return res.json(result);
//   } catch (error) {
//     console.error("Error fetching macro intelligence:", error);
//     if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
//          return res.status(503).json({ message: "Database connection error" });
//     }
//     res.status(500).json({ message: "Server error fetching macro data" });
//   }
// };


// //finding sector related news (2nd pillar)
// exports.getLatestSector = async (req, res) => {
//   try {
//     if (mongoose.connection.readyState !== 1) {
//         console.error("MongoDB not connected");
//         return res.status(503).json({ message: "Database not available" });
//     }
//     const db = mongoose.connection.client.db("market_intelligence_production");
//     const collection = db.collection("pillar_2_sector_intelligence");

//     const sectorName = req.query?.sector?.replace(/['"]/g, "").trim(); 
//     console.log("Requested Sector:", sectorName);

//     const sectorData = await collection
//       .find({})
//       .sort({ report_date: -1 })
//       .limit(1)
//       .toArray();

//     if (!sectorData || sectorData.length === 0) {
//       return res.status(404).json({ message: "No sector intelligence found" });
//     }

//     const doc = sectorData[0];

//     // Handle case where a specific sector is requested
//     if (sectorName) {
//       const sectorKey = Object.keys(doc.sectors || {}).find(key => key.toLowerCase() === sectorName.toLowerCase());
//       const sectorInfo = sectorKey ? doc.sectors[sectorKey] : null;

//       if (!sectorInfo) {
//         return res
//           .status(404)
//           .json({ message: `Sector '${sectorName}' not found in latest report` });
//       }
//       const result = {
//         report_date: doc.report_date,
//         sector: {
//           [sectorKey]: sectorInfo 
//         }
//       };
//       return res.json(result);
//     }

//      const availableSectors = doc.sectors ? Object.keys(doc.sectors) : [];
//      return res.json({
//         report_date: doc.report_date,
//         available_sectors: availableSectors,
//         message: "Overview: Please specify a sector query parameter (e.g., ?sector=Technology) to get detailed data."
//      });

//   } catch (error) {
//     console.error("Error fetching sector intelligence:", error);
//      if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
//          return res.status(503).json({ message: "Database connection error" });
//     }
//     res.status(500).json({ message: "Server error fetching sector data" });
//   }
// };


// //finding alerts (Used by Stream Page)
// exports.getAllDeals = async (req, res) => {
//   try {
//     if (mongoose.connection.readyState !== 1) {
//         console.error("MongoDB not connected for Alerts");
//         return res.status(503).json({ message: "Database not available" });
//     }
//     const db = mongoose.connection.client.db("market_intelligence"); 
//     const collection = db.collection("alerts_by_priority");

//     const alerts = await collection
//       .find({})
//       .sort({ timestamp: -1 }) 
//       .limit(50) 
//       .toArray();

//     if (!alerts || alerts.length === 0) {
//       return res.json([]);
//     }

//     const result = alerts.map(doc => ({
//         _id: doc._id, 
//         tag: doc.priority || doc.category || 'INFO', 
//         headline: doc.headline,
//         source: doc.source,
//         time: doc.timestamp ? new Date(doc.timestamp).toLocaleString() : (doc.report_date ? new Date(doc.report_date).toLocaleDateString() : 'N/A'),
//         relevance: doc.relevance_score ? `${doc.relevance_score}%` : 'N/A',
//     }));

//     return res.json(result);
//   } catch (error) {
//     console.error("Error fetching deals/alerts:", error);
//     if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
//          return res.status(503).json({ message: "Database connection error" });
//     }
//     res.status(500).json({ message: "Server error fetching alerts" });
//   }
// };


// //pillar 3 company intelligence
// exports.getCompanyIntelligence = async (req, res) => {
//   try {
//     if (mongoose.connection.readyState !== 1) {
//         console.error("MongoDB not connected for Company Intelligence");
//         return res.status(503).json({ message: "Database not available" });
//     }

//     const companyName = req.query?.company?.trim();

//     // --- THIS IS THE FIX ---
//     // Point to the correct database and collection
//     const db = mongoose.connection.client.db("ferro_alloy_db");
//     const collection = db.collection("companies");
//     // -----------------------

//     console.log("Requested company:", companyName);

//     if (companyName) {
//       // Find a specific company (case-insensitive search)
//       // Use 'company' field from ferro_alloy_db
//       const companyData = await collection
//         .findOne({ company: { $regex: new RegExp(`^${companyName}$`, "i") } });

//       if (!companyData) {
//         return res.status(404).json({
//           message: `Company '${companyName}' not found in database.`,
//         });
//       }

//       // Return detailed data for the specific company
//       // Map 'company' to 'company_name' for the frontend
//       const result = {
//         company_name: companyData.company, // Map field
//         current_price: companyData['current price'], // Use correct field name
//         market_cap: companyData['market cap (cr)'], // Use correct field name
//         financial_health: { // Manually build this from your DB fields
//             debt_to_equity: companyData['debt-to-equity ratio'],
//             ebitda_margin: companyData['ebitda margin (%)'],
//             net_profit: companyData['net profit (cr)']
//         },
//         deal_catalysts: { // This data seems to be in pillar_3, so it will be empty here
//             primary_catalyst: {} 
//         },
//         ratings: companyData['credit rating'] || "Not Rated",
//       };
//       return res.json(result);
//     }


//     // If no companyName query param, return a list of all companies
//     const allCompanies = await collection
//       .find({})
//       .project({ 
//         _id: 0, 
//         company: 1, // Get the 'company' field
//         'current price': 1,
//         'market cap (cr)': 1,
//         'credit rating': 1,
//       })
//       .limit(50) 
//       .toArray();

//     if (!allCompanies || allCompanies.length === 0) {
//        return res.json({ total_companies: 0, companies: [] });
//     }
    
//     // --- THIS IS THE FIX for the autocomplete ---
//     // Map the database field 'company' to 'company_name' which the frontend expects
//     const formattedCompanies = allCompanies.map(comp => ({
//         company_name: comp.company, // This is the mapping
//         current_price: comp['current price'],
//         market_cap: comp['market cap (cr)'],
//         ratings: comp['credit rating']
//     }));
//     // ---------------------------------------------

//     return res.json({
//       total_companies: formattedCompanies.length,
//       companies: formattedCompanies, // Send the new formatted list
//     });
//   } catch (error) {
//     console.error("Error fetching company intelligence:", error);
//     if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
//          return res.status(503).json({ message: "Database connection error" });
//     }
//     res.status(500).json({ message: "Server error fetching company data" });
//   }
// };


// //pillar 4 Deals intelligence
// exports.getDealIntelligence = async (req, res) => {
//   try {
//     if (mongoose.connection.readyState !== 1) {
//         console.error("MongoDB not connected for Deal Intelligence");
//         return res.status(503).json({ message: "Database not available" });
//     }
//     const db = mongoose.connection.client.db("market_intelligence_production");
//     const collection = db.collection("pillar_4_deal_intelligence");

//     const companyName = req.query?.company?.trim(); 
//     console.log("Company query for Pillar 4 deals:", companyName);

//     const latestReport = await collection
//       .find({})
//       .sort({ report_date: -1 })
//       .limit(1)
//       .toArray();

//     if (!latestReport || latestReport.length === 0) {
//       return res.status(404).json({ message: "No Pillar 4 deal intelligence found" });
//     }

//     const report = latestReport[0];

//     return res.json({
//         report_date: report.report_date,
//         active_deals: report.active_deals || [], 
//         active_buyers: report.active_buyers || [],
//         active_sellers: report.active_sellers || [],
//         market_conditions: report.market_conditions || {},
//         deal_structures: report.deal_structures || {},
//     });

//   } catch (error) {
//     console.error("Error fetching Pillar 4 deals intelligence:", error);
//      if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
//          return res.status(503).json({ message: "Database connection error" });
//     }
//     res.status(500).json({ message: "Server error fetching Pillar 4 deals data" });
//   }
// };
//.................................................................................

const  mongoose=require("mongoose");


//finding latest macro news (1st pillar)

exports.getLatestMacro = async (req, res) => {
  try {
    // Ensure connection is ready before querying
    if (mongoose.connection.readyState !== 1) {
        console.error("MongoDB not connected");
        return res.status(503).json({ message: "Database not available" });
    }
    const db = mongoose.connection.client.db("market_intelligence_production");

    const macroData = await db
      .collection("pillar_1_macro_intelligence")
      .find({})
      .sort({ report_date: -1 })
      .limit(1)
      .toArray();


    if (!macroData || macroData.length === 0) {
      return res.status(404).json({ message: "No macro intelligence found" });
    }

    const data = macroData[0];
    const result = {
      _id: data._id,
      report_date: data.report_date,
      central_bank_policy: data.central_bank_policy || {},
      economic_indicators: data.economic_indicators || {},
      market_volatility: data.market_volatility || {},
      geopolitical_climate: data.geopolitical_climate || {},
      regulatory_environment: data.regulatory_environment || {},
      capital_flows: data.capital_flows || {},
      latest_headlines: data.regulatory_environment?.latest_headlines || [],
    };


    return res.json(result);
  } catch (error) {
    console.error("Error fetching macro intelligence:", error);
    if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
         return res.status(503).json({ message: "Database connection error" });
    }
    res.status(500).json({ message: "Server error fetching macro data" });
  }
};


//finding sector related news (2nd pillar)

exports.getLatestSector = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
        console.error("MongoDB not connected");
        return res.status(503).json({ message: "Database not available" });
    }
    const db = mongoose.connection.client.db("market_intelligence_production");
    const collection = db.collection("pillar_2_sector_intelligence");


    const sectorName = req.query?.sector?.replace(/['"]/g, "").trim(); 
    console.log("Requested Sector:", sectorName);


    const sectorData = await collection
      .find({})
      .sort({ report_date: -1 })
      .limit(1)
      .toArray();


    if (!sectorData || sectorData.length === 0) {
      return res.status(404).json({ message: "No sector intelligence found" });
    }

    const doc = sectorData[0];

    // Handle case where a specific sector is requested
    if (sectorName) {
      const sectorKey = Object.keys(doc.sectors || {}).find(key => key.toLowerCase() === sectorName.toLowerCase());
      const sectorInfo = sectorKey ? doc.sectors[sectorKey] : null;

      if (!sectorInfo) {
        return res
          .status(404)
          .json({ message: `Sector '${sectorName}' not found in latest report` });
      }
      const result = {
        report_date: doc.report_date,
        sector: {
          [sectorKey]: sectorInfo 
        }
      };
      return res.json(result);
    }

     const availableSectors = doc.sectors ? Object.keys(doc.sectors) : [];
     return res.json({
        report_date: doc.report_date,
        available_sectors: availableSectors,
        message: "Overview: Please specify a sector query parameter (e.g., ?sector=Technology) to get detailed data."
     });

  } catch (error) {
    console.error("Error fetching sector intelligence:", error);
     if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
         return res.status(503).json({ message: "Database connection error" });
    }
    res.status(500).json({ message: "Server error fetching sector data" });
  }
};


//finding alerts (Used by Stream Page)
exports.getAllDeals = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
        console.error("MongoDB not connected for Alerts");
        return res.status(503).json({ message: "Database not available" });
    }
    const db = mongoose.connection.client.db("market_intelligence"); 
    const collection = db.collection("alerts_by_priority");

    const alerts = await collection
      .find({})
      .sort({ timestamp: -1 }) 
      .limit(50) 
      .toArray();

    if (!alerts || alerts.length === 0) {
      return res.json([]);
    }

    const result = alerts.map(doc => ({
        _id: doc._id, 
        tag: doc.priority || doc.category || 'INFO', 
        headline: doc.headline,
        source: doc.source,
        time: doc.timestamp ? new Date(doc.timestamp).toLocaleString() : (doc.report_date ? new Date(doc.report_date).toLocaleDateString() : 'N/A'),
        relevance: doc.relevance_score ? `${doc.relevance_score}%` : 'N/A',
    }));

    return res.json(result);
  } catch (error) {
    console.error("Error fetching deals/alerts:", error);
    if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
         return res.status(503).json({ message: "Database connection error" });
    }
    res.status(500).json({ message: "Server error fetching alerts" });
  }
};


//pillar 3 company intelligence
exports.getCompanyIntelligence = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
        console.error("MongoDB not connected for Company Intelligence");
        return res.status(503).json({ message: "Database not available" });
    }

    const companyName = req.query?.company?.trim();

    // --- THIS IS THE FIX ---
    // Point to the correct database and collection
    const db = mongoose.connection.client.db("ferro_alloy_db");
    const collection = db.collection("companies");
    // -----------------------

    console.log("Requested company:", companyName);

    if (companyName) {
      // Find a specific company (case-insensitive search)
      // Use 'company' field from ferro_alloy_db
      const companyData = await collection
        .findOne({ company: { $regex: new RegExp(`^${companyName}$`, "i") } });

      if (!companyData) {
        return res.status(404).json({
          message: `Company '${companyName}' not found in database.`,
        });
      }

      // --- THIS IS THE UPDATED PART ---
      // Return detailed data, mapping all fields the frontend needs
      const result = {
        company_name: companyData.company, // Map 'company' to 'company_name'
        current_price: companyData['current price'] || 'N/A',
        market_cap: companyData['market cap (cr)'] || 'N/A',
        ratings: companyData['credit rating'] || "Not Rated",
        
        // Populate the 'financial_health' object as expected by the frontend
        financial_health: { 
            debt_to_equity: companyData['debt-to-equity ratio'],
            ebitda_margin: companyData['ebitda margin (%)'],
            net_profit: companyData['net profit (cr)'],
            revenue: companyData['annual revenue (cr)'], // Mapped
            address: companyData.address,
            city: companyData.city,
            state: companyData.state,
            cin: companyData.cin,
            website: companyData.website,
            about: companyData.about,
            nic_description: companyData['NIC Description']
        },
        // This will be empty, which is fine
        deal_catalysts: { 
            primary_catalyst: {} 
        },
      };
      return res.json(result);
    }


    // If no companyName query param, return a list of all companies
    const allCompanies = await collection
      .find({})
      .project({ 
        _id: 0, 
        company: 1, 
        'current price': 1,
        'market cap (cr)': 1,
        'credit rating': 1,
      })
      .limit(50) 
      .toArray();

    if (!allCompanies || allCompanies.length === 0) {
       return res.json({ total_companies: 0, companies: [] });
    }
    
    // Map the database field 'company' to 'company_name' for the autocomplete
    const formattedCompanies = allCompanies.map(comp => ({
        company_name: comp.company,
        current_price: comp['current price'],
        market_cap: comp['market cap (cr)'],
        ratings: comp['credit rating']
    }));

    return res.json({
      total_companies: formattedCompanies.length,
      companies: formattedCompanies, // Send the new formatted list
    });
  } catch (error) {
    console.error("Error fetching company intelligence:", error);
    if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
         return res.status(503).json({ message: "Database connection error" });
    }
    res.status(500).json({ message: "Server error fetching company data" });
  }
};


//pillar 4 Deals intelligence
exports.getDealIntelligence = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
        console.error("MongoDB not connected for Deal Intelligence");
        return res.status(503).json({ message: "Database not available" });
    }
    const db = mongoose.connection.client.db("market_intelligence_production");
    const collection = db.collection("pillar_4_deal_intelligence");

    const companyName = req.query?.company?.trim(); 
    console.log("Company query for Pillar 4 deals:", companyName);

    const latestReport = await collection
      .find({})
      .sort({ report_date: -1 })
      .limit(1)
      .toArray();

    if (!latestReport || latestReport.length === 0) {
      return res.status(404).json({ message: "No Pillar 4 deal intelligence found" });
    }

    const report = latestReport[0];

    return res.json({
        report_date: report.report_date,
        active_deals: report.active_deals || [], 
        active_buyers: report.active_buyers || [],
        active_sellers: report.active_sellers || [],
        market_conditions: report.market_conditions || {},
        deal_structures: report.deal_structures || {},
    });

  } catch (error) {
    console.error("Error fetching Pillar 4 deals intelligence:", error);
     if (error.name === 'MongoTopologyClosedError' || error.name === 'MongooseServerSelectionError') {
         return res.status(503).json({ message: "Database connection error" });
    }
    res.status(500).json({ message: "Server error fetching Pillar 4 deals data" });
  }
};