// src/validators/project.validators.ts
// Input validation schemas for project creation.

import { z } from 'zod';

export const createProjectSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().optional(),
});

export const projectQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(24).default(12),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type ProjectQueryInput = z.infer<typeof projectQuerySchema>;
