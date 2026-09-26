import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { initScheduler } from './cron/scheduler.js';

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

// Start server
app.listen(PORT, () => {
  console.log(\`Backend server running on http://localhost:\${PORT}\`);
  
  // Initialize Cron Jobs
  initScheduler();
});
