// src/app.ts
// Express application setup — middleware, routes, error handler.

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import userRoutes from './routes/user.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// Security headers
app.use(helmet());

// CORS — allow Next.js frontend
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  }),
);

// Request response-time logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const elapsed = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsed}ms`);
  });
  next();
});

// Parse JSON bodies (with size limit to prevent payload abuse)
app.use(express.json({ limit: '50kb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: { message: 'Not found' } });
});

// Centralized error handler (must be last)
app.use(errorMiddleware);

export default app;
