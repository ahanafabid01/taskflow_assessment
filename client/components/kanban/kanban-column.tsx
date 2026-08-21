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
    { label: string; color: string; badgeBg: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }
> = {
    TODO: { label: 'To Do', color: '#475467', badgeBg: '#e2e8f0', icon: CircleDot },
    IN_PROGRESS: { label: 'In Progress', color: '#0c3e78', badgeBg: 'rgba(12, 62, 120, 0.1)', icon: Clock },
    DONE: { label: 'Done', color: '#16a34a', badgeBg: 'rgba(22, 163, 74, 0.1)', icon: CheckCircle2 },
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
                background: isOver ? 'rgba(12, 62, 120, 0.04)' : '#f1f5f9',
                border: `1px solid ${isOver ? '#0c3e78' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.15s ease, background 0.15s ease',
                minHeight: '440px',
                maxHeight: 'calc(100vh - 210px)',
            }}
        >
            {/* Column Header */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <IconComponent size={16} style={{ color: config.color }} />
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{config.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                            style={{
                                fontSize: '12px',
                                fontWeight: 700,
                                color: config.color,
                                background: config.badgeBg,
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
                                width: '26px',
                                height: '26px',
                                borderRadius: '6px',
                                background: '#ffffff',
                                border: '1px solid var(--border)',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = '#0c3e78';
                                (e.currentTarget as HTMLElement).style.color = '#0c3e78';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                            }}
                        >
                            <Plus size={14} />
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
                            minHeight: '120px',
                            border: '1px dashed #cbd5e1',
                            borderRadius: 'var(--radius)',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            background: '#ffffff',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = '#0c3e78';
                            (e.currentTarget as HTMLElement).style.color = '#0c3e78';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1';
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                        }}
                    >
                        <Plus size={18} style={{ marginBottom: '6px' }} />
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>Click to add a task</span>
                    </div>
                )}
            </div>
        </div>
    );
}
