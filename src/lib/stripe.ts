import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY;

if (!apiKey) {
  throw new Error("STRIPE_SECRET_KEY is not set. Add it to your server environment before using Stripe APIs.");
}

const configuredVersion = process.env.STRIPE_API_VERSION?.trim();
const fallbackApiVersion = '2025-09-30.clover' as Stripe.StripeConfig["apiVersion"];

export const stripe = new Stripe(apiKey, {
  apiVersion: (configuredVersion as Stripe.StripeConfig["apiVersion"]) ?? fallbackApiVersion,
});
