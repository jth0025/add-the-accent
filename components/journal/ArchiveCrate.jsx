"use client";

import Link from "next/link";
import { useRef, useState } from "react";

/**
 * The essays' art stacked in a crate beside the Archive. The front card
 * is a link to its essay; the others peek out behind it — click one to
 * bring it forward, use the arrows, swipe, press ← →, or hit Shuffle to
 * mix the crate. (Browsing never depends on this: every essay is also in
 * the plain list next to it.)
 */
export default function ArchiveCrate({ items }) {
  const [order, setOrder] = useState(items);
  const [front, setFront] = useState(0);
  const startX = useRef(null);
  const n = order.length;

  const go = (d) => setFront((f) => (f + d + n) % n);
  const shuffle = () => {
    const a = [...order];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setOrder(a);
    setFront(0);
  };

  const onKey = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const current = order[front];

  return (
    <div className="mx-auto w-full max-w-[17rem]">
      <div
        role="group"
        aria-label="The crate — essay art. Arrow keys flip through."
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={(e) => {
          startX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (startX.current == null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (dx < -40) go(1);
          else if (dx > 40) go(-1);
        }}
        className="relative h-[21rem] touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {order.map((it, i) => {
          const off = (i - front + n) % n; // 0 = front
          if (off > 5) return null;
          const isFront = off === 0;
          return (
            <Link
              key={it.slug}
              href={it.href}
              draggable={false}
              onClick={(e) => {
                if (!isFront) {
                  e.preventDefault();
                  setFront(i);
                }
              }}
              aria-label={isFront ? `Read ${it.title}` : `Bring forward: ${it.title}`}
              tabIndex={isFront ? 0 : -1}
              className="cr-card absolute left-0 top-0 block w-[78%] overflow-hidden rounded-[3px] outline-none"
              style={{
                zIndex: 10 - off,
                transform: `translate(${off * 13}%, ${-off * 2.2}%) scale(${1 - off * 0.035})`,
                opacity: 1 - off * 0.1,
                filter: isFront ? "none" : `brightness(${1 - off * 0.12})`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.src} alt="" draggable={false} className="block aspect-[3/4] w-full object-cover" />
            </Link>
          );
        })}
        {/* the crate's front slats */}
        <div className="cr-front pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3.6rem]" aria-hidden="true" />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous essay in the crate"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-lg text-white hover:border-accent hover:text-accent"
        >
          &lsaquo;
        </button>
        <button
          type="button"
          onClick={shuffle}
          className="rounded-full border border-white/40 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-white hover:border-accent hover:text-accent"
        >
          Shuffle
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next essay in the crate"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-lg text-white hover:border-accent hover:text-accent"
        >
          &rsaquo;
        </button>
      </div>
      <p className="mt-3 text-center" aria-live="polite">
        <Link href={current.href} className="font-serif text-lg italic leading-tight text-white hover:text-accent">
          {current.title}
        </Link>
        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-white/55">
          {current.catalog}
        </span>
      </p>
    </div>
  );
}
