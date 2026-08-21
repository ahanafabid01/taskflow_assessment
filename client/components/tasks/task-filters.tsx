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

    const PRIORITY_COLORS: Record<TaskPriority, { color: string; bg: string; border: string }> = {
        LOW: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
        MEDIUM: { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
        HIGH: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
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
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#0c3e78';
                        e.target.style.boxShadow = '0 0 0 3px rgba(12, 62, 120, 0.1)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
                    }}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>
                    <Filter size={13} style={{ color: '#0c3e78' }} />
                    <span>Priority:</span>
                </div>
                <button
                    id="filter-priority-all"
                    onClick={() => handlePriority(undefined)}
                    style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: !filters.priority ? '#0c3e78' : '#ffffff',
                        border: `1px solid ${!filters.priority ? '#0c3e78' : 'var(--border)'}`,
                        color: !filters.priority ? '#ffffff' : 'var(--text-secondary)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        transition: 'all 0.15s ease',
                    }}
                >
                    All
                </button>
                {TASK_PRIORITY.map(({ value, label }) => {
                    const isSelected = filters.priority === value;
                    const config = PRIORITY_COLORS[value as TaskPriority];
                    return (
                        <button
                            key={value}
                            id={`filter-priority-${value.toLowerCase()}`}
                            onClick={() => handlePriority(isSelected ? undefined : (value as TaskPriority))}
                            style={{
                                padding: '5px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                background: isSelected ? config.bg : '#ffffff',
                                border: `1px solid ${isSelected ? config.border : 'var(--border)'}`,
                                color: isSelected ? config.color : 'var(--text-secondary)',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
