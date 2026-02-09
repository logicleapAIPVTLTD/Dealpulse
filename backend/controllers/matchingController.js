// const path = require("path");
// const { spawn } = require("child_process");
// const fs = require("fs");

// exports.matchSellersForBuyer = async (req, res) => {
//   try {
//     // If buyer uploads a file (e.g. profile PDF or CSV)
//     let buyerFilePath = null;
//     if (req.file) {
//       buyerFilePath = path.join(__dirname, "..", "uploads", req.file.filename);
//     }

//     // If filters are passed instead of file
//     const filters = req.body || {};

//     console.log("Received Filters:", filters);
//     console.log("Buyer File:", buyerFilePath);

//     // Spawn Python process
//     const args = ["ml/matcher.py"];
//     if (buyerFilePath) args.push(buyerFilePath);
//     if (Object.keys(filters).length > 0) args.push(JSON.stringify(filters));

//     const pythonProcess = spawn("python", args);

//     let output = "";
//     let errorOutput = "";

//     pythonProcess.stdout.on("data", (data) => {
//       output += data.toString();
//     });

//     pythonProcess.stderr.on("data", (data) => {
//       errorOutput += data.toString();
//     });

//     pythonProcess.on("close", (code) => {
//       if (code !== 0) {
//         console.error("Python matcher failed:", errorOutput);
//         return res.status(500).json({ error: "Matcher failed", details: errorOutput });
//       }

//       try {
//         const result = JSON.parse(output);
//         res.json({
//           message: "Matching completed successfully",
//           recommendations: result.matches || [],
//           stats: result.stats || {},
//         });
//       } catch (err) {
//         res.json({
//           message: "Matching complete, but output not in JSON.",
//           raw_output: output,
//         });
//       }
//     });
//   } catch (err) {
//     console.error("Error in matchSellersForBuyer:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



// controllers/matcherController.js
// const { spawn }=require("child_process");
// const path=require("path");

// exports.findPotentialBuyers = async (req, res) => {
//   const { seller_name } = req.body;

//   if (!seller_name) {
//     return res.status(400).json({ error: "seller_name is required" });
//   }

//   try {
//     const pythonPath = path.join(process.cwd(),"ml", "matcher.py");
//     const mongoURI = process.env.MONGO_URI;

//     const pythonProcess = spawn("python", [pythonPath, seller_name, mongoURI]);

//     let resultData = "";
//     pythonProcess.stdout.on("data", (data) => {
//       resultData += data.toString();
//     });

//     let errorData = "";
//     pythonProcess.stderr.on("data", (data) => {
//       errorData += data.toString();
//     });

//     pythonProcess.on("close", (code) => {
//       if (errorData) {
//         return res.status(500).json({ message: "Error from Python", error: errorData });
//       }

//       // If matcher.py prints JSON — parse it
//       try {
//         const jsonStart = resultData.indexOf("{");
//         const jsonString = resultData.slice(jsonStart);
//         const parsed = JSON.parse(jsonString);
//         res.status(200).json(parsed);
//       } catch (err) {
//         res.status(200).json({ message: "Matching complete, but output not in JSON.", raw_output: resultData });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
//...........................................................................



// const { spawn } = require('child_process');

// exports.getMatchedCompanies = async (req, res) => {
//   try {
//     const { companyName, role } = req.body; // role = "buyer" or "seller"

//     if (!companyName || !role) {
//       return res.status(400).json({ error: "companyName and role are required" });
//     }

//     const pythonProcess = spawn('python', [
//       'ml/matcher.py', // Path to your script
//       '--company', companyName,
//       '--role', role
//     ]);

//     let output = "";
//     pythonProcess.stdout.on('data', (data) => {
//       output += data.toString();
//     });

//     pythonProcess.stderr.on('data', (data) => {
//       console.error(`stderr: ${data}`);
//     });

//     pythonProcess.on('close', (code) => {
//       console.log(`Python process exited with code ${code}`);

//       // Extract JSON response if printed from Python
//       const jsonStart = output.indexOf('{');
//       const jsonEnd = output.lastIndexOf('}') + 1;
//       if (jsonStart !== -1 && jsonEnd !== -1) {
//         try {
//           const result = JSON.parse(output.slice(jsonStart, jsonEnd));
//           res.json(result);
//         } catch (err) {
//           res.status(500).json({ message: "Matching complete, but output not in JSON.", raw_output: output });
//         }
//       } else {
//         res.status(500).json({ message: "No JSON found in Python output.", raw_output: output });
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error running matcher" });
//   }
// };
//..............................................................................

// const { spawn } = require('child_process');

// exports.getMatchedCompanies = async (req, res) => {
//   try {
//     // Get ALL filters from the body, even if we don't use them yet
//     const { 
//       companyName, 
//       role, 
//       industry,
//       creditRating,
//       annualRevenue,
//       netProfit,
//       debtToEquity,
//       ebitdaMargin,
//       prodCapacity,
//       ncltCases 
//     } = req.body;

