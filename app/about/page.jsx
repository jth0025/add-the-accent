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
};

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
      <section className="paper-notebook corner-box rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10 sm:py-12">
        <SectionLabel>About</SectionLabel>
        <h1 className="mt-4 text-center font-display text-3xl uppercase leading-tight tracking-tight text-ink sm:text-4xl">
          Add the Accent
        </h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-man.png"
          alt="The Add the Accent character — a figure with a leaf motif, cap, and no face"
          className="mx-auto mt-6 h-[10.4rem] w-auto sm:h-[12.8rem]"
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
      </section>

      {/* Portrait — two overlapping polaroids, no captions */}
      <section className="mt-12 flex justify-center py-4">
        <div className="relative flex items-center">
          <div className="relative z-10 -rotate-6 rounded-sm border border-black/10 bg-white p-3 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/jt-portrait-1.jpg"
              alt="Portrait of JT, the founder of Add the Accent"
              className="h-56 w-44 object-cover sm:h-64 sm:w-52"
            />
          </div>
          <div className="relative z-20 -ml-14 rotate-6 rounded-sm border border-black/10 bg-white p-3 shadow-xl sm:-ml-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/jt-portrait-2.jpg"
              alt="JT holding a vintage Pentax film camera up to his face"
              className="h-56 w-44 object-cover sm:h-64 sm:w-52"
            />
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
          <blockquote className="text-center font-serif text-xl italic leading-snug text-ink sm:text-2xl">
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
