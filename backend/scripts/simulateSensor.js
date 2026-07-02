import { db } from '../src/firebase/firebaseConfig.js';
import { checkAndStoreAlerts } from '../src/controllers/alertController.js';
import dotenv from 'dotenv';

dotenv.config();

// Configuration — update these before running
const USER_ID = 'BrizLUbxZpTmOmGglFMEqQZb7yH2';
const TANK_ID = 'FmwuF2je6VM3pnvcaWdl';
const INTERVAL_SECONDS = 30;

// Generating a random number between min and max
function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// Generating a realistic sensor reading
// Mixing normal conditions with occasional spikes
function generateReading() {
  const scenario = Math.random();

  if (scenario < 0.7) {
    // Normal conditions — 70% of the time
    return {
      level: randomBetween(40, 85),
      temperature: randomBetween(20, 30),
      tds: randomBetween(150, 450),
      ph: randomBetween(6.8, 7.8),
      turbidity: randomBetween(0.5, 2.5),
    };
  } else if (scenario < 0.9) {
    // Warning conditions — 20% of the time
    return {
      level: randomBetween(20, 40),
      temperature: randomBetween(28, 35),
      tds: randomBetween(400, 550),
      ph: randomBetween(6.2, 6.8),
      turbidity: randomBetween(2.5, 4.5),
    };
  } else {
    // Poor conditions triggering alerts — 10% of the time
    return {
      level: randomBetween(10, 20),
      temperature: randomBetween(33, 40),
      tds: randomBetween(550, 700),
      ph: randomBetween(5.5, 6.2),
      turbidity: randomBetween(4.5, 8),
    };
  }
}

// Posting one reading to Firestore directly
// Simulating exactly what the ESP32 firmware will do
async function postReading() {
  const reading = generateReading();
  const now = new Date().toISOString();

  const tankRef = db
    .collection('users')
    .doc(USER_ID)
    .collection('tanks')
    .doc(TANK_ID);

  const tankSnap = await tankRef.get();

  if (!tankSnap.exists) {
    console.error(`Tank ${TANK_ID} not found. Check USER_ID and TANK_ID.`);
    process.exit(1);
  }

  const readingDoc = {
    level: reading.level,
    temperature: reading.temperature,
    tds: reading.tds,
    ph: reading.ph,
    turbidity: reading.turbidity,
    freshness_window_hours: null,
    risk_score: null,
    recorded_at: now,
  };

  // Writing reading to subcollection
  await tankRef.collection('readings').add(readingDoc);

  // Updating latest values on tank document
  await tankRef.update({
    level: reading.level,
    temperature: reading.temperature,
    tds: reading.tds,
    ph: reading.ph,
    turbidity: reading.turbidity,
    updated: now,
  });

  // Checking thresholds and firing alerts if needed
  await checkAndStoreAlerts(
    USER_ID,
    TANK_ID,
    tankSnap.data().tankName,
    reading
  );

  console.log(`[${now}] Reading posted:`);
  console.log(`  Level: ${reading.level}%`);
  console.log(`  Temperature: ${reading.temperature}°C`);
  console.log(`  TDS: ${reading.tds} ppm`);
  console.log(`  pH: ${reading.ph}`);
  console.log(`  Turbidity: ${reading.turbidity} NTU`);
  console.log('---');
}

// Running the simulator on a fixed interval
async function startSimulator() {
  console.log(`AquaSense Virtual Sensor Simulator starting...`);
  console.log(`Posting readings every ${INTERVAL_SECONDS} seconds`);
  console.log(`Tank ID: ${TANK_ID}`);
  console.log('Press Ctrl+C to stop.\n');

  // Posting first reading immediately
  await postReading();

  // Then posting every 30 seconds
  setInterval(async () => {
    try {
      await postReading();
    } catch (err) {
      console.error('Failed to post reading:', err.message);
    }
  }, INTERVAL_SECONDS * 1000);
}

startSimulator().catch(err => {
  console.error('Simulator failed to start:', err.message);
  process.exit(1);
});