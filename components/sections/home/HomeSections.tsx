import Link from "next/link"
import { ArrowRight, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/sections/Reveal"
import { WindowFrame } from "@/components/sections/WindowFrame"
import { getProduct } from "@/lib/products"
import { serviceSteps } from "@/lib/services"
import { site, whatsappLink } from "@/lib/site"

const featured = ["zebra", "honeycomb", "motorised-shutters", "pergolas"]

/** Products teaser — four dressed windows. Hover plays each one's mechanic. */
export function ProductsTeaser() {
  const lead = featured.map((slug) => getProduct(slug)!)
  return (
    <section className="bg-ivory py-24 sm:py-32">
      <div className="container-site">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div data-reveal>
            <p className="eyebrow text-teal-600">What we make</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-bold text-teal-900 sm:text-5xl">
              Every window and terrace, shaded your way.
            </h2>
          </div>
          <Link
            data-reveal
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-teal-700"
          >
            See all products
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </Reveal>

        <Reveal className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {lead.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              data-reveal
              className="group outline-none"
            >
              <WindowFrame
                mechanic={product.mechanic}
                className="transition-shadow group-focus-visible:ring-2 group-focus-visible:ring-teal-600"
              />
              <h3 className="mt-5 text-xl font-semibold text-teal-900">{product.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{product.summary}</p>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/** Dark teal statement band — the brand's light-and-privacy promise. */
export function LightStatement() {
  return (
    <section className="relative overflow-hidden bg-teal-800 py-24 text-white sm:py-32">
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-1/2 stripes [mask-image:linear-gradient(90deg,transparent,black)] [--slat-gap:22px] [--slat:3px] [--stripe-alpha:0.07]"
      />
      <Reveal className="relative container-site grid gap-12 lg:grid-cols-12">
        <div data-reveal className="lg:col-span-7">
          <p className="eyebrow text-teal-200">Light, on your terms</p>
          <p className="mt-6 font-display text-3xl leading-tight font-semibold text-balance sm:text-5xl">
            Light is the first thing you notice in a room. We help you decide how much of it comes
            in, and when.
          </p>
        </div>
        <ul className="grid gap-6 self-end sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
          {[
            ["Blockout", "Dark, cool bedrooms, even on a bright Bangalore afternoon."],
            ["Light-filtering", "Soft, even daylight with privacy from the street."],
            ["Sheer", "A gentle glow that keeps the view and the breeze."],
          ].map(([title, body]) => (
            <li key={title} data-reveal className="border-l-2 border-sunlight/70 pl-5">
              <h3 className="font-label text-xs font-semibold tracking-[0.16em] uppercase font-stretch-expanded">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/65">{body}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

/** Service journey preview — the full tape-measure scene arrives in Phase 4. */
export function ServicesPreview() {
  return (
    <section className="bg-ivory-200/60 py-24 sm:py-32">
      <div className="container-site">
        <Reveal>
          <p data-reveal className="eyebrow text-teal-600">
            How it works
          </p>
          <h2 data-reveal className="mt-4 max-w-2xl text-4xl font-bold text-teal-900 sm:text-5xl">
            From measure to magic.
          </h2>
        </Reveal>
        <Reveal className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ivory-300 bg-ivory-300 sm:grid-cols-2 lg:grid-cols-5">
          {serviceSteps.map((step, i) => (
            <div key={step.id} data-reveal className="bg-ivory p-7">
              <p className="font-display text-sm font-semibold text-teal-600">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-6 text-xl font-semibold text-teal-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{step.summary}</p>
            </div>
          ))}
        </Reveal>
        <div className="mt-10">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-teal-700"
          >
            More about our service
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

/** Local reach — written for people, useful for local search. */
export function AreasServed() {
  return (
    <section className="bg-ivory py-20">
      <Reveal className="container-site">
        <h2 data-reveal className="max-w-3xl text-2xl font-semibold text-teal-900 sm:text-3xl">
          Blinds, shutters and pergolas for homes across East Bangalore, from our base in Horamavu,
          KR Puram.
        </h2>
        <ul data-reveal className="mt-8 flex flex-wrap gap-2">
          {site.areasServed.map((area) => (
            <li
              key={area}
              className="rounded-full border border-teal-700/20 px-4 py-1.5 text-sm text-teal-800"
            >
              {area}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}

/** Finale — "Curtain call". The closing-curtains choreography lands in a later phase. */
export function CurtainCall() {
  return (
    <section className="relative isolate overflow-hidden rounded-b-[1.75rem] bg-teal-950 py-28 text-white sm:rounded-b-[2.5rem] sm:py-36">
      <div
        aria-hidden
        className="curtain-fabric absolute inset-y-0 left-0 -z-10 w-[14%] opacity-90"
      />
      <div
        aria-hidden
        className="curtain-fabric absolute inset-y-0 right-0 -z-10 w-[14%] opacity-90"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 40% 60% at 50% 50%, rgb(242 200 121 / 0.16), transparent 70%)",
        }}
      />
      <Reveal className="container-site text-center">
        <p data-reveal className="eyebrow text-sunlight">
          Curtain call
        </p>
        <h2 data-reveal className="mx-auto mt-5 max-w-3xl text-4xl font-bold sm:text-6xl">
          Book a free measure &amp; quote.
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-xl text-white/70">
          Tell us about your windows and we&apos;ll visit, measure and bring fabrics to you,
          anywhere in Bangalore.
        </p>
        <div
          data-reveal
          className="mx-auto mt-10 flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center"
        >
          <Button asChild size="cta" variant="light">
            <Link href="/contact">
              Get a quote <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild size="cta" variant="outline-light">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden /> WhatsApp
            </a>
          </Button>
        </div>
        <ul
          data-reveal
          className="mx-auto mt-10 grid max-w-sm gap-3 border-t border-white/10 pt-8 sm:max-w-xl sm:grid-cols-2"
        >
          {site.contacts.map((c) => (
            <li key={c.tel}>
              <a
                href={`tel:${c.tel}`}
                className="group flex items-center justify-center gap-3 rounded-full px-4 py-2 transition-colors hover:bg-white/5"
              >
                <Phone className="size-4 text-sunlight" aria-hidden />
                <span className="text-sm text-white/55">{c.name}</span>
                <span className="font-semibold text-white group-hover:text-sunlight">
                  {c.phone}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
