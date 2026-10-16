import type { StaticImageData } from "next/image"
import romanStone from "@/public/images/roman blinds/roman blinds.jpg"
import romanSand from "@/public/images/roman blinds/romanblinds2.jpg"
import romanFern from "@/public/images/roman blinds/romanblinds3.jpg"
import romanBaroque from "@/public/images/roman blinds/romanblinds4.jpg"
import rollerForest from "@/public/images/roller blinds/roller1.jpg"
import rollerCrimson from "@/public/images/roller blinds/roller2.jpg"
import rollerSlate from "@/public/images/roller blinds/roller3.jpg"
import rollerNatural from "@/public/images/roller blinds/roller4.jpeg"
import sunscreenLinen from "@/public/images/sunscreen blinds/sunscreen1.jpg"
import sunscreenWhite from "@/public/images/sunscreen blinds/sunscreen2.jpg"
import sunscreenPearl from "@/public/images/sunscreen blinds/sunscreen3.jpg"
import sunscreenGrey from "@/public/images/sunscreen blinds/sunscreen4.jpg"
import skylightCream from "@/public/images/skylight blinds/skylight1.jpg"
import skylightMustard from "@/public/images/skylight blinds/skylight2.jpg"
import skylightGrey from "@/public/images/skylight blinds/skylight3.jpg"
import skylightSand from "@/public/images/skylight blinds/skylight4.jpg"
import honeycombSlate from "@/public/images/honeycomb/honeycomb1.jpg"
import honeycombLatte from "@/public/images/honeycomb/honeycomb2.webp"
import honeycombSilver from "@/public/images/honeycomb/honeycomb3.jpg"
import honeycombCharcoal from "@/public/images/honeycomb/honeycomb4.jpg"
import motorMist from "@/public/images/motor/motor1.jpg"
import motorWhite from "@/public/images/motor/motor2.jpg"
import motorTaupe from "@/public/images/motor/motor3.jpg"
import motorBronze from "@/public/images/motor/motor4.webp"
import pergolaTimber from "@/public/images/pergolas/pergolas1.jpg"
import pergolaIvory from "@/public/images/pergolas/pergolas2.jpg"
import pergolaAnthracite from "@/public/images/pergolas/pergolas3.jpg"
import pergolaBlack from "@/public/images/pergolas/pergolas4.webp"
import zebraGraphite from "@/public/images/zebra blinds/zebragrey.jpg"
import zebraMocha from "@/public/images/zebra blinds/zebrabrown.webp"
import zebraOcean from "@/public/images/zebra blinds/blueZebra.jpeg"
import zebraSand from "@/public/images/zebra blinds/zebrayellow.png"

/**
 * Static product catalogue. Phase 3 replaces this with Sanity — keep the shape
 * close to the planned `product` schema so the swap is mechanical.
 *
 * Adding a photo: drop it in /public/images/<product>/, import it above and set
 * `src` on the matching shade. Shades without `src` show a placeholder tile.
 */
export type ProductCategory = "blinds" | "shutters" | "pergolas"

export type Mechanic = "roll" | "zebra" | "fold" | "pleat" | "tilt" | "motor"

/** One shade of a product, with its photo once we have one. */
export type ProductImage = {
  src?: StaticImageData
  alt: string
  /** Shade name shown on the swatch. */
  shade: string
  /** Swatch colour (CSS). */
  swatch: string
  /** object-position for the arched crop. */
  position?: string
}

export type Product = {
  slug: string
  name: string
  category: ProductCategory
  /** The window-treatment motion used for its micro-animation and page mechanic. */
  mechanic: Mechanic
  summary: string
  description: string
  bestFor: string[]
  options: string[]
  /** Shades, first one leads the page. */
  images: ProductImage[]
  highlights: { title: string; body: string }[]
  howItWorks: HowItWorks
}

/** The dark "How it works" band: copy on the left, an operable demo on the right. */
export type HowItWorks = {
  title: string
  /** Italic second half of the heading. */
  accent: string
  body: string
  /** The closed and open states, explained side by side. */
  states: [{ term: string; detail: string }, { term: string; detail: string }]
  demo: {
    /** Readouts from closed (0) through part way to open (100). */
    labels: [closed: string, partway: string, open: string]
    /** Behind the glass: a skyline through a window, or open sky through a roof. */
    view?: "skyline" | "sky"
    /** An open-weave fabric you can see through (sunscreen). */
    mesh?: boolean
    /** Side channels holding the fabric taut (skylights). */
    channels?: boolean
  }
}

