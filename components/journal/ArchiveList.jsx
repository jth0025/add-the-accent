import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { catalogNumber, getCollectionForEntry } from "@/lib/catalog";
import TrackArt from "./TrackArt";

/**
 * The Archive — the record store: every entry, newest first, with its
 * permanent catalog number. A plain list of links; no animation, nothing
 * to discover.
 */
export default function ArchiveList({ entries }) {
  return (
    <ul className="border-t border-white/25">
      {entries.map((entry) => {
        const col = getCollectionForEntry(entry);
        return (
          <li key={entry.slug}>
            <Link href={`/journal/${entry.slug}`} className="ar-row text-white">
              <span className="font-mono text-xs uppercase tracking-widest text-[#ffd98a]">
                {catalogNumber(entry, entries)}
              </span>
              <span className="flex min-w-0 items-center gap-3">
                <TrackArt entry={entry} size={44} />
                <span className="min-w-0">
                <span className="block font-serif text-lg leading-tight">
                  {entry.titleHtml ? (
                    <span dangerouslySetInnerHTML={{ __html: entry.titleHtml }} />
                  ) : (
                    entry.title
                  )}
                </span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-white/55">
                  {col ? col.title : "Journal"}
                  {entry.date ? ` · ${formatDate(entry.date)}` : ""}
                </span>
                </span>
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/80">
                Read &rarr;
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
