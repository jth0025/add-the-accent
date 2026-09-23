// Shared cover color — used to tint each journal entry's "book" (the
// shelf card in the Journal index, and the cover-reveal overlay on its
// own page). Every entry now shares one weathered, worn-leather tone
// rather than being color-coded per series, so the shelf reads as a
// single aged collection instead of a rainbow of spines. Kept as a map
// (rather than a bare constant) so a future series can still override
// it without touching every call site, and because Tailwind can't
// generate arbitrary-value classes from a runtime variable — these hex
// values are applied via inline style instead.
export const SERIES_COVER_COLOR = {};

// Every entry — series or not — gets this same aged-leather cloth cover.
export const DEFAULT_COVER_COLOR = "#4a3524";

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
