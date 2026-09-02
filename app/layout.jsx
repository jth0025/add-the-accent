import { Fraunces, Inter } from "next/font/google";
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

export const metadata = {
  title: "Add the Accent",
  description:
    "Refining taste, identity, and creative living — essays, journals, and the Homebody series.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="relative border-b-2 border-ink/55">
            <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
              <Link href="/" className="relative flex items-center overflow-visible">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Add the Accent"
                  className="logo-walk h-11 w-auto"
                />
                <svg
                  className="leaf-accent leaf-1"
                  style={{ left: "10px", width: "9px", height: "12px" }}
                  viewBox="0 0 12 16"
                  aria-hidden="true"
                >
                  <path d="M6 16 C6 9 2 6 4 0 C9 6 11 12 6 16 Z" fill="#1a1a1a" />
                </svg>
                <svg
                  className="leaf-accent leaf-2"
                  style={{ left: "26px", width: "7px", height: "9px" }}
                  viewBox="0 0 12 16"
                  aria-hidden="true"
                >
                  <path d="M6 16 C6 9 2 6 4 0 C9 6 11 12 6 16 Z" fill="#1a1a1a" />
                </svg>
              </Link>
              <div className="flex gap-6 text-sm text-stone">
                <Link href="/portfolio" className="hover:text-accent">
                  Portfolio
                </Link>
                <Link href="/journal" className="hover:text-accent">
                  Journal
                </Link>
              </div>
            </nav>
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
