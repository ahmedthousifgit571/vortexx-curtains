import type { StaticImageData } from "next/image"
import zebraLounge from "@/public/images/zebra blinds/generic1.jpg"
import romanCream from "@/public/images/zebra blinds/generic-2.jpg"
import sunscreenLiving from "@/public/images/zebra blinds/generic-3.jpg"
import zebraGarden from "@/public/images/zebra blinds/generic-4.jpg"
import romanBronze from "@/public/images/zebra blinds/generic-5.jpg"
import sunscreenGlassWall from "@/public/images/zebra blinds/generic-6.jpg"
import sunscreenWarm from "@/public/images/zebra blinds/generic-7.jpg"
import rollerDoubleHeight from "@/public/images/zebra blinds/generic-8.jpg"
import romanSage from "@/public/images/zebra blinds/generic-9.jpg"
import sunscreenSkyline from "@/public/images/zebra blinds/generic-10.jpg"
import rollerGarden from "@/public/images/zebra blinds/generic-11.jpg"

/**
 * Room photography for the home page showcase. Phase 3 moves these into the
 * Sanity `galleryItem` schema; keep the shape close so the swap is mechanical.
 */
export type RoomShot = {
  id: string
  src: StaticImageData
  alt: string
  /** Product slug the photo links to. */
  product: string
  room: string
  /** object-position for tight crops. */
  position?: string
}

/** Ribbon order: neighbours (and the loop seam) never repeat a product. */
export const roomShots: RoomShot[] = [
  {
    id: "sunscreen-warm",
    src: sunscreenWarm,
    alt: "Cream sunscreen blinds filtering warm afternoon sun across tall living-room windows",
    product: "sunscreen",
    room: "Living room",
  },
  {
    id: "zebra-lounge",
    src: zebraLounge,
    alt: "Light grey zebra blinds along a wall of windows in a bright living room with a garden view",
    product: "zebra",
    room: "Living room",
  },
  {
    id: "roman-cream",
    src: romanCream,
    alt: "Cream roman blinds folded halfway up on two bedroom windows behind an upholstered bench",
    product: "roman",
    room: "Bedroom",
  },
  {
    id: "sunscreen-living",
    src: sunscreenLiving,
    alt: "Sheer sunscreen blinds lowered over floor-to-ceiling windows, trees visible through the fabric",
    product: "sunscreen",
    room: "Family room",
  },
  {
    id: "roller-double-height",
    src: rollerDoubleHeight,
    alt: "Tall roller blinds on double-height windows in a living room with built-in bookshelves",
    product: "roller",
    room: "Double-height living",
  },
  {
    id: "zebra-garden",
    src: zebraGarden,
    alt: "Taupe and sheer zebra blinds across a wide window looking onto a garden, above a white sofa",
    product: "zebra",
    room: "Garden lounge",
    position: "50% 30%",
  },
  {
    id: "sunscreen-skyline",
    src: sunscreenSkyline,
    alt: "Dark sunscreen blinds softening the glare in a high-rise lounge with a city skyline view",
    product: "sunscreen",
    room: "High-rise lounge",
  },
  {
    id: "roman-bronze",
    src: romanBronze,
    alt: "Bronze roman blind on a bedroom window framed by full-length drapes in soft morning light",
    product: "roman",
    room: "Bedroom",
    position: "50% 35%",
  },
  {
    id: "roller-garden",
    src: rollerGarden,
    alt: "White roller blinds half raised over a glass wall, with an orange sofa and a garden beyond",
    product: "roller",
    room: "Garden room",
    position: "50% 40%",
  },
  {
    id: "sunscreen-glass-wall",
    src: sunscreenGlassWall,
    alt: "Large white screen blinds half lowered across the glass wall of an open-plan living room",
    product: "sunscreen",
    room: "Open-plan living",
  },
  {
    id: "roman-sage",
    src: romanSage,
    alt: "Sage roman blinds on three bedroom windows above a tufted headboard",
    product: "roman",
    room: "Main bedroom",
    position: "50% 30%",
  },
]

export function getRoomShot(id: string) {
  const shot = roomShots.find((s) => s.id === id)
  if (!shot) throw new Error(`Unknown room shot: ${id}`)
  return shot
}
