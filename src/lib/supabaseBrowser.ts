/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseMock } from "./supabaseMock";
import { isDemoClient } from "./isDemo";

type BrowserClient = SupabaseClient<any, any, any>;

export const supabaseBrowser = (): BrowserClient => {
  // Check if demo mode
  if (isDemoClient()) {
    return supabaseMock.browser;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Supabase environment check:", { url: !!url, key: !!key });
    throw new Error(
      "Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
    );
  }

  return createBrowserClient(url, key) as BrowserClient;
};
