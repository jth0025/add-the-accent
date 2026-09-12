import Link from "next/link";
import { formatDate } from "@/lib/content";
import { getCoverColor } from "@/lib/seriesColors";
import EntryBadge from "@/components/EntryBadge";

/**
 * One journal entry rendered as a closed book standing on the shelf —
 * a cloth cover (tinted per series), a spine with gilt bands, page
 * edges, and a pasted-on label carrying the title/date/excerpt. Clicking
 * it opens the entry, where the same cover swings open over the essay
 * (see EntryPage). Shared by the sectioned Journal index and any list
 * that shows journal entries at heading level 3.
 */
export default function JournalEntryCard({ entry }) {
  return (
    <Link
      href={`/journal/${entry.slug}`}
      className="group block [perspective:1000px]"
    >
      <div
        className="book-cover corner-box on-dark relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-black/30 py-8 pl-9 pr-6 shadow-lg transition-[transform,box-shadow] duration-500 [transform-origin:left_center] group-hover:[transform:rotateY(-8deg)] group-hover:shadow-2xl sm:pl-11"
        style={{ "--book-color": getCoverColor(entry) }}
      >
        <span className="book-spine" aria-hidden="true" />
        <span className="book-pages-edge" aria-hidden="true" />

        <div className="paper-journal relative w-full max-w-[92%] -rotate-1 rounded-[3px] border border-ink/25 bg-[#efe6d3] px-5 py-5 shadow-[0_4px_10px_rgba(0,0,0,0.35)] sm:px-6">
          <EntryBadge entry={entry} className="block" />
          <h3 className="mt-1 flex items-center gap-2 font-serif text-xl text-ink transition-colors group-hover:text-[#2e8b3d] sm:text-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/pencil-icon.png"
              alt=""
              aria-hidden="true"
              className="h-[1em] w-auto shrink-0"
            />
            <span>{entry.title}</span>
          </h3>
          {entry.date && (
            <p className="mt-1 font-mono text-xs uppercase tracking-wide text-stone/60">
              {formatDate(entry.date)}
            </p>
          )}
          {entry.excerpt && (
            <p className="mt-2 border-t border-ink/10 pt-2 text-sm italic leading-snug text-stone">
              {entry.excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
