import type { Metadata } from "next"
import { Phone } from "lucide-react"
import { PageHeader } from "@/components/sections/PageHeader"
import { Reveal } from "@/components/sections/Reveal"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "About | Behind the Curtain",
  description:
    "Lourtex makes and installs blinds, motorised shutters and pergolas from Horamavu, KR Puram, Bangalore, for homes and businesses across the city.",
}

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="Behind the curtain." tone="dark">
        Lourtex is a Bangalore blinds, shutters and pergolas business built on a simple idea: the
        people who measure your windows should be the people who make and fit what goes on them.
      </PageHeader>

      <section className="bg-ivory py-24">
        <Reveal className="container-site grid gap-12 lg:grid-cols-12">
          <div data-reveal className="lg:col-span-5">
            <p className="eyebrow text-teal-600">Our story</p>
            <h2 className="mt-4 text-4xl font-bold text-teal-900">Made in East Bangalore.</h2>
          </div>
          <div data-reveal className="space-y-5 text-lg leading-relaxed text-ink/70 lg:col-span-7">
            {/* Placeholder copy — replace with the founders' own story. */}
            <p>
              From our base in Horamavu, KR Puram, we fit out windows, terraces and storefronts in
              apartments, villas and offices across the city, from a single bedroom blind to a whole
              new home.
            </p>
            <p>
              Every job starts with a visit: we measure, bring fabrics, finishes and working samples
              to you, and talk through how each room is used. Then we make everything to size and
              fit it ourselves, so there are no surprises on installation day.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="bg-white py-24">
        <div className="container-site">
          <p className="eyebrow text-teal-600">The team</p>
          <h2 className="mt-4 text-4xl font-bold text-teal-900">The people you&apos;ll talk to.</h2>
          <Reveal className="mt-12 grid gap-5 sm:grid-cols-2">
            {site.contacts.map((c) => (
              <div key={c.tel} data-reveal className="rounded-2xl bg-teal-800 p-8 text-white">
                <div
                  aria-hidden
                  className="h-2 w-16 rounded-full stripes [--slat-gap:4px] [--slat:3px]"
                />
                <h3 className="mt-6 text-2xl font-bold">{c.name}</h3>
                <a
                  href={`tel:${c.tel}`}
                  className="mt-4 inline-flex items-center gap-2 text-white/75 hover:text-sunlight"
                >
                  <Phone className="size-4" aria-hidden /> {c.phone}
                </a>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  )
}
