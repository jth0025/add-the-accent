import { Fraunces, Inter, Archivo_Black, IBM_Plex_Mono, Poppins, Alex_Brush, Playfair_Display, UnifrakturCook, Caveat, Anton } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import VisitCounter from "@/components/VisitCounter";
import MusicBar from "@/components/MusicBar";
import HeaderSky from "@/components/HeaderSky";
import LATemperature from "@/components/LATemperature";
import ContactButton from "@/components/ContactButton";

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

// Old English blackletter — a single profound line under the epigraph.
const unifrakturCook = UnifrakturCook({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-oldenglish",
  display: "swap",
});

// Casual handwriting — the sticky-note taglines on the About page.
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hand",
  display: "swap",
});

// Condensed poster face — the cinematic one-line principles on the About page.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cinema",
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

// Real rain across the header, shown only when it's actually raining in
// LA right now (html.header-raining, toggled by LATemperature after it
// checks current precipitation) — plain falling lines, independent of
// the drifting cloud parade above. Staggered duration/delay so they
// don't fall in lockstep.
const RAIN_DROPS = [
  { left: 4, duration: 0.9, delay: -0.1 },
  { left: 12, duration: 0.75, delay: -0.5 },
  { left: 21, duration: 0.85, delay: -0.2 },
  { left: 30, duration: 0.7, delay: -0.8 },
  { left: 39, duration: 0.95, delay: -0.4 },
  { left: 48, duration: 0.8, delay: -0.65 },
  { left: 57, duration: 0.9, delay: -0.05 },
  { left: 66, duration: 0.75, delay: -0.35 },
  { left: 75, duration: 0.85, delay: -0.75 },
  { left: 84, duration: 0.7, delay: -0.15 },
  { left: 92, duration: 0.95, delay: -0.55 },
];

