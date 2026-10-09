// The Journal as a record label. Every series is a "Long Play" (a
// literary album), the short reflections are "The Singles Collection",
// and every essay carries a permanent catalog number in the form
// ATA-HMB-001 (Add the Accent · collection code · track number).
// Track numbers never change once issued: a series essay uses its part
// number; a single takes the next free number in the order it was
// published. This could carry straight over to zines and printed editions.

export const COLLECTIONS = [
  {
    key: "Homebody",
    kind: "series",
    code: "HMB",
    volume: 1,
    title: "Homebody",
    cover: "/journal-art/lp-homebody.webp",
    color: "#d3ac52",
    ink: "#2a1d05",
    href: "/journal?series=Homebody",
    blurb:
      "Homebody is the series that never leaves home — a case study in cleaning the room that lives inside you, one session, one rep, at a time. It's where accountability turns into discipline, and discipline into the kind of greatness that's just as useful away from home as it is within it.",
  },
  {
    key: "Back to Oui",
    kind: "series",
    code: "BTO",
    volume: 2,
    title: "Back to Oui",
    cover: "/journal-art/lp-back-to-oui.webp",
    color: "#e0555f",
    ink: "#2a0a0d",
    href: "/journal?series=Back%20to%20Oui",
    blurb:
      "Traces the distance between love and despair; loneliness and belonging; agreeing and retreating.",
  },
  {
    key: "Domain Expansion",
    kind: "series",
    code: "DEX",
    volume: 3,
    title: "Domain Expansion",
    cover: "/journal-art/lp-domain-expansion.webp",
    color: "#a855f7",
    ink: "#1d0b2e",
    href: "/journal?series=Domain%20Expansion",
    blurb:
      "The home-curation journey — moving in, and the shape a room takes on the way to becoming home.",
  },
  {
    key: "Interludes",
    kind: "singles",
    code: "INT",
    volume: 4,
    title: "The Singles Collection",
    cover: "/journal-art/lp-interludes.webp",
    color: "#3b63f0",
    ink: "#0a1230",
    href: "/journal?category=Interludes",
    blurb:
      "Short reflections and sparks that surface inside the long plays — not a story of their own. Singles, pressed one at a time.",
  },
];

export function getCollectionForEntry(entry) {
  if (entry.series) return COLLECTIONS.find((c) => c.key === entry.series) || null;
  if (entry.category) return COLLECTIONS.find((c) => c.key === entry.category) || null;
  return null;
}

export function getCollectionByKey(key) {
  return COLLECTIONS.find((c) => c.key === key) || null;
}

const pad = (n) => String(n).padStart(3, "0");

// ATA-HMB-001. `allEntries` is only needed for singles, whose number is
// their place in publishing order (oldest = 001).
export function catalogNumber(entry, allEntries = []) {
  const col = getCollectionForEntry(entry);
  const code = col ? col.code : "GEN";
  if (entry.series && entry.part) return `ATA-${code}-${pad(entry.part)}`;
  const peers = allEntries
    .filter((e) => (col ? getCollectionForEntry(e)?.key === col.key : !e.series && !e.category))
    .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
  const i = peers.findIndex((e) => e.slug === entry.slug);
  return `ATA-${code}-${pad(i >= 0 ? i + 1 : 1)}`;
}

// A rough reading time, from the entry's markdown or html.
export function readMinutes(text = "") {
  const words = text.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

// Small square "track art" for every essay — its own art where it has
// one, otherwise its collection's cover.
const OWN_ART = new Set([
  "away-game",
  "day-one",
  "day-two",
  "back-to-oui-dessert-her",
  "back-to-oui-the-question",
  "land-man",
  "back-to-oui-lone-star",
  "the-difference",
]);

export function trackArt(entry) {
  if (OWN_ART.has(entry.slug)) return `/journal-art/thumbs/${entry.slug}.webp`;
  const col = getCollectionForEntry(entry);
  return col ? col.cover : "/journal-art/lp-interludes.webp";
}

// The essay's full portrait art, where it has some.
export function posterArt(entry) {
  return OWN_ART.has(entry.slug) && entry.slug !== "the-difference"
    ? `/journal-art/posters/${entry.slug}.webp`
    : null;
}

// Seven-part structure: how many of a series' tracks are out.
export const TOTAL_TRACKS = 7;
