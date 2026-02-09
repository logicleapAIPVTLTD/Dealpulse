const express=require("express")
const app=express()
const port=3000
const cors=require("cors")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
dotenv.config()
const  connectDB  =require("./config/db.js") 
const path=require("path")
const fs=require("fs")

app.use(cors())
app.use(express.json())
connectDB()



//routes
const marketIntelligenceRoutes =require("./routes/marketIntelligenceRoutes.js")
const docIntelligenceRoutes=require("./routes/docIntelligenceRoutes.js")
const matchingRoutes = require("./routes/matchingRoutes");
const financeMatchingRoutes=require("./routes/financeMatchingRoutes.js")






//api's
app.use("/api/marketIntelligence", marketIntelligenceRoutes)
app.use("/api",docIntelligenceRoutes)
app.use("/api/matching", matchingRoutes);
app.use("/api/match",financeMatchingRoutes)

app.post("/api/save-report", async (req, res) => {
  const { summaryData } = req.body;
  
  const reportContent = `
  Executive Summary:
  ${summaryData.details.executive_summary}

  Page Count: ${summaryData.details.details.page_count}
  Key Findings: ${summaryData.details.details.key_findings.join(", ")}
  `;

  const filename = `report-${Date.now()}.txt`;
  const filePath = path.join(__dirname, "reports", filename);

  fs.writeFileSync(filePath, reportContent);

  res.download(filePath, filename);
});






//port is hardcoded 
app.listen(port,()=>{
console.log("app is running on the port 3000")
})