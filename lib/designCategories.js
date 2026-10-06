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

// Split a caption string into its quoted title and everything after it
// (the hashtags and any other text), and put them back together. The
// caption editor edits the two parts separately.
export function splitAlt(alt) {
  const m = alt.match(/^\s*["\u201c]([^"\u201d]*)["\u201d]\s*(?:\u2014|-)?\s*([\s\S]*)$/);
  return m ? { title: m[1].trim(), rest: m[2].trim() } : { title: "", rest: alt.trim() };
}

export function joinAlt(title, rest) {
  const t = title.trim();
  const r = rest.trim();
  if (!t) return r;
  return r ? `"${t}" \u2014 ${r}` : `"${t}"`;
}

/**
 * Every line of copy shown with an image — on the grid tile, on the
 * Now Showing wall and on the placard — resolved in one place so the
 * pages and the caption editor always agree. A piece can override the
 * automatic wording with optional fields:
 *   artist  — the maker line on the placard ("J.T. Harris" by default;
 *             an empty string hides it)
 *   medium  — the medium line (worked out from the tags by default)
 *   note    — the extra placard line ("Commissioned work" is added
 *             automatically for commissions; "-" hides it)
 */
export function captionOf(piece) {
  const alt = piece.alt || "";
  const tags = tagsOf(alt).filter((t) => t.length > 0);
  const autoMedium = mediumOf(alt);
  return {
    title: titleOf(alt),
    artist: piece.artist === undefined ? "J.T. Harris" : piece.artist,
    medium: piece.medium || autoMedium,
    shortMedium: piece.medium || autoMedium.split(",")[0],
    note:
      piece.note === "-"
        ? ""
        : piece.note || (isCommissioned(alt) ? "Commissioned work" : ""),
    tags,
  };
}
