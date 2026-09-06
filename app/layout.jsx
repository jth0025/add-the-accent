import { Fraunces, Inter, Archivo_Black, IBM_Plex_Mono, Poppins, Alex_Brush, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Bold display face matching the "Homebody" title treatment in the pitch deck.
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

// Stenciled mono face for tags, labels, and dates — the "urban" register.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Rounded geometric bold — matches the "add the accent" wordmark in the
// logo art, used for the header tagline so it reads as the same voice.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Elegant handwritten script — a one-off accent for "Add the Accent"
// wherever it needs to read as personally signed rather than typeset.
// (Requested font "Adelia" is personal-use-only; this is the closest
// free-for-commercial-use match — smooth, flowing, premium feel.)
const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

// Heavy hero-headline serif — matched from businessiswhimsical.com for
// the home page hero headline treatment (bold, tight, dramatic).
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "Add the Accent",
  description:
    "Refining taste, identity, and creative living — essays, journals, and the Homebody series.",
};

// Small drifting header clouds — flat 2D puffs, sized well below the
// logo (h-11 / 44px), staggered with negative animation-delay values so
// they read as several independent clouds rather than one repeating copy.
// Mostly black with a couple of grey ones mixed in.
const HEADER_CLOUDS = [
  { top: 3, width: 26, duration: 61, delay: -11, opacity: 0.95, color: "#1a1a1a" },
  { top: 11, width: 18, duration: 47, delay: -29, opacity: 0.7, color: "#6b6b6b" },
  { top: 1, width: 22, duration: 72, delay: -50, opacity: 0.85, color: "#1a1a1a" },
  { top: 8, width: 15, duration: 40, delay: -4, opacity: 0.6, color: "#8a8a8a" },
  { top: 5, width: 20, duration: 54, delay: -38, opacity: 0.8, color: "#1a1a1a" },
  { top: 14, width: 24, duration: 66, delay: -6, opacity: 0.65, color: "#1a1a1a" },
  { top: 2, width: 16, duration: 44, delay: -20, opacity: 0.9, color: "#6b6b6b" },
  { top: 9, width: 21, duration: 58, delay: -44, opacity: 0.75, color: "#1a1a1a" },
  { top: 0, width: 19, duration: 49, delay: -15, opacity: 0.88, color: "#1a1a1a" },
  { top: 12, width: 14, duration: 63, delay: -33, opacity: 0.55, color: "#8a8a8a" },
  { top: 6, width: 23, duration: 70, delay: -58, opacity: 0.82, color: "#1a1a1a" },
];

// Journal dropdown contents — the two ordered series plus the
// "Interludes" pool of standalone reflections that surface inside both.
const JOURNAL_SERIES = [
  { name: "Domain Expansion", sub: "Day One → Day Two", href: "/journal?series=Domain%20Expansion" },
  { name: "Back to Oui", sub: "The Question", href: "/journal?series=Back%20to%20Oui" },
];

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${archivoBlack.variable} ${plexMono.variable} ${poppins.variable} ${alexBrush.variable} ${playfairDisplay.variable}`}
    >
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="relative border-b-2 border-ink/55 bg-[linear-gradient(180deg,#eaf7fd_0%,#d3edf9_40%,#b7e0f3_75%,#9ed3ec_100%)]">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-0 h-8 overflow-hidden"
              aria-hidden="true"
            >
              {HEADER_CLOUDS.map((cloud, i) => (
                <svg
                  key={i}
                  viewBox="0 0 64 40"
                  className="header-cloud absolute"
                  style={{
                    top: cloud.top,
                    width: cloud.width,
                    opacity: cloud.opacity,
                    animationDuration: `${cloud.duration}s`,
                    animationDelay: `${cloud.delay}s`,
                  }}
                >
                  <rect x="10" y="24" width="44" height="10" rx="5" fill={cloud.color} />
                  <ellipse cx="20" cy="24" rx="14" ry="10" fill={cloud.color} />
                  <ellipse cx="34" cy="18" rx="16" ry="13" fill={cloud.color} />
                  <ellipse cx="48" cy="24" rx="12" ry="9" fill={cloud.color} />
                </svg>
              ))}
            </div>
            <nav className="relative z-10 mx-auto flex max-w-3xl items-end justify-between px-6 pt-4">
              <div className="flex items-end gap-3">
                <Link href="/" className="flex items-end">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt="Add the Accent"
                    className="block h-16 w-auto"
                  />
                </Link>
                <span className="mb-2 hidden font-logo text-[11px] font-semibold lowercase leading-none tracking-wide text-ink sm:ml-4 sm:inline-flex">
                  the difference is you.
                </span>
              </div>
              <div className="flex gap-6 pb-1.5 font-mono text-xs font-medium uppercase tracking-widest text-stone">
                <Link href="/portfolio" className="hover:text-accent">
                  Portfolio
                </Link>

                <div className="group relative">
                  <Link href="/journal" className="hover:text-accent">
                    Journal <span aria-hidden="true">▾</span>
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-20 mt-4 w-60 -translate-x-1/2 rounded-lg border border-ink/15 bg-white p-2 text-left normal-case tracking-normal text-ink opacity-0 shadow-xl transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
                    <div className="px-3 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                      Series
                    </div>
                    {JOURNAL_SERIES.map((s) => (
                      <Link
                        key={s.name}
                        href={s.href}
                        className="block rounded-md py-2 pl-[22px] pr-3 hover:bg-accent/10"
                      >
                        <span className="block font-serif text-[13px] font-bold">
                          {s.name}
                        </span>
                        <span className="block font-sans text-[10.5px] italic normal-case tracking-wide text-stone">
                          {s.sub}
                        </span>
                      </Link>
                    ))}

                    <hr className="my-1.5 border-ink/10" />

                    <Link
                      href="/journal?category=Interludes"
                      className="block rounded-md px-3 py-2 hover:bg-accent/10"
                    >
                      <span className="block font-serif text-sm font-bold">
                        Interludes
                      </span>
                      <span className="block max-w-[210px] whitespace-normal font-sans text-[10.5px] italic normal-case leading-snug tracking-wide text-stone">
                        Short reflections and sparks that surface inside the
                        series above — not a story of their own.
                      </span>
                    </Link>

                    <hr className="my-1.5 border-ink/10" />

                    <Link
                      href="/journal"
                      className="block rounded-md px-3 py-2 hover:bg-accent/10"
                    >
                      <span className="block font-serif text-sm font-bold">
                        All Entries
                      </span>
                      <span className="block font-sans text-[10.5px] italic normal-case tracking-wide text-stone">
                        Everything, newest first
                      </span>
                    </Link>
                  </div>
                </div>

                <Link href="/about" className="hover:text-accent">
                  About
                </Link>
              </div>
            </nav>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/grass-side.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-1/2 h-9 w-auto -translate-x-1/2 sm:h-11"
            />
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t-2 border-ink/55 py-10">
            <div className="mx-auto flex max-w-3xl items-center gap-3 px-6">
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              <p className="font-mono text-xs uppercase tracking-widest text-ink">
                <span className="font-bold">
                  Add <span className="text-accent">the</span> Accent
                </span>{" "}
                — The difference is <span className="text-accent">you.</span>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
