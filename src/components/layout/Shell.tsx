'use client';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { isDemoClient } from '@/lib/isDemo';
import { AlertCircle } from 'lucide-react';

export function Shell({ children }: { children: React.ReactNode }) {
  const isDemo = isDemoClient();

  return (
    <div className="relative min-h-screen">
      <Sidebar />

      <div className="ml-72">
        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="sticky top-0 z-50 border-b border-amber-500/30 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-xl">
            <div className="flex items-center justify-center gap-3 px-6 py-3">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <p className="text-sm font-medium text-amber-100">
                <span className="font-semibold">Demo Mode</span> – View Only. All data is simulated. No external services are used.
              </p>
            </div>
          </div>
        )}

        <Topbar />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
