import Link from "next/link";
import SmokeLink from "@/components/SmokeLink";
import "./kenji-quest.css";
import "@/app/about/about.css";

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

function CornerBlade({ pos, delay }) {
  return (
    <span
      aria-hidden="true"
      className={`kq-corner kq-corner--${pos}`}
      style={{ "--kq-delay": `${delay}s` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/kenji-ui/corner-blade.webp" alt="" />
      <span className="kq-corner-gleam" />
    </span>
  );
}

export default function KenjiQuestPage() {
  return (
    <div className="relative mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent hover:underline"
      >
        &larr; Add the Accent
      </Link>

      {/* Hero */}
      <div className="relative">
        {/* Gold corner ornaments, tips overhanging the box's corners —
            siblings of the section so its overflow-hidden never clips
            them. Each gleams on its own staggered cycle. */}
        <CornerBlade pos="tl" delay={0} />
        <CornerBlade pos="tr" delay={1.4} />
        <CornerBlade pos="br" delay={2.8} />
        <CornerBlade pos="bl" delay={4.2} />
        {/* Flanking torches — desktop only, sitting just outside the
            box's own edges rather than inset within it. Siblings of
            the section (not children) so the section's own
            overflow-hidden, which clips its rounded corners, never
            clips them. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-14 top-40 z-20 hidden -translate-y-1/2 flex-col items-center lg:flex"
        >
          <span className="qi-torch-flame block h-8 w-6" />
          <span className="block h-16 w-2.5 rounded-sm bg-gradient-to-b from-[#6b4a2a] via-[#4a3018] to-[#2c1c0d]" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 top-40 z-20 hidden -translate-y-1/2 flex-col items-center lg:flex"
        >
          <span className="qi-torch-flame block h-8 w-6" />
          <span className="block h-16 w-2.5 rounded-sm bg-gradient-to-b from-[#6b4a2a] via-[#4a3018] to-[#2c1c0d]" />
        </div>

        <section
          className="corner-box relative overflow-hidden rounded-xl border border-black/40 px-7 py-14 text-center shadow-xl sm:px-10 sm:py-20"
          style={{
            background:
              "linear-gradient(160deg, #16241a 0%, #1c2f1e 35%, #2a2312 70%, #1a1409 100%)",
          }}
        >
          <SectionLabel>In Development</SectionLabel>

          <div className="relative mx-auto mt-4 w-full max-w-xs sm:max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kenji-game/title-mark.webp"
            alt="Kenji's Quest: First Light"
            className="w-full"
          />
          {/* A constant, slow light glare across the mark, masked to
              its own letterforms. The mark is the title — no separate
              text duplicates it. */}
          <div
            aria-hidden="true"
            className="qi-title-glare-sweep pointer-events-none absolute inset-0"
            style={{
              WebkitMaskImage: "url(/kenji-game/title-mark.webp)",
              maskImage: "url(/kenji-game/title-mark.webp)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              animationDelay: "0s",
            }}
          />
        </div>
        <p className="mx-auto mt-6 max-w-lg font-athelas text-lg leading-snug text-[#e7ded2]/90 sm:text-xl">
          A pilgrimage through memory, mystery, and light.
        </p>
        <p className="title-glow-light mx-auto mt-2 whitespace-nowrap font-athelas font-light text-white text-[min(calc((100vw-5.5rem)/16),1.75rem)]">
          Coming soon to Add the Accent.
        </p>

        {/* The opening — the intro and the main menu. On the live site
            the menu is greyed out ("Coming Soon") apart from Replay
            Intro; the rest of the game is still in development. */}
        <SmokeLink
          href="/kenji-quest/play"
          aria-label="Play the Opening"
          className="kq-plaque mt-6"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kenji-ui/enter-plaque.webp" alt="" />
          <span className="kq-plaque-text">Play the Opening</span>
        </SmokeLink>

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
            className="butterfly-glow butterfly-color-cycle pointer-events-none absolute left-[74%] top-[13%] z-20 h-5 w-5 -translate-x-1/2 -translate-y-[75%] text-[#f6d999] sm:h-6 sm:w-6"
          >
            <g className="butterfly-wing" style={{ transformOrigin: "15px 16px" }}>
              <path
                d="M15 15 C 9 8, 3 9, 4 15 C 3 21, 9 23, 15 17 Z"
                fill="currentColor"
                opacity="0.55"
              />
            </g>
            <g className="butterfly-wing" style={{ transformOrigin: "15px 16px" }}>
              <path
                d="M15 15 C 23 5, 31 8, 27 16 C 31 24, 23 27, 15 17 Z"
                fill="currentColor"
              />
            </g>
            <path
              d="M14 9 Q 17 16 14 25"
              stroke="#2a2015"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        </section>
      </div>

      {/* The quest */}
      <section className="paper-journal-dark corner-box relative mt-8 overflow-hidden rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10">
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
          <strong className="gleam-natural font-bold italic">First Light</strong>.
        </p>
        <p className="mx-auto mt-4 max-w-xl font-serif italic text-ink/80">
          It isn&rsquo;t a hunt for treasure. It&rsquo;s a pilgrimage
          &mdash; and soon, it&rsquo;s one you&rsquo;ll be able to walk
          yourself.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/grass-side.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 h-9 w-auto -translate-x-1/2 sm:h-11"
        />
      </section>

      {/* Meet Kenji */}
      <section className="paper-journal corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10">
        <SectionLabel>Meet Kenji</SectionLabel>
        <div className="mt-6 grid gap-8 sm:grid-cols-[auto,1fr] sm:items-center">
          <div className="relative mx-auto w-40 sm:w-48">
            {/* A grounded shadow that stays put while he drifts above
                it, same idea as the Work With Me hero's levitating
                Kenji — the stillness against his slow bob is what
                sells it. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-6 -bottom-2 h-4 rounded-[50%] bg-black/60 blur-[6px]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kenji-meditating.png"
              alt="Kenji seated in quiet meditation, a butterfly nearby"
              className="kenji-levitate relative w-full drop-shadow-[0_10px_14px_rgba(0,0,0,0.25)]"
            />
          </div>
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

      {/* The path, and where things stand right now */}
      <section className="paper-fold-thirds qi-path-paper-wide corner-box mt-8 rounded-xl border border-ink/15 bg-card px-7 py-10 text-center sm:px-10">
        <SectionLabel>The Path</SectionLabel>
        <h2 className="mt-3 whitespace-nowrap font-playfair text-[min(calc((100vw-7.5rem)/28),1.5rem)] italic text-ink sm:text-xl">
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
        <div className="mx-auto mt-8 max-w-md border-t border-ink/10 pt-8">
          <SectionLabel>Right Now</SectionLabel>
          <p className="mx-auto mt-4 max-w-md font-playfair text-xl italic text-ink sm:text-2xl">
            The path is still being cleared.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/quest-path.png"
            alt="A hand-drawn map of a winding path through jungle island terrain"
            className="mx-auto mt-6 w-48 drop-shadow-[0_10px_14px_rgba(0,0,0,0.3)] sm:w-56"
          />
          <p className="mx-auto mt-6 max-w-md text-stone">
            <strong className="font-bold italic">Kenji&rsquo;s Quest</strong>:{" "}
            <strong className="gleam-natural font-bold italic">First Light</strong> is in
            development &mdash; and it&rsquo;s shaping up to be something
            worth the wait.
          </p>
        </div>
      </section>

      {/* Status / notify */}
      <div className="relative mt-8">
        {/* Two guards stand either side of the box, their feet on the
            footer's edge (the page's bottom padding is 4rem). Wide
            screens only — there is no room beside the box below that. */}
        {[
          "right-full mr-2 xl:mr-5",
          "left-full ml-2 xl:ml-5",
        ].map((side) => (
          <div
            key={side}
            aria-hidden="true"
            className={`pointer-events-none absolute -bottom-16 hidden w-28 lg:block xl:w-40 ${side}`}
          >
            {/* The ground under his feet: a soft, dark pool lying on the
                footer's edge, with the soles planted in the middle of it. */}
            <span className="absolute inset-x-[2%] bottom-[-2px] h-3 rounded-[50%] bg-black/75 blur-[3px]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kenji-ui/warrior.webp"
              alt=""
              className="relative block h-auto w-full"
              style={{ transform: "translateY(-5px)" }}
            />
            {/* A small glint on the spear's tip — both guards catch the
                light at the same moment. */}
            <span className="kq-spear-flare" />
          </div>
        ))}
      <section className="paper-fold-quarters corner-box rounded-xl border border-ink/15 bg-card px-7 py-10 text-center sm:px-10">
        {/* A small Accent Note: the same title structure as the signup box
            (label, heavy Playfair title with the gleaming italic middle
            word, double rule), scaled down to sit inside this card. */}
        <div className="mx-auto max-w-md">
          <div className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
            <span className="h-px w-5 bg-accent/40" />
            <span>Join the list</span>
            <span className="h-px w-5 bg-accent/40" />
          </div>
          <p className="mt-3 font-playfair text-[1.7rem] font-black leading-[0.95] tracking-[-0.03em] text-ink sm:text-[2rem]">
            An <span className="about-accent-gleam font-normal italic text-accent">Accent</span>{" "}
            Note
          </p>
          <div aria-hidden="true" className="mx-auto mt-3 flex max-w-[7rem] flex-col gap-[2px]">
            <span className="h-[2px] bg-ink" />
            <span className="h-px bg-ink/60" />
          </div>
          <p className="mt-3 font-playfair text-base font-bold leading-tight tracking-[-0.01em] text-ink">
            Announced <span className="font-normal italic text-accent">here</span> first
          </p>
          <p className="mt-2 text-sm text-stone">
            Sign up on the{" "}
            <Link href="/work-with-me" className="text-accent hover:underline">
              Work With Me
            </Link>{" "}
            page, or keep an eye on the{" "}
            <Link href="/journal" className="text-accent hover:underline">
              Journal
            </Link>
            .
          </p>
        </div>
      </section>
      </div>
    </div>
  );
}
