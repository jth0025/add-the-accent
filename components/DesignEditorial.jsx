"use client";

import { useCallback, useState } from "react";
import DesignPlacard from "@/components/DesignPlacard";
import { mediumOf, titleOf } from "@/lib/designCategories";
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
          aria-label={`Enlarge: ${titleOf(piece.alt) || piece.alt}`}
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
      <figcaption className="mt-4 flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#3a352b]">
        <span>
          N&deg; {String(n).padStart(2, "0")}
          {titleOf(piece.alt) && (
            <span className="ml-2 normal-case italic tracking-normal">
              {titleOf(piece.alt)}
            </span>
          )}
        </span>
        <span className="hidden text-right sm:inline">
          {mediumOf(piece.alt).split(",")[0]}
        </span>
      </figcaption>
    </figure>
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
          <div className="flex items-center justify-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-[#3a352b]">
            <span className="h-px w-12 bg-[#3a352b]/40" />
            <span>Now showing</span>
            <span className="h-px w-12 bg-[#3a352b]/40" />
          </div>

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

          <p className="mx-auto mt-16 max-w-5xl px-4 text-center [text-wrap:balance] font-playfair text-[2rem] font-bold italic leading-[1.15] tracking-tight text-ink sm:px-14 sm:text-5xl lg:px-24 lg:text-[3.4rem]">
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
