"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import GlassCard from "@/components/ui/GlassCard";
import LiquidButton from "@/components/ui/LiquidButton";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

type VipInvite = {
  id: string;
  code: string;
  name: string;
  type: 'admin' | 'vip';
  used_at: string | null;
  created_at: string;
};

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [invite, setInvite] = useState<VipInvite | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const code = params.code as string;

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const supabase = supabaseBrowser();
        const { data, error } = await supabase
          .from('vip_invites')
          .select('*')
          .eq('code', code.toUpperCase())
          .single();

        if (error || !data) {
          toast.error("Invalid or expired VIP code");
          return;
        }

        if (data.used_at) {
          toast.error("This VIP code has already been used");
          return;
        }

        setInvite(data);
      } catch (error) {
        logger.error('Error fetching invite:', error);
        toast.error("Failed to load VIP invite");
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchInvite();
    }
  }, [code]);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite || !email || !password) return;

    setRedeeming(true);

    try {
      const supabase = supabaseBrowser();

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        toast.error(authError.message);
        return;
      }

      if (authData.user) {
        // Redeem the VIP code
        const response = await fetch("/api/vip/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: invite.code }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to redeem VIP code");
        }

        toast.success(`Welcome! Your ${invite.type} access has been activated.`);
        router.push("/dashboard");
      }
    } catch (error) {
      logger.error('Error redeeming invite:', error);
      toast.error(error instanceof Error ? error.message : "Failed to redeem invite");
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <main className="max-w-md mx-auto space-y-4">
        <GlassCard>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-white/70">Loading VIP invite...</p>
          </div>
        </GlassCard>
      </main>
    );
  }

  if (!invite) {
    return (
      <main className="max-w-md mx-auto space-y-4">
        <GlassCard>
          <h1 className="text-xl font-semibold mb-2">Invalid VIP Code</h1>
          <p className="text-white/70 mb-4">
            This VIP code is invalid or has already been used.
          </p>
          <LiquidButton onClick={() => router.push("/")}>
            Return Home
          </LiquidButton>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto space-y-4">
      <GlassCard>
        <h1 className="text-xl font-semibold mb-2">VIP Access Invitation</h1>
        <div className="space-y-4">
          <div className="p-3 bg-white/10 rounded-lg">
            <p className="text-sm text-white/70">You&apos;ve been invited as:</p>
            <p className="font-semibold capitalize">{invite.type} - {invite.name}</p>
          </div>

          <form onSubmit={handleRedeem} className="space-y-3">
            <p className="text-sm text-white/70">
              Create your account to redeem this {invite.type} access:
            </p>

            <div>
              <label className="text-sm opacity-70 mb-1 block">Email</label>
              <input
                type="email"
                className="w-full rounded bg-white/10 p-2 border border-white/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="text-sm opacity-70 mb-1 block">Password</label>
              <input
                type="password"
                className="w-full rounded bg-white/10 p-2 border border-white/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a secure password"
                required
                minLength={6}
              />
            </div>

            <LiquidButton type="submit" disabled={redeeming}>
              {redeeming ? "Creating Account..." : `Activate ${invite.type} Access`}
            </LiquidButton>
          </form>
        </div>
      </GlassCard>
    </main>
  );
}
