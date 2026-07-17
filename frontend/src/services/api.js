const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function getAuthHeader() {
  const { auth } = await import('../firebase/Firebase.jsx');
  const token = await auth.currentUser?.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

export async function getTanks() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BASE_URL}/tanks`, { headers });
  return res.json();
}

export async function getTank(tankId) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BASE_URL}/tanks/${tankId}`, { headers });
  return res.json();
}

export async function createTank(data) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BASE_URL}/tanks`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTank(tankId, data) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BASE_URL}/tanks/${tankId}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTank(tankId) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BASE_URL}/tanks/${tankId}`, {
    method: 'DELETE',
    headers,
  });
  return res.json();
}

export async function getReadings(tankId, limit = 50) {
  const headers = await getAuthHeader();
  const res = await fetch(
    `${BASE_URL}/tanks/${tankId}/readings?limit=${limit}`,
    { headers }
  );
  return res.json();
}

export async function getForecast(tankId) {
  const headers = await getAuthHeader();
  const res = await fetch(`${BASE_URL}/tanks/${tankId}/forecast`, { headers });
  return res.json();
}

export async function getAlerts() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BASE_URL}/alerts`, { headers });
  return res.json();
}

export async function getSettings() {
  const headers = await getAuthHeader();
  const res = await fetch(`${BASE_URL}/settings`, { headers });
  return res.json();
}