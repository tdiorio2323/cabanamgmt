/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseMock } from "./supabaseMock";
import { isDemo } from "./isDemo";

type ServerClient = SupabaseClient<any, any, any>;

export async function supabaseServer(): Promise<ServerClient> {
  // Check for demo mode via headers
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Check if demo mode (env var or pathname)
  if (isDemo(pathname) || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return supabaseMock.server as ServerClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
    );
  }

  const store = await cookies();

  return createServerClient(
    url,
    key,
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
