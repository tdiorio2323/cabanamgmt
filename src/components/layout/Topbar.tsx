"use client"

import { Search, Bell, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabaseBrowser"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TopbarProps {
  breadcrumbs?: string[]
}

export function Topbar({ breadcrumbs = [] }: TopbarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const supabase = supabaseBrowser()
      const { error } = await supabase.auth.signOut()

      if (error) {
        toast.error(`Logout failed: ${error.message}`)
      } else {
        toast.success("Successfully logged out")
        router.push("/login")
        router.refresh()
      }
    } catch {
      toast.error("Failed to logout")
    }
  }
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-xl px-6">
      <div className="flex items-center gap-2 text-sm text-white/60">
        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            <span className={i === breadcrumbs.length - 1 ? "text-white" : ""}>{crumb}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input type="text" placeholder="Search..." className="frosted-input w-64 pl-10" />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-white/60 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-400" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white" aria-label="User menu">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-xl border-white/10">
            <DropdownMenuLabel className="text-white/90">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-white/70 focus:bg-white/10 focus:text-white">Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-white/70 focus:bg-white/10 focus:text-white">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Topbar
