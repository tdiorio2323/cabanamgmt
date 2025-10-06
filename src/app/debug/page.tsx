"use client";

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { SupabaseClient, Session } from '@supabase/supabase-js';

export default function AuthDebugPage() {
  const [debug, setDebug] = useState({
    envVars: {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
    supabaseClient: null as SupabaseClient | null,
    session: null as Session | null,
    error: null as string | null,
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        console.log('Debug: Environment variables:', {
          url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        });

        const client = supabaseBrowser();
        console.log('Debug: Supabase client created:', !!client);

        setDebug(prev => ({ ...prev, supabaseClient: client }));

        const { data: { session }, error } = await client.auth.getSession();

        console.log('Debug: Session response:', { session: !!session, error });

        setDebug(prev => ({
          ...prev,
          session: session || null,
          error: error?.message || null,
        }));
      } catch (err: unknown) {
        console.error('Debug: Auth error:', err);
        setDebug(prev => ({ ...prev, error: err instanceof Error ? err.message : String(err) }));
      }
    }

    checkAuth();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔍 Auth Debug Information</h1>

      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold mb-2">Environment Variables</h2>
          <pre className="text-sm">
            {JSON.stringify(debug.envVars, null, 2)}
          </pre>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold mb-2">Supabase Client</h2>
          <p>Client Created: {debug.supabaseClient ? '✅' : '❌'}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold mb-2">Session Status</h2>
          <pre className="text-sm">
            {JSON.stringify({ session: debug.session, error: debug.error }, null, 2)}
          </pre>
        </div>

        {debug.error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
            <h2 className="font-semibold mb-2 text-red-800">Error</h2>
            <p className="text-red-700">{debug.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
