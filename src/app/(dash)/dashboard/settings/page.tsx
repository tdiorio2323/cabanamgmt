"use client";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import Link from "next/link";
import {
  Settings,
  Bell,
  Plug,
  Lock,
  Globe,
  Users,
  Database,
  ChevronRight,
  LogOut
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      router.push("/");
    }
  };

  const settingsCategories = [
    {
      title: "Organization",
      description: "Company information, branding, and general settings",
      icon: <Globe className="w-6 h-6" />,
      href: "/dashboard/settings/organization",
      color: "text-blue-400"
    },
    {
      title: "Roles & Permissions",
      description: "Manage user roles and permission matrix",
      icon: <Users className="w-6 h-6" />,
      href: "/dashboard/settings/roles",
      color: "text-green-400"
    },
    {
      title: "Notifications",
      description: "Email/SMS templates, triggers, and preferences",
      icon: <Bell className="w-6 h-6" />,
      href: "/dashboard/settings/notifications",
      color: "text-yellow-400"
    },
    {
      title: "Integrations",
      description: "Stripe, identity providers, DocuSign, webhooks",
      icon: <Plug className="w-6 h-6" />,
      href: "/dashboard/settings/integrations",
      color: "text-purple-400"
    },
    {
      title: "Security",
      description: "MFA policy, session limits, IP allowlist/denylist",
      icon: <Lock className="w-6 h-6" />,
      href: "/dashboard/settings/security",
      color: "text-red-400"
    },
    {
      title: "Environment",
      description: "API keys, feature flags, maintenance mode",
      icon: <Database className="w-6 h-6" />,
      href: "/dashboard/settings/environment",
      color: "text-indigo-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-white/60 mt-2">Manage your platform configuration and preferences</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-400">Operational</div>
              <div className="text-sm text-white/60">System Status</div>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-2xl font-bold">5</div>
          <div className="text-sm text-white/60">Active Integrations</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-2xl font-bold">3</div>
          <div className="text-sm text-white/60">Admin Users</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">Secure</div>
          <div className="text-sm text-white/60">Security Score</div>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCategories.map((category) => (
          <Link key={category.href} href={category.href}>
            <GlassCard>
              <div className="flex items-center justify-between p-2 hover:bg-white/5 transition-colors rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-white/10 ${category.color}`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                    <p className="text-sm text-white/60">{category.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60" />
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      {/* Account Actions */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Account Actions
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <button className="liquid-btn px-4 py-2 rounded-lg">
            Change Password
          </button>
          <button className="liquid-btn px-4 py-2 rounded-lg">
            Export Data
          </button>
        </div>
      </GlassCard>

      {/* System Information */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          System Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">Platform Version</span>
              <span className="font-medium">v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Environment</span>
              <span className="font-medium">Development</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Database</span>
              <span className="font-medium text-green-400">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Auth Provider</span>
              <span className="font-medium">Supabase</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">Storage</span>
              <span className="font-medium">2.1 GB used</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">API Requests</span>
              <span className="font-medium">1,247 today</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Uptime</span>
              <span className="font-medium text-green-400">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Last Backup</span>
              <span className="font-medium">2 hours ago</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
