// src/validators/task.validators.ts
// Input validation schemas for task creation and updates.

import { z } from 'zod';

export const taskStatusValues = ['TODO', 'IN_PROGRESS', 'DONE'] as const;
export const taskPriorityValues = ['LOW', 'MEDIUM', 'HIGH'] as const;

export const TaskStatus = z.enum(taskStatusValues);
export const TaskPriority = z.enum(taskPriorityValues);

const isNotPastDate = (val: string | null | undefined) => {
    if (!val) return true;
    const date = new Date(val);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    // Allow 24-hour timezone margin for UTC conversion
    return date.getTime() >= startOfToday.getTime() - 86400000;
};

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().optional(),
    status: TaskStatus.default('TODO'),
    priority: TaskPriority.default('MEDIUM'),
    assigned_to: z.string().uuid().optional().nullable(),
    due_date: z.string().datetime().optional().nullable().refine(isNotPastDate, {
        message: 'Due date cannot be in the past',
    }),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional().nullable(),
    status: TaskStatus.optional(),
    priority: TaskPriority.optional(),
    assigned_to: z.string().uuid().optional().nullable(),
    due_date: z.string().datetime().optional().nullable().refine(isNotPastDate, {
        message: 'Due date cannot be in the past',
    }),
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' },
);

export const taskQuerySchema = z.object({
    search: z.string().optional(),
    status: TaskStatus.optional(),
    priority: TaskPriority.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
