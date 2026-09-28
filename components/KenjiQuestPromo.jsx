import Link from "next/link";

/**
 * The teaser/entry point for "Kenji's Quest: First Light" — the game's
 * key art, clean (no copy laid over it), with a small paper tag
 * "pulled down" from its bottom edge carrying the promotional copy in
 * the site's lore-styled type. Links to the full canon page at
 * app/kenji-quest. Rendered twice by the homepage via the `variant`
 * prop: once pinned in the left gutter next to the centered column on
 * wide desktop screens (right under the Listen Now tab), and once as a
 * normal block at the very bottom of the page on every narrower
 * breakpoint. Same banner either way.
 */
function QuestBanner() {
  return (
    <Link href="/kenji-quest" className="group block">
      <span className="corner-box relative block overflow-hidden rounded-xl border border-black/40 bg-black shadow-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kenji-quest-key-art.jpg"
          alt="Kenji's Quest: First Light — a lone samurai stands atop a jungle island over dark water, the game's title carved into the rock beneath him"
          className="block w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </span>

      {/* A small paper tag, pulled down out of the art below it —
          a short vertical "string" bridging the two, then the card
          itself carrying the copy the image used to. */}
      <span
        aria-hidden="true"
        className="mx-auto block h-3 w-px bg-black/30"
      />
      <span className="relative -mt-px block rotate-[-0.6deg] rounded-sm border border-black/10 bg-[#f4ecd8] px-4 pb-4 pt-3 text-center shadow-[0_10px_18px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:-translate-y-0.5">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-accent">
          Coming Soon
        </span>
        <span className="mt-1 block font-oldenglish text-xl leading-none text-[#3a2a16]">
          First Light
        </span>
        <span className="mx-auto mt-2 block max-w-[15rem] font-serif text-xs italic leading-snug text-stone">
          An Afro-Japanese traveler. An inherited blade. A fragmented
          scroll. Seven sacred stages across a forgotten island.
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
      <div className="pointer-events-none absolute right-full top-0 z-10 mr-8 hidden w-64 xl:block">
        <div className="pointer-events-auto">
          <QuestBanner />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-xs xl:hidden">
      <QuestBanner />
    </div>
  );
}
