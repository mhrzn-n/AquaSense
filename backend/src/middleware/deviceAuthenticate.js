import { auth } from '../firebase/firebaseConfig.js';

// Authenticating incoming requests from either the frontend or the ESP32
// Frontend sends a Firebase ID token in the Authorization header
// ESP32 sends a static device key in the X-Device-Key header
export async function deviceAuthenticate(req, res, next) {
  try {
    const deviceKey = req.headers['x-device-key'];
    const authHeader = req.headers.authorization;

    // Checking for ESP32 device key first
    if (deviceKey) {
      if (deviceKey !== process.env.DEVICE_API_KEY) {
        return res.status(401).json({ message: 'Invalid device key' });
      }

      // Attaching a device user object so controllers
      // know this request is coming from hardware
      req.user = {
        uid: req.params.tankId,
        isDevice: true,
      };

      return next();
    }

    // Falling back to Firebase token verification for frontend requests
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = await auth.verifyIdToken(token);
      req.user = decoded;
      return next();
    }

    return res.status(401).json({ message: 'No authentication provided' });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
}