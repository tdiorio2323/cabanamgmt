"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useBooking } from "@/lib/useBookingStore";

export default function DepositForm() {
  const router = useRouter();
  const set = useBooking((state) => state.set);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/create-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 20000, currency: "usd" }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message = typeof payload?.error === "string" ? payload.error : "Unable to create deposit";
        setError(message);
        return;
      }

      const res = await response.json();

      if (!res?.intentId) {
        setError("Unexpected response from payment service");
        return;
      }

      set({ deposit: { status: "paid", intentId: res.intentId } });

      const screeningResponse = await fetch("/api/screening/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).catch(() => null);

      if (screeningResponse && !screeningResponse.ok) {
        const payload = await screeningResponse.json().catch(() => ({}));
        const message = typeof payload?.error === "string" ? payload.error : "Screening kickoff failed";
        setError(message);
        return;
      }

      router.push("/screening");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Deposit request failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /* inject Stripe Elements in real build */
  }, []);

  return (
    <div className="space-y-3">
      <p className="text-sm">
        Deposit holds your slot. Refunded if screening fails. Forfeited on no-show or policy breach.
      </p>
      {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
      <button
        type="button"
        disabled={loading}
        onClick={submit}
        className="rounded bg-white px-4 py-2 text-black disabled:opacity-60"
      >
        {loading ? "Processing…" : "Pay $200 Deposit"}
      </button>
    </div>
  );
}
