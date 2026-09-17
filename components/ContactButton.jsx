"use client";

import { useEffect, useState } from "react";

// Set in .env.local (and in Vercel's project env vars for production) to
// the form endpoint Formspree gives you, e.g.
// "https://formspree.io/f/xxxxxxxx". See README for the one-time setup.
// Until it's set, the form falls back to a mailto: draft so it still
// works — just without landing straight in the inbox unattended.
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

/**
 * A small envelope icon that opens a contact form in a modal — kept out
 * of the text nav entirely so it never has to compete for a line's width
 * the way a "Contact" label would. Self-contained (trigger + modal
 * together) so it can be dropped once into the desktop nav and once into
 * the phone menu without the two needing to share state.
 *
 * Submits straight to Formspree (see FORMSPREE_ENDPOINT above), which
 * relays it to info@addtheaccent.com — no mail app needed on the
 * visitor's end. Falls back to a mailto: draft if the endpoint isn't
 * configured yet.
 */
export default function ContactButton({ className = "" }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Reset the confirmation/error state whenever the modal is reopened, so
  // it doesn't show a stale message from a previous visit.
  useEffect(() => {
    if (open) setStatus("idle");
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!FORMSPREE_ENDPOINT) {
      // Not configured yet — fall back to a mailto: draft so the form
      // still does something useful in the meantime.
      const subject = `Site message from ${name || "someone"}`;
      const body = `${message}\n\n— ${name}${email ? ` (${email})` : ""}`;
      window.location.href = `mailto:info@addtheaccent.com?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error("Formspree request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Contact"
        aria-haspopup="dialog"
        className={`group inline-flex shrink-0 items-center transition-colors hover:text-accent ${className}`}
      >
        <svg
          viewBox="0 0 24 24"
          className="envelope-svg h-6 w-6 [filter:url(#urban-sketch)] [transform-origin:50%_50%] group-hover:[animation:envelope-shake_0.5s_ease-in-out]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Contact form"
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="corner-box relative w-full max-w-sm -rotate-1 rounded-xl border border-ink/15 bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Small hand-drawn flourish echoing the envelope trigger —
                a torn-stamp corner, tucked top-right like it's pinned. */}
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute -right-3 -top-3 h-10 w-10 rotate-12 text-accent/70 [filter:url(#urban-sketch)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="1.5" />
              <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
            </svg>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-xl leading-none text-stone transition-colors hover:text-ink"
            >
              &times;
            </button>

            <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
              <span className="h-px w-8 bg-accent/40" />
              <span>Get in touch</span>
              <span className="h-px w-8 bg-accent/40" />
            </div>

            {status === "sent" ? (
              <div className="py-8 text-center">
                <p className="font-serif text-lg italic text-ink">
                  {FORMSPREE_ENDPOINT
                    ? "Sent — thanks for reaching out."
                    : "Your mail app should be open with this ready to send."}
                </p>
                {!FORMSPREE_ENDPOINT && (
                  <p className="mt-2 text-sm text-stone">
                    Didn&rsquo;t pop up?{" "}
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="text-accent underline underline-offset-2"
                    >
                      Try again
                    </button>
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Name"
                  disabled={status === "sending"}
                  className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-stone/60 focus:border-accent disabled:opacity-60"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  disabled={status === "sending"}
                  className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-stone/60 focus:border-accent disabled:opacity-60"
                />
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="What's up?"
                  disabled={status === "sending"}
                  className="w-full resize-none rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-stone/60 focus:border-accent disabled:opacity-60"
                />
                {status === "error" && (
                  <p className="text-sm text-[#c0202a]">
                    Something went wrong sending that — try again, or email{" "}
                    <a href="mailto:info@addtheaccent.com" className="underline underline-offset-2">
                      info@addtheaccent.com
                    </a>{" "}
                    directly.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-md bg-accent py-2.5 font-mono text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
