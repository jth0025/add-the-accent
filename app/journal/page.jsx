import Link from "next/link";
import PaperClip from "@/components/PaperClip";
import JournalNav from "@/components/JournalNav";
import AccentNotesSignup from "@/components/AccentNotesSignup";
import TurntableFeature from "@/components/journal/TurntableFeature";
import LongPlays from "@/components/journal/LongPlays";
import SinglesShelf from "@/components/journal/SinglesShelf";
import ArchiveList from "@/components/journal/ArchiveList";
import BackCover from "@/components/journal/BackCover";
import ArchiveCrate from "@/components/journal/ArchiveCrate";
import SinglesCarousel from "@/components/journal/SinglesCarousel";
import { formatDate } from "@/lib/formatDate";
import { readMinutes } from "@/lib/catalog";
import HeroGear from "@/components/journal/HeroGear";
import ScrollGradient from "@/components/journal/ScrollGradient";
import { getAllEntries } from "@/lib/content";
import {
  COLLECTIONS,
  catalogNumber,
  getCollectionByKey,
  posterArt,
  trackArt,
} from "@/lib/catalog";

export const metadata = { title: "Journal — Add the Accent" };

const JOURNAL_PAGE_INTRO =
  "Before any of this was written, it was played, shot, designed, or filmed. Writing came last — the medium that finally held the others together — and this page is where it keeps going. Think of it as a record store for the written word: every essay should feel like your favorite cut — nostalgic, memorable, kept like a record you never lose, and just as impactful. We are writing toward healing, and the journey runs like your favorite album, track by track: the series are long plays, the shorter pieces are singles, and everything here is meant to be read, not played.";

