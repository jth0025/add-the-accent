import Link from "next/link";

/**
 * The teaser/entry point for "Kenji's Quest: First Light" — styled like
 * one of the homepage's own Features boxes (the same notebook-line
 * corner-box frame, the image on top, a paper-textured card of copy
 * directly underneath) so it reads as part of the site's existing
 * visual language rather than a one-off widget. Rendered twice by the
 * homepage via the `variant` prop: once near the top of the page,
 * right under the Listen Now tab, on desktop/tablet widths; once at
 * the very bottom of the page on mobile. Same card either way — only
 * the position changes.
 */
function QuestBanner() {
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
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#e7ded2] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          Learn more &rarr;
        </span>
      </Link>
      <div className="paper-notebook border-t border-ink/15 bg-white px-8 py-8 text-center sm:px-10">
        <span className="badge-glow font-mono text-base font-extrabold uppercase tracking-[0.15em] text-[#af691e]">
          Coming Soon
        </span>
        <p className="mt-2 font-cinema text-sm uppercase tracking-wide text-ink">
          Kenji&rsquo;s Quest
        </p>
        <p className="title-glow -mt-1 font-oldenglish text-4xl leading-tight text-[#8a4412]">
          First Light
        </p>
        <p className="mx-auto mt-3 max-w-sm font-serif text-sm italic leading-relaxed text-stone">
          An interactive adventure inspired by the stories of Add the
          Accent.
          <br />
          One traveler. Seven sacred stages. A world waiting to be
          explored.
        </p>
        <Link
          href="/kenji-quest"
          className="group/btn mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-[1.03]"
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
  if (variant === "top") {
    return (
      <div className="mx-auto mb-10 hidden max-w-sm md:block">
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
