// src/services/task.service.ts
// Task business logic: CRUD, search, filtering, and authorization.

import prisma from '../db/prisma';
import { AppError } from '../middleware/error.middleware';
import type { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validators/task.validators';

/**
 * Verifies project access and returns whether the current user owns the project.
 * Owners can view every task; collaborators can view only tasks assigned to them.
 */
async function assertProjectAccess(projectId: string, userId: string): Promise<boolean> {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new AppError(404, 'Project not found');

    if (project.ownerId === userId) return true;

    const assigned = await prisma.task.findFirst({ where: { projectId, assignedTo: userId } });
    if (!assigned) throw new AppError(403, 'Access denied');

    return false;
}

export async function getProjectTasks(
    projectId: string,
    userId: string,
    query: TaskQueryInput,
) {
    const isOwner = await assertProjectAccess(projectId, userId);

    return prisma.task.findMany({
        where: {
            projectId,
            // A collaborator has project access through an assignment, but must not
            // receive other collaborators' tasks or unassigned owner tasks.
            ...(!isOwner && { assignedTo: userId }),
            ...(query.status && { status: query.status }),
            ...(query.priority && { priority: query.priority }),
            ...(query.search && {
                title: { contains: query.search, mode: 'insensitive' },
            }),
        },
        include: {
            assignee: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function createTask(
    projectId: string,
    userId: string,
    input: CreateTaskInput,
) {
    // Verify project exists and user has ownership (only owners can create tasks)
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new AppError(404, 'Project not found');
    if (project.ownerId !== userId) throw new AppError(403, 'Only the project owner can create tasks');

    return prisma.task.create({
        data: {
            title: input.title,
            description: input.description,
            status: input.status,
            priority: input.priority,
            assignedTo: input.assigned_to,
            dueDate: input.due_date ? new Date(input.due_date) : null,
            projectId,
        },
        include: {
            assignee: { select: { id: true, name: true, email: true } },
        },
    });
}

export async function updateTask(
    taskId: string,
    userId: string,
    input: UpdateTaskInput,
) {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { project: true },
    });

    if (!task) throw new AppError(404, 'Task not found');

    // Allow owner or assignee to update
    if (task.project.ownerId !== userId && task.assignedTo !== userId) {
        throw new AppError(403, 'Access denied');
    }

    return prisma.task.update({
        where: { id: taskId },
        data: {
            ...(input.title !== undefined && { title: input.title }),
            ...(input.description !== undefined && { description: input.description }),
            ...(input.status !== undefined && { status: input.status }),
            ...(input.priority !== undefined && { priority: input.priority }),
            ...(input.assigned_to !== undefined && { assignedTo: input.assigned_to }),
            ...(input.due_date !== undefined && {
                dueDate: input.due_date ? new Date(input.due_date) : null,
            }),
        },
        include: {
            assignee: { select: { id: true, name: true, email: true } },
        },
    });
}

export async function deleteTask(taskId: string, userId: string) {
    const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { project: true },
    });

    if (!task) throw new AppError(404, 'Task not found');

    // Only the project owner can delete tasks
    if (task.project.ownerId !== userId) {
        throw new AppError(403, 'Only the project owner can delete tasks');
    }

    await prisma.task.delete({ where: { id: taskId } });
}
