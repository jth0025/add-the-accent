"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { COLLECTIBLES, FIGURE_ALIASES } from "@/lib/collectibles";
import { Preview } from "@/components/collectibles/CollectiblePreview";
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
  { src: "/collectibles/drum-major.webp", alt: "A carved wooden figure in a black marching-band uniform with a tall plume, a silver visor and a trumpet" },
  { src: "/collectibles/homebody.webp", alt: "A carved wooden figure in a flower-patch cap, cream tee and sneakers, hands in his pockets" },
];

// The story behind each figure (lib/collectibles.js), found from its image.
const storyFor = (src) => {
  const slug = src.split("/").pop().replace(".webp", "");
  const figure = FIGURE_ALIASES[slug] || slug;
  return COLLECTIBLES.find((c) => c.figure === figure);
};

// One figure in the left rail. Hovering (or focusing) it opens the same
// editorial preview the boxed collectibles on the Journal page have.
function RailItem({ f, open, onOpen, onClose }) {
  const stageRef = useRef(null);
  const liRef = useRef(null);
  const timer = useRef(null);
  const story = storyFor(f.src);
  const pid = `cl-preview-${story?.id}`;
  useEffect(() => () => clearTimeout(timer.current), []);
  const hold = () => clearTimeout(timer.current);
  const release = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(onClose, 450);
  };
  return (
    <li
      ref={liRef}
      className="cl-item"
      onMouseEnter={() => {
        hold();
        if (story) onOpen();
      }}
      onMouseLeave={release}
      onFocus={() => {
        hold();
        if (story) onOpen();
      }}
      onBlur={(e) => {
        if (!liRef.current?.contains(e.relatedTarget)) onClose();
      }}
    >
      <button
        type="button"
        className="cl-hit"
        aria-expanded={open}
        aria-controls={open ? pid : undefined}
        aria-label={story ? `${story.identity}, collectible ${story.number}. Show the story preview.` : undefined}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <div ref={stageRef} className="cl-stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={f.src} alt={f.alt} width="320" height="480" className="cl-figure" />
          <span aria-hidden="true" className="cl-base" />
        </div>
      </button>
      {open && story && <Preview item={story} anchorRef={stageRef} onClose={onClose} id={pid} />}
    </li>
  );
}

/**
 * A small display of collectible figures — the "multiple identities" —
 * two to a row, each standing on its own shadow. Desktop only (it lives
 * in the page's left rail, under the signature). The order is shuffled
 * on every visit; the figures stay hidden until then so the server's
 * order never flashes.
 */
