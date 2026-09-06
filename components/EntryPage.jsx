import Link from "next/link";
import { formatDate } from "@/lib/content";
import EntryBadge from "@/components/EntryBadge";
import PaperClip from "@/components/PaperClip";

export default function EntryPage({ section, backLabel, entry }) {
  const isJournal = section === "journal";
  const tagTextClass = isJournal ? "text-moss" : "text-accent";
  const tagRuleClass = isJournal ? "bg-moss/40" : "bg-accent/40";
  // Journal boxes read as crinkled paper; everything else keeps its own mood.
  const paperClass = isJournal ? "paper-crinkled" : "paper-newspaper";

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href={`/${section}`}
        className={`font-mono text-xs uppercase tracking-widest ${tagTextClass} hover:underline`}
      >
        ← {backLabel}
      </Link>

      <article className={`${paperClass} corner-box relative mt-6 rounded-xl border border-ink/15 bg-card px-7 py-9 sm:px-10`}>
        {isJournal && <PaperClip />}
        <div
          className={`flex items-center gap-3 font-mono text-xs uppercase tracking-widest ${tagTextClass}`}
        >
          <span>{isJournal ? "Section 02" : "Section 01"}</span>
          <span className={`h-px flex-1 ${tagRuleClass}`} />
        </div>

        {isJournal && <EntryBadge entry={entry} className="mt-4 block w-fit" />}

        <h1 className="mt-4 font-serif text-4xl leading-tight text-ink">
          {entry.title}
        </h1>
        {entry.date && (
          <p className="mt-3 font-mono text-xs uppercase tracking-wide text-stone/60">
            {formatDate(entry.date)}
          </p>
        )}

        <div
          className="prose prose-accent mt-10 font-serif text-lg"
          dangerouslySetInnerHTML={{ __html: entry.html }}
        />
      </article>
    </div>
  );
}
