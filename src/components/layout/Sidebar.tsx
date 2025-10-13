"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Mail,
  Users,
  Calendar,
  UserCheck,
  ImageIcon,
  FileText,
  CreditCard,
  DollarSign,
  Receipt,
  Server,
  Settings,
  FileSearch,
  Activity,
  MessageSquare,
  Home,
  Briefcase,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Invite Codes", href: "/dashboard/invite", icon: Mail },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
  { name: "Vetting", href: "/dashboard/vetting", icon: UserCheck },
  { name: "Media", href: "/dashboard/media", icon: ImageIcon },
  { name: "Contracts", href: "/dashboard/contracts", icon: FileText },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Payouts", href: "/dashboard/payouts", icon: DollarSign },
  { name: "Invoices", href: "/dashboard/invoices", icon: Receipt },
  { name: "System", href: "/dashboard/system", icon: Server },
  { name: "Environment", href: "/dashboard/environment", icon: Settings },
  { name: "Audit", href: "/dashboard/audit", icon: FileSearch },
  { name: "Activity", href: "/dashboard/activity", icon: Activity },
  { name: "Support", href: "/dashboard/support", icon: MessageSquare },
  { name: "Rooms", href: "/dashboard/rooms", icon: Home },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: Briefcase },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 m-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-white/20 px-6">
          <h1 className="font-sans text-xl font-bold text-white tracking-tight">Cabana</h1>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all font-sans",
                  isActive
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30"
                    : "text-white/80 hover:bg-white/10 hover:text-white hover:border hover:border-white/20",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
