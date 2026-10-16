import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/sections/PageHeader"
import { Reveal } from "@/components/sections/Reveal"
import { WindowFrame } from "@/components/sections/WindowFrame"
import { categories, productsByCategory } from "@/lib/products"

export const metadata: Metadata = {
  title: "Blinds, Motorised Shutters & Pergolas",
  description:
    "Explore made-to-measure zebra, roman, roller, sunscreen, skylight and honeycomb blinds, motorised shutters and pergolas in Bangalore.",
}

export default function ProductsPage() {
  return (
    <>
      <PageHeader eyebrow="Products" title="Shade for every window, and the terrace.">
        Hover over a window to see how it works. Everything is made to measure and fitted by our own
        team across Bangalore.
      </PageHeader>

      <div className="bg-ivory pb-24">
        {categories.map((cat) => {
          const items = productsByCategory(cat.id)
          return (
            <section
              key={cat.id}
              id={cat.id}
              aria-labelledby={`${cat.id}-heading`}
              className="container-site scroll-mt-28 border-t border-ivory-300 py-16"
            >
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-3">
                  <h2 id={`${cat.id}-heading`} className="text-3xl font-bold text-teal-900">
                    {cat.label}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">{cat.blurb}</p>
                </div>
                <Reveal className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:col-span-9">
                  {items.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      data-reveal
                      className="group outline-none"
                    >
                      <WindowFrame
                        mechanic={p.mechanic}
                        className="group-focus-visible:ring-2 group-focus-visible:ring-teal-600"
                      />
                      <h3 className="mt-4 text-lg font-semibold text-teal-900">{p.name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink/60">{p.summary}</p>
                    </Link>
                  ))}
                </Reveal>
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
