// src/services/auth.service.ts
// Authentication business logic: registration, login, JWT issuance.

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';
import { config } from '../config/env';
import { AppError } from '../middleware/error.middleware';
import type { RegisterInput, LoginInput } from '../validators/auth.validators';

const BCRYPT_ROUNDS = 10;

function signToken(userId: string, email: string, name: string): string {
    return jwt.sign(
        { userId, email, name },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn } as jwt.SignOptions,
    );
}

export async function registerUser(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
        throw new AppError(409, 'Email is already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            passwordHash,
        },
        select: { id: true, name: true, email: true, createdAt: true },
    });

    const token = signToken(user.id, user.email, user.name);

    return { token, user };
}

export async function loginUser(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
        throw new AppError(401, 'Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatch) {
        throw new AppError(401, 'Invalid email or password');
    }

    const token = signToken(user.id, user.email, user.name);

    return {
        token,
        user: { id: user.id, name: user.name, email: user.email },
    };
}