// The Journal as a record label. The nav dropdown links here with
// ?series=... or ?category=Interludes: those open the collection as the
// back of its album. With neither, this is the whole record store —
// The Turntable (featured release), Long Plays (the series), the
// Singles, The Archive, and a place to hear about the next drop.
export default function JournalIndex({ searchParams }) {
  const allEntries = getAllEntries("journal");
  const series = searchParams?.series;
  const category = searchParams?.category;

  const openKey = series || category;
  const opened = openKey ? getCollectionByKey(openKey) : null;
  if (opened) {
    const entries = allEntries.filter((e) =>
      opened.kind === "series" ? e.series === opened.key : e.category === opened.key,
    );
    return <BackCover collection={opened} entries={entries} allEntries={allEntries} />;
  }

  const featured = allEntries[0];
  const collections = COLLECTIONS.map((c) => ({
    ...c,
    entries: (c.kind === "series"
      ? allEntries.filter((e) => e.series === c.key)
      : allEntries.filter((e) => e.category === c.key)
    ).sort((a, b) =>
      c.kind === "series"
        ? (a.part || 0) - (b.part || 0)
        : new Date(a.date || 0) - new Date(b.date || 0),
    ),
  }));
  const longPlays = collections.filter((c) => c.kind === "series");
  const singlesCollection = collections.find((c) => c.kind === "singles");
  const singles = singlesCollection?.entries || [];

  // Everything in the crate: each essay's own art, or its cover.
  const crateItems = allEntries.map((e) => ({
    slug: e.slug,
    title: e.title,
    href: `/journal/${e.slug}`,
    src: posterArt(e) || trackArt(e),
    catalog: catalogNumber(e, allEntries),
  }));

  // Set at nearly the Archive's size (a little smaller) and easing into a
  // gradient on hover; the Archive keeps its own gold gleam.
  const secTitle =
    "sec-title font-display text-[min(3.4rem,10.4vw)] uppercase leading-[0.86] tracking-tighter [filter:drop-shadow(0_2px_3px_rgba(0,0,0,0.5))] sm:text-[5.2rem]";
  const sectionSub =
    "mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-white/60";

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="sr-only">Journal</h1>
      <ScrollGradient />

      {/* The hero, as before. */}
      <section className="paper-fold-thirds corner-box relative mx-auto max-w-3xl rounded-xl border border-ink/15 bg-card px-7 pb-14 pt-10 ![background-size:auto,auto,100%_100%] sm:px-10 sm:py-12 sm:![background-size:auto,auto,100%_auto]">
        <PaperClip position="-top-4 left-14 rotate-[7deg]" />
        <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
          <span className="h-px w-8 bg-accent/40" />
          <span>Journal</span>
          <span className="h-px w-8 bg-accent/40" />
        </div>
        {/* The main art, with studio gear sketched faintly around it. */}
        <div className="relative -mx-7 mt-4 overflow-hidden px-7 sm:-mx-10 sm:mt-6 sm:px-10">
          <HeroGear />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/journal-art/journal-page-art.png"
            alt="The Add the Accent character writing at a wooden desk, books and a small plant beside him"
            className="relative mx-auto block w-48 max-w-full drop-shadow-[0_10px_16px_rgba(0,0,0,0.28)] sm:w-64"
          />
        </div>
        <p className="mx-auto mt-4 max-w-xl pl-2 pr-6 text-center font-serif text-2xl italic leading-snug text-ink sm:mt-6 sm:pl-0 sm:pr-8 sm:text-3xl">
          &ldquo;Write the vision,
          <br className="sm:hidden" /> make it plain.&rdquo;
        </p>
        <p className="mx-auto mt-4 max-w-xl pl-2 pr-6 text-center text-sm text-stone sm:mt-6 sm:pl-0 sm:pr-8">
          {JOURNAL_PAGE_INTRO}
        </p>
      </section>

      <JournalNav tone="light" className="mt-8 justify-center" />

      {/* The Turntable — the Featured Release */}
      <section id="turntable" className="mt-14 scroll-mt-24">
        <h2 className={`${secTitle} text-center`} style={{ "--sec-color": "#4fb4ff" }}>The Turntable</h2>
        <p className={`${sectionSub} text-center`}>Featured Release</p>
        <div className="mt-8">
          <TurntableFeature entry={featured} allEntries={allEntries} />
        </div>
      </section>

      {/* Long Plays — the series */}
      <section id="long-plays" className="mt-20 scroll-mt-24">
        <h2 className={`${secTitle} text-center`} style={{ "--sec-color": "#d3ac52" }}>Long Plays</h2>
        <p className={`${sectionSub} text-center`}>A literary album collection</p>
        <div className="mt-6">
          <LongPlays collections={longPlays} />
        </div>
      </section>

      {/* The shorter essays: small paper sleeves, with the collection's
          cover standing beside them */}
      <section id="singles" className="mt-20 scroll-mt-24">
        <h2 className={`${secTitle} text-center`} style={{ "--sec-color": "#6f8cff" }}>The Singles Collection</h2>
        <p className={`${sectionSub} text-center`}>Short reflections &middot; one side, one sitting</p>
        {/* Phones: a swipeable scroller, the same kind as Long Plays. */}
        <div className="mt-8 sm:hidden">
          <SinglesCarousel
            cover={singlesCollection.cover}
            href="/journal?category=Interludes"
            color={singlesCollection.color}
            ink={singlesCollection.ink}
            items={singles.map((e) => ({
              slug: e.slug,
              title: e.title,
              titleHtml: e.titleHtml,
              catalog: catalogNumber(e, allEntries),
              dateLabel: formatDate(e.date),
              minutes: readMinutes(e.content),
            }))}
          />
        </div>
        <div className="mt-8 hidden items-start gap-8 sm:grid sm:grid-cols-[minmax(0,15rem),1fr] sm:gap-10">
          <Link
            href="/journal?category=Interludes"
            aria-hidden="true"
            tabIndex={-1}
            className="mx-auto hidden w-full max-w-[15rem] outline-none sm:-mt-3 sm:mx-0 sm:block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={singlesCollection.cover}
              alt=""
              loading="lazy"
              className="block aspect-square w-full rounded-[3px] object-cover shadow-[0_16px_30px_rgba(0,0,0,0.5)]"
            />
          </Link>
          <div>
            <SinglesShelf entries={singles} allEntries={allEntries} />
            <Link
              href="/journal?category=Interludes"
              aria-label="Explore Collection: The Singles Collection"
              className="mt-8 inline-block font-mono text-xs font-bold uppercase tracking-widest text-white/80 hover:text-accent"
            >
              Explore Collection &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* The Archive — the record store */}
      <section id="archive" className="mt-20 scroll-mt-24">
        {/* An editorial head: the title set big beside the crate-surfing
            figure, the words wrapping to fit him. */}
        <div className="grid items-end gap-6 sm:grid-cols-[1fr,minmax(0,15rem)]">
          <div className="pb-2">
            <p className={sectionSub}>The record store</p>
            <h2 className="ar-gleam mt-3 font-display text-[4.4rem] uppercase leading-[0.82] tracking-tighter text-white [filter:drop-shadow(0_2px_3px_rgba(0,0,0,0.5))] sm:text-[6.6rem]">
              The
              <br />
              Archive
            </h2>
            <p className="mt-5 max-w-sm border-t-2 border-white/60 pt-3 font-serif text-lg italic leading-snug text-white/80">
              Every entry on the shelves, newest first &mdash; each with a catalog
              number that never changes. Flip through the crate, or just read down
              the list.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/journal-art/archive-crate.webp"
            alt="A wooden figure in a cap surfing a crate of records and handwritten pages"
            loading="lazy"
            className="relative z-10 order-first -mb-32 ml-auto mr-1 w-44 max-w-full drop-shadow-[0_14px_16px_rgba(0,0,0,0.4)] sm:static sm:order-none sm:mb-0 sm:ml-0 sm:mr-0 sm:w-full"
          />
        </div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr,17rem]">
          <ArchiveList entries={allEntries} />
          <div className="lg:sticky lg:top-6">
            <ArchiveCrate items={crateItems} />
          </div>
        </div>
      </section>

      {/* Accent Note — keep up with the latest drop */}
      <section id="accent-note" className="mt-20 scroll-mt-24">
        <AccentNotesSignup />
      </section>
    </div>
  );
}
