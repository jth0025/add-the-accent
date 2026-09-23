import Link from "next/link";
import { PIECES, tagsOf } from "@/lib/designPieces";
import PaperClip from "@/components/PaperClip";
import ServiceCTA from "@/components/ServiceCTA";
import WorkInquiryForm from "@/components/WorkInquiryForm";
import AccentNotesSignup from "@/components/AccentNotesSignup";
import KenjiGuide from "@/components/KenjiGuide";

export const metadata = { title: "Work With Me — Add the Accent" };

// The Smithsonian teaser below picks a fresh handful of commissioned
// pieces on every request rather than baking one static set in at
// build time.
export const dynamic = "force-dynamic";

function SectionLabel({ children, tone = "text-accent", rule = "bg-accent/40" }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest ${tone}`}
    >
      <span className={`h-px w-8 ${rule}`} />
      <span>{children}</span>
      <span className={`h-px w-8 ${rule}`} />
    </div>
  );
}

// Two-line "editorial" headline treatment shared by the service cards —
// a smaller cousin of the Playfair hero lines on the home page.
function EditorialHeading({ lines }) {
  return (
    <h2 className="mx-auto mt-3 max-w-[19rem] font-playfair text-xl italic leading-tight text-ink sm:max-w-lg sm:text-3xl">
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h2>
  );
}

// Hand-sketched treasure pieces scattered around the Cover & Key Art
// card — a few shared shapes (coin, gem, key, chest) reused at
// different sizes, colors, and rotations along the corners and sides.
function CoinIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      className={`pointer-events-none absolute z-10 [filter:url(#urban-sketch)] ${className}`}
    >
      <circle cx="20" cy="20" r="14" fill="#d9a441" stroke="#3a2415" strokeWidth="2" />
      <circle cx="20" cy="20" r="9.5" fill="none" stroke="#3a2415" strokeWidth="1.3" />
      <path d="M20 14v12M15 17l10 6M25 17l-10 6" stroke="#3a2415" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function GemIcon({ className, fill = "#8fd8e6", stroke = "#1a4a52" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      className={`pointer-events-none absolute z-10 [filter:url(#urban-sketch)] ${className}`}
    >
      <path d="M8 15 L20 6 L32 15 L26 34 L14 34 Z" fill={fill} stroke={stroke} strokeWidth="2" />
      <path
        d="M8 15 L32 15 M14 34 L20 15 L26 34 M20 6 L14 15 M20 6 L26 15"
        fill="none"
        stroke={stroke}
        strokeWidth="1"
      />
    </svg>
  );
}

function KeyIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      className={`pointer-events-none absolute z-10 [filter:url(#urban-sketch)] ${className}`}
    >
      <circle cx="12" cy="12" r="7" fill="none" stroke="#f6e0bd" strokeWidth="2.6" />
      <circle cx="12" cy="12" r="2.2" fill="#f6e0bd" />
      <path d="M17 17 L32 32 M25 25 l4.5 -4.5 M29.5 29.5 l4 -4" stroke="#f6e0bd" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function ChestIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 40"
      className={`pointer-events-none absolute z-10 [filter:url(#urban-sketch)] ${className}`}
    >
      <rect x="5" y="17" width="30" height="15" rx="2" fill="#8a5a2a" stroke="#2a1a0c" strokeWidth="2" />
      <path d="M5 21 Q20 10 35 21" fill="none" stroke="#2a1a0c" strokeWidth="2" />
      <circle cx="20" cy="23.5" r="2.4" fill="#f6e0bd" stroke="#2a1a0c" strokeWidth="1" />
    </svg>
  );
}

function Dot({ tone = "bg-accent" }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${tone}`}
    />
  );
}

const GOOD_FOR = {
  cover: [
    "Album & single covers",
    "Podcast artwork",
    "Editorial covers",
    "Campaign key art",
    "Promotional visuals",
  ],
  storytelling: [
    "Conceptual portraits",
    "Composite artwork",
    "Personal campaigns",
    "Artist imagery",
    "Editorial storytelling",
  ],
  direction: [
    "Creative concepts",
    "Brand storytelling",
    "Visual direction",
    "Campaign direction",
    "Mood boards",
    "Content direction",
  ],
};

function GoodForList({ items, tone = "text-stone", dot = "bg-accent" }) {
  return (
    <ul className={`mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-2 text-sm ${tone}`}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={`h-1 w-1 shrink-0 rounded-full ${dot}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Tell me what you're thinking.",
    body: "It doesn't have to be polished. Give me the idea, references, story, problem, or feeling you're trying to create.",
  },
  {
    n: "02",
    title: "We'll find the accent.",
    body: "I'll determine the strongest creative direction, scope, deliverables, and approach for the project.",
  },
  {
    n: "03",
    title: "We make the thing.",
    body: "Once we're aligned, the project moves into development and execution.",
  },
];