export const categories: { id: ProductCategory; label: string; blurb: string }[] = [
  {
    id: "blinds",
    label: "Blinds",
    blurb:
      "Zebra, roman, roller, sunscreen, honeycomb and skylight blinds, sized to the millimetre.",
  },
  {
    id: "shutters",
    label: "Motorised shutters",
    blurb:
      "Aluminium roller shutters for security, heat and monsoon rain, at the press of a button.",
  },
  {
    id: "pergolas",
    label: "Pergolas",
    blurb: "Louvred and retractable roofs that turn a terrace or garden into an outdoor room.",
  },
]

export const products: Product[] = [
  {
    slug: "zebra",
    name: "Zebra Blinds",
    category: "blinds",
    mechanic: "zebra",
    summary: "Alternating sheer and solid bands for day-and-night control.",
    description:
      "Two layers of alternating sheer and solid stripes slide past each other. Line up the sheers for soft daylight, offset them for privacy. A modern favourite for Bangalore apartments, and one of the easiest blinds to motorise.",
    bestFor: ["Apartments", "Living rooms", "Home offices"],
    options: ["Standard or blackout bands", "Cassette headrail", "Chain or motorised control"],
    images: [
      {
        src: zebraSand,
        alt: "Sand-coloured zebra blinds across a wide apartment window in a warm living room",
        shade: "Sand",
        swatch: "#E3D7C3",
        position: "50% 50%",
      },
      {
        src: zebraMocha,
        alt: "Mocha and white zebra blind half raised over a sofa, with trees outside",
        shade: "Mocha",
        swatch: "#9A8A7A",
      },
      {
        // Anchored right: the left edge of this photo carries a third-party mark.
        src: zebraOcean,
        alt: "Ocean-blue zebra blinds on three tall windows behind a white sofa",
        shade: "Ocean",
        swatch: "#1F4D7A",
        position: "100% 60%",
      },
      {
        src: zebraGraphite,
        alt: "Graphite zebra blind in a cassette over a child's bedroom window",
        shade: "Graphite",
        swatch: "#4B4E53",
      },
    ],
    highlights: [
      {
        title: "Day and night in one blind",
        body: "Line up the sheer bands for soft, filtered daylight; offset them for privacy. No second layer, no second track.",
      },
      {
        title: "Made for apartment windows",
        body: "A slim cassette and a neat inside or outside fit suit sliding windows, balconies and wide living-room glass.",
      },
      {
        title: "Easy to live with",
        body: "Wipe-clean fabrics, a smooth chain or a quiet motor, and our own team on call for any adjustment.",
      },
    ],
    howItWorks: {
      title: "Two layers.",
      accent: "One smooth pull.",
      body: "A zebra blind is one continuous loop of fabric with alternating solid and sheer bands, running front and back. Move it a few centimetres and the bands slide past each other, from full privacy to soft daylight, without raising the blind.",
      states: [
        { term: "Bands offset", detail: "Solids cover the sheers: private, dim." },
        { term: "Bands aligned", detail: "Sheers line up: filtered light and a view." },
      ],
      demo: { labels: ["Privacy", "Partly open", "Soft daylight"] },
    },
  },
  {
    slug: "roman",
    name: "Roman Blinds",
    category: "blinds",
    mechanic: "fold",
    summary: "Soft fabric that lifts into neat, even pleats.",
    description:
      "Roman blinds give you the softness of fabric with the tidy footprint of a blind. Each one is made with evenly spaced rods so it folds into crisp horizontal pleats as it rises.",
    bestFor: ["Bedrooms", "Kids' rooms", "Bay windows"],
    options: ["Flat or relaxed fold", "Blockout lining", "Wide fabric range"],
    images: [
      {
        src: romanStone,
        alt: "Stone-grey roman blind folded above a wide living-room window looking onto a garden",
        shade: "Stone",
        swatch: "#ACA298",
      },
      {
        src: romanSand,
        alt: "Sand roman blinds with dark edge trim on each pane of a sunlit bay window",
        shade: "Sand",
        swatch: "#B6977B",
      },
      {
        src: romanFern,
        alt: "Ivory fern-print roman blinds across a bay window and French doors beside a breakfast bar",
        shade: "Fern print",
        swatch: "#CFC5B6",
      },
      {
        // Tall portrait: anchored high so the blind clears the arch.
        src: romanBaroque,
        alt: "Bold baroque-print roman blind half raised over a window seat with matching cushions",
        shade: "Baroque print",
        swatch: "#E77458",
        position: "50% 0%",
      },
    ],
    highlights: [
      {
        title: "Fabric that softens a room",
        body: "Linen weaves, textures and prints a roller can't match, with an optional blockout lining for bedrooms.",
      },
      {
        title: "Neat, even pleats",
        body: "Rods at measured spacing give crisp folds every time: flat for a tailored look, relaxed for a softer one.",
      },
      {
        title: "Tailored to the window",
        body: "Made to the millimetre for inside or outside fits, including bay windows with a blind for each pane.",
      },
    ],
    howItWorks: {
      title: "Flat when down.",
      accent: "Folded when up.",
      body: "Slim rods are sewn into the back of the fabric at even spacing. Pull the cord or chain and the bottom rod rises first, gathering the fabric into soft pleats that stack neatly at the head of the window.",
      states: [
        { term: "Lowered", detail: "One flat panel of fabric: full privacy, full colour." },
        { term: "Raised", detail: "Even pleats stack at the top and the glass is clear." },
      ],
      demo: { labels: ["Lowered", "Half raised", "Raised"] },
    },
  },
  {
    slug: "roller",
    name: "Roller Blinds",
    category: "blinds",
    mechanic: "roll",
    summary: "A single flat panel that rolls up neatly out of sight.",
    description:
      "Roller blinds are the simplest way to control light: one flat fabric panel on a slim tube. Choose blackout for bedrooms or light-filtering for kitchens and studies.",
    bestFor: ["Bedrooms", "Kitchens", "Offices"],
    options: ["Blackout", "Light-filtering", "Chain or spring control", "Motorisation ready"],
    images: [
      {
        src: rollerForest,
        alt: "Forest-green roller blinds lowered on a covered verandah, shading the outdoor lounge",
        shade: "Forest",
        swatch: "#2C341E",
      },
      {
        src: rollerCrimson,
        alt: "Crimson roller blinds lowered on a covered verandah, shading the outdoor lounge",
        shade: "Crimson",
        swatch: "#AE191D",
      },
      {
        // Anchored left so the blind, not the bed, sits in the arch.
        src: rollerSlate,
        alt: "Slate-grey blackout roller blind half down behind sheer curtains in a bedroom",
        shade: "Slate",
        swatch: "#819497",
        position: "30% 50%",
      },
      {
        src: rollerNatural,
        alt: "Natural woven roller blinds half raised on three living-room windows",
        shade: "Natural weave",
        swatch: "#CAB28C",
      },
    ],
    highlights: [
      {
        title: "The simplest way to control light",
        body: "One clean panel with nothing to tangle or tilt. Up, down, or stopped anywhere in between.",
      },
      {
        title: "Blackout or light-filtering",
        body: "Darken a bedroom completely or soften the glare in a kitchen, with fabrics in dozens of colours.",
      },
      {
        title: "Ready for a motor",
        body: "Start with a chain or spring and add a quiet motor later, without replacing the blind.",
      },
    ],
    howItWorks: {
      title: "One panel.",
      accent: "One quiet roll.",
      body: "A single piece of fabric winds onto a slim aluminium tube in the headrail. Pull the chain, release the spring or press a button and it stops exactly where you want it, with a weighted bottom bar keeping it straight.",
      states: [
        { term: "Rolled down", detail: "Blackout or light-filtering fabric covers the glass." },
        { term: "Rolled up", detail: "The fabric tucks into the headrail, out of sight." },
      ],
      demo: { labels: ["Rolled down", "Half way", "Rolled up"] },
    },
  },
  {
    slug: "sunscreen",
    name: "Sunscreen Blinds",
    category: "blinds",
    mechanic: "roll",
    summary: "Cuts glare and heat while keeping the view outside.",
    description:
      "Sunscreen fabric is woven with a fine, open mesh that blocks most of the sun's heat and glare but lets you see out. Ideal for west-facing rooms that bake in the Bangalore afternoon, and for screens where glare is a problem.",
    bestFor: ["West-facing windows", "Offices", "Balconies"],
    options: ["1%, 3% or 5% openness", "Grey, white and bronze weaves", "Chain or motorised"],
    images: [
      {
        src: sunscreenLinen,
        alt: "Linen sunscreen blinds half lowered across a living-room glass wall, the garden still visible through the weave",
        shade: "Linen",
        swatch: "#B9AF96",
      },
      {
        // Tall portrait: anchored high to keep the blind and pelmet in the arch.
        src: sunscreenWhite,
        alt: "White sunscreen blind half lowered over a kitchen window above the worktop",
        shade: "White",
        swatch: "#D6D5CE",
        position: "50% 0%",
      },
      {
        src: sunscreenPearl,
        alt: "Pearl sunscreen blinds on floor-to-ceiling glass doors in a gabled living room",
        shade: "Pearl",
        swatch: "#C4C6C9",
      },
      {
        src: sunscreenGrey,
        alt: "Grey sunscreen blinds across an office window wall, the city still visible through the weave",
        shade: "Grey",
        swatch: "#888D8D",
      },
    ],
    highlights: [
      {
        title: "Cooler west-facing rooms",
        body: "The weave stops much of the sun's heat at the window, so afternoon rooms stay comfortable.",
      },
      {
        title: "Glare-free screens",
        body: "Made for home offices and TV walls where the sun washes out the picture.",
      },
      {
        title: "Your view stays",
        body: "Choose 1%, 3% or 5% openness to balance privacy, glare control and how much you see out.",
      },
    ],
    howItWorks: {
      title: "Block the glare.",
      accent: "Keep the view.",
      body: "Sunscreen fabric is a tight weave of coated polyester with tiny openings. It stops most of the sun's heat and glare before it reaches the room, yet from inside you still see the street, the trees and the skyline.",
      states: [
        { term: "Down", detail: "Heat and glare cut, view kept: cool and still bright." },
        { term: "Up", detail: "Nothing between you and the window once the sun moves on." },
      ],
      demo: { labels: ["Glare cut", "Half way", "Open view"], mesh: true },
    },
  },
  {
    slug: "skylight",
    name: "Skylight Blinds",
    category: "blinds",
    mechanic: "roll",
    summary: "Blinds that run in side channels for skylights and glass roofs.",
    description:
      "Skylight blinds are held taut in slim side channels so they sit flat at any angle: on a skylight, a sloping roof window or a glass roof over a duplex stairwell. Blackout or light-filtering, operated by a pole or a quiet motor.",
    bestFor: ["Skylights", "Glass roofs", "Duplex stairwells"],
    options: ["Blackout or light-filtering", "Side-channel tensioning", "Pole or motorised"],
    images: [
      {
        src: skylightCream,
        alt: "Cream pleated skylight blinds drawn on three roof windows in an attic bedroom",
        shade: "Cream",
        swatch: "#D1C8BE",
      },
      {
        // Anchored right so both roof windows sit in the arch.
        src: skylightMustard,
        alt: "Mustard-yellow skylight blinds half drawn on two roof windows in a child's bedroom",
        shade: "Mustard",
        swatch: "#CE9A36",
        position: "65% 50%",
      },
      {
        src: skylightGrey,
        alt: "Grey skylight blind on a glass roof lantern, drawn back to show the sky",
        shade: "Grey",
        swatch: "#827C78",
      },
      {
        src: skylightSand,
        alt: "Sand fabric shade hanging in soft folds beneath a glass roof",
        shade: "Sand",
        swatch: "#C2AE96",
      },
    ],
    highlights: [
      {
        title: "Flat at any angle",
        body: "Side-channel tension keeps the fabric straight on skylights, sloping roof windows and glass roofs.",
      },
      {
        title: "Tames overhead heat",
        body: "Blackout and light-filtering fabrics cut the harsh midday sun that pours through roof glass.",
      },
      {
        title: "Out of reach, still easy",
        body: "Run high windows with a pole or a quiet motor and remote. No ladders needed.",
      },
    ],
    howItWorks: {
      title: "Held taut.",
      accent: "At any angle.",
      body: "On a sloping or flat roof window an ordinary blind would sag. Skylight blinds run in slim side channels that keep the fabric under tension, so it lies flat overhead whether it is fully drawn or stopped half way.",
      states: [
        { term: "Drawn", detail: "Blocks harsh overhead sun and heat from the roof glass." },
        { term: "Retracted", detail: "Rolls into a compact head box for a clear view of the sky." },
      ],
      demo: { labels: ["Drawn", "Half way", "Open sky"], view: "sky", channels: true },
    },
  },
  {
    slug: "honeycomb",
    name: "Honeycomb Blinds",
    category: "blinds",
    mechanic: "pleat",
    summary: "Cellular pleats that trap air to keep rooms cooler.",
    description:
      "Honeycomb (cellular) blinds are made of pleated cells that trap a layer of air against the glass, cutting heat gain on hot days. They stack to a slim band when raised and can open top-down or bottom-up for privacy with daylight.",
    bestFor: ["Bedrooms", "Sunny rooms", "Odd-shaped windows"],
    options: ["Single or double cell", "Top-down / bottom-up", "Cordless or motorised"],
    images: [
      {
        src: honeycombSlate,
        alt: "Hand adjusting the bottom rail of a slate-grey honeycomb blind on a sunny window",
        shade: "Slate",
        swatch: "#80838A",
      },
      {
        src: honeycombLatte,
        alt: "Close-up of the cellular pleats of a latte honeycomb blind",
        shade: "Latte",
        swatch: "#B49E8B",
      },
      {
        // Anchored left to keep the blind's cell edge in view.
        src: honeycombSilver,
        alt: "Silver honeycomb blind lowered over a living-room window, its cell edge visible",
        shade: "Silver",
        swatch: "#9A9997",
        position: "20% 50%",
      },
      {
        src: honeycombCharcoal,
        alt: "Charcoal honeycomb blind half lowered over a bedroom window",
        shade: "Charcoal",
        swatch: "#64605F",
      },
    ],
    highlights: [
      {
        title: "Insulation you can see",
        body: "Air trapped in the cells slows heat gain, so rooms stay cooler and the air conditioning works less.",
      },
      {
        title: "Light above, privacy below",
        body: "Top-down / bottom-up versions let daylight in over the blind while the lower half stays covered.",
      },
      {
        title: "Fits awkward windows",
        body: "Slim headrails and compact stacks suit narrow frames, French doors and odd-shaped glass.",
      },
    ],
    howItWorks: {
      title: "Cells of air.",
      accent: "A cooler room.",
      body: "Seen side-on, each pleat is a hollow hexagon. The cells trap a layer of still air between the glass and the room, slowing the heat that comes in on a hot afternoon. Raised, the pleats press into a band only a few centimetres deep.",
      states: [
        { term: "Lowered", detail: "The cells insulate the glass and soften the light." },
        { term: "Raised", detail: "Pleats stack into a slim band under the headrail." },
      ],
      demo: { labels: ["Lowered", "Half raised", "Raised"] },
    },
  },
  {
    slug: "motorised-shutters",
    name: "Motorised Shutters",
    category: "shutters",
    mechanic: "motor",
    summary: "Aluminium roller shutters that rise and fall at the press of a button.",
    description:
      "Insulated aluminium slats roll down to seal a window, balcony or shopfront against heat, rain, dust and intruders, and roll away into a compact box when you want the opening clear. Operate them from a remote, a wall switch or your phone.",
    bestFor: ["Ground-floor windows", "Balconies", "Shopfronts & garages"],
    options: [
      "Remote, wall switch or app",
      "Manual override",
      "Battery backup",
      "Colour-matched box",
    ],
    images: [
      {
        src: motorMist,
        alt: "Motorised sheer shade with soft fabric vanes, its remote on a side table",
        shade: "Mist",
        swatch: "#C9CED0",
      },
      {
        // Anchored right to keep the person holding the remote in frame.
        src: motorWhite,
        alt: "Woman lowering a white motorised sheer shade with a handheld remote",
        shade: "White",
        swatch: "#E6E3DC",
        position: "100% 50%",
      },
      {
        src: motorTaupe,
        alt: "Motorised shades on a row of corner windows above a breakfast nook",
        shade: "Taupe",
        swatch: "#C2B4A8",
      },
      {
        src: motorBronze,
        alt: "Motorised bronze curtains and sheers along a floor-to-ceiling window with a sea view",
        shade: "Bronze",
        swatch: "#7D6349",
      },
    ],
    highlights: [
      {
        title: "Security at a button press",
        body: "Interlocking aluminium slats lock down over windows, balconies and shopfronts.",
      },
      {
        title: "Heat, rain and dust kept out",
        body: "Insulated slats block afternoon heat and monsoon rain, and keep dust off the glass.",
      },
      {
        title: "Works in a power cut",
        body: "Battery backup and a manual override mean the shutter never leaves you stuck.",
      },
    ],
    howItWorks: {
      title: "Press a button.",
      accent: "Seal the opening.",
      body: "Interlocking aluminium slats, filled with insulating foam, run in steel guide rails. A tubular motor inside the box rolls them up or down from a remote, a wall switch or your phone, with a manual override and battery backup for power cuts.",
      states: [
        { term: "Down", detail: "Shut tight against heat, rain, dust and intruders." },
        { term: "Up", detail: "Rolled into the box, the opening is completely clear." },
      ],
      demo: { labels: ["Closed", "Part open", "Open"] },
    },
  },
  {
    slug: "pergolas",
    name: "Pergolas",
    category: "pergolas",
    mechanic: "tilt",
    summary: "Louvred roofs you tilt for sun, shade or monsoon cover.",
    description:
      "Our aluminium pergolas have motorised louvres that rotate to let sun in, angle for shade, or close tight against the rain, with integrated gutters to carry water away. Retractable fabric roofs are available for lighter structures.",
    bestFor: ["Terraces", "Gardens", "Cafés & restaurants"],
    options: ["Motorised louvres", "Retractable fabric roof", "LED lighting", "Side screens"],
    images: [
      // Sharpest photo leads: the first one loads in the hero.
      {
        src: pergolaBlack,
        alt: "Black louvred pergola with LED lighting and a lowered side screen",
        shade: "Black",
        swatch: "#2B2B2D",
      },
      {
        src: pergolaAnthracite,
        alt: "Anthracite louvred pergola over an outdoor kitchen, with a side screen half lowered",
        shade: "Anthracite",
        swatch: "#4A4F57",
      },
      {
        // Anchored right to keep the side screen in the arch.
        src: pergolaIvory,
        alt: "Ivory pergola roof and lowered side screen shading a poolside lounge",
        shade: "Ivory",
        swatch: "#DCD6C3",
        position: "60% 50%",
      },
      {
        src: pergolaTimber,
        alt: "Timber pergola on a deck with two roll-down shade screens",
        shade: "Timber",
        swatch: "#93573F",
        position: "0% 50%",
      },
    ],
    highlights: [
      {
        title: "An outdoor room, all year",
        body: "Sun, shade or rain cover in seconds, so the terrace stays usable from summer to monsoon.",
      },
      {
        title: "Built for the weather",
        body: "Powder-coated aluminium that resists rust, with gutters in the frame to carry rainwater away.",
      },
      {
        title: "Day into evening",
        body: "Add LED lighting and side screens to keep using the space long after sunset.",
      },
    ],
    howItWorks: {
      title: "Tilt for sun.",
      accent: "Close for rain.",
      body: "The roof is a row of aluminium louvres on a motorised pivot. Angle them open for sunshine and a breeze, part closed for dappled shade, or shut tight when the monsoon arrives. Rain runs off into gutters hidden in the frame.",
      states: [
        { term: "Closed", detail: "Louvres interlock into a watertight roof." },
        { term: "Open", detail: "Louvres turn edge-on to let in sun and air." },
      ],
      demo: { labels: ["Closed roof", "Dappled shade", "Open to the sky"], view: "sky" },
    },
  },
]

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function productsByCategory(category: ProductCategory) {
  return products.filter((p) => p.category === category)
}
