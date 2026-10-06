"use client";

import { useState } from "react";

// Same Formspree endpoint as the other forms on the site — the hidden
// _subject field is what tells the notification emails apart.
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

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
          email,
          _subject: "New Accent Notes signup",
        }),
      });
      if (!res.ok) throw new Error("Formspree request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="paper-notebook corner-box mx-auto mt-10 max-w-xl overflow-hidden rounded-xl border border-ink/15 bg-card px-7 py-9 text-center sm:px-10">
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
        <div className="flex items-center justify-center gap-3 text-accent">
          <span className="h-px w-8 bg-accent/40" />
          <span className="font-hand text-3xl font-bold normal-case tracking-normal">
            Accent Notes
          </span>
          <span className="h-px w-8 bg-accent/40" />
        </div>
        <p className="mx-auto mt-4 text-[15px] text-stone sm:whitespace-nowrap">
          A note from the studio when there&rsquo;s something worth sending.
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
  );
}
