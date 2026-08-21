'use client';

// components/projects/project-list.tsx
// Responsive projects overview page with brand logo, professional Lucide icons, and Card/Table view switcher.

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
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                minHeight: '160px',
                textAlign: 'left',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-card)',
                transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-purple)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(124, 106, 247, 0.15)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
            }}
        >
            <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, var(--accent-purple-dim), rgba(79, 126, 247, 0.15))',
                            border: '1px solid var(--accent-purple-dim)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-purple)',
                            flexShrink: 0,
                        }}
                    >
                        <Folder size={20} />
                    </div>
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '12px',
                            fontWeight: 500,
                            color: 'var(--text-secondary)',
                            background: 'var(--bg-elevated)',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            border: '1px solid var(--border-subtle)',
                        }}
                    >
                        <CheckSquare size={12} />
                        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                    </span>
                </div>

                <h3
                    style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '6px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {project.title}
                </h3>
                {project.description && (
                    <p
                        style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.4,
                            marginBottom: '12px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {project.description}
                    </p>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <div
                    style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'white',
                        flexShrink: 0,
                    }}
                >
                    {project.owner.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {project.owner.name}
                </span>
            </div>
        </button>
    );
}

function ProjectTableView({ projects, onSelect }: { projects: Project[]; onSelect: (id: string) => void }) {
    return (
        <div
            style={{
                width: '100%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
            }}
        >
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Project
                            </th>
                            <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Description
                            </th>
                            <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Tasks
                            </th>
                            <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Owner
                            </th>
                            <th style={{ padding: '14px 18px', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Created
                            </th>
                            <th style={{ padding: '14px 18px', textAlign: 'right', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Action
                            </th>
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
                                    style={{
                                        borderBottom: idx < projects.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                        cursor: 'pointer',
                                        transition: 'background 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <td style={{ padding: '14px 18px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '8px',
                                                    background: 'linear-gradient(135deg, var(--accent-purple-dim), rgba(79, 126, 247, 0.15))',
                                                    border: '1px solid var(--accent-purple-dim)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--accent-purple)',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Folder size={16} />
                                            </div>
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                                                {project.title}
                                            </span>
                                        </div>
                                    </td>

                                    <td style={{ padding: '14px 18px', maxWidth: '240px' }}>
                                        <span
                                            style={{
                                                fontSize: '13px',
                                                color: 'var(--text-secondary)',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                            title={project.description ?? ''}
                                        >
                                            {project.description || '—'}
                                        </span>
                                    </td>

                                    <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                color: 'var(--text-secondary)',
                                                background: 'var(--bg-elevated)',
                                                padding: '2px 8px',
                                                borderRadius: '20px',
                                                border: '1px solid var(--border-subtle)',
                                            }}
                                        >
                                            <CheckSquare size={12} />
                                            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                                        </span>
                                    </td>

                                    <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div
                                                style={{
                                                    width: '22px',
                                                    height: '22px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '10px',
                                                    fontWeight: 700,
                                                    color: 'white',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {project.owner.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                                {project.owner.name}
                                            </span>
                                        </div>
                                    </td>

                                    <td style={{ padding: '14px 18px', fontSize: '12.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                        {createdDate}
                                    </td>

                                    <td style={{ padding: '14px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                color: 'var(--accent-purple)',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                background: 'rgba(124, 106, 247, 0.1)',
                                            }}
                                        >
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

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content animate-modal">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FolderPlus size={20} style={{ color: 'var(--accent-purple)' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Create New Project</h2>
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
                    <div style={{ background: 'rgba(240, 80, 96, 0.1)', border: '1px solid rgba(240, 80, 96, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: 'var(--accent-red)', fontSize: '14px' }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Project name *
                        </label>
                        <input
                            id="new-project-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Mobile App Redesign"
                            autoFocus
                            style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-purple)')}
                            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                        />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Description <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
                        </label>
                        <textarea
                            id="new-project-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Project goals, scope, criteria..."
                            rows={3}
                            style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-purple)')}
                            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 18px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button id="create-project-submit" type="submit" disabled={isPending} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: 600, cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1 }}>
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

    const { data, isLoading, error } = useProjects({
        page,
        limit: 12,
    });
    const projects = data?.projects ?? [];
    const pagination = data?.pagination;


    if (isLoading) {
        return (
            <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>Loading projects…</div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100dvh', background: 'radial-gradient(ellipse at top, rgba(124, 106, 247, 0.05) 0%, var(--bg-primary) 50%)', width: '100%', overflowX: 'hidden' }}>
            {/* Navigation */}
            <AppNavbar />

            <main className="page-container" style={{ padding: 'var(--section-gap) var(--page-padding)' }}>
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, marginBottom: '4px' }}>Projects</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                            {pagination?.total ?? 0} {(pagination?.total ?? 0) === 1 ? 'project' : 'projects'} total
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        {/* View Switcher: Cards vs Table */}
                        <div
                            role="group"
                            aria-label="Projects view mode"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)',
                                borderRadius: '10px',
                                padding: '3px',
                                gap: '3px',
                            }}
                        >
                            <button
                                type="button"
                                id="view-mode-grid"
                                onClick={() => setViewMode('grid')}
                                title="Card Grid View"
                                aria-pressed={viewMode === 'grid'}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '7px 12px',
                                    borderRadius: '7px',
                                    border: 'none',
                                    background: viewMode === 'grid' ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))' : 'transparent',
                                    color: viewMode === 'grid' ? '#ffffff' : 'var(--text-secondary)',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
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
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '7px 12px',
                                    borderRadius: '7px',
                                    border: 'none',
                                    background: viewMode === 'table' ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))' : 'transparent',
                                    color: viewMode === 'table' ? '#ffffff' : 'var(--text-secondary)',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                <Table size={15} />
                                <span>Table</span>
                            </button>
                        </div>

                        {/* New Project Button */}
                        <button
                            id="open-create-project"
                            onClick={() => setShowModal(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '10px 18px',
                                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                                border: 'none',
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            <Plus size={16} /> New Project
                        </button>
                    </div>
                </div>

                {error && (
                    <div style={{ background: 'rgba(240, 80, 96, 0.1)', border: '1px solid rgba(240, 80, 96, 0.3)', borderRadius: '10px', padding: '16px', marginBottom: '24px', color: 'var(--accent-red)' }}>
                        Failed to load projects. Please refresh.
                    </div>
                )}

                {!projects.length ? (
                    <div style={{ textAlign: 'center', padding: '60px 16px', background: 'var(--bg-card)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--text-muted)' }}>
                            <Layers size={48} />
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px' }}>No projects yet</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>Create your first project to get started</p>
                        <button
                            onClick={() => setShowModal(true)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '11px 22px',
                                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                                border: 'none',
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
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

                {pagination && pagination.totalPages > 1 && (
                    <nav aria-label="Project pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
                        <button
                            type="button"
                            onClick={() => setPage((current) => Math.max(1, current - 1))}
                            disabled={pagination.page === 1}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '9px 13px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer', opacity: pagination.page === 1 ? 0.5 : 1 }}
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
                            disabled={pagination.page === pagination.totalPages}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '9px 13px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.page === pagination.totalPages ? 0.5 : 1 }}
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
