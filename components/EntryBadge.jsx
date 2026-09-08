/**
 * Shows where an entry sits in the site's taxonomy: an ordered series
 * ("Domain Expansion — Part 2") or, for the standalone reflections that
 * surface inside those series, the "Interludes" pool. Renders nothing
 * for entries with neither (e.g. portfolio pieces).
 *
 * Series labels are color-coded — Domain Expansion purple, Back to Oui red,
 * Homebody bronze gold.
 */
const SERIES_STYLE = {
  "Domain Expansion": "bg-[#7e22ce]/15 text-[#7e22ce]",
  "Back to Oui": "bg-[#c0202a]/15 text-[#c0202a]",
  "Homebody": "bg-[#9a7420]/15 text-[#9a7420]",
};

export default function EntryBadge({ entry, className = "" }) {
  if (entry.series) {
    const style = SERIES_STYLE[entry.series] || "bg-accent/20 text-accent";
    return (
      <span
        className={`mb-2 inline-block w-fit rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide ${style} ${className}`}
      >
        {entry.series}
        {entry.part ? ` — Part ${entry.part}` : ""}
      </span>
    );
  }

  if (entry.category) {
    return (
      <span
        className={`mb-2 inline-block w-fit rounded-full bg-moss/20 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-[#5c6b1c] ${className}`}
      >
        {entry.category}
      </span>
    );
  }

  return null;
}
