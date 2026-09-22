import Link from "next/link";
import { PIECES } from "@/lib/designPieces";
import PaperClip from "@/components/PaperClip";
import ServiceCTA from "@/components/ServiceCTA";
import WorkInquiryForm from "@/components/WorkInquiryForm";
import AccentNotesSignup from "@/components/AccentNotesSignup";
import KenjiGuide from "@/components/KenjiGuide";

export const metadata = { title: "Work With Me — Add the Accent" };

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

const headingClass =
  "mt-3 text-center font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl";

// A handful of named, commissioned covers/key-art — curated rather than
// the whole /design set, so this reads as a highlight reel. Pulled from
// the same list the full gallery uses; add or swap a src to change it.
const FEATURED_SRCS = [
  "/design/paradise-album-cover.jpg",
  "/design/kobe-tribute-planet.jpg",
  "/design/loomieverse-collage.jpg",
  "/design/mirokol-hummingbird-portrait.jpg",
  "/design/nu-outcast-planet-cover.jpg",
  "/design/loomis-butterfly-cover.jpg",
  "/design/aso-asa-desert-astronaut.jpg",
  "/design/piano-stairway-car.jpg",
];
const FEATURED_WORK = FEATURED_SRCS.map((src) =>
  PIECES.find((p) => p.src === src),
).filter(Boolean);

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

function GoodForList({ items }) {
  return (
    <ul className="mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-stone">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-1 w-1 shrink-0 rounded-full bg-accent"
          />
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

export default function WorkWithMePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Hero — Kenji, guide of the quest, introduces the studio. */}
      <section className="paper-fold-quarters corner-box rounded-xl border border-ink/15 bg-card px-7 py-12 text-center sm:px-10 sm:py-16">
        <PaperClip position="-top-4 left-14 rotate-[7deg]" />
        <SectionLabel>Work With Me</SectionLabel>

        <div className="relative mx-auto mt-8 w-[13rem] sm:w-[16rem]">
          {/* A soft, detached shadow — he's not standing on the ground,
              he's hovering just above it. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-10 -bottom-2 h-5 rounded-[50%] bg-black/35 blur-md"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kenji-meditating.png"
            alt="Kenji, a lone samurai rendered in carved wood and gold armor, seated cross-legged in meditation"
            className="relative w-full drop-shadow-[0_18px_20px_rgba(0,0,0,0.28)]"
          />
        </div>

        <p className="mx-auto mt-5 max-w-sm font-hand text-xl leading-tight text-accent">
          &ldquo;Every quest begins the same way &mdash; someone says,
          &lsquo;I have an idea&hellip;&rsquo;&rdquo;
        </p>

        <h1 className="mt-6 font-cinema text-3xl uppercase tracking-[0.04em] text-ink sm:text-4xl">
          Bring me the idea before it&rsquo;s finished.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-stone">
          Add the Accent works with artists, brands, creators, and people
          with something to say but who may not know what it should look
          like yet.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          Sometimes the project starts with a photograph. Sometimes a
          sentence. A song. A story. A half-formed idea sitting in
          somebody&rsquo;s Notes app.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">That&rsquo;s enough to begin.</p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          The goal isn&rsquo;t to make something that simply looks good.
          It&rsquo;s to find the detail, perspective, or story that makes
          the work unmistakably yours, then give it form.
        </p>

        <p className="mx-auto mt-6 max-w-xl font-serif text-xl italic leading-snug text-ink sm:text-2xl">
          The difference is you. Let&rsquo;s make it visible.
        </p>
      </section>

      {/* Cover & Key Art — the treasure Kenji speaks of, so it gets the
          gold-and-bronze card the rest of the offerings don't. */}
      <section
        id="cover-key-art"
        className="paper-journal-dark corner-box mt-10 scroll-mt-24 rounded-xl border border-black/30 px-7 py-10 text-center text-[#e7ded2] shadow-lg sm:px-10"
        style={{
          background:
            "linear-gradient(135deg, #b9724a 0%, #6b4028 55%, #3a2415 100%)",
        }}
      >
        <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-[#f6e0bd]">
          <span className="h-px w-8 bg-[#e7ded2]/30" />
          <span>The Treasure &mdash; Cover &amp; Key Art</span>
          <span className="h-px w-8 bg-[#e7ded2]/30" />
        </div>
        <h2 className="mt-4 font-display text-2xl uppercase tracking-tight text-white sm:text-3xl">
          Give the project a world before anyone presses play.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[#e7ded2]/90">
          Cover artwork and key visuals for music, podcasts, films,
          editorial projects, campaigns, and creative releases.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-[#e7ded2]/90">
          Concept development, composition, typography, image treatment,
          and final artwork are shaped around the story behind the
          project rather than a template.
        </p>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-[#f6e0bd]/80">
          Good for
        </p>
        <ul className="mx-auto mt-3 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-[#e7ded2]/90">
          {GOOD_FOR.cover.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="h-1 w-1 shrink-0 rounded-full bg-[#f6e0bd]"
              />
              {item}
            </li>
          ))}
        </ul>
        <ServiceCTA presetType="Cover / Key Art">Start a Project</ServiceCTA>
      </section>

      {/* Visual Storytelling */}
      <section
        id="visual-storytelling"
        className="paper-journal corner-box mt-10 scroll-mt-24 rounded-xl border border-ink/15 bg-card px-7 py-10 text-center sm:px-10"
      >
        <SectionLabel>Visual Storytelling</SectionLabel>
        <h2 className={headingClass}>
          Not just a picture. A point of view.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-stone">
          Conceptual portraits, composites, and narrative visuals built
          around an idea, memory, person, or story.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          This is where photography, design, surrealism, and art
          direction can collide a little.
        </p>
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
        <h2 className={headingClass}>
          You know what you&rsquo;re trying to say. You just
          can&rsquo;t see it yet.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-stone">
          For artists, creators, and growing brands who need help turning
          scattered ideas into a clearer creative world.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          We&rsquo;ll work through the story, positioning, visual
          language, tone, references, and creative direction until the
          pieces begin to feel like they belong to the same universe.
        </p>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-accent">
          Good for
        </p>
        <GoodForList items={GOOD_FOR.direction} />
        <ServiceCTA presetType="Creative Direction / Brand Story">
          Start a Conversation
        </ServiceCTA>
      </section>

      {/* Selected Commissioned Work */}
      <section
        id="selected-work"
        className="mt-14 scroll-mt-24 text-center"
      >
        <SectionLabel>Selected Commissioned Work</SectionLabel>
        <p className="mx-auto mt-4 max-w-md text-stone">
          A few things that began the same way most good projects do:
          with somebody saying,
        </p>
        <p className="mt-1 font-serif text-xl italic text-ink">
          &ldquo;I have an idea&hellip;&rdquo;
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FEATURED_WORK.map((piece) => (
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
          className="mt-8 inline-block font-mono text-xs font-bold uppercase tracking-widest text-accent hover:underline"
        >
          See More Design &rarr;
        </Link>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="paper-notebook corner-box mt-14 scroll-mt-24 rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10"
      >
        <SectionLabel>How It Works</SectionLabel>
        <h2 className={`${headingClass} text-center`}>Simple.</h2>
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
        <p className="mx-auto mt-4 max-w-md text-center text-stone">
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
