import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMetrics } from './metrics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Serve the static HTML dashboard
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API route to fetch metrics
router.get('/api/metrics', async (req, res) => {
  const metrics = await getMetrics();
  if (metrics) {
    res.json(metrics);
  } else {
    res.status(500).json({ error: 'Error retrieving metrics' });
  }
});

export default router;
