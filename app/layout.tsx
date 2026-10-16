import type { Metadata, Viewport } from "next"
import { Archivo, Instrument_Serif, Manrope, Monsieur_La_Doulaise } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { InlineScript } from "@/components/layout/InlineScript"
import { SmoothScroll } from "@/components/providers/SmoothScroll"
import { Remote } from "@/components/remote/Remote"
import { introScript } from "@/lib/intro-script"
import { site } from "@/lib/site"
import "./globals.css"

// Display: condensed high-contrast serif. Single weight — bold is never synthesised (see globals.css).
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
})
// Labels: Archivo with the width axis, used at its widest (125%).
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
})
// Script accent — decorative only, never preloaded.
const script = Monsieur_La_Doulaise({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script-face",
  display: "swap",
  preload: false,
})
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Lourtex | Blinds, Motorised Shutters & Pergolas in Bangalore",
    template: "%s · Lourtex",
  },
  description:
    "Made-to-measure zebra, roman, roller, sunscreen, skylight and honeycomb blinds, motorised shutters and pergolas in Bangalore. Free home measurement across KR Puram, Horamavu and East Bangalore.",
  applicationName: "Lourtex",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Lourtex",
  },
}

export const viewport: Viewport = {
  themeColor: "#154A5E",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${instrumentSerif.variable} ${archivo.variable} ${script.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={introScript} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Remote />
        </SmoothScroll>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
