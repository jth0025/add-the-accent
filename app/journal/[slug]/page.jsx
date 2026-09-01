import { notFound } from "next/navigation";
import EntryPage from "@/components/EntryPage";
import { getAllSlugs, getEntry } from "@/lib/content";

export function generateStaticParams() {
  return getAllSlugs("journal").map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const entry = getEntry("journal", params.slug);
  return { title: entry ? `${entry.title} — Add the Accent` : "Not found" };
}

export default function JournalEntry({ params }) {
  const entry = getEntry("journal", params.slug);
  if (!entry) notFound();
  return <EntryPage section="journal" backLabel="Journal" entry={entry} />;
}
