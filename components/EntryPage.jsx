import Link from "next/link";
import { formatDate } from "@/lib/content";

export default function EntryPage({ section, backLabel, entry }) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <Link href={`/${section}`} className="text-sm text-accent hover:underline">
        ← {backLabel}
      </Link>

      <h1 className="mt-6 font-serif text-4xl leading-tight text-ink">
        {entry.title}
      </h1>
      {entry.date && (
        <p className="mt-3 text-xs uppercase tracking-wide text-stone/60">
          {formatDate(entry.date)}
        </p>
      )}

      <div
        className="prose prose-accent mt-10 font-serif text-lg"
        dangerouslySetInnerHTML={{ __html: entry.html }}
      />
    </article>
  );
}
