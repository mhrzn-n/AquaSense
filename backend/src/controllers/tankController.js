import { db } from '../firebase/firebaseConfig.js';
import { checkAndStoreAlerts } from './alertController.js';

// Getting all tanks belonging to the authenticated user
export async function getUserTanks(req, res) {
  try {
    const userId = req.user.uid;

    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('tanks')
      .orderBy('created', 'desc')
      .get();

    const tanks = snapshot.docs.map(doc => doc.data());

    res.status(200).json({ tanks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tanks', error: err.message });
  }
}

// Getting a single tank by its ID
export async function getTankById(req, res) {
  try {
    const userId = req.user.uid;
    const { tankId } = req.params;

    const tankSnap = await db
      .collection('users')
      .doc(userId)
      .collection('tanks')
      .doc(tankId)
      .get();

    if (!tankSnap.exists) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    res.status(200).json({ tank: tankSnap.data() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tank', error: err.message });
  }
}

// Creating a new tank with the AquaSense sensor schema
export async function createTank(req, res) {
  try {
    const userId = req.user.uid;
    const { tankName, tankType, capacity } = req.body;

    if (!tankName || !tankType || !capacity) {
      return res.status(400).json({ message: 'tankName, tankType and capacity are required' });
    }

    const tankRef = db
      .collection('users')
      .doc(userId)
      .collection('tanks')
      .doc();

    const now = new Date().toISOString();

    const tankPayload = {
      tankId: tankRef.id,
      tankName,
      tankType,
      capacity,
      level: null,
      temperature: null,
      tds: null,
      ph: null,
      turbidity: null,
      freshness_window_hours: null,
      risk_score: null,
      created: now,
      updated: now,
    };

    await tankRef.set(tankPayload);

    res.status(201).json({ tank: tankPayload });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create tank', error: err.message });
  }
}

// Updating tank fields including incoming sensor readings
export async function updateTank(req, res) {
  try {
    const userId = req.user.uid;
    const { tankId } = req.params;

    const tankRef = db
      .collection('users')
      .doc(userId)
      .collection('tanks')
      .doc(tankId);

    const tankSnap = await tankRef.get();

    if (!tankSnap.exists) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    const allowedFields = [
      'tankName',
      'tankType',
      'capacity',
      'level',
      'temperature',
      'tds',
      'ph',
      'turbidity',
      'freshness_window_hours',
      'risk_score',
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.updated = new Date().toISOString();

    await tankRef.update(updates);

    const updatedSnap = await tankRef.get();

    // Checking for alerts if sensor fields are being updated
    const sensorFields = ['tds', 'ph', 'turbidity', 'level'];
    const hasSensorUpdate = sensorFields.some(f => updates[f] !== undefined);

    if (hasSensorUpdate) {
      const tankData = updatedSnap.data();
      await checkAndStoreAlerts(userId, tankId, tankData.tankName, updates);
    }

    res.status(200).json({ tank: updatedSnap.data() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update tank', error: err.message });
  }
}

// Deleting a tank and all its readings and alerts
export async function deleteTank(req, res) {
  try {
    const userId = req.user.uid;
    const { tankId } = req.params;

    const tankRef = db
      .collection('users')
      .doc(userId)
      .collection('tanks')
      .doc(tankId);

    const tankSnap = await tankRef.get();

    if (!tankSnap.exists) {
      return res.status(404).json({ message: 'Tank not found' });
    }

    // Deleting all readings in the subcollection first
    const readingsSnap = await tankRef.collection('readings').get();
    const deleteReadings = readingsSnap.docs.map(doc => doc.ref.delete());
    await Promise.all(deleteReadings);

    // Deleting the tank document itself
    await tankRef.delete();

    res.status(200).json({ message: 'Tank deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete tank', error: err.message });
  }
}