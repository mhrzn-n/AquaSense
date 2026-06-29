import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getUserTanks,
  createTank,
  getTankById,
  updateTank,
  deleteTank,
} from '../controllers/tankController.js';
import {
  addReading,
  getReadings,
} from '../controllers/readingController.js';
import { getForecast } from '../controllers/forecastController.js';
import { readingsLimiter } from '../utils/ratelimiter.js';
import { deviceAuthenticate } from '../middleware/deviceAuthenticate.js';

const router = express.Router();

// Tank CRUD routes — requiring Firebase token authentication
router.get('/', authenticate, getUserTanks);
router.post('/', authenticate, createTank);
router.get('/:tankId', authenticate, getTankById);
router.put('/:tankId', authenticate, updateTank);
router.delete('/:tankId', authenticate, deleteTank);

// Readings POST — accepting both Firebase token and ESP32 device key
router.post('/:tankId/readings', readingsLimiter, deviceAuthenticate, addReading);

// Readings GET — requiring Firebase token authentication
router.get('/:tankId/readings', authenticate, getReadings);

// Forecast route — requiring Firebase token authentication
router.get('/:tankId/forecast', authenticate, getForecast);

export default router;