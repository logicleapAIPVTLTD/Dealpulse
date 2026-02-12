const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const connectDB = require("./config/db.js");

const app = express();

// ✅ Use dynamic PORT for Coolify
const PORT = process.env.PORT || 3000;

// --------------------
// Middleware
// --------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dealpulse.logicleap.in",
    ],
    credentials: true,
  })
);

app.use(express.json());

// --------------------
// Database
// --------------------
connectDB();

// --------------------
// Routes
// --------------------
const marketIntelligenceRoutes = require("./routes/marketIntelligenceRoutes.js");
const docIntelligenceRoutes = require("./routes/docIntelligenceRoutes.js");
const matchingRoutes = require("./routes/matchingRoutes");
const financeMatchingRoutes = require("./routes/financeMatchingRoutes.js");

app.use("/api/marketIntelligence", marketIntelligenceRoutes);
app.use("/api", docIntelligenceRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/match", financeMatchingRoutes);

// --------------------
// Save Report Endpoint
// --------------------
app.post("/api/save-report", async (req, res) => {
  try {
    const { summaryData } = req.body;

    if (!summaryData) {
      return res.status(400).json({ message: "No summary data provided" });
    }

    const reportContent = `
Executive Summary:
${summaryData.details?.executive_summary || ""}

Page Count: ${summaryData.details?.details?.page_count || ""}
Key Findings: ${(summaryData.details?.details?.key_findings || []).join(", ")}
`;

    const filename = `report-${Date.now()}.txt`;
    const filePath = path.join(__dirname, "reports", filename);

    // Ensure reports folder exists
    if (!fs.existsSync(path.join(__dirname, "reports"))) {
      fs.mkdirSync(path.join(__dirname, "reports"));
    }

    fs.writeFileSync(filePath, reportContent);

    res.download(filePath, filename);
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// --------------------
// Health Check (Very Important for Coolify)
// --------------------
app.get("/", (req, res) => {
  res.status(200).json({ message: "Depulse API is running 🚀" });
});

// --------------------
// Start Server
// --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
