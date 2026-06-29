import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = express.Router();

// Getting and updating user preferences
router.get('/', getSettings);
router.put('/', updateSettings);

export default router;