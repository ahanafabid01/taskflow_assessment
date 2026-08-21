// types/index.ts
// Shared TypeScript types for the TaskFlow frontend.

// ─── Enums ───────────────────────────────────────────────────────────────────

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export const TASK_STATUS: { label: string; value: TaskStatus }[] = [
  { label: 'To Do', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' },
];

export const TASK_PRIORITY: { label: string; value: TaskPriority }[] = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
];

// ─── API Entities ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  ownerId: string;
  owner: User;
  createdAt: string;
  _count?: { tasks: number };
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string | null;
  assignee?: User | null;
  dueDate?: string | null;
  createdAt: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface CreateProjectInput {
  title: string;
  description?: string;
}

export interface ProjectFilters {
  page?: number;
  limit?: number;
}

export interface ProjectPage {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Task ─────────────────────────────────────────────────────────────────────

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: string | null;
  due_date?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: string | null;
  due_date?: string | null;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  projects: (userId: string) => ['users', userId, 'projects'] as const,
  projectsFiltered: (userId: string, filters: ProjectFilters) =>
    ['users', userId, 'projects', filters] as const,
  project: (userId: string, projectId: string) =>
    ['users', userId, 'projects', projectId] as const,
  projectTasks: (userId: string, projectId: string) =>
    ['users', userId, 'projects', projectId, 'tasks'] as const,
  projectTasksFiltered: (userId: string, projectId: string, filters: TaskFilters) =>
    ['users', userId, 'projects', projectId, 'tasks', filters] as const,
  users: (userId: string) => ['users', userId, 'assignees'] as const,
} as const;
