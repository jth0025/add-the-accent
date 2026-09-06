import EntryList from "@/components/EntryList";
import JournalNav from "@/components/JournalNav";
import JournalEntryCard from "@/components/JournalEntryCard";
import { getAllEntries } from "@/lib/content";

export const metadata = { title: "Journal — Add the Accent" };

// The ordered series, in the sequence they should read on the page.
const SERIES_ORDER = ["Domain Expansion", "Back to Oui"];

// Shown under the heading when the dropdown links here with a filter,
// and as the blurb under each series on the sectioned index.
const SERIES_INTROS = {
  "Domain Expansion":
    "The home-curation journey — moving in, and the shape a room takes on the way to becoming home.",
  "Back to Oui":
    "Traces the distance between love and despair; loneliness and belonging; agreeing and retreating.",
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
      entries = allEntries.filter((e) => e.series === series);
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
    "grunge-text font-display text-2xl uppercase tracking-tight text-white transition-colors hover:text-[#3aa856] sm:text-3xl [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]";
  const sectionBlurbClass = "mt-2 max-w-xl text-sm text-white/70";

  // Per-series label color; green on hover.
  const SERIES_LABEL_COLOR = {
    "Domain Expansion": "text-[#a855f7]",
    "Back to Oui": "text-[#e0555f]",
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="sr-only">Journal</h1>
      <JournalNav tone="light" className="justify-center" />

      <section id="series" className="mt-12 scroll-mt-24">
        <h2 className={sectionHeadingClass}>Series</h2>
        <div className="mt-8 space-y-12">
          {seriesGroups.map((group) => (
            <div key={group.name}>
              <h3
                className={`font-serif text-xl italic transition-colors hover:text-[#3aa856] [text-shadow:0_1px_3px_rgba(0,0,0,0.55)] ${
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
