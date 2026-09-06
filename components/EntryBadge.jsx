/**
 * Shows where an entry sits in the site's taxonomy: an ordered series
 * ("Domain Expansion — Part 2") or, for the standalone reflections that
 * surface inside those series, the "Interludes" pool. Renders nothing
 * for entries with neither (e.g. portfolio pieces).
 */
export default function EntryBadge({ entry, className = "" }) {
  if (entry.series) {
    return (
      <span
        className={`mb-2 inline-block w-fit rounded-full bg-accent/20 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-accent ${className}`}
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
