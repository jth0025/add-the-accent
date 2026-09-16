import Link from "next/link";
import PaperClip from "@/components/PaperClip";

export const metadata = { title: "About — Add the Accent" };

// Rewritten as profound, centered lines for Section 02.
const PRINCIPLES = [
  "What you have lived becomes how you look.",
  "Your taste is memory, quietly choosing.",
  "Your presence changes a room before you speak.",
  "The mark you leave is made of everything that made you.",
  "No one else will ever arrive exactly as you.",
];

// Each expression carries a sketch icon; Shop and Bon Roux aren't live yet.
const EXPRESSIONS = [
  { label: "Design", icon: "brush", rotate: -6, available: true },
  { label: "Photography", icon: "camera", rotate: 4, available: true },
  { label: "Copywriting & Journals", icon: "pencil", rotate: -3, available: true },
  { label: "Film", icon: "clapper", rotate: 5, available: true },
  { label: "Shop", icon: "bag", rotate: -4, available: false },
  { label: "Bon Roux", icon: "bottle", rotate: 6, available: false },
];

// Loose ink-line icons, matched to the ones on the home page.
const ICON_PATHS = {
  brush: (
    <>
      <path d="M14 3.5 20.5 10 12.5 18 6 11.5Z" />
      <path d="M6 11.5c-2.4 2.2-2.6 6.8-2.6 6.8s4.6-.2 6.8-2.6" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7H7l1.4-2h7.2L18 7h1.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="12.75" r="3.3" />
    </>
  ),
  pencil: (
    <>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
      <path d="M14 6l3 3" />
    </>
  ),
  clapper: (
    <>
      <rect x="3" y="9" width="18" height="12" rx="1.5" />
      <path d="M3 9 6.5 4l3.5 4 3-4.5 3.5 4 3-4.5" />
    </>
  ),
  bag: (
    <>
      <path d="M6 8h12l1 11.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  bottle: (
    <>
      <path d="M10 3h4v3.2l1.4 2.3a3 3 0 0 1 .6 1.8v8.2a2.5 2.5 0 0 1-2.5 2.5h-2A2.5 2.5 0 0 1 9 20.5v-8.2a3 3 0 0 1 .6-1.8L11 8.2V3" />
      <path d="M9.5 13h5" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21" />
      <path d="M8.5 21h7" />
    </>
  ),
  music: (
    <>
      <path d="M9 17.5V5l11-2v12.5" />
      <circle cx="6" cy="17.5" r="3" />
      <circle cx="17" cy="15.5" r="3" />
    </>
  ),
  tennis: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M5 6.5c2.5 2 2.5 9 0 11" />
      <path d="M19 6.5c-2.5 2-2.5 9 0 11" />
    </>
  ),
};

// Small icon row for the Hero section, standing in for a "who I am" at a
// glance: pulled straight from the Profile bio and quick facts rather
// than a generic set — photography, writing, podcasting, music, tennis,
// and film all show up there by name.
const IDENTITY_ICONS = [
  { name: "camera", label: "Photography", rotate: -6 },
  { name: "pencil", label: "Writing", rotate: 4 },
  { name: "mic", label: "Podcasting", rotate: -3 },
  { name: "music", label: "Music", rotate: 6 },
  { name: "tennis", label: "Tennis", rotate: -5 },
  { name: "clapper", label: "Film", rotate: 4 },
];

