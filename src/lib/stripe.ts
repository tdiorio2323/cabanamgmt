import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY;

if (!apiKey) {
  throw new Error("STRIPE_SECRET_KEY is not set. Add it to your server environment before using Stripe APIs.");
}

export const stripe = new Stripe(apiKey, {
  apiVersion: "2024-06-20",
});