// Journal dropdown contents — the three ordered series plus the
// "Interludes" pool of standalone reflections that surface inside all of
// them. Each series carries its own label color (purple / red / bronze gold).
const JOURNAL_SERIES = [
  {
    name: "Domain Expansion",
    sub: "Day One → Day Two",
    href: "/journal?series=Domain%20Expansion",
    nameClass: "text-[#7e22ce]",
  },
  {
    name: "Back to Oui",
    sub: "The Question",
    href: "/journal?series=Back%20to%20Oui",
    nameClass: "text-[#c0202a]",
  },
  {
    name: "Homebody",
    sub: "The Difference → Away Game",
    href: "/journal?series=Homebody",
    nameClass: "text-[#9a7420]",
  },
];

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${archivoBlack.variable} ${plexMono.variable} ${poppins.variable} ${alexBrush.variable} ${playfairDisplay.variable} ${unifrakturCook.variable} ${caveat.variable} ${anton.variable}`}
    >
      <body className="font-sans antialiased">
        {/* Grunge/distressed-type filter — referenced by `.grunge-text`
            (see app/globals.css). Edge displacement plus a sparse
            turbulence mask that chips small holes out of the fill. */}
        <svg
          className="pointer-events-none absolute h-0 w-0"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <filter
              id="grunge-text"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.72"
                numOctaves="2"
                seed="4"
                result="edge"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="edge"
                scale="1.7"
                xChannelSelector="R"
                yChannelSelector="G"
                result="rough"
              />
              <feTurbulence
                type="turbulence"
                baseFrequency="0.35"
                numOctaves="2"
                seed="11"
                result="specks"
              />
              <feColorMatrix
                in="specks"
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 3.2 -1.9"
                result="holes"
              />
              <feComposite
                in="rough"
                in2="holes"
                operator="out"
              />
            </filter>
            {/* Hand-drawn "urban sketch" roughen — warps geometric strokes
                into loose ink lines. Used by the epigraph icons and the
                About-page expression icons. */}
            <filter
              id="urban-sketch"
              x="-35%"
              y="-35%"
              width="170%"
              height="170%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.055 0.07"
                numOctaves="3"
                seed="7"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="3.6"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        <div className="flex min-h-screen flex-col">
          <header className="relative border-b-2 border-ink/55">
            <HeaderSky />
            <div
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
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

              {/* Real rain, hidden unless html.header-raining is set (see
                  globals.css) — plain falling lines across the header. */}
              <div
                className="header-rain pointer-events-none absolute inset-0"
                aria-hidden="true"
              >
                {RAIN_DROPS.map((drop, i) => (
                  <span
                    key={i}
                    className="header-rain-drop absolute top-[-12%] block w-px bg-[#7ea6c6]"
                    style={{
                      left: `${drop.left}%`,
                      height: 14,
                      animationDuration: `${drop.duration}s`,
                      animationDelay: `${drop.delay}s`,
                    }}
                  />
                ))}
              </div>
            </div>
            <nav className="relative z-10 mx-auto flex max-w-3xl items-end justify-between px-6 pt-4">
              <div className="flex items-end gap-2.5">
                <VisitCounter />
                <Link href="/" className="relative flex items-end">
                  {/* Soft glow behind the logo, night hours only (see
                      html.header-night in globals.css) — centered on the
                      logo, sized to sit behind it without touching any
                      other header spacing since it's purely absolute.
                      mix-blend-mode:screen so the white glow actually
                      brightens whatever sky color is behind it, instead
                      of just washing out as a pale rectangle. Wrapped in
                      a same-size clipping span, open on top/left/right
                      but hard-clipped at the bottom edge (right where the
                      logo itself ends), so the glow never shows below the
                      logo into the Now Playing bar underneath. */}
                  <span className="pointer-events-none absolute inset-0 [clip-path:inset(-100vh_-100vw_0_-100vw)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo-backlight.png"
                      alt=""
                      aria-hidden="true"
                      className="logo-backlight absolute left-1/2 top-1/2 z-0 w-52 max-w-none -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-screen transition-opacity duration-700"
                    />
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt="Add the Accent"
                    className="relative z-10 block h-16 w-auto"
                  />
                </Link>
                <span className="mb-2 hidden font-logo text-[11px] font-semibold lowercase leading-none tracking-wide text-[var(--header-fg)] transition-colors duration-500 sm:ml-4 sm:inline-flex">
                  the difference is you.
                </span>
              </div>
              {/* Desktop menu — on phones this is replaced by the full-width
                  bar below the header (see MobileMenu) so nothing overlaps
                  the logo or the grass. Color tracks --header-fg (set by
                  HeaderSky) so it stays legible against whatever time-of-day
                  sky is currently showing. */}
              <div className="hidden pb-1.5 font-mono text-xs font-medium uppercase tracking-widest text-[var(--header-fg)] transition-colors duration-500 sm:-mr-14 sm:flex sm:gap-5">
                <Link href="/" className="hover:text-accent">
                  Home
                </Link>

                <Link href="/portfolio" className="hover:text-accent">
                  Portfolio
                </Link>

                <Link href="/design" className="hover:text-accent">
                  Design
                </Link>

                <div className="group relative">
                  <Link href="/journal" className="hover:text-accent">
                    Journal <span aria-hidden="true">▾</span>
                  </Link>
                  {/* Wrapper is absolutely positioned flush to the trigger
                      (top-full) and its pt-4 bridges the visual gap so the
                      pointer never crosses dead space on the way to the
                      items — they stay hoverable and clickable. */}
                  <div className="invisible absolute left-1/2 top-full z-20 w-60 -translate-x-1/2 pt-4 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
                    <div className="rounded-lg border border-ink/15 bg-white p-2 text-left normal-case tracking-normal text-ink shadow-xl">
                      <div className="px-3 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                        Series
                      </div>
                      {JOURNAL_SERIES.map((s) => (
                        <Link
                          key={s.name}
                          href={s.href}
                          className="block rounded-md py-2 pl-[22px] pr-3 hover:bg-accent/10"
                        >
                          <span
                            className={`block font-serif text-[13px] font-bold ${s.nameClass}`}
                          >
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
                </div>

                <Link href="/about" className="hover:text-accent">
                  About
                </Link>

                {/* Icon, not a text label — keeps the row to one line
                    regardless of viewport width (see ContactButton). */}
                <ContactButton />
              </div>
            </nav>

            {/* Always visible (not just sm:flex like the nav links above),
                and pinned to the header's own corner rather than sitting in
                the nav's flex row — so it never has to compete with that
                row for width and push into the centered grass below. */}
            <div className="pointer-events-none absolute bottom-3 right-4 z-10 font-mono text-[10px] uppercase tracking-widest text-[var(--header-fg)] opacity-80 transition-colors duration-500 sm:bottom-4 sm:right-6 sm:text-xs">
              <LATemperature />
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/grass-side.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-1/2 h-9 w-auto -translate-x-1/2 sm:h-11"
            />
          </header>

          <MusicBar />

          {/* Phone menu — its own full-width bar directly under the header,
              on a dark ground with white type so it stays legible and clear
              of the logo and grass. Hidden from tablets up. */}
          <nav
            aria-label="Primary"
            className="flex flex-wrap justify-center gap-x-7 gap-y-1 border-b-2 border-ink/55 bg-ink px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest text-white sm:hidden"
          >
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
            <Link href="/portfolio" className="hover:text-accent">
              Portfolio
            </Link>
            <Link href="/design" className="hover:text-accent">
              Design
            </Link>
            <Link href="/journal" className="hover:text-accent">
              Journal
            </Link>
            <Link href="/about" className="hover:text-accent">
              About
            </Link>
            <ContactButton />
          </nav>

          <main className="flex-1">{children}</main>

          <footer className="border-t-2 border-ink/55 py-10">
            <div className="mx-auto flex max-w-3xl items-center justify-center gap-3 px-6">
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              <p className="text-center font-mono text-xs uppercase tracking-widest text-ink">
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
