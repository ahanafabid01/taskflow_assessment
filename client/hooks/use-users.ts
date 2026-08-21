// hooks/use-users.ts
// TanStack Query hook for fetching all users (used in assignee dropdown).

import { useQuery } from '@tanstack/react-query';
import { getUsersApi } from '@/lib/api/users';
import { useAuth } from '@/lib/auth/auth-context';
import { QUERY_KEYS } from '@/types';

export function useUsers() {
    const { user } = useAuth();
    const userId = user?.id ?? '';

    return useQuery({
        queryKey: QUERY_KEYS.users(userId),
        queryFn: getUsersApi,
        enabled: Boolean(userId),
        staleTime: 5 * 60 * 1000, // 5 minutes — user list doesn't change often
    });
}
