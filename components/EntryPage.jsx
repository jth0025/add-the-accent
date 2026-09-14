import Link from "next/link";
import { formatDate } from "@/lib/content";
import EntryBadge from "@/components/EntryBadge";
import PaperClip from "@/components/PaperClip";
import { getCoverColor } from "@/lib/seriesColors";

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

      <article
        className={`${paperClass} corner-box relative mt-6 rounded-xl border border-ink/15 bg-card px-7 py-9 sm:px-10 ${isJournal ? "[perspective:1600px]" : ""}`}
      >
        {isJournal && <PaperClip />}

        {isJournal && (
          // Fixed height (not inset-0/full article height) so the label
          // stays centered in view even on a long essay — the cover only
          // needs to hide the title block it swings away from, not the
          // entire scroll length of the piece.
          <div
            aria-hidden="true"
            className="book-cover-reveal book-cover pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[420px] items-center justify-center overflow-hidden rounded-t-xl border border-black/30 sm:h-[460px]"
            style={{ "--book-color": getCoverColor(entry) }}
          >
            <span className="book-spine" />
            <span className="book-pages-edge" />
            <span className="book-pages-edge-top" />
            <span className="book-pages-edge-bottom" />
            <div className="paper-journal relative w-[80%] -rotate-1 rounded-[3px] border border-ink/25 bg-[#efe6d3] px-5 py-5 text-center shadow-[0_6px_14px_rgba(0,0,0,0.4)]">
              <EntryBadge entry={entry} className="mx-auto w-fit" />
              <p className="mt-1 flex items-center justify-center gap-2 font-serif text-lg text-ink sm:text-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/pencil-icon.png"
                  alt=""
                  className="h-[1em] w-auto shrink-0"
                />
                {entry.titleHtml ? (
                  <span dangerouslySetInnerHTML={{ __html: entry.titleHtml }} />
                ) : (
                  <span>{entry.title}</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* A couple of blank ruled leaves between the cover and the
            essay — each swings open on the same hinge as the cover, but
            later, so flipping past the cover passes a page or two
            before landing on the actual entry (see .book-page-flip). */}
        {isJournal && (
          <div
            aria-hidden="true"
            className="book-page-flip paper-notebook pointer-events-none absolute inset-x-0 top-0 z-[15] h-[420px] rounded-t-xl border border-ink/10 bg-[#f7f2e6] sm:h-[460px]"
            style={{ "--flip-delay": "1050ms" }}
          />
        )}
        {isJournal && (
          <div
            aria-hidden="true"
            className="book-page-flip paper-notebook pointer-events-none absolute inset-x-0 top-0 z-[14] h-[420px] rounded-t-xl border border-ink/10 bg-[#f7f2e6] sm:h-[460px]"
            style={{ "--flip-delay": "1550ms" }}
          />
        )}

        <div
          className={`flex items-center gap-3 font-mono text-xs uppercase tracking-widest ${tagTextClass}`}
        >
          <span>{isJournal ? "Section 02" : "Section 01"}</span>
          <span className={`h-px flex-1 ${tagRuleClass}`} />
        </div>

        {isJournal && <EntryBadge entry={entry} className="mt-4 block w-fit" />}

        <h1 className="mt-4 font-serif text-4xl leading-tight text-ink">
          {entry.titleHtml ? (
            <span dangerouslySetInnerHTML={{ __html: entry.titleHtml }} />
          ) : (
            entry.title
          )}
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
