import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

import { isDatabaseConfigured } from './prisma';

dotenv.config();

if (!isDatabaseConfigured) {
  console.error('[FATAL CONFIG] No DATABASE_URL is configured. User accounts will NOT persist across requests in this serverless deployment — this is a critical production misconfiguration, not a code bug. Set DATABASE_URL (or POSTGRES_URL/POSTGRES_PRISMA_URL) in the Vercel project\'s Environment Variables (Settings → Environment Variables) to a real hosted Postgres connection string (e.g. from Neon, Supabase, or Vercel Postgres), then redeploy.');
}

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
  res.json({
    status: 'OK',
    message: 'AYUSH Setu API is running cleanly',
    databaseConfigured: isDatabaseConfigured,
    time: new Date()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AYUSH Setu API is running cleanly',
    databaseConfigured: isDatabaseConfigured,
    time: new Date()
  });
});

// API Routes - mounted at both /api and / for Vercel serverless rewrite compatibility
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

export default app;
