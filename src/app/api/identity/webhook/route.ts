import { NextRequest, NextResponse } from "next/server";

const IDENTITY_WEBHOOK_SECRET = process.env.IDENTITY_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-identity-signature");
  const timestamp = request.headers.get("x-identity-timestamp");

  if (!signature || !timestamp) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const payload = await request.text();

  try {
    if (!IDENTITY_WEBHOOK_SECRET) {
      throw new Error("IDENTITY_WEBHOOK_SECRET not configured");
    }

    // TODO: verify signature using vendor SDK once integrated
    // verifyIdentitySignature({ payload, signature, timestamp, secret: IDENTITY_WEBHOOK_SECRET });

    void payload;

    // TODO: parse payload and update booking identity verification status
  } catch (error) {
    const message = error instanceof Error ? error.message : "identity webhook error";
    console.error("Identity webhook validation failed", message);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
