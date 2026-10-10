import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { TOTAL_TRACKS, catalogNumber, readMinutes } from "@/lib/catalog";
import TrackArt from "./TrackArt";
import TrackNodes from "./TrackNodes";

/**
 * A collection opened out into the back of its album: the cover shrunk
 * to a corner, the title and catalog number up top, the essays as a
 * numbered track listing (each a direct link), a liner note, and a
 * barcode. Used for every Long Play and for The Singles Collection.
 */
export default function BackCover({ collection, entries, allEntries }) {
  const total = TOTAL_TRACKS;
  const isSeries = collection.kind === "series";
  const sorted = isSeries
    ? [...entries].sort((a, b) => (a.part || 0) - (b.part || 0))
    : [...entries].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
  const lead = sorted[0];
  const code = `ATA-${collection.code}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/journal"
        className="font-mono text-xs uppercase tracking-widest text-white/80 hover:text-accent"
      >
        &larr; The Journal
      </Link>

      <article className="bc-sheet mt-5">
        <div className="bc-bg" style={{ backgroundImage: `url(${collection.cover})` }} aria-hidden="true" />
        <div className="bc-shade" aria-hidden="true" />

        <div className="relative px-5 pb-8 pt-7 sm:px-10 sm:pb-10 sm:pt-9">
          <div
            className="flex items-center justify-between gap-4 border-b-2 pb-3 font-mono text-[11px] uppercase tracking-[0.25em]"
            style={{ borderColor: collection.color }}
          >
            <span>Add the Accent Records</span>
            <span style={{ color: collection.color }}>
              {isSeries ? `Long Play · Vol ${String(collection.volume).padStart(2, "0")}` : "Singles"}
            </span>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1
                className="album-title font-display text-4xl uppercase leading-[0.95] tracking-tight sm:text-6xl"
                style={{ color: collection.color }}
              >
                {collection.title}
              </h1>
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-white/65">
                {code}-001
                {sorted.length > 1 ? ` – ${String(isSeries ? total : sorted.length).padStart(3, "0")}` : ""}
              </p>
              {isSeries && (
                <TrackNodes
                  published={sorted.length}
                  total={total}
                  color={collection.color}
                  showNote
                  className="mt-4"
                />
              )}
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
                The thesis
              </p>
              <p className="mt-2 max-w-lg font-serif text-lg italic leading-snug text-white/85">
                {collection.blurb}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={collection.cover}
              alt={`${collection.title} — front cover`}
              className="w-40 shrink-0 self-center rounded-[3px] shadow-[0_14px_30px_rgba(0,0,0,0.6)] sm:w-48 sm:self-start"
            />
          </div>

          <h2 className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
            Track listing
          </h2>
          <ol className="mt-2 border-t border-white/25">
            {(isSeries ? Array.from({ length: total }, (_, i) => sorted.find((x) => x.part === i + 1) || { forthcoming: true, n: i + 1 }) : sorted).map((e, i) =>
              e.forthcoming ? (
                <li key={`f${e.n}`} className="bc-track text-white/35">
                  <span className="font-mono text-xs">{String(e.n).padStart(2, "0")}</span>
                  <span className="flex min-w-0 items-center gap-3">
                    <TrackArt forthcoming size={40} />
                    <span className="font-serif text-lg italic">Forthcoming</span>
                  </span>
                  <span />
                </li>
              ) : (
                <li key={e.slug}>
                  <Link href={`/journal/${e.slug}`} className="bc-track">
                    <span className="font-mono text-xs text-white/55">
                      {String(isSeries ? e.part || i + 1 : i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex min-w-0 items-center gap-3">
                      <TrackArt entry={e} size={40} />
                      <span className="min-w-0">
                        <span className="block font-serif text-xl leading-tight">
                          {e.titleHtml ? (
                            <span dangerouslySetInnerHTML={{ __html: e.titleHtml }} />
                          ) : (
                            e.title
                          )}
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-white/50">
                          {catalogNumber(e, allEntries)}
                          {e.date ? ` · ${formatDate(e.date)}` : ""} · {readMinutes(e.content)} min read
                        </span>
                      </span>
                    </span>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: collection.color }}>
                      Read &rarr;
                    </span>
                  </Link>
                </li>
              ),
            )}
          </ol>

          {lead && (
            <p className="mt-6 max-w-xl font-serif text-[15px] italic leading-relaxed text-white/70">
              &ldquo;{lead.excerpt}&rdquo; &mdash; from {lead.title}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-white/20 pt-5">
            <div className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-white/55">
              <p>Written and arranged by JT</p>
              <p>Pressed at addtheaccent.com</p>
              <p>&copy; Add the Accent Records</p>
            </div>
            <div className="flex items-end gap-4">
              <div>
                <div className="bc-barcode" aria-hidden="true" />
                <p className="mt-1 text-center font-mono text-[9px] tracking-[0.3em] text-white/60">
                  {code}-000
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
