import Link from "next/link";
import { getAllEntries, getSelectedWork, formatDate } from "@/lib/content";
import HeroCarousel from "@/components/HeroCarousel";
import EntryBadge from "@/components/EntryBadge";
import PaperClip from "@/components/PaperClip";
import JournalEntryCard from "@/components/JournalEntryCard";
import VoiceClip from "@/components/VoiceClip";
import RadioBanner from "@/components/RadioBanner";
import WordOfTheDay from "@/components/WordOfTheDay";

export default function HomePage() {
  const portfolio = getSelectedWork().slice(0, 3);
  const featuredSlugs = new Set(portfolio.map((e) => e.slug));
  const journal = getAllEntries("journal")
    .filter((e) => !featuredSlugs.has(e.slug))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-6">
      <figure className="mt-12 text-center text-white">
        <blockquote className="whitespace-nowrap font-serif italic leading-snug text-[min(calc((100vw-3rem)/38),1.2rem)]">
          &ldquo;The goal of an artist is to create the definitive work that
          cannot be surpassed.&rdquo;
        </blockquote>
        <figcaption className="mt-1 font-serif not-italic text-white/70 text-[min(calc((100vw-3rem)/52),0.8rem)]">
          &mdash; George Bernard Shaw
        </figcaption>

        <div className="relative mx-auto mt-10 w-full max-w-sm md:max-w-2xl">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-stretch md:gap-4">
            <div className="relative w-full max-w-sm md:w-[360px] md:max-w-[360px] md:shrink-0">
              {/* Hand-drawn note pointing at the intro clip — desktop
                  only, where there's room in the gutter beside the
                  track. Positioned against this column specifically so
                  the banner beside it doesn't throw off the vertical
                  centering. */}
              <div className="pointer-events-none absolute right-full top-1/2 mr-2 hidden -translate-y-1/2 select-none items-center gap-1.5 md:flex">
                <span className="whitespace-nowrap text-right font-hand text-[17px] font-semibold leading-[1.15] -rotate-[4deg] text-white/90 [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.35))]">
                  a brief intro
                  <br />
                  from yours truly!
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="point-bounce h-5 w-5 shrink-0 text-white/95 [filter:url(#urban-sketch)]"
                  aria-hidden="true"
                >
                  <path d="M3 12h16" />
                  <path d="M13 6l7 6-7 6" />
                </svg>
              </div>

              <VoiceClip
                src="/audio/the-difference-is-you.mp3"
                label="The difference is you"
              />

              {/* Mobile: a stuck-on note under the clip, with an arrow
                  nudging up toward the play button. Replaces the gutter
                  note where there's no room beside the track. */}
              <div className="mt-3.5 flex justify-start md:hidden">
                <div className="relative ml-1 inline-block max-w-[15rem] -rotate-2 rounded-[3px] bg-[#f2e6a6] px-3 pb-2 pt-2.5 text-left shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
                  <span
                    aria-hidden="true"
                    className="absolute -top-2 left-6 h-4 w-12 -rotate-6 bg-white/40 shadow-sm"
                  />
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="point-bounce-up absolute -top-6 left-[22px] h-6 w-6 text-white/95 [filter:url(#urban-sketch)]"
                    aria-hidden="true"
                  >
                    <path d="M12 21V4" />
                    <path d="M6 11l6-7 6 7" />
                  </svg>
                  <span className="font-hand text-[16px] font-semibold leading-[1.15] text-[#4b3f24]">
                    a brief intro from yours truly!
                  </span>
                </div>
              </div>
            </div>

            <RadioBanner />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-5 text-white/95 [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.3))]">
          {/* The #urban-sketch roughen filter lives in app/layout.jsx. */}
          {/* Camera → Instagram */}
          <a
            href="https://www.instagram.com/addtheaccent"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Add the Accent on Instagram"
            className="icon-hover-pop inline-block"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 -rotate-[7deg] [filter:url(#urban-sketch)]" aria-hidden="true">
              <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7H7l1.4-2h7.2L18 7h1.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
              <circle cx="12" cy="12.75" r="3.3" />
            </svg>
          </a>
          {/* Pencil */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-pop h-5 w-5 rotate-[4deg] [filter:url(#urban-sketch)]" aria-hidden="true">
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
            <path d="M14 6l3 3" />
          </svg>
          {/* Podcast microphone */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="icon-hover-pop h-5 w-5 -rotate-[3deg] [filter:url(#urban-sketch)]" aria-hidden="true">
            <rect x="9" y="2.5" width="6" height="11" rx="3" />
            <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
            <path d="M12 17.5V21" />
            <path d="M8.5 21h7" />
          </svg>
          {/* Music note → Green Maize's Station on Apple Music */}
          <a
            href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Listen to Green Maize's Station on Apple Music"
            className="icon-hover-pop inline-block"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 rotate-[8deg] [filter:url(#urban-sketch)]" aria-hidden="true">
              <path d="M9 17.5V5l11-2v12.5" />
              <circle cx="6" cy="17.5" r="3" />
              <circle cx="17" cy="15.5" r="3" />
            </svg>
          </a>
        </div>

        <p className="gleam-natural mt-11 font-oldenglish text-xl leading-tight sm:text-2xl">
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
              Your <span className="gold-foil">perspective</span> is
            </span>
            <span className="block font-playfair text-4xl font-bold not-italic sm:text-5xl md:text-6xl lg:text-[64px]">
              the masterpiece.
            </span>
            <span className="mt-2 block font-playfair text-4xl font-bold not-italic sm:text-5xl md:text-6xl lg:text-[64px]">
              Everything else
            </span>
            <span className="block font-playfair text-4xl font-bold not-italic sm:text-5xl md:text-6xl lg:text-[64px]">
              is the <span className="gold-foil">medium</span>.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-center italic leading-snug text-white">
            <span className="block md:whitespace-nowrap">
              <span className="font-playfair text-lg font-bold text-[#4a3814]">Add the Accent</span> is a
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

      <WordOfTheDay />

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
            href="/journal?series=Homebody"
            className="group relative block overflow-hidden"
            aria-label="Read the Homebody series"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/homebody-feature.jpg"
              alt="Homebody series"
              className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#e7ded2] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
              Read the series &rarr;
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
        <section className="paper-notebook corner-box relative mb-10 rounded-xl border border-ink/15 bg-card px-7 py-8 sm:px-9">
          {/* A horizontal pen, stretched to the box's own width, laid
              across the seam where the last feature box ends — half
              resting on this box's top edge, like something set down on
              the desk between two stacks of work. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 -top-3 z-20 sm:inset-x-9"
          >
            <svg
              viewBox="0 0 640 34"
              preserveAspectRatio="none"
              className="h-6 w-full drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)]"
            >
              <rect x="35" y="12" width="500" height="11" rx="5.5" fill="#1a1a1a" />
              <rect x="35" y="12" width="500" height="3.5" rx="1.75" fill="#4a4a4a" opacity="0.6" />
              <rect x="58" y="9" width="15" height="17" rx="2" fill="#af691e" />
              <rect x="12" y="15" width="28" height="6" rx="3" fill="#af691e" />
              <polygon points="533,10 615,17.5 533,25" fill="#e6e6e6" stroke="#8b8f93" strokeWidth="1" />
              <line x1="546" y1="14" x2="598" y2="17.5" stroke="#6b6f73" strokeWidth="1" />
              <line x1="546" y1="21" x2="598" y2="17.5" stroke="#6b6f73" strokeWidth="1" />
            </svg>
          </span>

          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
            <span>Section 01</span>
            <span className="h-px flex-1 bg-accent/40" />
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <h2 className="sketch-heading relative -rotate-1 inline-block cursor-default font-hand text-4xl font-bold text-ink sm:text-5xl">
              Selected Work
              <svg
                aria-hidden="true"
                viewBox="0 0 100 14"
                preserveAspectRatio="none"
                className="pointer-events-none absolute -bottom-1 left-0 h-3.5 w-full overflow-visible"
              >
                <path
                  d="M2 8 Q 20 3 38 7 T 70 6 T 98 5"
                  fill="none"
                  stroke="#af691e"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength="1"
                  className="sketch-underline"
                />
              </svg>
            </h2>
            <Link
              href="/portfolio"
              className="shrink-0 font-mono text-xs uppercase tracking-widest text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="mt-8 space-y-8 border-t border-ink/10 pt-8">
            {portfolio.map((entry, i) => (
              <li key={entry.slug}>
                <Link
                  href={`/journal/${entry.slug}`}
                  className={`note-card corner-box group relative block rounded-md border border-ink/15 px-7 py-6 shadow-md transition-transform duration-200 hover:-translate-y-0.5 sm:px-9 ${
                    i % 2 === 0 ? "-rotate-[0.4deg]" : "rotate-[0.4deg]"
                  }`}
                >
                  <PaperClip />
                  <EntryBadge entry={entry} className="block" />
                  <h3 className="flex items-center gap-2 font-serif text-xl text-ink transition-colors group-hover:text-accent">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/icons/pencil-icon.png"
                      alt=""
                      aria-hidden="true"
                      className="h-[1em] w-auto shrink-0"
                    />
                    {entry.titleHtml ? (
                      <span dangerouslySetInnerHTML={{ __html: entry.titleHtml }} />
                    ) : (
                      <span>{entry.title}</span>
                    )}
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
        <section className="paper-crinkled corner-box relative mb-16 rounded-xl border border-ink/15 bg-card px-7 py-8 sm:px-9">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#4a5714]">
            <span>Section 02</span>
            <span className="h-px flex-1 bg-[#4a5714]/40" />
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <h2 className="sketch-heading relative -rotate-1 inline-block cursor-default font-hand text-4xl font-bold text-ink sm:text-5xl">
              Journal
              <svg
                aria-hidden="true"
                viewBox="0 0 100 14"
                preserveAspectRatio="none"
                className="pointer-events-none absolute -bottom-1 left-0 h-3.5 w-full overflow-visible"
              >
                <path
                  d="M2 8 Q 20 3 38 7 T 70 6 T 98 5"
                  fill="none"
                  stroke="#4a5714"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength="1"
                  className="sketch-underline"
                />
              </svg>
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
                <JournalEntryCard entry={entry} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
