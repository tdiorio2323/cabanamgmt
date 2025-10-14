import { NextResponse } from "next/server";

export async function POST() {
  if (process.env.E2E_AUTH_MODE !== "mock") {
    return NextResponse.json({ ok: false, reason: "disabled" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("auth_test", "1", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
