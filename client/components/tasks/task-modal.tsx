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
        return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
    }

    return (
        <div ref={containerRef} className="relative w-full">
            {selectedUser && !open ? (
                /* Selected Chip */
                <div
                    className="flex items-center justify-between px-3 py-2 bg-white border border-slate-300 rounded-lg cursor-pointer min-h-[44px] box-border"
                    onClick={handleOpen}
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand to-blue-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            {getInitials(selectedUser.name)}
                        </div>
                        <span className="text-[13.5px] text-slate-900 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                            {selectedUser.name}
                        </span>
                        {selectedUser.id === currentUserId && (
                            <span className="text-[10px] text-brand bg-brand/[0.08] px-1.5 py-px rounded-full font-semibold">
                                You
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                        className="bg-transparent border-none cursor-pointer text-slate-400 p-0.5 flex items-center justify-center hover:text-slate-600 transition-colors"
                        aria-label="Remove assignee"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                /* Search Input */
                <div className="relative w-full">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
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
                        className={`w-full py-2.5 px-3 pl-[34px] bg-white border rounded-lg text-slate-900 text-[13.5px] outline-none box-border min-h-[44px] transition-colors ${
                            open ? 'border-brand' : 'border-slate-300'
                        }`}
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
                    }}
                    className="max-h-[220px] overflow-y-auto bg-white border border-slate-200 rounded-[10px] shadow-[0_12px_30px_rgba(15,23,42,0.15)] z-[99999] m-0 p-1.5 list-none box-border"
                >
                    {/* Option 0: Unassigned */}
                    <li
                        onMouseDown={(e) => { e.preventDefault(); selectUnassigned(); }}
                        onMouseEnter={() => setHighlighted(0)}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] cursor-pointer transition-colors ${
                            highlighted === 0 ? 'bg-slate-100' : 'bg-transparent'
                        }`}
                    >
                        <div className="w-[26px] h-[26px] rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                            <UserIcon size={13} />
                        </div>
                        <span className="text-[13px] text-slate-600">Unassigned</span>
                        {!selectedId && <Check size={14} className="ml-auto text-brand" />}
                    </li>

                    {/* Filtered User List */}
                    {filtered.map((u, i) => {
                        const isItemHighlighted = highlighted === i + 1;
                        const isItemSelected = u.id === selectedId;

                        return (
                            <li
                                key={u.id}
                                onMouseDown={(e) => { e.preventDefault(); selectUser(u); }}
                                onMouseEnter={() => setHighlighted(i + 1)}
                                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] cursor-pointer transition-colors ${
                                    isItemHighlighted
                                        ? 'bg-slate-100'
                                        : isItemSelected
                                            ? 'bg-brand/[0.05]'
                                            : 'bg-transparent'
                                }`}
                            >
                                <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-brand to-blue-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                    {getInitials(u.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[13px] font-semibold text-slate-900 flex items-center gap-1.5">
                                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{u.name}</span>
                                        {u.id === currentUserId && (
                                            <span className="text-[10px] text-brand bg-brand/[0.08] px-1.5 py-px rounded-full font-semibold">
                                                You
                                            </span>
                                        )}
                                        {isItemSelected && <Check size={14} className="ml-auto text-brand" />}
                                    </div>
                                    <div className="text-[11px] text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">
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

    const todayStr = new Date().toISOString().split('T')[0];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required');
            return;
        }
        if (dueDate && dueDate < todayStr) {
            setError('Due date cannot be in the past');
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

    const inputCls = 'w-full px-3.5 py-[11px] bg-white border border-slate-300 rounded-lg text-slate-900 text-sm outline-none box-border focus:border-brand transition-colors';
    const selectCls = inputCls + ' cursor-pointer';

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content animate-modal">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        {task ? <Pencil size={18} className="text-brand" /> : <Plus size={18} className="text-brand" />}
                        <h2 className="text-[18px] font-bold text-slate-900">
                            {task ? 'Edit Task' : 'New Task'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="bg-transparent border-none text-slate-400 cursor-pointer p-1 flex items-center justify-center hover:text-slate-700 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-[13px] font-semibold text-slate-900 mb-1.5">
                            Title *
                        </label>
                        <input
                            id="task-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                            placeholder="e.g. Implement user authentication flow"
                            className={inputCls}
                        />
                    </div>

                    {/* Status & Priority */}
                    <div className="form-grid-2 mb-3.5">
                        <div>
                            <label className="block text-[13px] font-semibold text-slate-900 mb-1.5">
                                Status
                            </label>
                            <select
                                id="task-status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                className={selectCls}
                            >
                                {TASK_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold text-slate-900 mb-1.5">
                                Priority
                            </label>
                            <select
                                id="task-priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                className={selectCls}
                            >
                                {TASK_PRIORITY.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Assign To & Due Date */}
                    <div className="form-grid-2 mb-4">
                        <div>
                            <label className="block text-[13px] font-semibold text-slate-900 mb-1.5">
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
                            <label className="block text-[13px] font-semibold text-slate-900 mb-1.5">
                                Due date{' '}
                                <span className="text-slate-400 font-normal">(optional)</span>
                            </label>
                            <input
                                id="task-due-date"
                                type="date"
                                min={todayStr}
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                onClick={(e) => {
                                    try { e.currentTarget.showPicker?.(); } catch { }
                                }}
                                className={selectCls + ' min-h-[44px]'}
                                style={{ colorScheme: 'light' }}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-[22px]">
                        <label className="block text-[13px] font-semibold text-slate-900 mb-1.5">
                            Description{' '}
                            <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            id="task-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Details, subtasks, acceptance criteria..."
                            rows={3}
                            className={inputCls + ' resize-y font-[inherit]'}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2.5 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-[18px] py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium cursor-pointer hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            id="task-save"
                            type="submit"
                            disabled={isSaving}
                            className={`inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand border-none rounded-lg text-white text-sm font-semibold transition-opacity ${
                                isSaving ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-brand-hover'
                            }`}
                        >
                            {task ? <Pencil size={15} /> : <Plus size={15} />}
                            {isSaving ? 'Saving…' : task ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
