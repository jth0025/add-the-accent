import Link from "next/link";

export const metadata = { title: "Portfolio — Add the Accent" };

// Puffy 3D cut-outs scattered around the mascot. Positions are all
// relative to the scene box so they scale together; a few of the
// smaller ones drop out below `sm` to keep the phone view uncluttered.
const STICKERS = [
  { n: "sun", c: "left-[-5%] top-[4%] w-[18%] -rotate-6" },
  { n: "moon-lg", c: "left-[16%] top-[5%] w-[13%] -rotate-[24deg] hidden sm:block" },
  { n: "diamond", c: "left-[24%] top-[2%] w-[8%] -rotate-6 hidden sm:block" },
  { n: "dot-a", c: "left-[41%] top-[6%] w-[4.5%]" },
  { n: "sparkle", c: "right-[3%] top-[1%] w-[15%] rotate-3" },
  { n: "star-sm", c: "right-[24%] top-[8%] w-[7%] hidden sm:block" },
  { n: "crown", c: "right-[-3%] top-[15%] w-[19%] rotate-[12deg]" },
  { n: "moon", c: "left-[-7%] top-[19%] w-[17%] -rotate-[14deg]" },
  { n: "arrow", c: "right-[13%] top-[43%] w-[11%] rotate-[128deg] hidden sm:block" },
  { n: "comet", c: "right-[-6%] top-[34%] w-[20%] rotate-[14deg]" },
  { n: "triangle-coral", c: "left-[3%] top-[43%] w-[12%] -rotate-[8deg] hidden sm:block" },
  { n: "star-four", c: "left-[-2%] top-[46%] w-[9%]" },
  { n: "star", c: "right-[-3%] top-[54%] w-[14%] rotate-[8deg]" },
  { n: "bolt", c: "left-[-3%] top-[64%] w-[11%] -rotate-[18deg]" },
  { n: "bolt-coral", c: "right-[1%] top-[71%] w-[10%] rotate-[14deg] hidden sm:block" },
  { n: "arc", c: "right-[-6%] top-[74%] w-[13%] rotate-[26deg] hidden sm:block" },
  { n: "sunny-side", c: "left-[-6%] top-[75%] w-[16%] hidden sm:block" },
  { n: "heart", c: "left-[6%] bottom-[1%] w-[15%] -rotate-[10deg]" },
  { n: "triangle", c: "left-[27%] bottom-[-4%] w-[13%] -rotate-[8deg]" },
  { n: "cross", c: "right-[27%] bottom-[-2%] w-[11%] rotate-[4deg] hidden sm:block" },
  { n: "star-outline", c: "right-[2%] bottom-[0%] w-[20%] rotate-[10deg]" },
  { n: "dot-b", c: "left-[46%] bottom-[-3%] w-[3.5%] hidden sm:block" },
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

        <div className="relative mx-auto mt-10 min-h-[17rem] w-full max-w-[21rem] sm:mt-12 sm:min-h-[20rem] sm:max-w-sm">
          {/* Scattered sticker layer, behind the mascot. */}
          <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
            {STICKERS.map((s) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={s.n}
                src={`/portfolio-stickers/${s.n}.png`}
                alt=""
                className={`absolute drop-shadow-[0_5px_9px_rgba(0,0,0,0.16)] ${s.c}`}
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
