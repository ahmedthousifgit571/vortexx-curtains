import { MessageCircle } from "lucide-react"
import { Reveal } from "@/components/sections/Reveal"
import { site, whatsappLink } from "@/lib/site"
import { ShowcaseVideo } from "./ShowcaseVideo"

const [primary] = site.contacts
/** "Sabir K.S" → "SK", "Nainas" → "N" */
const initials = (name: string) =>
  name
    .split(/[\s.]+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")

/** "Let's talk": a white card with the WhatsApp CTA beside a looping breeze-through-curtains video. */
export function LetsTalk() {
  return (
    <section aria-labelledby="talk-title" className="bg-ivory pt-16 pb-6 sm:pt-24 sm:pb-8">
      <div className="container-site">
        <div className="rounded-[1.75rem] border border-ivory-300 bg-white p-4 sm:rounded-[2.5rem] sm:p-8 lg:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
            <Reveal className="flex flex-col items-start px-2 py-2 sm:px-4 sm:py-6 lg:pl-6">
              <p
                data-reveal
                className="rounded-full border border-ivory-300 px-4 py-2 eyebrow text-teal-700"
              >
                Free home visit
              </p>
              <h2
                data-reveal
                id="talk-title"
                className="mt-6 text-5xl text-teal-900 sm:text-6xl lg:text-7xl"
              >
                Let&apos;s <em className="text-teal-600">talk</em>
              </h2>
              <p data-reveal className="mt-5 max-w-sm leading-relaxed text-ink/65">
                Send us a photo of your windows and tell us how much light you want. Nainas or Sabir
                will reply on WhatsApp and set up a free visit to measure.
              </p>

              <div data-reveal className="mt-9">
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact us on WhatsApp"
                  className="group inline-flex items-center gap-4 rounded-full bg-teal-800 py-2 pr-2.5 pl-7 text-sm font-semibold text-white transition-[background-color,scale] duration-300 outline-none hover:scale-[1.02] hover:bg-teal-900 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                >
                  Contact us
                  <span
                    aria-hidden
                    className="flex items-center transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    {site.contacts.map((c) => (
                      <span
                        key={c.tel}
                        className="-ml-2 grid size-10 place-items-center rounded-full border-2 border-teal-800 bg-sunlight font-display text-[0.95rem] text-teal-900 group-hover:border-teal-900 first:ml-0"
                      >
                        {initials(c.name)}
                      </span>
                    ))}
                    <span className="-ml-2 grid size-10 place-items-center rounded-full border-2 border-teal-800 bg-[#25D366] group-hover:border-teal-900">
                      <MessageCircle className="size-4" />
                    </span>
                  </span>
                </a>
              </div>

              <p data-reveal className="mt-6 text-sm text-ink/55 italic">
                * Free measure and quote, anywhere in Bangalore
              </p>

              <p data-reveal className="mt-10 text-sm text-ink/60">
                Prefer to call?{" "}
                <a
                  href={`tel:${primary.tel}`}
                  className="font-semibold text-teal-900 transition-colors hover:text-teal-600"
                >
                  {primary.phone}
                </a>{" "}
                · Horamavu, Bangalore
              </p>
            </Reveal>

            <Reveal className="relative isolate aspect-4/3 overflow-hidden rounded-[1.25rem] bg-teal-900 sm:rounded-[1.75rem] lg:aspect-auto lg:min-h-120 lg:self-stretch">
              <ShowcaseVideo
                slot="contact-breeze"
                label="Linen curtains lifting in the breeze at an open garden door"
                // The curtain hangs at the left of the frame; keep it in the narrower crops.
                position="12% center"
              />
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-ink/10" />
              <p className="absolute bottom-4 left-4 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md sm:bottom-5 sm:left-5">
                Let the light in · Bangalore
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
