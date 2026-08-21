'use client';

// components/tasks/task-filters.tsx
// Responsive real-time search and priority filter toolbar with Lucide icons.

import { useCallback } from 'react';
import { Search, X, Filter } from 'lucide-react';
import type { TaskFilters, TaskPriority } from '@/types';
import { TASK_PRIORITY } from '@/types';

interface TaskFiltersProps {
    filters: TaskFilters;
    onChange: (filters: TaskFilters) => void;
}

export function TaskFiltersBar({ filters, onChange }: TaskFiltersProps) {
    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange({ ...filters, search: e.target.value });
        },
        [filters, onChange],
    );

    const handlePriority = useCallback(
        (priority: TaskPriority | undefined) => {
            onChange({ ...filters, priority });
        },
        [filters, onChange],
    );

    const PRIORITY_STYLES: Record<TaskPriority, { active: string; inactive: string }> = {
        LOW:    { active: 'bg-green-50 border-green-200 text-green-600',   inactive: 'bg-white border-slate-200 text-slate-600' },
        MEDIUM: { active: 'bg-amber-50 border-amber-200 text-amber-600',   inactive: 'bg-white border-slate-200 text-slate-600' },
        HIGH:   { active: 'bg-red-50   border-red-200   text-red-600',     inactive: 'bg-white border-slate-200 text-slate-600' },
    };

    return (
        <div className="flex flex-row flex-wrap gap-3 items-center justify-between w-full box-border">
            {/* Search Input */}
            <div className="relative flex-[1_1_280px] w-full max-w-full">
                <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                    id="task-search"
                    type="text"
                    value={filters.search ?? ''}
                    onChange={handleSearch}
                    placeholder="Search tasks by title..."
                    className="w-full py-[9px] px-[36px] bg-white border border-slate-300 rounded-lg text-slate-900 text-sm outline-none box-border shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:border-brand focus:shadow-[0_0_0_3px_rgba(12,62,120,0.1)] transition-all"
                />
                {filters.search && (
                    <button
                        type="button"
                        onClick={() => onChange({ ...filters, search: '' })}
                        aria-label="Clear search"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-400 p-0.5 flex items-center justify-center hover:text-slate-600 transition-colors"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Priority Filters */}
            <div className="flex items-center gap-1.5 flex-wrap max-w-full">
                <div className="flex items-center gap-1 mr-1 text-slate-600 text-xs font-semibold">
                    <Filter size={13} className="text-brand" />
                    <span>Priority:</span>
                </div>
                <button
                    id="filter-priority-all"
                    onClick={() => handlePriority(undefined)}
                    className={`px-3 py-[5px] rounded-full text-xs font-semibold cursor-pointer border shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all ${
                        !filters.priority
                            ? 'bg-brand border-brand text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-brand hover:text-brand'
                    }`}
                >
                    All
                </button>
                {TASK_PRIORITY.map(({ value, label }) => {
                    const isSelected = filters.priority === value;
                    const styles = PRIORITY_STYLES[value as TaskPriority];
                    return (
                        <button
                            key={value}
                            id={`filter-priority-${value.toLowerCase()}`}
                            onClick={() => handlePriority(isSelected ? undefined : (value as TaskPriority))}
                            className={`px-3 py-[5px] rounded-full text-xs font-semibold cursor-pointer border shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all ${
                                isSelected ? styles.active : styles.inactive + ' hover:border-slate-300'
                            }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
