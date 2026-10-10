"use client";

import Link from "next/link";
import { useRef, useState } from "react";

/**
 * Phones: The Singles Collection in the same kind of scroller as the Long
 * Plays — a swipeable row with visible previous/next buttons and dots. The
 * first slide is the collection's cover; then each single, as its small
 * paper sleeve with the circular centre label. Every slide is a plain link.
 * (Wider screens use the side-by-side layout in app/journal/page.jsx.)
 */
export default function SinglesCarousel({ cover, href, color, ink, items }) {
  const rail = useRef(null);
  const [active, setActive] = useState(0);
  const count = items.length + 1;

  const scrollBy = (dir) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const slide = el.firstElementChild?.clientWidth || 1;
    setActive(Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / (slide + 16)))));
  };

  return (
    <div>
      <div
        ref={rail}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="The Singles Collection — swipe for more"
        role="region"
        tabIndex={0}
      >
        <div className="w-[72%] max-w-[18rem] shrink-0 snap-center">
          <Link href={href} aria-hidden="true" tabIndex={-1} className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt="The Singles Collection — a man in a white shirt, eyes closed, loose pages drifting past a blue wall"
              loading="lazy"
              className="block aspect-square w-full rounded-[3px] object-cover shadow-[0_14px_26px_rgba(0,0,0,0.5)]"
            />
          </Link>
          <h3 className="album-title mt-3 font-display text-xl uppercase tracking-tight" style={{ color }}>
            The Singles Collection
          </h3>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-white/80">
            {items.length} singles
          </p>
          <Link
            href={href}
            aria-label="Explore Collection: The Singles Collection"
            className="mt-3 inline-block rounded-full border border-white/40 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-white"
          >
            Explore Collection &rarr;
          </Link>
        </div>

        {items.map((it) => (
          <div key={it.slug} className="w-[72%] max-w-[18rem] shrink-0 snap-center">
            <Link href={`/journal/${it.slug}`} className="group block outline-none">
              <div className="sg-sleeve" style={{ "--rec-color": color, "--rec-ink": ink }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/journal-art/plus-orange.webp" alt="" aria-hidden="true" className="sg-plus" />
                <div className="sg-window" aria-hidden="true">
                  <span className="rec-label-name">{it.title}</span>
                  <span className="rec-label-cat">{it.catalog}</span>
                </div>
              </div>
              <h3 className="mt-3 font-serif text-lg italic leading-tight text-white">
                {it.titleHtml ? (
                  <span dangerouslySetInnerHTML={{ __html: it.titleHtml }} />
                ) : (
                  it.title
                )}
              </h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/55">
                {it.catalog} · {it.dateLabel} · {it.minutes} min
              </p>
              <span className="mt-2 inline-block font-mono text-[11px] font-bold uppercase tracking-widest text-accent">
                Read &rarr;
              </span>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Previous single"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-xl text-white"
        >
          &lsaquo;
        </button>
        <div className="flex gap-2" aria-hidden="true">
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className={`h-2 w-2 rounded-full ${i === active ? "bg-accent" : "bg-white/30"}`} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Next single"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-xl text-white"
        >
          &rsaquo;
        </button>
      </div>
    </div>
  );
}
