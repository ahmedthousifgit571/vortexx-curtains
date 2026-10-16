import type { Metadata } from "next"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/sections/PageHeader"
import { whatsappLink } from "@/lib/site"

export const metadata: Metadata = {
  title: "Gallery | Blinds, Shutters & Pergolas Installed in Bangalore",
  description:
    "Blind, motorised shutter and pergola installations by Lourtex in homes across Bangalore.",
}

/** The filterable masonry + before/after arrive in Phase 5, fed by real install photos. */
export default function GalleryPage() {
  return (
    <>
      <PageHeader eyebrow="Gallery" title="Real rooms, real installs.">
        We&apos;re putting together photos of recent installations. Until then, ask us on WhatsApp
        and we&apos;ll share work similar to what you have in mind.
      </PageHeader>
      <section className="bg-ivory pb-24">
        <div className="container-site">
          <Button asChild size="cta">
            <a
              href={whatsappLink("Hi Lourtex, could you share photos of your recent work?")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle aria-hidden /> Ask for photos
            </a>
          </Button>
        </div>
      </section>
    </>
  )
}
