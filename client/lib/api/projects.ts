// lib/api/projects.ts
// API functions for project endpoints.

import { apiClient } from './client';
import type { Project, CreateProjectInput } from '@/types';

export function getProjectsApi(): Promise<Project[]> {
    return apiClient.get<Project[]>('/api/projects');
}

export function createProjectApi(data: CreateProjectInput): Promise<Project> {
    return apiClient.post<Project>('/api/projects', data);
}
