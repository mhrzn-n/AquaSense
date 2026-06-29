import { db } from '../firebase/firebaseConfig.js';

// Getting settings for the authenticated user
export async function getSettings(req, res) {
  try {
    const userId = req.user.uid;

    const settingsSnap = await db
      .collection('users')
      .doc(userId)
      .collection('settings')
      .doc('preferences')
      .get();

    if (!settingsSnap.exists) {
      // Returning default settings if none have been saved yet
      const defaultSettings = {
        notifications: true,
        alertEmail: '',
        refreshInterval: 30,
        thresholds: {
          tds: 500,
          ph_min: 6.5,
          ph_max: 8.5,
          turbidity: 4,
          level_min: 20,
          level_max: 95,
        },
      };
      return res.status(200).json({ settings: defaultSettings });
    }

    res.status(200).json({ settings: settingsSnap.data() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch settings', error: err.message });
  }
}

// Saving updated settings for the authenticated user
export async function updateSettings(req, res) {
  try {
    const userId = req.user.uid;

    const allowedFields = [
      'notifications',
      'alertEmail',
      'refreshInterval',
      'thresholds',
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided' });
    }

    updates.updated = new Date().toISOString();

    await db
      .collection('users')
      .doc(userId)
      .collection('settings')
      .doc('preferences')
      .set(updates, { merge: true });

    res.status(200).json({ message: 'Settings saved', settings: updates });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save settings', error: err.message });
  }
}