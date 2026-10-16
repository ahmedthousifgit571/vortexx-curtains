import Link from "next/link"
import { ArrowUpRight, Quote, Star } from "lucide-react"
import { Reveal } from "@/components/sections/Reveal"
import { getProduct } from "@/lib/products"
import { publishedTestimonials, type Testimonial } from "@/lib/testimonials"
import { cn } from "@/lib/utils"
import { ReviewRibbon } from "./ReviewRibbon"

/** One copy of the ribbon needs this many cards to span a wide screen; short lists repeat. */
const MIN_CARDS = 8

const initials = (name: string) =>
  name
    .replace(/^Dr\.?\s+/, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")

/** "Kind words": customer reviews drifting past, leading into the Curtain call CTA. Renders nothing without reviews. */
export function Testimonials() {
  const reviews = publishedTestimonials()
  if (!reviews.length) return null

  const repeats = Math.ceil(MIN_CARDS / reviews.length)
  const cards = Array.from({ length: repeats }, (_, r) =>
    reviews.map((review) => <ReviewCard key={`${r}-${review.id}`} review={review} echo={r > 0} />),
  ).flat()

  return (
    <section
      aria-labelledby="reviews-title"
      className="relative isolate overflow-hidden bg-ivory-200 py-24 sm:py-32"
    >
      {/* Morning light falling through a blind onto the wall, above the heading only */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 light-slats [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,black,transparent)] opacity-60"
      />
      <Reveal className="container-site text-center">
        <p data-reveal className="eyebrow text-teal-600">
          Kind words
        </p>
        <h2
          data-reveal
          id="reviews-title"
          className="mx-auto mt-4 max-w-4xl text-4xl text-teal-900 sm:text-6xl lg:text-7xl"
        >
          Straight from <em className="text-teal-600">brighter rooms</em>.
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-ink/65">
          What homeowners and businesses tell us once the tape measure is packed away and the light
          is just right.
        </p>
      </Reveal>

      <ReviewRibbon cards={cards.length}>{cards}</ReviewRibbon>
    </section>
  )
}

/** `echo`: a repeat that pads out a short list, hidden from screen readers and the tab order. */
function ReviewCard({ review, echo }: { review: Testimonial; echo: boolean }) {
  const product = getProduct(review.product)!
  return (
    <figure
      aria-hidden={echo || undefined}
      inert={echo}
      className="group/card relative flex w-[min(76vw,19rem)] shrink-0 flex-col pt-8 transition-[translate] duration-500 ease-out-soft hover:-translate-y-1.5 sm:w-84"
    >
      {/* Initials on a slatted teal disc, notched into the card's top edge */}
      <span
        aria-hidden
        className="absolute top-0 left-1/2 z-10 grid size-16 -translate-x-1/2 place-items-center overflow-hidden rounded-full bg-teal-800 font-display text-xl text-sunlight ring-[5px] ring-ivory-200"
      >
        <span className="absolute inset-0 stripes [--slat-gap:7px] [--slat:2px] [--stripe-alpha:0.1]" />
        <span className="relative">{initials(review.name)}</span>
      </span>

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-white px-6 pt-12 pb-6 transition-shadow duration-500 ease-out-soft group-hover/card:shadow-[0_32px_60px_-34px_rgb(11_40_51/0.45)]">
        <div className="flex items-start justify-between gap-4">
          <Quote aria-hidden className="size-7 shrink-0 fill-teal-700 stroke-none" />
          <Link
            href={`/products/${product.slug}`}
            className="group/tag inline-flex items-center gap-1.5 rounded-full border border-teal-700/15 px-3 py-1.5 font-label text-[0.58rem] font-semibold tracking-[0.18em] text-teal-700 uppercase font-stretch-expanded transition-colors outline-none hover:border-teal-700 hover:bg-teal-700 hover:text-white focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            {product.name}
            <ArrowUpRight
              aria-hidden
              className="size-3 transition-transform group-hover/tag:translate-x-0.5 group-hover/tag:-translate-y-0.5"
            />
          </Link>
        </div>

        <Stars rating={review.rating} />
        <blockquote className="mt-3 text-[0.925rem] leading-relaxed text-pretty text-ink/70">
          <p>{review.quote}</p>
        </blockquote>

        <figcaption className="mt-auto pt-6">
          <p className="font-semibold text-teal-900">{review.name}</p>
          <p className="text-sm text-ink/55">
            {review.role}, {review.area}
          </p>
        </figcaption>

        {/* Hover: a run of blind slats along the bottom rail */}
        <span
          aria-hidden
          className="absolute inset-x-8 bottom-0 h-1.5 origin-left scale-x-0 rounded-t-full bg-teal-700 stripes transition-transform duration-700 ease-out-soft [--slat-gap:5px] [--slat:2px] [--stripe-alpha:0.35] group-hover/card:scale-x-100"
        />
      </div>
    </figure>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div role="img" aria-label={`Rated ${rating} out of 5`} className="mt-5 flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            "size-3.5",
            i < rating ? "fill-teal-600 text-teal-600" : "fill-transparent text-teal-600/25",
          )}
        />
      ))}
    </div>
  )
}
