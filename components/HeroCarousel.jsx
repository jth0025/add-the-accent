"use client";

import { useEffect, useRef, useState } from "react";

// A diverse spread of JT's own work and world — vision, design,
// creativity, lifestyle, and photography, plus a run of family photos
// and kindergarten-graduation snapshots. Shuffled so like sits next to
// unlike and the loop keeps shifting registers as it plays.
const CAROUSEL_IMAGES = [
  { src: "/carousel/tree-head-cliff.jpg", alt: "A surreal black-and-white portrait of a bonsai tree standing in for a man's head, seated on a cliff above the sea" },
  { src: "/carousel/grad-cap-hallway.jpg", alt: "A young boy in a paper graduation cap walking a school hallway, caught mid-stride" },
  { src: "/carousel/black-samurai-jungle.jpg", alt: "A figure in gold-and-black samurai armor standing sword in hand in a misty jungle" },
  { src: "/carousel/ocean-horizon.jpg", alt: "A calm ocean horizon, still water meeting a soft sky" },
  { src: "/carousel/kitchen-party-portrait.jpg", alt: "A vintage portrait of a woman seated at a kitchen counter mid-gathering" },
  { src: "/carousel/flying-men.jpg", alt: "Two figures suspended mid-fall through a surreal cloud, part of a personal design series" },
  { src: "/carousel/forest-portrait.jpg", alt: "A double-exposure portrait blended with a forest canopy" },
  { src: "/carousel/straw-hat-wedding-selfie.jpg", alt: "A close selfie of a couple on their wedding day, one in a straw hat, one in a veil" },
  { src: "/carousel/paradise-cover.jpg", alt: "Album cover artwork, \"Paradise\" by Jamal Moore featuring Kenyon Dixon" },
  { src: "/carousel/jungle-toucan.jpg", alt: "An illustrated jungle scene with toucans, flowers, and a traveler" },
  { src: "/carousel/school-letter-k.jpg", alt: "A boy in an orange paper cap beside a towering letter K on a brick school wall" },
  { src: "/carousel/beach-family-fence.jpg", alt: "A family gathered at a weathered beach fence in the summer light" },
  { src: "/carousel/photoshop-desk.jpg", alt: "A laptop open to a design in progress — abstract green and coral shapes in Photoshop" },
  { src: "/carousel/cloud-flight-illustration.jpg", alt: "A silhouetted figure tumbling through a cloud-framed sky, birds scattered around him and sunlight bursting below" },
  { src: "/carousel/fiddle-leaf-window.jpg", alt: "A fiddle-leaf fig framed against a rain-flecked window and the city beyond" },
  { src: "/carousel/three-faces.jpg", alt: "Three faces layered among tropical leaves in a green composite portrait" },
  { src: "/carousel/seventeen-leaves.jpg", alt: "The numerals 17 filled with vivid blue and green leaf photography" },
  { src: "/carousel/rainy-alley-bmw.jpg", alt: "A figure in a leather jacket walking past a rain-soaked vintage BMW in a lit alley at night" },
  { src: "/carousel/night-village-illustration.jpg", alt: "A painterly illustration of a figure in a blue coat overlooking a moonlit hillside village" },
  { src: "/carousel/floating-armchair.jpg", alt: "A woman perched on a floating leaf-covered armchair above a jungle horizon" },
  { src: "/carousel/desert-ocean.jpg", alt: "A figure reclined between desert dunes and an ocean horizon at sunset" },
  { src: "/carousel/beach-selfie-shades.jpg", alt: "A sunlit group selfie at the beach, four faces in sunglasses and bucket hats" },
  { src: "/carousel/family-portrait-vintage.jpg", alt: "A vintage family portrait at a waterfront railing, caught mid-celebration" },
  { src: "/carousel/graduation-walk-diploma.jpg", alt: "A boy carries his diploma down the aisle at a kindergarten graduation" },
  { src: "/carousel/streetball-palms.jpg", alt: "A black-and-white photograph of a streetball court framed by palm trees" },
  { src: "/carousel/underwater-boxer.jpg", alt: "A boxer shadowboxing underwater among fish and lightning" },
  { src: "/carousel/blue-suit-mercedes.jpg", alt: "A man in a blue windowpane three-piece suit leaning against a Mercedes under a big sky" },
  { src: "/carousel/botanical-birds-illustration.jpg", alt: "An ornate illustration of tropical birds, flowers, and a traveling figure" },
  { src: "/carousel/gallery-wall-interior.jpg", alt: "An interior moment in a room lined with a gallery wall of framed photographs" },
  { src: "/carousel/bandana-sunglasses.jpg", alt: "A floating bandana and sunglasses composite with green and gold smoke" },
  { src: "/carousel/kindergarten-graduation-teacher.jpg", alt: "A kindergarten graduate flanked by his teacher and a classmate beneath the alphabet frieze" },
  { src: "/carousel/texas-cap-kitchen.jpg", alt: "A man in a Texas cap and a young boy throwing peace signs in a bright kitchen" },
  { src: "/carousel/cloud-suit-figure.jpg", alt: "A tall figure in a plaid suit and fedora standing among clouds" },
  { src: "/carousel/smoke-dissolve-portrait.jpg", alt: "A tailored figure dissolving into green smoke and leaves" },
  { src: "/carousel/kaleidoscope-24.jpg", alt: "A kaleidoscope design built from basketball motion and numerals" },
];

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
      <div
        className="marble-dark corner-box on-dark relative mt-14 overflow-hidden rounded-xl border border-white/20"
        style={{ height: carouselHeight }}
        aria-label="A scrolling selection of Add the Accent design work"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/brush-icon-blue.png"
          alt=""
          aria-hidden="true"
          className="absolute left-3 top-1 z-10 w-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
        />
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
      </div>

      <section
        ref={heroRef}
        className="relative mt-6 px-2 py-8 sm:px-6 sm:py-10"
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
