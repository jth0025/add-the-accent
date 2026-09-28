import Link from "next/link";

export const metadata = {
  title: "Kenji's Quest: First Light — Add the Accent",
  description:
    "A story-driven pilgrimage across the Kuroshio Reach, built on the Kenji mythology from the Domain Expansion series — in development.",
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

// The seven sacred stages, in order — titles and locations from canon,
// with evocative, spoiler-safe descriptions. Deliberately not labeled
// "Day 1" through "Day 7": those are production shorthand, not
// in-world language.
const STAGES = [
  {
    numeral: "I",
    title: "The Inheritance",
    location: "The Empty Room",
    body: "A ruined room, dust, and one beam of window light — until it catches an old blade and a fragment of scroll waiting exactly where they shouldn't be.",
    thematic: "Loss becomes instruction. An empty place can still contain an inheritance.",
  },
  {
    numeral: "II",
    title: "The Warden City",
    location: "Kosei",
    body: "A guarded city of bridges and terraces, where Kenji's name and his fallen house earn him more questions than welcome.",
    thematic: "Discipline is visible in what one chooses not to do.",
  },
  {
    numeral: "III",
    title: "The Naming Grove",
    location: "The Ancient Grove",
    body: "A sacred forest of carved trees and ritual sound, where a flute and an old family rhythm are the only keys that fit.",
    thematic: "A name is not only what others call you. It's what you agree to carry.",
  },
  {
    numeral: "IV",
    title: "Nest Cliffs",
    location: "The Cliffs & the Mirror Tower",
    body: "High winds, nesting birds, and a mirrored tower where an inherited blade turns out to catch more than light.",
    thematic: "Inheritance becomes useful only when it's understood.",
  },
  {
    numeral: "V",
    title: "Wall of Waves",
    location: "The Hidden Water Gate",
    body: "A concealed wall found only by those paying attention, and a cave behind the falling water where something ancient stirs and is never fully seen.",
    thematic: "The unknown doesn't always need to be conquered to be passed.",
  },
  {
    numeral: "VI",
    title: "Broken Passage",
    location: "The Fractured Bridge",
    body: "A road broken under gathering gloom, where the figures who have been watching Kenji's journey finally stop watching.",
    thematic: "The road breaks where unresolved histories meet.",
  },
  {
    numeral: "VII",
    title: "First Light",
    location: "The Door of Light",
    body: "A jungle sanctuary built around a narrow, luminous door — the destination named by the scroll, and the last question Kenji has to answer.",
    thematic: "The final threshold asks what Kenji will make from what he's carried.",
  },
];

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
        <p className="mx-auto mt-1 font-oldenglish text-2xl text-[#d9a441] sm:text-3xl">
          First Light
        </p>
        <p className="mx-auto mt-4 max-w-lg font-serif text-lg italic leading-snug text-[#e7ded2]/90 sm:text-xl">
          A pilgrimage through memory, mystery, and light.
        </p>

        <div className="relative mx-auto mt-8 w-48 sm:w-56">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 -bottom-2 h-4 rounded-[50%] bg-black/70 blur-[6px]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kenji-standing.png"
            alt="Kenji, a lone Afro-Japanese traveler in carved wood and gold armor, standing ready with a sheathed blade"
            className="relative w-full drop-shadow-[0_16px_18px_rgba(0,0,0,0.4)]"
          />
        </div>
      </section>

      {/* The quest */}
      <section className="paper-journal-dark corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10">
        <SectionLabel>The Quest</SectionLabel>
        <h2 className="mx-auto mt-3 max-w-lg text-center font-playfair text-2xl italic text-ink sm:text-3xl">
          Every road home starts with a reason to leave.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-stone">
          Kenji&rsquo;s Quest: First Light follows a young Afro-Japanese
          traveler raised by House Mizuhara after tragedy claimed his birth
          family. When an inherited blade and a fragmented scroll surface in
          the ruins of an empty room, he sets out across the Kuroshio Reach
          &mdash; a forgotten world of island terrain, coastal ruins, and
          half-remembered ceremony &mdash; toward a destination the scroll
          calls only First Light.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          Along the way, Kenji encounters wandering monks, coastal traders,
          rival travelers, and older, more dangerous forces drawn by rumors
          of what he carries. Someone among them already seems to know more
          about his inheritance than he does.
        </p>
        <p className="mx-auto mt-4 max-w-xl font-serif italic text-ink/80">
          This isn&rsquo;t a hunt for treasure. It&rsquo;s a pilgrimage
          &mdash; seven sacred stages, each one asking something of Kenji
          before it lets him pass.
        </p>
      </section>

      {/* Enter the Kuroshio Reach */}
      <section className="corner-box mt-8 overflow-hidden rounded-xl border border-ink/15 bg-card sm:px-0">
        <div className="grid gap-0 sm:grid-cols-[1fr,1.1fr]">
          <div className="flex flex-col justify-center px-7 py-10 sm:px-10">
            <SectionLabel>Enter the Kuroshio Reach</SectionLabel>
            <h2 className="mt-3 font-playfair text-2xl italic text-ink sm:text-3xl">
              A world that remembers what people forget.
            </h2>
            <p className="mt-4 text-stone">
              The Kuroshio Reach is a scattered, half-drowned world of jungle
              ruins, guarded cities, cliffside nests, and old water routes
              &mdash; the kind of place where a season, a bridge, or a
              ceremony has been doing the same quiet work for longer than
              anyone alive has been watching.
            </p>
            <p className="mt-4 text-stone">
              It isn&rsquo;t empty. It&rsquo;s inhabited &mdash; by monks,
              traders, wardens, and travelers going about lives that existed
              long before Kenji arrived, and will go on long after he
              leaves.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/quest-path.png"
            alt="A hand-drawn map of a winding path through jungle island terrain"
            className="h-64 w-full object-cover sm:h-full"
          />
        </div>
      </section>

      {/* Meet Kenji */}
      <section className="paper-journal corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10">
        <SectionLabel>Meet Kenji</SectionLabel>
        <div className="mt-6 grid gap-8 sm:grid-cols-[auto,1fr] sm:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kenji-meditating.png"
            alt="Kenji seated in quiet meditation, a butterfly nearby"
            className="mx-auto w-40 drop-shadow-[0_10px_14px_rgba(0,0,0,0.25)] sm:w-48"
          />
          <div>
            <p className="text-stone">
              Kenji is quiet, deliberate, and slow to anger &mdash; the
              product of a childhood spent inside House Mizuhara&rsquo;s
              discipline, not the birth clan he barely remembers. He listens
              more than he speaks, watches before he acts, and carries
              himself like someone who was taught, early, exactly what
              restraint costs and what it protects.
            </p>
            <p className="mt-4 text-sm font-mono uppercase tracking-widest text-accent">
              Carries
            </p>
            <ul className="mt-2 space-y-1.5 text-stone">
              <li>An inherited blade, seldom drawn</li>
              <li>A scroll, fragmented and still unfolding</li>
              <li>A single, recurring butterfly &mdash; more guide than pet</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What you'll do */}
      <section className="corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 text-center sm:px-10">
        <SectionLabel>What You&rsquo;ll Do</SectionLabel>
        <h2 className="mx-auto mt-3 max-w-lg font-playfair text-2xl italic text-ink sm:text-3xl">
          Every trial is a door. Every answer is a direction.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-stone">
          Kenji&rsquo;s Quest plays like the adventures that raised us
          &mdash; a long path, real atmosphere, and a world worth getting
          lost in &mdash; but combat is never the point. Each sacred stage is
          built around observation, memory, restraint, and exploration
          instead: puzzles, ceremonies, and terrain that answer back once
          you&rsquo;ve actually understood them, not just walked through
          them.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          Solve what a stage is asking, and the world opens &mdash; a gate
          gives way, a path is revealed, a name is finally spoken correctly.
          Every mechanic is meant to feel native to the place it happens in,
          not bolted on.
        </p>
      </section>

      {/* The path */}
      <section className="mt-8">
        <div className="mb-6 text-center">
          <SectionLabel>The Path</SectionLabel>
          <h2 className="mx-auto mt-3 max-w-lg font-playfair text-2xl italic text-ink sm:text-3xl">
            Seven sacred stages across the Reach.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {STAGES.map((stage) => (
            <div
              key={stage.numeral}
              className="corner-box rounded-xl border border-ink/15 bg-card px-6 py-6"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-cinema text-2xl text-accent">
                  {stage.numeral}
                </span>
                <div>
                  <p className="font-playfair text-lg italic text-ink">
                    {stage.title}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-stone/70">
                    {stage.location}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-stone">{stage.body}</p>
              <p className="mt-3 font-serif text-sm italic text-ink/70">
                {stage.thematic}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The lore */}
      <section
        className="corner-box mt-8 rounded-xl border border-black/30 px-7 py-10 text-[#e7ded2] shadow-lg sm:px-10"
        style={{
          background: "linear-gradient(135deg, #2a3a2c 0%, #1c2618 55%, #14140b 100%)",
        }}
      >
        <SectionLabel>The Lore</SectionLabel>

        <div className="mx-auto mt-8 max-w-xl space-y-8">
          <div>
            <p className="gold-foil gold-plate font-oldenglish text-2xl leading-none">
              House Mizuhara
            </p>
            <p className="mt-2 text-[#e7ded2]/90">
              The house that raised Kenji, bound by a simple creed &mdash;
              what is carried lives. Its emblem is a reed bent over three
              ripples: patience, water, and continuity. Its traditions run
              through listening, breath and timing, wayfinding by water,
              and restoration &mdash; the same discipline visible in
              everything Kenji does.
            </p>
          </div>

          <div>
            <p className="gold-foil gold-plate font-oldenglish text-2xl leading-none">
              Hikariwake
            </p>
            <p className="mt-2 text-[#e7ded2]/90">
              The blade Kenji inherited &mdash; older than the swordforms
              built around it, and rarely drawn. It isn&rsquo;t a trophy.
              It&rsquo;s a responsibility that happens to have an edge.
            </p>
          </div>

          <div>
            <p className="gold-foil gold-plate font-oldenglish text-2xl leading-none">
              The Butterfly
            </p>
            <p className="mt-2 text-[#e7ded2]/90">
              Small, luminous, and never far &mdash; a presence tied to
              memory and to the mother Kenji barely knew. It doesn&rsquo;t
              explain itself. It just tends to appear exactly when Kenji
              needs to slow down.
            </p>
          </div>

          <div>
            <p className="gold-foil gold-plate font-oldenglish text-2xl leading-none">
              The Ashara
            </p>
            <p className="mt-2 text-[#e7ded2]/90">
              Scattered exiles, oath-breakers, and practitioners of
              forbidden craft, drawn from every corner of the Reach &mdash;
              not a kingdom or an army, but a loose and growing network,
              increasingly organized around the promise of a kind of light
              found through darkness. They&rsquo;ve started paying close
              attention to Kenji.
            </p>
          </div>

          <div>
            <p className="gold-foil gold-plate font-oldenglish text-2xl leading-none">
              A Lost Birth Clan
            </p>
            <p className="mt-2 text-[#e7ded2]/90">
              Kenji&rsquo;s birth family belonged to an ancient
              Afro-Japanese house devoted to light and agreement &mdash;
              discipline, wisdom, and a martial tradition built around
              mediation, not conquest. It didn&rsquo;t fall to any outside
              army. It came apart from within, and Kenji doesn&rsquo;t
              remember enough of it to say why. Its name, for now, stays
              unspoken.
            </p>
          </div>
        </div>
      </section>

      {/* Signals & symbols */}
      <section className="paper-fold-thirds corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10">
        <SectionLabel>Signals &amp; Symbols</SectionLabel>
        <p className="mx-auto mt-4 max-w-xl text-center text-stone">
          A few marks worth watching for &mdash; on banners, in ruins, and
          carried by the people Kenji meets.
        </p>
        <dl className="mx-auto mt-8 max-w-xl space-y-5">
          <div className="flex gap-4">
            <dt className="w-40 shrink-0 font-mono text-xs uppercase tracking-widest text-accent">
              Reed &amp; Three Ripples
            </dt>
            <dd className="text-stone">House Mizuhara&rsquo;s emblem &mdash; patience, water, continuity.</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-40 shrink-0 font-mono text-xs uppercase tracking-widest text-accent">
              The Ancient Agreement
            </dt>
            <dd className="text-stone">A mark tied to Kenji&rsquo;s deeper, still-unspoken heritage.</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-40 shrink-0 font-mono text-xs uppercase tracking-widest text-accent">
              The Butterfly
            </dt>
            <dd className="text-stone">Small and luminous, always somewhere near the edges of uncertainty.</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-40 shrink-0 font-mono text-xs uppercase tracking-widest text-accent">
              The Nami-Kai Mark
            </dt>
            <dd className="text-stone">Cut into stone behind the Wall of Waves &mdash; old, and best left undisturbed.</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-40 shrink-0 font-mono text-xs uppercase tracking-widest text-accent">
              Light
            </dt>
            <dd className="text-stone">Narrow, architectural, deliberate &mdash; never simply decorative.</dd>
          </div>
        </dl>
      </section>

      {/* Status / notify */}
      <section className="paper-fold-quarters corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 text-center sm:px-10">
        <SectionLabel>Right Now</SectionLabel>
        <p className="mx-auto mt-4 max-w-md font-playfair text-xl italic text-ink sm:text-2xl">
          The path is still being cleared.
        </p>
        <p className="mx-auto mt-3 max-w-md text-stone">
          Kenji&rsquo;s Quest: First Light is in development &mdash; the
          world, the stages, and the lore above are all still being built
          out.
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
