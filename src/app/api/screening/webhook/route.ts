import { NextRequest, NextResponse } from "next/server";

const SCREENING_WEBHOOK_SECRET = process.env.SCREENING_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-screening-signature");
  const timestamp = request.headers.get("x-screening-timestamp");

  if (!signature || !timestamp) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const payload = await request.text();

  try {
    if (!SCREENING_WEBHOOK_SECRET) {
      throw new Error("SCREENING_WEBHOOK_SECRET not configured");
    }

    // TODO: verify CRA webhook signature using provider SDK
    // verifyScreeningSignature({ payload, signature, timestamp, secret: SCREENING_WEBHOOK_SECRET });

    void payload;

    // TODO: parse payload and update screening record status
  } catch (error) {
    const message = error instanceof Error ? error.message : "screening webhook error";
    console.error("Screening webhook validation failed", message);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