//     if (!companyName || !role) {
//       return res.status(400).json({ error: "companyName and role are required" });
//     }
    
//     // --- ARGUMENTS FOR PYTHON SCRIPT ---
//     // Currently, your Python script only accepts company and role.
//     const scriptArgs = [
//       'ml/matcher.py',
//       '--company', companyName,
//       '--role', role
//       // TODO: Add more args here when Python script is updated
//       // e.g., '--industry', industry, '--revenue', annualRevenue ...
//     ];

//     // Use 'py' for Windows
//     const pythonProcess = spawn('py', scriptArgs);

//     let output = "";
//     let errorOutput = "";

//     pythonProcess.stdout.on('data', (data) => {
//       output += data.toString();
//     });

//     pythonProcess.stderr.on('data', (data) => {
//       console.error(`Python Stderr: ${data}`);
//       errorOutput += data.toString(); // Capture errors
//     });

//     pythonProcess.on('close', (code) => {
//       console.log(`Python process exited with code ${code}`);

//       // If the process failed, send back the error
//       if (code !== 0) {
//         return res.status(500).json({ 
//           message: "Python script failed", 
//           error: errorOutput 
//         });
//       }

//       // Try to parse the JSON output
//       try {
//         const result = JSON.parse(output);
//         if (result.error) {
//           // Handle errors reported by the Python script itself
//           return res.status(500).json({ message: "Error in Python script", error: result.details });
//         }
//         res.json(result);
//       } catch (err) {
//         res.status(500).json({ message: "Failed to parse Python output.", raw_output: output });
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error running matcher" });
//   }
// };
//.............................................................


// const { spawn } = require('child_process');

// exports.getMatchedCompanies = async (req, res) => {
//   try {
//     // Get ALL filters from the body
//     const { 
//       companyName, 
//       role, 
//       industry,
//       creditRating,
//       annualRevenue,
//       netProfit,
//       debtToEquity,
//       ebitdaMargin,
//       prodCapacity,
//       ncltCases 
//     } = req.body;

//     // Validate mandatory filters
//     if (!companyName || !role || !industry) {
//       return res.status(400).json({ 
//         error: "companyName, role, and industry are required" 
//       });
//     }

//     // Validate role
//     if (!['buyer', 'seller'].includes(role.toLowerCase())) {
//       return res.status(400).json({ 
//         error: "role must be 'buyer' or 'seller'" 
//       });
//     }
    
//     // --- ARGUMENTS FOR PYTHON SCRIPT ---
//     // Pass mandatory and advanced filters
//     const scriptArgs = [
//       'ml/matcher.py',
//       '--company', companyName,
//       '--role', role,
//       '--industry', industry,
//       // Advanced filters: Pass as empty string if not provided (script will handle as None)
//       '--creditRating', creditRating || '',
//       '--annualRevenue', annualRevenue || '',
//       '--netProfit', netProfit || '',
//       '--debtToEquity', debtToEquity || '',
//       '--ebitdaMargin', ebitdaMargin || '',
//       '--prodCapacity', prodCapacity || '',
//       '--ncltCases', ncltCases || ''
//     ];

//     // Use 'py' for Windows
//     const pythonProcess = spawn('py', scriptArgs);

//     let output = "";
//     let errorOutput = "";

//     pythonProcess.stdout.on('data', (data) => {
//       output += data.toString();
//     });

//     pythonProcess.stderr.on('data', (data) => {
//       console.error(`Python Stderr: ${data}`);
//       errorOutput += data.toString(); // Capture errors
//     });

//     pythonProcess.on('close', (code) => {
//       console.log(`Python process exited with code ${code}`);

//       // If the process failed, send back the error
//       if (code !== 0) {
//         return res.status(500).json({ 
//           message: "Python script failed", 
//           error: errorOutput 
//         });
//       }

//       // Try to parse the JSON output
//       try {
//         const result = JSON.parse(output);
//         if (result.error) {
//           // Handle errors reported by the Python script itself
//           return res.status(500).json({ message: "Error in Python script", error: result.details });
//         }
//         res.json(result);
//       } catch (err) {
//         res.status(500).json({ message: "Failed to parse Python output.", raw_output: output });
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error running matcher" });
//   }
// };
//.............................................................

// const { spawn } = require('child_process');

// exports.getMatchedCompanies = async (req, res) => {
//   try {
//     // Get ALL filters from the body
//     const { 
//       companyName, 
//       role, 
//       industry,
//       creditRating,
//       annualRevenue,
//       netProfit,
//       debtToEquity,
//       ebitdaMargin,
//       prodCapacity,
//       ncltCases 
//     } = req.body;

//     if (!role) {
//       return res.status(400).json({ error: "Role ('buyer' or 'seller') is required" });
//     }
    
//     // --- Build a dynamic list of arguments ---
//     const scriptArgs = [
//       'ml/matcher.py',
//       '--role', role
//     ];

