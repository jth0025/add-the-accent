"use client";

import { useEffect, useState } from "react";
import "./collectibles.css";

// The identities, two to a shelf. Carved-wood figures with no faces: one
// person, many roles.
const FIGURES = [
  { src: "/collectibles/photographer.webp", alt: "A carved wooden figure of a photographer with two cameras" },
  { src: "/collectibles/wizard.webp", alt: "A carved wooden figure of a wizard with a star-studded hat and staff" },
  { src: "/collectibles/wanderer.webp", alt: "A carved wooden figure of a wandering swordsman in a straw hat" },
  { src: "/collectibles/professional.webp", alt: "A carved wooden figure in a suit and glasses" },
  { src: "/collectibles/tennis.webp", alt: "A carved wooden figure of a tennis player with a racket and ball" },
  { src: "/collectibles/writer.webp", alt: "A carved wooden figure in a beanie and jacket holding a notebook and pen" },
  { src: "/collectibles/lifter.webp", alt: "A carved wooden figure of a weightlifter with a dumbbell, towel and water bottle" },
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
