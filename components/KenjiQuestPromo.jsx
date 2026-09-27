import Link from "next/link";

/**
 * The teaser/entry point for "Kenji's Quest" — a "coming soon" banner
 * built around the game's own key art, linking to the lore/landing page
 * (app/kenji-quest). Rendered twice by the homepage via the `variant`
 * prop: once pinned in the left gutter next to the centered column on
 * wide desktop screens (where there's real margin to work with, right
 * under the Listen Now tab), and once as a normal block at the very
 * bottom of the page on every narrower breakpoint. Same banner either
 * way.
 */
function QuestBanner() {
  return (
    <Link
      href="/kenji-quest"
      className="group corner-box relative block overflow-hidden rounded-xl border border-black/40 bg-black shadow-xl transition-transform duration-300 hover:-translate-y-0.5"
    >
      <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-[#4a0f16] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#f6e0bd] shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
        Coming Soon
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/kenji-quest-key-art.jpg"
        alt="Kenji's Quest — a lone samurai stands atop a jungle island over dark water, the game's title carved into the rock beneath him"
        className="block w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-12">
        <p className="font-serif text-xs italic leading-snug text-[#e7ded2]/90">
          A lone samurai. A forbidden relic. A jungle that remembers
          everything.
        </p>
        <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-white shadow-lg transition-transform group-hover:scale-[1.03]">
          Learn More
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
            &rarr;
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function KenjiQuestPromo({ variant }) {
  if (variant === "gutter") {
    return (
      <div
        className="pointer-events-none absolute right-full top-0 z-10 mr-8 hidden w-64 xl:block"
      >
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
