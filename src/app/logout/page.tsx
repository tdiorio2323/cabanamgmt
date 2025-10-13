"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { toast } from "sonner";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      try {
        const supabase = supabaseBrowser();
        const { error } = await supabase.auth.signOut();

        if (error) {
          toast.error(`Logout failed: ${error.message}`);
        } else {
          toast.success("Successfully logged out");
        }
      } catch (_err) {
        toast.error("Failed to logout");
      } finally {
        // Always redirect to login, even if there's an error
        setTimeout(() => {
          router.push("/login");
          router.refresh();
        }, 500);
      }
    }

    logout();
  }, [router]);

  return (
    <main className="max-w-md mx-auto text-center space-y-4 py-12">
      <h1 className="text-2xl font-semibold">Logging out...</h1>
      <p className="text-sm opacity-70">Redirecting to login page...</p>
    </main>
  );
}
