'use client';

// components/projects/project-board-page.tsx
// Responsive project board page with sleek AppNavbar and breadcrumbs.

import { KanbanBoard } from '@/components/kanban/kanban-board';
import { AppNavbar } from '@/components/layout/app-navbar';
import { AuthGuard } from '@/components/auth/auth-guard';

interface ProjectBoardPageProps {
    projectId: string;
}

export function ProjectBoardPage({ projectId }: ProjectBoardPageProps) {
    return (
        <AuthGuard>
        <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
            {/* Sleek App Navigation */}
            <AppNavbar
                breadcrumbs={[
                    { label: 'Projects', href: '/projects' },
                    { label: 'Board' },
                ]}
            />

            {/* Main Board View */}
            <main className="page-container" style={{ flex: 1, padding: 'var(--section-gap) var(--page-padding)', display: 'flex', flexDirection: 'column' }}>
                <KanbanBoard projectId={projectId} projectTitle="Project Board" />
            </main>
        </div>
        </AuthGuard>
    );
}
