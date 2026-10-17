import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { LogoMark } from "@/components/layout/Wordmark"
import { Reveal } from "@/components/sections/Reveal"
import { roomsBento } from "@/lib/motion"
import { getProduct, products } from "@/lib/products"
import { getRoomShot, roomShots, type RoomShot } from "@/lib/rooms"
import { cn } from "@/lib/utils"
import { RoomsBento } from "./RoomsBento"
import { RoomsRibbon } from "./RoomsRibbon"
import { ShowcaseVideo } from "./ShowcaseVideo"

/**
 * Bento: the skylight video leads (a), a tall portrait photo (t), photo tiles
 * (b–e) and the quote tile (f). Two columns below lg, twelve from lg.
 */
const bentoGrid = cn(
  "grid auto-rows-[9.5rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:gap-4 lg:auto-rows-[11rem] lg:grid-cols-12 xl:auto-rows-[12.5rem]",
  "[grid-template-areas:'a_a'_'a_a'_'t_b'_'t_c'_'d_e'_'f_f']",
  "lg:[grid-template-areas:'a_a_a_a_a_a_t_t_t_b_b_b'_'a_a_a_a_a_a_t_t_t_c_c_c'_'d_d_d_d_e_e_e_e_e_f_f_f']",
)

/** Photo slots. `sizes` follows the lg grid: 12 columns across a 67rem content width. */
const bento = [
  // Square source, so it crops cleanly to the tall slot.
  { area: "t", shot: "roman-bronze", sizes: "(min-width: 64rem) 16rem, 46vw" },
  { area: "b", shot: "zebra-lounge", sizes: "(min-width: 64rem) 16rem, 46vw" },
  { area: "c", shot: "sunscreen-warm", sizes: "(min-width: 64rem) 16rem, 46vw" },
  { area: "d", shot: "roller-garden", sizes: "(min-width: 64rem) 22rem, 46vw" },
  { area: "e", shot: "roman-sage", sizes: "(min-width: 64rem) 28rem, 46vw" },
]

/** Ribbon photo heights (px) at base / sm / lg, matching h-44 / h-56 / h-64. */
const ribbonHeights = [176, 224, 256] as const

const shortName = (name: string) => name.replace(/ Blinds$/, "")

const tileBase =
  "group relative isolate overflow-hidden rounded-2xl bg-teal-900 outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"

/** Room photography: a bento of featured rooms with the skylight video, then a moving ribbon of every photo. */
export function RoomsShowcase() {
  return (
    <section
      aria-labelledby="rooms-title"
      className="relative isolate overflow-hidden bg-ivory pt-24 pb-12 sm:pt-32 sm:pb-16"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 40% at 85% 0%, rgb(242 200 121 / 0.28), transparent 70%)",
        }}
      />

      <div className="container-site">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div data-reveal className="lg:col-span-7">
            <p className="eyebrow text-teal-600">Room by room</p>
            <h2 id="rooms-title" className="mt-4 text-4xl text-teal-900 sm:text-5xl lg:text-6xl">
              Rooms that wake up to <em className="text-teal-600">better light</em>.
            </h2>
          </div>
          <p
            data-reveal
            className="max-w-md text-base leading-relaxed text-ink/65 lg:col-span-5 lg:justify-self-end"
          >
            Ideas for living rooms, bedrooms and double-height spaces. Whatever the room, we measure
            on site and make every blind to size. Tap a photo to see the blind behind it.
          </p>
        </Reveal>

        <RoomsBento className={cn(bentoGrid, "mt-12 sm:mt-16")}>
          <VideoTile area="a" />
          {bento.map(({ area, shot, sizes }) => (
            <PhotoTile key={area} area={area} shot={getRoomShot(shot)} sizes={sizes} />
          ))}
          <QuoteTile />
        </RoomsBento>
      </div>

      <RoomsRibbon
        label="Ideas for every room"
        photos={roomShots.map((shot) => (
          <RibbonPhoto key={shot.id} shot={shot} />
        ))}
        words={products.map((product, i) => (
          <span key={product.slug} className="flex shrink-0 items-center gap-[0.4em]">
            <span
              className={cn(
                i % 2
                  ? "text-transparent [-webkit-text-stroke:1.5px_var(--color-teal-600)]"
                  : "text-teal-900",
              )}
            >
              {shortName(product.name)}
            </span>
            <LogoMark className="size-[0.38em] text-teal-700" />
          </span>
        ))}
      />
    </section>
  )
}

function PhotoTile({ area, shot, sizes }: { area: string; shot: RoomShot; sizes: string }) {
  const product = getProduct(shot.product)!
  return (
    <Link
      href={`/products/${product.slug}`}
      data-tile
      style={{ gridArea: area }}
      className={tileBase}
    >
      <div data-parallax className="absolute inset-x-0 inset-y-[-8%]">
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
          style={shot.position ? { objectPosition: shot.position } : undefined}
        />
      </div>
      <TileCaption room={shot.room} title={product.name} />
      <TileBlind />
    </Link>
  )
}

