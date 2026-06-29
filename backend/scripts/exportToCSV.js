import { db } from '../src/firebase/firebaseConfig.js';
import { createWriteStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration — update these before running
const USER_ID = 'BrizLUbxZpTmOmGglFMEqQZb7yH2';
const TANK_ID = 'FmwuF2je6VM3pnvcaWdl';
const OUTPUT_FILE = join(__dirname, '../../ml-model/training-data.csv');

async function exportToCSV() {
  console.log('Fetching readings from Firestore...');

  const snapshot = await db
    .collection('users')
    .doc(USER_ID)
    .collection('tanks')
    .doc(TANK_ID)
    .collection('readings')
    .orderBy('recorded_at', 'asc')
    .get();

  if (snapshot.empty) {
    console.error('No readings found. Run generateData.js first.');
    process.exit(1);
  }

  console.log(`Found ${snapshot.docs.length} readings. Writing to CSV...`);

  const writeStream = createWriteStream(OUTPUT_FILE);

  // Writing CSV header row
  writeStream.write('level,temperature,tds,ph,turbidity,freshness_window_hours,risk_score\n');

  // Writing each reading as a CSV row
  snapshot.docs.forEach(doc => {
    const d = doc.data();

    // Skipping readings with missing values
    if (
      d.level === null ||
      d.temperature === null ||
      d.tds === null ||
      d.ph === null ||
      d.turbidity === null ||
      d.freshness_window_hours === null ||
      d.risk_score === null
    ) {
      return;
    }

    writeStream.write(
      `${d.level},${d.temperature},${d.tds},${d.ph},${d.turbidity},${d.freshness_window_hours},${d.risk_score}\n`
    );
  });

  writeStream.end();

  writeStream.on('finish', () => {
    console.log(`Done. CSV written to ${OUTPUT_FILE}`);
    process.exit(0);
  });
}

exportToCSV().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});