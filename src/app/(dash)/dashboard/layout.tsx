'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const s = supabaseBrowser();

        // Set up auth state listener
        const { data: { subscription } } = s.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;

          console.log('Auth state change:', event, !!session);

          if (event === 'SIGNED_OUT' || !session) {
            setAuthorized(false);
            setLoading(false);
            router.push('/login');
          } else if (event === 'SIGNED_IN' || session) {
            setAuthorized(true);
            setLoading(false);
          }
        });

        // Check current session with a small delay to ensure it's loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        const { data: { session }, error } = await s.auth.getSession();

        if (!mounted) return;

        console.log('Current session check:', !!session, error?.message);

        if (error) {
          console.error('Auth session error:', error);
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

        // Cleanup function
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth check failed:', error);
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
    };
  }, [router]);

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

  return <>{children}</>;
}
