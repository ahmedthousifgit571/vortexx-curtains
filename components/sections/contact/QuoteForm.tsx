"use client"

import { useState, useTransition, type ReactNode } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Check, Loader2, Mail, MessageCircle, Phone } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitQuote } from "@/app/contact/actions"
import {
  contactPreferenceOptions,
  interestOptions,
  quoteSchema,
  windowCountOptions,
  type Quote,
  type QuoteInput,
} from "@/lib/quote-schema"
import { whatsappLink } from "@/lib/site"
import { cn } from "@/lib/utils"

const field =
  "h-12 rounded-xl border-ivory-300 bg-ivory/50 px-4 text-base transition-colors hover:border-teal-600/40 focus-visible:border-teal-600 focus-visible:bg-white focus-visible:ring-teal-600/15"
const label = "text-sm font-semibold text-teal-900"
/** A selectable tile: the native input stays in the label (sr-only), so it's keyboard and screen-reader friendly. */
const tile =
  "group/tile relative flex min-h-12 cursor-pointer items-center rounded-xl border border-ivory-300 bg-white px-4 text-sm font-medium text-teal-900 transition-colors select-none hover:border-teal-600/50 has-checked:border-teal-700 has-checked:bg-teal-700 has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-teal-600 has-focus-visible:ring-offset-2"

type Interest = (typeof interestOptions)[number]
const blinds = interestOptions.filter((o) => o.endsWith("blinds"))
const others = interestOptions.filter((o) => !o.endsWith("blinds"))
const preferenceIcon = { Call: Phone, WhatsApp: MessageCircle, Email: Mail } as const

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-2 text-sm font-medium text-destructive">
      {message}
    </p>
  )
}

function Optional() {
  return <span className="font-normal text-ink/50">(optional)</span>
}

/** A numbered step of the form: "01 About you". */
function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  const id = `step-${n}`
  return (
    <div
      role="group"
      aria-labelledby={id}
      className="border-t border-ivory-300 pt-8 first:border-0 first:pt-0"
    >
      <h3 id={id} className="flex items-baseline gap-3 text-2xl text-teal-900">
        <span className="font-label text-xs font-semibold tracking-[0.2em] text-teal-600 font-stretch-expanded">
          {n}
        </span>
        {title}
      </h3>
      <div className="mt-6">{children}</div>
    </div>
  )
}

