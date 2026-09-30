import Link from "next/link";

export const metadata = {
  title: "Kenji's Quest: First Light — Add the Accent",
  description:
    "An interactive adventure built from the world of Add the Accent — a pilgrimage across the Kuroshio Reach. In development.",
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
        <SectionLabel>In Development</SectionLabel>

        <h1 className="mt-4 font-cinema text-sm uppercase tracking-wide text-[#f6e0bd] sm:text-base">
          Kenji&rsquo;s Quest
        </h1>
        <p className="title-glow mx-auto mt-2 font-athelas font-light uppercase text-5xl leading-none tracking-[0.02em] text-white sm:text-7xl">
          First Light
        </p>
        <p className="mx-auto mt-6 max-w-lg font-athelas text-lg leading-snug text-[#e7ded2]/90 sm:text-xl">
          A pilgrimage through memory, mystery, and light.
        </p>
        <p className="title-glow mx-auto mt-2 whitespace-nowrap font-athelas font-light text-white text-[min(calc((100vw-5.5rem)/16),1.75rem)]">
          Coming soon to Add the Accent.
        </p>

        <div className="relative mx-auto mt-8 w-48 sm:w-56">
          {/* A warm backlight glowing behind Kenji instead of a ground
              shadow — same glow image and screen-blend trick as the
              header logo's night-mode backlight, clipped the same way
              too, so it never bleeds past the floor he's standing on. */}
          <span className="pointer-events-none absolute inset-0 z-0 [clip-path:inset(-100vh_-100vw_0_-100vw)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-backlight.png"
              alt=""
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 w-[170%] max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
            />
          </span>
          {/* A grounding shadow under his feet — distinct from the
              backlight above, which glows behind him rather than
              anchoring him to the floor. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-8 bottom-1 z-[5] h-3 rounded-[50%] bg-black/60 blur-[6px]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kenji-standing.png"
            alt="Kenji, a lone Afro-Japanese traveler in carved wood and gold armor, standing ready with a sheathed blade"
            className="relative z-10 w-full"
          />
          {/* The recurring butterfly — small, luminous, and never far
              (see "Meet Kenji" below) — perched on the tip of the
              sword hilt behind his shoulder, wings still fluttering. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 32 32"
            className="butterfly-glow pointer-events-none absolute left-[70%] top-[10%] z-20 h-5 w-5 -translate-x-1/2 -translate-y-full text-[#f6d999] sm:h-6 sm:w-6"
          >
            <g className="butterfly-wing">
              <path
                d="M16 16 C 7 3, -3 5, 3 16 C -3 27, 7 29, 16 16 Z"
                fill="currentColor"
              />
            </g>
            <g className="butterfly-wing">
              <path
                d="M16 16 C 25 3, 35 5, 29 16 C 35 27, 25 29, 16 16 Z"
                fill="currentColor"
              />
            </g>
            <ellipse cx="16" cy="16" rx="1.4" ry="6" fill="#2a2015" />
          </svg>
        </div>
      </section>

      {/* The quest */}
      <section className="paper-journal-dark corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10">
        <SectionLabel>The Quest</SectionLabel>
        <h2 className="mt-3 whitespace-nowrap text-center font-playfair text-[min(calc((100vw-7.5rem)/22),1.875rem)] italic text-ink">
          Every road home starts with a reason to leave.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-stone">
          <strong className="font-bold italic">Kenji&rsquo;s Quest</strong> is
          an interactive adventure built from the same world as the essays on
          this site &mdash; a chance to step inside the ideas Add the
          Accent has always circled back to: presence, inheritance,
          self-discovery, and the courage it takes to keep moving forward.
          It&rsquo;s the literary scope of this site, turned into
          something you play.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          You&rsquo;ll follow a young Afro-Japanese traveler raised by{" "}
          <strong className="font-bold italic">House Mizuhara</strong>, as an
          inherited blade and a fragmented scroll pull him across the{" "}
          <strong className="font-bold italic">Kuroshio Reach</strong> toward
          a destination the scroll calls only{" "}
          <strong className="font-bold italic">First Light</strong>.
        </p>
        <p className="mx-auto mt-4 max-w-xl font-serif italic text-ink/80">
          It isn&rsquo;t a hunt for treasure. It&rsquo;s a pilgrimage
          &mdash; and soon, it&rsquo;s one you&rsquo;ll be able to walk
          yourself.
        </p>
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
              product of a childhood spent inside{" "}
              <strong className="font-bold italic">House Mizuhara</strong>
              &rsquo;s discipline, not the birth clan he barely remembers. He
              listens more than he speaks, and watches before he acts.
            </p>
          </div>
        </div>
      </section>

      {/* What you'll do */}
      <section className="corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 text-center sm:px-10">
        <SectionLabel>What You&rsquo;ll Do</SectionLabel>
        <h2 className="mt-3 whitespace-nowrap font-playfair text-[min(calc((100vw-7.5rem)/22),1.875rem)] italic text-ink">
          An adventure built to be felt, not just read.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-stone">
          <strong className="font-bold italic">Kenji&rsquo;s Quest</strong> is
          designed as a real, playable adventure &mdash; a way of giving
          Add the Accent&rsquo;s stories an interactive dimension, where
          you move through the world instead of only reading about it.
          Combat is never the point. Every stage is built around
          observation, memory, restraint, and exploration &mdash; puzzles
          and terrain that open up once you&rsquo;ve actually understood
          them, not just walked through them.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          It&rsquo;s adventure with a purpose &mdash; the same one this
          whole site is built around: the difference is you.
        </p>
      </section>

      {/* The path */}
      <section className="paper-fold-thirds corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 text-center sm:px-10">
        <SectionLabel>The Path</SectionLabel>
        <h2 className="mt-3 whitespace-nowrap font-playfair text-[min(calc((100vw-7.5rem)/22),1.875rem)] italic text-ink">
          Seven sacred stages await across the Reach.
        </h2>
        <ul className="mx-auto mt-5 max-w-md list-disc space-y-1.5 pl-5 text-left text-stone marker:text-accent">
          <li>A ruined room.</li>
          <li>A guarded city.</li>
          <li>A hidden grove.</li>
          <li>And more waiting beyond.</li>
        </ul>
        <p className="mx-auto mt-4 max-w-md text-stone">
          Each stage asks something different of Kenji before it lets him
          pass. We&rsquo;re saving the details for when you can experience
          them yourself.
        </p>
      </section>

      {/* Status / notify */}
      <section className="paper-fold-quarters corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 text-center sm:px-10">
        <SectionLabel>Right Now</SectionLabel>
        <p className="mx-auto mt-4 max-w-md font-playfair text-xl italic text-ink sm:text-2xl">
          The path is still being cleared.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/quest-path.png"
          alt="A hand-drawn map of a winding path through jungle island terrain"
          className="mx-auto mt-6 w-48 rounded-lg border border-ink/15 shadow-md sm:w-56"
        />
        <p className="mx-auto mt-6 max-w-md text-stone">
          <strong className="font-bold italic">Kenji&rsquo;s Quest</strong>:{" "}
          <strong className="font-bold italic">First Light</strong> is in
          development &mdash; and it&rsquo;s shaping up to be something
          worth the wait.
        </p>
        <p className="mx-auto mt-3 max-w-md text-stone">
          <span className="font-script text-lg text-ink">Accent Notes</span>{" "}
          is where it&rsquo;ll be announced first &mdash; sign up on the{" "}
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
