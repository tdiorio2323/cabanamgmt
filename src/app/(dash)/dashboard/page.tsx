import { supabaseAdmin } from "@/lib/supabaseAdmin";
import GlassCard from "@/components/ui/GlassCard";
import { TrendingUp, Users, Calendar, CreditCard, CheckCircle } from "lucide-react";

export default async function OverviewPage() {
  const [
    { count: codesCount },
    { count: _redemptionsCount },
    { count: usersCount },
    { count: invitesCount },
  ] = await Promise.all([
    supabaseAdmin.from("vip_codes").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("vip_redemptions").select("*", { count: "exact", head: true }),
    supabaseAdmin.auth.admin.listUsers().then(({ data }) => ({ count: data.users.length })),
    supabaseAdmin.from("invites").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentCodes } = await supabaseAdmin
    .from("vip_codes")
    .select("code, role, uses_remaining, expires_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentInvites } = await supabaseAdmin
    .from("invites")
    .select("code, role, uses_remaining, expires_at, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-white/60 mt-2">Welcome back to Cabana Management</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Users"
          value={usersCount ?? 0}
          icon={<Users className="w-5 h-5" />}
          trend="+12%"
          trendUp={true}
        />
        <KpiCard
          title="VIP Codes"
          value={codesCount ?? 0}
          icon={<CheckCircle className="w-5 h-5" />}
          trend="+8%"
          trendUp={true}
        />
        <KpiCard
          title="Invitations"
          value={invitesCount ?? 0}
          icon={<Calendar className="w-5 h-5" />}
          trend="+15%"
          trendUp={true}
        />
        <KpiCard
          title="Revenue"
          value="$0"
          icon={<CreditCard className="w-5 h-5" />}
          trend="0%"
          trendUp={false}
        />
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent VIP Codes */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent VIP Codes</h3>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="space-y-3">
            {(recentCodes ?? []).map((code) => (
              <div key={code.code} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                <div>
                  <div className="font-mono text-sm">{code.code}</div>
                  <div className="text-xs text-white/60">{code.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{code.uses_remaining} left</div>
                  <div className="text-xs text-white/60">
                    {new Date(code.expires_at!).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {!recentCodes?.length && (
              <div className="text-center py-6 text-white/60">No VIP codes yet</div>
            )}
          </div>
        </GlassCard>

        {/* Recent Invitations */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Invitations</h3>
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-3">
            {(recentInvites ?? []).map((invite) => (
              <div key={invite.code} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                <div>
                  <div className="font-mono text-sm">CABANA-{invite.code}</div>
                  <div className="text-xs text-white/60">{invite.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{invite.uses_remaining} left</div>
                  <div className="text-xs text-white/60">
                    {new Date(invite.expires_at!).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {!recentInvites?.length && (
              <div className="text-center py-6 text-white/60">No invitations yet</div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* System Status */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">System Status</h3>
          <div className="flex items-center gap-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">All systems operational</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatusItem label="Database" status="online" />
          <StatusItem label="Auth" status="online" />
          <StatusItem label="Storage" status="online" />
          <StatusItem label="API" status="online" />
        </div>
      </GlassCard>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon,
  trend,
  trendUp
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg bg-white/5">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
          <TrendingUp className={`w-3 h-3 ${!trendUp && 'rotate-180'}`} />
          {trend}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-white/60">{title}</div>
      </div>
    </GlassCard>
  );
}

function StatusItem({ label, status }: { label: string; status: 'online' | 'offline' | 'warning' }) {
  const _statusColors = {
    online: 'text-green-400',
    offline: 'text-red-400',
    warning: 'text-yellow-400'
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
      <span className="text-sm">{label}</span>
      <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-400' : status === 'offline' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
    </div>
  );
}
