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

const router = express.Router();

// Tank CRUD
router.get('/', getUserTanks);
router.post('/', createTank);
router.get('/:tankId', getTankById);
router.put('/:tankId', updateTank);
router.delete('/:tankId', deleteTank);

// Readings subcollection
router.post('/:tankId/readings', addReading);
router.get('/:tankId/readings', getReadings);

// Forecast
router.get('/:tankId/forecast', getForecast);

export default router;