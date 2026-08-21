'use client';

// components/tasks/task-modal.tsx
// Centered modal for creating and editing tasks with searchable Assignee combobox (Light Theme).

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Check, User as UserIcon, Plus, Pencil, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useUsers } from '@/hooks/use-users';
import type { Task, TaskStatus, TaskPriority, CreateTaskInput, UpdateTaskInput, User } from '@/types';
import { TASK_STATUS, TASK_PRIORITY } from '@/types';

interface TaskModalProps {
    task?: Task | null;
    defaultStatus?: TaskStatus;
    projectId: string;
    onSave: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
    onClose: () => void;
}

// ─── Assignee Combobox ────────────────────────────────────────────────────────

interface AssigneeComboboxProps {
    users: User[];
    isLoading?: boolean;
    selectedId: string;
    currentUserId?: string;
    onChange: (id: string) => void;
}

function AssigneeCombobox({ users, isLoading, selectedId, currentUserId, onChange }: AssigneeComboboxProps) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 0 });

    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    const selectedUser = users.find((u) => u.id === selectedId) ?? null;

    // Filtered results
    const filtered = query.trim()
        ? users.filter((u) =>
            (u.name || '').toLowerCase().includes(query.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(query.toLowerCase())
        )
        : users;

    const updatePosition = useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownCoords({
                top: rect.bottom + 6,
                left: rect.left,
                width: Math.max(rect.width, 240),
            });
        }
    }, []);

    function handleOpen() {
        updatePosition();
        setOpen(true);
    }

    function selectUser(u: User) {
        onChange(u.id);
        setQuery('');
        setOpen(false);
    }

    function selectUnassigned() {
        onChange('');
        setQuery('');
        setOpen(false);
    }

    function clearSelection() {
        onChange('');
        setQuery('');
        setOpen(true);
        setTimeout(() => {
            updatePosition();
            inputRef.current?.focus();
        }, 0);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setQuery(e.target.value);
        setHighlighted(0);
        if (!open) {
            handleOpen();
        } else {
            updatePosition();
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
            handleOpen();
            return;
        }
        if (!open) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlighted((h) => Math.min(h + 1, filtered.length));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlighted((h) => Math.max(h - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlighted === 0) {
                selectUnassigned();
            } else if (filtered[highlighted - 1]) {
                selectUser(filtered[highlighted - 1]);
            }
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    }

    // Close on outside click
    useEffect(() => {
        function handleOutsideClick(e: MouseEvent) {
            const target = e.target as Node;
            if (
                containerRef.current && !containerRef.current.contains(target) &&
                listRef.current && !listRef.current.contains(target)
            ) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleOutsideClick);
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [open, updatePosition]);

    function getInitials(name: string) {
        return name
            .split(' ')
            .map((p) => p[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            {selectedUser && !open ? (
                /* Selected Chip */
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        minHeight: '44px',
                        boxSizing: 'border-box',
                    }}
                    onClick={handleOpen}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <div
                            style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0c3e78, #1e40af)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 700,
                                color: '#ffffff',
                                flexShrink: 0,
                            }}
                        >
                            {getInitials(selectedUser.name)}
                        </div>
                        <span style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedUser.name}
                        </span>
                        {selectedUser.id === currentUserId && (
                            <span
                                style={{
                                    fontSize: '10px',
                                    color: '#0c3e78',
                                    background: 'rgba(12, 62, 120, 0.08)',
                                    padding: '1px 6px',
                                    borderRadius: '20px',
                                    fontWeight: 600,
                                }}
                            >
                                You
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            clearSelection();
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        aria-label="Remove assignee"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                /* Search Input */
                <div style={{ position: 'relative', width: '100%' }}>
                    <Search
                        size={14}
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
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={handleOpen}
                        onKeyDown={handleKeyDown}
                        placeholder={isLoading ? 'Loading members…' : 'Search members…'}
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '10px 12px 10px 34px',
                            background: '#ffffff',
                            border: `1px solid ${open ? '#0c3e78' : '#cbd5e1'}`,
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            fontSize: '13.5px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            minHeight: '44px',
                        }}
                    />
                </div>
            )}

            {/* Portal Dropdown */}
            {open && mounted && createPortal(
                <ul
                    ref={listRef}
                    style={{
                        position: 'fixed',
                        top: dropdownCoords.top,
                        left: dropdownCoords.left,
                        width: dropdownCoords.width,
                        maxHeight: '220px',
                        overflowY: 'auto',
                        background: '#ffffff',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.15)',
                        zIndex: 99999,
                        margin: 0,
                        padding: '6px',
                        listStyle: 'none',
                        boxSizing: 'border-box',
                    }}
                >
                    {/* Option 0: Unassigned */}
                    <li
                        onMouseDown={(e) => {
                            e.preventDefault();
                            selectUnassigned();
                        }}
                        onMouseEnter={() => setHighlighted(0)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '7px',
                            cursor: 'pointer',
                            background: highlighted === 0 ? '#f1f5f9' : 'transparent',
                            transition: 'background 0.1s ease',
                        }}
                    >
                        <div
                            style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: '#f1f5f9',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-muted)',
                                flexShrink: 0,
                            }}
                        >
                            <UserIcon size={13} />
                        </div>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Unassigned</span>
                        {!selectedId && <Check size={14} style={{ marginLeft: 'auto', color: '#0c3e78' }} />}
                    </li>

                    {/* Filtered User List */}
                    {filtered.map((u, i) => {
                        const isItemHighlighted = highlighted === i + 1;
                        const isItemSelected = u.id === selectedId;

                        return (
                            <li
                                key={u.id}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    selectUser(u);
                                }}
                                onMouseEnter={() => setHighlighted(i + 1)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px 10px',
                                    borderRadius: '7px',
                                    cursor: 'pointer',
                                    background: isItemHighlighted
                                        ? '#f1f5f9'
                                        : isItemSelected
                                            ? 'rgba(12, 62, 120, 0.05)'
                                            : 'transparent',
                                    transition: 'background 0.1s ease',
                                }}
                            >
                                {/* Avatar */}
                                <div
                                    style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #0c3e78, #1e40af)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        color: '#ffffff',
                                        flexShrink: 0,
                                    }}
                                >
                                    {getInitials(u.name)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: 'var(--text-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                        }}
                                    >
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {u.name}
                                        </span>
                                        {u.id === currentUserId && (
                                            <span
                                                style={{
                                                    fontSize: '10px',
                                                    color: '#0c3e78',
                                                    background: 'rgba(12, 62, 120, 0.08)',
                                                    padding: '1px 6px',
                                                    borderRadius: '20px',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                You
                                            </span>
                                        )}
                                        {isItemSelected && (
                                            <Check size={14} style={{ marginLeft: 'auto', color: '#0c3e78' }} />
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            color: 'var(--text-muted)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {u.email}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>,
                document.body
            )}
        </div>
    );
}

// ─── Task Modal ───────────────────────────────────────────────────────────────

export function TaskModal({ task, defaultStatus = 'TODO', onSave, onClose }: TaskModalProps) {
    const { user } = useAuth();
    const { data: users = [], isLoading: usersLoading } = useUsers();
    const [title, setTitle] = useState(task?.title ?? '');
    const [description, setDescription] = useState(task?.description ?? '');
    const [status, setStatus] = useState<TaskStatus>(task?.status ?? defaultStatus);
    const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'MEDIUM');
    const [assignedTo, setAssignedTo] = useState<string>(task?.assignedTo ?? '');
    const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        setError('');
        setIsSaving(true);
        try {
            const data = {
                title: title.trim(),
                description: description.trim() || undefined,
                status,
                priority,
                assigned_to: assignedTo ? assignedTo : null,
                due_date: dueDate ? new Date(dueDate).toISOString() : null,
            };
            await onSave(data);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save task');
        } finally {
            setIsSaving(false);
        }
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '11px 13px',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        color: 'var(--text-primary)',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    };

    const selectStyle: React.CSSProperties = {
        ...inputStyle,
        cursor: 'pointer',
    };

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content animate-modal">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {task ? <Pencil size={18} style={{ color: '#0c3e78' }} /> : <Plus size={18} style={{ color: '#0c3e78' }} />}
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {task ? 'Edit Task' : 'New Task'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: 'var(--accent-red)', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            Title *
                        </label>
                        <input
                            id="task-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                            placeholder="e.g. Implement user authentication flow"
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = '#0c3e78')}
                            onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                        />
                    </div>

                    {/* Metadata Section: Status & Priority */}
                    <div className="form-grid-2" style={{ marginBottom: '14px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                                Status
                            </label>
                            <select id="task-status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} style={selectStyle}>
                                {TASK_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                                Priority
                            </label>
                            <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} style={selectStyle}>
                                {TASK_PRIORITY.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Metadata Section: Assign To & Due date */}
                    <div className="form-grid-2" style={{ marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                                Assign To
                            </label>
                            <AssigneeCombobox
                                users={users}
                                isLoading={usersLoading}
                                selectedId={assignedTo}
                                currentUserId={user?.id}
                                onChange={setAssignedTo}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                                Due date <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                            </label>
                            <input
                                id="task-due-date"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                onClick={(e) => {
                                    try {
                                        e.currentTarget.showPicker?.();
                                    } catch { }
                                }}
                                style={{
                                    ...selectStyle,
                                    minHeight: '44px',
                                    colorScheme: 'light',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '22px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <textarea
                            id="task-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Details, subtasks, acceptance criteria..."
                            rows={3}
                            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                            onFocus={(e) => (e.target.style.borderColor = '#0c3e78')}
                            onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 18px', background: '#f1f5f9', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button id="task-save" type="submit" disabled={isSaving} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#0c3e78', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1 }}>
                            {task ? <Pencil size={15} /> : <Plus size={15} />}
                            {isSaving ? 'Saving…' : task ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
