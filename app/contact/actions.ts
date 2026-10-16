"use server"

import { Resend } from "resend"
import { z } from "zod"
import { quoteSchema, type QuoteInput, type QuoteResult } from "@/lib/quote-schema"
import { site } from "@/lib/site"

export async function submitQuote(input: QuoteInput): Promise<QuoteResult> {
  const parsed = quoteSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    }
  }
  const quote = parsed.data

  // Bots fill the hidden field; pretend it worked so they don't retry.
  if (quote.company) return { ok: true }

  const subject = `Quote request: ${quote.name} (${quote.interests.join(", ")})`
  const text = [
    `Name: ${quote.name}`,
    `Phone: ${quote.phone}`,
    `Email: ${quote.email || "Not given"}`,
    `Area: ${quote.area || "Not given"}`,
    `Interested in: ${quote.interests.join(", ")}`,
    `Windows: ${quote.windows}`,
    `Prefers: ${quote.contactPreference}`,
    "",
    quote.message || "(no message)",
  ].join("\n")

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[quote] RESEND_API_KEY not set, would email ${site.email}:\n${subject}\n${text}`,
      )
      return { ok: true }
    }
    console.error("[quote] RESEND_API_KEY is not configured")
    return {
      ok: false,
      error: "We couldn't send your request just now. Please WhatsApp or call us instead.",
    }
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: process.env.QUOTE_FROM_EMAIL ?? "Lourtex Website <onboarding@resend.dev>",
    to: process.env.QUOTE_TO_EMAIL ?? site.email,
    replyTo: quote.email || undefined,
    subject,
    text,
  })

  if (error) {
    console.error("[quote] Resend error", error)
    return {
      ok: false,
      error: "We couldn't send your request just now. Please WhatsApp or call us instead.",
    }
  }
  return { ok: true }
}
