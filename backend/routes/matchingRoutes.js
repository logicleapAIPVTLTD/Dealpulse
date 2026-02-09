// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const { matchSellersForBuyer } = require("../controllers/matchingController");

// // File upload config (optional for buyer profile)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
// });

// const upload = multer({ storage });

// // Option 1: Buyer uploads PDF/CSV
// router.post("/match", upload.single("buyer"), matchSellersForBuyer);

// // Option 2: Buyer sends filters (no file)
// router.post("/match-filters", matchSellersForBuyer);

// module.exports = router;


// routes/matcherRoutes.js
const express=require("express");
// const router = express.Router()
const { getMatchedCompanies }=require("../controllers/matchingController.js");

const router = express.Router();
router.post("/match", getMatchedCompanies);

module.exports= router;
