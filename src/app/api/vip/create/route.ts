import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { generateCode } from "@/lib/crypto";
import { isAdminEmail } from "@/lib/isAdminEmail";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabaseServer } from "@/lib/supabaseServer";

const VipCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Code must be at least 3 characters")
    .max(50, "Code must be at most 50 characters")
    .regex(/^[A-Z0-9-]+$/, "Code must contain only uppercase letters, numbers, and hyphens")
    .optional(),
  role: z.enum(["admin", "creator", "client"]).default("client"),
  uses_allowed: z
    .number()
    .int("Uses must be an integer")
    .min(1, "Must allow at least 1 use")
    .max(1000, "Cannot exceed 1000 uses")
    .default(5),
  expires_at: z
    .string()
    .datetime("Invalid datetime format")
    .refine((date) => new Date(date) > new Date(), {
      message: "Expiration must be in the future",
    })
    .optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export async function POST(request: NextRequest) {
  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  if (!isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = VipCodeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid input",
        details: parsed.error.format(),
      },
      { status: 400 }
    );
  }

  const { code: customCode, role, uses_allowed, expires_at, metadata } = parsed.data;

  const code =
    customCode ?? [generateCode(4), generateCode(4), generateCode(4)].join("-").toUpperCase();

  const expiresAt = expires_at ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("vip_codes")
    .insert({
      code,
      role,
      uses_allowed,
      uses_remaining: uses_allowed,
      expires_at: expiresAt,
      created_by: session.user.id,
      metadata,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ code: data });
}
