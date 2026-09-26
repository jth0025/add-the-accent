import EntryList from "@/components/EntryList";
import JournalNav from "@/components/JournalNav";
import JournalEntryCard from "@/components/JournalEntryCard";
import SeriesProgress from "@/components/SeriesProgress";
import PaperClip from "@/components/PaperClip";
import { getAllEntries } from "@/lib/content";

export const metadata = { title: "Journal — Add the Accent" };

// The ordered series, in the sequence they should read on the page.
const SERIES_ORDER = ["Domain Expansion", "Back to Oui", "Homebody"];

// Shown under the heading when the dropdown links here with a filter,
// and as the blurb under each series on the sectioned index.
const SERIES_INTROS = {
  "Domain Expansion":
    "The home-curation journey — moving in, and the shape a room takes on the way to becoming home.",
  "Back to Oui":
    "Traces the distance between love and despair; loneliness and belonging; agreeing and retreating.",
  "Homebody":
    "Homebody is the series that never leaves home — a case study in cleaning the room that lives inside you, one session, one rep, at a time. It's where accountability turns into discipline, and discipline into the kind of greatness that's just as useful away from home as it is within it.",
};

const CATEGORY_INTROS = {
  Interludes:
    "Short reflections and sparks that surface inside the series above — not a story of their own.",
};

const JOURNAL_INTRO = "Field notes — the raw material, before it becomes a piece.";

// The Journal nav dropdown links here with ?series=... or ?category=...
// (see app/layout.jsx) to pre-filter the list. With neither, this shows
// the full sectioned index: Series, Interludes, All Entries, with
// jump-links at the top.
export default function JournalIndex({ searchParams }) {
  const allEntries = getAllEntries("journal");
  const series = searchParams?.series;
  const category = searchParams?.category;

  // Filtered views keep the simple single-list layout.
  if (series || category) {
    let entries = allEntries;
    let heading = "Journal";
    let intro = JOURNAL_INTRO;

    if (series) {
      entries = allEntries
        .filter((e) => e.series === series)
        .sort((a, b) => (a.part || 0) - (b.part || 0));
      heading = series;
      intro = SERIES_INTROS[series] || intro;
    } else {
      entries = allEntries.filter((e) => e.category === category);
      heading = category;
      intro = CATEGORY_INTROS[category] || intro;
    }

    return (
      <EntryList
        section="journal"
        heading={heading}
        intro={intro}
        entries={entries}
      />
    );
  }

  // Unfiltered: the sectioned index.
  const seriesGroups = SERIES_ORDER.map((name) => ({
    name,
    intro: SERIES_INTROS[name],
    entries: allEntries
      .filter((e) => e.series === name)
      .sort((a, b) => (a.part || 0) - (b.part || 0)),
  })).filter((group) => group.entries.length > 0);

  const interludes = allEntries.filter((e) => e.category === "Interludes");

  // The sections now sit straight on the page's dark ground (no card
  // behind them), so headings and blurbs read light. The section titles
  // pick up the same distressed type as the top submenu.
  const sectionHeadingClass =
    "grunge-text font-display text-2xl uppercase tracking-tight text-white sm:text-3xl [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]";
  const sectionBlurbClass = "mt-2 max-w-xl text-sm text-white/70";

  // Per-series title: starts black, reveals its own color on hover.
  const SERIES_HOVER_COLOR = {
    "Domain Expansion": "hover:text-[#a855f7]",
    "Back to Oui": "hover:text-[#e0555f]",
    "Homebody": "hover:text-[#d3ac52]",
  };

  const JOURNAL_PAGE_INTRO =
    "Before any of this was written, it was played, shot, designed, or filmed. Writing came last — the medium that finally held the others together — and this page is where it keeps going.";

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="sr-only">Journal</h1>
      {/* On phones the fold texture (a fixed-aspect image sized to the
          card's width) is too short to reach the quote and copy, so it
          stretches to the card's full height there; from sm: up it goes
          back to its natural proportions. */}
      <section className="paper-fold-thirds corner-box relative rounded-xl border border-ink/15 bg-card px-7 pb-14 pt-10 ![background-size:auto,auto,100%_100%] sm:px-10 sm:py-12 sm:![background-size:auto,auto,100%_auto]">
        <PaperClip position="-top-4 left-14 rotate-[7deg]" />
        <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
          <span className="h-px w-8 bg-accent/40" />
          <span>Journal</span>
          <span className="h-px w-8 bg-accent/40" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/journal-art/journal-page-art.png"
          alt="The Add the Accent character writing at a wooden desk, books and a small plant beside him"
          className="mx-auto mt-4 w-48 max-w-full drop-shadow-[0_10px_16px_rgba(0,0,0,0.28)] sm:mt-6 sm:w-64"
        />
        <p className="mx-auto mt-4 max-w-xl pl-2 pr-6 text-center font-serif text-2xl italic leading-snug text-ink sm:mt-6 sm:pl-0 sm:pr-8 sm:text-3xl">
          &ldquo;Write the vision,
          <br className="sm:hidden" /> make it plain.&rdquo;
        </p>
        <p className="mx-auto mt-4 max-w-xl pl-2 pr-6 text-center text-sm text-stone sm:mt-6 sm:pl-0 sm:pr-8">
          {JOURNAL_PAGE_INTRO}
        </p>
      </section>

      <JournalNav tone="light" className="mt-8 justify-center" />

      <section id="series" className="mt-12 scroll-mt-24">
        <h2 className={sectionHeadingClass}>Series</h2>
        <div className="mt-8 space-y-12">
          {seriesGroups.map((group) => (
            <div key={group.name}>
              <h3
                className={`font-serif text-xl italic text-ink transition-colors duration-300 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)] ${
                  SERIES_HOVER_COLOR[group.name] || "hover:text-accent"
                }`}
              >
                {group.name}
              </h3>
              {group.intro && (
                <p className="mt-1 max-w-xl text-sm text-white/70">
                  {group.intro}
                </p>
              )}
              <SeriesProgress
                series={group.name}
                entries={group.entries}
                tone="dark"
                className="mt-4 max-w-xs"
              />
              <ul className="mt-5 space-y-5">
                {group.entries.map((entry) => (
                  <li key={entry.slug}>
                    <JournalEntryCard entry={entry} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="interludes" className="mt-14 scroll-mt-24">
        <h2 className={sectionHeadingClass}>Interludes</h2>
        <p className={sectionBlurbClass}>{CATEGORY_INTROS.Interludes}</p>
        <ul className="mt-8 space-y-5">
          {interludes.map((entry) => (
            <li key={entry.slug}>
              <JournalEntryCard entry={entry} />
            </li>
          ))}
        </ul>
      </section>

      <section id="all-entries" className="mt-14 scroll-mt-24">
        <h2 className={sectionHeadingClass}>All Entries</h2>
        <ul className="mt-8 space-y-5">
          {allEntries.map((entry) => (
            <li key={entry.slug}>
              <JournalEntryCard entry={entry} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
