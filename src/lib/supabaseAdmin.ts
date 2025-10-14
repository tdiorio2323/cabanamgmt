/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseMock } from "./supabaseMock";

type AdminClient = SupabaseClient<any, any, any>;

if (typeof window !== "undefined") {
  throw new Error("supabaseAdmin is server-only. Import it from server contexts only.");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const isMock = process.env.E2E_AUTH_MODE === "mock";

let client: AdminClient;

if ((!url || !serviceKey) && isMock) {
  client = supabaseMock.admin;
} else {
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase admin credentials. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  client = createClient(url, serviceKey, {
    auth: { persistSession: false },
  }) as AdminClient;
}

export const supabaseAdmin = client;
export default supabaseAdmin;
