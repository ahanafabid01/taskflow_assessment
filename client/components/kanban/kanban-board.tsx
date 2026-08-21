'use client';

// components/kanban/kanban-board.tsx
// Centered Kanban board with responsive horizontal containment.

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    TouchSensor,
    MouseSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent,
} from '@dnd-kit/core';
import { Folder, Layers, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';
import { TaskModal } from '../tasks/task-modal';
import { TaskFiltersBar } from '../tasks/task-filters';
import { useProjectTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/use-tasks';
import { useProject } from '@/hooks/use-projects';
import { useAuth } from '@/lib/auth/auth-context';
import { KanbanBoardSkeleton } from '@/components/ui/loading';
import type { Task, TaskStatus, TaskFilters, CreateTaskInput, UpdateTaskInput } from '@/types';

function DeleteTaskModal({
    task,
    isDeleting,
    onConfirm,
    onClose,
}: {
    task: Task;
    isDeleting: boolean;
    onConfirm: () => void;
    onClose: () => void;
}) {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content animate-modal max-w-[420px]">
                <div className="flex items-start gap-3.5 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                        <Trash2 size={20} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 mb-1">Delete Task</h3>
                        <p className="text-[13.5px] text-slate-600 leading-relaxed m-0">
                            Are you sure you want to delete <span className="font-semibold text-slate-900">&quot;{task.title}&quot;</span>? This action cannot be undone.
                        </p>
                    </div>
                </div>

                <div className="flex gap-2.5 justify-end mt-6 pt-3 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium cursor-pointer hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-600 border-none rounded-lg text-white text-sm font-semibold transition-opacity ${
                            isDeleting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-red-700'
                        }`}
                    >
                        <Trash2 size={15} />
                        {isDeleting ? 'Deleting…' : 'Delete Task'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

/** Delays network filtering until the user pauses typing. */
function useDebouncedValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedValue(value), delay);
        return () => window.clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

interface KanbanBoardProps {
    projectId: string;
    projectTitle?: string;
}

export function KanbanBoard({ projectId, projectTitle = 'Project Board' }: KanbanBoardProps) {
    const { user } = useAuth();
    const { data: project } = useProject(projectId);
    const isOwner = Boolean(project && user && project.ownerId === user.id);
    const [filters, setFilters] = useState<TaskFilters>({});
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [modalTask, setModalTask] = useState<Task | null | undefined>(undefined);
    const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('TODO');
    const debouncedSearch = useDebouncedValue(filters.search ?? '', 300);
    const queryFilters = useMemo(
        () => ({ ...filters, search: debouncedSearch || undefined }),
        [filters, debouncedSearch],
    );

    const { data: tasks = [], isLoading, error } = useProjectTasks(projectId, queryFilters);
    const createTask = useCreateTask(projectId);
    const updateTask = useUpdateTask(projectId);
    const deleteTask = useDeleteTask(projectId);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    );

    const tasksByStatus = useMemo(() => {
        const groups: Record<TaskStatus, Task[]> = { TODO: [], IN_PROGRESS: [], DONE: [] };
        for (const task of tasks) {
            if (groups[task.status]) {
                groups[task.status].push(task);
            }
        }
        return groups;
    }, [tasks]);

    function findTaskStatus(taskId: string): TaskStatus | undefined {
        return STATUSES.find((s) => tasksByStatus[s].some((t) => t.id === taskId));
    }

    function handleDragStart({ active }: DragStartEvent) {
        const task = tasks.find((t) => t.id === active.id);
        if (task) setActiveTask(task);
    }

    function handleDragOver({ active, over }: DragOverEvent) {
        if (!over || active.id === over.id) return;
        const overStatus = STATUSES.includes(over.id as TaskStatus)
            ? (over.id as TaskStatus)
            : findTaskStatus(over.id as string);
        if (!overStatus) return;
        const activeStatus = findTaskStatus(active.id as string);
        if (activeStatus && activeStatus !== overStatus) {
            updateTask.mutate({ taskId: active.id as string, data: { status: overStatus } });
        }
    }

    function handleDragEnd({ active, over }: DragEndEvent) {
        setActiveTask(null);
        if (!over || active.id === over.id) return;
        const overStatus = STATUSES.includes(over.id as TaskStatus)
            ? (over.id as TaskStatus)
            : findTaskStatus(over.id as string);
        if (!overStatus) return;
        const task = tasks.find((t) => t.id === active.id);
        if (task && task.status !== overStatus) {
            updateTask.mutate({ taskId: active.id as string, data: { status: overStatus } });
        }
    }

    const handleSaveTask = useCallback(async (data: CreateTaskInput | UpdateTaskInput) => {
        if (modalTask === null) {
            await createTask.mutateAsync(data as CreateTaskInput);
        } else if (modalTask) {
            await updateTask.mutateAsync({ taskId: modalTask.id, data: data as UpdateTaskInput });
        }
    }, [modalTask, createTask, updateTask]);

    const handleDeleteTask = useCallback((taskId: string) => {
        const target = tasks.find((t) => t.id === taskId);
        if (target) {
            setTaskToDelete(target);
        }
    }, [tasks]);

    const handleConfirmDelete = useCallback(async () => {
        if (!taskToDelete) return;
        try {
            await deleteTask.mutateAsync(taskToDelete.id);
            setTaskToDelete(null);
        } catch {
            // Error is handled by TanStack Query & optimistic rollback
        }
    }, [taskToDelete, deleteTask]);

    if (isLoading) {
        return <KanbanBoardSkeleton />;
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 text-red-600 text-sm">
                Failed to load tasks. Please refresh.
            </div>
        );
    }

    const displayTitle = project?.title || projectTitle;
    const displayDescription = project?.description;

    return (
        <div className="flex flex-col w-full box-border">
            {/* Project Header Card */}
            <div className="mb-5 bg-white border border-slate-200 rounded-[14px] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col gap-2.5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-[38px] h-[38px] rounded-[10px] bg-brand/[0.08] border border-brand/[0.15] flex items-center justify-center text-brand shrink-0">
                            <Folder size={18} />
                        </div>
                        <h1 className="text-[clamp(18px,2.5vw,24px)] font-bold text-slate-900 tracking-[-0.02em] leading-tight m-0 break-words">
                            {displayTitle}
                        </h1>
                    </div>

                    {/* Task Counter Badge */}
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                            <Layers size={13} className="text-brand" />
                            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                        </span>
                    </div>
                </div>

                {/* Project Description */}
                {displayDescription && (
                    <div className="pt-2 border-t border-slate-100">
                        <p
                            className={`text-[13.5px] text-slate-600 leading-[1.55] m-0 whitespace-pre-wrap ${
                                isDescriptionExpanded ? '' : 'overflow-hidden text-ellipsis line-clamp-2'
                            }`}
                        >
                            {displayDescription}
                        </p>
                        {displayDescription.length > 140 && (
                            <button
                                type="button"
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className="bg-transparent border-none text-brand text-xs font-semibold cursor-pointer pt-1.5 pb-0 px-0 inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                            >
                                {isDescriptionExpanded ? (
                                    <>Show less <ChevronUp size={13} /></>
                                ) : (
                                    <>Show more <ChevronDown size={13} /></>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Filters Bar */}
            <div className="mb-5 w-full">
                <TaskFiltersBar filters={filters} onChange={setFilters} />
            </div>

            {/* Kanban Board */}
            <div className="kanban-board-wrapper">
                <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                    <div className="kanban-board">
                        {STATUSES.map((status) => (
                            <KanbanColumn
                                key={status}
                                status={status}
                                tasks={tasksByStatus[status]}
                                onEditTask={(task) => setModalTask(task)}
                                onDeleteTask={handleDeleteTask}
                                canCreate={isOwner}
                                canDelete={isOwner}
                                onAddTask={() => {
                                    if (!isOwner) return;
                                    setDefaultStatus(status);
                                    setModalTask(null);
                                }}
                            />
                        ))}
                    </div>

                    <DragOverlay>
                        {activeTask && (
                            <TaskCard
                                task={activeTask}
                                onEdit={() => { }}
                                onDelete={() => { }}
                                isDragOverlay
                            />
                        )}
                    </DragOverlay>
                </DndContext>
            </div>

            {/* Task Create/Edit Modal */}
            {modalTask !== undefined && (
                <TaskModal
                    task={modalTask}
                    defaultStatus={defaultStatus}
                    projectId={projectId}
                    onSave={handleSaveTask}
                    onClose={() => setModalTask(undefined)}
                />
            )}

            {/* Task Delete Confirmation Modal */}
            {taskToDelete !== null && (
                <DeleteTaskModal
                    task={taskToDelete}
                    isDeleting={deleteTask.isPending}
                    onConfirm={handleConfirmDelete}
                    onClose={() => setTaskToDelete(null)}
                />
            )}
        </div>
    );
}
