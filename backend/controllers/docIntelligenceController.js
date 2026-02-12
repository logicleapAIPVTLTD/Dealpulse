const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allow PDF, DOC, and DOCX
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files allowed"), false);
    }
  },
});

exports.uploadPDFMiddleware = upload.single("pdf");

exports.uploadAndSummarizePDF = async (req, res) => {
  try {
    const db = mongoose.connection.client.db("market_intelligence_production");
    const pdfMetadata = db.collection("pdf_metadata");

    const file = req.file;
    console.log("Uploaded File Info:", file);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const metadata = {
      filename: file.filename,
      original_name: file.originalname,
      upload_date: new Date(),
      size: file.size,
      status: "Processing",
    };
    await pdfMetadata.insertOne(metadata);

    const scriptPath = path.join(__dirname, "..", "ml", "summarize.py");
    const pdfPath = path.join(__dirname, "..", "uploads", file.filename);

    console.log("Running Python script:", scriptPath);
    console.log("PDF Path:", pdfPath);

    // Use 'py' command for Windows
    const pythonProcess = spawn("python3", [scriptPath, pdfPath]);

    let pythonOutput = "";
    let pythonError = "";

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        console.error("Python summarizer failed:", pythonError);
        await pdfMetadata.updateOne(
          { filename: file.filename },
          { $set: { status: "Failed", error: pythonError } }
        );
        return res.status(500).json({ message: "Summarization failed", error: pythonError });
      }

      let summary;
      try {
        summary = JSON.parse(pythonOutput);
      } catch (e) {
        console.error("Invalid JSON from Python:", pythonOutput);
        summary = { executive_summary: pythonOutput.trim() }; 
      }

      await pdfMetadata.updateOne(
        { filename: file.filename },
        {
          $set: {
            status: "Completed",
            summary_preview:
              summary.executive_summary?.slice(0, 500) ||
              "",
          },
        }
      );
      
      if (!summary.details) summary.details = {};
      summary.details.original_name = file.originalname;
      summary.details.page_count = summary.details.page_count || 0; 

      res.json({
        message: "PDF uploaded and summarized successfully",
        executive_summary: summary.executive_summary || "Summary could not be generated.",
        summary_preview: (summary.executive_summary || "").slice(0, 500),
        details: summary.details,
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error during PDF upload" });
  }
};

// *** THIS FUNCTION WAS MISSING/INCORRECT ***
exports.generatePDFReport = async (req, res) => {
  try {
    const summaryData = req.body; 
    
    const reportName = `report-${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, '..', 'uploads', reportName);
    
    const scriptPath = path.join(__dirname, "..", "ml", "report_generator.py");

    console.log("Spawning PDF generator:", scriptPath);
    // Use 'py' command for Windows
    const pythonProcess = spawn("python3", [scriptPath, outputPath]);

    let scriptOutput = "";
    let scriptError = "";
    
    pythonProcess.stdout.on("data", (data) => { scriptOutput += data.toString(); });
    pythonProcess.stderr.on("data", (data) => { scriptError += data.toString(); });

    pythonProcess.stdin.write(JSON.stringify(summaryData));
    pythonProcess.stdin.end();

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("PDF Report generation failed:", scriptError);
        return res.status(500).json({ message: "Failed to generate PDF report", error: scriptError });
      }

      const generatedFilePath = scriptOutput.trim();
      console.log("PDF Report generated at:", generatedFilePath);

      res.download(generatedFilePath, "Analysis_Report.pdf", (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).json({ message: "Error sending file" });
        }
        
        fs.unlink(generatedFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting temp report file:", unlinkErr);
          } else {
            console.log("Temp report file deleted:", generatedFilePath);
          }
        });
      });
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error during PDF generation" });
  }
};