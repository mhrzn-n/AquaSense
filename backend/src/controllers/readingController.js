import { db } from '../firebase/firebaseConfig.js';
import { checkAndStoreAlerts } from './alertController.js';

// Adding a new sensor reading to the tank readings subcollection
export async function addReading(req, res) {
  try {
    const userId = req.user.uid;
    const { tankId } = req.params;
    const { level, temperature, tds, ph, turbidity } = req.body;

    // Verifying the tank exists and belongs to this user
    const tankRef = db
      .collection('users')
      .doc(userId)
      .collection('tanks')
      .doc(tankId);

    const tankSnap = await tankRef.get();

    if (!tankSnap.exists) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    const now = new Date().toISOString();

    // Building the reading document
    const reading = {
      level: level ?? null,
      temperature: temperature ?? null,
      tds: tds ?? null,
      ph: ph ?? null,
      turbidity: turbidity ?? null,
      freshness_window_hours: null,
      risk_score: null,
      recorded_at: now,
    };

    // Writing the reading to the readings subcollection
    await tankRef.collection('readings').add(reading);

    // Updating the latest sensor values on the tank document itself
    await tankRef.update({
      level: reading.level,
      temperature: reading.temperature,
      tds: reading.tds,
      ph: reading.ph,
      turbidity: reading.turbidity,
      updated: now,
    });

    // Checking all sensor values against thresholds and firing alerts if needed
    await checkAndStoreAlerts(userId, tankId, tankSnap.data().tankName, reading);

    res.status(201).json({ message: 'Reading recorded' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to record reading', error: err.message });
  }
}

// Getting historical readings for a tank ordered by most recent first
export async function getReadings(req, res) {
  try {
    const userId = req.user.uid;
    const { tankId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    // Verifying the tank exists and belongs to this user
    const tankRef = db
      .collection('users')
      .doc(userId)
      .collection('tanks')
      .doc(tankId);

    const tankSnap = await tankRef.get();

    if (!tankSnap.exists) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    // Fetching readings ordered by most recent first
    const snapshot = await tankRef
      .collection('readings')
      .orderBy('recorded_at', 'desc')
      .limit(limit)
      .get();

    const readings = snapshot.docs.map(doc => doc.data());

    res.status(200).json({ readings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch readings', error: err.message });
  }
}