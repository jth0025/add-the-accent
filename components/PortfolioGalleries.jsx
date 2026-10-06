"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PIECES, tagsOf } from "@/lib/designPieces";

const COMMISSIONS = PIECES.filter((p) => tagsOf(p.alt).includes("commission"));
const PHOTOS = PIECES.filter((p) => tagsOf(p.alt).includes("photocommission"));

// How many of each the side-by-side view samples; the other two views
// show the whole gallery.
const SAMPLE = 6;

const MODES = [
  { id: "both", label: "Both" },
  { id: "commission", label: "Commissions", count: COMMISSIONS.length },
  { id: "photo", label: "Photo", count: PHOTOS.length },
];

function Tile({ piece, kind, index, visible }) {
  return (
    <Link
      href="/design"
      className={`fade-slide-left group relative mb-3 block w-full overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl ${
        visible ? "is-visible" : ""
      }`}
      style={{ transitionDelay: `${Math.min(index * 70, 560)}ms` }}
      aria-label={`View the ${
        kind === "photo" ? "photography" : "graphic design"
      } gallery — ${piece.alt.replace(/#/g, "")}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={piece.src} alt="" className="block w-full" loading="lazy" />
      <span className="bronze-glare" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          kind === "photo"
            ? "/design/photo-commission-badge.png"
            : "/design/commission-badge.png"
        }
        alt=""
        className="pointer-events-none absolute -left-1.5 -top-1.5 z-10 h-8 w-8 drop-shadow-md sm:h-9 sm:w-9"
      />
    </Link>
  );
}

function ColumnLabel({ kind, children }) {
  return (
    <div className="mb-2.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          kind === "photo"
            ? "/design/photo-commission-badge.png"
            : "/design/commission-badge.png"
        }
        alt=""
        className="h-5 w-5 object-contain"
      />
      <span>{children}</span>
    </div>
  );
}

/**
 * The Portfolio page's graphic-design column. By default it is two
 * columns side by side — #commission work on the left, #photocommission
 * on the right — and the toggle above swaps both columns over to the
 * full commissions gallery or the full photo-commission gallery. Tiles
 * slide in from the left as the grid scrolls into view, and again each
 * time the toggle changes.
 */
export default function PortfolioGalleries() {
  const ref = useRef(null);
  const [mode, setMode] = useState("both");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pick = (next) => {
    if (next === mode) return;
    setMode(next);
    // Drop the tiles back off to the left, then let them slide in again.
    setVisible(false);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true)),
    );
  };

  const single = mode === "commission" ? COMMISSIONS : PHOTOS;
  const singleKind = mode === "commission" ? "commission" : "photo";

  return (
    <div>
      <div
        role="group"
        aria-label="Which gallery"
        className="mb-4 inline-flex overflow-hidden rounded-full border border-ink/20 bg-card font-mono text-[11px] uppercase tracking-widest"
      >
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => pick(m.id)}
            className={`px-3.5 py-1.5 transition-colors ${
              mode === m.id
                ? "bg-ink text-[#e7ded2]"
                : "text-ink/70 hover:text-ink"
            }`}
          >
            {m.label}
            {m.count ? (
              <sup className="ml-1 text-[9px] opacity-60">{m.count}</sup>
            ) : null}
          </button>
        ))}
      </div>

      <div ref={ref}>
        {mode === "both" ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <ColumnLabel kind="commission">Commissions</ColumnLabel>
              {COMMISSIONS.slice(0, SAMPLE).map((piece, i) => (
                <Tile
                  key={`c-${piece.src}`}
                  piece={piece}
                  kind="commission"
                  index={i}
                  visible={visible}
                />
              ))}
            </div>
            <div>
              <ColumnLabel kind="photo">Photo commissions</ColumnLabel>
              {PHOTOS.slice(0, SAMPLE).map((piece, i) => (
                <Tile
                  key={`p-${piece.src}`}
                  piece={piece}
                  kind="photo"
                  index={i}
                  visible={visible}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="columns-2 gap-3">
            {single.map((piece, i) => (
              <Tile
                key={`${singleKind}-${piece.src}`}
                piece={piece}
                kind={singleKind}
                index={i}
                visible={visible}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
