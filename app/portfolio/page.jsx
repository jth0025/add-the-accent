import EntryList from "@/components/EntryList";
import { getAllEntries } from "@/lib/content";

export const metadata = { title: "Portfolio — Add the Accent" };

export default function PortfolioIndex() {
  const entries = getAllEntries("portfolio");
  return (
    <EntryList
      section="portfolio"
      heading="Portfolio"
      intro="Case studies from the Homebody series — the finished pieces."
      entries={entries}
    />
  );
}
