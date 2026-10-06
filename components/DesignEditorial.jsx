"use client";

import { useCallback, useState } from "react";
import CaptionTitle from "@/components/CaptionTitle";
import DesignPlacard from "@/components/DesignPlacard";
import { captionOf } from "@/lib/designCategories";
import { EDITORIAL } from "@/lib/designEditorial";
import { PIECES } from "@/lib/designPieces";

// The hooded-guitarist and vinyl-sofa photographs are already collection
// pieces — pull their captions from there so the two never drift apart.
const fromCollection = (src) =>
  PIECES.find((p) => p.src === src) || { src, alt: "#photography" };
const byId = {
  ...Object.fromEntries(EDITORIAL.map((p) => [p.id, p])),
  guitarist: fromCollection("/design/hooded-guitarist.jpg"),
  vinyl: fromCollection("/design/vinyl-sofa-portrait.jpg"),
};

// Canvases propped on the floor and leaning back against the wall: each one
// is turned a degree or two off square and tipped back a touch, with a stack
// of offset edges for the canvas depth and a soft shadow thrown onto the
// wall. The numbers are deliberately uneven.
const edge = (c1, c2, c3) =>
  `1px 1px 0 ${c1}, 2px 2px 0 ${c2}, 3px 3px 0 ${c3}`;
const LEAN = {
  panorama: { rot: -0.35, tip: 0.8, x: 0 },
  underwater: { rot: -1.3, tip: 1.6, x: 0.4 },
  court: { rot: 1.7, tip: 1.2, x: -0.3 },
  joshua: { rot: -0.8, tip: 1.9, x: 0.2 },
  guitarist: { rot: 1.1, tip: 1.4, x: -0.5 },
  vinyl: { rot: -0.6, tip: 1.3, x: 0.3 },
};

