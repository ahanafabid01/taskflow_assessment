// lib/api/users.ts
// API functions for user-related endpoints.

import { apiClient } from './client';
import type { User } from '@/types';

export function getUsersApi(): Promise<User[]> {
    return apiClient.get<User[]>('/api/users');
}
