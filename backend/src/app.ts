import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();

// The API is protected by JWT and role checks. Keeping CORS permissive avoids
// breaking Vercel preview/production aliases, which browsers otherwise report
// as an unhelpful "network error" before the login endpoint can respond.
app.use(cors({ methods: ['GET', 'POST', 'PUT', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use((_, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(express.json({ limit: '256kb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AYUSH Setu API is running cleanly', time: new Date() });
});

// API Routes
app.use('/api', apiRoutes);

export default app;
