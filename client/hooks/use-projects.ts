// hooks/use-projects.ts
// TanStack Query hooks for project data fetching and mutation.

import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectsApi, getProjectApi, createProjectApi } from '@/lib/api/projects';
import { QUERY_KEYS } from '@/types';
import type { CreateProjectInput, ProjectFilters } from '@/types';

export function useProjects(filters: ProjectFilters = {}) {
    return useQuery({
        queryKey: QUERY_KEYS.projectsFiltered(filters),
        queryFn: () => getProjectsApi(filters),
        placeholderData: keepPreviousData,
    });
}

export function useProject(projectId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.project(projectId),
        queryFn: () => getProjectApi(projectId),
        enabled: Boolean(projectId),
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateProjectInput) => createProjectApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
        },
    });
}
