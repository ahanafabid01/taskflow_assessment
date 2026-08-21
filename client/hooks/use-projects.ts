// hooks/use-projects.ts
// TanStack Query hooks for project data fetching and mutation.

import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectsApi, getProjectApi, createProjectApi } from '@/lib/api/projects';
import { useAuth } from '@/lib/auth/auth-context';
import { QUERY_KEYS } from '@/types';
import type { CreateProjectInput, ProjectFilters } from '@/types';

export function useProjects(filters: ProjectFilters = {}) {
    const { user } = useAuth();
    const userId = user?.id ?? '';

    return useQuery({
        queryKey: QUERY_KEYS.projectsFiltered(userId, filters),
        queryFn: () => getProjectsApi(filters),
        enabled: Boolean(userId),
        placeholderData: keepPreviousData,
    });
}

export function useProject(projectId: string) {
    const { user } = useAuth();
    const userId = user?.id ?? '';

    return useQuery({
        queryKey: QUERY_KEYS.project(userId, projectId),
        queryFn: () => getProjectApi(projectId),
        enabled: Boolean(userId && projectId),
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (data: CreateProjectInput) => createProjectApi(data),
        onSuccess: () => {
            if (user) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects(user.id) });
            }
        },
    });
}
