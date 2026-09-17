// Per-essay lead art for the journal — one polaroid image per entry,
// keyed by slug. Rendered by EntryPage, not embedded in the markdown
// itself, since content/*.md isn't scanned for Tailwind classes.
export const ESSAY_ART = {
  "away-game": {
    src: "/journal-art/away-game.png",
    alt: "Poster-style art for Away Game: a boy in a basketball jersey walking a tunnel toward a packed, glowing arena",
    rotate: -2,
  },
  "day-one": {
    src: "/journal-art/a-sip-of-water.png",
    alt: "Art for Day One: A Sip of Water — a figure seated by a sunset window in an empty, sunlit apartment",
    rotate: 2,
  },
  "day-two": {
    src: "/journal-art/og-bob-marley.png",
    alt: "Art for Day Two: OG Bob Marley — a figure smoking on a couch as colorful design waves fill the wall",
    rotate: -2,
  },
  "back-to-oui-dessert-her": {
    src: "/journal-art/dessert-her.png",
    alt: "Poster-style art for Desserther: two figures at a cafe window at sunset over the city",
    rotate: 2,
  },
  "back-to-oui-the-question": {
    src: "/journal-art/the-question.png",
    alt: "Poster-style art for The Question: a father kneeling to speak with his son at the open door, a packed car outside",
    rotate: -2,
  },
  "land-man": {
    src: "/journal-art/land-man.png",
    alt: "Poster-style art for Land Man: a figure walking a sunset-lit hallway, keys in hand",
    rotate: 2,
  },
};