function Plate({ piece, id, n, ratio, className = "", onOpen }) {
  const lean = LEAN[id];
  const cap = captionOf(piece);
  const { title, shortMedium } = cap;
  return (
    <figure className={`[perspective:1100px] ${className}`}>
      <div
        className="canvas-lean relative transition-transform duration-500 ease-out hover:!translate-y-[-3px]"
        style={{
          transform: `translateX(${lean.x}%) rotate(${lean.rot}deg) rotateX(${lean.tip}deg)`,
          transformOrigin: "50% 100%",
          boxShadow: `${edge("#ece8dc", "#dfd9c9", "#d0c9b6")}, 3px 5px 5px rgba(26,20,12,0.5), 7px 10px 12px -4px rgba(26,20,12,0.4)`,
        }}
      >
        <button
          type="button"
          onClick={() => onOpen(piece)}
          aria-label={`Enlarge: ${title || piece.alt}`}
          className="group relative block w-full cursor-zoom-in overflow-hidden bg-black"
          style={{ aspectRatio: ratio }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={piece.src}
            alt={piece.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {/* A little light falling off the canvas toward the wall. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(255,255,255,0.1),transparent_30%,transparent_70%,rgba(0,0,0,0.12))]"
          />
          <span className="bronze-glare" aria-hidden="true" />
        </button>
      </div>
      <figcaption className="mt-4 text-[#3a352b]">
        <span className="flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span>N&deg; {String(n).padStart(2, "0")}</span>
          <span className="hidden min-w-0 text-right sm:inline">
            {shortMedium}
          </span>
        </span>
        {title && (
          <span className="mt-1 block break-words font-mono text-[11px] normal-case italic leading-snug tracking-normal">
            <CaptionTitle c={cap} numberClass="text-[0.85em]" />
          </span>
        )}
      </figcaption>
    </figure>
  );
}

// A brass picture light hung over the "Now showing" label. It lights, and
// throws a warm cone down onto the wall and the words, while hovered (or
// focused, or tapped on a touch screen).
function PictureLight() {
  const [lit, setLit] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={lit}
      aria-label="Picture light"
      onMouseEnter={() => setLit(true)}
      onMouseLeave={() => setLit(false)}
      onFocus={() => setLit(true)}
      onBlur={() => setLit(false)}
      onClick={() => setLit((v) => !v)}
      className="group relative mx-auto flex w-[19rem] max-w-full cursor-pointer flex-col items-center outline-none"
    >
      <svg
        viewBox="0 0 160 46"
        className="relative z-10 h-12 w-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pl-brass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0d58e" />
            <stop offset="0.35" stopColor="#c79a43" />
            <stop offset="0.7" stopColor="#8a6420" />
            <stop offset="1" stopColor="#5d4113" />
          </linearGradient>
        </defs>
        {/* wall plate and arm */}
        <rect x="70" y="0" width="20" height="5" rx="2" fill="url(#pl-brass)" />
        <path
          d="M80 5 V13 M80 13 Q80 19 52 21 M80 13 Q80 19 108 21"
          stroke="url(#pl-brass)"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* lamp body */}
        <rect x="26" y="19" width="108" height="11" rx="5.5" fill="url(#pl-brass)" />
        <rect x="30" y="21" width="100" height="2" rx="1" fill="#fff3c4" opacity="0.55" />
        <rect x="20" y="21" width="7" height="7" rx="2.5" fill="#6f4f17" />
        <rect x="133" y="21" width="7" height="7" rx="2.5" fill="#6f4f17" />
        {/* bulb glow strip under the shade */}
        <rect
          x="34"
          y="29"
          width="92"
          height="3.2"
          rx="1.6"
          fill={lit ? "#fff4c8" : "#6d5a2c"}
          style={{ transition: "fill 0.4s" }}
        />
      </svg>

      {/* the cone of light */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-9 z-0 h-28 w-[26rem] max-w-[120vw] -translate-x-1/2 transition-opacity duration-500 ${
          lit ? "opacity-100" : "opacity-0"
        }`}
        style={{
          clipPath: "polygon(24% 0, 76% 0, 100% 100%, 0 100%)",
          background:
            "linear-gradient(to bottom, rgba(255,240,180,0.85), rgba(255,236,170,0.28) 55%, rgba(255,236,170,0))",
          filter: "blur(5px)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 22%, #000 78%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, #000 22%, #000 78%, transparent)",
        }}
      />

      <span
        className={`relative z-10 mt-2 flex items-center justify-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] transition-all duration-500 ${
          lit
            ? "text-[#2a1d05] [text-shadow:0_0_14px_rgba(255,236,170,0.95)]"
            : "text-[#3a352b]"
        }`}
      >
        <span className="h-px w-12 bg-[#3a352b]/40" />
        <span>Now showing</span>
        <span className="h-px w-12 bg-[#3a352b]/40" />
      </span>
    </button>
  );
}

// A magazine-style spread between the Museum's title box and the filterable
// collection, hung on a plaster wall above a strip of floor: one long
// panorama, then four portraits at different widths and heights, and a
// pull-quote.
export default function DesignEditorial() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section
      className="mx-auto mt-16 max-w-6xl px-4 sm:px-6"
      aria-label="Now showing"
    >
      <div className="gallery-wall relative overflow-hidden rounded-md border border-ink/30 shadow-[0_10px_26px_rgba(0,0,0,0.18)]">
        <div className="px-5 pb-24 pt-10 sm:px-10 sm:pt-12 lg:px-14">
          <PictureLight />

          <Plate
            piece={byId.panorama}
            id="panorama"
            n={1}
            ratio="1916 / 821"
            onOpen={setOpen}
            className="mt-8"
          />

          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-12 lg:items-start lg:gap-x-8">
            <Plate
              piece={byId.underwater}
              id="underwater"
              n={2}
              ratio="4 / 5"
              onOpen={setOpen}
              className="col-span-2 lg:col-span-5"
            />
            <Plate
              piece={byId.court}
              id="court"
              n={3}
              ratio="4 / 5"
              onOpen={setOpen}
              className="lg:col-span-3 lg:mt-32"
            />
            <Plate
              piece={byId.joshua}
              id="joshua"
              n={4}
              ratio="4 / 5"
              onOpen={setOpen}
              className="lg:col-span-4 lg:mt-10"
            />
          </div>

          <div className="mt-10 grid grid-cols-1 items-end gap-x-8 gap-y-12 lg:grid-cols-12">
            <Plate
              piece={byId.vinyl}
              id="vinyl"
              n={5}
              ratio="1448 / 1086"
              onOpen={setOpen}
              className="lg:col-span-7"
            />
            <Plate
              piece={byId.guitarist}
              id="guitarist"
              n={6}
              ratio="1122 / 1402"
              onOpen={setOpen}
              className="mx-auto w-[72%] max-w-sm lg:col-span-4 lg:col-start-9 lg:mx-0 lg:w-full lg:max-w-none"
            />
          </div>

          <p className="mx-auto mt-16 max-w-6xl px-1 text-center [text-wrap:balance] font-playfair text-[2rem] font-bold italic leading-[1.15] tracking-tight text-ink sm:px-4 sm:text-5xl lg:px-6 lg:text-[3.4rem]">
            &ldquo;What stays with us is rarely the thing itself, but the way we{" "}
            <span className="gold-foil not-italic">saw</span> it.&rdquo;
          </p>
        </div>

        {/* Baseboard and floor. */}
        <div aria-hidden="true" className="gallery-floor" />
      </div>

      <DesignPlacard piece={open} onClose={close} />
    </section>
  );
}
