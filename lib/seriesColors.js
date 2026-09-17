// Shared per-series cover colors — used to tint each journal entry's
// "book" (the shelf card in the Journal index, and the cover-reveal
// overlay on its own page). Kept separate from EntryBadge's own
// Tailwind classes because Tailwind can't generate arbitrary-value
// classes from a runtime variable; these hex values are applied via
// inline style instead.
export const SERIES_COVER_COLOR = {
  "Domain Expansion": "#7e22ce",
  "Back to Oui": "#c0202a",
  Homebody: "#9a7420",
};

// Interludes and any other uncategorized entry get a neutral cloth cover.
export const DEFAULT_COVER_COLOR = "#33322d";

export function getCoverColor(entry) {
  return SERIES_COVER_COLOR[entry.series] || DEFAULT_COVER_COLOR;
}

// Planned installment count for each ongoing series — used to show a
// progress bar (published parts vs. this total) at the top of the
// series. Update here when a series' scope changes.
export const SERIES_TOTAL_PARTS = {
  "Domain Expansion": 7,
  "Back to Oui": 7,
  Homebody: 7,
};
