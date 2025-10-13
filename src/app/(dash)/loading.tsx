import GlassCard from '@/components/ui/GlassCard';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-ink/10 rounded-md w-48 mb-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <GlassCard key={i} className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-ink/10 rounded w-24" />
              <div className="h-8 bg-ink/10 rounded w-16" />
              <div className="h-3 bg-ink/10 rounded w-32" />
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-ink/10 rounded w-32" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-ink/10 rounded" />
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
