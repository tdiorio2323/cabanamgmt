/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseMock } from "./supabaseMock";

type BrowserClient = SupabaseClient<any, any, any>;

export const supabaseBrowser = (): BrowserClient => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isMock = process.env.NEXT_PUBLIC_E2E_AUTH_MODE === "mock";

  if ((!url || !key) && isMock) {
    return supabaseMock.browser;
  }

  if (!url || !key) {
    console.error("Supabase environment check:", { url: !!url, key: !!key });
    throw new Error(
      "Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local",
    );
  }

  return createBrowserClient(url, key) as BrowserClient;
};
