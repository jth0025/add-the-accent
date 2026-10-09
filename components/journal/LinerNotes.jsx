import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { getAllEntries } from "@/lib/content";
import { TOTAL_TRACKS, catalogNumber, getCollectionForEntry, readMinutes } from "@/lib/catalog";
import { ESSAY_ART } from "@/lib/essayArt";
import { withDropCap } from "@/lib/dropCap";
import ShareButton from "@/components/ShareButton";
import VoiceClip from "@/components/VoiceClip";
import TrackArt from "./TrackArt";
import "./records.css";

/**
 * An essay, set as the inside of a gatefold album: two facing pages with
 * the crease down the middle. The left page is the record's side — label
 * masthead, catalog number, the headline, standfirst, credit line and the
 * art; the right page is the piece itself, in one plain column that reads
 * straight down. When you open an essay the right-hand page folds out
 * across the crease (see .ln-unfold); the creases stay. On a phone the two
 * pages stack, with the fold between them. No paper texture anywhere.
 */
export default function LinerNotes({ entry }) {
  const all = getAllEntries("journal");
  const collection = getCollectionForEntry(entry);
  const catalog = catalogNumber(entry, all);
  const art = ESSAY_ART[entry.slug];
  const bodyHtml = withDropCap(entry.html);
  const minutes = readMinutes(entry.html);

  // Neighbours: the run of tracks in the same collection, in play order.
  const run = collection
    ? all
        .filter((e) =>
          collection.kind === "series" ? e.series === collection.key : e.category === collection.key,
        )
        .sort((a, b) =>
          collection.kind === "series"
            ? (a.part || 0) - (b.part || 0)
            : new Date(a.date || 0) - new Date(b.date || 0),
        )
    : [];
  const at = run.findIndex((e) => e.slug === entry.slug);
  const prev = at > 0 ? run[at - 1] : null;
  const next = at >= 0 && at < run.length - 1 ? run[at + 1] : null;

  const trackLine = !collection
    ? "Journal"
    : collection.kind === "series"
      ? `${collection.title} · Track ${String(entry.part).padStart(2, "0")} of ${String(TOTAL_TRACKS).padStart(2, "0")}`
      : `${collection.title} · Single`;

  const grey = "text-[#1a1a1a]/60";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <nav
        aria-label="Where you are"
        className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs uppercase tracking-widest text-white/80"
      >
        <Link href="/journal#archive" className="hover:text-accent">
          &larr; The Archive
        </Link>
        {collection && (
          <Link href={collection.href} className="hover:text-accent">
            {collection.title}
          </Link>
        )}
      </nav>

      <article className="ln-spread mt-5 grid md:grid-cols-[minmax(0,5fr),minmax(0,7fr)]">
        {/* ---- Left page ---- */}
        <header className="ln-page ln-page--left px-6 pb-8 pt-7 sm:px-10 md:sticky md:top-6 md:self-start md:pb-10">
          <div className="flex items-baseline justify-between gap-4 border-b-4 border-double border-[#1a1a1a] pb-2 font-mono text-[10px] uppercase tracking-[0.22em] sm:text-[11px]">
            <span>Add the Accent Records</span>
            <span className="font-bold">{catalog}</span>
          </div>

          <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-[#7a4a0c]">
            {trackLine}
          </p>

          <h1 className="mt-3 font-display text-[2.3rem] uppercase leading-[0.96] tracking-tight sm:text-5xl">
            {entry.titleHtml ? (
              <span dangerouslySetInnerHTML={{ __html: entry.titleHtml }} />
            ) : (
              entry.title
            )}
          </h1>

          {entry.excerpt && (
            <p className="mt-5 font-serif text-xl italic leading-snug text-[#2a2a28]">
              {entry.excerpt}
            </p>
          )}

          <div className="relative mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 border-y border-[#1a1a1a]/70 py-2 pr-10 font-mono text-[11px] uppercase tracking-widest">
            <span>Words &mdash; JT</span>
            {entry.date && <span>{formatDate(entry.date)}</span>}
            <span>{minutes} min read</span>
            <ShareButton title={entry.title} className="right-0 top-1/2 -translate-y-1/2" />
          </div>

          {art && (
            <figure className="mt-7">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={art.src}
                alt={art.alt}
                className="mx-auto block max-h-[26rem] w-auto max-w-full border border-[#1a1a1a]/60"
              />
            </figure>
          )}

          {/* Liner credits */}
          <dl
            aria-label="Liner credits"
            className="mt-8 grid grid-cols-[auto,1fr] gap-x-5 gap-y-1 border-t-4 border-double border-[#1a1a1a] pt-4 font-mono text-[11px] uppercase leading-relaxed tracking-widest"
          >
            <dt className={grey}>Written by</dt>
            <dd>JT</dd>
            <dt className={grey}>Catalog</dt>
            <dd>{catalog}</dd>
            <dt className={grey}>Collection</dt>
            <dd>{trackLine}</dd>
            {entry.date && (
              <>
                <dt className={grey}>Released</dt>
                <dd>{formatDate(entry.date)}</dd>
              </>
            )}
          </dl>
        </header>

        {/* ---- Right page: folds out across the crease ---- */}
        <div className="ln-page ln-page--right ln-unfold px-6 pb-10 pt-8 sm:px-12 md:pt-12">
          {entry.slug === "the-difference" && (
            <div className="relative mx-auto mb-8 max-w-xs overflow-hidden rounded-xl bg-gradient-to-b from-[#141414] to-black px-4 pb-4 pt-6">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-44 w-40 -translate-x-1/2 [clip-path:polygon(44%_0%,56%_0%,98%_100%,2%_100%)] bg-gradient-to-b from-[rgba(255,248,222,0.75)] via-[rgba(255,248,222,0.22)] to-[rgba(255,248,222,0)] blur-[5px] sm:h-56 sm:w-48"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/journal-art/the-difference-solo.png"
                alt="The Add the Accent character standing alone under a single spotlight"
                className="relative z-10 mx-auto h-40 w-auto drop-shadow-[0_10px_16px_rgba(0,0,0,0.65)] sm:h-48"
              />
              <div className="relative z-10 mt-4">
                <VoiceClip
                  src="/audio/the-difference-is-you.mp3"
                  label="The difference is you"
                />
              </div>
            </div>
          )}

          <div className="ln-prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

          <div className="clear-both mt-10 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/leaf-end-mark.png"
              alt=""
              aria-hidden="true"
              className="h-12 w-auto opacity-90"
            />
          </div>

          {(prev || next) && (
            <nav
              aria-label="Previous and next track"
              className="mt-8 grid gap-4 border-t-4 border-double border-[#1a1a1a] pt-4 sm:grid-cols-2"
            >
              {prev ? (
                <Link href={`/journal/${prev.slug}`} className="group flex items-center gap-3">
                  <TrackArt entry={prev} size={44} />
                  <span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#1a1a1a]/60">
                      &larr; Previous track
                    </span>
                    <span className="mt-1 block font-serif text-lg italic leading-tight group-hover:underline">
                      {prev.title}
                    </span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={`/journal/${next.slug}`}
                  className="group flex items-center gap-3 sm:flex-row-reverse sm:text-right"
                >
                  <TrackArt entry={next} size={44} />
                  <span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#1a1a1a]/60">
                      Next track &rarr;
                    </span>
                    <span className="mt-1 block font-serif text-lg italic leading-tight group-hover:underline">
                      {next.title}
                    </span>
                  </span>
                </Link>
              )}
            </nav>
          )}
        </div>
      </article>
    </div>
  );
}
