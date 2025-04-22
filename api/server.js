import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.js';
import { requireAuth } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import databaseRoutes from './routes/database.js';
import businessRoutes from './routes/businesses.js';
import enrichmentRoutes from './routes/enrichment.js';
import scrapingRoutes from './routes/scraping.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/users', requireAuth, userRoutes);
app.use('/api/database', requireAuth, databaseRoutes);
app.use('/api/businesses', requireAuth, businessRoutes);
app.use('/api/enrichment', requireAuth, enrichmentRoutes);
app.use('/api/scraping', requireAuth, scrapingRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;