// The pool the Smithsonian teaser draws its random handful from — every
// #commission-tagged piece in the design library (see CommissionGraphicsGrid
// for the same filter, used on the portfolio page).
const COMMISSION_POOL = PIECES.filter((p) => tagsOf(p.alt).includes("commission"));

function pickRandom(list, count) {
  const pool = [...list];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export default function WorkWithMePage() {
  const smithsonianPicks = pickRandom(COMMISSION_POOL, 4);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Hero — Kenji, guide of the quest, introduces the studio. */}
      <section className="paper-fold-quarters corner-box rounded-xl border border-ink/15 bg-card px-7 py-12 text-center sm:px-10 sm:py-16">
        <PaperClip position="-top-4 left-24 rotate-[7deg]" />
        <SectionLabel>Work With Me</SectionLabel>

        {/* A black-line sketch of a rainforest, drawn behind him, with a
            winding trail leading up to where he sits — the world the
            quest starts from. Kenji himself is untouched; this is a
            separate layer painted underneath. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 320 280"
          className="pointer-events-none absolute left-1/2 top-16 h-[19rem] w-[20rem] -translate-x-1/2 text-ink/80 [filter:url(#urban-sketch)] sm:top-20 sm:h-[23rem] sm:w-[24rem]"
        >
          <path
            d="M160 278 C150 240,190 220,170 190 S120 150,150 120 S190 90,168 55"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeDasharray="2 9"
          />
          <g stroke="currentColor" strokeWidth="1.9" fill="none" strokeLinecap="round">
            <line x1="40" y1="230" x2="40" y2="170" />
            <path d="M40 170 L20 150 M40 170 L60 150 M40 170 L40 140 M40 170 L26 158 M40 170 L54 158" />
            <line x1="82" y1="258" x2="82" y2="208" />
            <path d="M82 208 L60 191 M82 208 L104 191 M82 208 L82 181 M82 208 L68 195 M82 208 L96 195" />
            <line x1="25" y1="122" x2="25" y2="82" />
            <path d="M25 82 L8 66 M25 82 L42 66 M25 82 L25 58 M25 82 L14 70 M25 82 L36 70" />
          </g>
          <g stroke="currentColor" strokeWidth="1.9" fill="none" strokeLinecap="round">
            <line x1="280" y1="230" x2="280" y2="170" />
            <path d="M280 170 L260 150 M280 170 L300 150 M280 170 L280 140 M280 170 L266 158 M280 170 L294 158" />
            <line x1="238" y1="258" x2="238" y2="208" />
            <path d="M238 208 L216 191 M238 208 L260 191 M238 208 L238 181 M238 208 L224 195 M238 208 L252 195" />
            <line x1="295" y1="122" x2="295" y2="82" />
            <path d="M295 82 L278 66 M295 82 L312 66 M295 82 L295 58 M295 82 L284 70 M295 82 L306 70" />
          </g>
        </svg>

        <div className="relative mx-auto mt-8 w-[13rem] sm:w-[16rem]">
          {/* A wide, grounded shadow that stays put while he drifts above
              it — the gap and the stillness are what sell the levitation,
              rather than a shadow that tracks his every move. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-3 -bottom-4 h-5 rounded-[50%] bg-black/75 blur-[6px] sm:inset-x-4 sm:-bottom-5"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kenji-meditating.png"
            alt="Kenji, a lone samurai rendered in carved wood and gold armor, seated cross-legged in meditation"
            className="kenji-levitate relative w-full drop-shadow-[0_14px_16px_rgba(0,0,0,0.3)]"
          />
        </div>

        <p className="mx-auto mt-5 flex max-w-[17rem] items-center justify-center gap-1.5 font-hand text-xl leading-tight text-accent">
          <span>
            Every quest begins the same way.
            <br />
            Someone says, &ldquo;I have an idea.&rdquo;
          </span>
          {/* A little sketched lightbulb, rocking as if it just flickered
              on with the idea. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 32"
            className="bulb-tilt h-6 w-6 shrink-0 text-accent [filter:url(#urban-sketch)]"
          >
            <path
              d="M12 2c-4.4 0-7.5 3.3-7.5 7.3 0 2.7 1.4 4.5 2.8 5.9.9.9 1.4 1.7 1.4 2.8v1h6.6v-1c0-1.1.5-1.9 1.4-2.8 1.4-1.4 2.8-3.2 2.8-5.9C19.5 5.3 16.4 2 12 2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.3 22h5.4M10 25h4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M12 6.5c-1.8 0-3.1 1.4-3.1 3.1M17 4l1.6-1.6M19.5 9.5h2.2M4.5 9.5H2.3M5.4 4L3.8 2.4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </p>

        {/* A worn hanko-style seal, like the mark stamped at the close
            of a passage — here it marks the start of one instead. 始
            ("hajime") reads as "begin". */}
        <div className="mt-4 flex justify-center" aria-hidden="true">
          <span className="grunge-text flex h-11 w-11 rotate-[-7deg] items-center justify-center rounded-[3px] bg-[#8f2c1a] font-serif text-2xl font-bold text-[#f4e4c4] shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
            始
          </span>
        </div>

        <h1 className="mx-auto mt-5 max-w-xs font-playfair text-4xl font-bold not-italic leading-[1.08] text-ink sm:text-5xl">
          <span className="block">Bring me the idea</span>
          <span className="block">before it&rsquo;s finished.</span>
        </h1>
      </section>

      {/* Everything the headline promises sits on its own sheet of
          paper — the same "photo card, then a separate paper panel"
          idea the homepage Features boxes use. */}
      <section className="paper-notebook corner-box mt-6 rounded-xl border border-ink/15 bg-white px-7 py-10 text-center sm:px-10">
        <p className="mx-auto max-w-xl text-stone">
          <span className="font-bold italic text-ink">Add the Accent</span>{" "}
          walks the road with:
        </p>
        <ul className="mx-auto mt-3 max-w-md space-y-1.5 text-left text-stone">
          <li className="flex items-center gap-2.5">
            <Dot />
            Artists
          </li>
          <li className="flex items-center gap-2.5">
            <Dot />
            Brands
          </li>
          <li className="flex items-center gap-2.5">
            <Dot />
            Creators
          </li>
          <li className="flex gap-2.5">
            <span
              aria-hidden="true"
              className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-accent"
            />
            <span className="italic">
              People with something to say but who may not know what it
              should look like yet.
            </span>
          </li>
        </ul>
        <p className="mx-auto mt-5 max-w-xl text-stone">
          Every quest starts somewhere unexpected &mdash; a photograph, a
          sentence, a song, a story. A half-formed idea sitting quietly in
          somebody&rsquo;s Notes app, waiting to be called.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          That is enough to begin the quest.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          The goal was never to make something that simply looks good.
          It is to seek out the detail, the perspective, the story
          &mdash; the treasure &mdash; that makes the work unmistakably
          yours, then give it form. That is the accent.
        </p>

        <p className="mx-auto mt-6 max-w-md font-playfair text-xl italic text-ink sm:text-2xl">
          &ldquo;Your voice is the treasure&hellip;the accent.&rdquo;
        </p>

        <p className="mx-auto mt-8 max-w-sm font-playfair text-3xl font-bold not-italic leading-[1.12] text-ink sm:text-4xl">
          <span className="block">The difference is you.</span>
          <span className="block">
            Let&rsquo;s make it{" "}
            <span className="dissolve-smoke">visible</span>.
          </span>
        </p>
      </section>

      {/* Cover & Key Art — the treasure Kenji speaks of, so it gets the
          gold-and-bronze card the rest of the offerings don't, ringed
          with a handful of hand-drawn treasure pieces at the corners. */}
      <section
        id="cover-key-art"
        className="paper-journal-dark corner-box mt-10 scroll-mt-24 rounded-xl border border-black/30 px-7 py-10 text-center text-[#e7ded2] shadow-lg sm:px-10"
        style={{
          background:
            "linear-gradient(135deg, #b9724a 0%, #6b4028 55%, #3a2415 100%)",
        }}
      >
        {/* Corner treasure — a ruby, a gem, a key, a small chest, each
            drawn in the site's loose hand-sketch line style and left
            overlapping the box edge like they were dropped there, plus
            a handful more scattered along each side. */}
        <GemIcon
          className="-left-3 -top-3 h-10 w-10 -rotate-[18deg] sm:h-12 sm:w-12"
          fill="#c8203a"
          stroke="#4a0b14"
        />
        <GemIcon className="-right-3 -top-3 h-10 w-10 rotate-[14deg] sm:h-12 sm:w-12" />
        <KeyIcon className="-bottom-3 -left-3 h-10 w-10 rotate-[10deg] sm:h-12 sm:w-12" />
        <ChestIcon className="-bottom-3 -right-3 h-10 w-10 -rotate-[12deg] sm:h-12 sm:w-12" />

        <CoinIcon className="-left-2 top-[26%] h-7 w-7 rotate-[9deg] sm:h-8 sm:w-8" />
        <GemIcon
          className="-left-2 bottom-[22%] h-7 w-7 -rotate-[11deg] sm:h-8 sm:w-8"
          fill="#c8203a"
          stroke="#4a0b14"
        />
        <GemIcon
          className="-right-2 top-[38%] h-7 w-7 -rotate-[16deg] sm:h-8 sm:w-8"
          fill="#b083e0"
          stroke="#3a1a5a"
        />
        <CoinIcon className="-right-2 bottom-[16%] h-7 w-7 -rotate-[12deg] sm:h-8 sm:w-8" />

        <p className="font-mono text-xs uppercase tracking-widest text-[#f6e0bd]/80">
          Cover &amp; Key Art
        </p>
        <p className="gold-foil gold-plate mt-1 font-oldenglish text-4xl leading-none sm:text-5xl">
          The Treasure
        </p>

        <h3 className="mx-auto mt-6 max-w-lg font-playfair text-2xl font-bold not-italic tracking-tight text-white sm:text-3xl">
          Give the project a{" "}
          <span className="relative inline-block h-[1.2em] w-[1.2em] -translate-y-[0.08em] align-middle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/globe.png"
              alt="world"
              className="globe-spin block h-full w-full object-contain"
            />
          </span>{" "}
          before anyone presses play.
        </h3>

        <ul className="mx-auto mt-6 max-w-md space-y-2.5 text-left text-[#e7ded2]/90">
          <li className="flex gap-2.5">
            <Dot tone="bg-[#f6e0bd]" />
            Cover artwork and key visuals for music, podcasts, films,
            editorial projects, campaigns, and creative releases.
          </li>
          <li className="flex gap-2.5">
            <Dot tone="bg-[#f6e0bd]" />
            Concept development, composition, typography, image
            treatment, and final artwork are shaped around the story
            behind the project rather than a template.
          </li>
          <li className="flex gap-2.5">
            <Dot tone="bg-[#f6e0bd]" />
            Delivered print-ready and platform-ready, sized and formatted
            for wherever the piece is going to live.
          </li>
          <li className="flex gap-2.5">
            <Dot tone="bg-[#f6e0bd]" />
            Revisions built into the process, not billed as an
            afterthought.
          </li>
        </ul>

        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-[#f6e0bd]/80">
          Good for
        </p>
        <GoodForList items={GOOD_FOR.cover} tone="text-[#e7ded2]/90" dot="bg-[#f6e0bd]" />
        <ServiceCTA presetType="Cover / Key Art">Start a Project</ServiceCTA>
      </section>

      {/* Visual Storytelling */}
      <section
        id="visual-storytelling"
        className="paper-journal corner-box mt-10 scroll-mt-24 rounded-xl border border-ink/15 bg-card px-7 py-10 text-center sm:px-10"
      >
        <SectionLabel>Visual Storytelling</SectionLabel>
        <EditorialHeading lines={["Not just a picture.", "A point of view."]} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/scroll.png"
          alt=""
          aria-hidden="true"
          className="mx-auto mt-4 w-32 sm:w-44"
        />
        <ul className="mx-auto mt-5 max-w-xl space-y-2 text-left text-stone">
          <li className="flex gap-2.5">
            <Dot />
            Conceptual portraits, composites, and narrative visuals
            built around an idea, memory, person, or story.
          </li>
          <li className="flex gap-2.5">
            <Dot />
            This is where photography, design, surrealism, and art
            direction can collide a little.
          </li>
          <li className="flex gap-2.5">
            <Dot />
            Portraits that read like a scene, not just a subject standing
            in front of a backdrop.
          </li>
          <li className="flex gap-2.5">
            <Dot />
            Built from a single image or blended from several &mdash;
            whatever the idea actually needs.
          </li>
        </ul>
        <p className="mx-auto mt-4 max-w-xl font-serif italic text-ink">
          Bring the story. We&rsquo;ll figure out what it needs to become.
        </p>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-accent">
          Good for
        </p>
        <GoodForList items={GOOD_FOR.storytelling} />
        <ServiceCTA presetType="Visual Storytelling / Composite">
          Start a Project
        </ServiceCTA>
      </section>

      {/* Creative Direction & Brand Story */}
      <section
        id="creative-direction"
        className="paper-journal corner-box mt-10 scroll-mt-24 rounded-xl border border-ink/15 bg-card px-7 py-10 text-center sm:px-10"
      >
        <SectionLabel>Creative Direction &amp; Brand Story</SectionLabel>
        <EditorialHeading
          lines={["You know what you're trying to say.", "You just can't see it yet."]}
        />
        <ul className="mx-auto mt-5 max-w-xl space-y-2 text-left text-stone">
          <li className="flex gap-2.5">
            <Dot />
            For artists, creators, and growing brands who need help
            turning scattered ideas into a clearer creative world.
          </li>
          <li className="flex gap-2.5">
            <Dot />
            We&rsquo;ll work through the story, positioning, visual
            language, tone, references, and creative direction until
            the pieces begin to feel like they belong to the same
            universe.
          </li>
          <li className="flex gap-2.5">
            <Dot />
            Moodboards, references, and language that keep every
            decision pointed the same direction.
          </li>
          <li className="flex gap-2.5">
            <Dot />
            A framework you can keep using long after the first project
            wraps.
          </li>
        </ul>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-accent">
          Good for
        </p>
        <GoodForList items={GOOD_FOR.direction} />
        <ServiceCTA presetType="Creative Direction / Brand Story">
          Start a Conversation
        </ServiceCTA>
      </section>

      {/* For inspiration, visit the Smithsonian — a playful stand-in
          name for the design gallery, with a fresh random handful of
          commissioned pieces on every visit. */}
      <section id="selected-work" className="mt-14 scroll-mt-24 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          For inspiration, visit the
        </p>
        <p className="gleam-gold relative mx-auto mt-1 inline-block font-script text-4xl sm:text-5xl">
          Smithsonian
          {/* A couple of sketched flourishes either side, plus an
              underline swoop — the "handwritten and underlined for
              emphasis" atmosphere rather than a plain wordmark. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 36 36"
            className="pointer-events-none absolute -left-8 top-0 h-6 w-6 -rotate-[8deg] text-accent/70 [filter:url(#urban-sketch)] sm:-left-9 sm:h-7 sm:w-7"
          >
            <path
              d="M6 28 L26 6 M18 6 L26 6 L26 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            aria-hidden="true"
            viewBox="0 0 36 36"
            className="pointer-events-none absolute -right-8 top-0 h-6 w-6 rotate-[8deg] scale-x-[-1] text-accent/70 [filter:url(#urban-sketch)] sm:-right-9 sm:h-7 sm:w-7"
          >
            <path
              d="M6 28 L26 6 M18 6 L26 6 L26 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            aria-hidden="true"
            viewBox="0 0 200 20"
            className="pointer-events-none absolute -bottom-1 left-1/2 h-3 w-36 -translate-x-1/2 text-accent/60 [filter:url(#urban-sketch)] sm:w-44"
          >
            <path
              d="M4 10 Q60 18 100 9 T196 11"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </p>

        <p className="mx-auto mt-5 max-w-md text-stone">
          A few things that began the same way most good projects do:
          with somebody saying,
        </p>
        <p className="mt-1 font-serif text-xl italic text-ink">
          &ldquo;I have an idea&hellip;&rdquo;
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 pt-7 sm:grid-cols-4 sm:pt-9">
          {smithsonianPicks.map((piece) => (
            <Link
              key={piece.src}
              href="/design"
              className="museum-frame group relative block w-full bg-[#efe7d4] p-1.5 shadow-md transition-shadow hover:shadow-xl"
              aria-label={`View the design gallery — ${piece.alt.replace(/#/g, "")}`}
            >
              {/* A small gallery picture-light mounted above the frame,
                  sketched like the site's other hand-drawn accents. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 60 30"
                className="pointer-events-none absolute -top-6 left-1/2 h-5 w-14 -translate-x-1/2 text-[#8a6a2a] [filter:url(#urban-sketch)]"
              >
                <path
                  d="M8 26 Q30 2 52 26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="30"
                  cy="26"
                  rx="10"
                  ry="3.5"
                  fill="#3a2a16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              {/* The beam, dormant until hovered — a soft cone of light
                  angling down from the fixture onto the piece. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-2 left-1/2 h-20 w-28 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255, 244, 214, 0.6), rgba(255, 244, 214, 0))",
                  clipPath: "polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)",
                }}
              />
              <span className="relative block overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={piece.src}
                  alt=""
                  className="block aspect-square w-full object-cover"
                  loading="lazy"
                />
                <span className="bronze-glare" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/design"
          className="group mt-8 inline-flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-widest text-ink transition-colors duration-200 hover:text-accent"
        >
          Enter the Museum
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4a0f16] text-[#f0d8b0] shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:bg-[#5c141d]"
          >
            &rarr;
          </span>
        </Link>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="paper-notebook corner-box relative mt-14 scroll-mt-24 rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10"
      >
        <SectionLabel>How It Works</SectionLabel>
        <h2 className="mt-3 text-center font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">
          Keep It Simple.
        </h2>
        {/* A scribbled margin note — the idea (1) plus the direction (1)
            becomes the thing (2) — with a little atmosphere around it:
            a soft glow and a couple of hand-drawn sparkle marks. */}
        <div className="relative mt-2 flex justify-center">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute h-24 w-48 rounded-full bg-accent/15 blur-2xl"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute -left-2 -top-3 h-4 w-4 text-accent/60 [filter:url(#urban-sketch)] sm:-left-4"
          >
            <path
              d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
              fill="currentColor"
            />
          </svg>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute -bottom-2 -right-2 h-3 w-3 text-accent/50 [filter:url(#urban-sketch)] sm:-right-4"
          >
            <path
              d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
              fill="currentColor"
            />
          </svg>
          <p
            aria-hidden="true"
            className="pointer-events-none relative -rotate-2 text-center font-hand text-5xl font-bold text-accent/70 [filter:url(#urban-sketch)] sm:text-6xl"
          >
            1 + 1 = 2
          </p>
        </div>
        <ol className="mx-auto mt-8 max-w-lg space-y-7">
          {STEPS.map((step) => (
            <li key={step.n} className="flex gap-4">
              <span className="shrink-0 font-cinema text-2xl text-accent/70">
                {step.n}
              </span>
              <div>
                <p className="font-serif text-lg font-bold italic text-ink">
                  {step.title}
                </p>
                <p className="mt-1 text-sm text-stone">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Have Something in Mind — the qualifying inquiry form. The
          "Have Something in Mind?" intro and the form itself both live
          inside WorkInquiryForm now, since the intro needs to disappear
          once the form has been sent (the success state replaces it
          with its own content) rather than sitting above it always. */}
      <section
        id="inquiry"
        className="paper-fold-quarters corner-box mt-14 scroll-mt-24 rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10"
      >
        <WorkInquiryForm />
      </section>

      <AccentNotesSignup />

      <KenjiGuide />
    </div>
  );
}
