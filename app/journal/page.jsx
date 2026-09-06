import EntryList from "@/components/EntryList";
import { getAllEntries } from "@/lib/content";

export const metadata = { title: "Journal — Add the Accent" };

// Shown under the heading when the dropdown links here with a filter.
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

// The Journal nav dropdown links here with ?series=... or ?category=...
// (see app/layout.jsx) to pre-filter the list; with neither, it's every
// entry, newest first.
export default function JournalIndex({ searchParams }) {
  const allEntries = getAllEntries("journal");
  const series = searchParams?.series;
  const category = searchParams?.category;

  let entries = allEntries;
  let heading = "Journal";
  let intro = "Field notes — the raw material, before it becomes a piece.";

  if (series) {
    entries = allEntries.filter((e) => e.series === series);
    heading = series;
    intro = SERIES_INTROS[series] || intro;
  } else if (category) {
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
