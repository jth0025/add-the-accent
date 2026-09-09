import Link from "next/link";

export const metadata = { title: "Portfolio — Add the Accent" };

// Puffy 3D cut-outs ringed around the mascot — never over him, the
// cloud, the suitcase, or below the ground he stands on. Each entry is
// a centre point (l, t) and width as a percentage of the scene box, so
// the whole arrangement scales together. Positions were packed to stay
// clear of one another; edit with that in mind.
const SCATTER = [
  { n: "star-outline", l: 19.4, t: 72.6, w: 11.5, r: -9 },
  { n: "comet", l: 80.0, t: 37.6, w: 11.0, r: -10 },
  { n: "sun", l: 82.3, t: 71.2, w: 10.5, r: 4 },
  { n: "crown", l: 21.6, t: 22.6, w: 10.5, r: 3 },
  { n: "moon", l: 20.9, t: 52.6, w: 10.0, r: -6 },
  { n: "sparkle", l: 57.3, t: 8.4, w: 9.0, r: -12 },
  { n: "heart", l: 78.7, t: 12.1, w: 9.0, r: 12 },
  { n: "sunny-side", l: 81.6, t: 86.0, w: 9.5, r: 2 },
  { n: "moon-lg", l: 32.4, t: 8.7, w: 8.5, r: -7 },
  { n: "triangle-coral", l: 67.3, t: 71.0, w: 8.5, r: -3 },
  { n: "star", l: 20.5, t: 35.4, w: 8.5, r: 11 },
  { n: "arc", l: 77.5, t: 53.6, w: 8.0, r: -11 },
  { n: "triangle", l: 18.0, t: 8.9, w: 8.0, r: -12 },
  { n: "arrow", l: 90.3, t: 54.7, w: 7.5, r: -12 },
  { n: "cross", l: 22.4, t: 87.3, w: 7.5, r: 4 },
  { n: "bolt-lg", l: 9.5, t: 38.1, w: 6.5, r: -5 },
  { n: "bolt", l: 90.1, t: 9.7, w: 6.3, r: 10 },
  { n: "bolt-coral", l: 42.7, t: 8.1, w: 6.3, r: -4 },
  { n: "bolt-sm", l: 93.9, t: 74.9, w: 6.3, r: 9 },
  { n: "triangle-sm", l: 11.7, t: 88.0, w: 7.0, r: 4 },
  { n: "star-four", l: 80.3, t: 23.8, w: 6.0, r: 3 },
  { n: "diamond", l: 10.4, t: 52.2, w: 5.6, r: 0 },
  { n: "star-sm", l: 11.4, t: 22.2, w: 5.0, r: 6 },
  { n: "star-four", l: 68.0, t: 10.7, w: 5.4, r: 2 },
  { n: "diamond", l: 92.3, t: 87.0, w: 5.0, r: 7 },
  { n: "raindrop", l: 87.5, t: 24.0, w: 4.0, r: 3 },
  { n: "raindrop", l: 8.4, t: 67.1, w: 3.6, r: -11 },
  { n: "dot-a", l: 90.0, t: 37.1, w: 3.0, r: 4 },
  { n: "dot-b", l: 9.1, t: 76.9, w: 2.8, r: -2 },
  { n: "dot-c", l: 90.3, t: 44.9, w: 2.8, r: 4 },
  { n: "dot-a", l: 74.0, t: 23.6, w: 2.6, r: -3 },
  { n: "dot-b", l: 68.8, t: 3.3, w: 2.6, r: -9 },
];

export default function PortfolioIndex() {
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

          {/* The cloud sits over his head, in front of everything. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/portfolio-stickers/cloud.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[19%] z-40 w-[37%] -translate-x-1/2 select-none drop-shadow-[0_8px_12px_rgba(0,0,0,0.2)]"
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
          Coming Soon
        </p>
        <p className="mx-auto mt-4 max-w-md text-stone">
          The Homebody case studies are being packed and readied. Check back
          soon &mdash; or spend some time in the{" "}
          <Link href="/journal" className="text-accent hover:underline">
            journal
          </Link>{" "}
          while you wait.
        </p>
      </section>
    </div>
  );
}
