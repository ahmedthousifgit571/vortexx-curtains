import Image from "next/image"
import { Marquee } from "@/components/sections/Marquee"
import { marquee } from "@/lib/motion"
import { roomShots } from "@/lib/rooms"

/** Each name is followed by a cluster of this many room photos. */
const CHIPS = 3
/** Name pairs per marquee copy, so one copy outruns even an ultra-wide screen. */
const PAIRS = 2

const names = [
  { text: "Curttex", accent: false },
  { text: "Global Trading", accent: true },
]

/** Associate partners: the partner's name in giant type drifting past, photo chips between the words. */
export function Partners() {
  const words = Array.from({ length: PAIRS }, () => names).flat()

  return (
    <section aria-labelledby="partners-title" className="bg-ivory pt-16 pb-16 sm:pt-24 sm:pb-24">
      <div className="container-site text-center">
        <h2 id="partners-title" className="text-5xl text-teal-900 sm:text-6xl lg:text-7xl">
          Our associate <em className="text-teal-600">partners</em>
          <span className="sr-only">: Curttex Global Trading</span>
        </h2>
        <div
          aria-hidden
          className="mx-auto mt-6 h-2 w-24 rounded-full bg-teal-700 stripes [--slat-gap:4px] [--slat:3px]"
        />
      </div>

      <div aria-hidden>
        <Marquee
          loop={marquee.partnerLoop}
          swipeable={false}
          className="mt-10 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] py-[0.12em] font-display text-[clamp(4.5rem,14vw,12rem)] leading-none sm:mt-14"
          rowClassName="items-center gap-[0.32em] pr-[0.32em]"
        >
          {words.map((word, i) => (
            <span key={i} className="flex shrink-0 items-center gap-[0.32em]">
              {word.accent ? (
                <em className="whitespace-nowrap text-teal-600">{word.text}</em>
              ) : (
                <span className="whitespace-nowrap text-teal-900">{word.text}</span>
              )}
              <span className="flex shrink-0">
                {Array.from({ length: CHIPS }, (_, c) => {
                  const shot = roomShots[(i * CHIPS + c) % roomShots.length]
                  return (
                    <span
                      key={shot.id}
                      className="relative -ml-[0.06em] size-[0.62em] overflow-hidden rounded-[0.14em] bg-teal-900 ring-[length:0.035em] ring-ivory first:ml-0"
                    >
                      <Image
                        src={shot.src}
                        alt=""
                        fill
                        sizes="(min-width: 64rem) 120px, 72px"
                        placeholder="blur"
                        className="object-cover"
                        style={shot.position ? { objectPosition: shot.position } : undefined}
                      />
                    </span>
                  )
                })}
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
