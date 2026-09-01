import Link from "next/link";
import { formatDate } from "@/lib/content";

export default function EntryList({ section, heading, intro, entries }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl text-ink">{heading}</h1>
      {intro && <p className="mt-4 max-w-xl text-stone">{intro}</p>}

      {entries.length === 0 ? (
        <p className="mt-12 text-stone/60">
          Nothing published here yet — add a markdown file to{" "}
          <code className="rounded bg-stone/10 px-1.5 py-0.5 text-sm">
            content/{section}
          </code>{" "}
          to see it appear.
        </p>
      ) : (
        <ul className="mt-12 space-y-10 border-t border-stone/10 pt-10">
          {entries.map((entry) => (
            <li key={entry.slug}>
              <Link href={`/${section}/${entry.slug}`} className="group block">
                <h2 className="font-serif text-2xl text-ink group-hover:text-accent">
                  {entry.title}
                </h2>
                {entry.date && (
                  <p className="mt-1 text-xs uppercase tracking-wide text-stone/60">
                    {formatDate(entry.date)}
                  </p>
                )}
                {entry.excerpt && (
                  <p className="mt-3 text-stone">{entry.excerpt}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
