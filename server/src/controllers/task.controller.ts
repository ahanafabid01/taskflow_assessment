// src/controllers/task.controller.ts
// Handles HTTP layer for task operations.

import { Request, Response, NextFunction } from 'express';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '../validators/task.validators';
import * as taskService from '../services/task.service';
import { AppError } from '../middleware/error.middleware';

function getRouteId(value: string | string[] | undefined, label: string): string {
    if (typeof value !== 'string') {
        throw new AppError(400, `A valid ${label} is required`);
    }
    return value;
}

export async function getProjectTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = getRouteId(req.params.id, 'project ID');
        const userId = req.user!.id;

        const queryResult = taskQuerySchema.safeParse(req.query);
        if (!queryResult.success) {
            throw new AppError(400, queryResult.error.issues.map((issue) => issue.message).join(', '));
        }

        const tasks = await taskService.getProjectTasks(projectId, userId, queryResult.data);
        res.status(200).json({ data: tasks });
    } catch (err) {
        next(err);
    }
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = getRouteId(req.params.id, 'project ID');
        const userId = req.user!.id;

        const parseResult = createTaskSchema.safeParse(req.body);
        if (!parseResult.success) {
            throw new AppError(400, parseResult.error.issues.map((issue) => issue.message).join(', '));
        }

        const task = await taskService.createTask(projectId, userId, parseResult.data);
        res.status(201).json({ data: task });
    } catch (err) {
        next(err);
    }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const taskId = getRouteId(req.params.id, 'task ID');
        const userId = req.user!.id;

        const parseResult = updateTaskSchema.safeParse(req.body);
        if (!parseResult.success) {
            throw new AppError(400, parseResult.error.issues.map((issue) => issue.message).join(', '));
        }

        const task = await taskService.updateTask(taskId, userId, parseResult.data);
        res.status(200).json({ data: task });
    } catch (err) {
        next(err);
    }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const taskId = getRouteId(req.params.id, 'task ID');
        const userId = req.user!.id;

        await taskService.deleteTask(taskId, userId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}
