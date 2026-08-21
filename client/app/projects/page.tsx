// app/projects/page.tsx

import type { Metadata } from 'next';
import { ProjectList } from '@/components/projects/project-list';
import { AuthGuard } from '@/components/auth/auth-guard';

export const metadata: Metadata = {
  title: 'Projects - TaskFlow',
  description: 'Manage your TaskFlow projects',
};

export default function ProjectsPage() {
  return <AuthGuard><ProjectList /></AuthGuard>;
}
