// lib/api/projects.ts
// API functions for project endpoints.

import { apiClient } from './client';
import type { Project, CreateProjectInput, ProjectFilters, ProjectPage } from '@/types';

export function getProjectsApi(filters: ProjectFilters = {}): Promise<ProjectPage> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    const query = params.toString();
    return apiClient.get<ProjectPage>(`/api/projects${query ? `?${query}` : ''}`);
}

export function createProjectApi(data: CreateProjectInput): Promise<Project> {
    return apiClient.post<Project>('/api/projects', data);
}
