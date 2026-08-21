// app/page.tsx
// Root page — Server Component that redirects to login or projects.

import { redirect } from 'next/navigation';

export default function RootPage() {
  // The AuthGuard in client components handles redirection based on auth state.
  // Here we simply redirect to /login as the default entry point.
  redirect('/login');
}
