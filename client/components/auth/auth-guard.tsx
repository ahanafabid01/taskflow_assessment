'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const hasSession = Boolean(user && token);

  useEffect(() => {
    if (!isLoading && !hasSession) {
      router.replace('/login');
    }
  }, [hasSession, isLoading, router]);

  if (isLoading || !hasSession) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--bg-primary)' }} aria-busy="true" />
    );
  }

  return <>{children}</>;
}
