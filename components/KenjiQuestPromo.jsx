import Link from "next/link";

/**
 * The teaser/entry point for "Kenji's Quest: First Light" — the game's
 * key art, clean (no copy laid over it), with a small paper tag
 * "pulled down" from its bottom edge carrying the promotional copy in
 * the site's lore-styled type. Links to the full canon page at
 * app/kenji-quest. Rendered twice by the homepage via the `variant`
 * prop: once pinned in the left gutter next to the centered column
 * (only once the viewport is wide enough that the gutter has real,
 * unclipped room to sit in — see the 2xl breakpoint below), and once
 * as a normal block at the very bottom of the page on every narrower
 * breakpoint, including ordinary desktop windows. Same banner either
 * way.
 */
function QuestBanner() {
  return (
    <Link href="/kenji-quest" className="group block">
      <span className="corner-box relative mx-auto block w-40 overflow-hidden rounded-xl border border-black/40 bg-black shadow-xl sm:w-48">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kenji-quest-key-art.jpg"
          alt="Kenji's Quest: First Light — a lone samurai stands atop a jungle island over dark water, the game's title carved into the rock beneath him"
          className="block h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </span>

      {/* A small paper tag, pulled down out of the art above it — a
          short vertical "string" bridging the two, then the card
          itself carrying the copy the image used to. */}
      <span aria-hidden="true" className="mx-auto block h-3 w-px bg-black/30" />
      <span className="relative -mt-px block rotate-[-0.6deg] rounded-sm border border-black/10 bg-[#f4ecd8] px-4 pb-4 pt-3 text-center shadow-[0_10px_18px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:-translate-y-0.5">
        <span className="badge-glow block font-mono text-base font-extrabold uppercase tracking-[0.15em] text-[#af691e]">
          Coming Soon
        </span>
        <span className="mt-2 block font-cinema text-sm uppercase tracking-wide text-[#3a2a16]">
          Kenji&rsquo;s Quest
        </span>
        <span className="title-glow -mt-0.5 block font-oldenglish text-3xl leading-tight text-[#8a4412]">
          First Light
        </span>
        <span className="mx-auto mt-2 block max-w-[15rem] font-serif text-xs italic leading-relaxed text-stone">
          An interactive adventure inspired by the stories of Add the Accent.
          <br />
          One traveler. Seven sacred stages. A world waiting to be explored.
        </span>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-transform group-hover:scale-[1.03]">
          Learn More
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
            &rarr;
          </span>
        </span>
      </span>
    </Link>
  );
}

export default function KenjiQuestPromo({ variant }) {
  if (variant === "gutter") {
    return (
      <div className="pointer-events-none absolute right-full top-0 z-10 mr-6 hidden w-48 2xl:block">
        <div className="pointer-events-auto">
          <QuestBanner />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-[13rem] 2xl:hidden">
      <QuestBanner />
    </div>
  );
}
