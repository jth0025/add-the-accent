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
        <PaperClip position="-top-4 left-14 rotate-[7deg]" />
        <SectionLabel>Work With Me</SectionLabel>

        <div className="relative mx-auto mt-8 w-[13rem] sm:w-[16rem]">
          {/* A tight, dark shadow — he's hovering just above the ground,
              close enough that it reads almost like it's touching, not
              the soft faraway shadow a standing figure would cast. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-14 -bottom-1 h-3.5 rounded-[50%] bg-black/70 blur-[5px] sm:inset-x-16"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kenji-meditating.png"
            alt="Kenji, a lone samurai rendered in carved wood and gold armor, seated cross-legged in meditation"
            className="relative w-full drop-shadow-[0_14px_16px_rgba(0,0,0,0.3)]"
          />
        </div>

        <p className="mx-auto mt-5 max-w-[15rem] font-hand text-xl leading-tight text-accent">
          Every quest begins the same way.
          <br />
          Someone says, &ldquo;I have an idea.&rdquo;
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
          Add the Accent works with artists, brands, creators, and people
          with something to say but who may not know what it should look
          like yet.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          Sometimes the project starts with a photograph. Sometimes a
          sentence. A song. A story. A half-formed idea sitting in
          somebody&rsquo;s Notes app.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          That&rsquo;s enough to begin.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          The goal isn&rsquo;t to make something that simply looks good.
          It&rsquo;s to find the detail, perspective, or story that makes
          the work unmistakably yours, then give it form.
        </p>

        <p className="mx-auto mt-8 max-w-sm font-playfair text-3xl font-bold not-italic leading-[1.12] text-ink sm:text-4xl">
          <span className="block">The difference is you.</span>
          <span className="block">
            Let&rsquo;s make it <span className="gold-foil">visible</span>.
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
        <p className="gold-foil mt-1 font-oldenglish text-4xl leading-none sm:text-5xl">
          The Treasure
        </p>

        <h3 className="mx-auto mt-6 max-w-lg font-display text-2xl uppercase tracking-tight text-white sm:text-3xl">
          Give the project a{" "}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/globe.png"
            alt="world"
            className="inline-block h-[1.2em] w-[1.2em] -translate-y-[0.08em] align-middle object-contain"
          />{" "}
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
          className="mx-auto mt-4 w-40 drop-shadow-[0_22px_26px_rgba(0,0,0,0.55)] sm:w-52"
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
        <p className="mt-1 font-script text-4xl text-accent sm:text-5xl">
          Smithsonian
        </p>

        <p className="mx-auto mt-5 max-w-md text-stone">
          A few things that began the same way most good projects do:
          with somebody saying,
        </p>
        <p className="mt-1 font-serif text-xl italic text-ink">
          &ldquo;I have an idea&hellip;&rdquo;
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {smithsonianPicks.map((piece) => (
            <Link
              key={piece.src}
              href="/design"
              className="group relative block w-full overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl"
              aria-label={`View the design gallery — ${piece.alt.replace(/#/g, "")}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={piece.src}
                alt=""
                className="block aspect-square w-full object-cover"
                loading="lazy"
              />
              <span className="bronze-glare" aria-hidden="true" />
            </Link>
          ))}
        </div>

        <Link
          href="/design"
          className="mt-8 inline-block font-mono text-xs font-bold uppercase tracking-widest text-ink transition-colors duration-200 hover:text-accent"
        >
          Enter the Smithsonian &rarr;
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
            becomes the thing (2). */}
        <p
          aria-hidden="true"
          className="pointer-events-none mt-2 -rotate-2 text-center font-hand text-5xl font-bold text-accent/70 [filter:url(#urban-sketch)] sm:text-6xl"
        >
          1 + 1 = 2
        </p>
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

      {/* Have Something in Mind — the qualifying inquiry form */}
      <section
        id="inquiry"
        className="paper-fold-quarters corner-box mt-14 scroll-mt-24 rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10"
      >
        <SectionLabel>Have Something in Mind?</SectionLabel>
        <p className="mx-auto mt-4 max-w-md text-center font-playfair text-xl italic text-ink sm:text-2xl">
          You don&rsquo;t need the perfect creative brief.
        </p>
        <p className="mx-auto mt-2 max-w-md text-center text-stone">
          Tell me what you&rsquo;re making, why you&rsquo;re making it,
          and where you feel stuck. We&rsquo;ll start there.
        </p>
        <WorkInquiryForm />
      </section>

      <AccentNotesSignup />

      <KenjiGuide />
    </div>
  );
}
