import { z } from "zod"

export const interestOptions = [
  "Zebra blinds",
  "Roman blinds",
  "Roller blinds",
  "Sunscreen blinds",
  "Skylight blinds",
  "Honeycomb blinds",
  "Motorised shutters",
  "Pergolas",
] as const
export const windowCountOptions = ["1–2", "3–5", "6–10", "More than 10"] as const
export const contactPreferenceOptions = ["Call", "WhatsApp", "Email"] as const

/** Indian mobile: optional +91 / 0 prefix, then 10 digits starting 6–9. Spaces and dashes allowed. */
const indianPhone = /^(?:\+?91|0)?[6-9]\d{9}$/

/** Shared by the client form and the server action — the server never trusts the client. */
export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(80),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => indianPhone.test(v), "Enter a 10-digit mobile number"),
  email: z.union([z.literal(""), z.email("That email doesn't look right")]),
  area: z.string().trim().max(80),
  interests: z.array(z.enum(interestOptions)).min(1, "Pick at least one"),
  windows: z.enum(windowCountOptions, { error: "How many windows, roughly?" }),
  contactPreference: z.enum(contactPreferenceOptions),
  message: z.string().trim().max(1000),
  /** Honeypot — real people leave it empty. */
  company: z.string().max(0).optional(),
})

export type QuoteInput = z.input<typeof quoteSchema>
export type Quote = z.output<typeof quoteSchema>

export type QuoteResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof QuoteInput, string[]>> }
