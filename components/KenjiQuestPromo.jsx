import Link from "next/link";

/**
 * The teaser/entry point for "Kenji's Quest" — a promo card for the
 * adventure-game concept built out of the same Kenji mythology already
 * seeded in the Domain Expansion feature copy on this page (the black
 * samurai in pursuit of a distant treasure). Rendered twice by the
 * homepage via the `variant` prop: once pinned in the left gutter next
 * to the centered column on wide desktop screens (where there's real
 * margin to work with), and once as a normal block at the very bottom
 * of the page on every narrower breakpoint. Same card either way.
 */
function QuestCard() {
  return (
    <Link
      href="/kenji-quest"
      className="corner-box group relative block overflow-hidden rounded-xl border border-black/40 text-center shadow-xl transition-transform duration-300 hover:-translate-y-0.5"
      style={{
        background:
          "linear-gradient(160deg, #16241a 0%, #1c2f1e 35%, #2a2312 70%, #1a1409 100%)",
      }}
    >
      {/* A couple of hand-sketched clouds drifting over the canopy. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 64 40"
        className="pointer-events-none absolute left-4 top-3 h-6 w-10 text-white/50 [filter:url(#urban-sketch)]"
      >
        <rect x="10" y="18" width="44" height="12" rx="6" fill="currentColor" />
        <ellipse cx="20" cy="18" rx="12" ry="10" fill="currentColor" />
        <ellipse cx="36" cy="13" rx="15" ry="12" fill="currentColor" />
        <ellipse cx="49" cy="18" rx="11" ry="9" fill="currentColor" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 64 40"
        className="pointer-events-none absolute right-6 top-8 h-4 w-7 text-white/30 [filter:url(#urban-sketch)]"
      >
        <rect x="10" y="18" width="44" height="12" rx="6" fill="currentColor" />
        <ellipse cx="20" cy="18" rx="12" ry="10" fill="currentColor" />
        <ellipse cx="36" cy="13" rx="15" ry="12" fill="currentColor" />
        <ellipse cx="49" cy="18" rx="11" ry="9" fill="currentColor" />
      </svg>

      {/* Crossed blades — the danger, tucked in the opposite corner from
          the clouds so the card reads "sky above, threat below." */}
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        className="pointer-events-none absolute bottom-3 left-3 h-7 w-7 text-[#e7ded2]/40 [filter:url(#urban-sketch)]"
      >
        <path d="M6 6 L34 34 M30 34 L34 34 L34 30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M34 6 L6 34 M10 34 L6 34 L6 30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="relative px-5 pb-6 pt-6 sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d9a441]/90">
          A New Adventure
        </p>

        <h3 className="mt-1.5 font-cinema text-2xl uppercase tracking-wide text-[#f6e0bd] sm:text-3xl">
          Kenji&rsquo;s Quest
        </h3>

        {/* The winding jungle path piece, doing double duty as the
            card's hero art — already exactly the "long path through
            tropical terrain" the game is about. */}
        <div className="relative mx-auto mt-4 w-36 sm:w-40">
          <span
            aria-hidden="true"
            className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#d9a441] bg-[#1a1409] shadow-[0_3px_8px_rgba(0,0,0,0.5)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kenji-avatar.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full rounded-full object-cover"
            />
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/quest-path.png"
            alt=""
            className="w-full object-contain opacity-95 transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>

        <p className="mx-auto mt-4 max-w-[15rem] font-serif text-sm italic leading-snug text-[#e7ded2]/85">
          A lone samurai. A forbidden relic. A jungle that remembers
          everything.
        </p>

        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-white shadow-lg transition-transform group-hover:scale-[1.03]">
          Begin the Quest
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
        className="pointer-events-none absolute right-full top-0 z-10 mr-8 hidden w-60 xl:block"
        aria-hidden="false"
      >
        <div className="pointer-events-auto">
          <QuestCard />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-xs xl:hidden">
      <QuestCard />
    </div>
  );
}
