import { Fraunces, Inter, Archivo_Black } from "next/font/google";
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

export const metadata = {
  title: "Add the Accent",
  description:
    "Refining taste, identity, and creative living — essays, journals, and the Homebody series.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${archivoBlack.variable}`}
    >
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="relative border-b-2 border-ink/55">
            <nav className="mx-auto flex max-w-3xl items-end justify-between px-6 pt-4">
              <Link href="/" className="flex items-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Add the Accent"
                  className="block h-11 w-auto"
                />
              </Link>
              <div className="flex gap-6 pb-1.5 text-sm text-stone">
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
              className="pointer-events-none absolute bottom-0 right-4 h-9 w-auto sm:right-6 sm:h-11"
            />
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-stone/20 py-10">
            <div className="mx-auto max-w-3xl px-6 text-sm text-stone/80">
              Add the Accent — when the road is unclear, clean a room.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
