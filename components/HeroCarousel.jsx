"use client";

import { useEffect, useRef, useState } from "react";
import { CAROUSEL_IMAGES } from "@/lib/carouselImages";

export default function HeroCarousel({ children }) {
  const heroRef = useRef(null);
  const [heroHeight, setHeroHeight] = useState(null);
  // The currently enlarged image, or null when the lightbox is closed.
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return undefined;

    const update = () => setHeroHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Close the lightbox on Escape.
  useEffect(() => {
    if (!lightbox) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

  const strip = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];
  // The carousel box is a fraction of the hero copy's height — smaller
  // than the text block beside it, but never below a sensible floor.
  const carouselHeight = heroHeight
    ? Math.max(200, Math.round(heroHeight * 0.7))
    : 220;
  // Each framed image is sized down from the box height so the whole
  // strip is visible at a glance, rather than one giant photo at a time
  // — the image itself still fills its own frame edge to edge.
  const frameHeight = Math.round(carouselHeight * 0.8);

  return (
    <>
      <div className="relative mt-14">
        {/* The mascot, seated reading on the box's top-left edge — his
            own drawn seat-line (roughly 60% down the artwork) is what
            lands on the box's top border; translateY shifts him down by
            that same fraction of his own rendered height so his legs and
            sneaker hang over the front of the box regardless of size. */}
        <div
          className="pointer-events-none absolute bottom-full -left-9 z-20 w-24 sm:-left-7 sm:w-32"
          style={{ transform: "translateY(40%)" }}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mascot-reading.png"
            alt=""
            className="w-full [filter:drop-shadow(0_5px_6px_rgba(0,0,0,0.4))]"
          />
        </div>

        {/* Real rabbit-ear antenna, standing on top of the box's top-right
            edge. An electric signal crackles between the ears now and
            then, as if it's pulling in a picture. */}
        <div
          className="pointer-events-none absolute bottom-full right-6 z-20 w-16 -translate-y-[1px] sm:right-10 sm:w-20"
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tv-antenna.png"
            alt=""
            className="w-full [filter:drop-shadow(0_3px_4px_rgba(0,0,0,0.45))]"
          />
          <svg
            viewBox="0 0 100 20"
            className="tv-signal absolute left-[14%] top-[17%] w-[72%] overflow-visible"
          >
            <path
              d="M10 10 L22 4 L18 13 L32 5 L27 14 L45 5 L40 13 L57 4 L52 13 L70 4 L65 12 L82 5 L92 8"
              fill="none"
              stroke="#dcf4ff"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="[filter:drop-shadow(0_0_2.5px_#8fdcff)]"
            />
            <circle cx="10" cy="10" r="1.8" fill="#eef9ff" className="[filter:drop-shadow(0_0_3px_#8fdcff)]" />
            <circle cx="92" cy="8" r="1.8" fill="#eef9ff" className="[filter:drop-shadow(0_0_3px_#8fdcff)]" />
          </svg>
        </div>

        {/* Real tapered TV legs, planted on the bottom edge; their wide
            tops tuck behind the box so they read as attached. Wrapped so
            the ground-contact shadow below can anchor to the image's own
            rendered bottom edge (where the feet actually land) at any
            viewport width, instead of a guessed pixel offset. */}
        <div
          className="pointer-events-none absolute top-full left-1/2 z-0 w-[30%] max-w-[260px] -translate-x-1/2 -translate-y-[16%] sm:w-[26%]"
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tv-legs.png"
            alt=""
            className="block w-full [filter:drop-shadow(0_4px_4px_rgba(0,0,0,0.4))]"
          />
          <span className="absolute bottom-[15%] left-1/2 h-5 w-[130%] -translate-x-1/2 translate-y-1/2 rounded-[50%] bg-black/35 blur-[6px]" />
        </div>

        <div
          className="marble-dark corner-box on-dark relative z-10 overflow-hidden rounded-xl border border-white/20"
          style={{ height: carouselHeight }}
          aria-label="A scrolling selection of Add the Accent design work"
        >
          <div className="marquee-track flex h-full w-max items-center gap-4 pl-4 pt-2 pb-6">
            {strip.map((img, i) => (
              <button
                key={`${img.src}-${i}`}
                type="button"
                onClick={() => setLightbox(img)}
                className="flex shrink-0 cursor-zoom-in items-center justify-center rounded-md border border-ink/40 bg-[#efeee6] p-1.5 shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition-transform hover:scale-[1.03]"
                style={{ height: frameHeight }}
                aria-label={
                  i < CAROUSEL_IMAGES.length
                    ? `Enlarge: ${img.alt}`
                    : undefined
                }
                tabIndex={i < CAROUSEL_IMAGES.length ? 0 : -1}
                aria-hidden={i < CAROUSEL_IMAGES.length ? undefined : "true"}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={i < CAROUSEL_IMAGES.length ? img.alt : ""}
                  aria-hidden={i < CAROUSEL_IMAGES.length ? undefined : "true"}
                  className="h-full w-auto max-w-none object-contain"
                  draggable={false}
                />
              </button>
            ))}
          </div>

          {/* TV static — the carousel already reads as a screen (antenna
              and legs sit just outside it), so it periodically loses
              signal for a beat: a snowy grain layer plus a band of
              scanlines flicker across, then settle back to nothing. */}
          <div
            className="tv-static-noise pointer-events-none absolute inset-0 z-20"
            aria-hidden="true"
          />
          <div
            className="tv-static-lines pointer-events-none absolute inset-0 z-20"
            aria-hidden="true"
          />

          {/* A control strip along the bottom edge — a power light,
              channel/volume knobs, and a speaker grille either side —
              so the box reads as a real console TV, not just a framed
              screen. Sits above the static so the bezel itself never
              "loses signal." */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex h-5 items-center justify-center gap-4 border-t border-white/10 bg-black/55"
          >
            <span className="flex items-center gap-[3px]" aria-hidden="true">
              <span className="h-2 w-[2px] rounded-full bg-white/25" />
              <span className="h-2 w-[2px] rounded-full bg-white/25" />
              <span className="h-2 w-[2px] rounded-full bg-white/25" />
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#e0403f] shadow-[0_0_4px_rgba(224,64,63,0.9)]" />
            <span className="h-2 w-2 shrink-0 rounded-full border border-white/40" />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-white/50" />
            <span className="h-2 w-2 shrink-0 rounded-full border border-white/40" />
            <span className="flex items-center gap-[3px]" aria-hidden="true">
              <span className="h-2 w-[2px] rounded-full bg-white/25" />
              <span className="h-2 w-[2px] rounded-full bg-white/25" />
              <span className="h-2 w-[2px] rounded-full bg-white/25" />
            </span>
          </div>
        </div>
      </div>

      <section
        ref={heroRef}
        className="relative mt-16 px-2 py-8 sm:mt-24 sm:px-6 sm:py-10"
      >
        {children}
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-black/85 p-10"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            aria-label="Close"
            className="absolute right-7 top-5 cursor-pointer text-3xl leading-none text-[#e7ded2]"
          >
            &times;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] cursor-default rounded-lg shadow-2xl"
          />
          {lightbox.alt && (
            <div className="absolute inset-x-10 bottom-7 text-center font-sans text-[13px] text-[#e7ded2]">
              {lightbox.alt}
            </div>
          )}
        </div>
      )}
    </>
  );
}
