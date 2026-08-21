// lib/api/tasks.ts
// API functions for task endpoints.

import { apiClient } from './client';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from '@/types';

export function getProjectTasksApi(projectId: string, filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.priority) params.set('priority', filters.priority);

    const query = params.toString();
    return apiClient.get<Task[]>(`/api/projects/${projectId}/tasks${query ? `?${query}` : ''}`);
}

export function createTaskApi(projectId: string, data: CreateTaskInput): Promise<Task> {
    return apiClient.post<Task>(`/api/projects/${projectId}/tasks`, data);
}

export function updateTaskApi(taskId: string, data: UpdateTaskInput): Promise<Task> {
    return apiClient.patch<Task>(`/api/tasks/${taskId}`, data);
}

export function deleteTaskApi(taskId: string): Promise<void> {
    return apiClient.delete<void>(`/api/tasks/${taskId}`);
}
