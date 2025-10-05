"use client";
import { useEffect, useState, useCallback } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { toast } from "sonner";
import GlassCard from "@/components/ui/GlassCard";
import { Plus, Copy, Trash2, Eye, Shield, Users, Star, Calendar } from "lucide-react";

type VipCode = {
  code: string;
  role: string;
  uses_allowed: number;
  uses_remaining: number;
  expires_at: string;
};

export default function CodesPage() {
  const supabase = supabaseBrowser();
  const [codes, setCodes] = useState<VipCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", role: "creator", uses: 25, days: 30 });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("vip_codes")
      .select("code, role, uses_allowed, uses_remaining, expires_at")
      .order("created_at", { ascending: false });
    setCodes(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const mint = async () => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + form.days);

    const { error } = await supabase.rpc("mint_vip_code", {
      p_code: form.code || null,
      p_role: form.role,
      p_uses: form.uses,
      p_expires_at: expiresAt.toISOString(),
      p_metadata: {}
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("VIP code created!");
      setForm({ ...form, code: "" });
      load();
    }
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

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

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();
  const isExpiringSoon = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            VIP Codes Management
          </h1>
          <p className="text-white/60 mt-2">Create and manage VIP access codes</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="text-2xl font-bold">{codes.length}</div>
          <div className="text-sm text-white/60">Total Codes</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{codes.filter(c => c.uses_remaining > 0 && !isExpired(c.expires_at)).length}</div>
          <div className="text-sm text-white/60">Active Codes</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">{codes.filter(c => isExpiringSoon(c.expires_at)).length}</div>
          <div className="text-sm text-white/60">Expiring Soon</div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">{codes.filter(c => isExpired(c.expires_at) || c.uses_remaining === 0).length}</div>
          <div className="text-sm text-white/60">Expired/Used</div>
        </div>
      </div>

      {/* Create Code Form */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Create VIP Code</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white/60">Custom Code (Optional)</label>
            <input
              className="frosted-input"
              placeholder="Leave blank for auto-generated"
              value={form.code}
              onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/60">Role</label>
            <select
              className="frosted-input"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            >
              <option value="creator">Creator</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/60">Uses Allowed</label>
            <input
              type="number"
              className="frosted-input"
              value={form.uses}
              onChange={e => setForm(f => ({ ...f, uses: +e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/60">Valid Days</label>
            <input
              type="number"
              className="frosted-input"
              value={form.days}
              onChange={e => setForm(f => ({ ...f, days: +e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/60">&nbsp;</label>
            <button
              onClick={mint}
              className="liquid-btn w-full px-4 py-2 rounded-lg font-semibold"
            >
              Create Code
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Codes Table */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">VIP Codes</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="text-white/60 mt-4">Loading codes...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-medium text-white/80">Code</th>
                  <th className="text-left py-3 px-4 font-medium text-white/80">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-white/80">Usage</th>
                  <th className="text-left py-3 px-4 font-medium text-white/80">Expires</th>
                  <th className="text-left py-3 px-4 font-medium text-white/80">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-white/80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => {
                  const expired = isExpired(code.expires_at);
                  const expiringSoon = isExpiringSoon(code.expires_at);
                  const usedUp = code.uses_remaining === 0;

                  return (
                    <tr key={code.code} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="font-mono text-lg font-semibold">{code.code}</div>
                          <button
                            onClick={() => copyCode(code.code)}
                            className="p-1 hover:bg-white/10 rounded"
                            title="Copy code"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(code.role)}`}>
                          {getRoleIcon(code.role)}
                          {code.role}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div>{code.uses_remaining} / {code.uses_allowed} remaining</div>
                          <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-blue-400 h-1.5 rounded-full"
                              style={{ width: `${(code.uses_remaining / code.uses_allowed) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-white/60" />
                          <span className="text-sm">
                            {new Date(code.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${expired || usedUp ? 'text-red-400 bg-red-400/10' :
                            expiringSoon ? 'text-yellow-400 bg-yellow-400/10' :
                              'text-green-400 bg-green-400/10'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${expired || usedUp ? 'bg-red-400' :
                              expiringSoon ? 'bg-yellow-400' :
                                'bg-green-400'
                            }`}></div>
                          {expired || usedUp ? 'Inactive' : expiringSoon ? 'Expiring' : 'Active'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-white/10 rounded transition-colors" title="View Usage">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-500/20 rounded transition-colors text-red-400" title="Revoke Code">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {codes.length === 0 && (
              <div className="text-center py-8 text-white/60">
                No VIP codes created yet
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
