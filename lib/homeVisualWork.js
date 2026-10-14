import { PIECES, tagsOf } from "@/lib/designPieces";

// The six Museum pieces shown in "Visual Work" on the home page: commissioned
// design work and photo commissions. Edit this list (order included) to change
// what's featured. Each entry is a Museum piece's image path, so its title and
// tags always come from the Museum's own captions.
export const HOME_VISUAL_WORK = [
  "/design/cosmic-wave-earring-woman.jpg", // Galactic Lady (commission)
  "/design/paradise-album-cover.jpg", // Paradise (commission)
  "/design/sunset-suspenders-portrait.jpg", // Rennassaince Man (photo commission)
  "/design/nu-outcast-planet-cover.jpg", // Nu Outcast (commission)
  "/design/hooded-guitarist.jpg", // Guitar Slayer (photo commission)
  "/design/mother-son-red-dress-standing.jpg", // Boy Mom in Red (photo commission)
];

export function getHomeVisualWork() {
  return HOME_VISUAL_WORK.map((src) => PIECES.find((p) => p.src === src))
    .filter(Boolean)
    .map((piece) => {
      const tags = tagsOf(piece.alt);
      return {
        piece,
        kind: tags.includes("commission")
          ? "Commission"
          : tags.includes("photocommission")
          ? "Photo commission"
          : "",
      };
    });
}