//     // Add advanced filters only if they are provided
//     if (companyName) scriptArgs.push('--company', companyName);
//     if (industry) scriptArgs.push('--industry', industry);
//     if (creditRating) scriptArgs.push('--credit_rating', creditRating);
//     if (annualRevenue) scriptArgs.push('--revenue', annualRevenue);
//     if (netProfit) scriptArgs.push('--net_profit', netProfit);
//     if (debtToEquity) scriptArgs.push('--d_to_e', debtToEquity);
//     if (ebitdaMargin) scriptArgs.push('--ebitda', ebitdaMargin);
//     if (prodCapacity) scriptArgs.push('--capacity', prodCapacity);
//     if (ncltCases) scriptArgs.push('--nclt', ncltCases);
//     // ---------------------------------------------

//     // Use 'py' for Windows and pass environment variables
//     const pythonProcess = spawn('py', scriptArgs, {
//       env: {
//         ...process.env, 
//         MONGO_URI: process.env.MONGO_URI // Make sure MONGO_URI is in your .env
//       }
//     });

//     let output = "";
//     let errorOutput = "";

//     pythonProcess.stdout.on('data', (data) => {
//       output += data.toString();
//     });

//     pythonProcess.stderr.on('data', (data) => {
//       console.error(`Python Stderr: ${data}`);
//       errorOutput += data.toString(); 
//     });

//     pythonProcess.on('close', (code) => {
//       console.log(`Python process exited with code ${code}`);

//       if (code !== 0) {
//         return res.status(500).json({ 
//           message: "Python script failed", 
//           error: errorOutput 
//         });
//       }

//       try {
//         const result = JSON.parse(output);
//         if (result.error) {
//           return res.status(500).json({ message: "Error in Python script", error: result.details });
//         }
//         res.json(result);
//       } catch (err) {
//         res.status(500).json({ message: "Failed to parse Python output.", raw_output: output });
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error running matcher" });
//   }
// };


const { spawn } = require('child_process');

exports.getMatchedCompanies = async (req, res) => {
  try {
    // Get ALL filters from the body
    const { 
      companyName, 
      role, 
      industry,
      creditRating,
      annualRevenue,
      netProfit,
      debtToEquity,
      ebitdaMargin,
      prodCapacity,
      ncltCases 
    } = req.body;

    // Validation: Required fields
    if (!companyName) {
      return res.status(400).json({ error: "companyName is required" });
    }
    if (!role) {
      return res.status(400).json({ error: "Role ('buyer' or 'seller') is required" });
    }
    if (!industry) {
      return res.status(400).json({ error: "Industry filter is required" });
    }

    // --- Build a dynamic list of arguments (FIXED ARGUMENT NAMES) ---
    const scriptArgs = [
      'ml/matcher.py',
      '--company', companyName,
      '--role', role,
      '--industry', industry
    ];

    // Add advanced filters only if they are provided (CORRECTED NAMES)
    if (creditRating) scriptArgs.push('--creditRating', creditRating);
    if (annualRevenue) scriptArgs.push('--annualRevenue', annualRevenue);
    if (netProfit) scriptArgs.push('--netProfit', netProfit);
    if (debtToEquity) scriptArgs.push('--debtToEquity', debtToEquity);
    if (ebitdaMargin) scriptArgs.push('--ebitdaMargin', ebitdaMargin);
    if (prodCapacity) scriptArgs.push('--prodCapacity', prodCapacity);
    if (ncltCases) scriptArgs.push('--ncltCases', ncltCases);
    
    console.log('Executing Python with args:', scriptArgs);

    // Use 'py' for Windows and pass environment variables
    const pythonProcess = spawn('py', scriptArgs, {
      env: {
        ...process.env, 
        MONGO_URI: process.env.MONGO_URI,
        PYTHONIOENCODING: 'utf-8' // Force UTF-8 encoding
      }
    });

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Stderr: ${data}`);
      errorOutput += data.toString(); 
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      console.log('Raw Python Output:', output);
      console.log('Python Errors:', errorOutput);

      if (code !== 0) {
        return res.status(500).json({ 
          message: "Python script failed", 
          error: errorOutput,
          exitCode: code
        });
      }

      // Clean output (remove any non-JSON content)
      const cleanOutput = output.trim();
      
      if (!cleanOutput) {
        return res.status(500).json({ 
          message: "Python script produced no output",
          stderr: errorOutput 
        });
      }

      try {
        const result = JSON.parse(cleanOutput);
        
        if (result.error) {
          return res.status(500).json({ 
            message: "Error in Python script", 
            error: result.details 
          });
        }
        
        res.json(result);
      } catch (err) {
        console.error('JSON Parse Error:', err.message);
        res.status(500).json({ 
          message: "Failed to parse Python output.", 
          parseError: err.message,
          raw_output: cleanOutput,
          stderr: errorOutput
        });
      }
    });

    pythonProcess.on('error', (err) => {
      console.error('Failed to start Python process:', err);
      res.status(500).json({ 
        message: "Failed to start Python process",
        error: err.message 
      });
    });

  } catch (err) {
    console.error('Controller Error:', err);
    res.status(500).json({ 
      error: "Error running matcher",
      details: err.message 
    });
  }
};