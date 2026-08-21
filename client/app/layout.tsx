// app/layout.tsx
// Root layout — Server Component that wraps all pages with providers.

import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/lib/auth/auth-context';

export const metadata: Metadata = {
  title: 'TaskFlow - Kanban Project Management',
  description:
    'A high-performance Kanban and project management dashboard. Organize tasks, collaborate with your team, and ship faster.',
  keywords: ['kanban', 'project management', 'task management', 'productivity'],
  icons: {
    icon: '/brand/icon.svg',
    apple: '/brand/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
