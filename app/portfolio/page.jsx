import Link from "next/link";
import { getSelectedWork } from "@/lib/content";
import JournalEntryCard from "@/components/JournalEntryCard";

export const metadata = { title: "Selected Work — Add the Accent" };

// Puffy 3D cut-outs ringed around the mascot — never over him, the
// cloud, the suitcase, or below the ground he stands on. Each entry is
// a centre point (l, t) and width as a percentage of the scene box, so
// the whole arrangement scales together. Positions were packed to stay
// clear of one another; edit with that in mind.
const SCATTER = [
  { n: "star-outline", l: 19.9, t: 75.7, w: 11.0, r: 5 },
  { n: "comet", l: 56.9, t: 12.5, w: 10.5, r: -1 },
  { n: "sun", l: 20.7, t: 54.2, w: 10.0, r: 6 },
  { n: "crown", l: 67.3, t: 55.5, w: 10.0, r: 11 },
  { n: "moon", l: 32.7, t: 34.5, w: 9.5, r: -9 },
  { n: "sparkle", l: 36.4, t: 13.8, w: 8.8, r: 8 },
  { n: "heart", l: 81.3, t: 76.8, w: 8.8, r: 6 },
  { n: "sunny-side", l: 67.0, t: 28.7, w: 9.0, r: 13 },
  { n: "moon-lg", l: 15.4, t: 34.2, w: 8.2, r: 11 },
  { n: "triangle-coral", l: 21.2, t: 89.3, w: 8.2, r: 1 },
  { n: "star", l: 72.8, t: 14.7, w: 8.2, r: 3 },
  { n: "arc", l: 67.6, t: 69.7, w: 7.8, r: -4 },
  { n: "triangle", l: 82.8, t: 62.7, w: 7.8, r: 7 },
  { n: "arrow", l: 70.7, t: 42.2, w: 7.3, r: -7 },
  { n: "cross", l: 24.1, t: 21.7, w: 7.3, r: -9 },
  { n: "bolt-lg", l: 92.3, t: 76.6, w: 6.3, r: -1 },
  { n: "bolt", l: 9.2, t: 54.1, w: 6.1, r: -8 },
  { n: "bolt-coral", l: 8.0, t: 74.4, w: 6.1, r: 13 },
  { n: "bolt-sm", l: 46.4, t: 12.4, w: 6.1, r: 0 },
  { n: "triangle-sm", l: 81.2, t: 88.8, w: 6.8, r: 6 },
  { n: "star-four", l: 24.5, t: 6.7, w: 5.8, r: -5 },
  { n: "diamond", l: 80.8, t: 27.4, w: 5.4, r: -8 },
  { n: "star-sm", l: 10.9, t: 89.4, w: 4.8, r: -7 },
  { n: "star-four", l: 79.6, t: 41.9, w: 5.2, r: 5 },
  { n: "diamond", l: 82.2, t: 16.1, w: 4.8, r: -1 },
  { n: "raindrop", l: 79.7, t: 51.1, w: 3.9, r: -10 },
  { n: "raindrop", l: 6.4, t: 42.5, w: 3.5, r: 3 },
  { n: "sparkle", l: 93.7, t: 63.7, w: 5.0, r: 11 },
  { n: "star", l: 13.2, t: 22.2, w: 5.4, r: -12 },
  { n: "moon", l: 87.5, t: 52.5, w: 5.6, r: -3 },
  { n: "dot-a", l: 35.5, t: 23.7, w: 3.0, r: 3 },
  { n: "dot-b", l: 63.1, t: 46.2, w: 2.8, r: 0 },
  { n: "dot-c", l: 23.6, t: 40.8, w: 2.8, r: 3 },
  { n: "dot-a", l: 21.7, t: 64.8, w: 2.6, r: 8 },
  { n: "dot-b", l: 16.1, t: 64.2, w: 2.6, r: 0 },
  { n: "dot-c", l: 65.3, t: 17.7, w: 2.5, r: 3 },
];

export default function PortfolioIndex() {
  const work = getSelectedWork();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <section className="paper-notebook corner-box rounded-xl border border-ink/15 bg-card px-7 py-12 text-center sm:px-10 sm:py-16">
        <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
          <span className="h-px w-8 bg-accent/40" />
          <span>Portfolio</span>
          <span className="h-px w-8 bg-accent/40" />
        </div>

        <div className="relative mx-auto mt-8 min-h-[17rem] w-full max-w-[21rem] sm:mt-10 sm:min-h-[20rem] sm:max-w-sm">
          {/* Scattered sticker ring, behind the mascot. */}
          <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
            {SCATTER.map((s, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={`${s.n}-${i}`}
                src={`/portfolio-stickers/${s.n}.png`}
                alt=""
                className="absolute drop-shadow-[0_4px_7px_rgba(0,0,0,0.15)]"
                style={{
                  left: `${s.l}%`,
                  top: `${s.t}%`,
                  width: `${s.w}%`,
                  transform: `translate(-50%, -50%) rotate(${s.r}deg)`,
                }}
              />
            ))}
          </div>

          {/* The cloud hovers above his head — small, a touch bigger than
              the other cut-outs, and clear of the mascot. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/portfolio-stickers/cloud.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[25%] z-40 w-[13.5%] -translate-x-1/2 select-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)]"
          />

          {/* Mascot + suitcase, anchored to the bottom of the scene. */}
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-man.png"
              alt="The Add the Accent character, packed and ready to travel"
              className="h-40 w-auto sm:h-48"
            />
            <svg
              viewBox="0 0 104 96"
              className="-ml-4 h-14 w-auto sm:-ml-5 sm:h-16"
              aria-hidden="true"
            >
              <ellipse cx="54" cy="90" rx="40" ry="5" fill="#000" opacity="0.25" />
              <path
                d="M38 20v-6a6 6 0 0 1 6-6h16a6 6 0 0 1 6 6v6"
                fill="none"
                stroke="#111"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <rect
                x="10"
                y="20"
                width="84"
                height="66"
                rx="8"
                fill="#6b4028"
                stroke="#111"
                strokeWidth="5"
              />
              <line x1="32" y1="20" x2="32" y2="86" stroke="#111" strokeWidth="4" />
              <line x1="72" y1="20" x2="72" y2="86" stroke="#111" strokeWidth="4" />
              <rect
                x="46"
                y="46"
                width="12"
                height="9"
                rx="1.5"
                fill="#e0a860"
                stroke="#111"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>

        <p className="mt-10 font-cinema text-4xl uppercase tracking-[0.06em] text-ink sm:text-5xl">
          Selected Work
        </p>
        <p className="mx-auto mt-4 max-w-md text-stone">
          A packed bag, not a finished trip &mdash; a working set of pieces
          pulled from the{" "}
          <Link href="/journal" className="text-accent hover:underline">
            journal
          </Link>{" "}
          that best show the range: brand voice, memoir, and story. Start
          here, then keep reading in the journal if one of these pulls you
          in.
        </p>
      </section>

      {work.length > 0 ? (
        <ul className="mt-10 space-y-5">
          {work.map((entry) => (
            <li key={entry.slug}>
              <JournalEntryCard entry={entry} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 font-mono text-sm text-stone/70">
          Nothing selected yet &mdash; add slugs to{" "}
          <code className="rounded bg-ink/10 px-1.5 py-0.5 text-xs">
            SELECTED_WORK_SLUGS
          </code>{" "}
          in <code className="rounded bg-ink/10 px-1.5 py-0.5 text-xs">lib/content.js</code>.
        </p>
      )}
    </div>
  );
}
