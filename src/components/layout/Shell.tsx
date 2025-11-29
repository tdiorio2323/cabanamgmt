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
          <div className="bg-orange-600 text-white text-center py-2 px-4 text-sm font-medium">
            Demo Mode – View Only. All data is fake.
          </div>
        )}
        <Topbar breadcrumbs={breadcrumbs} />
        <main className="mx-auto max-w-7xl p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
