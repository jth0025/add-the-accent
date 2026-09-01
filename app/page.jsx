import Link from "next/link";
import { getAllEntries, formatDate } from "@/lib/content";

export default function HomePage() {
  const portfolio = getAllEntries("portfolio").slice(0, 3);
  const journal = getAllEntries("journal").slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-20">
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-accent">
          Homebody · a series about environment, discipline, and identity
        </p>
        <h1 className="mt-6 font-serif text-4xl leading-tight text-ink sm:text-5xl">
          When the road is unclear, clean a room.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-stone">
          This is where the writing lives — case studies from the Homebody
          series alongside the raw journal entries they grew out of.
        </p>
      </section>

      {portfolio.length > 0 && (
        <section className="border-t border-stone/10 py-14">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-ink">Portfolio</h2>
            <Link href="/portfolio" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-8">
            {portfolio.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/portfolio/${entry.slug}`} className="group block">
                  <h3 className="font-serif text-xl text-ink group-hover:text-accent">
                    {entry.title}
                  </h3>
                  {entry.date && (
                    <p className="mt-1 text-xs uppercase tracking-wide text-stone/60">
                      {formatDate(entry.date)}
                    </p>
                  )}
                  {entry.excerpt && (
                    <p className="mt-2 text-stone">{entry.excerpt}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {journal.length > 0 && (
        <section className="border-t border-stone/10 py-14">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-ink">Journal</h2>
            <Link href="/journal" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-8">
            {journal.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/journal/${entry.slug}`} className="group block">
                  <h3 className="font-serif text-xl text-ink group-hover:text-accent">
                    {entry.title}
                  </h3>
                  {entry.date && (
                    <p className="mt-1 text-xs uppercase tracking-wide text-stone/60">
                      {formatDate(entry.date)}
                    </p>
                  )}
                  {entry.excerpt && (
                    <p className="mt-2 text-stone">{entry.excerpt}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
