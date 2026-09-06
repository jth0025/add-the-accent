import Link from "next/link";
import { formatDate } from "@/lib/content";
import EntryBadge from "@/components/EntryBadge";
import PaperClip from "@/components/PaperClip";

/**
 * One journal entry rendered as a crinkled-paper card — paperclip,
 * series/Interludes badge, pencil-tipped title, date, excerpt. Shared
 * by the sectioned Journal index and any list that shows journal
 * entries at heading level 3.
 */
export default function JournalEntryCard({ entry }) {
  return (
    <Link
      href={`/journal/${entry.slug}`}
      className="paper-crinkled corner-box group block rounded-xl border border-ink/15 bg-card px-7 py-6 transition-colors hover:border-ink/30 sm:px-9"
    >
      <PaperClip />
      <EntryBadge entry={entry} className="block" />
      <h3 className="flex items-center gap-2 font-serif text-2xl text-ink transition-colors group-hover:text-[#2e8b3d]">
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
      {entry.excerpt && <p className="mt-3 text-stone">{entry.excerpt}</p>}
    </Link>
  );
}
