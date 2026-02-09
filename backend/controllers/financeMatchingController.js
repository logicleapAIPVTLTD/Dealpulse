const { spawn } = require('child_process');

exports.getMatchedCompanies = async (req, res) => {
  try {
    // Extract body params
    const {
      role,  // 'seller' or 'buyer'
      companyName,  // For seller role
      minDealSize,  // For buyer role (optional, default 0)
      maxDealSize,  // For buyer role (optional, default infinity)
      location,  // For buyer role (optional)
      requireGoodRating  // For buyer role (optional, default true)
    } = req.body;

    if (!role || !['seller', 'buyer'].includes(role)) {
      return res.status(400).json({ error: "Role must be 'seller' or 'buyer'" });
    }

    // Build script args
    const scriptArgs = ['ml/matcher2.py'];

    if (role === 'seller') {
      if (!companyName) {
        return res.status(400).json({ error: "companyName is required for seller role" });
      }
      scriptArgs.push('--role', 'seller', '--company', companyName);
    } else if (role === 'buyer') {
      scriptArgs.push('--role', 'buyer');
      if (minDealSize !== undefined) scriptArgs.push('--min_deal', minDealSize.toString());
      if (maxDealSize !== undefined) scriptArgs.push('--max_deal', maxDealSize.toString());
      if (location) scriptArgs.push('--location', location);
      if (requireGoodRating !== undefined) scriptArgs.push('--require_rating', requireGoodRating.toString());
    }

    // Spawn Python process
    const pythonProcess = spawn('python', scriptArgs, {
      env: {
        ...process.env,
        DYNAMO_ACCESS_KEY: process.env.DYNAMO_ACCESS_KEY,
        DYNAMO_SECRET_KEY: process.env.DYNAMO_SECRET_KEY,
        DYNAMO_REGION: process.env.DYNAMO_REGION || 'us-west-2',
        DYNAMO_TABLE_NAME: process.env.DYNAMO_TABLE_NAME || 'financial_companies_master'
      }
    });

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          message: "Python script failed",
          error: errorOutput
        });
      }

      try {
        const result = JSON.parse(output);
        if (result.error) {
          return res.status(400).json(result);
        }
        res.json(result);
      } catch (err) {
        res.status(500).json({
          message: "Failed to parse Python output",
          raw_output: output
        });
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error running matcher" });
  }
};
