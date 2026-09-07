import Link from "next/link";

export const metadata = { title: "Portfolio — Add the Accent" };

export default function PortfolioIndex() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <section className="paper-notebook corner-box rounded-xl border border-ink/15 bg-card px-7 py-12 text-center sm:px-10 sm:py-16">
        <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
          <span className="h-px w-8 bg-accent/40" />
          <span>Portfolio</span>
          <span className="h-px w-8 bg-accent/40" />
        </div>

        <div className="mt-10 flex items-end justify-center gap-2 sm:gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-man.png"
            alt="The Add the Accent character, packed and ready to travel"
            className="h-40 w-auto sm:h-48"
          />
          <svg
            viewBox="0 0 104 96"
            className="mb-1 h-24 w-auto sm:h-28"
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
