import EntryList from "@/components/EntryList";
import { getAllEntries } from "@/lib/content";

export const metadata = { title: "Journal — Add the Accent" };

export default function JournalIndex() {
  const entries = getAllEntries("journal");
  return (
    <EntryList
      section="journal"
      heading="Journal"
      intro="Field notes — the raw material, before it becomes a piece."
      entries={entries}
    />
  );
}
