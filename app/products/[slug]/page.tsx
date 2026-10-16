import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/sections/Reveal"
import { WindowFrame } from "@/components/sections/WindowFrame"
import { ProductDemo } from "@/components/sections/product/ProductDemo"
import { ProductShowcase } from "@/components/sections/product/ProductShowcase"
import { categories, getProduct, products, productsByCategory } from "@/lib/products"
import { site, whatsappLink } from "@/lib/site"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug)
  if (!product) return {}
  return {
    title: `${product.name} in Bangalore`,
    description: `${product.summary} Made to measure and installed by Lourtex across Bangalore.`,
  }
}

/** Shared shell shown instantly on client navigation while the product streams in. */
function ProductShell() {
  return (
    <section className="min-h-[80svh] bg-ivory pt-[calc(var(--header-h)+3rem)] pb-20">
      <div className="container-site" aria-busy>
        <div className="h-4 w-24 rounded-full bg-ivory-300" />
        <div className="mt-10 h-16 w-3/4 max-w-xl rounded-xl bg-ivory-200" />
        <div className="mt-6 h-24 max-w-xl rounded-xl bg-ivory-200/70" />
      </div>
    </section>
  )
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductShell />}>
      <ProductContent params={params} />
    </Suspense>
  )
}

/** "Zebra Blinds" → "Zebra" + italic "Blinds", the editorial split used on the hero. */
function SplitName({ name }: { name: string }) {
  const words = name.split(" ")
  if (words.length < 2) return <>{name}</>
  return (
    <>
      {words.slice(0, -1).join(" ")} <em className="text-teal-600">{words.at(-1)}</em>
    </>
  )
}

