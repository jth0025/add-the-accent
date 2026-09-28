import Link from "next/link";

/**
 * The teaser/entry point for "Kenji's Quest: First Light" — styled like
 * one of the homepage's own Features boxes (the same notebook-line
 * corner-box frame, the image on top, a paper-textured card of copy
 * directly underneath) so it reads as part of the site's existing
 * visual language rather than a one-off widget.
 *
 * Rendered three times by the homepage via the `variant` prop, so
 * there's always exactly one visible instance at any width:
 *  - "rail": a narrow column parked in the left margin beside the
 *    centered content, right under the Listen Now tab — the original
 *    placement. This needs real, unclipped space to its left (the
 *    centered column is a fixed 768px), which only exists from xl
 *    (1280px) up, so it's the widest-screens-only version.
 *  - "top": the full-size card, in-flow, right under the Listen Now
 *    tab — for every width in between (tablet and ordinary desktop
 *    windows narrower than the rail needs).
 *  - "bottom": the same full-size card, in-flow, at the very end of
 *    the page — mobile only.
 */
function QuestBanner({ compact = false }) {
  return (
    <div
      className="corner-box overflow-hidden rounded-xl border border-black/30 shadow-lg"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, rgba(231,222,210,.08) 0, rgba(231,222,210,.08) 1px, transparent 1px, transparent 27px), linear-gradient(to right, transparent 0, transparent 34px, rgba(224,168,96,.4) 34px, rgba(224,168,96,.4) 35px, transparent 35px), linear-gradient(135deg, #b9724a 0%, #6b4028 55%, #3a2415 100%)",
        backgroundRepeat: "repeat, no-repeat, no-repeat",
      }}
    >
      <Link
        href="/kenji-quest"
        className="group relative block overflow-hidden"
        aria-label="Learn more about Kenji's Quest: First Light"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kenji-quest-key-art.jpg"
          alt="Kenji's Quest: First Light — a lone samurai stands atop a jungle island over dark water, the game's title carved into the rock beneath him"
          className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-[#e7ded2] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          Learn more &rarr;
        </span>
      </Link>
      <div
        className={`paper-notebook border-t border-ink/15 bg-white text-center ${
          compact ? "px-4 py-5" : "px-8 py-8 sm:px-10"
        }`}
      >
        <span
          className={`badge-glow block font-mono font-extrabold uppercase tracking-[0.15em] text-[#af691e] ${
            compact ? "text-xs" : "text-base"
          }`}
        >
          Coming Soon
        </span>
        <p
          className={`mt-2 font-cinema uppercase tracking-wide text-ink ${
            compact ? "text-[10px]" : "text-sm"
          }`}
        >
          Kenji&rsquo;s Quest
        </p>
        <p
          className={`title-glow -mt-1 font-oldenglish leading-tight text-[#8a4412] ${
            compact ? "text-xl" : "text-4xl"
          }`}
        >
          First Light
        </p>
        <p
          className={`mx-auto mt-2 font-serif italic leading-relaxed text-stone ${
            compact ? "text-[11px]" : "mt-3 max-w-sm text-sm"
          }`}
        >
          An interactive adventure inspired by the stories of Add the
          Accent.
          <br />
          One traveler. Seven sacred stages. A world waiting to be
          explored.
        </p>
        <Link
          href="/kenji-quest"
          className={`group/btn mt-4 inline-flex items-center gap-2 rounded-full bg-accent font-mono font-bold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-[1.03] ${
            compact ? "px-3 py-1.5 text-[9px]" : "px-4 py-2 text-[11px]"
          }`}
        >
          Learn More
          <span aria-hidden="true" className="transition-transform duration-200 group-hover/btn:translate-x-0.5">
            &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function KenjiQuestPromo({ variant }) {
  if (variant === "rail") {
    return (
      <div className="pointer-events-none absolute right-full top-0 z-10 mr-4 hidden w-48 xl:block">
        <div className="pointer-events-auto">
          <QuestBanner compact />
        </div>
      </div>
    );
  }

  if (variant === "top") {
    return (
      <div className="mx-auto mb-10 hidden max-w-sm md:block xl:hidden">
        <QuestBanner />
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-sm md:hidden">
      <QuestBanner />
    </div>
  );
}
