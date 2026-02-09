const  express =require ("express");
const Router=express.Router()
const {
  uploadPDFMiddleware,
  uploadAndSummarizePDF,
  generatePDFReport, // 1. Make sure this is imported
} = require("../controllers/docIntelligenceController");


Router.post("/upload",uploadPDFMiddleware,uploadAndSummarizePDF)

// 2. Make sure this line exists (this is what fixes the 404)
Router.post("/generate-report", generatePDFReport);

module.exports=Router