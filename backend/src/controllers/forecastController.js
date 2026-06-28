import { db } from '../firebase/firebaseConfig.js';

// GET /tanks/:tankId/forecast
// Currently returns a mock response — will be replaced with actual ML model output in the future
export async function getForecast(req, res) {
  try {
    const { tankId } = req.params;
    const userId = req.user.uid;

    // Verifying the tank belongs to this user
    const tankRef = db
      .collection('users')
      .doc(userId)
      .collection('tanks')
      .doc(tankId);

    const tankSnap = await tankRef.get();

    if (!tankSnap.exists) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    // Mock forecast response
    // This stub lets the frontend build and test ForecastWidget independently before the ML model is integrated
    const mockForecast = {
      freshness_window_hours: 18.5,
      risk_score: 0.32,
      generated_at: new Date().toISOString(),
    };

    res.status(200).json(mockForecast);
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate forecast', error: err.message });
  }
}