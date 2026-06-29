import { db } from '../src/firebase/firebaseConfig.js';

// Configuration — update these before running
const USER_ID = 'BrizLUbxZpTmOmGglFMEqQZb7yH2';
const TANK_ID = 'FmwuF2je6VM3pnvcaWdl';
const TOTAL_READINGS = 500;

// Generating a random number between min and max
function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// Generating a realistic freshness window based on sensor values
// Higher TDS, extreme pH, and high turbidity reduce freshness window
function calculateFreshnessWindow(tds, ph, turbidity, temperature) {
  let baseWindow = 24;

  // Reducing window based on TDS level
  if (tds > 400) baseWindow -= (tds - 400) / 50;

  // Reducing window for extreme pH values
  const phDeviation = Math.abs(ph - 7.0);
  baseWindow -= phDeviation * 2;

  // Reducing window for high turbidity
  if (turbidity > 2) baseWindow -= (turbidity - 2) * 3;

  // Reducing window for high temperature
  if (temperature > 30) baseWindow -= (temperature - 30) * 0.5;

  // Keeping window between 2 and 48 hours
  return Math.max(2, Math.min(48, Math.round(baseWindow * 10) / 10));
}

// Calculating risk score from freshness window
// Lower freshness window means higher risk
function calculateRiskScore(freshnessWindow) {
  const risk = 1 - freshnessWindow / 48;
  return Math.round(Math.max(0, Math.min(1, risk)) * 100) / 100;
}

// Generating one realistic sensor reading
function generateReading(hoursAgo) {
  // Mixing normal readings with occasional spikes to simulate real conditions
  const scenario = Math.random();

  let tds, ph, turbidity, level, temperature;

  if (scenario < 0.6) {
    // Normal conditions — 60% of readings
    tds = randomBetween(150, 450);
    ph = randomBetween(6.8, 7.8);
    turbidity = randomBetween(0.5, 2.5);
    level = randomBetween(40, 85);
    temperature = randomBetween(20, 30);
  } else if (scenario < 0.8) {
    // Warning conditions — 20% of readings
    tds = randomBetween(400, 550);
    ph = randomBetween(6.2, 6.8);
    turbidity = randomBetween(2.5, 4.5);
    level = randomBetween(20, 40);
    temperature = randomBetween(28, 35);
  } else {
    // Poor conditions — 20% of readings
    tds = randomBetween(500, 700);
    ph = randomBetween(5.5, 6.2);
    turbidity = randomBetween(4, 8);
    level = randomBetween(10, 25);
    temperature = randomBetween(33, 40);
  }

  const freshnessWindow = calculateFreshnessWindow(tds, ph, turbidity, temperature);
  const riskScore = calculateRiskScore(freshnessWindow);

  // Generating timestamp going back in time
  const recordedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

  return {
    level,
    temperature,
    tds,
    ph,
    turbidity,
    freshness_window_hours: freshnessWindow,
    risk_score: riskScore,
    recorded_at: recordedAt,
  };
}

// Writing all readings to Firestore in batches
async function generateData() {
  console.log(`Generating ${TOTAL_READINGS} readings for tank ${TANK_ID}...`);

  const tankRef = db
    .collection('users')
    .doc(USER_ID)
    .collection('tanks')
    .doc(TANK_ID);

  const tankSnap = await tankRef.get();
  if (!tankSnap.exists) {
    console.error('Tank not found. Check USER_ID and TANK_ID values.');
    process.exit(1);
  }

  console.log(`Tank found: ${tankSnap.data().tankName}`);

  // Writing in batches of 500 — Firestore batch limit
  let batch = db.batch();
  let batchCount = 0;
  let totalWritten = 0;

  for (let i = 0; i < TOTAL_READINGS; i++) {
    // Spreading readings over the past 30 days
    const hoursAgo = (i / TOTAL_READINGS) * 30 * 24;
    const reading = generateReading(hoursAgo);

    const readingRef = tankRef.collection('readings').doc();
    batch.set(readingRef, reading);
    batchCount++;

    // Committing batch every 499 writes
    if (batchCount === 499) {
      await batch.commit();
      totalWritten += batchCount;
      console.log(`Written ${totalWritten} readings...`);
      batch = db.batch();
      batchCount = 0;
    }
  }

  // Committing remaining writes
  if (batchCount > 0) {
    await batch.commit();
    totalWritten += batchCount;
  }

  console.log(`Done. ${totalWritten} readings written to Firestore.`);
  process.exit(0);
}

generateData().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});