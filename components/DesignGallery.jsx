"use client";

import { useEffect, useState } from "react";

function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Graphic design / composite work — click any piece to enlarge. Add new
// pieces by dropping an optimized image in public/design/ and adding an
// entry here (src + a real alt description, used as the lightbox caption).
const PIECES = [
  { src: "/design/loomieverse-collage.jpg", alt: '"Loomieverse" — a maximalist space collage of floating islands, astronauts, and dancers swept into a cosmic vortex' },
  { src: "/design/ufo-abduction-bw.jpg", alt: "Black-and-white composite of a figure drawn up into a UFO's beam of light" },
  { src: "/design/aerial-beach-face.jpg", alt: "An aerial beach photo composited with a man's face emerging from the surf" },
  { src: "/design/plant-jar-face.jpg", alt: "A man's face obscured behind a jar of monstera leaves, backlit by warm window light" },
  { src: "/design/balloon-chair-portrait.jpg", alt: "A man in a party hat on a flower-covered armchair, checking his phone beside a red balloon and a blue window" },
  { src: "/design/neon-blood-couple.jpg", alt: "A couple at a dinner table, their faces replaced by glowing blue and pink neon outlines" },
  { src: "/design/fire-scarf-bust.jpg", alt: "A bust wrapped in a purple paisley scarf and round sunglasses, one side dissolving into fire and smoke" },
  { src: "/design/loomis-butterfly-cover.jpg", alt: '"Loomi$" cover art — a woman covered in butterflies and chain jewelry, gazing into a swirling psychedelic sky' },
  { src: "/design/underwater-leaf-koi-portrait.jpg", alt: "An underwater portrait, a man's eyes covered by a large leaf, surrounded by koi and bubbles" },
  { src: "/design/cozy-plant-room.jpg", alt: "A man seated in a plant-filled, sunlit reading nook with felt clouds hanging from the ceiling" },
  { src: "/design/jungle-neon-water-portrait.jpg", alt: "A profile portrait dissolving into water and sharks below the shoulders, framed in neon against jungle foliage" },
  { src: "/design/book-lantern-reader.jpg", alt: "A tiny figure reading inside the pages of a giant open book, lit by a lantern under a glowing storm cloud" },
  { src: "/design/swan-sunset.jpg", alt: "A woman riding a swan-shaped boat across still water under a dramatic pink sunset sky" },
  { src: "/design/flower-goddess-moon.jpg", alt: "A woman crowned in flowers, backlit by a giant glowing moon, a butterfly perched on her fingertip" },
  { src: "/design/neon-sunset-smoking.jpg", alt: "A figure exhaling smoke that becomes birds, lit by a neon tropical sunset" },
  { src: "/design/underwater-boxer-storm.jpg", alt: "A boxer shadowboxing underwater, lightning striking through storm clouds and schools of fish" },
  { src: "/design/jungle-x-portrait.jpg", alt: 'A portrait in glasses and a suit framed inside a giant "X", surrounded by jungle foliage and butterflies' },
  { src: "/design/phone-booth-neon-night.jpg", alt: "A man on a payphone inside a glowing neon-outlined phone booth under a full moon" },
  { src: "/design/desert-ocean-falling-man.jpg", alt: "A man reclined between a desert dune and calm ocean water at sunset, reaching toward a small raining cloud" },
  { src: "/design/paradise-album-cover.jpg", alt: '"Paradise" — album cover for Jamal Moore featuring Kenyon Dixon, two men seated in a flooded, chandelier-lit room' },
  { src: "/design/piano-stairway-car.jpg", alt: "A man leaning on a vintage car beneath a staircase of piano keys rising into a glowing cloud" },
  { src: "/design/clouded-suit-portrait.jpg", alt: "A man in a double-breasted plaid suit and sunglasses standing chest-deep in a field of green clouds" },
  { src: "/design/leaf-seventeen.jpg", alt: 'The number "17" cut from a pattern of glowing blue and green tropical leaves' },
  { src: "/design/neon-outline-couple.jpg", alt: "A couple seated at a table, their faces traced in glowing blue and pink neon outlines" },
  { src: "/design/tree-head-chair-bw.jpg", alt: "Black-and-white portrait of a suited man seated in a chair, his head replaced by a wind-bent tree, a bird on his foot" },
  { src: "/design/mosaic-village-family.jpg", alt: "A mosaic-style illustration of a towering man and woman in patterned coats overlooking a village of children and small houses" },
  { src: "/design/armchair-tentacles-portrait.jpg", alt: "A woman lounging on a leaf-covered green armchair over a yellow sky, her legs dissolving into vines, camera gear, and octopus tentacles below" },
  { src: "/design/earth-cube-underwater-man.jpg", alt: "A man crouched atop a floating cube of earth, its underside opening into an underwater scene, ringed by a purple neon halo" },
  { src: "/design/bird-head-balloon-girl.jpg", alt: "A man with a bird's head in a black suit beside a girl in a red dress holding balloons, set against a purple sky" },
  { src: "/design/floral-halo-wave-portrait.jpg", alt: "A woman's face wrapped in flowers and a headscarf, ringed by a gold neon halo, emerging from a teal wave at sunset" },
  { src: "/design/island-rainbow-rocket-woman.jpg", alt: "A woman with a large afro seated on a tropical island, a rainbow arcing toward a distant rocket over the ocean" },
  { src: "/design/gilded-statues-storm-scene.jpg", alt: "An elaborate scene of gilded statues holding up storm clouds and a glowing globe, with a woman in a red dress and a waterfall below" },
  { src: "/design/loomieverse-clocks-jeep.jpg", alt: '"LOOMIEVERSE" cover art — a curly-haired woman surrounded by clocks, teddy bears, and a pink toy jeep' },
  { src: "/design/aso-asa-desert-astronaut.jpg", alt: '"ASO+ASA" — a woman walking a desert dune beside a falling astronaut trailing fire and a crashed, smoking UFO' },
  { src: "/design/cosmic-wave-earring-woman.jpg", alt: "A woman with a shaved head emerging from ocean waves among planets and neon halos, a UFO crossing the sun behind her" },
  { src: "/design/three-heads-leaves.jpg", alt: "Three women's heads in patterned headwraps nested together against a green background, framed by leaves and glass orbs" },
  { src: "/design/garden-walk-cover.jpg", alt: '"A Garden Walk" magazine cover — a man in a patchwork coat strolling with a basket of sunflowers under a sunset sky' },
];

export default function DesignGallery() {
  const [lightbox, setLightbox] = useState(null);
  const [pieces, setPieces] = useState(PIECES);

  useEffect(() => {
    setPieces(shuffle(PIECES));
  }, []);

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

  return (
    <>
      <div className="columns-2 gap-5 sm:columns-3">
        {pieces.map((piece) => (
          <button
            key={piece.src}
            type="button"
            onClick={() => setLightbox(piece)}
            className="group relative mb-5 block w-full cursor-zoom-in overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl"
            aria-label={`Enlarge: ${piece.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={piece.src}
              alt={piece.alt}
              className="block w-full"
              loading="lazy"
            />
            <span className="bronze-glare" aria-hidden="true" />
          </button>
        ))}
      </div>

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
