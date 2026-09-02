export const metadata = { title: "About — Add the Accent" };

const PRINCIPLES = [
  "Your history affects the way you see.",
  "Your taste affects the way you choose.",
  "Your voice affects the way you communicate.",
  "Your presence affects the energy of a space.",
  "Your lived experience gives you something no one else can duplicate exactly.",
];

const EXPRESSIONS = [
  "Design",
  "Photography",
  "Copywriting & Journals",
  "Film",
  "Shop",
  "Bon Roux",
];

const TAGLINES = [
  "Add what only you can.",
  "Make your presence part of the work.",
  "Your point of view changes everything.",
  "Leave the part only you could leave.",
  "Different medium. Same signature.",
  "The detail that makes it yours.",
  "Not more noise. More you.",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* Hero */}
      <section className="corner-box rounded-xl border border-ink/15 bg-card px-7 py-10 sm:px-10 sm:py-12">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
          <span>About</span>
          <span className="h-px flex-1 bg-accent/40" />
        </div>
        <h1 className="mt-4 font-display text-3xl uppercase leading-tight tracking-tight text-ink sm:text-4xl">
          Add the Accent
        </h1>
        <p className="mt-5 text-center font-serif text-2xl italic leading-snug text-ink sm:text-3xl">
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

      {/* The core idea */}
      <section className="corner-box mt-10 rounded-xl border border-ink/15 bg-card px-7 py-9 sm:px-9">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-moss">
          <span>Section 01</span>
          <span className="h-px flex-1 bg-moss/40" />
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">
          The Core Idea
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-center text-stone">
          Creative work is not ultimately about a logo, photograph, article,
          film, garment, or product. Those are the mediums. The real value is
          the perspective behind them. Two people can have access to the same
          camera, software, blank page, room, or opportunity and create
          completely different outcomes.
        </p>
        <p className="mt-5 text-center font-serif text-xl italic text-ink">
          The difference is the accent.
        </p>
      </section>

      {/* What it means */}
      <section className="corner-box mt-10 rounded-xl border border-ink/15 bg-card px-7 py-9 sm:px-9">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
          <span>Section 02</span>
          <span className="h-px flex-1 bg-accent/40" />
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">
          What &ldquo;Add the Accent&rdquo; Means
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-center text-stone">
          To add the accent is to bring your own particular touch and essence
          into whatever you are doing. It is the decision to participate in
          life as yourself instead of simply repeating what already exists.
        </p>
        <ul className="mt-6 space-y-2 border-t border-ink/10 pt-6">
          {PRINCIPLES.map((line) => (
            <li key={line} className="flex gap-3 text-stone">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6 max-w-xl text-center text-stone">
          The goal is not to force originality for originality&rsquo;s sake.
          It is to uncover what is authentic, specific, and memorable, then
          give it form.
        </p>
      </section>

      {/* Guiding principle */}
      <section className="corner-box mt-10 rounded-xl border border-black/30 px-7 py-9 text-[#e7ded2] shadow-lg sm:px-10 sm:py-11"
        style={{
          background:
            "linear-gradient(135deg, #b9724a 0%, #6b4028 55%, #3a2415 100%)",
        }}
      >
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#e7ded2]/80">
          <span>Section 03</span>
          <span className="h-px flex-1 bg-[#e7ded2]/30" />
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase tracking-tight text-white sm:text-3xl">
          The Guiding Principle
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-center font-serif text-xl italic leading-snug">
          &ldquo;You are not selling a pile of creative services. You are
          building a point of view people can enter through different
          doors.&rdquo;
        </p>
        <p className="mx-auto mt-5 max-w-xl text-center text-[#e7ded2]/90">
          That distinction gives Add the Accent enough room to grow without
          feeling random. As new interests, products, collaborations, or
          forms of storytelling emerge, they can belong to the same world as
          long as they carry the same philosophy: bring something
          unmistakably yours.
        </p>
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#e7ded2]/20 pt-6 font-mono text-xs uppercase tracking-widest text-[#e7ded2]/80">
          {EXPRESSIONS.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      {/* In JT's own words */}
      <section className="corner-box mt-10 rounded-xl border border-ink/15 bg-card px-7 py-9 sm:px-9">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-moss">
          <span>Section 04</span>
          <span className="h-px flex-1 bg-moss/40" />
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">
          How I&rsquo;d Explain It
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-center font-serif text-lg italic leading-relaxed text-ink">
          &ldquo;For me, the accent is that part of you that nobody else can
          duplicate. It&rsquo;s your taste, your story, your eye, your
          voice. So Add the Accent became the umbrella for everything I
          create, whether that&rsquo;s design, photography, writing, film, or
          apparel. The medium can change, but the point of view is still
          mine.&rdquo;
        </p>
      </section>

      {/* Tagline chips */}
      <section className="mt-10 flex flex-wrap gap-2">
        {TAGLINES.map((line) => (
          <span
            key={line}
            className="rounded-full border border-ink/20 bg-card px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-stone"
          >
            {line}
          </span>
        ))}
      </section>
    </div>
  );
}
