// src/controllers/project.controller.ts
// Handles HTTP layer for project operations.

import { Request, Response, NextFunction } from 'express';
import { createProjectSchema } from '../validators/project.validators';
import * as projectService from '../services/project.service';
import { AppError } from '../middleware/error.middleware';

export async function getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.user!.id;
        const projects = await projectService.getProjectsForUser(userId);
        res.status(200).json({ data: projects });
    } catch (err) {
        next(err);
    }
}

export async function getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = req.params.id;
        if (typeof projectId !== 'string') {
            throw new AppError(400, 'A valid project ID is required');
        }

        const project = await projectService.getProjectById(projectId, req.user!.id);
        res.status(200).json({ data: project });
    } catch (err) {
        next(err);
    }
}

export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const parseResult = createProjectSchema.safeParse(req.body);
        if (!parseResult.success) {
            throw new AppError(400, parseResult.error.issues.map((issue) => issue.message).join(', '));
        }

        const userId = req.user!.id;
        const project = await projectService.createProject(userId, parseResult.data);
        res.status(201).json({ data: project });
    } catch (err) {
        next(err);
    }
}
