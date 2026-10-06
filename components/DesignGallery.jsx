"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DesignPlacard from "@/components/DesignPlacard";
import { PIECES, tagsOf } from "@/lib/designPieces";
import {
  CATEGORIES,
  inCategory,
  labelOf,
  mediumOf,
  tagsForCategory,
  titleOf,
} from "@/lib/designCategories";

function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const COUNTS = Object.fromEntries(
  CATEGORIES.map((c) => [
    c.key,
    PIECES.filter((p) => inCategory(tagsOf(p.alt), c.key)).length,
  ]),
);
const SUB_TAGS = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, tagsForCategory(PIECES, c.key)]),
);

export default function DesignGallery() {
  const [lightbox, setLightbox] = useState(null);
  const [pieces, setPieces] = useState(PIECES);
  const [cat, setCat] = useState("all");
  const [tag, setTag] = useState(null);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    setPieces(shuffle(PIECES));
  }, []);

  // Re-run the secondary row's slide-open each time the medium changes.
  useEffect(() => {
    setReveal(false);
    let id2;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setReveal(true));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [cat]);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const pickCategory = (key) => {
    setCat(key);
    setTag(null);
  };

  const visiblePieces = useMemo(
    () =>
      pieces.filter((p) => {
        const tags = tagsOf(p.alt);
        return inCategory(tags, cat) && (!tag || tags.includes(tag));
      }),
    [pieces, cat, tag],
  );

  const subTags = SUB_TAGS[cat] || [];

  return (
    <>
      {/* Filter bar — sticks to the top of the viewport on desktop while the
          collection scrolls beneath it. The pseudo-element paints the bar's
          backing edge to edge. */}
      <div className="relative isolate z-30 border-b border-ink/25 before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-[#96958d]/95 before:backdrop-blur-md md:sticky md:top-0">
        <div className="relative flex items-end">
          <div
            role="tablist"
            aria-label="Medium"
            className="-mx-6 flex flex-1 scroll-px-6 snap-x justify-start gap-7 overflow-x-auto whitespace-nowrap px-6 pt-4 [scrollbar-width:none] md:mx-0 md:justify-center md:gap-10 md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {CATEGORIES.map((c) => {
              const active = cat === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => pickCategory(c.key)}
                  className={`snap-start border-b-2 pb-2.5 font-cinema text-lg uppercase tracking-[0.2em] transition sm:text-xl ${
                    active
                      ? "border-accent text-ink"
                      : "border-transparent text-ink/50 hover:text-ink"
                  }`}
                >
                  {c.label}
                  <sup className="ml-1.5 font-mono text-[10px] tracking-normal opacity-60">
                    {COUNTS[c.key]}
                  </sup>
                </button>
              );
            })}
          </div>
          <span className="absolute bottom-3 right-0 hidden font-mono text-[11px] uppercase tracking-widest text-ink/70 lg:block">
            {visiblePieces.length} {visiblePieces.length === 1 ? "work" : "works"}
          </span>
        </div>

        {/* Secondary row — slides open under the selected medium with that
            medium's tags. */}
        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-out ${
            reveal ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mb-3 mt-1 flex items-center gap-2 overflow-x-auto rounded-md border border-ink/15 bg-ink/[0.07] px-3 py-2 [scrollbar-width:none] md:flex-wrap md:justify-center [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => setTag(null)}
                className={`shrink-0 rounded-full border px-3 py-0.5 font-mono text-[11px] lowercase tracking-wider transition ${
                  !tag
                    ? "border-ink bg-ink text-[#e7ded2]"
                    : "border-ink/25 text-ink/75 hover:border-ink/60"
                }`}
              >
                all
              </button>
              {subTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(tag === t ? null : t)}
                  className={`shrink-0 rounded-full border px-3 py-0.5 font-mono text-[11px] lowercase tracking-wider transition ${
                    tag === t
                      ? "border-ink bg-ink text-[#e7ded2]"
                      : "border-ink/25 text-ink/75 hover:border-ink/60"
                  }`}
                >
                  {labelOf(t)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-accent">
        <div className="flex items-center gap-2">
          <span className="commission-legend relative block h-8 w-8 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/design/commission-badge.png"
              alt=""
              className="h-full w-full object-contain"
            />
          </span>
          <span>= Commissioned piece</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="commission-legend relative block h-8 w-8 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/design/photo-commission-badge.png"
              alt=""
              className="h-full w-full object-contain"
            />
          </span>
          <span>= Photo commission</span>
        </div>
      </div>

      {visiblePieces.length === 0 && (
        <p className="py-20 text-center font-playfair text-xl italic text-ink/70">
          Nothing hung here yet.
        </p>
      )}

      {/* Editorial masonry: balanced columns, wide row gaps, a caption line
          under every work, and every few prints set in a paper mat. */}
      <div className="mt-8 columns-2 gap-x-4 sm:gap-x-7 md:columns-3 xl:columns-4">
        {visiblePieces.map((piece, i) => {
          const tags = tagsOf(piece.alt);
          const isCommission = tags.includes("commission");
          const isPhotoCommission = tags.includes("photocommission");
          const title = titleOf(piece.alt);
          const matted = i % 5 === 2;
          return (
            <button
              key={piece.src}
              type="button"
              onClick={() => setLightbox(piece)}
              style={{
                animationDelay: `${Math.min(i * 40, 640)}ms`,
                "--deal-rot": i % 2 === 0 ? "-4deg" : "4deg",
              }}
              className="deal-in group relative mb-9 block w-full break-inside-avoid cursor-zoom-in text-left [filter:drop-shadow(1px_2px_2px_rgba(0,0,0,0.55))_drop-shadow(3px_5px_6px_rgba(0,0,0,0.35))] transition-[filter] duration-300 hover:[filter:drop-shadow(1px_3px_3px_rgba(0,0,0,0.65))_drop-shadow(4px_7px_8px_rgba(0,0,0,0.4))]"
              aria-label={`Enlarge: ${title || piece.alt}`}
            >
              {/* The shadow lives on this button so it isn't clipped by
                  the mask below (box-shadow/drop-shadow on an
                  overflow-hidden element gets cut off with it). */}
              <span
                className={`relative block overflow-hidden ${
                  matted ? "bg-[#f1ece0] p-2.5 sm:p-3.5" : "rounded-sm"
                }`}
              >
                <span className="relative block overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={piece.src}
                    alt={piece.alt}
                    className="block w-full"
                    loading="lazy"
                  />
                  <span className="bronze-glare" aria-hidden="true" />
                </span>
              </span>
              {isCommission && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/design/commission-badge.png"
                  alt="Commissioned piece"
                  className="pointer-events-none absolute -left-2 -top-2 z-10 h-12 w-12 drop-shadow-md sm:h-14 sm:w-14"
                />
              )}
              {isPhotoCommission && !isCommission && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/design/photo-commission-badge.png"
                  alt="Photo commission"
                  className="pointer-events-none absolute -left-1.5 -top-1.5 z-10 h-8 w-8 drop-shadow-md sm:h-9 sm:w-9"
                />
              )}
              <span className="mt-2 flex items-baseline justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink">
                <span className="truncate">
                  N&deg; {String(i + 1).padStart(2, "0")}
                  {title && (
                    <span className="ml-2 normal-case italic tracking-normal">
                      {title}
                    </span>
                  )}
                </span>
                <span className="hidden shrink-0 sm:inline">
                  {mediumOf(piece.alt).split(",")[0]}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <DesignPlacard piece={lightbox} onClose={closeLightbox} />
    </>
  );
}