export default function Collectibles({ className = "" }) {
  const [order, setOrder] = useState(null);
  const [openSrc, setOpenSrc] = useState(null);

  useEffect(() => {
    const a = FIGURES.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setOrder(a);
  }, []);

  // Escape puts the open preview away.
  useEffect(() => {
    if (!openSrc) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpenSrc(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openSrc]);

  const list = (order || FIGURES.map((_, i) => i)).map((i) => FIGURES[i]);

  return (
    <ul
      className={`cl-grid ${order ? "cl-ready" : ""} ${className}`}
      aria-label="The many identities"
    >
      {list.map((f) => (
        <RailItem
          key={f.src}
          f={f}
          open={openSrc === f.src}
          onOpen={() => setOpenSrc(f.src)}
          onClose={() => setOpenSrc((cur) => (cur === f.src ? null : cur))}
        />
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
export function CollectibleDivider({ className = "", id }) {
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

  // Arriving on its anchor (the signature links to /about#collectibles):
  // the browser jumps before the page has settled, and the layout above
  // shrinks afterwards, leaving the divider far up off screen. Keep it
  // pinned to the top of the screen until the page settles, or until the
  // visitor scrolls on their own.
  useEffect(() => {
    if (!id || window.location.hash !== `#${id}`) return;
    const el = document.getElementById(id);
    if (!el) return;
    const pin = () => el.scrollIntoView({ block: "start", behavior: "instant" });
    const ro = new ResizeObserver(pin);
    const stop = () => {
      ro.disconnect();
      window.removeEventListener("load", pin);
      ["wheel", "touchstart", "keydown", "mousedown"].forEach((t) => window.removeEventListener(t, stop));
    };
    pin();
    ro.observe(document.body);
    window.addEventListener("load", pin);
    ["wheel", "touchstart", "keydown", "mousedown"].forEach((t) => window.addEventListener(t, stop, { passive: true }));
    const done = setTimeout(stop, 2500);
    return () => {
      clearTimeout(done);
      stop();
    };
  }, [id]);

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
    <div id={id} className={`cl-divider scroll-mt-0 ${order ? "cl-ready" : ""} ${className}`}>
      <span aria-hidden="true" className="cl-divider-line" />
      <button type="button" onClick={() => step(-1)} aria-label="Previous figure" className="cl-arrow cl-arrow--prev">
        <span aria-hidden="true" className="cl-arrow-glyph">&lsaquo;</span>
      </button>
      <ul ref={rail} className="cl-divider-row" aria-label="The many identities">
        {list.map((f) => {
          const story = storyFor(f.src);
          const figure = (
            <div className="cl-stage">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.src} alt={f.alt} width="320" height="480" className="cl-figure" draggable="false" />
              <span aria-hidden="true" className="cl-base" />
            </div>
          );
          return (
            <li key={f.src} className="cl-item cl-item--sm">
              {story ? (
                // Each figure opens its collector's card.
                <Link
                  href={`/journal/collectibles/${story.id}`}
                  draggable="false"
                  aria-label={`${story.identity}, collector\u2019s card ${story.number}`}
                  className="block outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-[#f0d58e]"
                >
                  {figure}
                </Link>
              ) : (
                figure
              )}
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={() => step(1)} aria-label="Next figure" className="cl-arrow cl-arrow--next">
        <span aria-hidden="true" className="cl-arrow-glyph">&rsaquo;</span>
      </button>
      <span aria-hidden="true" className="cl-divider-line" />
    </div>
  );
}

// The original (smaller) figure image for each collectible: two of them were
// combined into one collectible, so those two point at the surviving figure.
const SLIDER_IMAGE = { "trumpeter-green": "trumpeter", "listener-red": "listener" };

/**
 * The collectibles as a slider for phones and tablets (the left rail only has
 * room on wide desktops). Swipe it or use the arrows; every figure links to
 * its collector's card. Shown in order, three or so at a time.
 */
export function CollectibleSlider({ className = "" }) {
  const rail = useRef(null);
  const router = useRouter();
  const [lit, setLit] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  // Tapping a figure first lights it, with the same sunrise glow the figures
  // on the desktop rail get on hover, then opens its card a moment later.
  const open = (e, c) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    setLit(c.id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => router.push(`/journal/collectibles/${c.id}`), reduce ? 0 : 420);
  };

  // One figure per press, wrapping round at either end.
  const step = (dir) => {
    const el = rail.current;
    if (!el) return;
    const first = el.firstElementChild;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const one = (first ? first.getBoundingClientRect().width : el.clientWidth / 3) + gap;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    const atStart = el.scrollLeft <= 2;
    if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * one, behavior: "smooth" });
  };

  return (
    <section className={`cs ${className}`} aria-label="The Collectibles">
      <div className="cs-head">
        <span>The Collectibles</span>
        <em>Different forms. One story.</em>
      </div>
      <div className="cs-wrap">
        <button type="button" onClick={() => step(-1)} aria-label="Previous collectible" className="cl-arrow cl-arrow--prev">
          <span aria-hidden="true" className="cl-arrow-glyph">&lsaquo;</span>
        </button>
        <ul ref={rail} className="cs-row">
          {COLLECTIBLES.map((c) => (
            <li key={c.id} className="cs-item">
              <Link
                href={`/journal/collectibles/${c.id}`}
                className={`cs-link${lit === c.id ? " is-lit" : ""}`}
                onClick={(e) => open(e, c)}
                aria-label={`${c.identity}, collector\u2019s card ${c.number}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/collectibles/${SLIDER_IMAGE[c.figure] || c.figure}.webp`}
                  alt={c.alt}
                  width="320"
                  height="480"
                  loading="lazy"
                  draggable="false"
                  className="cs-fig"
                />
                <span aria-hidden="true" className="cs-base" />
                <span className="cs-name">{c.identity}</span>
              </Link>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => step(1)} aria-label="Next collectible" className="cl-arrow cl-arrow--next">
          <span aria-hidden="true" className="cl-arrow-glyph">&rsaquo;</span>
        </button>
      </div>
    </section>
  );
}
