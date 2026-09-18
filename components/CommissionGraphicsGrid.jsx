"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PIECES, tagsOf } from "@/lib/designPieces";

const COMMISSIONED = PIECES.filter((p) => tagsOf(p.alt).includes("commission"));

/**
 * A teaser grid of #commission-tagged graphic design pieces for the
 * portfolio page. Each tile fades and slides in from the left once the
 * grid scrolls into view (staggered), then links out to the full
 * gallery — this column doesn't carry its own lightbox.
 */
export default function CommissionGraphicsGrid() {
  const ref = useRef(null);
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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="columns-2 gap-3">
      {COMMISSIONED.map((piece, i) => (
        <Link
          key={piece.src}
          href="/design"
          className={`fade-slide-left group relative mb-3 block w-full overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl ${
            visible ? "is-visible" : ""
          }`}
          style={{ transitionDelay: `${Math.min(i * 70, 560)}ms` }}
          aria-label={`View the graphic design gallery — ${piece.alt.replace(/#/g, "")}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={piece.src}
            alt=""
            className="block w-full"
            loading="lazy"
          />
          <span className="bronze-glare" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/design/commission-badge.png"
            alt=""
            className="pointer-events-none absolute -left-1.5 -top-1.5 z-10 h-8 w-8 drop-shadow-md sm:h-9 sm:w-9"
          />
        </Link>
      ))}
    </div>
  );
}
