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

// A fountain pen. `flat` lies it on its side (phones); otherwise it leans.
function Pen({ flat = false, className = "" }) {
  const id = flat ? "h" : "v";
  const parts = (
    <>
      <rect x="6" y="2" width="16" height="132" rx="8" fill={`url(#pen-body-${id})`} />
      <rect x="5" y="18" width="18" height="5" rx="2" fill={`url(#pen-gold-${id})`} />
      <rect x="5" y="26" width="18" height="2.5" rx="1" fill={`url(#pen-gold-${id})`} />
      <rect x="21" y="8" width="3" height="58" rx="1.5" fill={`url(#pen-gold-${id})`} />
      <path d="M7 130 H21 L18 150 H10 Z" fill="#101827" />
      <path d="M10 150 H18 L14 188 Z" fill={`url(#pen-gold-${id})`} />
      <path d="M14 160 V178" stroke="#5b4313" strokeWidth="1" />
      <circle cx="14" cy="158" r="1.6" fill="#5b4313" />
      <rect x="9" y="8" width="2.4" height="116" rx="1.2" fill="#fff" opacity="0.22" />
    </>
  );
  return (
    <svg aria-hidden="true" viewBox={flat ? "0 0 190 28" : "0 0 28 190"} className={className}>
      <defs>
        <linearGradient id={`pen-body-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#0b1220" />
          <stop offset="0.35" stopColor="#33466b" />
          <stop offset="0.6" stopColor="#141d33" />
          <stop offset="1" stopColor="#070b14" />
        </linearGradient>
        <linearGradient id={`pen-gold-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#8a6420" />
          <stop offset="0.45" stopColor="#f3d98b" />
          <stop offset="1" stopColor="#7a561b" />
        </linearGradient>
      </defs>
      {flat ? <g transform="translate(190 0) rotate(90)">{parts}</g> : parts}
    </svg>
  );
}

/**
 * The Turntable — the Featured Release: the most recent essay, in a line
 * box marked ON AIR in neon.
 *
 * - Left: the ESSAY's own art as the sleeve, with the record that slides
 *   about 20% out on hover or focus (and a slow turn while it is out; on
 *   touch screens it simply rests part-way out).
 * - Middle: the essay's title, big, its collection as a quieter subtitle.
 * - Right (bottom on phones): the collection's art, upright and small,
 *   greyed over the essays that aren't out yet, its progress bar beneath.
 *
 * The links that repeat a destination (sleeve, collection art, Read) are
 * hidden from assistive tech, so each destination is announced once.
 */
export default function TurntableFeature({ entry, allEntries }) {
  if (!entry) return null;
  const collection = getCollectionForEntry(entry);
  const catalog = catalogNumber(entry, allEntries);
  const href = `/journal/${entry.slug}`;
  const poster = posterArt(entry);
  const published =
    collection?.kind === "series"
      ? allEntries.filter((e) => e.series === collection.key).length
      : TOTAL_TRACKS;
  // The share of the collection still to come, as a share of its art.
  const pending = Math.max(0, TOTAL_TRACKS - Math.min(published, TOTAL_TRACKS)) / TOTAL_TRACKS;
  const subtitle = collection
    ? entry.series
      ? `${collection.title} · Track ${String(entry.part).padStart(2, "0")}`
      : collection.title
    : "Journal";

  return (
    <div className="relative pt-9">
      {/* ON AIR sits across the top line — solid, so the line never shows
          through it or blends into it. */}
      <span className="neon-now absolute left-5 top-[1.05rem] z-20 px-5 py-2 font-mono text-[15px] font-bold uppercase tracking-[0.32em] sm:left-8">
        On Air
      </span>
      <div className="neon-box relative px-5 pb-7 pt-8 sm:pl-12 sm:pr-8 sm:pb-9">
        <div className="grid items-center gap-8 sm:grid-cols-[auto,1fr] lg:grid-cols-[auto,1fr,auto] lg:gap-10">
          {/* Phones: a pen lies flat above the sleeve. */}
          <Pen flat className="-mb-3 mx-auto block h-7 w-[12rem] drop-shadow-[2px_4px_4px_rgba(0,0,0,0.5)] sm:hidden" />

          {/* The essay's art as the sleeve, the record sliding out of it */}
          <div className="relative mx-auto sm:mx-0">
            <Link
              href={href}
              aria-hidden="true"
              tabIndex={-1}
              className="rec-pull group mx-auto block outline-none sm:mx-0"
            >
              <div className="rec-pull-stage">
                {collection && (
                  <div className="rec-disc-wrap">
                    <VinylDisc collection={collection} label={collection.title} catalog={catalog} />
                  </div>
                )}
                <Sleeve
                  collection={{ cover: poster || collection?.cover || "/journal-art/lp-interludes.webp" }}
                  className="rec-sleeve--top"
                />
              </div>
            </Link>
            {/* A pen, left on the table beside the sleeve. */}
            <Pen className="pointer-events-none absolute -left-[5.2rem] bottom-16 z-20 hidden h-[11rem] w-[1.65rem] origin-bottom rotate-[24deg] drop-shadow-[2px_5px_5px_rgba(0,0,0,0.55)] sm:block" />
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
                aria-hidden="true"
                tabIndex={-1}
                className="rounded-full bg-accent px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
              >
                Read &rarr;
              </Link>
              {collection && (
                <Link
                  href={collection.href}
                  aria-label={`Explore Collection: ${collection.title}`}
                  className="rounded-full border border-white/40 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-accent hover:text-accent"
                >
                  Explore Collection
                </Link>
              )}
            </div>
          </div>

          {/* The collection's art: small, upright, greyed over what isn't
              out yet (blended along a soft, slightly uneven diagonal), its
              progress under it. */}
          {collection && (
            <div className="mx-auto w-[min(15rem,72vw)] sm:col-span-2 sm:w-44 lg:col-span-1 lg:mx-0 lg:w-40">
              <Link href={collection.href} aria-hidden="true" tabIndex={-1} className="block">
                <Sleeve collection={collection}>
                  {pending > 0 && (
                    <span className="rec-pending" style={{ "--edge": (1 - pending) * 100 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={collection.cover} alt="" className="rec-pending-a" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={collection.cover} alt="" className="rec-pending-b" />
                    </span>
                  )}
                </Sleeve>
              </Link>
              {collection.kind === "series" && (
                <TrackNodes published={published} color={collection.color} compact className="mt-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
