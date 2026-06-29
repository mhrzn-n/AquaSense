import express from 'express';
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

const router = express.Router();

// Tank CRUD routes
router.get('/', getUserTanks);
router.post('/', createTank);
router.get('/:tankId', getTankById);
router.put('/:tankId', updateTank);
router.delete('/:tankId', deleteTank);

// Readings subcollection routes
// Applying stricter rate limit on POST to prevent flooding from ESP32
router.post('/:tankId/readings', readingsLimiter, addReading);
router.get('/:tankId/readings', getReadings);

// Forecast route
router.get('/:tankId/forecast', getForecast);

export default router;