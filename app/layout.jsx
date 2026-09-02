import { Fraunces, Inter, Archivo_Black, IBM_Plex_Mono } from "next/font/google";
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

export const metadata = {
  title: "Add the Accent",
  description:
    "Refining taste, identity, and creative living — essays, journals, and the Homebody series.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${archivoBlack.variable} ${plexMono.variable}`}
    >
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="relative border-b-2 border-ink/55 bg-paper">
            <nav className="mx-auto flex max-w-3xl items-end justify-between px-6 pt-4">
              <Link href="/" className="flex items-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Add the Accent"
                  className="block h-11 w-auto"
                />
              </Link>
              <div className="flex gap-6 pb-1.5 font-mono text-xs font-medium uppercase tracking-widest text-stone">
                <Link href="/portfolio" className="hover:text-accent">
                  Portfolio
                </Link>
                <Link href="/journal" className="hover:text-accent">
                  Journal
                </Link>
              </div>
            </nav>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/grass-side.png"
              alt=""
              aria-hidden="true"
              className="grass-sway pointer-events-none absolute bottom-0 left-1/2 h-9 w-auto -translate-x-1/2 sm:h-11"
            />
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t-2 border-ink/55 py-10">
            <div className="mx-auto flex max-w-3xl items-center gap-3 px-6">
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              <p className="font-mono text-xs uppercase tracking-widest text-stone">
                Add the Accent — when the road is unclear, clean a room.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
