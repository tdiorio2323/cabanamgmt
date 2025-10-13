import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as { code?: string };
  const codeInput = payload.code?.trim().toUpperCase();

  if (!codeInput) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }

  const { data: code, error: findError } = await supabaseAdmin
    .from("vip_codes")
    .select("id, code, expires_at, uses_remaining, role")
    .eq("code", codeInput)
    .maybeSingle();

  if (findError || !code) {
    return NextResponse.json({ error: "invalid code" }, { status: 404 });
  }

  if (code.expires_at && new Date(code.expires_at) < new Date()) {
    return NextResponse.json({ error: "expired" }, { status: 410 });
  }

  if (code.uses_remaining <= 0) {
    return NextResponse.json({ error: "exhausted" }, { status: 410 });
  }

  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ipAddress = forwarded.split(",")[0]?.trim() || null;
  const userAgent = request.headers.get("user-agent") || undefined;

  const redemptionResult = await supabaseAdmin
    .from("vip_redemptions")
    .insert({
      code_id: code.id,
      user_id: session.user.id,
      ip: ipAddress,
      user_agent: userAgent,
    });

  if (redemptionResult.error) {
    return NextResponse.json({ error: redemptionResult.error.message }, { status: 400 });
  }

  const decrementResult = await supabaseAdmin.rpc("decrement_uses", { p_code: code.code });

  if (decrementResult.error) {
    await supabaseAdmin
      .from("vip_codes")
      .update({ uses_remaining: Math.max(code.uses_remaining - 1, 0) })
      .eq("id", code.id);
  }

  return NextResponse.json({ ok: true, role: code.role });
}
