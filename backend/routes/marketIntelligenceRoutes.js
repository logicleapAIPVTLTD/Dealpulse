// const  express =require ("express");
// const { getLatestMacro,getLatestSector,getAllDeals,getCompanyIntelligence ,getDealsByCompany} =require("../controllers/marketIntelligenceController.js");

// const router = express.Router();


// router.get("/latestMacro", getLatestMacro);
// router.get("/latestSector",getLatestSector);
// router.get("/allDeals",getAllDeals)
// router.get("/company", getCompanyIntelligence);
// router.get("/deals",getDealsByCompany)




// module.exports=router;

const express = require("express");
// Import the *specific functions* you need from the controller
const {
    getLatestMacro,
    getLatestSector,
    getAllDeals, // This seems to be for alerts, maybe rename?
    getCompanyIntelligence,
    // getDealsByCompany // Original name, potentially rename to getDealIntelligence
    getDealIntelligence // Using the potentially renamed function
} = require("../controllers/marketIntelligenceController.js");

const router = express.Router();

// Assign the imported functions directly as handlers
router.get("/latestMacro", getLatestMacro);
router.get("/latestSector", getLatestSector);
router.get("/allDeals", getAllDeals); // Route for fetching alerts
router.get("/company", getCompanyIntelligence);
router.get("/deals", getDealIntelligence); // Route for Pillar 4 deals

module.exports = router;
// REMOVED the extra closing curly brace from here