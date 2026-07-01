import { db } from '../firebase/firebaseConfig.js';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the Python prediction script
const PREDICT_SCRIPT = join(__dirname, '../../../ml-model/predict.py');

// Running the Python prediction script as a child process
// Passing sensor values as command line arguments
// Returning a promise that resolves with the parsed prediction
function runPrediction(level, temperature, tds, ph, turbidity) {
  return new Promise((resolve, reject) => {
    const python = spawn('python', [
      PREDICT_SCRIPT,
      level,
      temperature,
      tds,
      ph,
      turbidity,
    ]);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Prediction script failed: ${errorOutput}`));
      }

      try {
        const result = JSON.parse(output.trim());
        resolve(result);
      } catch (err) {
        reject(new Error(`Failed to parse prediction output: ${output}`));
      }
    });
  });
}

// GET /tanks/:tankId/forecast
// Running the trained Random Forest models to predict freshness window and risk score
export async function getForecast(req, res) {
  try {
    const { tankId } = req.params;
    const userId = req.user.uid;

    // Verifying the tank belongs to this user and getting current sensor values
    const tankRef = db
      .collection('users')
      .doc(userId)
      .collection('tanks')
      .doc(tankId);

    const tankSnap = await tankRef.get();

    if (!tankSnap.exists) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    const tankData = tankSnap.data();
    const { level, temperature, tds, ph, turbidity } = tankData;

    // Checking that all sensor values exist before running a prediction
    if (
      level === null ||
      temperature === null ||
      tds === null ||
      ph === null ||
      turbidity === null
    ) {
      return res.status(200).json({
        freshness_window_hours: null,
        risk_score: null,
        generated_at: new Date().toISOString(),
        message: 'Not enough sensor data yet to generate a forecast',
      });
    }

    // Running the actual ML prediction
    const prediction = await runPrediction(level, temperature, tds, ph, turbidity);

    const forecast = {
      freshness_window_hours: prediction.freshness_window_hours,
      risk_score: prediction.risk_score,
      generated_at: new Date().toISOString(),
    };

    // Saving the latest forecast back onto the tank document
    await tankRef.update({
      freshness_window_hours: forecast.freshness_window_hours,
      risk_score: forecast.risk_score,
    });

    res.status(200).json(forecast);
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate forecast', error: err.message });
  }
}