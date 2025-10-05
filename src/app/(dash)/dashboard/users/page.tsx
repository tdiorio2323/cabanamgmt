import { supabaseAdmin } from "@/lib/supabaseAdmin";
import GlassCard from "@/components/ui/GlassCard";
import Link from "next/link";
import { Search, Filter, UserPlus, MoreHorizontal, Users, Shield, Star } from "lucide-react";

export const dynamic = "force-dynamic";

interface UserWithRole {
  id: string;
  email: string;
  created_at?: string;
  last_sign_in_at?: string | null;
  confirmed_at?: string | null;
  role: string;
  [key: string]: unknown; // Allow other properties from Supabase User type
}

export default async function UsersPage() {
  // Use admin client to query auth.users
  const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  const { data: adminEmails } = await supabaseAdmin
    .from('admin_emails')
    .select('email');

  const adminEmailSet = new Set(adminEmails?.map(a => a.email) || []);

  const usersWithRoles: UserWithRole[] = (users?.users || [])
    .filter(user => user.email) // Filter out users without emails
    .map(user => ({
      ...user,
      email: user.email!, // Now we know email is defined
      role: adminEmailSet.has(user.email!) ? 'admin' :
        user.email?.includes('client') ? 'client' : 'creator'
    }));

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-red-400" />;
      case 'client': return <Star className="w-4 h-4 text-blue-400" />;
      default: return <Users className="w-4 h-4 text-green-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-400/10';
      case 'client': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-green-400 bg-green-400/10';
    }
  };

  const totalUsers = usersWithRoles.length;
  const adminCount = usersWithRoles.filter(u => u.role === 'admin').length;
  const creatorCount = usersWithRoles.filter(u => u.role === 'creator').length;
  const clientCount = usersWithRoles.filter(u => u.role === 'client').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-white/60 mt-2">Manage all platform users and their roles</p>
        </div>
        <button className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
          Error loading users: {error.message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <div className="text-sm text-white/60">Total Users</div>
            </div>
            <Users className="w-8 h-8 text-white/40" />
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-400">{adminCount}</div>
              <div className="text-sm text-white/60">Admins</div>
            </div>
            <Shield className="w-8 h-8 text-red-400/40" />
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-400">{creatorCount}</div>
              <div className="text-sm text-white/60">Creators</div>
            </div>
            <Users className="w-8 h-8 text-green-400/40" />
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-400">{clientCount}</div>
              <div className="text-sm text-white/60">Clients</div>
            </div>
            <Star className="w-8 h-8 text-blue-400/40" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            <input
              type="text"
              placeholder="Search users by email..."
              className="frosted-input pl-10 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/60" />
            <select className="frosted-input w-auto min-w-[120px]">
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="creator">Creator</option>
              <option value="client">Client</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Users Table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-medium text-white/80">User</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Role</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Status</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-white/80">Last Active</th>
                <th className="text-right py-3 px-4 font-medium text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersWithRoles.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-sm font-medium">
                        {user.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-xs text-white/60 font-mono">ID: {user.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.confirmed_at ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.confirmed_at ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                      {user.confirmed_at ? 'Confirmed' : 'Pending'}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white/80 text-sm">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="py-3 px-4 text-white/80 text-sm">
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/users/${user.id}`}
                        className="liquid-btn px-3 py-1 rounded text-sm hover:bg-white/20 transition-colors"
                      >
                        View
                      </Link>
                      <button className="p-2 hover:bg-white/10 rounded transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usersWithRoles.length === 0 && (
            <div className="text-center py-8 text-white/60">
              No users found
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
