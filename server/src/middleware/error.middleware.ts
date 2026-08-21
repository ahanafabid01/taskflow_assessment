// src/middleware/error.middleware.ts
// Centralized error handler — all thrown errors flow through here.

import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { message: err.message } });
    return;
  }

  // Unexpected errors — do not leak details in production
  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: { message: 'Internal server error' } });
}
