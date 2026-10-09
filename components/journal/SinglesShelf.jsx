import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { catalogNumber, getCollectionByKey, readMinutes } from "@/lib/catalog";

/**
 * The shorter essays don't need a full album: each is a small paper
 * sleeve with a die-cut window, the record's circular centre label
 * showing through. The title and a plain "Read" link sit underneath, so
 * every single is one click away.
 */
export default function SinglesShelf({ entries, allEntries }) {
  const col = getCollectionByKey("Interludes");
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3">
      {entries.map((entry) => {
        const catalog = catalogNumber(entry, allEntries);
        return (
          <li key={entry.slug}>
            <Link href={`/journal/${entry.slug}`} className="group block outline-none">
              <div
                className="sg-sleeve"
                style={{ "--rec-color": col.color, "--rec-ink": col.ink }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/journal-art/plus-orange.webp" alt="" aria-hidden="true" className="sg-plus" />
                <div className="sg-window" aria-hidden="true">
                  <span className="rec-label-name">{entry.title}</span>
                  <span className="rec-label-cat">{catalog}</span>
                </div>
              </div>
              <h3 className="mt-3 font-serif text-lg italic leading-tight text-white group-hover:text-accent">
                {entry.titleHtml ? (
                  <span dangerouslySetInnerHTML={{ __html: entry.titleHtml }} />
                ) : (
                  entry.title
                )}
              </h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/55">
                {catalog}
                {entry.date ? ` · ${formatDate(entry.date)}` : ""} · {readMinutes(entry.content)} min
              </p>
              <span className="mt-2 inline-block font-mono text-[11px] font-bold uppercase tracking-widest text-accent">
                Read &rarr;
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
