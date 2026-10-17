/** Business facts — single source for footer, contact page and JSON-LD. */
export const site = {
  name: "Lourtex",
  tagline: "Blinds, motorised shutters & pergolas, made to measure in Bangalore",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "curttex2026@gmail.com",
  gstin: "29CTUPM7128L1ZO",
  /** Static so pages stay prerenderable (no request-time Date). */
  copyrightYear: 2026,
  contacts: [
    { name: "Nainas", phone: "+91 94464 20264", tel: "+919446420264" },
    { name: "Sabir", phone: "+91 94462 06391", tel: "+919446206391" },
  ],
  /** Primary WhatsApp line, Nainas (digits only, country code first). */
  whatsapp: "919446420264",
  address: {
    street: "No. 192, 3rd Cross, BPMP, K. Channasandra Village, Horamavu Post",
    locality: "Krishnarajapuram Hobli, Bangalore East Taluk",
    city: "Bangalore",
    region: "Karnataka",
    postalCode: "560113",
    country: "India",
  },
  areasServed: [
    "KR Puram",
    "Horamavu",
    "Kalyan Nagar",
    "HRBR Layout",
    "Ramamurthy Nagar",
    "Banaswadi",
    "Hennur",
    "Whitefield",
    "Indiranagar",
    "Hebbal",
  ],
} as const

export const fullAddress = [
  site.address.street,
  site.address.locality,
  `${site.address.city}, ${site.address.region} ${site.address.postalCode}`,
  site.address.country,
].join(", ")

export function whatsappLink(message = "Hi Lourtex, I'd like a free measure & quote.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
