import Link from "next/link";
import { formatDate } from "@/lib/content";
import EntryBadge from "@/components/EntryBadge";
import PaperClip from "@/components/PaperClip";
import ShareButton from "@/components/ShareButton";
import EssayArt from "@/components/EssayArt";
import VoiceClip from "@/components/VoiceClip";
import { getCoverColor } from "@/lib/seriesColors";
import { ESSAY_ART } from "@/lib/essayArt";
import { withDropCap } from "@/lib/dropCap";

export default function EntryPage({ section, backLabel, entry }) {
  const isJournal = section === "journal";
  const art = ESSAY_ART[entry.slug];
  const bodyHtml = isJournal ? withDropCap(entry.html) : entry.html;
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
          <ShareButton title={entry.title} className="top-6 right-5" />
        )}

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

        {art && <EssayArt src={art.src} alt={art.alt} rotate={art.rotate} />}

        {entry.slug === "the-difference" && (
          <div className="relative mx-auto my-8 max-w-xs overflow-hidden rounded-xl bg-gradient-to-b from-[#141414] to-black px-4 pb-4 pt-6">
            {/* A single downward spotlight beam — light only, nothing
                else in it — aimed from the top of the frame straight
                down onto him. A narrow-to-wide clipped trapezoid, blurred
                for a soft edge, fading out before it reaches the floor. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-44 w-40 -translate-x-1/2 [clip-path:polygon(44%_0%,56%_0%,98%_100%,2%_100%)] bg-gradient-to-b from-[rgba(255,248,222,0.75)] via-[rgba(255,248,222,0.22)] to-[rgba(255,248,222,0)] blur-[5px] sm:h-56 sm:w-48"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/journal-art/the-difference-solo.png"
              alt="The Add the Accent character standing alone under a single spotlight"
              className="relative z-10 mx-auto h-40 w-auto drop-shadow-[0_10px_16px_rgba(0,0,0,0.65)] sm:h-48"
            />
            <div className="relative z-10 mt-4">
              <VoiceClip
                src="/audio/the-difference-is-you.mp3"
                label="The difference is you"
              />
            </div>
          </div>
        )}

        <div
          className="prose prose-accent mt-10 font-serif text-lg"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {isJournal && (
          <div className="clear-both mt-8 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/leaf-end-mark.png"
              alt=""
              aria-hidden="true"
              className="h-14 w-auto opacity-90 drop-shadow-[0_5px_8px_rgba(0,0,0,0.4)]"
            />
          </div>
        )}
      </article>
    </div>
  );
}
