import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY;

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

if (!apiKey && !isDemo) {
  console.warn("STRIPE_SECRET_KEY is not set. Using mock Stripe client.");
}

const configuredVersion = process.env.STRIPE_API_VERSION?.trim() as Stripe.StripeConfig["apiVersion"] | undefined;

export const stripe = (isDemo || !apiKey ? {
  customers: { create: async () => ({ id: 'cus_mock' }) },
  checkout: { sessions: { create: async () => ({ url: 'https://mock.stripe.com/checkout' }) } },
  paymentIntents: { create: async () => ({ client_secret: 'pi_mock_secret' }) },
  // Add other used methods as needed
} : new Stripe(apiKey!, {
  apiVersion: configuredVersion,
})) as unknown as Stripe;
