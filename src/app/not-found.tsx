import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import LiquidButton from '@/components/ui/LiquidButton';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="max-w-lg w-full p-8 text-center">
        <h1 className="text-6xl font-display font-bold mb-4 text-ink">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-ink">Page Not Found</h2>
        <p className="text-ink/70 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <LiquidButton>Return Home</LiquidButton>
        </Link>
      </GlassCard>
    </div>
  );
}
