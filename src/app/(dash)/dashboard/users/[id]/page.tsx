import { supabaseAdmin } from "@/lib/supabaseAdmin";
import GlassCard from "@/components/ui/GlassCard";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Calendar, Shield, Users, Star, Activity, Settings, Ban } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function UserDetailPage({ params }: Props) {
  const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(params.id);

  if (error || !user.user) {
    notFound();
  }

  const { data: adminEmails } = await supabaseAdmin
    .from('admin_emails')
    .select('email');

  const adminEmailSet = new Set(adminEmails?.map(a => a.email) || []);
  const isAdmin = adminEmailSet.has(user.user.email!);
  const role = isAdmin ? 'admin' :
    user.user.email?.includes('client') ? 'client' : 'creator';

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-5 h-5 text-red-400" />;
      case 'client': return <Star className="w-5 h-5 text-blue-400" />;
      default: return <Users className="w-5 h-5 text-green-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-400/10';
      case 'client': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-green-400 bg-green-400/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/users" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            User Details
          </h1>
          <p className="text-white/60 mt-2">Manage user profile and permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Overview */}
          <GlassCard>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-xl font-bold">
                  {user.user.email?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.user.email}</h2>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium mt-2 ${getRoleColor(role)}`}>
                    {getRoleIcon(role)}
                    {role}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="liquid-btn px-3 py-2 rounded-lg flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Edit
                </button>
                <button className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-2">
                  <Ban className="w-4 h-4" />
                  Suspend
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-white/60 block mb-1">Email Address</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-white/60" />
                  <span className="font-medium">{user.user.email}</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 block mb-1">User ID</label>
                <div className="font-mono text-sm bg-white/5 px-2 py-1 rounded">
                  {user.user.id}
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 block mb-1">Account Created</label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/60" />
                  <span>{new Date(user.user.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 block mb-1">Email Confirmed</label>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.user.confirmed_at ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span>{user.user.confirmed_at ? 'Yes' : 'Pending'}</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 block mb-1">Last Sign In</label>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-white/60" />
                  <span>{user.user.last_sign_in_at ? new Date(user.user.last_sign_in_at).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 block mb-1">Phone</label>
                <div className="text-white/60">
                  {user.user.phone || 'Not provided'}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Activity Log */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Account created</div>
                  <div className="text-xs text-white/60">{new Date(user.user.created_at).toLocaleString()}</div>
                </div>
              </div>

              {user.user.confirmed_at && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Email confirmed</div>
                    <div className="text-xs text-white/60">{new Date(user.user.confirmed_at).toLocaleString()}</div>
                  </div>
                </div>
              )}

              {user.user.last_sign_in_at && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Last sign in</div>
                    <div className="text-xs text-white/60">{new Date(user.user.last_sign_in_at).toLocaleString()}</div>
                  </div>
                </div>
              )}

              <div className="text-center py-4 text-white/60 text-sm">
                Full activity log coming soon
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full liquid-btn px-4 py-2 rounded-lg text-left">
                Reset Password
              </button>
              <button className="w-full liquid-btn px-4 py-2 rounded-lg text-left">
                Send Email
              </button>
              <button className="w-full liquid-btn px-4 py-2 rounded-lg text-left">
                View Sessions
              </button>
              <button className="w-full px-4 py-2 rounded-lg text-left bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                Change Role
              </button>
            </div>
          </GlassCard>

          {/* User Metadata */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">User Metadata</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-white/60">App Metadata</label>
                <div className="mt-1 p-2 bg-white/5 rounded font-mono text-xs">
                  {JSON.stringify(user.user.app_metadata || {}, null, 2)}
                </div>
              </div>

              <div>
                <label className="text-white/60">User Metadata</label>
                <div className="mt-1 p-2 bg-white/5 rounded font-mono text-xs">
                  {JSON.stringify(user.user.user_metadata || {}, null, 2)}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Statistics */}
          <GlassCard>
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Bookings</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Invites Used</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Total Spent</span>
                <span className="font-medium">$0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Profile Score</span>
                <span className="font-medium text-green-400">85%</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
