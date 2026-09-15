// Graphic design / composite work, shared by the full gallery (/design)
// and any other spot on the site that pulls from it (e.g. the portfolio
// page's commissioned-work column). Add new pieces by dropping an
// optimized image in public/design/ and adding an entry here (src + a
// caption, used as the lightbox caption and, via any #hashtags in it, as
// filter tags — #commission also draws the gold badge and is what
// selects pieces for the portfolio page's commissioned grid).
export const PIECES = [
  { src: "/design/aerial-beach-face.jpg", alt: "#selfportrait\n#graphicdesign #photography #compositing" },
  { src: "/design/armchair-tentacles-portrait.jpg", alt: "#commission #graphicdesign #surrealism #compositing photography" },
  { src: "/design/aso-asa-desert-astronaut.jpg", alt: "\"ASO+ASA\" — #commission #graphicdesign #photography #compositing #campaign #surrealism" },
  { src: "/design/balloon-chair-portrait.jpg", alt: "#photography #graphicdesign #surrealism #compositing" },
  { src: "/design/bird-head-balloon-girl.jpg", alt: "#graphicdesign #surrealism #compositing" },
  { src: "/design/book-lantern-reader.jpg", alt: "#selfportrait #photography #graphicdesign #compositing" },
  { src: "/design/clouded-suit-portrait.jpg", alt: "#graphicdesign #compositing #aiclouds #surrealism #afroart" },
  { src: "/design/cosmic-wave-earring-woman.jpg", alt: "#commission #photography #graphicdesign #compositing #campaign #surrealism" },
  { src: "/design/cozy-plant-room.jpg", alt: "#selfportrait #photography #ailighting" },
  { src: "/design/desert-ocean-falling-man.jpg", alt: "#commission #graphicdesign #compositing #coverart #surrealism #music" },
  { src: "/design/earth-cube-underwater-man.jpg", alt: "#selfportrait #surrealism #graphicdesign #photography" },
  { src: "/design/fire-scarf-bust.jpg", alt: "#selfportrait #graphicdesign #surrealism #aicoloring" },
  { src: "/design/floral-halo-wave-portrait.jpg", alt: "#selfportrait #graphicdesign #compositing #surrealism #photography" },
  { src: "/design/flower-goddess-moon.jpg", alt: "#commission #photography #graphicdesign #surrealism #compositing" },
  { src: "/design/garden-walk-cover.jpg", alt: "#aiart #marketing #reelart" },
  { src: "/design/gilded-statues-storm-scene.jpg", alt: "#graphicdesign #compositing #surrealism" },
  { src: "/design/island-rainbow-rocket-woman.jpg", alt: "#commission #graphicdesign #surrealism #compositing #afroart" },
  { src: "/design/jungle-neon-water-portrait.jpg", alt: "#selfportrait #graphicdesign #surrealism #compositing" },
  { src: "/design/jungle-x-portrait.jpg", alt: "#graphicdesign #iconart #surrealism #compositing #afroart" },
  { src: "/design/leaf-seventeen.jpg", alt: "#commission #graphicdesign" },
  { src: "/design/loomieverse-clocks-jeep.jpg", alt: "\"LOOMIEVERSE\" cover art — #coverart #commission #graphicdesign #compositing #surrealism" },
  { src: "/design/loomieverse-collage.jpg", alt: "\"Loomieverse\" —\n#commission #coverart #graphicdesign #surrealism #music" },
  { src: "/design/loomis-butterfly-cover.jpg", alt: "\"Loomi$\" Presskit cover #commission #graphicdesign #compositing #coverart #presskit #music" },
  { src: "/design/mosaic-village-family.jpg", alt: "#graphicdesign #compositing #afroart" },
  { src: "/design/neon-blood-couple.jpg", alt: "#commission #graphicdesign #compositing #surrealism" },
  { src: "/design/neon-outline-couple.jpg", alt: "#commission #graphicdesign #photography #compositing" },
  { src: "/design/neon-sunset-smoking.jpg", alt: "#graphicdesign #surrealism #compositing #iconart #gracejones" },
  { src: "/design/paradise-album-cover.jpg", alt: "\"Paradise\" — album cover for Jamal Moore featuring Kenyon Dixon #graphicdesign #commission #compositing #coverart #music" },
  { src: "/design/phone-booth-neon-night.jpg", alt: "#graphicdesign #compositing" },
  { src: "/design/piano-stairway-car.jpg", alt: "#commission #Presskit #graphicdesign #compositing #surrealism #music" },
  { src: "/design/plant-jar-face.jpg", alt: "#selfportrait #photography #ailighting" },
  { src: "/design/swan-sunset.jpg", alt: "#graphicdesign #surrealism #compositing" },
  { src: "/design/three-heads-leaves.jpg", alt: "#commission #photography #graphicdesign #compositing #campaign #surrealism #afroart" },
  { src: "/design/tree-head-chair-bw.jpg", alt: "#graphicdesign #compositing #blackandwhite" },
  { src: "/design/ufo-abduction-bw.jpg", alt: "#blackandwhite #surrealism #photography #design #compositing" },
  { src: "/design/underwater-boxer-storm.jpg", alt: "#graphicdesign #surrealism #iconart #compositing #afroart #muhammadali" },
  { src: "/design/underwater-leaf-koi-portrait.jpg", alt: "#selfportrait #graphicdesign #compositing" },
];

export function tagsOf(alt) {
  return (alt.match(/#[a-z0-9]+/gi) || []).map((t) => t.slice(1).toLowerCase());
}
