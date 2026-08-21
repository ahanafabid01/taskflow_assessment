// src/middleware/auth.middleware.ts
// Verifies the JWT Bearer token and attaches the user to req.user.

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AppError } from './error.middleware';

interface JwtPayload {
    userId: string;
    email: string;
    name: string;
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError(401, 'Authorization header missing or malformed'));
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    try {
        const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
        req.user = { id: payload.userId, email: payload.email, name: payload.name };
        next();
    } catch {
        next(new AppError(401, 'Invalid or expired token'));
    }
}
