// lib/api/auth.ts
// API functions for authentication endpoints.

import { apiClient } from './client';
import type { AuthResponse, LoginInput, RegisterInput } from '@/types';

export function loginApi(data: LoginInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/login', data);
}

export function registerApi(data: RegisterInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/register', data);
}
