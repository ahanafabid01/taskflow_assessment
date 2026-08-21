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
    { label: string; color: string; badgeBg: string; badgeText: string; icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
    TODO: { label: 'To Do', color: 'text-slate-600', badgeBg: 'bg-slate-200', badgeText: 'text-slate-600', icon: CircleDot },
    IN_PROGRESS: { label: 'In Progress', color: 'text-brand', badgeBg: 'bg-brand/10', badgeText: 'text-brand', icon: Clock },
    DONE: { label: 'Done', color: 'text-green-600', badgeBg: 'bg-green-600/10', badgeText: 'text-green-600', icon: CheckCircle2 },
};

interface KanbanColumnProps {
    status: TaskStatus;
    tasks: Task[];
    onEditTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onAddTask: () => void;
    canCreate?: boolean;
    canDelete?: boolean;
}

export function KanbanColumn({
    status,
    tasks,
    onEditTask,
    onDeleteTask,
    onAddTask,
    canCreate = true,
    canDelete = true,
}: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: status });
    const config = COLUMN_CONFIG[status];
    const IconComponent = config.icon;

    return (
        <div
            ref={setNodeRef}
            className={`kanban-col flex flex-col rounded-[14px] border transition-all min-h-[440px] max-h-[calc(100vh-210px)] ${
                isOver
                    ? 'bg-brand/[0.04] border-brand'
                    : 'bg-slate-100 border-slate-200'
            }`}
        >
            {/* Column Header */}
            <div className="px-4 py-3.5 border-b border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <IconComponent size={16} className={config.color} />
                        <span className="text-sm font-bold text-slate-900">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${config.badgeText} ${config.badgeBg} px-2 py-0.5 rounded-full`}>
                            {tasks.length}
                        </span>
                        {canCreate && (
                            <button
                                id={`add-task-${status.toLowerCase()}`}
                                onClick={onAddTask}
                                title={`Add task to ${config.label}`}
                                className="w-[26px] h-[26px] rounded-md bg-white border border-slate-200 text-slate-600 cursor-pointer flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-brand hover:text-brand transition-all"
                            >
                                <Plus size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="flex-1 p-3 flex flex-col gap-2.5 overflow-y-auto">
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                            canDelete={canDelete}
                        />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    canCreate ? (
                        <div
                            onClick={onAddTask}
                            className="flex-1 flex flex-col items-center justify-center min-h-[120px] border border-dashed border-slate-300 rounded-[10px] text-slate-400 cursor-pointer bg-white transition-all hover:border-brand hover:text-brand"
                        >
                            <Plus size={18} className="mb-1.5" />
                            <span className="text-[13px] font-medium">Click to add a task</span>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] border border-dashed border-slate-200 rounded-[10px] text-slate-400 bg-white/50">
                            <span className="text-[13px] font-medium">No tasks in this column</span>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
