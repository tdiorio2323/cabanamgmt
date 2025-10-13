import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";

const MIN_AMOUNT = 100;
const MAX_AMOUNT = 250_000;
const SUPPORTED_CURRENCIES = new Set(["usd"]);

export async function POST(req: NextRequest) {
  const headers = { "Content-Type": "application/json" } as const;

  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers });
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400, headers });
  }

  const { amount: rawAmount, currency: rawCurrency } = payload as {
    amount?: unknown;
    currency?: unknown;
  };

  const amount = Number(rawAmount);
  const currency = typeof rawCurrency === "string" ? rawCurrency.toLowerCase() : "usd";

  if (!Number.isInteger(amount)) {
    return NextResponse.json({ error: "Amount must be an integer number of cents" }, { status: 400, headers });
  }

  if (amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
    return NextResponse.json(
      { error: `Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT} cents` },
      { status: 400, headers },
    );
  }

  if (!SUPPORTED_CURRENCIES.has(currency)) {
    return NextResponse.json(
      { error: `Unsupported currency. Supported currencies: ${Array.from(SUPPORTED_CURRENCIES).join(", ")}` },
      { status: 400, headers },
    );
  }

  const idempotencyKey = req.headers.get("x-idempotency-key") ?? randomUUID();

  try {
    const intent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        capture_method: "automatic",
        metadata: { purpose: "deposit" },
      },
      { idempotencyKey },
    );

    return NextResponse.json(
      {
        intentId: intent.id,
        clientSecret: intent.client_secret,
      },
      { headers },
    );
  } catch (error) {
    console.error("Failed to create Stripe payment intent", error);

    return NextResponse.json(
      { error: "Unable to create deposit at this time" },
      { status: 500, headers },
    );
  }
}