function ExprIcon({ name, rotate, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 shrink-0 [filter:url(#urban-sketch)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

// Editorial bio block — quick facts, mirroring the short tag lines in the
// "Portrait Mode" layout sketch used as the reference for this section.
const QUICK_FACTS = [
  "Houston Native",
  "Founder, Add the Accent",
  "Certified Band Nerd",
  "R&B Head",
  "Everything Tennis",
  "Movie Buff",
  "Consummate Conversationalist",
  "Property Manager & Operations",
  "University of North Texas — RTVF",
  "Phantom Regiment Alum",
];

// Areas of expertise — the creative practice and the day job, presented
// as one skill set rather than two, echoing "My Skills." reference blocks.
const SKILL_GROUPS = [
  {
    label: "Creative & Brand",
    skills: [
      "Design",
      "Photography",
      "Film & Video Direction",
      "Copywriting & Journals",
      "Writer",
      "Copywriter",
      "Podcaster",
      "Brand & Content Strategy",
      "Multidisciplinary Art Direction",
    ],
  },
  {
    label: "Property & Operations",
    skills: [
      "Multi-Site Portfolio Management",
      "Budget Preparation & P&L Oversight",
      "Lease Administration & CAM Reconciliation",
      "Vendor & Contract Management",
      "Financial Reporting & Variance Analysis",
      "Team Leadership & Training",
      "Resident & Tenant Relations",
      "Regulatory & Fair Housing Compliance",
    ],
  },
];

// Sticky-note taglines, each with its own color and a hand-placed tilt.
const NOTES = [
  { text: "Add what only you can.", color: "#fde68a", rotate: -6 },
  { text: "Make your presence part of the work.", color: "#bfdbfe", rotate: 4 },
  { text: "Your point of view changes everything.", color: "#bbf7d0", rotate: -3 },
  { text: "Leave the part only you could leave.", color: "#fbcfe8", rotate: 7 },
  { text: "Different medium. Same signature.", color: "#fed7aa", rotate: -8 },
  { text: "The detail that makes it yours.", color: "#fde68a", rotate: 3 },
  { text: "Not more noise. More you.", color: "#ddd6fe", rotate: -4 },
];

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

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Hero */}
      <section className="paper-fold-thirds corner-box relative rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10 sm:py-12">
        {/* Pinned to the card's own top-left corner, like it's holding
            the whole box shut, rather than just resting on the art. */}
        <PaperClip position="-top-4 left-8 rotate-[7deg]" />
        <SectionLabel>About</SectionLabel>

        {/* Title logo for this block: the wooden "AA" fence with the
            character standing on the second A. Replaces the wordmark. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/fence-logo.png"
          alt="Add the Accent — the character standing on a weathered wooden fence built into a double-A, rooted in soil with sprouting leaves"
          className="mx-auto mt-6 w-[21rem] max-w-full drop-shadow-[0_10px_16px_rgba(0,0,0,0.22)] sm:mt-8 sm:w-[26rem]"
        />

        <p className="mt-6 text-center font-serif text-2xl italic leading-snug text-ink sm:text-3xl">
          &ldquo;Your perspective is the masterpiece. Everything else is the
          medium.&rdquo;
        </p>
        <p className="mx-auto mt-6 max-w-xl text-center text-stone">
          A multidisciplinary creative studio, umbrella brand, and philosophy
          built around the power of individual perspective. Through design,
          writing, photography, film, and apparel, the goal is the same
          every time: bring the difference to the surface and give it form.
        </p>

        {/* A small icon row, "who I am" at a glance — pulled from the
            Profile bio and quick facts rather than generic stand-ins. */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-5 text-ink/80">
          {IDENTITY_ICONS.map((item) => (
            <span
              key={item.name}
              title={item.label}
              className="icon-hover-pop inline-block"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 [filter:url(#urban-sketch)]"
                style={{ transform: `rotate(${item.rotate}deg)` }}
                aria-hidden="true"
              >
                {ICON_PATHS[item.name]}
              </svg>
              <span className="sr-only">{item.label}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Profile — an editorial bio card: portrait, headline, quick facts,
          the full story, and a skills grid. The photo-and-headline row
          reads like a magazine spread page, then drops back into the
          section's normal single column, per the "Portrait Mode" sketch
          reference; the bold headline and italic serif eyebrow mirror the
          type treatment on yvettehaughton.com. */}
      <section className="corner-box relative mt-12 rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10 sm:py-12">
        <SectionLabel>Profile</SectionLabel>

        <div className="mt-8 grid gap-6 sm:grid-cols-[13rem,1fr] sm:items-center sm:gap-10">
          {/* Portrait — the sketch-mode self-portrait, used whole: its own
              grid, frame, and "Portrait Mode — me" caption are already
              part of the piece, so it needs no extra framing here. A leaf
              sits behind its right edge, like it's growing out from
              behind the piece; the camera portrait sits stacked behind
              it too, pushed left and tilted, raised slightly so the main
              photo's own corner lands roughly at its center. Paint order
              (not z-index — a negative z-index here has no closer
              stacking-context ancestor to anchor to, so it renders behind
              the section's own background instead) does the layering:
              leaf, then camera photo, then the main portrait on top. */}
          <div className="relative mx-auto w-56 sm:mx-0 sm:w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/profile-leaf.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-[-3rem] top-[26%] w-32 -rotate-6 drop-shadow-[0_8px_14px_rgba(0,0,0,0.25)] sm:right-[-3.5rem] sm:w-36"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/jt-portrait-2.jpg"
              alt=""
              aria-hidden="true"
              className="absolute -top-28 -left-14 h-full w-full -rotate-[30deg] rounded-sm object-cover object-top shadow-lg brightness-90 sm:-top-32 sm:-left-16"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/jt-portrait-sketch.jpg"
              alt="A sketch-effect self-portrait of JT on graph paper, captioned 'Portrait Mode — me'"
              className="relative w-full -rotate-1 rounded-sm object-cover shadow-[0_10px_18px_-4px_rgba(0,0,0,0.55),0_25px_45px_-10px_rgba(0,0,0,0.65)]"
            />
          </div>

          {/* Eyebrow + headline, beside the photo like an editorial spread
              page — swapped in from where the quick facts used to sit.
              A rule sits above it, spanning the full column so it reads
              as extending to the end of the title. "By Design" reads as
              a subtitle under "Multi-Hyphenate," in the same gold-foil
              treatment as "perspective" on the home page hero. */}
          <div>
            <div className="h-px w-full bg-ink/15" />
            <p className="mt-3 text-right font-playfair text-[11px] italic text-stone/70 sm:text-sm">
              Toasted by a Texas sun, flavored by a NOLA roux.
            </p>
            <h2 className="mt-2 text-right font-display uppercase leading-[1.05] tracking-tight text-ink text-3xl sm:text-4xl">
              Multi-Hyphenate
            </h2>
            <p className="gold-foil mt-1 text-right font-display uppercase leading-none tracking-tight text-xl sm:text-2xl">
              By Design
            </p>
          </div>
        </div>

        {/* Quick facts — an even two-column grid, dropping back into the
            section's original full-width column where the headline used
            to sit. */}
        <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 border-y border-ink/10 py-5 sm:grid-cols-2">
          {QUICK_FACTS.map((fact) => (
            <li
              key={fact}
              className="flex items-start gap-2 font-mono text-xs uppercase tracking-widest text-stone"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent"
              />
              {fact}
            </li>
          ))}
        </ul>

        {/* The bio copy. On mobile it sits in its own paper-notebook card
            directly under the portrait, echoing the image-then-paper-text
            "Features" layout on the home page; from sm: up it reverts to
            plain text in the section's normal column. The opening "I" is
            a large italic-serif editorial drop cap, and the camera photo
            further down is floated the same way, so the paragraph text
            wraps around both of them rather than sitting in a separate
            row next to just the photo. */}
        <div className="mx-auto mt-7 max-w-2xl space-y-5 text-stone rounded-lg border border-ink/10 bg-white px-5 py-6 shadow-sm paper-notebook sm:mx-0 sm:max-w-none sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none">
          <p>
            <span
              className="float-left mr-3 mt-1 font-serif italic text-7xl leading-[0.7] text-ink sm:text-8xl"
            >
              I
            </span>
            was born and raised in Houston, Texas &mdash; but there was
            always gumbo on the stove. My father carried the city of New
            Orleans with him everywhere he went: its flavor, its rhythm, its
            refusal to do anything quietly. He never sat me down and taught
            any of it to me like a lesson &mdash; he just lived it, loud, in
            our kitchen, in our music, in the way he moved through a room.
            Two cultures were always brewing under one roof, and somewhere
            in that mix is exactly where my eye, and my whole perspective,
            got its flavor.
          </p>
          <p>
            Music was always in the house &mdash; the soundtrack of my life
            started long before I ever became a competitive band kid. But it
            was one black-and-white photography class that changed
            everything, cracking open a door to possibilities I didn&rsquo;t
            know were there. I fell in love with the darkroom: the waiting,
            the development, the process of watching something invisible
            slowly become real. That&rsquo;s where I learned how to develop
            my own vision and actually see it through &mdash; the patience
            it takes, the reward waiting on the other side of it, and the
            discipline to keep cultivating it. Everything I&rsquo;ve made
            since traces back to that room.
          </p>

          <p>
            {/* Secondary photo, now a true float — like the drop cap "I"
                above, the paragraph text wraps around it instead of
                sitting beside it in a separate row. */}
            <span className="float-left mb-2 mr-4 mt-1 rotate-3 rounded-sm border border-black/10 bg-white p-2.5 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/jt-portrait-2.jpg"
                alt="JT holding a vintage Pentax film camera up to his face"
                className="h-40 w-32 object-cover sepia-[0.12]"
              />
            </span>
            I started in property management back in college, and it
              taught me how to actually take care of people and a community
              &mdash; lessons I didn&rsquo;t know I was collecting until
              they started showing up in Homebody, and in the discipline it
              takes to keep any of this honest. That eye followed me all
              the way to California, where I live and work today. It
              doesn&rsquo;t read like the rest of my story until you meet{" "}
              <Link
                href="/journal/land-man"
                className="italic text-accent hover:underline"
              >
                Land Man
              </Link>
              , a piece I wrote about the job itself &mdash; told like a
              superhero standing in a hallway at six in the morning,
              presence as the power and discipline as the whole plot.
              That&rsquo;s the bridge: the same man who checks stairwells
              and answers the phone at eleven at night is the one writing
              the verse, framing the photo, building the brand. It was
              never two lives. It&rsquo;s one instinct, wearing different
              uniforms.
            </p>

          <p className="clear-left">
            Add the Accent itself matriculated in California &mdash; a
            state that&rsquo;s always symbolized leaving the nest to me.
            Leaving comfort was the only way I could actually build a
            platform of truth instead of a performance of one. Your walk
            &mdash; every job, every room, every version of you &mdash;
            belongs in the work. You&rsquo;re not just the artist.
            You&rsquo;re the professional, the human, and the soul, too. We
            already move through all of those roles every day. Owning that,
            on purpose, is the only accountability I&rsquo;m asking of you,
            or of me.
          </p>
        </div>

        {/* Skills grid, mirroring the reference site's "My Skills." block. */}
        <div className="mt-10 border-t border-ink/10 pt-8">
          <p className="text-center font-mono text-xs uppercase tracking-widest text-accent sm:text-left">
            Areas of Expertise
          </p>
          <div className="mt-5 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {SKILL_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="font-serif text-sm italic text-stone/70">
                  {group.label}
                </p>
                <ul className="mt-3 list-none space-y-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-start gap-2.5 text-sm text-ink"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent"
                      />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The core idea */}
      <section className="paper-newspaper corner-box mt-10 rounded-xl border border-ink/15 bg-card px-7 py-9 sm:px-9">
        <SectionLabel tone="text-moss" rule="bg-moss/40">
          Section 01
        </SectionLabel>
        <h2 className={headingClass}>The Core Idea</h2>
        <p className="mx-auto mt-5 max-w-xl text-center text-stone">
          Creative work is not ultimately about a logo, photograph, article,
          film, garment, or product. Those are the mediums. The real value is
          the perspective behind them. Two people can have access to the same
          camera, software, blank page, room, or opportunity and create
          completely different outcomes.
        </p>
        <p className="mt-5 text-center font-serif text-xl italic text-ink">
          The difference is you.
        </p>
      </section>

      {/* Section 02 — Minimalism vs. Maximalism */}
      <section className="paper-journal corner-box mt-10 rounded-xl border border-ink/15 bg-card px-7 py-9 sm:px-9">
        <SectionLabel>Section 02</SectionLabel>
        <h2 className={headingClass}>Minimalism vs. Maximalism</h2>

        {/* reads like a dictionary entry for the title */}
        <p className="mt-2 text-center font-serif text-[13px] italic tracking-[0.35em] text-stone/55">
          ideology
        </p>
        <p className="mx-auto mt-4 max-w-xl text-center font-serif leading-relaxed text-stone">
          &mdash; two dials on one belief. Turn the first down until only what
          is essential remains; turn the second up until every part of you is
          in the room. Add the Accent runs on both. I live closer to the
          second.
        </p>

        <div className="mt-8 border-t border-ink/10 pt-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Minimalism
          </p>
          <p className="mx-auto mt-3 max-w-lg font-serif text-2xl italic leading-snug text-ink sm:text-3xl">
            &ldquo;Add your touch.&rdquo;
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-stone">
            Three words. The whole thing fits there — and some ideas only ring
            true once they&rsquo;re stripped that bare.
          </p>
        </div>

        <div className="mt-8 border-t border-ink/10 pt-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Maximalism
          </p>
          <p className="mx-auto mt-3 max-w-lg font-serif text-2xl italic leading-snug text-ink sm:text-3xl">
            &ldquo;Add all of you.&rdquo;
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-stone">
            History, taste, ear, eye — layered in until the work could only be
            yours. This is the dial I reach for first.
          </p>
        </div>

        <div className="mt-8 border-t border-ink/10 pt-8 text-center">
          <p className="mx-auto max-w-xl font-serif text-lg italic leading-relaxed text-ink">
            I lean maximalist: more texture, more story, more of the thing that
            makes it mine. But I meet the ideas that need it with restraint.
            Same conviction, opposite hands &mdash; and I refuse to pick only
            one.
          </p>
        </div>

        <ul className="mt-8 list-none space-y-5 border-t border-ink/10 pt-8">
          {PRINCIPLES.map((line) => (
            <li
              key={line}
              className="metal-hover flex origin-center items-center justify-center gap-2 whitespace-nowrap text-center font-cinema uppercase leading-none tracking-[0.03em] text-ink transition-transform duration-200 hover:scale-[1.04] text-[clamp(0.56rem,2.5vw,1.25rem)]"
            >
              <span
                aria-hidden="true"
                className="h-1 w-1 shrink-0 rounded-full bg-accent"
              />
              <span className="shrink-0">{line}</span>
            </li>
          ))}
        </ul>

        <figure className="mx-auto mt-10 max-w-xl border-t border-ink/10 pt-8">
          <blockquote className="gleam-quote text-center font-serif text-xl italic leading-snug text-ink sm:text-2xl">
            &ldquo;The goal is not originality for its own sake. It is to find
            what is authentic, specific, and unmistakable — and give it
            form.&rdquo;
          </blockquote>
        </figure>
      </section>

      {/* Guiding principle */}
      <section
        className="paper-journal-dark corner-box mt-10 rounded-xl border border-black/30 px-7 py-9 text-[#e7ded2] shadow-lg sm:px-10 sm:py-11"
        style={{
          background:
            "linear-gradient(135deg, #b9724a 0%, #6b4028 55%, #3a2415 100%)",
        }}
      >
        <SectionLabel tone="text-[#e7ded2]/80" rule="bg-[#e7ded2]/30">
          Section 03
        </SectionLabel>
        <h2 className="mt-3 text-center font-display text-2xl uppercase tracking-tight text-white sm:text-3xl">
          The Guiding Principle
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-center font-serif text-xl italic leading-snug">
          &ldquo;You are not selling a pile of creative services. You are
          building a point of view people can enter through different
          doors.&rdquo;
        </p>

        <svg
          viewBox="0 0 120 176"
          className="mx-auto mt-6 h-36 w-auto text-[#e7ded2] sm:h-40"
          aria-hidden="true"
        >
          <ellipse cx="60" cy="168" rx="33" ry="5" fill="#000" opacity="0.3" />
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="[filter:url(#urban-sketch)]"
          >
            <rect x="24" y="8" width="72" height="152" rx="3" />
            <rect x="34" y="20" width="52" height="52" rx="2" />
            <rect x="34" y="84" width="52" height="60" rx="2" />
            <circle cx="82" cy="90" r="3.4" />
          </g>
        </svg>

        <p className="mx-auto mt-6 max-w-xl text-center text-[#e7ded2]/90">
          That distinction gives Add the Accent enough room to grow without
          feeling random. As new interests, products, collaborations, or
          forms of storytelling emerge, they can belong to the same world as
          long as they carry the same philosophy: bring something
          unmistakably yours.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-[#e7ded2]/20 pt-6 font-mono text-xs uppercase tracking-widest">
          {EXPRESSIONS.map((item) =>
            item.available ? (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 text-[#e7ded2]/85 transition-colors duration-150 hover:text-[#f6e0bd]"
              >
                <ExprIcon name={item.icon} rotate={item.rotate} />
                {item.label}
              </span>
            ) : (
              <span
                key={item.label}
                className="inline-flex cursor-default items-center gap-2 text-[#e7ded2]/30"
                title="Coming soon"
              >
                <ExprIcon name={item.icon} rotate={item.rotate} />
                {item.label}
                <span className="ml-0.5 text-[9px] normal-case tracking-normal text-[#e7ded2]/25">
                  soon
                </span>
              </span>
            ),
          )}
        </div>
      </section>

      {/* In JT's own words */}
      <section className="paper-notebook corner-box mt-10 rounded-xl border border-ink/15 bg-card px-7 py-9 sm:px-9">
        <SectionLabel tone="text-moss" rule="bg-moss/40">
          Section 04
        </SectionLabel>
        <h2 className={headingClass}>How I&rsquo;d Explain It</h2>
        <p className="mx-auto mt-5 max-w-xl text-center font-serif text-lg italic leading-relaxed text-ink">
          &ldquo;For me, the accent is that part of you that nobody else can
          duplicate. It&rsquo;s your taste, your story, your eye, your
          voice. So Add the Accent became the umbrella for everything I
          create, whether that&rsquo;s design, photography, writing, film, or
          apparel. The medium can change, but the point of view is still
          mine.&rdquo;
        </p>
      </section>

      {/* Sticky-note taglines — hand-scrawled and pasted at the bottom */}
      <section className="mt-14 flex flex-wrap items-center justify-center gap-x-3 gap-y-6 pb-4">
        {NOTES.map((note) => (
          <span
            key={note.text}
            className="inline-flex h-36 w-36 items-center justify-center p-4 text-center font-hand text-xl leading-tight text-ink/85 shadow-[3px_5px_10px_rgba(0,0,0,0.28)]"
            style={{
              backgroundColor: note.color,
              transform: `rotate(${note.rotate}deg)`,
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 12%)",
            }}
          >
            {note.text}
          </span>
        ))}
      </section>
    </div>
  );
}
