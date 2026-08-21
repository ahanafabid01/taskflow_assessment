'use client';

// components/kanban/task-card.tsx
// Responsive individual task card with professional Lucide icons.

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Pencil, Trash2, Calendar } from 'lucide-react';
import type { Task, TaskPriority } from '@/types';

const PRIORITY_CONFIG: Record<TaskPriority, { pill: string; label: string }> = {
    LOW:    { pill: 'text-green-600 bg-green-50 border border-green-200',  label: 'Low' },
    MEDIUM: { pill: 'text-amber-600 bg-amber-50 border border-amber-200',  label: 'Medium' },
    HIGH:   { pill: 'text-red-600   bg-red-50   border border-red-200',    label: 'High' },
};

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete?: (taskId: string) => void;
    isOwner?: boolean;
    isDragOverlay?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, isOwner = true, isDragOverlay = false }: TaskCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const {
        attributes, listeners, setNodeRef, transform, transition, isDragging,
    } = useSortable({ id: task.id });

    const dndStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
    };

    const priority = PRIORITY_CONFIG[task.priority];

    return (
        <div
            ref={setNodeRef}
            style={dndStyle}
            className={`bg-white rounded-[10px] p-3.5 relative select-none touch-none transition-[border-color,box-shadow] ${
                isDragOverlay
                    ? 'border border-brand shadow-[0_12px_30px_rgba(12,62,120,0.2)] cursor-grabbing'
                    : 'border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] cursor-grab hover:border-brand hover:shadow-[0_4px_12px_rgba(12,62,120,0.08)]'
            }`}
            {...attributes}
            {...listeners}
        >
            {/* Top row: Priority badge + options menu */}
            <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${priority.pill}`}>
                    {priority.label}
                </span>

                {/* Action menu (Only accessible by project owner) */}
                {isOwner && (
                    <div className="relative">
                        <button
                            data-no-dnd
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            aria-label="Task options"
                            className="w-[26px] h-[26px] rounded-md bg-transparent border-none cursor-pointer flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                        >
                            <MoreHorizontal size={16} />
                        </button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(false);
                                    }}
                                />
                                <div className="absolute top-full right-0 z-50 bg-white border border-slate-200 rounded-lg min-w-[130px] overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
                                    <button
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMenu(false);
                                            onEdit(task);
                                        }}
                                        className="flex items-center gap-2 w-full text-left px-3 py-2.5 bg-transparent border-none text-slate-900 text-[13px] font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                                    >
                                        <Pencil size={13} className="text-brand" />
                                        Edit
                                    </button>
                                    {onDelete && (
                                        <button
                                            onPointerDown={(e) => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowMenu(false);
                                                onDelete(task.id);
                                            }}
                                            className="flex items-center gap-2 w-full text-left px-3 py-2.5 bg-transparent border-none text-red-600 text-[13px] font-medium cursor-pointer hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={13} />
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Task Title */}
            <p className={`text-sm font-medium text-slate-900 leading-snug break-words ${task.description ? 'mb-1.5' : 'mb-0'}`}>
                {task.title}
            </p>

            {/* Task Description */}
            {task.description && (
                <p className="text-xs text-slate-600 leading-snug mb-2.5 overflow-hidden break-words line-clamp-2">
                    {task.description}
                </p>
            )}

            {/* Footer Info */}
            {(task.assignee || task.dueDate) && (
                <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100 flex-wrap gap-1.5">
                    {task.assignee && (
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand to-sky-500 flex items-center justify-center text-[9px] font-bold text-white">
                                {task.assignee.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[11px] text-slate-400">{task.assignee.name}</span>
                        </div>
                    )}
                    {task.dueDate && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 ml-auto">
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
