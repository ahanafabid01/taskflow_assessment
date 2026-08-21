'use client';

// components/kanban/task-card.tsx
// Responsive individual task card with professional Lucide icons.

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Pencil, Trash2, Calendar } from 'lucide-react';
import type { Task, TaskPriority } from '@/types';

const PRIORITY_CONFIG: Record<TaskPriority, { color: string; bg: string; border: string; label: string }> = {
    LOW: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Low' },
    MEDIUM: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Medium' },
    HIGH: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'High' },
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
                background: '#ffffff',
                border: `1px solid ${isDragOverlay ? '#0c3e78' : 'var(--border)'}`,
                borderRadius: '10px',
                padding: '14px',
                cursor: isDragOverlay ? 'grabbing' : 'grab',
                boxShadow: isDragOverlay ? '0 12px 30px rgba(12, 62, 120, 0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
                position: 'relative',
                userSelect: 'none',
                touchAction: 'none',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
                if (!isDragOverlay) {
                    (e.currentTarget as HTMLElement).style.borderColor = '#0c3e78';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(12, 62, 120, 0.08)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isDragOverlay) {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                }
            }}
            {...attributes}
            {...listeners}
        >
            {/* Top row: Priority badge + options menu */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span
                    style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: priority.color,
                        background: priority.bg,
                        border: `1px solid ${priority.border}`,
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
                            width: '26px',
                            height: '26px',
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
                                    background: '#ffffff',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    minWidth: '130px',
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
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
                                        padding: '9px 12px',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-primary)',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                >
                                    <Pencil size={13} style={{ color: '#0c3e78' }} />
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
                                        padding: '9px 12px',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--accent-red)',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                                >
                                    <Trash2 size={13} />
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
