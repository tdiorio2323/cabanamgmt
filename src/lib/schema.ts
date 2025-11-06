import { z } from "zod";

export const consentSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  agree: z.literal(true).refine((val) => val === true, { message: "Consent required" }),
});

// @future - Will be used when identity verification form is implemented
export const idvSchema = z.object({
  licenseFrontUrl: z.string().url(),
  licenseBackUrl: z.string().url().optional(),
  selfieUrl: z.string().url(),
});

// @future - Will be used when deposit form validation is implemented
export const depositSchema = z.object({ amount: z.number().min(50) });
