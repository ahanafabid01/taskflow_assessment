'use client';

// components/projects/project-list.tsx
// Responsive projects overview page with brand logo, professional Lucide icons, and Card/Table view switcher (Light Theme).

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Folder, FolderPlus, Layers, X, CheckSquare, ChevronLeft, ChevronRight, LayoutGrid, Table } from 'lucide-react';
import { useProjects, useCreateProject } from '@/hooks/use-projects';
import { AppNavbar } from '@/components/layout/app-navbar';
import type { Project } from '@/types';

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
    const taskCount = project._count?.tasks ?? 0;

    return (
        <button
            onClick={onClick}
            className="flex flex-col justify-between w-full min-h-[160px] text-left bg-white border border-slate-200 rounded-[14px] p-5 cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all hover:border-brand hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(12,62,120,0.09)]"
        >
            <div>
                <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-[10px] bg-brand/[0.08] border border-brand/[0.15] flex items-center justify-center text-brand shrink-0">
                        <Folder size={20} />
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                        <CheckSquare size={12} />
                        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                    </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                    {project.title}
                </h3>
                {project.description && (
                    <p className="text-[13px] text-slate-600 leading-[1.45] mb-3 line-clamp-2">
                        {project.description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-brand to-blue-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {project.owner.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap">
                    {project.owner.name}
                </span>
            </div>
        </button>
    );
}

function ProjectTableView({ projects, onSelect }: { projects: Project[]; onSelect: (id: string) => void }) {
    return (
        <div className="w-full bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                <table className="w-full border-collapse text-left min-w-[600px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {['Project', 'Description', 'Tasks', 'Owner', 'Created', 'Action'].map((h, i) => (
                                <th
                                    key={h}
                                    className={`px-[18px] py-3.5 text-[11.5px] font-bold text-slate-600 uppercase tracking-[0.05em] ${i === 5 ? 'text-right' : ''}`}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project, idx) => {
                            const taskCount = project._count?.tasks ?? 0;
                            const createdDate = project.createdAt
                                ? new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : '—';

                            return (
                                <tr
                                    key={project.id}
                                    onClick={() => onSelect(project.id)}
                                    className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                                        idx < projects.length - 1 ? 'border-b border-slate-100' : ''
                                    }`}
                                >
                                    {/* Project Name */}
                                    <td className="px-[18px] py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-brand/[0.08] border border-brand/[0.15] flex items-center justify-center text-brand shrink-0">
                                                <Folder size={16} />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                                                {project.title}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Description */}
                                    <td className="px-[18px] py-3.5 max-w-[240px]">
                                        <span
                                            className="text-[13px] text-slate-600 line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap block"
                                            title={project.description ?? ''}
                                        >
                                            {project.description || '—'}
                                        </span>
                                    </td>

                                    {/* Task Count */}
                                    <td className="px-[18px] py-3.5 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                            <CheckSquare size={12} />
                                            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                                        </span>
                                    </td>

                                    {/* Owner */}
                                    <td className="px-[18px] py-3.5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-brand to-blue-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                                {project.owner.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-[13px] text-slate-600">
                                                {project.owner.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Created Date */}
                                    <td className="px-[18px] py-3.5 text-[12.5px] text-slate-400 whitespace-nowrap">
                                        {createdDate}
                                    </td>

                                    {/* Action */}
                                    <td className="px-[18px] py-3.5 text-right whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand px-2 py-1 rounded-md bg-brand/[0.08]">
                                            Open Board <ChevronRight size={13} />
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function CreateProjectModal({ onClose }: { onClose: () => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const { mutate, isPending } = useCreateProject();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) {
            setError('Project name is required');
            return;
        }
        setError('');
        mutate(
            { title: title.trim(), description: description.trim() || undefined },
            {
                onSuccess: onClose,
                onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create project'),
            },
        );
    }

    const inputCls = 'w-full px-3.5 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm outline-none box-border focus:border-brand transition-colors';

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content animate-modal">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <FolderPlus size={20} className="text-brand" />
                        <h2 className="text-[18px] font-bold text-slate-900">Create New Project</h2>
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
                    <div className="mb-4">
                        <label className="block text-[13px] font-semibold text-slate-900 mb-2">
                            Project name *
                        </label>
                        <input
                            id="new-project-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Mobile App Redesign"
                            autoFocus
                            className={inputCls}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-[13px] font-semibold text-slate-900 mb-2">
                            Description{' '}
                            <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            id="new-project-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Project goals, scope, criteria..."
                            rows={3}
                            className={inputCls + ' resize-y font-[inherit]'}
                        />
                    </div>
                    <div className="flex gap-2.5 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-[18px] py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium cursor-pointer hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            id="create-project-submit"
                            type="submit"
                            disabled={isPending}
                            className={`inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand border-none rounded-lg text-white text-sm font-semibold transition-opacity ${
                                isPending ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-brand-hover'
                            }`}
                        >
                            <Plus size={16} />
                            {isPending ? 'Creating…' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function ProjectList() {
    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [page, setPage] = useState(1);
    const router = useRouter();

    const { data, isLoading, error } = useProjects({ page, limit: 12 });
    const projects = data?.projects ?? [];
    const pagination = data?.pagination;

    if (isLoading) {
        return (
            <div className="min-h-dvh flex items-center justify-center">
                <div className="text-slate-600 text-[15px]">Loading projects…</div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-slate-50 w-full overflow-x-hidden">
            {/* Navigation */}
            <AppNavbar />

            <main className="page-container" style={{ padding: 'var(--section-gap) var(--page-padding)' }}>
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="text-[clamp(22px,4vw,30px)] font-extrabold text-slate-900 mb-1 tracking-[-0.025em]">
                            Projects
                        </h1>
                        <p className="text-slate-600 text-sm">
                            {pagination?.total ?? 0} {(pagination?.total ?? 0) === 1 ? 'project' : 'projects'} total
                        </p>
                    </div>

                    <div className="page-header-actions">
                        {/* View Switcher */}
                        <div
                            role="group"
                            aria-label="Projects view mode"
                            className="flex items-center bg-white border border-slate-200 rounded-[10px] p-[3px] gap-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                        >
                            <button
                                type="button"
                                id="view-mode-grid"
                                onClick={() => setViewMode('grid')}
                                title="Card Grid View"
                                aria-pressed={viewMode === 'grid'}
                                className={`flex items-center gap-1.5 px-3 py-[7px] rounded-[7px] border-none text-[13px] font-semibold cursor-pointer transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-brand text-white'
                                        : 'bg-transparent text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <LayoutGrid size={15} />
                                <span>Cards</span>
                            </button>
                            <button
                                type="button"
                                id="view-mode-table"
                                onClick={() => setViewMode('table')}
                                title="Table View"
                                aria-pressed={viewMode === 'table'}
                                className={`flex items-center gap-1.5 px-3 py-[7px] rounded-[7px] border-none text-[13px] font-semibold cursor-pointer transition-all ${
                                    viewMode === 'table'
                                        ? 'bg-brand text-white'
                                        : 'bg-transparent text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <Table size={15} />
                                <span>Table</span>
                            </button>
                        </div>

                        {/* New Project Button */}
                        <button
                            id="open-create-project"
                            onClick={() => setShowModal(true)}
                            className="flex items-center justify-center gap-2 px-[18px] py-2.5 bg-brand border-none rounded-[10px] text-white text-sm font-semibold cursor-pointer shadow-[0_1px_3px_rgba(12,62,120,0.2)] shrink-0 ml-auto hover:bg-brand-hover transition-colors"
                        >
                            <Plus size={16} /> New Project
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 mb-6 text-red-600">
                        Failed to load projects. Please refresh.
                    </div>
                )}

                {!projects.length ? (
                    <div className="text-center py-[60px] px-4 bg-white border border-dashed border-slate-200 rounded-[14px]">
                        <div className="flex justify-center mb-3 text-slate-400">
                            <Layers size={48} />
                        </div>
                        <h3 className="text-[18px] font-semibold text-slate-900 mb-1.5">No projects yet</h3>
                        <p className="text-slate-600 text-sm mb-5">Create your first project to get started</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 px-[22px] py-[11px] bg-brand border-none rounded-[10px] text-white text-sm font-semibold cursor-pointer hover:bg-brand-hover transition-colors"
                        >
                            <Plus size={16} /> Create Project
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="projects-grid">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => router.push(`/projects/${project.id}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <ProjectTableView
                        projects={projects}
                        onSelect={(id) => router.push(`/projects/${id}`)}
                    />
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <nav aria-label="Project pagination" className="flex items-center justify-center gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => setPage((current) => Math.max(1, current - 1))}
                            disabled={pagination.page === 1}
                            className={`inline-flex items-center gap-1.5 px-[13px] py-[9px] bg-white border border-slate-200 rounded-lg text-slate-600 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all ${
                                pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'
                            }`}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>
                        <span className="text-slate-600 text-[13px]">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
                            disabled={pagination.page === pagination.totalPages}
                            className={`inline-flex items-center gap-1.5 px-[13px] py-[9px] bg-white border border-slate-200 rounded-lg text-slate-600 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all ${
                                pagination.page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'
                            }`}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </nav>
                )}
            </main>

            {showModal && <CreateProjectModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
