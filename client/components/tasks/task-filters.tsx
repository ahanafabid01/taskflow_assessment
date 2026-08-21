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

    const PRIORITY_COLORS: Record<TaskPriority, string> = {
        LOW: '#34c77b',
        MEDIUM: '#f59e0b',
        HIGH: '#f05060',
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                boxSizing: 'border-box',
            }}
        >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 280px', width: '100%', maxWidth: '100%' }}>
                <Search
                    size={15}
                    style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        pointerEvents: 'none',
                    }}
                />
                <input
                    id="task-search"
                    type="text"
                    value={filters.search ?? ''}
                    onChange={handleSearch}
                    placeholder="Search tasks by title..."
                    style={{
                        width: '100%',
                        padding: '9px 36px 9px 36px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent-purple)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                />
                {filters.search && (
                    <button
                        type="button"
                        onClick={() => onChange({ ...filters, search: '' })}
                        aria-label="Clear search"
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Priority Filters */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                    maxWidth: '100%',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    <Filter size={13} />
                    <span>Priority:</span>
                </div>
                <button
                    id="filter-priority-all"
                    onClick={() => handlePriority(undefined)}
                    style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        background: !filters.priority ? 'var(--accent-purple-dim)' : 'var(--bg-elevated)',
                        border: `1px solid ${!filters.priority ? 'var(--accent-purple)' : 'var(--border)'}`,
                        color: !filters.priority ? 'var(--accent-purple)' : 'var(--text-secondary)',
                    }}
                >
                    All
                </button>
                {TASK_PRIORITY.map(({ value, label }) => (
                    <button
                        key={value}
                        id={`filter-priority-${value.toLowerCase()}`}
                        onClick={() => handlePriority(filters.priority === value ? undefined : (value as TaskPriority))}
                        style={{
                            padding: '5px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            background:
                                filters.priority === value
                                    ? `rgba(${value === 'LOW' ? '52, 199, 123' : value === 'MEDIUM' ? '245, 158, 11' : '240, 80, 96'}, 0.15)`
                                    : 'var(--bg-elevated)',
                            border: `1px solid ${filters.priority === value ? PRIORITY_COLORS[value as TaskPriority] : 'var(--border)'}`,
                            color: filters.priority === value ? PRIORITY_COLORS[value as TaskPriority] : 'var(--text-secondary)',
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