async function ProductContent({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const product = getProduct((await params).slug)
  if (!product) notFound()
  const { howItWorks } = product
  const category = categories.find((c) => c.id === product.category)
  const siblings = productsByCategory(product.category)
  const position = siblings.findIndex((p) => p.slug === product.slug) + 1
  const sameCategory = siblings.filter((p) => p.slug !== product.slug)
  // Single-product categories (shutters, pergolas) cross-link to the rest of the range.
  const related =
    sameCategory.length > 0 ? sameCategory : products.filter((p) => p.slug !== product.slug)
  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ivory pt-[calc(var(--header-h)+2.5rem)] pb-24">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 55% 50% at 78% 38%, rgb(242 200 121 / 0.32), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 light-slats [mask-image:radial-gradient(ellipse_at_75%_45%,black,transparent_65%)] opacity-50"
        />
        <div className="container-site">
          <Link
            href={`/products#${product.category}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-600"
          >
            <ArrowLeft className="size-4" aria-hidden /> All {category?.label.toLowerCase()}
          </Link>

          <div className="mt-8 grid items-center gap-12 lg:mt-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <p className="eyebrow text-teal-600">
                {category?.label}
                {siblings.length > 1 && (
                  <span className="ml-3 text-teal-700/50">
                    {pad(position)} / {pad(siblings.length)}
                  </span>
                )}
              </p>
              <h1 className="mt-5 text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.9] text-teal-900">
                <SplitName name={product.name} />
              </h1>
              <p className="mt-7 max-w-lg font-display text-2xl leading-snug text-teal-800 sm:text-3xl">
                {product.summary}
              </p>
              <p className="mt-5 max-w-xl leading-relaxed text-ink/65">{product.description}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="cta">
                  <Link href="/contact">
                    Book a free measure <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="cta" variant="outline" className="border-teal-700/30">
                  <a
                    href={whatsappLink(`Hi Lourtex, I'm interested in ${product.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle aria-hidden /> Ask on WhatsApp
                  </a>
                </Button>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/55">
                {["Free home measure", "Made to size", "Fitted by our own team"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-teal-600" aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-first lg:order-none lg:col-span-6">
              <ProductShowcase
                images={product.images}
                name={product.name}
                mechanic={product.mechanic}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works — operable demo */}
      <section className="relative overflow-hidden bg-teal-900 py-24 text-white sm:py-32">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-1/2 stripes [mask-image:linear-gradient(90deg,black,transparent)] [--slat-gap:22px] [--slat:3px] [--stripe-alpha:0.06]"
        />
        <div className="relative container-site grid items-center gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <p data-reveal className="eyebrow text-sunlight">
              How it works
            </p>
            <h2 data-reveal className="mt-5 text-4xl leading-[1.02] sm:text-6xl">
              {howItWorks.title} <em className="text-sunlight-soft">{howItWorks.accent}</em>
            </h2>
            <p data-reveal className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
              {howItWorks.body}
            </p>
            <dl data-reveal className="mt-10 grid max-w-lg grid-cols-2 gap-6">
              {howItWorks.states.map((s) => (
                <div key={s.term} className="border-l-2 border-sunlight/60 pl-5">
                  <dt className="eyebrow text-white/50">{s.term}</dt>
                  <dd className="mt-2 text-white/85">{s.detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <div className="lg:col-span-6">
            <ProductDemo mechanic={product.mechanic} demo={howItWorks.demo} name={product.name} />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-ivory py-24 sm:py-28">
        <div className="container-site">
          <Reveal className="grid gap-px overflow-hidden rounded-3xl border border-ivory-300 bg-ivory-300 md:grid-cols-3">
            {product.highlights.map((h, i) => (
              <div key={h.title} data-reveal className="bg-ivory p-8 sm:p-10">
                <p className="font-display text-6xl text-teal-700/25">{pad(i + 1)}</p>
                <h3 className="mt-8 text-2xl text-teal-900">{h.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/65">{h.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Best for + options */}
      <section className="bg-white py-24">
        <Reveal className="container-site grid gap-14 md:grid-cols-12">
          <div data-reveal className="md:col-span-5">
            <h2 className="eyebrow text-teal-600">Best for</h2>
            <ul className="mt-6 divide-y divide-ivory-300 border-y border-ivory-300">
              {product.bestFor.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between py-4 font-display text-2xl text-teal-900"
                >
                  {item}
                  <Check className="size-5 text-teal-600" aria-hidden />
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal className="md:col-span-6 md:col-start-7">
            <h2 className="eyebrow text-teal-600">Options</h2>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {product.options.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-teal-700/20 bg-ivory px-5 py-2.5 text-sm text-teal-800"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-ink/55">
              Not sure what suits your windows? We bring fabric samples and working demos to your
              home during the free measure.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Call to action */}
      <section className="relative isolate overflow-hidden bg-teal-800 py-20 text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 stripes [mask-image:linear-gradient(90deg,transparent,black)] [--slat-gap:18px] [--slat:3px] [--stripe-alpha:0.07]"
        />
        <div className="container-site flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <h2 className="max-w-2xl text-4xl leading-tight sm:text-5xl">
            Want {product.name.toLowerCase()} at home?{" "}
            <em className="text-sunlight-soft">We&apos;ll come and measure, free.</em>
          </h2>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button asChild size="cta" variant="light">
              <Link href="/contact">
                Get a quote <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="cta" variant="outline-light">
              <a href={`tel:${site.contacts[0].tel}`}>
                <Phone aria-hidden /> Call
              </a>
            </Button>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-ivory py-24">
          <div className="container-site">
            <h2 className="text-4xl text-teal-900">
              {sameCategory.length > 0
                ? `More ${category?.label.toLowerCase()}`
                : "Explore the range"}
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
              {related.slice(0, 4).map((p) => (
                <Link key={p.slug} href={`/products/${p.slug}`} className="group outline-none">
                  <WindowFrame
                    mechanic={p.mechanic}
                    className="group-focus-visible:ring-2 group-focus-visible:ring-teal-600"
                  />
                  <h3 className="mt-4 text-xl text-teal-900">{p.name}</h3>
                  <p className="mt-1 text-sm text-ink/55">{p.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
