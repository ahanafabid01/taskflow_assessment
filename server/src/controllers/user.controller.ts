// src/controllers/user.controller.ts
// Controller for user-related endpoints (listing users for assignee selection).

import type { Request, Response } from 'express';
import prisma from '../db/prisma';

export async function getUsers(_req: Request, res: Response): Promise<void> {
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' },
    });

    res.json({ data: users });
}
