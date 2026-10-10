"use client";

import { useState } from "react";
import "@/app/about/about.css";
import TitleLight from "@/components/journal/TitleLight";

// Same Formspree endpoint as the other forms on the site — the hidden
// _subject field is what tells the notification emails apart.
// Signups go to a subscriber list of their own: point
// NEXT_PUBLIC_SUBSCRIBE_ENDPOINT at a dedicated form (or any list
// provider's form endpoint) so they never mix with contact / inquiry
// mail. Until that is set they fall back to the shared form below, where
// every one still carries list="accent-notes-subscribers" so they can be
// filtered and exported as the list.
const FORMSPREE_ENDPOINT =
  process.env.NEXT_PUBLIC_SUBSCRIBE_ENDPOINT ||
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

/**
 * "Accent Notes" — a one-field email signup, sent only when there's
 * something worth sending rather than on a manufactured schedule. No
 * name, no preferences, just an address, so signing up costs nothing.
 */
export default function AccentNotesSignup() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (!FORMSPREE_ENDPOINT) {
      window.location.href = `mailto:info@addtheaccent.com?subject=${encodeURIComponent(
        "Add me to Accent Notes",
      )}&body=${encodeURIComponent(email)}`;
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams({
          email: email.trim().toLowerCase(),
          list: "accent-notes-subscribers",
          form: "accent-notes-signup",
          source: window.location.pathname,
          subscribed_at: new Date().toISOString(),
          _subject: "New Accent Notes subscriber",
        }),
      });
      if (!res.ok) throw new Error("Formspree request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    // A brass picture light hangs over the box: it comes on when the box is
    // hovered (and stays on, flickering, on touch screens).
    <TitleLight over coneHeight="15rem" className="mt-10 !w-full max-w-2xl">
    <section className="paper-journal corner-box relative mx-auto max-w-2xl overflow-hidden rounded-xl border border-ink/15 bg-card px-7 py-9 text-center sm:px-9">
      {/* The mascot, half-cropped, faint in the background on the far
          left — shown whole (not sliced by a narrow crop box) so it
          reads as a watermark bleeding in under the text rather than a
          clipped sliver. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-man-half.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-full w-auto max-w-[9rem] object-contain object-left opacity-[0.22] [mix-blend-mode:multiply] sm:max-w-[12rem]"
      />

      <div className="relative z-10">
        {/* The same title structure as Section 02 on the About page: a
            small label, the heavy Playfair title with the middle word in
            italic (and its gleam), a fine double rule, then a deck. */}
        <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
          <span className="h-px w-8 bg-accent/40" />
          <span>Join the list</span>
          <span className="h-px w-8 bg-accent/40" />
        </div>
        <h2 className="mt-5 text-center font-playfair text-[2.9rem] font-black leading-[0.95] tracking-[-0.03em] text-ink sm:text-[4.6rem]">
          An <span className="about-accent-gleam font-normal italic text-accent">Accent</span>{" "}
          Note
        </h2>
        <div aria-hidden="true" className="mx-auto mt-5 flex max-w-xs flex-col gap-[3px]">
          <span className="h-[2px] bg-ink" />
          <span className="h-px bg-ink/60" />
        </div>
        <p className="mt-6 text-center font-playfair text-[1.65rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[2.2rem]">
          Keep up with the{" "}
          <span className="font-normal italic text-accent">latest</span> drop
        </p>
        <p className="mt-2 text-center font-serif text-[13px] italic tracking-[0.35em] text-stone/55">
          accent notes
        </p>
        <p className="mx-auto mt-4 max-w-xl text-center font-serif leading-relaxed text-stone">
          &mdash; a note from the studio when there&rsquo;s something worth
          sending.
        </p>
        <ul className="mx-auto mt-3 inline-block max-w-sm space-y-1 text-left text-stone">
          {[
            "New writing",
            "Visual experiments",
            "Things I\u2019m making",
            "Things I\u2019m thinking about",
            "And occasionally, something you can keep",
          ].map((item) => (
            <li key={item} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-[0.15em] text-accent">
                &bull;
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {status === "sent" ? (
          <p className="mt-6 font-serif text-lg italic text-ink">
            You&rsquo;re on the list.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex max-w-sm flex-col gap-2.5 sm:flex-row"
          >
            <label htmlFor="accent-notes-email" className="sr-only">
              Email address
            </label>
            <input
              id="accent-notes-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending"}
              placeholder="you@email.com"
              className="w-full rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none placeholder:text-stone/60 focus:border-accent disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="shrink-0 rounded-full bg-accent px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === "sending" ? "Adding…" : "Add me →"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-[#c0202a]">
            Something went wrong — try again, or email{" "}
            <a
              href="mailto:info@addtheaccent.com"
              className="underline underline-offset-2"
            >
              info@addtheaccent.com
            </a>
            .
          </p>
        )}
        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-stone/60">
          No inbox clutter. Just the accent.
        </p>
      </div>
    </section>
    </TitleLight>
  );
}
