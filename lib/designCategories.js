// The Museum's primary filter (All / Design / Photography / Motion) and the
// helpers the gallery and the placard lightbox share. Categories are
// derived from each piece's #hashtags, so tagging a piece in the caption
// is all it takes to file it — a piece can sit in more than one.

import { PIECES, tagsOf } from "@/lib/designPieces";
import { EDITORIAL } from "@/lib/designEditorial";

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

// The medium line worked out from a piece's tags:
//  - photography in the tags adds "Photography";
//  - design work (compositing, graphic design, cover art, …) adds
//    "Digital Composite", and when it is not a commission (no
//    #commission / #photocommission) it is the maker's own: "Self-Work";
//  - motion work is simply "Motion".
export function mediumOf(alt) {
  const tags = tagsOf(alt);
  const photo = tags.includes("photography") || tags.includes("photocommission") || tags.includes("childphotography");
  const design = inCategory(tags, "design");
  const motion = inCategory(tags, "motion");
  const commissioned = isCommissioned(alt);
  if (motion) return "Motion";
  const parts = [];
  if (photo) parts.push("Photography");
  if (design) {
    parts.push("Digital Composite");
    if (!commissioned) parts.push("Self-Work");
  }
  return parts.length ? parts.join(", ") : "Mixed media";
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
 *   subtitle — a second, thinner line of the title ("Title | Subtitle")
 *   number  — the running number beside the title: automatic when the
 *             title is repeated; type your own, or "-" to hide it
 *   subtitleNumber — the same, beside a subtitle that is repeated
 *   artist  — the maker line on the placard ("JT" by default; an empty
 *             string hides it)
 *   medium  — the medium line (worked out from the tags by default)
 *   note    — the extra placard line ("Commissioned work" is added
 *             automatically for commissions; "-" hides it)
 */
export const DEFAULT_ARTIST = "JT";

// Titles used by more than one piece get a running number, in the order
// the pieces appear (Now Showing wall first, then the gallery), so
// "Sunrise" twice reads "Sunrise N° 01" and "Sunrise N° 02". Subtitles
// that are repeated are numbered the same way, right beside the subtitle.
// Each map is { [src]: "01" } for just the pieces whose text is repeated.
function numberGroups(items, keyOf) {
  const seen = new Set();
  const groups = new Map();
  for (const it of items) {
    if (seen.has(it.src)) continue; // a piece shown twice is still one piece
    seen.add(it.src);
    const t = String(keyOf(it) || "").trim().toLowerCase();
    if (!t) continue;
    if (!groups.has(t)) groups.set(t, []);
    groups.get(t).push(it.src);
  }
  const out = {};
  for (const srcs of groups.values()) {
    if (srcs.length < 2) continue;
    srcs.forEach((src, i) => {
      out[src] = String(i + 1).padStart(2, "0");
    });
  }
  return out;
}

export function computeNumberMaps(items) {
  return {
    title: numberGroups(items, (it) => titleOf(it.alt || "")),
    subtitle: numberGroups(items, (it) => it.subtitle),
  };
}

const MAPS = computeNumberMaps([...EDITORIAL, ...PIECES]);

// A running number is automatic unless the piece carries its own: any
// text replaces it, and "-" hides it.
const resolveNumber = (custom, auto) =>
  custom === undefined ? auto || "" : custom === "-" ? "" : custom;

export function captionOf(piece, maps = MAPS) {
  const alt = piece.alt || "";
  const tags = tagsOf(alt).filter((t) => t.length > 0);
  const autoMedium = mediumOf(alt);
  const subtitle = (piece.subtitle || "").trim();
  return {
    title: titleOf(alt),
    subtitle,
    number: resolveNumber(piece.number, maps.title[piece.src]),
    subtitleNumber: subtitle
      ? resolveNumber(piece.subtitleNumber, maps.subtitle[piece.src])
      : "",
    artist: piece.artist === undefined ? DEFAULT_ARTIST : piece.artist,
    medium: piece.medium || autoMedium,
    shortMedium: piece.medium || autoMedium.split(",")[0],
    note:
      piece.note === "-"
        ? ""
        : piece.note || (isCommissioned(alt) ? "Commissioned work" : ""),
    tags,
  };
}
