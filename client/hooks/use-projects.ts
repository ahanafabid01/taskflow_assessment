// hooks/use-projects.ts
// TanStack Query hooks for project data fetching and mutation.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectsApi, createProjectApi } from '@/lib/api/projects';
import { QUERY_KEYS } from '@/types';
import type { CreateProjectInput } from '@/types';

export function useProjects() {
    return useQuery({
        queryKey: QUERY_KEYS.projects,
        queryFn: getProjectsApi,
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
