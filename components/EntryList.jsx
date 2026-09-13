import Link from "next/link";
import { formatDate } from "@/lib/content";
import JournalNav from "@/components/JournalNav";
import JournalEntryCard from "@/components/JournalEntryCard";

export default function EntryList({ section, heading, intro, entries }) {
  const isJournal = section === "journal";
  // A darker olive than the `moss` token so the "Section" label actually
  // reads against the light card.
  const tagTextClass = isJournal ? "text-[#4a5714]" : "text-accent";
  const tagRuleClass = isJournal ? "bg-[#4a5714]/40" : "bg-accent/40";
  // Journal boxes read as crinkled paper; everything else keeps its own mood.
  const paperClass = isJournal ? "paper-crinkled" : "paper-newspaper";

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div
        className={`${paperClass} corner-box rounded-xl border border-ink/15 bg-card px-7 py-8 sm:px-9`}
      >
        <div
          className={`flex items-center gap-3 font-mono text-xs uppercase tracking-widest ${tagTextClass}`}
        >
          <span>{isJournal ? "Section 02" : "Section 01"}</span>
          <span className={`h-px flex-1 ${tagRuleClass}`} />
        </div>
        <h1 className="mt-3 font-display text-3xl uppercase tracking-tight text-ink sm:text-4xl">
          {heading}
        </h1>
        {intro && <p className="mt-4 max-w-xl text-stone">{intro}</p>}
        {isJournal && <JournalNav className="mt-6 border-t border-ink/10 pt-5" />}
      </div>

      {entries.length === 0 ? (
        <p className="mt-10 font-mono text-sm text-stone/70">
          Nothing published here yet — add a markdown file to{" "}
          <code className="rounded bg-ink/10 px-1.5 py-0.5 text-xs">
            content/{section}
          </code>{" "}
          to see it appear.
        </p>
      ) : (
        <ul className="mt-10 space-y-5">
          {entries.map((entry) =>
            isJournal ? (
              <li key={entry.slug}>
                <JournalEntryCard entry={entry} />
              </li>
            ) : (
              <li key={entry.slug}>
                <Link
                  href={`/${section}/${entry.slug}`}
                  className={`${paperClass} corner-box group block rounded-xl border border-ink/15 bg-card px-7 py-6 transition-colors hover:border-ink/30 sm:px-9`}
                >
                  <h2 className="flex items-center gap-2 font-serif text-2xl text-ink transition-colors group-hover:text-accent">
                    <span>{entry.title}</span>
                  </h2>
                  {entry.date && (
                    <p className="mt-1 font-mono text-xs uppercase tracking-wide text-stone/60">
                      {formatDate(entry.date)}
                    </p>
                  )}
                  {entry.excerpt && (
                    <p className="mt-3 text-stone">{entry.excerpt}</p>
                  )}
                </Link>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
