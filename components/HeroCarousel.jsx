"use client";

import { useEffect, useRef, useState } from "react";

// Inspiration pieces from JT's own design work — arranged to move from
// bold and colorful into moodier, more intimate pieces as it loops.
const CAROUSEL_IMAGES = [
  { src: "/carousel/flying-men.jpg", alt: "Two figures suspended mid-fall through a surreal cloud, part of a personal design series" },
  { src: "/carousel/floating-armchair.jpg", alt: "A woman perched on a floating leaf-covered armchair above a jungle horizon" },
  { src: "/carousel/paradise-cover.jpg", alt: "Album cover artwork, \"Paradise\" by Jamal Moore featuring Kenyon Dixon" },
  { src: "/carousel/seventeen-leaves.jpg", alt: "The numerals 17 filled with vivid blue and green leaf photography" },
  { src: "/carousel/three-faces.jpg", alt: "Three faces layered among tropical leaves in a green composite portrait" },
  { src: "/carousel/underwater-boxer.jpg", alt: "A boxer shadowboxing underwater among fish and lightning" },
  { src: "/carousel/desert-ocean.jpg", alt: "A figure reclined between desert dunes and an ocean horizon at sunset" },
  { src: "/carousel/jungle-toucan.jpg", alt: "An illustrated jungle scene with toucans, flowers, and a traveler" },
  { src: "/carousel/bandana-sunglasses.jpg", alt: "A floating bandana and sunglasses composite with green and gold smoke" },
  { src: "/carousel/forest-portrait.jpg", alt: "A double-exposure portrait blended with a forest canopy" },
];

export default function HeroCarousel({ children }) {
  const heroRef = useRef(null);
  const [heroHeight, setHeroHeight] = useState(null);

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

  const strip = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];
  // Each framed image is sized down from the full carousel height so the
  // whole strip is visible at a glance, rather than one giant photo at a
  // time — the image itself still fills its own frame edge to edge.
  const frameHeight = heroHeight ? Math.round(heroHeight * 0.78) : 220;

  return (
    <>
      <div
        className="corner-box relative mt-14 overflow-hidden rounded-xl border border-ink/15 bg-card"
        style={heroHeight ? { height: heroHeight } : { minHeight: 260 }}
        aria-label="A scrolling selection of Add the Accent design work"
      >
        <div className="absolute left-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#f1f0ea]/90 shadow-sm">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            aria-hidden="true"
            focusable="false"
          >
            <g transform="rotate(45 12 12)">
              <rect x="10" y="1" width="4" height="9" rx="1.5" fill="#1a1a1a" />
              <rect x="9" y="9" width="6" height="2.5" fill="#1a1a1a" />
              <path
                d="M9 11.5 H15 L13.2 18.5 Q12 20.5 10.8 18.5 Z"
                fill="#1a1a1a"
              />
            </g>
          </svg>
        </div>
        <div className="marquee-track flex h-full w-max items-center gap-4 py-4 pl-4">
          {strip.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className="flex shrink-0 items-center justify-center rounded-md border border-ink/40 bg-[#efeee6] p-1.5 shadow-[0_6px_18px_rgba(0,0,0,0.18)]"
              style={{ height: frameHeight }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={i < CAROUSEL_IMAGES.length ? img.alt : ""}
                aria-hidden={i < CAROUSEL_IMAGES.length ? undefined : "true"}
                className="h-full w-auto max-w-none object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <section
        ref={heroRef}
        className="corner-box relative mt-6 overflow-hidden rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10 sm:py-12"
      >
        {children}
      </section>
    </>
  );
}
