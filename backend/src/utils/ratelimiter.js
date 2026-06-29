import rateLimit from 'express-rate-limit';

// Applying a general rate limit to all API routes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

// Applying a stricter limit for sensor reading submissions
// Preventing ESP32 or any client from flooding the readings endpoint
export const readingsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many readings submitted, please slow down the sensor polling rate',
  },
});