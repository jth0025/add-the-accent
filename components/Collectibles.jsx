"use client";

import { useEffect, useRef, useState } from "react";
import "./collectibles.css";

// The identities, two to a shelf. Carved-wood figures with no faces: one
// person, many roles.
export const FIGURES = [
  { src: "/collectibles/photographer.webp", alt: "A carved wooden figure of a photographer with two cameras" },
  { src: "/collectibles/wizard.webp", alt: "A carved wooden figure of a wizard with a star-studded hat and staff" },
  { src: "/collectibles/wanderer.webp", alt: "A carved wooden figure of a wandering swordsman in a straw hat" },
  { src: "/collectibles/professional.webp", alt: "A carved wooden figure in a suit and glasses" },
  { src: "/collectibles/tennis.webp", alt: "A carved wooden figure of a tennis player with a racket and ball" },
  { src: "/collectibles/writer.webp", alt: "A carved wooden figure in a beanie and jacket holding a notebook and pen" },
  { src: "/collectibles/lifter.webp", alt: "A carved wooden figure of a weightlifter with a dumbbell, towel and water bottle" },
  { src: "/collectibles/trumpeter.webp", alt: "A carved wooden figure in a backwards cap holding a trumpet" },
  { src: "/collectibles/listener.webp", alt: "A carved wooden figure in headphones holding a cassette player" },
  { src: "/collectibles/saiyan.webp", alt: "A carved wooden figure of an anime martial artist in an orange gi" },
];

/**
 * A small display of collectible figures — the "multiple identities" —
 * two to a row, each standing on its own shadow. Desktop only (it lives
 * in the page's left rail, under the signature). The order is shuffled
 * on every visit; the figures stay hidden until then so the server's
 * order never flashes.
 */
export default function Collectibles({ className = "" }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const a = FIGURES.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setOrder(a);
  }, []);

  const list = (order || FIGURES.map((_, i) => i)).map((i) => FIGURES[i]);

  return (
    <ul
      className={`cl-grid ${order ? "cl-ready" : ""} ${className}`}
      aria-label="The many identities"
    >
      {list.map((f) => (
        <li key={f.src} className="cl-item">
          <div className="cl-stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.src} alt={f.alt} width="320" height="480" className="cl-figure" />
            <span aria-hidden="true" className="cl-base" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * The collectible identities as a scroller used between sections: all of
 * them, in a shuffled order, four showing at a time. Swipe or drag it, or
 * use the arrows (one figure per press, wrapping round at the ends). Shown at every width;
 * hidden until the shuffle has run so the server's order never flashes.
 */
export function CollectibleDivider({ className = "" }) {
  const [order, setOrder] = useState(null);
  const rail = useRef(null);

  useEffect(() => {
    const a = FIGURES.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setOrder(a);
  }, []);

  const list = (order || FIGURES.map((_, i) => i)).map((i) => FIGURES[i]);

  // One figure at a time (wrapping round at either end).
  const step = (dir) => {
    const el = rail.current;
    if (!el) return;
    const first = el.firstElementChild;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const one = (first ? first.getBoundingClientRect().width : el.clientWidth / 4) + gap;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    const atStart = el.scrollLeft <= 2;
    if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * one, behavior: "smooth" });
  };

  return (
    <div className={`cl-divider ${order ? "cl-ready" : ""} ${className}`}>
      <span aria-hidden="true" className="cl-divider-line" />
      <button type="button" onClick={() => step(-1)} aria-label="Previous figure" className="cl-arrow cl-arrow--prev">
        <span aria-hidden="true" className="cl-arrow-glyph">&lsaquo;</span>
      </button>
      <ul ref={rail} className="cl-divider-row" aria-label="The many identities">
        {list.map((f) => (
          <li key={f.src} className="cl-item cl-item--sm">
            <div className="cl-stage">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.src} alt={f.alt} width="320" height="480" className="cl-figure" draggable="false" />
              <span aria-hidden="true" className="cl-base" />
            </div>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => step(1)} aria-label="Next figure" className="cl-arrow cl-arrow--next">
        <span aria-hidden="true" className="cl-arrow-glyph">&rsaquo;</span>
      </button>
      <span aria-hidden="true" className="cl-divider-line" />
    </div>
  );
}
