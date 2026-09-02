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
        className="paper-newspaper corner-box relative mt-14 overflow-hidden rounded-xl border border-ink/15 bg-card"
        style={heroHeight ? { height: heroHeight } : { minHeight: 260 }}
        aria-label="A scrolling selection of Add the Accent design work"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/brush-icon.png"
          alt=""
          aria-hidden="true"
          className="absolute left-3 top-3 z-10 w-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
        />
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
        className="paper-notebook corner-box relative mt-6 overflow-hidden rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10 sm:py-12"
      >
        {children}
      </section>
    </>
  );
}
