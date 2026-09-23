import Link from "next/link";

export const metadata = {
  title: "Kenji's Quest — Add the Accent",
  description:
    "A Zelda-inspired adventure through myth and jungle, built on the Kenji mythology from the Domain Expansion series — in early development.",
};

function SectionLabel({ children }) {
  return (
    <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-[#d9a441]">
      <span className="h-px w-8 bg-[#d9a441]/40" />
      <span>{children}</span>
      <span className="h-px w-8 bg-[#d9a441]/40" />
    </div>
  );
}

export default function KenjiQuestPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent hover:underline"
      >
        &larr; Add the Accent
      </Link>

      {/* Hero */}
      <section
        className="corner-box relative overflow-hidden rounded-xl border border-black/40 px-7 py-14 text-center shadow-xl sm:px-10 sm:py-20"
        style={{
          background:
            "linear-gradient(160deg, #16241a 0%, #1c2f1e 35%, #2a2312 70%, #1a1409 100%)",
        }}
      >
        {/* Clouds drifting over the canopy. */}
        <svg aria-hidden="true" viewBox="0 0 64 40" className="pointer-events-none absolute left-8 top-8 h-8 w-14 text-white/40 [filter:url(#urban-sketch)] sm:left-14">
          <rect x="10" y="18" width="44" height="12" rx="6" fill="currentColor" />
          <ellipse cx="20" cy="18" rx="12" ry="10" fill="currentColor" />
          <ellipse cx="36" cy="13" rx="15" ry="12" fill="currentColor" />
          <ellipse cx="49" cy="18" rx="11" ry="9" fill="currentColor" />
        </svg>
        <svg aria-hidden="true" viewBox="0 0 64 40" className="pointer-events-none absolute right-10 top-16 h-5 w-9 text-white/25 [filter:url(#urban-sketch)] sm:right-16">
          <rect x="10" y="18" width="44" height="12" rx="6" fill="currentColor" />
          <ellipse cx="20" cy="18" rx="12" ry="10" fill="currentColor" />
          <ellipse cx="36" cy="13" rx="15" ry="12" fill="currentColor" />
          <ellipse cx="49" cy="18" rx="11" ry="9" fill="currentColor" />
        </svg>

        <SectionLabel>In Development</SectionLabel>

        <h1 className="mt-4 font-cinema text-4xl uppercase tracking-wide text-[#f6e0bd] sm:text-6xl">
          Kenji&rsquo;s Quest
        </h1>
        <p className="mx-auto mt-4 max-w-lg font-serif text-lg italic leading-snug text-[#e7ded2]/90 sm:text-xl">
          A lone samurai. A forbidden relic. A jungle that remembers
          everything &mdash; and forgives no one who enters unprepared.
        </p>

        <div className="relative mx-auto mt-8 w-48 sm:w-56">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 -bottom-2 h-4 rounded-[50%] bg-black/70 blur-[6px]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kenji-standing.png"
            alt="Kenji, a lone black samurai in carved wood and gold armor, standing ready with two blades"
            className="relative w-full drop-shadow-[0_16px_18px_rgba(0,0,0,0.4)]"
          />
        </div>
      </section>

      {/* The last of his line */}
      <section className="paper-journal-dark corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10">
        <SectionLabel>The Last of His Line</SectionLabel>
        <h2 className="mx-auto mt-3 max-w-lg text-center font-playfair text-2xl italic text-ink sm:text-3xl">
          A tribe rich in tradition. A legacy of one.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-stone">
          Long before the maps we know, a tribe of warrior-monks kept watch
          over a stretch of tropical terrain no outsider was permitted to
          enter &mdash; a place of towering canopy, winding rivers, and
          trials passed down like scripture. Kenji is the last of them. Not
          the strongest who ever trained under that canopy, and not the
          wisest &mdash; only the one still standing when the others were
          not.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          He carries what&rsquo;s left of that legacy alone: the forms, the
          discipline, the quiet, and the debt every survivor owes to
          everyone who didn&rsquo;t make it. Somewhere deeper in that
          terrain, past trials no living person has completed, waits the
          one relic his tribe was sworn to protect &mdash; and never
          permitted to claim for themselves.
        </p>
      </section>

      {/* The treasure */}
      <section
        className="corner-box mt-8 rounded-xl border border-black/30 px-7 py-10 text-center text-[#e7ded2] shadow-lg sm:px-10"
        style={{
          background: "linear-gradient(135deg, #b9724a 0%, #6b4028 55%, #3a2415 100%)",
        }}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-[#f6e0bd]/80">
          What Kenji Seeks
        </p>
        <p className="gold-foil gold-plate mt-1 font-oldenglish text-4xl leading-none sm:text-5xl">
          The Relic
        </p>
        <p className="mx-auto mt-5 max-w-lg text-[#e7ded2]/90">
          Every account says the same thing: a gem, uncut, warm to the
          touch, said to grant whoever holds it a power beyond swordsmanship
          or strength. Kenji believes it too &mdash; it&rsquo;s the only
          reason a man this disciplined would risk a path this dangerous.
        </p>
        <p className="mx-auto mt-4 max-w-lg font-serif italic text-[#f6e0bd]">
          But every trial his tribe ever set was designed to teach, not to
          test strength. And no one who has completed them has ever come
          back describing a stone.
        </p>
        <p className="mx-auto mt-4 max-w-lg text-[#e7ded2]/90">
          What waits at the end of the path is not treasure in any hand you
          could close around it &mdash; it is awareness undivided, wisdom
          without ego, and the particular kind of fearlessness that only
          comes from already having faced the worst version of yourself.
          Kenji doesn&rsquo;t know that yet. That&rsquo;s the point.
        </p>
      </section>

      {/* The trials */}
      <section className="paper-journal corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 text-center sm:px-10">
        <SectionLabel>The Trials</SectionLabel>
        <h2 className="mx-auto mt-3 max-w-lg font-playfair text-2xl italic text-ink sm:text-3xl">
          Every trial is a door. Every answer is a direction.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-stone">
          Kenji&rsquo;s Quest plays like the adventures that raised
          us &mdash; a long path, real danger, and a world worth getting
          lost in &mdash; but the trials standing between Kenji and the
          relic aren&rsquo;t fights. They&rsquo;re riddles, ciphers, and
          crossword-style word trials built from the same discussion pieces
          running through the essays and the series here: presence,
          discipline, self-awareness, the difference between who you are
          and who you were told to be.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          Complete a round, and the terrain answers back &mdash; a path
          opens, a landmark reveals itself, the jungle points you one step
          closer to the forbidden place at the center of the map.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-lg border border-ink/15 bg-white/60 p-6 text-left">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
            First Trial &mdash; A Taste
          </p>
          <p className="mt-2 font-serif italic leading-snug text-ink">
            &ldquo;Every warrior who has ever searched for me already
            carries me. I cannot be stolen, only forgotten. What am
            I?&rdquo;
          </p>
          <details className="mt-3 group">
            <summary className="cursor-pointer font-mono text-xs font-bold uppercase tracking-widest text-accent hover:underline">
              Reveal the answer
            </summary>
            <p className="mt-2 text-sm text-stone">
              Awareness &mdash; the thing Kenji is already looking for, and
              already has.
            </p>
          </details>
        </div>
      </section>

      {/* Status / notify */}
      <section className="paper-fold-quarters corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 text-center sm:px-10">
        <SectionLabel>Right Now</SectionLabel>
        <p className="mx-auto mt-4 max-w-md font-playfair text-xl italic text-ink sm:text-2xl">
          The path is still being cleared.
        </p>
        <p className="mx-auto mt-3 max-w-md text-stone">
          Kenji&rsquo;s Quest is early in development &mdash; the world,
          the trials, and the terrain are all still being built out. The
          riddle above is a first taste of what&rsquo;s coming, not the
          whole game.
        </p>
        <p className="mx-auto mt-3 max-w-md text-stone">
          Accent Notes is where it&rsquo;ll be announced first &mdash; sign
          up on the{" "}
          <Link href="/work-with-me" className="text-accent hover:underline">
            Work With Me
          </Link>{" "}
          page, or keep an eye on the{" "}
          <Link href="/journal" className="text-accent hover:underline">
            Journal
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
