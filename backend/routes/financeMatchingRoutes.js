const express = require('express');
const { getMatchedCompanies } = require('../controllers/financeMatchingController'); // Adjust path as needed

const router = express.Router();

// POST /api/matching/match
router.post('/financeMatch', getMatchedCompanies);

module.exports = router;
