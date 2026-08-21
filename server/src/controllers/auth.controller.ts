// src/controllers/auth.controller.ts
// Handles HTTP layer for authentication: reads request, calls service, responds.

import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../validators/auth.validators';
import * as authService from '../services/auth.service';
import { AppError } from '../middleware/error.middleware';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new AppError(400, parseResult.error.issues.map((issue) => issue.message).join(', '));
    }

    const result = await authService.registerUser(parseResult.data);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new AppError(400, parseResult.error.issues.map((issue) => issue.message).join(', '));
    }

    const result = await authService.loginUser(parseResult.data);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}
