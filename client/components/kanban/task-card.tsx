'use client';

// components/kanban/task-card.tsx
// Responsive individual task card with professional Lucide icons.

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Pencil, Trash2, Calendar } from 'lucide-react';
import type { Task, TaskPriority } from '@/types';

const PRIORITY_CONFIG: Record<TaskPriority, { color: string; bg: string; label: string }> = {
    LOW: { color: '#34c77b', bg: 'rgba(52, 199, 123, 0.12)', label: 'Low' },
    MEDIUM: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', label: 'Medium' },
    HIGH: { color: '#f05060', bg: 'rgba(240, 80, 96, 0.12)', label: 'High' },
};

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    isDragOverlay?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, isDragOverlay = false }: TaskCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const {
        attributes, listeners, setNodeRef, transform, transition, isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
    };

    const priority = PRIORITY_CONFIG[task.priority];

    return (
        <div
            ref={setNodeRef}
            style={{
                ...style,
                background: isDragOverlay ? 'var(--bg-elevated)' : 'var(--bg-card)',
                border: `1px solid ${isDragOverlay ? 'var(--accent-purple)' : 'var(--border)'}`,
                borderRadius: '10px',
                padding: '14px',
                cursor: isDragOverlay ? 'grabbing' : 'grab',
                boxShadow: isDragOverlay ? '0 12px 36px rgba(0,0,0,0.6)' : '0 1px 4px rgba(0,0,0,0.2)',
                position: 'relative',
                userSelect: 'none',
                touchAction: 'none',
            }}
            {...attributes}
            {...listeners}
        >
            {/* Top row: Priority badge + options menu */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span
                    style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: priority.color,
                        background: priority.bg,
                        padding: '2px 8px',
                        borderRadius: '20px',
                    }}
                >
                    {priority.label}
                </span>

                {/* Action menu */}
                <div style={{ position: 'relative' }}>
                    <button
                        data-no-dnd
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        aria-label="Task options"
                        style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                        <MoreHorizontal size={16} />
                    </button>

                    {showMenu && (
                        <>
                            <div
                                style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(false);
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    zIndex: 50,
                                    background: 'var(--bg-elevated)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    minWidth: '130px',
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                                }}
                            >
                                <button
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(false);
                                        onEdit(task);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '10px 14px',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-primary)',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                >
                                    <Pencil size={14} style={{ color: 'var(--accent-purple)' }} />
                                    Edit
                                </button>
                                <button
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(false);
                                        onDelete(task.id);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '10px 14px',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--accent-red)',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(240, 80, 96, 0.08)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Task Title */}
            <p
                style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    lineHeight: 1.4,
                    marginBottom: task.description ? '6px' : '0',
                    wordBreak: 'break-word',
                }}
            >
                {task.title}
            </p>

            {/* Task Description */}
            {task.description && (
                <p
                    style={{
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                        marginBottom: '10px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const,
                        wordBreak: 'break-word',
                    }}
                >
                    {task.description}
                </p>
            )}

            {/* Footer Info */}
            {(task.assignee || task.dueDate) && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '10px',
                        paddingTop: '10px',
                        borderTop: '1px solid var(--border-subtle)',
                        flexWrap: 'wrap',
                        gap: '6px',
                    }}
                >
                    {task.assignee && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    color: 'white',
                                }}
                            >
                                {task.assignee.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{task.assignee.name}</span>
                        </div>
                    )}
                    {task.dueDate && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
