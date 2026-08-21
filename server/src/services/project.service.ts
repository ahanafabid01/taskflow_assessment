// src/services/project.service.ts
// Project business logic: create and retrieve projects.

import prisma from '../db/prisma';
import type { Prisma } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import type { CreateProjectInput, ProjectQueryInput } from '../validators/project.validators';

export async function getProjectsForUser(userId: string, query: ProjectQueryInput) {
    const accessFilter: Prisma.ProjectWhereInput = {
        OR: [{ ownerId: userId }, { tasks: { some: { assignedTo: userId } } }],
    };
    const where = accessFilter;
    const skip = (query.page - 1) * query.limit;

    const [projects, total] = await prisma.$transaction([
        prisma.project.findMany({
            where,
            skip,
            take: query.limit,
        include: {
            owner: { select: { id: true, name: true, email: true } },
            _count: { select: { tasks: true } },
        },
        orderBy: { createdAt: 'desc' },
        }),
        prisma.project.count({ where }),
    ]);

    return {
        projects,
        pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / query.limit)),
        },
    };
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
