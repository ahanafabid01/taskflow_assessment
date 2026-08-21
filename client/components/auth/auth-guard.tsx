'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { FullPageLoader } from '@/components/ui/loading';

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
    return <FullPageLoader label="Loading" />;
  }

  return <>{children}</>;
}
