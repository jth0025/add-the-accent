import Link from "next/link";
import { formatDate } from "@/lib/formatDate";
import { TOTAL_TRACKS, catalogNumber, getCollectionForEntry, posterArt, readMinutes } from "@/lib/catalog";
import { Sleeve, VinylDisc } from "./Record";
import TrackNodes from "./TrackNodes";

// "Back to Oui: Lone Star" -> "Lone Star": the series is named in the
// subtitle, so the headline is only the essay's own title.
function stripSeries(text, series) {
  if (!text || !series) return text;
  const re = new RegExp(`^\\s*${series.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*`, "i");
  return text.replace(re, "");
}

/**
 * The Turntable — the Featured Release: the most recent essay, in a line
 * box marked NOW PLAYING in neon. On the left, the collection's record in
 * its sleeve (hover or focus slides the vinyl about 20% out and gives it
 * a slow turn; on touch screens it rests part-way out). In the middle, the
 * essay's title, big, with its series as a quieter subtitle. On the right,
 * the essay's own art as a little single. The title, "Read" and "Open
 * Sleeve" links are always on the page, so nothing depends on the
 * animation.
 */
export default function TurntableFeature({ entry, allEntries }) {
  if (!entry) return null;
  const collection = getCollectionForEntry(entry);
  const catalog = catalogNumber(entry, allEntries);
  const href = `/journal/${entry.slug}`;
  const poster = posterArt(entry);
  // How much of the long play is still to come, as a share of the sleeve.
  const published =
    collection?.kind === "series"
      ? allEntries.filter((e) => e.series === collection.key).length
      : TOTAL_TRACKS;
  const pending = Math.max(0, TOTAL_TRACKS - Math.min(published, TOTAL_TRACKS)) / TOTAL_TRACKS;
  const subtitle = collection
    ? entry.series
      ? `${collection.title} · Track ${String(entry.part).padStart(2, "0")}`
      : collection.title
    : "Journal";

  return (
    <div className="relative pt-9">
      {/* NOW PLAYING stands on its own above the box — clear of the
          line and its travelling light. */}
      <span className="neon-now absolute left-5 top-0 z-20 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.3em] sm:left-8">
        Now Playing
      </span>
      <div className="neon-box relative px-5 pb-7 pt-8 sm:pl-12 sm:pr-8 sm:pb-9">

      <div className="grid items-center gap-8 sm:grid-cols-[auto,1fr] lg:grid-cols-[auto,1fr,auto] lg:gap-10">
        {/* Phones: a pen lies flat above the sleeve. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 190 28"
          className="-mb-3 mx-auto block h-7 w-[12rem] drop-shadow-[2px_4px_4px_rgba(0,0,0,0.5)] sm:hidden"
        >
          <defs>
            <linearGradient id="pen-body-h" x1="0" x2="1">
              <stop offset="0" stopColor="#0b1220" />
              <stop offset="0.35" stopColor="#33466b" />
              <stop offset="0.6" stopColor="#141d33" />
              <stop offset="1" stopColor="#070b14" />
            </linearGradient>
            <linearGradient id="pen-gold-h" x1="0" x2="1">
              <stop offset="0" stopColor="#8a6420" />
              <stop offset="0.45" stopColor="#f3d98b" />
              <stop offset="1" stopColor="#7a561b" />
            </linearGradient>
          </defs>
          <g transform="translate(190 0) rotate(90)">
            <rect x="6" y="2" width="16" height="132" rx="8" fill="url(#pen-body-h)" />
            <rect x="5" y="18" width="18" height="5" rx="2" fill="url(#pen-gold-h)" />
            <rect x="5" y="26" width="18" height="2.5" rx="1" fill="url(#pen-gold-h)" />
            <rect x="21" y="8" width="3" height="58" rx="1.5" fill="url(#pen-gold-h)" />
            <path d="M7 130 H21 L18 150 H10 Z" fill="#101827" />
            <path d="M10 150 H18 L14 188 Z" fill="url(#pen-gold-h)" />
            <path d="M14 160 V178" stroke="#5b4313" strokeWidth="1" />
            <circle cx="14" cy="158" r="1.6" fill="#5b4313" />
            <rect x="9" y="8" width="2.4" height="116" rx="1.2" fill="#fff" opacity="0.22" />
          </g>
        </svg>

        {/* Phones: the ESSAY's art is the sleeve, with the record sliding
            out of it. (The series art follows at the bottom.) */}
        {collection && (
          <Link
            href={href}
            aria-label={`Read ${entry.title}`}
            className="rec-pull group mx-auto block outline-none sm:hidden"
          >
            <div className="rec-pull-stage">
              <div className="rec-disc-wrap">
                <VinylDisc collection={collection} label={collection.title} catalog={catalog} />
              </div>
              <Sleeve collection={{ cover: poster || collection.cover }} className="rec-sleeve--top" />
            </div>
          </Link>
        )}

        <div className="relative mx-auto hidden sm:mx-0 sm:block">
        <Link
          href={href}
          aria-label={`Read ${entry.title}`}
          className="rec-pull group mx-auto block outline-none sm:mx-0"
        >
          <div className="rec-pull-stage">
            {collection && (
              <div className="rec-disc-wrap">
                <VinylDisc collection={collection} label={collection.title} catalog={catalog} />
              </div>
            )}
            {collection && (
              <Sleeve collection={collection}>
                {/* The tracks not out yet: that share of the art, greyed —
                    blended in along a soft, slightly uneven diagonal. */}
                {pending > 0 && (
                  <span
                    className="rec-pending"
                    style={{ "--edge": (1 - pending) * 100 }}
                    title={`${TOTAL_TRACKS - published} of ${TOTAL_TRACKS} tracks forthcoming`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={collection.cover} alt="" className="rec-pending-a" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={collection.cover} alt="" className="rec-pending-b" />
                    <span className="rec-pending-label">Forthcoming</span>
                  </span>
                )}
              </Sleeve>
            )}
          </div>
        </Link>
        {/* The long play's progress, right under the sleeve. */}
        {collection?.kind === "series" && (
          <div className="mt-4 pr-[18%]">
            <TrackNodes published={published} color={collection.color} />
          </div>
        )}
        {/* A pen, left on the table beside the sleeve. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 28 190"
          className="pointer-events-none absolute -left-[5.2rem] bottom-16 z-20 hidden h-[11rem] w-[1.65rem] origin-bottom rotate-[24deg] drop-shadow-[2px_5px_5px_rgba(0,0,0,0.55)] sm:block"
        >
          <defs>
            <linearGradient id="pen-body" x1="0" x2="1">
              <stop offset="0" stopColor="#0b1220" />
              <stop offset="0.35" stopColor="#33466b" />
              <stop offset="0.6" stopColor="#141d33" />
              <stop offset="1" stopColor="#070b14" />
            </linearGradient>
            <linearGradient id="pen-gold" x1="0" x2="1">
              <stop offset="0" stopColor="#8a6420" />
              <stop offset="0.45" stopColor="#f3d98b" />
              <stop offset="1" stopColor="#7a561b" />
            </linearGradient>
          </defs>
          {/* cap end + body */}
          <rect x="6" y="2" width="16" height="132" rx="8" fill="url(#pen-body)" />
          <rect x="5" y="18" width="18" height="5" rx="2" fill="url(#pen-gold)" />
          <rect x="5" y="26" width="18" height="2.5" rx="1" fill="url(#pen-gold)" />
          {/* clip */}
          <rect x="21" y="8" width="3" height="58" rx="1.5" fill="url(#pen-gold)" />
          {/* grip + nib */}
          <path d="M7 130 H21 L18 150 H10 Z" fill="#101827" />
          <path d="M10 150 H18 L14 188 Z" fill="url(#pen-gold)" />
          <path d="M14 160 V178" stroke="#5b4313" strokeWidth="1" />
          <circle cx="14" cy="158" r="1.6" fill="#5b4313" />
          {/* a highlight down the barrel */}
          <rect x="9" y="8" width="2.4" height="116" rx="1.2" fill="#fff" opacity="0.22" />
        </svg>
        </div>

        <div className="min-w-0 text-white">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#ffd98a]">
            Featured Release
          </p>
          <h3 className="mt-2 font-display text-[2.6rem] uppercase leading-[0.94] tracking-tight [filter:drop-shadow(0_2px_3px_rgba(0,0,0,0.5))] sm:text-[3.5rem]">
            <Link href={href} className="ft-title" style={{ "--ft-color": collection?.color || "#d3ac52" }}>
              {entry.titleHtml ? (
                <span
                  dangerouslySetInnerHTML={{ __html: stripSeries(entry.titleHtml, entry.series) }}
                />
              ) : (
                stripSeries(entry.title, entry.series)
              )}
            </Link>
          </h3>
          <p className="album-title mt-3 font-serif text-xl font-normal leading-tight text-white/85">
            {subtitle}
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-white/55">
            {catalog}
            {entry.date ? ` · ${formatDate(entry.date)}` : ""} · {readMinutes(entry.content)} min read
          </p>
          {entry.excerpt && (
            <p className="mt-4 max-w-md font-serif text-base italic leading-snug text-white/75">
              {entry.excerpt}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={href}
              className="rounded-full bg-accent px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              Read &rarr;
            </Link>
            {collection && (
              <Link
                href={collection.href}
                className="rounded-full border border-white/40 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-accent hover:text-accent"
              >
                Open Sleeve
              </Link>
            )}
          </div>
        </div>

        {/* The essay's own art, as a single: a paper sleeve with a seven-
            inch peeking out of it. */}
        {poster && collection && (
          <Link
            href={href}
            aria-label={`${entry.title} — the single`}
            className="sn-single mx-auto hidden outline-none sm:block lg:mx-0"
          >
            {/* An insert page, tucked in the sleeve and sliding out of it. */}
            <div className="sn-disc-wrap" aria-hidden="true">
              <span className="sn-insert">
                {/* A page from a journal: ruled lines and a red margin,
                    written out by hand. */}
                <span className="sn-insert-text">{entry.excerpt || entry.title}</span>
              </span>
            </div>
            <div className="sn-sleeve">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={poster} alt="" loading="lazy" />
            </div>
          </Link>
        )}

        {/* Phones: the series art, upright at the bottom — greyed where the
            long play isn't finished yet, with its progress bar. */}
        {collection && (
          <div className="mx-auto w-[min(15rem,72vw)] sm:hidden">
            <Link href={collection.href} aria-label={`${collection.title} — open the sleeve`} className="block">
              <Sleeve collection={collection}>
                {pending > 0 && (
                  <span
                    className="rec-pending"
                    style={{ "--edge": (1 - pending) * 100 }}
                    title={`${TOTAL_TRACKS - published} of ${TOTAL_TRACKS} tracks forthcoming`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={collection.cover} alt="" className="rec-pending-a" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={collection.cover} alt="" className="rec-pending-b" />
                    <span className="rec-pending-label">Forthcoming</span>
                  </span>
                )}
              </Sleeve>
            </Link>
            {collection.kind === "series" && (
              <TrackNodes published={published} color={collection.color} className="mt-4" />
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
