import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/sections/PageHeader"
import { Reveal } from "@/components/sections/Reveal"
import { serviceSteps } from "@/lib/services"

export const metadata: Metadata = {
  title: "Our Service | Measure, Make, Install",
  description:
    "Free home measurement, in-home consultation, made-to-size manufacture and professional installation of blinds, motorised shutters and pergolas across Bangalore.",
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader eyebrow="Services" title="From measure to magic.">
        One team from the first measurement to the last adjustment, so what you choose is exactly
        what gets fitted.
      </PageHeader>

      <section className="bg-ivory pb-24">
        <ol className="container-site">
          {serviceSteps.map((step, i) => (
            <li key={step.id} className="border-t border-ivory-300 py-12">
              <Reveal className="grid gap-6 md:grid-cols-12">
                <p
                  data-reveal
                  className="font-display text-6xl font-bold text-teal-700/20 md:col-span-2"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 data-reveal className="text-3xl font-bold text-teal-900 md:col-span-3">
                  {step.title}
                </h2>
                <div data-reveal className="md:col-span-7">
                  <p className="text-lg font-medium text-teal-900">{step.summary}</p>
                  <p className="mt-3 leading-relaxed text-ink/65">{step.detail}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="container-site mt-6">
          <Button asChild size="cta">
            <Link href="/contact">
              Book a free measure <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
