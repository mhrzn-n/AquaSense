import dotenv from 'dotenv';
dotenv.config();

// Getting a fresh Firebase ID token for local API testing
// Run this at the start of each dev session with:
// node scripts/getTestToken.js

const WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY;
const TEST_EMAIL = 'test@aquasense.com';
const TEST_PASSWORD = 'test123';

if (!WEB_API_KEY) {
  console.error('Add FIREBASE_WEB_API_KEY to your .env file first');
  process.exit(1);
}

const response = await fetch(
  `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${WEB_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      returnSecureToken: true,
    }),
  }
);

const data = await response.json();

if (data.error) {
  console.error('Sign in failed:', data.error.message);
  process.exit(1);
}

console.log('\n Token ready. Run this in PowerShell:\n');
console.log(`$TOKEN = "${data.idToken}"\n`);
console.log('Token expires in 60 minutes.\n');