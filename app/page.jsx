import Link from "next/link";
import { getAllEntries, formatDate } from "@/lib/content";

export default function HomePage() {
  const portfolio = getAllEntries("portfolio").slice(0, 3);
  const journal = getAllEntries("journal").slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="corner-box mt-14 rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10 sm:py-12">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
          <span>Add the Accent</span>
          <span className="h-px flex-1 bg-accent/40" />
        </div>
        <h1 className="mt-4 font-display text-3xl uppercase leading-tight tracking-tight text-ink sm:text-4xl">
          Your perspective is the masterpiece.
          <br />
          Everything else is the medium.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-center text-stone">
          Add the Accent is a multidisciplinary creative studio built on one
          belief: every person, brand, and idea has something only it can
          contribute. Through design, writing, photography, film, and
          apparel, we bring that difference to the surface and give it form.
        </p>
        <p className="mt-5 text-center font-serif text-lg italic text-ink">
          It&rsquo;s about finding and leaving the mark only you can make.
        </p>
      </section>

      <div className="mt-10 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-stone/70">
        <span>Currently</span>
        <span className="h-px flex-1 bg-ink/10" />
      </div>

      <section className="py-6">
        <div
          className="corner-box overflow-hidden rounded-xl border border-black/30 shadow-lg"
          style={{
            background:
              "linear-gradient(135deg, #b9724a 0%, #6b4028 55%, #3a2415 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/homebody-feature.jpg"
            alt="Homebody series"
            className="w-full object-contain"
          />
          <div className="px-8 py-8 sm:px-10">
            <p className="mx-auto max-w-md text-center text-lg text-[#e7ded2]">
              This is where the writing lives — case studies from the Homebody
              series alongside the raw journal entries they grew out of.
            </p>
          </div>
        </div>
      </section>

      {portfolio.length > 0 && (
        <section className="corner-box mb-10 rounded-xl border border-ink/15 bg-card px-7 py-8 sm:px-9">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
            <span>Section 01</span>
            <span className="h-px flex-1 bg-accent/40" />
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">
              Portfolio
            </h2>
            <Link
              href="/portfolio"
              className="shrink-0 font-mono text-xs uppercase tracking-widest text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="mt-8 space-y-8 border-t border-ink/10 pt-8">
            {portfolio.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/portfolio/${entry.slug}`} className="group block">
                  <h3 className="font-serif text-xl text-ink group-hover:text-accent">
                    {entry.title}
                  </h3>
                  {entry.date && (
                    <p className="mt-1 font-mono text-xs uppercase tracking-wide text-stone/60">
                      {formatDate(entry.date)}
                    </p>
                  )}
                  {entry.excerpt && (
                    <p className="mt-2 text-center text-stone">{entry.excerpt}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {journal.length > 0 && (
        <section className="corner-box mb-16 rounded-xl border border-ink/15 bg-card px-7 py-8 sm:px-9">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-moss">
            <span>Section 02</span>
            <span className="h-px flex-1 bg-moss/40" />
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">
              Journal
            </h2>
            <Link
              href="/journal"
              className="shrink-0 font-mono text-xs uppercase tracking-widest text-moss hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="mt-8 space-y-8 border-t border-ink/10 pt-8">
            {journal.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/journal/${entry.slug}`} className="group block">
                  <h3 className="font-serif text-xl text-ink group-hover:text-accent">
                    {entry.title}
                  </h3>
                  {entry.date && (
                    <p className="mt-1 font-mono text-xs uppercase tracking-wide text-stone/60">
                      {formatDate(entry.date)}
                    </p>
                  )}
                  {entry.excerpt && (
                    <p className="mt-2 text-center text-stone">{entry.excerpt}</p>
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
