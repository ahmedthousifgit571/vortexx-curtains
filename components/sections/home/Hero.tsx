import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroHeadline } from "./HeroHeadline"
import { HeroWindow } from "./HeroWindow"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ivory pt-[var(--header-h)]">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 55% at 72% 30%, rgb(242 200 121 / 0.42), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 light-slats [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)] opacity-60"
      />

      <div className="container-site grid min-h-[calc(100svh-var(--header-h))] items-center gap-10 py-10 sm:gap-14 sm:py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-7">
          <HeroHeadline>
            <p data-hero-fade className="eyebrow text-teal-600">
              Blinds · Shutters · Pergolas
            </p>
            <h1 className="mt-5 text-[clamp(4rem,11vw,9rem)] leading-[0.88] text-teal-900">
              Let the <em className="text-teal-600">light</em> in.
            </h1>
            <p
              data-hero-fade
              className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:mt-7 sm:text-lg"
            >
              Made-to-measure blinds, motorised shutters and pergolas for homes and businesses.
              Measured on site, made to size and fitted by our own team.
            </p>
            <div data-hero-fade className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="cta">
                <Link href="/contact">
                  Book a free measure <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="cta" variant="outline" className="border-teal-700/30">
                <Link href="/products">Explore products</Link>
              </Button>
            </div>
          </HeroHeadline>
        </div>
        <div className="lg:col-span-5">
          <HeroWindow />
        </div>
      </div>
    </section>
  )
}
