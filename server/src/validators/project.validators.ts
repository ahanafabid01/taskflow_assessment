// src/validators/project.validators.ts
// Input validation schemas for project creation.

import { z } from 'zod';

export const createProjectSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
