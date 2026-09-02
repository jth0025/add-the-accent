import Link from "next/link";
import { getAllEntries, formatDate } from "@/lib/content";

export default function HomePage() {
  const portfolio = getAllEntries("portfolio").slice(0, 3);
  const journal = getAllEntries("journal").slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="py-20">
        <div className="overflow-hidden rounded-2xl border border-ink/20 bg-ink/[0.04] shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/homebody-feature.jpg"
            alt="Homebody series"
            className="h-72 w-full object-cover sm:h-96"
            style={{ objectPosition: "50% 12%" }}
          />
          <div className="p-6 sm:p-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-ink/[0.08] px-3 py-1 font-sans text-xs tracking-wide text-stone">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Homebody series
            </span>
            <h1 className="mt-5 font-serif text-4xl leading-tight text-ink sm:text-5xl">
              When the road is unclear, clean a room.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-stone">
              This is where the writing lives — case studies from the Homebody
              series alongside the raw journal entries they grew out of.
            </p>
          </div>
        </div>
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
