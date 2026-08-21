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
import { Folder, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from './task-card';
import { TaskModal } from '../tasks/task-modal';
import { TaskFiltersBar } from '../tasks/task-filters';
import { useProjectTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/use-tasks';
import { useProject } from '@/hooks/use-projects';
import type { Task, TaskStatus, TaskFilters, CreateTaskInput, UpdateTaskInput } from '@/types';

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
    const { data: project } = useProject(projectId);
    const [filters, setFilters] = useState<TaskFilters>({});
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [modalTask, setModalTask] = useState<Task | null | undefined>(undefined); // undefined = closed, null = create
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
        useSensor(MouseSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 6,
            },
        }),
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        })
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
        if (confirm('Delete this task?')) {
            deleteTask.mutate(taskId);
        }
    }, [deleteTask]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-secondary)' }}>
                Loading board…
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ background: 'rgba(240, 80, 96, 0.1)', border: '1px solid rgba(240, 80, 96, 0.3)', borderRadius: '10px', padding: '16px', color: 'var(--accent-red)' }}>
                Failed to load tasks. Please refresh.
            </div>
        );
    }

    const displayTitle = project?.title || projectTitle;
    const displayDescription = project?.description;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}>
            {/* Project Header Card: Title, Badge & Clamped Description */}
            <div
                style={{
                    marginBottom: '20px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 20px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <div
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, var(--accent-purple-dim), rgba(79, 126, 247, 0.15))',
                                border: '1px solid var(--accent-purple-dim)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent-purple)',
                                flexShrink: 0,
                            }}
                        >
                            <Folder size={18} />
                        </div>
                        <h1
                            style={{
                                fontSize: 'clamp(18px, 2.5vw, 24px)',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.25,
                                margin: 0,
                                wordBreak: 'break-word',
                            }}
                        >
                            {displayTitle}
                        </h1>
                    </div>

                    {/* Task Counter Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                background: 'var(--bg-elevated)',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                border: '1px solid var(--border-subtle)',
                            }}
                        >
                            <Layers size={13} style={{ color: 'var(--accent-purple)' }} />
                            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                        </span>
                    </div>
                </div>

                {/* Project Description (Clamped with Show More toggle) */}
                {displayDescription && (
                    <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                        <p
                            style={{
                                fontSize: '13.5px',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.55,
                                margin: 0,
                                display: isDescriptionExpanded ? 'block' : '-webkit-box',
                                WebkitLineClamp: isDescriptionExpanded ? undefined : 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: isDescriptionExpanded ? 'visible' : 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {displayDescription}
                        </p>
                        {displayDescription.length > 140 && (
                            <button
                                type="button"
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--accent-purple)',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    padding: '6px 0 0',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}
                            >
                                {isDescriptionExpanded ? (
                                    <>
                                        Show less <ChevronUp size={13} />
                                    </>
                                ) : (
                                    <>
                                        Show more <ChevronDown size={13} />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Search and Filters Bar */}
            <div style={{ marginBottom: '20px', width: '100%' }}>
                <TaskFiltersBar filters={filters} onChange={setFilters} />
            </div>

            {/* Kanban Board Container */}
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
                                onAddTask={() => {
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

            {/* Centered Modal */}
            {modalTask !== undefined && (
                <TaskModal
                    task={modalTask}
                    defaultStatus={defaultStatus}
                    projectId={projectId}
                    onSave={handleSaveTask}
                    onClose={() => setModalTask(undefined)}
                />
            )}
        </div>
    );
}
