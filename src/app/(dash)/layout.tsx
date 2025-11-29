'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { Shell } from '@/components/layout/Shell';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';
import { logger } from '@/lib/logger';

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const isMockAuth = process.env.NEXT_PUBLIC_E2E_AUTH_MODE === 'mock';
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isMockAuth || isDemo) {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    let mounted = true;
    let cleanup: (() => void) | undefined;

    async function checkAuth() {
      try {
        const s = supabaseBrowser();

        // Set up auth state listener
        const {
          data: { subscription },
        } = s.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;

          logger.log('Auth state change:', event, !!session);

          if (event === 'SIGNED_OUT' || !session) {
            setAuthorized(false);
            setLoading(false);
            router.push('/login');
          } else if (event === 'SIGNED_IN' || session) {
            setAuthorized(true);
            setLoading(false);
          }
        });

        cleanup = () => {
          subscription.unsubscribe();
        };

        // Check current session with a small delay to ensure it's loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        const { data: { session }, error } = await s.auth.getSession();

        if (!mounted) return;

        logger.log('Current session check:', !!session, error?.message);

        if (error) {
          logger.error('Auth session error:', error);
          setLoading(false);
          return;
        }

        if (session) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.push('/login');
        }

        setLoading(false);

      } catch (error) {
        logger.error('Auth check failed:', error);
        if (mounted) {
          setLoading(false);
          setAuthorized(false);
          router.push('/login');
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, [router, isMockAuth]);

  if (isMockAuth) {
    return (
      <ErrorBoundary>
        <Shell>{children}</Shell>
      </ErrorBoundary>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Shell>{children}</Shell>
    </ErrorBoundary>
  );
}
