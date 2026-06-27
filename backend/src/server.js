import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticate } from './middleware/authenticate.js';
import tankRoutes from './routes/tankRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS — only allow requests from the frontend dev server
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Health check — confirms server is running
app.get('/', (req, res) => {
  res.json({ message: 'AquaSense backend is running.' });
});

// Routes
app.use('/api/tanks', authenticate, tankRoutes);
app.use('/api/alerts', authenticate, alertRoutes);
app.use('/api/settings', authenticate, settingsRoutes);

app.listen(PORT, () => {
  console.log(`AquaSense backend running on http://localhost:${PORT}`);
});