"use client";

import { useEffect, useState } from "react";

/**
 * A small envelope icon that opens a contact form in a modal — kept out
 * of the text nav entirely so it never has to compete for a line's width
 * the way a "Contact" label would. Self-contained (trigger + modal
 * together) so it can be dropped once into the desktop nav and once into
 * the phone menu without the two needing to share state.
 *
 * Submission is a mailto: link for now — zero setup, works today, and
 * lands straight in your inbox. Swap `buildMailto` for a fetch() to
 * Formspree/Resend/etc. once you've picked a service; the form itself
 * won't need to change.
 */
export default function ContactButton({ className = "" }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

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

  // Reset the "sent" confirmation whenever the modal is reopened, so it
  // doesn't show a stale success message from a previous visit.
  useEffect(() => {
    if (open) setSent(false);
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const subject = `Site message from ${name || "someone"}`;
    const body = `${message}\n\n— ${name}${email ? ` (${email})` : ""}`;
    const mailto = `mailto:hello@addtheaccent.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSent(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Contact"
        aria-haspopup="dialog"
        className={`inline-flex shrink-0 items-center transition-colors hover:text-accent ${className}`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[1.05em] w-[1.05em]"
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

            {sent ? (
              <div className="py-8 text-center">
                <p className="font-serif text-lg italic text-ink">
                  Your mail app should be open with this ready to send.
                </p>
                <p className="mt-2 text-sm text-stone">
                  Didn&rsquo;t pop up?{" "}
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="text-accent underline underline-offset-2"
                  >
                    Try again
                  </button>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Name"
                  className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-stone/60 focus:border-accent"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  className="w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-stone/60 focus:border-accent"
                />
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="What's up?"
                  className="w-full resize-none rounded-md border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none placeholder:text-stone/60 focus:border-accent"
                />
                <button
                  type="submit"
                  className="w-full rounded-md bg-accent py-2.5 font-mono text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
