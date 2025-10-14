/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseMock } from "./supabaseMock";

type ServerClient = SupabaseClient<any, any, any>;

export async function supabaseServer(): Promise<ServerClient> {
  if (process.env.E2E_AUTH_MODE === "mock") {
    return supabaseMock.server as ServerClient;
  }

  const store = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return store.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {
            // Silently fail in read-only contexts (Server Components)
          }
        },
      },
    },
  ) as ServerClient;
}
