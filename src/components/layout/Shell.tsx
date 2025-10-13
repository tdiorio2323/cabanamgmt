import type React from "react"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

interface ShellProps {
  children: React.ReactNode
  breadcrumbs?: string[]
}

export function Shell({ children, breadcrumbs }: ShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-72">
        <Topbar breadcrumbs={breadcrumbs} />
        <main className="mx-auto max-w-7xl p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
