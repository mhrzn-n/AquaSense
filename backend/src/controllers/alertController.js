import { db } from '../firebase/firebaseConfig.js';

// Thresholds for all AquaSense sensor parameters
const THRESHOLDS = {
  tds:         { max: 500,  alertType: 'HIGH_TDS' },
  ph_low:      { min: 6.5,  alertType: 'LOW_PH' },
  ph_high:     { max: 8.5,  alertType: 'HIGH_PH' },
  turbidity:   { max: 4,    alertType: 'HIGH_TURBIDITY' },
  level_low:   { min: 20,   alertType: 'LOW' },
  level_high:  { max: 95,   alertType: 'OVERFLOW' },
};

// Check a single reading against all thresholds and write alerts to Firestore
export async function checkAndStoreAlerts(userId, tankId, tankName, reading) {
  const alerts = [];
  const { tds, ph, turbidity, level } = reading;

  if (tds !== undefined && tds > THRESHOLDS.tds.max) {
    alerts.push({
      type: THRESHOLDS.tds.alertType,
      value: tds,
      threshold: THRESHOLDS.tds.max,
    });
  }

  if (ph !== undefined && ph < THRESHOLDS.ph_low.min) {
    alerts.push({
      type: THRESHOLDS.ph_low.alertType,
      value: ph,
      threshold: THRESHOLDS.ph_low.min,
    });
  }

  if (ph !== undefined && ph > THRESHOLDS.ph_high.max) {
    alerts.push({
      type: THRESHOLDS.ph_high.alertType,
      value: ph,
      threshold: THRESHOLDS.ph_high.max,
    });
  }

  if (turbidity !== undefined && turbidity > THRESHOLDS.turbidity.max) {
    alerts.push({
      type: THRESHOLDS.turbidity.alertType,
      value: turbidity,
      threshold: THRESHOLDS.turbidity.max,
    });
  }

  if (level !== undefined && level < THRESHOLDS.level_low.min) {
    alerts.push({
      type: THRESHOLDS.level_low.alertType,
      value: level,
      threshold: THRESHOLDS.level_low.min,
    });
  }

  if (level !== undefined && level > THRESHOLDS.level_high.max) {
    alerts.push({
      type: THRESHOLDS.level_high.alertType,
      value: level,
      threshold: THRESHOLDS.level_high.max,
    });
  }

  // Write each triggered alert to Firestore
  const alertsRef = db
    .collection('users')
    .doc(userId)
    .collection('alerts');

  const writes = alerts.map(alert => {
    return alertsRef.add({
      tankId,
      tankName,
      type: alert.type,
      value: alert.value,
      threshold: alert.threshold,
      triggered_at: new Date().toISOString(),
      resolved: false,
    });
  });

  await Promise.all(writes);
  return alerts;
}

// GET /alerts — return all alerts for the authenticated user
export async function getAlerts(req, res) {
  try {
    const userId = req.user.uid;

    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('alerts')
      .orderBy('triggered_at', 'desc')
      .get();

    const alerts = snapshot.docs.map(doc => ({
      alertId: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ alerts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch alerts', error: err.message });
  }
}