export function QuoteForm() {
  const [pending, startTransition] = useTransition()
  const [sentTo, setSentTo] = useState<string | null>(null)

  const form = useForm<QuoteInput, unknown, Quote>({
    resolver: zodResolver(quoteSchema),
    // Check each field once the visitor leaves it, then live as they fix it.
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      area: "",
      interests: [],
      windows: undefined,
      contactPreference: "WhatsApp",
      message: "",
      company: "",
    },
  })
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form

  const onSubmit = handleSubmit((values) =>
    startTransition(async () => {
      const result = await submitQuote(values)
      if (result.ok) {
        setSentTo(values.name.split(" ")[0])
        toast.success("Request sent. We'll be in touch shortly.")
        return
      }
      for (const [name, messages] of Object.entries(result.fieldErrors ?? {})) {
        if (messages?.[0]) setError(name as keyof QuoteInput, { message: messages[0] })
      }
      toast.error(result.error)
    }),
  )

  if (sentTo) {
    return (
      <div
        ref={(el) => el?.scrollIntoView({ block: "center", behavior: "smooth" })}
        role="status"
        className="flex h-full scroll-mt-28 flex-col justify-center py-6"
      >
        <span className="grid size-14 place-items-center rounded-full bg-sunlight text-teal-900">
          <Check className="size-7" aria-hidden />
        </span>
        <h2 className="mt-6 text-4xl text-teal-900 sm:text-5xl">
          Thank you, <em className="text-teal-600">{sentTo}</em>.
        </h2>
        <p className="mt-4 max-w-md leading-relaxed text-ink/65">
          We&apos;ve got your request and will contact you to fix a convenient time for a free
          measure. Want a faster reply? Send us photos of your windows on WhatsApp.
        </p>
        <Button asChild size="cta" className="mt-8 self-start">
          <a
            href={whatsappLink("Hi Lourtex, I just sent a quote request on your website.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden /> Continue on WhatsApp
          </a>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby="quote-form-title" className="relative">
      <p className="eyebrow text-teal-600">Request a visit</p>
      <h2 id="quote-form-title" className="mt-3 text-4xl text-teal-900 sm:text-5xl">
        Tell us about your <em className="text-teal-600">windows</em>.
      </h2>
      <p className="mt-3 max-w-md text-pretty text-ink/60">
        It takes about a minute, and helps us bring the right samples to your visit.
      </p>

      <div className="mt-10 space-y-8">
        <Step n="01" title="About you">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name" className={label}>
                Your name
              </Label>
              <Input
                id="name"
                autoComplete="name"
                className={cn(field, "mt-2")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                {...register("name")}
              />
              <FieldError id="name-error" message={errors.name?.message} />
            </div>
            <div>
              <Label htmlFor="phone" className={label}>
                Mobile number
              </Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="98765 43210"
                className={cn(field, "mt-2")}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                {...register("phone")}
              />
              <FieldError id="phone-error" message={errors.phone?.message} />
            </div>
            <div>
              <Label htmlFor="email" className={label}>
                Email <Optional />
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                className={cn(field, "mt-2")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
              <FieldError id="email-error" message={errors.email?.message} />
            </div>
            <div>
              <Label htmlFor="area" className={label}>
                Area / locality <Optional />
              </Label>
              <Input
                id="area"
                autoComplete="address-level3"
                placeholder="e.g. Horamavu"
                className={cn(field, "mt-2")}
                {...register("area")}
              />
            </div>
          </div>
        </Step>

        <Step n="02" title="Your windows">
          <fieldset aria-describedby={errors.interests ? "interests-error" : undefined}>
            <legend className={label}>What are you looking for?</legend>
            <Controller
              control={control}
              name="interests"
              render={({ field: { value = [], onChange, onBlur } }) => {
                const toggle = (option: Interest) =>
                  onChange(
                    value.includes(option) ? value.filter((v) => v !== option) : [...value, option],
                  )
                const group = (name: string, options: Interest[], cols: string) => (
                  <div role="group" aria-label={name} className="mt-4">
                    <p aria-hidden className="eyebrow text-ink/45">
                      {name}
                    </p>
                    <div className={cn("mt-2.5 grid gap-2", cols)}>
                      {options.map((option) => (
                        <label key={option} className={cn(tile, "justify-between gap-2")}>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={value.includes(option)}
                            onChange={() => toggle(option)}
                            onBlur={onBlur}
                          />
                          {option.replace(/ blinds$/, "")}
                          <span
                            aria-hidden
                            className="grid size-5 shrink-0 place-items-center rounded-full border border-ivory-300 text-teal-900 transition-colors group-has-checked/tile:border-sunlight group-has-checked/tile:bg-sunlight"
                          >
                            <Check className="size-3 opacity-0 transition-opacity group-has-checked/tile:opacity-100" />
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
                return (
                  <>
                    {group("Blinds", blinds, "grid-cols-2 sm:grid-cols-3")}
                    {group("Shutters and pergolas", others, "grid-cols-1 sm:grid-cols-2")}
                  </>
                )
              }}
            />
            <FieldError id="interests-error" message={errors.interests?.message} />
          </fieldset>

          <fieldset
            className="mt-8"
            aria-describedby={errors.windows ? "windows-error" : undefined}
          >
            <legend className={label}>Roughly how many windows?</legend>
            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {windowCountOptions.map((option) => (
                <label key={option} className={cn(tile, "justify-center tabular-nums")}>
                  <input type="radio" value={option} className="sr-only" {...register("windows")} />
                  {option}
                </label>
              ))}
            </div>
            <FieldError id="windows-error" message={errors.windows?.message} />
          </fieldset>
        </Step>

        <Step n="03" title="How should we reach you?">
          <fieldset>
            <legend className="sr-only">Best way to reach you</legend>
            <div className="grid grid-cols-3 gap-2">
              {contactPreferenceOptions.map((option) => {
                const Icon = preferenceIcon[option]
                return (
                  <label key={option} className={cn(tile, "justify-center gap-2 px-2 sm:px-4")}>
                    <input
                      type="radio"
                      value={option}
                      className="sr-only"
                      {...register("contactPreference")}
                    />
                    <Icon className="size-4 shrink-0 max-sm:hidden" aria-hidden />
                    {option}
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-6">
            <Label htmlFor="message" className={label}>
              Anything else? <Optional />
            </Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Rooms, window sizes, colours you like, timelines…"
              className={cn(field, "mt-2 h-auto min-h-28 py-3")}
              {...register("message")}
            />
          </div>
        </Step>
      </div>

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input tabIndex={-1} autoComplete="off" {...register("company")} />
        </label>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-ivory-300 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="cta" disabled={pending} className="h-14 px-8 sm:min-w-64">
          {pending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              Request free measure <ArrowRight aria-hidden />
            </>
          )}
        </Button>
        <p className="text-sm text-ink/55">Free, anywhere in Bangalore.</p>
      </div>
    </form>
  )
}
