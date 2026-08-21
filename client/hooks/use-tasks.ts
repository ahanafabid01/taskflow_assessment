// hooks/use-tasks.ts
// TanStack Query hooks for task data fetching and mutations.

import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getProjectTasksApi,
    createTaskApi,
    updateTaskApi,
    deleteTaskApi,
} from '@/lib/api/tasks';
import { QUERY_KEYS } from '@/types';
import type { CreateTaskInput, UpdateTaskInput, TaskFilters, Task, TaskStatus } from '@/types';

export function useProjectTasks(projectId: string, filters: TaskFilters = {}) {
    return useQuery({
        queryKey: QUERY_KEYS.projectTasksFiltered(projectId, filters),
        queryFn: () => getProjectTasksApi(projectId, filters),
        enabled: !!projectId,
        // Keep the visible board stable while search/filter results are loading.
        placeholderData: keepPreviousData,
    });
}

export function useCreateTask(projectId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTaskInput) => createTaskApi(projectId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.projectTasks(projectId),
            });
        },
    });
}

export function useUpdateTask(projectId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskInput }) =>
            updateTaskApi(taskId, data),

        // Optimistic update — immediately update the task in cache before the API responds
        onMutate: async ({ taskId, data }) => {
            // Cancel any in-flight refetches
            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.projectTasks(projectId),
            });

            // Snapshot previous value for rollback
            const previousTasks = queryClient.getQueriesData<Task[]>({
                queryKey: QUERY_KEYS.projectTasks(projectId),
            });

            // Optimistically update all matching query cache entries (different filter combos)
            queryClient.setQueriesData<Task[]>(
                { queryKey: QUERY_KEYS.projectTasks(projectId) },
                (old) =>
                    old?.map((task) =>
                        task.id === taskId ? { ...task, ...data } : task,
                    ) ?? [],
            );

            return { previousTasks };
        },

        // Rollback on error
        onError: (_err, _vars, context) => {
            if (context?.previousTasks) {
                for (const [queryKey, data] of context.previousTasks) {
                    queryClient.setQueryData(queryKey, data);
                }
            }
        },

        // Always refetch after settle to ensure server state is correct
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.projectTasks(projectId),
            });
        },
    });
}

export function useDeleteTask(projectId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taskId: string) => deleteTaskApi(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.projectTasks(projectId),
            });
        },
    });
}

export function useUpdateTaskStatus(projectId: string) {
    const updateTask = useUpdateTask(projectId);

    return {
        updateStatus: (taskId: string, status: TaskStatus) =>
            updateTask.mutate({ taskId, data: { status } }),
        isPending: updateTask.isPending,
    };
}
