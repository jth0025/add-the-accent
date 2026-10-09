"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { TOTAL_TRACKS } from "@/lib/catalog";
import { Sleeve } from "./Record";
import TrackArt from "./TrackArt";
import TrackNodes from "./TrackNodes";

/**
 * Long Plays — the literary album collections.
 *
 * Desktop: a horizontal record bin, the covers overlapping a little.
 * Hovering (or focusing) one brings that sleeve forward and shows its
 * description and contents beneath. Mobile: a horizontally swipeable
 * carousel with visible previous/next buttons and dots; tapping a sleeve
 * opens it. Every sleeve is a plain link, so there is always a direct way
 * in without any interaction.
 */
export default function LongPlays({ collections }) {
  const [active, setActive] = useState(0);
  const rail = useRef(null);
  const current = collections[active];

  const scrollBy = (dir) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const onRailScroll = () => {
    const el = rail.current;
    if (!el) return;
    const slide = el.firstElementChild?.clientWidth || 1;
    setActive(
      Math.max(0, Math.min(collections.length - 1, Math.round(el.scrollLeft / (slide + 16)))),
    );
  };

  return (
    <div>
      {/* Desktop: the record bin */}
      <div className="hidden md:block">
        <div className="lp-bin" onMouseLeave={() => setActive(0)}>
          {collections.map((c, i) => (
            <Link
              key={c.key}
              href={c.href}
              className="lp-slot block outline-none"
              data-active={i === active}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-label={`${c.title} — open the sleeve`}
              style={{ zIndex: i === active ? 30 : collections.length - i }}
            >
              <Sleeve collection={c} />
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-8 border-t border-white/15 pt-6 text-white lg:grid-cols-[1fr,1fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">
              Volume {String(current.volume).padStart(2, "0")}
            </p>
            <h3 className="album-title mt-2 font-display text-3xl uppercase tracking-tight" style={{ color: current.color }}>
              {current.title}
            </h3>
            <TrackNodes
              published={current.entries.length}
              color={current.color}
              showNote
              className="mt-4"
            />
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
              {current.blurb}
            </p>
            <Link
              href={current.href}
              className="mt-5 inline-block rounded-full border border-white/40 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
            >
              Explore Collection &rarr;
            </Link>
          </div>
          <ol className="font-serif">
            {Array.from({ length: TOTAL_TRACKS }, (_, i) => {
              const e = current.entries.find((x) => x.part === i + 1);
              const n = String(i + 1).padStart(2, "0");
              return e ? (
                <li key={n}>
                  <Link
                    href={`/journal/${e.slug}`}
                    className="flex items-center gap-3 border-b border-white/15 py-2 text-white/90 hover:text-accent"
                  >
                    <span className="w-6 font-mono text-xs text-white/50">{n}</span>
                    <TrackArt entry={e} size={34} />
                    <span className="flex-1 text-lg leading-tight">
                      {e.titleHtml ? (
                        <span dangerouslySetInnerHTML={{ __html: e.titleHtml }} />
                      ) : (
                        e.title
                      )}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">
                      Read
                    </span>
                  </Link>
                </li>
              ) : (
                <li
                  key={n}
                  className="flex items-center gap-3 border-b border-white/10 py-2 text-white/35"
                >
                  <span className="w-6 font-mono text-xs">{n}</span>
                  <TrackArt forthcoming size={34} />
                  <span className="flex-1 text-base italic">Forthcoming</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Mobile: a swipeable carousel */}
      <div className="md:hidden">
        <div
          ref={rail}
          onScroll={onRailScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Long Plays — swipe for more"
          role="region"
          tabIndex={0}
        >
          {collections.map((c) => (
            <div key={c.key} className="w-[72%] max-w-[18rem] shrink-0 snap-center">
              <Link href={c.href} aria-label={`${c.title} — open the sleeve`} className="block">
                <Sleeve collection={c} />
              </Link>
              <h3 className="album-title mt-3 font-display text-xl uppercase tracking-tight" style={{ color: c.color }}>
                {c.title}
              </h3>
              <TrackNodes published={c.entries.length} color={c.color} className="mt-3" />
              <Link
                href={c.href}
                className="mt-3 inline-block rounded-full border border-white/40 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-white"
              >
                Open Sleeve &rarr;
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous collection"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-xl text-white"
          >
            &lsaquo;
          </button>
          <div className="flex gap-2" aria-hidden="true">
            {collections.map((c, i) => (
              <span
                key={c.key}
                className={`h-2 w-2 rounded-full ${i === active ? "bg-accent" : "bg-white/30"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next collection"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-xl text-white"
          >
            &rsaquo;
          </button>
        </div>
      </div>
    </div>
  );
}
