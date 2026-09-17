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
    "A visual storytelling series exploring masculinity, identity, vulnerability, and the quiet pressures of becoming — a journey to healing.",
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

  // Per-series label color; green on hover.
  const SERIES_LABEL_COLOR = {
    "Domain Expansion": "text-[#a855f7]",
    "Back to Oui": "text-[#e0555f]",
    "Homebody": "text-[#d3ac52]",
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <section className="paper-fold-thirds corner-box relative rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10 sm:py-12">
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
          className="mx-auto mt-6 w-56 max-w-full drop-shadow-[0_10px_16px_rgba(0,0,0,0.28)] sm:w-64"
        />
        <h1 className="mt-6 text-center font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">
          Journal
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-stone">
          {JOURNAL_INTRO}
        </p>
      </section>

      <JournalNav tone="light" className="mt-8 justify-center" />

      <section id="series" className="mt-12 scroll-mt-24">
        <h2 className={sectionHeadingClass}>Series</h2>
        <div className="mt-8 space-y-12">
          {seriesGroups.map((group) => (
            <div key={group.name}>
              <h3
                className={`font-serif text-xl italic [text-shadow:0_1px_3px_rgba(0,0,0,0.55)] ${
                  SERIES_LABEL_COLOR[group.name] || "text-white"
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
