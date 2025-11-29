import type React from "react"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

interface ShellProps {
  children: React.ReactNode
  breadcrumbs?: string[]
}

export function Shell({ children, breadcrumbs }: ShellProps) {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-72">
        {isDemo && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2.5 px-4 text-sm font-medium shadow-md">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Demo Mode – View Only | All data is simulated | No external services active</span>
            </div>
          </div>
        )}
        <Topbar breadcrumbs={breadcrumbs} />
        <main className="mx-auto max-w-7xl p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
