import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { initDb } from './db/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Static files (for served generated images)
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api', apiRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database initialization route (run this once after deployment)
app.get('/api/init', async (req, res) => {
  try {
    await initDb();
    res.json({ success: true, message: 'Database initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize database', details: error.message });
  }
});

// Export for Vercel Serverless
export default app;

// Only start the server locally (Vercel uses the exported app)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(\`Backend server running on http://localhost:\${PORT}\`);
    await initDb();
  });
}