function VideoTile({ area }: { area: string }) {
  const product = getProduct("skylight")!
  return (
    <div data-tile style={{ gridArea: area }} className={tileBase}>
      <ShowcaseVideo
        slot="skylight-showcase"
        // Portrait clip in a landscape tile: keep both roofs and the remote in frame.
        position="50% 40%"
        label="Skylight blinds gliding shut across a conservatory roof and a kitchen roof light, worked by remote"
      />
      {/* Stretched link under the caption; the play button sits above it. */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={`${product.name}: see the range`}
        className="absolute inset-0 z-[5] rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-inset"
      />
      <span className="pointer-events-none absolute top-3 left-3 z-10 inline-flex items-center gap-2 rounded-full bg-ink/45 py-1.5 pr-3 pl-2.5 text-white ring-1 ring-white/20 sm:top-4 sm:left-4">
        <span className="relative flex size-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-sunlight" />
          <span className="size-1.5 rounded-full bg-sunlight" />
        </span>
        <span className="eyebrow text-[0.55rem]">Motorised</span>
      </span>
      <div className="pointer-events-none relative z-[6] size-full">
        <TileCaption room="Conservatory roof" title={product.name} lead />
      </div>
      <TileBlind />
    </div>
  )
}

function QuoteTile() {
  return (
    <Link
      href="/contact"
      data-tile
      style={{ gridArea: "f" }}
      className={cn(tileBase, "flex flex-col justify-between bg-teal-800 p-5 text-white sm:p-6")}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 stripes [mask-image:linear-gradient(200deg,black,transparent_75%)] [--slat-gap:16px] [--slat:3px] [--stripe-alpha:0.08]"
      />
      <div
        aria-hidden
        className="absolute -top-12 -right-12 -z-10 size-44 rounded-full bg-sunlight/25 blur-3xl transition-transform duration-700 group-hover:scale-125"
      />
      <p className="eyebrow text-sunlight">Your room, next</p>
      <p className="flex items-end justify-between gap-4 font-display text-2xl leading-[1.05] sm:text-3xl">
        <span>Book a free measure</span>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-teal-800 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-1">
          <ArrowRight className="size-4" aria-hidden />
        </span>
      </p>
    </Link>
  )
}

function TileCaption({ room, title, lead }: { room: string; title: string; lead?: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-ink/75 via-ink/30 to-transparent p-3.5 pt-14 sm:p-5 sm:pt-16",
        lead && "sm:p-7 sm:pt-20",
      )}
    >
      <div className="min-w-0">
        <p className="eyebrow text-[0.55rem] text-white/75 sm:text-[0.6rem]">{room}</p>
        <p
          className={cn(
            "mt-1 font-display text-lg leading-tight text-white sm:text-2xl",
            lead && "text-2xl sm:text-4xl",
          )}
        >
          {title}
        </p>
      </div>
      <span className="hidden size-9 shrink-0 translate-y-2 place-items-center rounded-full bg-white text-teal-800 opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out-soft)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:grid">
        <ArrowUpRight className="size-4" aria-hidden />
      </span>
    </div>
  )
}

/** Zebra slats that lift away when the tile scrolls in (driven by RoomsBento). */
function TileBlind() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 flex flex-col">
      {Array.from({ length: roomsBento.bands }, (_, i) => (
        <div
          key={i}
          data-band
          className={cn("invisible flex-1 origin-top", i % 2 ? "bg-teal-700" : "bg-teal-800")}
        />
      ))}
    </div>
  )
}

function RibbonPhoto({ shot }: { shot: RoomShot }) {
  const product = getProduct(shot.product)!
  // Wide panoramas are cropped so no single photo hogs the ribbon.
  const ratio = Math.min(shot.src.width / shot.src.height, 1.6)
  const [base, sm, lg] = ribbonHeights.map((h) => Math.round(h * ratio))
  return (
    <Link
      href={`/products/${product.slug}`}
      tabIndex={-1}
      className="group/photo relative block h-44 shrink-0 overflow-hidden rounded-xl bg-teal-900 sm:h-56 lg:h-64"
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        fill
        sizes={`(min-width: 64rem) ${lg}px, (min-width: 40rem) ${sm}px, ${base}px`}
        placeholder="blur"
        className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover/photo:scale-105"
        style={shot.position ? { objectPosition: shot.position } : undefined}
      />
      <span className="absolute bottom-3 left-3 rounded-full bg-ivory/90 px-3 py-1 font-label text-[0.6rem] font-semibold tracking-[0.18em] text-teal-900 uppercase font-stretch-expanded">
        {shortName(product.name)}
      </span>
    </Link>
  )
}
