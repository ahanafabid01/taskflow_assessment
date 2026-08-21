// app/projects/[id]/page.tsx

import type { Metadata } from 'next';
import { ProjectBoardPage } from '@/components/projects/project-board-page';

export const metadata: Metadata = {
  title: 'Project Board - TaskFlow',
  description: 'Manage tasks on your Kanban board',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  return <ProjectBoardPage projectId={id} />;
}
