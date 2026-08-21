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

/** Duck-type check for Prisma known request errors without importing internal runtime paths. */
function isPrismaKnownError(err: unknown): err is { code: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as Record<string, unknown>).code === 'string' &&
    'clientVersion' in err
  );
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

  // Prisma known errors — surface meaningful messages instead of a generic 500
  if (isPrismaKnownError(err)) {
    if (err.code === 'P2002') {
      // Unique constraint violation (e.g. duplicate email)
      res.status(409).json({ error: { message: 'A record with that value already exists' } });
      return;
    }
    if (err.code === 'P2025') {
      // Record not found on update/delete
      res.status(404).json({ error: { message: 'Record not found' } });
      return;
    }
  }

  // Unexpected errors — do not leak details in production
  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: { message: 'Internal server error' } });
}
