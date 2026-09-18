"use client";

import { useState } from "react";
import JournalEntryCard from "@/components/JournalEntryCard";

const FILTERS = [
  { id: "selected", label: "Selected" },
  { id: "Homebody", label: "Homebody" },
  { id: "Domain Expansion", label: "Domain Expansion" },
  { id: "Back to Oui", label: "Back to Oui" },
  { id: "Interludes", label: "Interludes" },
];

/**
 * The "From the Journal" list on the Portfolio page. Defaults to the
 * hand-picked SELECTED_WORK_SLUGS set (the page's original look,
 * untouched until the visitor actually opens the filter) — switching
 * it swaps in every entry from that series or category instead.
 */
export default function JournalPicksFilter({ selected, allEntries }) {
  const [filter, setFilter] = useState("selected");

  const entries =
    filter === "selected"
      ? selected
      : filter === "Interludes"
        ? allEntries.filter((e) => e.category === "Interludes")
        : allEntries.filter((e) => e.series === filter);

  return (
    <div>
      <label className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
        Filter
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-ink/20 bg-card px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-ink"
        >
          {FILTERS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      {entries.length > 0 ? (
        <ul className="space-y-5">
          {entries.map((entry) => (
            <li key={entry.slug}>
              <JournalEntryCard entry={entry} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-mono text-sm text-stone/70">
          Nothing published here yet.
        </p>
      )}
    </div>
  );
}
