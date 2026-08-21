// src/services/project.service.ts
// Project business logic: create and retrieve projects.

import prisma from '../db/prisma';
import { AppError } from '../middleware/error.middleware';
import type { CreateProjectInput } from '../validators/project.validators';

export async function getProjectsForUser(userId: string) {
    // Return projects owned by or assigned to the user (via task assignment)
    return prisma.project.findMany({
        where: {
            OR: [
                { ownerId: userId },
                { tasks: { some: { assignedTo: userId } } },
            ],
        },
        include: {
            owner: { select: { id: true, name: true, email: true } },
            _count: { select: { tasks: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createProject(userId: string, input: CreateProjectInput) {
    return prisma.project.create({
        data: {
            title: input.title,
            description: input.description,
            ownerId: userId,
        },
        include: {
            owner: { select: { id: true, name: true, email: true } },
        },
    });
}

export async function getProjectById(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            owner: { select: { id: true, name: true, email: true } },
            _count: { select: { tasks: true } },
        },
    });

    if (!project) {
        throw new AppError(404, 'Project not found');
    }

    // Authorization: only owner or assigned users can access
    if (project.ownerId !== userId) {
        const hasAccess = await prisma.task.findFirst({
            where: { projectId, assignedTo: userId },
        });
        if (!hasAccess) {
            throw new AppError(403, 'Access denied');
        }
    }

    return project;
}
