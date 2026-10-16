/**
 * Customer reviews. Phase 3 moves these into the Sanity `testimonial` schema;
 * keep the shape close so the swap is mechanical.
 *
 * Every entry below is a SAMPLE written to design the section. Samples are
 * flagged `placeholder: true` and never render in production builds (unless
 * SHOW_SAMPLE_REVIEWS=true for a preview deploy). Publishing invented reviews
 * as genuine is an unfair trade practice. Replace them with real customer
 * words, with the customer's permission, and drop the flag.
 */
export type Testimonial = {
  id: string
  name: string
  /** e.g. "Homeowner", "Café owner" */
  role: string
  area: string
  /** Product slug the review is about. */
  product: string
  quote: string
  rating: 1 | 2 | 3 | 4 | 5
  placeholder?: boolean
}

export const testimonials: Testimonial[] = [
  {
    id: "sample-zebra",
    name: "Priya Raman",
    role: "Homeowner",
    area: "Kalyan Nagar",
    product: "zebra",
    quote:
      "Our living room faces west and by four o'clock it was unbearable. The zebra blinds fixed that. They brought swatches home, measured every window themselves, and the fit is perfect.",
    rating: 5,
    placeholder: true,
  },
  {
    id: "sample-shutters",
    name: "Arvind Shetty",
    role: "Villa owner",
    area: "Whitefield",
    product: "motorised-shutters",
    quote:
      "We wanted motorised shutters for when we travel. They explained the options honestly, fitted everything in two days and left the place spotless. One button and the whole ground floor is closed.",
    rating: 5,
    placeholder: true,
  },
  {
    id: "sample-pergola",
    name: "Meera Nair",
    role: "Café owner",
    area: "Indiranagar",
    product: "pergolas",
    quote:
      "The louvred pergola turned our terrace into the busiest part of the café. We tilt it for afternoon shade and close it when it rains, and guests simply stay longer.",
    rating: 5,
    placeholder: true,
  },
  {
    id: "sample-roman",
    name: "Kavya Rao",
    role: "Apartment owner",
    area: "HRBR Layout",
    product: "roman",
    quote:
      "We couldn't choose fabrics until they showed us samples in our own evening light. The roman blinds look tailored, fold neatly and block the streetlight completely. On time, both days.",
    rating: 5,
    placeholder: true,
  },
  {
    id: "sample-honeycomb",
    name: "Dr. Sanjay Kulkarni",
    role: "Clinic owner",
    area: "Hennur",
    product: "honeycomb",
    quote:
      "Our consultation rooms needed privacy without feeling dark. The honeycomb blinds give soft, even light and the rooms stay noticeably cooler. They even fitted them on a Sunday.",
    rating: 5,
    placeholder: true,
  },
  {
    id: "sample-skylight",
    name: "Farah Siddiqui",
    role: "Homeowner",
    area: "Horamavu",
    product: "skylight",
    quote:
      "The skylight over our double-height hall made afternoons glaring. Now it closes from a remote after lunch. Neat work, and a small motor setting was sorted over the phone in a day.",
    rating: 5,
    placeholder: true,
  },
]

/** Reviews safe to render here: samples only in development or an opted-in preview. */
export function publishedTestimonials() {
  const showSamples =
    process.env.NODE_ENV !== "production" || process.env.SHOW_SAMPLE_REVIEWS === "true"
  return testimonials.filter((t) => !t.placeholder || showSamples)
}
