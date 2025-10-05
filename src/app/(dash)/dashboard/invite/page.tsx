'use client'
import { useEffect, useState } from 'react'
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import {
  Send,
  Copy,
  Clock,
  Users,
  Mail,
  Plus,
  Search,
  Trash2,
  Eye,
  Calendar,
  Download,
  Shield,
  UserPlus
} from "lucide-react";

interface Invite {
  id: string;
  code: string;
  email?: string;
  role: string;
  uses_allowed: number;
  uses_remaining: number;
  expires_at: string;
  note?: string;
}

export default function InvitePage() {
  const [invites, setInvites] = useState<Invite[]>([])
  const [form, setForm] = useState({ email: '', role: 'creator', uses: 5, days: 30, note: '', code: '' })
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const loadInvites = async () => {
    const r = await fetch('/api/invites/list', { method: 'POST' }).catch(() => null)
    if (r?.ok) {
      const data = await r.json()
      setInvites(data.invites || [])
    }
  }

  useEffect(() => { loadInvites() }, [])

  const create = async () => {
    setLoading(true)
    const r = await fetch('/api/invites/create', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form)
    })
    setLoading(false)
    if (r.ok) {
      setForm({ email: '', role: 'creator', uses: 5, days: 30, note: '', code: '' });
      loadInvites()
      toast.success('Invitation created successfully!')
    } else {
      toast.error('Failed to create invitation')
    }
  }

  const revoke = async (id: string) => {
    if (!confirm('Revoke this invite?')) return
    const r = await fetch('/api/invites/revoke', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id })
    })
    if (r.ok) {
      loadInvites()
      toast.success('Invitation revoked')
    } else {
      toast.error('Failed to revoke invitation')
    }
  }

  const copyInviteCode = async (code: string) => {
    const inviteUrl = `${window.location.origin}/invite?code=${code}`;
    await navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite link copied to clipboard!');
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'creator':
        return <UserPlus className="w-4 h-4 text-blue-400" />;
      case 'client':
        return <Users className="w-4 h-4 text-green-400" />;
      default:
        return <Users className="w-4 h-4 text-white/60" />;
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-400 bg-red-400/20 border-red-400/50';
      case 'creator':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/50';
      case 'client':
        return 'text-green-400 bg-green-400/20 border-green-400/50';
      default:
        return 'text-white/60 bg-white/10 border-white/30';
    }
  }

  const filteredInvites = invites.filter(invite => {
    const matchesSearch = invite.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.note?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || invite.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: invites.length,
    active: invites.filter(i => new Date(i.expires_at) > new Date() && i.uses_remaining > 0).length,
    expired: invites.filter(i => new Date(i.expires_at) <= new Date()).length,
    exhausted: invites.filter(i => i.uses_remaining === 0).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            User Invitations
          </h1>
          <p className="text-white/60 mt-2">Create and manage invitation codes for new users</p>
        </div>
        <button
          onClick={() => { }}
          className="liquid-btn px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-white/60">Total Invites</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-2xl font-bold">{stats.active}</div>
              <div className="text-sm text-white/60">Active</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-2xl font-bold">{stats.expired}</div>
              <div className="text-sm text-white/60">Expired</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold">{stats.exhausted}</div>
              <div className="text-sm text-white/60">Used Up</div>
            </div>
          </div>
        </div>
      </div>

      {/* Create New Invitation */}
      <GlassCard>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Invitation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            className="frosted-input"
            placeholder="Target email (optional)"
            value={form.email}
            onChange={e => setForm(v => ({ ...v, email: e.target.value }))}
          />
          <input
            className="frosted-input"
            placeholder="Custom code (optional)"
            value={form.code}
            onChange={e => setForm(v => ({ ...v, code: e.target.value }))}
          />
          <select
            className="frosted-input"
            value={form.role}
            onChange={e => setForm(v => ({ ...v, role: e.target.value }))}
          >
            <option value="creator">Creator</option>
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
          <input
            className="frosted-input"
            type="number"
            min={1}
            placeholder="Uses allowed"
            value={form.uses}
            onChange={e => setForm(v => ({ ...v, uses: +e.target.value || 1 }))}
          />
          <input
            className="frosted-input"
            type="number"
            min={1}
            placeholder="Valid for (days)"
            value={form.days}
            onChange={e => setForm(v => ({ ...v, days: +e.target.value || 30 }))}
          />
          <input
            className="frosted-input"
            placeholder="Note (optional)"
            value={form.note}
            onChange={e => setForm(v => ({ ...v, note: e.target.value }))}
          />
        </div>
        <button
          onClick={create}
          disabled={loading}
          className="liquid-btn px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Create Invite
            </>
          )}
        </button>
      </GlassCard>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invites..."
            className="frosted-input w-full pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="frosted-input min-w-[150px]"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="creator">Creator</option>
          <option value="client">Client</option>
        </select>
      </div>

      {/* Invitations List */}
      <GlassCard>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Active Invitations ({filteredInvites.length})
        </h2>
        {filteredInvites.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No invitations found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    {getRoleIcon(invite.role)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-lg font-semibold">{invite.code}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(invite.role)}`}>
                        {invite.role}
                      </span>
                    </div>
                    <div className="text-sm text-white/60 flex items-center gap-4">
                      {invite.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {invite.email}
                        </span>
                      )}
                      <span>Uses: {invite.uses_remaining}/{invite.uses_allowed}</span>
                      <span>Expires: {new Date(invite.expires_at).toLocaleDateString()}</span>
                    </div>
                    {invite.note && (
                      <div className="text-sm text-white/80 mt-1 italic">&quot;{invite.note}&quot;</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyInviteCode(invite.code)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    title="Copy invite link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { }}
                    className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-blue-400"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => revoke(invite.id)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400"
                    title="Revoke invitation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
