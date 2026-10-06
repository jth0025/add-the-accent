// The Museum's primary filter (All / Design / Photography / Motion) and the
// helpers the gallery and the placard lightbox share. Categories are
// derived from each piece's #hashtags, so tagging a piece in the caption
// is all it takes to file it — a piece can sit in more than one.

import { tagsOf } from "@/lib/designPieces";

export const CATEGORIES = [
  { key: "all", label: "All" },
  {
    key: "design",
    label: "Design",
    match: [
      "graphicdesign",
      "design",
      "compositing",
      "coverart",
      "posters",
      "posterart",
      "marketing",
      "presskit",
      "surrealism",
    ],
    // Umbrella tags that would just repeat the category name.
    hide: ["graphicdesign", "design"],
  },
  {
    key: "photography",
    label: "Photography",
    match: ["photography", "photocommission", "childphotography"],
    hide: ["photography"],
  },
  {
    key: "motion",
    label: "Motion",
    match: ["shortfilm", "reelart", "film", "motion", "video"],
    hide: ["motion"],
  },
];

const LABELS = {
  afroart: "afro art",
  blackandwhite: "black & white",
  childphotography: "child photography",
  coverart: "cover art",
  iconart: "icon art",
  livemusic: "live music",
  photocommission: "photo commission",
  posterart: "poster art",
  reelart: "reel art",
  selfportrait: "self portrait",
  shortfilm: "short film",
  blackontheshore: "black on the shore",
  tropicalsurreal: "tropical surreal",
};

export const labelOf = (tag) => LABELS[tag] || tag;

export function inCategory(tags, key) {
  if (key === "all") return true;
  const cat = CATEGORIES.find((c) => c.key === key);
  return !!cat && cat.match.some((t) => tags.includes(t));
}

// Tags worth offering as the secondary row for a category, most-used first.
export function tagsForCategory(pieces, key) {
  const cat = CATEGORIES.find((c) => c.key === key);
  const hidden = new Set([
    "graphicdesign",
    "photography",
    "commission",
    ...(cat?.hide || []),
  ]);
  const counts = {};
  pieces.forEach((p) => {
    const tags = tagsOf(p.alt);
    if (!inCategory(tags, key)) return;
    tags.forEach((t) => {
      if (!hidden.has(t) && t.length > 0) counts[t] = (counts[t] || 0) + 1;
    });
  });
  const all = Object.entries(counts).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );
  const min = all.length > 12 ? 2 : 1;
  return all
    .filter(([, n]) => n >= min)
    .slice(0, 16)
    .map(([t]) => t);
}

export function titleOf(alt) {
  const m = alt.match(/^\s*["“]([^"”]+)["”]/);
  return m ? m[1].trim() : null;
}

export function mediumOf(alt) {
  const tags = tagsOf(alt);
  const photo = inCategory(tags, "photography");
  const design = inCategory(tags, "design");
  const motion = inCategory(tags, "motion");
  if (motion) return "Motion";
  if (photo && design) return "Photography, digital composite";
  if (photo) return "Photography";
  if (design) return "Digital composite";
  return "Mixed media";
}

export const isCommissioned = (alt) => {
  const tags = tagsOf(alt);
  return tags.includes("commission") || tags.includes("photocommission");
};
