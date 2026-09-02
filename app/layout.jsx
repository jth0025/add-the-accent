import { Fraunces, Inter, Archivo_Black, IBM_Plex_Mono, Poppins, Alex_Brush } from "next/font/google";
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

export const metadata = {
  title: "Add the Accent",
  description:
    "Refining taste, identity, and creative living — essays, journals, and the Homebody series.",
};

// Small drifting header clouds — flat 2D puffs, sized well below the
// logo (h-11 / 44px), staggered with negative animation-delay values so
// they read as several independent clouds rather than one repeating copy.
const HEADER_CLOUDS = [
  { top: 3, width: 26, duration: 61, delay: -11, opacity: 0.95 },
  { top: 11, width: 18, duration: 47, delay: -29, opacity: 0.7 },
  { top: 1, width: 22, duration: 72, delay: -50, opacity: 0.85 },
  { top: 8, width: 15, duration: 40, delay: -4, opacity: 0.6 },
  { top: 5, width: 20, duration: 54, delay: -38, opacity: 0.8 },
];

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${archivoBlack.variable} ${plexMono.variable} ${poppins.variable} ${alexBrush.variable}`}
    >
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="relative border-b-2 border-ink/55 bg-paper">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-0 h-6 overflow-hidden"
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
                  <rect x="10" y="24" width="44" height="10" rx="5" fill="#fff" />
                  <ellipse cx="20" cy="24" rx="14" ry="10" fill="#fff" />
                  <ellipse cx="34" cy="18" rx="16" ry="13" fill="#fff" />
                  <ellipse cx="48" cy="24" rx="12" ry="9" fill="#fff" />
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
                    className="block h-11 w-auto"
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
                <Link href="/journal" className="hover:text-accent">
                  Journal
                </Link>
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
