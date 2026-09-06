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

// A section label ("Section 02") that actually reads against the light
// card — the olive token was too pale here.
const SECTION_LABEL = "text-[#4a5714]";
const SECTION_RULE = "bg-[#4a5714]/40";

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

  const sectionHeadingClass =
    "font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl";

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="paper-crinkled corner-box rounded-xl border border-ink/15 bg-card px-7 py-8 sm:px-9">
        <div
          className={`flex items-center gap-3 font-mono text-xs uppercase tracking-widest ${SECTION_LABEL}`}
        >
          <span>Section 02</span>
          <span className={`h-px flex-1 ${SECTION_RULE}`} />
        </div>
        <h1 className="mt-3 font-display text-3xl uppercase tracking-tight text-ink sm:text-4xl">
          Journal
        </h1>
        <p className="mt-4 max-w-xl text-stone">{JOURNAL_INTRO}</p>
        <JournalNav className="mt-6 border-t border-ink/10 pt-5" />
      </div>

      <section id="series" className="mt-14 scroll-mt-24">
        <h2 className={sectionHeadingClass}>Series</h2>
        <div className="mt-8 space-y-12">
          {seriesGroups.map((group) => (
            <div key={group.name}>
              <h3 className="font-serif text-xl italic text-ink">
                {group.name}
              </h3>
              {group.intro && (
                <p className="mt-1 max-w-xl text-sm text-stone">
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
        <p className="mt-1 max-w-xl text-sm text-stone">
          {CATEGORY_INTROS.Interludes}
        </p>
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
