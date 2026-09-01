import { notFound } from "next/navigation";
import EntryPage from "@/components/EntryPage";
import { getAllSlugs, getEntry } from "@/lib/content";

export function generateStaticParams() {
  return getAllSlugs("portfolio").map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const entry = getEntry("portfolio", params.slug);
  return { title: entry ? `${entry.title} — Add the Accent` : "Not found" };
}

export default function PortfolioEntry({ params }) {
  const entry = getEntry("portfolio", params.slug);
  if (!entry) notFound();
  return <EntryPage section="portfolio" backLabel="Portfolio" entry={entry} />;
}
