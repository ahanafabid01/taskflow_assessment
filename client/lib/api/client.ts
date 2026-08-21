// lib/api/client.ts
// Centralized API client — handles base URL, auth headers, JSON parsing, and error responses.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface ApiError {
    error: { message: string };
}

export class ApiRequestError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
        this.name = 'ApiRequestError';
    }
}

function getAuthHeader(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('taskflow_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const body = await response.json().catch(() => ({ error: { message: 'Unknown error' } })) as ApiError;
        throw new ApiRequestError(response.status, body.error?.message ?? 'Request failed');
    }

    // 204 No Content
    if (response.status === 204) {
        return undefined as unknown as T;
    }

    const body = await response.json() as { data: T };
    return body.data;
}

export const apiClient = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, data: unknown) =>
        request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
    patch: <T>(path: string, data: unknown) =>
        request<T>(path, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
