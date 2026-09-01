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
          <header className="border-b border-stone/10">
            <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
              <Link
                href="/"
                className="font-serif text-lg tracking-tight text-ink"
              >
                Add the Accent
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

          <footer className="border-t border-stone/10 py-10">
            <div className="mx-auto max-w-3xl px-6 text-sm text-stone/70">
              Add the Accent — when the road is unclear, clean a room.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
