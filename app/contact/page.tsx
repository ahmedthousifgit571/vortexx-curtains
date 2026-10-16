import type { Metadata } from "next"
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { QuoteForm } from "@/components/sections/contact/QuoteForm"
import { PageHeader } from "@/components/sections/PageHeader"
import { fullAddress, mapsEmbedUrl, mapsLink, site, whatsappLink } from "@/lib/site"

export const metadata: Metadata = {
  title: "Free Measure & Quote",
  description:
    "Book a free home measurement for blinds, motorised shutters and pergolas in Bangalore. Call, WhatsApp or send a quote request to Lourtex in Horamavu, KR Puram.",
}

/** Matches the visit described in the page intro. */
const nextSteps = [
  "We call to fix a time that suits you.",
  "We visit with samples and measure every window.",
  "We send you a clear quote.",
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Book a free <em className="text-teal-600">measure &amp; quote</em>.
          </>
        }
      >
        Tell us a little about your windows. We&apos;ll call to fix a time, visit with fabric
        samples, measure everything and send a clear quote.
      </PageHeader>

      <section aria-label="Request a free measure" className="bg-ivory pb-6 sm:pb-8">
        <div className="container-site">
          <div className="grid overflow-clip rounded-[1.75rem] border border-ivory-300 bg-white shadow-[0_40px_80px_-50px_rgb(11_40_51/0.35)] sm:rounded-[2.5rem] lg:grid-cols-12">
            <div className="p-6 sm:p-10 lg:col-span-7 lg:p-12">
              <QuoteForm />
            </div>

            {/* Talk to us directly */}
            <aside
              aria-labelledby="talk-direct"
              className="relative isolate overflow-clip bg-teal-900 p-6 text-white sm:p-10 lg:col-span-5 lg:p-12"
            >
              <div
                aria-hidden
                className="absolute inset-y-0 right-0 -z-10 w-3/5 stripes [mask-image:linear-gradient(90deg,transparent,black)] [--slat-gap:18px] [--slat:3px] [--stripe-alpha:0.05]"
              />
              <div
                aria-hidden
                className="absolute -top-32 -right-24 -z-10 size-96 rounded-full bg-sunlight/15 blur-3xl"
              />

              <div className="lg:sticky lg:top-28">
                <p className="eyebrow text-sunlight">Prefer to talk?</p>
                <h2 id="talk-direct" className="mt-4 text-4xl leading-[1.05] sm:text-5xl">
                  Message or call us <em className="text-teal-200">directly</em>.
                </h2>

                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 flex items-center gap-4 rounded-2xl bg-white p-4 pr-5 text-teal-900 transition-colors outline-none hover:bg-ivory focus-visible:ring-2 focus-visible:ring-sunlight focus-visible:ring-offset-2 focus-visible:ring-offset-teal-900"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
                    <MessageCircle className="size-6" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">Chat on WhatsApp</span>
                    <span className="block text-sm text-ink/60">
                      Send photos for a quicker estimate
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-5 shrink-0 text-teal-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </a>

                <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
                  {site.contacts.map((c) => (
                    <li key={c.tel}>
                      <a
                        href={`tel:${c.tel}`}
                        className="group flex min-h-16 items-center justify-between gap-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-sunlight"
                      >
                        <span>
                          <span className="block text-xs text-white/55">Call {c.name}</span>
                          <span className="mt-0.5 block text-lg font-semibold tabular-nums group-hover:text-sunlight">
                            {c.phone}
                          </span>
                        </span>
                        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 transition-colors group-hover:border-sunlight group-hover:bg-sunlight group-hover:text-teal-900">
                          <Phone className="size-4" aria-hidden />
                        </span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href={`mailto:${site.email}`}
                      className="group flex min-h-16 items-center justify-between gap-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-sunlight"
                    >
                      <span className="min-w-0">
                        <span className="block text-xs text-white/55">Email</span>
                        <span className="mt-0.5 block truncate font-semibold group-hover:text-sunlight">
                          {site.email}
                        </span>
                      </span>
                      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 transition-colors group-hover:border-sunlight group-hover:bg-sunlight group-hover:text-teal-900">
                        <Mail className="size-4" aria-hidden />
                      </span>
                    </a>
                  </li>
                </ul>

                <h3 className="mt-10 eyebrow text-white/55">What happens next</h3>
                <ol className="mt-5 space-y-4">
                  {nextSteps.map((step, i) => (
                    <li key={step} className="flex gap-4">
                      <span className="font-display text-2xl leading-none text-sunlight">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 leading-relaxed text-white/75">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>

          {/* Visit the workshop */}
          <div className="mt-6 grid overflow-hidden rounded-[1.75rem] border border-ivory-300 bg-white sm:rounded-[2.5rem] lg:grid-cols-12">
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-5 lg:p-12">
              <p className="eyebrow text-teal-600">Visit us</p>
              <h2 className="mt-3 text-4xl text-teal-900 sm:text-5xl">
                Our workshop in <em className="text-teal-600">Horamavu</em>.
              </h2>
              <address className="mt-5 flex gap-3 leading-relaxed text-ink/65 not-italic">
                <MapPin className="mt-1 size-4 shrink-0 text-teal-600" aria-hidden />
                {fullAddress}
              </address>
              <p className="mt-4 text-sm leading-relaxed text-ink/55">
                We measure and fit across East Bangalore, including{" "}
                {site.areasServed.slice(0, 5).join(", ")} and more.
              </p>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-7 inline-flex h-12 items-center gap-2 self-start rounded-full border border-teal-700/25 px-6 text-sm font-semibold text-teal-800 transition-colors outline-none hover:border-teal-800 hover:bg-teal-800 hover:text-white focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                Get directions
                <ArrowUpRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </a>
            </div>
            <div className="relative min-h-72 bg-teal-100 sm:min-h-96 lg:col-span-7">
              {/* Tinted toward the brand teal so the map doesn't shout over the page. */}
              <iframe
                title="Lourtex workshop on Google Maps"
                src={mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0 [filter:grayscale(1)_sepia(0.35)_hue-rotate(150deg)_saturate(1.3)_contrast(1.05)]"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
