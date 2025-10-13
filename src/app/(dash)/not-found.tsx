import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import LiquidButton from '@/components/ui/LiquidButton';

export default function DashboardNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="max-w-lg w-full p-8 text-center">
        <h1 className="text-6xl font-display font-bold mb-4 text-ink">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-ink">
          Dashboard Page Not Found
        </h2>
        <p className="text-ink/70 mb-6">
          The dashboard page you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <LiquidButton>Go to Dashboard</LiquidButton>
          </Link>
          <Link href="/">
            <LiquidButton>Return Home</LiquidButton>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
