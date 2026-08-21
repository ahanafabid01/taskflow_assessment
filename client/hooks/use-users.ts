// hooks/use-users.ts
// TanStack Query hook for fetching all users (used in assignee dropdown).

import { useQuery } from '@tanstack/react-query';
import { getUsersApi } from '@/lib/api/users';

const USERS_QUERY_KEY = ['users'] as const;

export function useUsers() {
    return useQuery({
        queryKey: USERS_QUERY_KEY,
        queryFn: getUsersApi,
        staleTime: 5 * 60 * 1000, // 5 minutes — user list doesn't change often
    });
}
