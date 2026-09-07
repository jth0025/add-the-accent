import Link from "next/link";
import { getAllEntries, formatDate } from "@/lib/content";
import HeroCarousel from "@/components/HeroCarousel";
import EntryBadge from "@/components/EntryBadge";
import PaperClip from "@/components/PaperClip";
import VoiceClip from "@/components/VoiceClip";

export default function HomePage() {
  const portfolio = getAllEntries("portfolio").slice(0, 3);
  const journal = getAllEntries("journal").slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-6">
      <figure className="mt-12 text-center text-white">
        <blockquote className="whitespace-nowrap font-serif italic leading-snug text-[clamp(0.5rem,2.05vw,1.125rem)]">
          &ldquo;The goal of an artist is to create the definitive work that
          cannot be surpassed.&rdquo;
        </blockquote>
        <figcaption className="mt-1 font-serif text-sm not-italic text-white/70">
          &mdash; George Bernard Shaw
        </figcaption>

        <VoiceClip
          src="/audio/the-difference-is-you.mp3"
          label="The difference is you"
        />

        <div
          className="mt-6 flex items-center justify-center gap-5 text-white/95 [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.3))]"
          role="img"
          aria-label="Photography, writing, podcasting, and music"
        >
          {/* Shared hand-drawn "urban sketch" roughen filter — a low-frequency
              turbulence displacement warps the otherwise-geometric strokes so
              they read as loose ink-pen lines rather than icon-set vectors. */}
          <svg width="0" height="0" className="absolute" aria-hidden="true">
            <defs>
              <filter id="urban-sketch" x="-35%" y="-35%" width="170%" height="170%">
                <feTurbulence type="fractalNoise" baseFrequency="0.055 0.07" numOctaves="3" seed="7" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.6" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>

          {/* Camera */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 -rotate-[7deg] [filter:url(#urban-sketch)]" aria-hidden="true">
            <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7H7l1.4-2h7.2L18 7h1.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
            <circle cx="12" cy="12.75" r="3.3" />
          </svg>
          {/* Pencil */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 rotate-[4deg] [filter:url(#urban-sketch)]" aria-hidden="true">
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
            <path d="M14 6l3 3" />
          </svg>
          {/* Podcast microphone */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 -rotate-[3deg] [filter:url(#urban-sketch)]" aria-hidden="true">
            <rect x="9" y="2.5" width="6" height="11" rx="3" />
            <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
            <path d="M12 17.5V21" />
            <path d="M8.5 21h7" />
          </svg>
          {/* Music note */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 rotate-[8deg] [filter:url(#urban-sketch)]" aria-hidden="true">
            <path d="M9 17.5V5l11-2v12.5" />
            <circle cx="6" cy="17.5" r="3" />
            <circle cx="17" cy="15.5" r="3" />
          </svg>
        </div>

        <p className="mt-7 font-oldenglish text-2xl leading-tight text-[#5c5b55] [text-shadow:0_1px_3px_rgba(0,0,0,0.6)] sm:text-3xl">
          This is all a true story.
        </p>
      </figure>

      <HeroCarousel>
        <div className="relative">
          <div className="text-center font-mono text-xs uppercase tracking-widest text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.75),0_0_10px_rgba(255,255,255,0.25)]">
            <span className="italic">The difference is you!</span>
          </div>
          <h1 className="mt-4 text-center normal-case leading-none tracking-tighter text-white">
            <span className="block font-playfair text-4xl font-bold not-italic sm:text-5xl md:text-6xl lg:text-[64px]">
              Your perspective is
            </span>
            <span className="block font-playfair text-4xl font-bold not-italic sm:text-5xl md:text-6xl lg:text-[64px]">
              the masterpiece.
            </span>
            <span className="mt-2 block font-playfair text-4xl font-bold not-italic sm:text-5xl md:text-6xl lg:text-[64px]">
              Everything else
            </span>
            <span className="block font-playfair text-4xl font-bold not-italic sm:text-5xl md:text-6xl lg:text-[64px]">
              is the medium.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-center italic leading-snug text-white">
            <span className="block md:whitespace-nowrap">
              <span className="font-playfair font-bold text-lg text-black">Add the Accent</span> is a
              multidisciplinary creative studio built on one belief:
            </span>
            <span
              className="mx-6 mt-2 block font-bold sm:mx-10"
              style={{ textWrap: "balance" }}
            >
              every person, brand, and idea has something only it can
              contribute. Through design, writing, photography, film, and
              apparel, we bring that difference to the surface and give it
              form.
            </span>
          </p>
          <p className="mt-5 text-center font-serif text-lg italic text-white">
            &ldquo;It&rsquo;s about finding and leaving the mark only you can make.&rdquo;
          </p>
        </div>
      </HeroCarousel>

      <div className="mt-10 flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
        <span className="text-white [text-shadow:0_1px_2px_rgba(0,0,0,.35)]">
          Features
        </span>
        <span className="h-px flex-1 bg-white/35" />
      </div>

      <section className="py-6">
        <div
          className="corner-box overflow-hidden rounded-xl border border-black/30 shadow-lg"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(231,222,210,.08) 0, rgba(231,222,210,.08) 1px, transparent 1px, transparent 27px), linear-gradient(to right, transparent 0, transparent 34px, rgba(224,168,96,.4) 34px, rgba(224,168,96,.4) 35px, transparent 35px), linear-gradient(135deg, #b9724a 0%, #6b4028 55%, #3a2415 100%)",
            backgroundRepeat: "repeat, no-repeat, no-repeat",
          }}
        >
          <Link
            href="/portfolio"
            className="group relative block overflow-hidden"
            aria-label="View the Homebody case studies"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/homebody-feature.jpg"
              alt="Homebody series"
              className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#e7ded2] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              View the case studies &rarr;
            </span>
          </Link>
          <div className="paper-notebook bg-white border-t border-ink/15 px-8 py-8 sm:px-10">
            <p className="text-left font-playfair text-lg leading-snug text-ink sm:text-xl">
              <span className="font-bold italic">Homebody</span> is a
              visual storytelling series exploring masculinity, identity,
              vulnerability, and the quiet pressures of becoming. Presented
              as a creative case study, the project examines how concept,
              art direction, design, and narrative can work together to
              turn personal experience into a cohesive cultural story; a
              journey to healing.
            </p>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div
          className="corner-box overflow-hidden rounded-xl border border-black/30 shadow-lg"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(231,222,210,.08) 0, rgba(231,222,210,.08) 1px, transparent 1px, transparent 27px), linear-gradient(to right, transparent 0, transparent 34px, rgba(224,168,96,.4) 34px, rgba(224,168,96,.4) 35px, transparent 35px), linear-gradient(135deg, #b9724a 0%, #6b4028 55%, #3a2415 100%)",
            backgroundRepeat: "repeat, no-repeat, no-repeat",
          }}
        >
          <Link
            href="/journal?series=Domain%20Expansion"
            className="group relative block overflow-hidden"
            aria-label="Read the Domain Expansion series"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/domain-expansion-feature.jpg"
              alt="Domain Expansion series"
              className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#e7ded2] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              Read the series &rarr;
            </span>
          </Link>
          <div className="paper-notebook bg-white border-t border-ink/15 px-8 py-8 sm:px-10">
            <p className="text-left font-playfair text-lg leading-snug text-ink sm:text-xl">
              A <span className="font-bold italic">Homebody</span> Series
              details the accounts of reimagining a new home; inspired by
              the tale of the stoic majestic black samurai, Kenji; in
              pursuit of a distant treasure, a symbol of enlightenment,
              self-awareness, and the power buried within. His path becomes
              a bridge, shaped by every trial, every truth, and every piece
              of himself he learns to reclaim.
            </p>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div
          className="corner-box overflow-hidden rounded-xl border border-black/30 shadow-lg"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(231,222,210,.08) 0, rgba(231,222,210,.08) 1px, transparent 1px, transparent 27px), linear-gradient(to right, transparent 0, transparent 34px, rgba(224,168,96,.4) 34px, rgba(224,168,96,.4) 35px, transparent 35px), linear-gradient(135deg, #b9724a 0%, #6b4028 55%, #3a2415 100%)",
            backgroundRepeat: "repeat, no-repeat, no-repeat",
          }}
        >
          <Link
            href="/journal?series=Back%20to%20Oui"
            className="group relative block overflow-hidden"
            aria-label="Read the Back to Oui series"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/back-to-oui-cover-wide.jpg"
              alt="Back to Oui series"
              className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#e7ded2] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              Read the series &rarr;
            </span>
          </Link>
          <div className="paper-notebook bg-white border-t border-ink/15 px-8 py-8 sm:px-10">
            <p className="text-left font-playfair text-lg leading-snug text-ink sm:text-xl">
              &ldquo;<span className="font-bold italic">Back to Oui</span>
              &rdquo; traces the distance between love and despair;
              loneliness and belonging; agreeing and retreating. Through
              loss, faith, and self-discovery, it explores how becoming
              whole within can make what we build together more powerful.
            </p>
          </div>
        </div>
      </section>

      {portfolio.length > 0 && (
        <section className="paper-notebook corner-box mb-10 rounded-xl border border-ink/15 bg-card px-7 py-8 sm:px-9">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
            <span>Section 01</span>
            <span className="h-px flex-1 bg-accent/40" />
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">
              Portfolio
            </h2>
            <Link
              href="/portfolio"
              className="shrink-0 font-mono text-xs uppercase tracking-widest text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="mt-8 space-y-8 border-t border-ink/10 pt-8">
            {portfolio.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/portfolio/${entry.slug}`} className="group block">
                  <h3 className="font-serif text-xl text-ink group-hover:text-accent">
                    {entry.title}
                  </h3>
                  {entry.date && (
                    <p className="mt-1 font-mono text-xs uppercase tracking-wide text-stone/60">
                      {formatDate(entry.date)}
                    </p>
                  )}
                  {entry.excerpt && (
                    <p className="mt-2 text-stone">{entry.excerpt}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {journal.length > 0 && (
        <section className="paper-crinkled corner-box mb-16 rounded-xl border border-ink/15 bg-card px-7 py-8 sm:px-9">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#4a5714]">
            <span>Section 02</span>
            <span className="h-px flex-1 bg-[#4a5714]/40" />
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl uppercase tracking-tight text-ink sm:text-3xl">
              Journal
            </h2>
            <Link
              href="/journal"
              className="shrink-0 font-mono text-xs uppercase tracking-widest text-[#4a5714] hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="mt-8 space-y-8 border-t border-ink/10 pt-8">
            {journal.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/journal/${entry.slug}`}
                  className="paper-crinkled corner-box group block rounded-xl border border-ink/15 bg-card px-7 py-6 transition-colors hover:border-ink/30 sm:px-9"
                >
                  <PaperClip />
                  <EntryBadge entry={entry} className="block" />
                  <h3 className="flex items-center gap-2 font-serif text-xl text-ink transition-colors group-hover:text-[#2e8b3d]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/icons/pencil-icon.png"
                      alt=""
                      aria-hidden="true"
                      className="h-[1em] w-auto shrink-0"
                    />
                    <span>{entry.title}</span>
                  </h3>
                  {entry.date && (
                    <p className="mt-1 font-mono text-xs uppercase tracking-wide text-stone/60">
                      {formatDate(entry.date)}
                    </p>
                  )}
                  {entry.excerpt && (
                    <p className="mt-2 text-stone">{entry.excerpt}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
