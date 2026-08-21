// src/services/project.service.ts
// Project business logic: create and retrieve projects.

import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';
import type { CreateProjectInput, ProjectQueryInput } from '../validators/project.validators';

export async function getProjectsForUser(userId: string, query: ProjectQueryInput) {
    const accessFilter: Prisma.ProjectWhereInput = {
        OR: [{ ownerId: userId }, { tasks: { some: { assignedTo: userId } } }],
    };
    const where = accessFilter;
    const skip = (query.page - 1) * query.limit;

    const [projects, total] = await Promise.all([
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
    // Ensure the same owner cannot create two projects with identical names (case-insensitive)
    const duplicate = await prisma.project.findFirst({
        where: { ownerId: userId, title: { equals: input.title, mode: 'insensitive' } },
        select: { id: true },
    });
    if (duplicate) {
        throw new AppError(409, `You already have a project named "${input.title}"`);
    }

    try {
        return await prisma.project.create({
            data: {
                title: input.title,
                description: input.description,
                ownerId: userId,
            },
            include: {
                owner: { select: { id: true, name: true, email: true } },
            },
        });
    } catch (error) {
        // The database constraint covers concurrent requests that pass the
        // application-level duplicate check at the same time.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new AppError(409, `You already have a project named "${input.title}"`);
        }
        throw error;
    }
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
