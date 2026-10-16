import type { Metadata } from "next"
import { PageHeader } from "@/components/sections/PageHeader"

export const metadata: Metadata = {
  title: "Light Lab | Compare Blackout, Sheer & Dual Blinds",
  description:
    "See how blockout, light-filtering, sheer and dual (zebra) fabrics change the light in a room through the day.",
}

const fabrics = [
  ["Blockout", "Stops almost all light. Best for bedrooms, nurseries and home theatres."],
  ["Light-filtering", "Softens daylight and gives privacy without darkening the room."],
  ["Sheer", "Diffuses glare into a glow and keeps the view."],
  ["Dual / zebra", "Alternating sheer and solid bands. Switch between the two."],
] as const

/** The interactive time-of-day simulator arrives in Phase 5. */
export default function LightLabPage() {
  return (
    <>
      <PageHeader eyebrow="Light Lab" title="How much light do you want in?" tone="dark">
        Soon you&apos;ll be able to move the sun from sunrise to night and see how each fabric
        changes your room. For now, here&apos;s the short version.
      </PageHeader>
      <section className="bg-ivory py-20">
        <ul className="container-site grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fabrics.map(([title, body], i) => (
            <li key={title} className="rounded-2xl border border-ivory-300 bg-white p-7">
              <div
                aria-hidden
                className="h-20 rounded-lg"
                style={{
                  background: `linear-gradient(180deg, rgb(242 200 121 / ${[0.05, 0.4, 0.75, 0.5][i]}), rgb(21 74 94 / ${[0.9, 0.35, 0.08, 0.3][i]}))`,
                }}
              />
              <h2 className="mt-6 text-xl font-semibold text-teal-900">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{body}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
