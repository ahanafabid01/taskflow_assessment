'use client';

// components/kanban/kanban-column.tsx
// Responsive Kanban column component with professional Lucide icons.

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, CircleDot, Clock, CheckCircle2 } from 'lucide-react';
import { TaskCard } from './task-card';
import type { Task, TaskStatus } from '@/types';

const COLUMN_CONFIG: Record<
    TaskStatus,
    { label: string; color: string; accent: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }
> = {
    TODO: { label: 'To Do', color: 'var(--text-secondary)', accent: 'var(--border)', icon: CircleDot },
    IN_PROGRESS: { label: 'In Progress', color: 'var(--accent-purple)', accent: 'var(--accent-purple-dim)', icon: Clock },
    DONE: { label: 'Done', color: 'var(--accent-green)', accent: 'rgba(52, 199, 123, 0.15)', icon: CheckCircle2 },
};

interface KanbanColumnProps {
    status: TaskStatus;
    tasks: Task[];
    onEditTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onAddTask: () => void;
}

export function KanbanColumn({ status, tasks, onEditTask, onDeleteTask, onAddTask }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: status });
    const config = COLUMN_CONFIG[status];
    const IconComponent = config.icon;

    return (
        <div
            ref={setNodeRef}
            className="kanban-col"
            style={{
                background: isOver ? 'rgba(124, 106, 247, 0.05)' : 'var(--bg-secondary)',
                border: `1px solid ${isOver ? 'var(--accent-purple)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.15s ease, background 0.15s ease',
                minHeight: '440px',
                maxHeight: 'calc(100vh - 210px)',
            }}
        >
            {/* Column Header */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IconComponent size={15} style={{ color: config.color }} />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: config.color }}>{config.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                            style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: config.color,
                                background: config.accent,
                                padding: '2px 8px',
                                borderRadius: '12px',
                            }}
                        >
                            {tasks.length}
                        </span>
                        <button
                            id={`add-task-${status.toLowerCase()}`}
                            onClick={onAddTask}
                            title={`Add task to ${config.label}`}
                            style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-purple)';
                                (e.currentTarget as HTMLElement).style.color = 'var(--accent-purple)';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                            }}
                        >
                            <Plus size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                        />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div
                        onClick={onAddTask}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '24px 16px',
                            color: 'var(--text-muted)',
                            fontSize: '13px',
                            textAlign: 'center',
                            border: '2px dashed var(--border-subtle)',
                            borderRadius: '10px',
                            marginTop: '4px',
                            cursor: 'pointer',
                            transition: 'border-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-purple)')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)')}
                    >
                        <Plus size={20} style={{ color: 'var(--text-muted)' }} />
                        <span>Click to add a task</span>
                    </div>
                )}
            </div>
        </div>
    );
}
