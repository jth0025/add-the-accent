"use client";

import { useState } from "react";

/**
 * A small hand-drawn share icon, pinned just outside a card's top-right
 * corner — mirroring the paperclip pinned at the top-left of the same
 * boxes. Uses the device's native share sheet where available; falls
 * back to copying the page URL to the clipboard with a brief
 * confirmation.
 */
export default function ShareButton({ title, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Cancelled share sheet — nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked — nothing more we can do silently.
    }
  };

  return (
    <div className={`absolute z-20 ${className}`}>
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share this page"
        className="group block text-ink/70 transition-colors hover:text-accent"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 [filter:url(#urban-sketch)] transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="2.6" />
          <circle cx="6" cy="12" r="2.6" />
          <circle cx="18" cy="19" r="2.6" />
          <path d="M8.3 10.6 15.8 6.4" />
          <path d="M8.3 13.4 15.8 17.6" />
        </svg>
      </button>
      {copied && (
        <span className="absolute right-0 top-full mt-1.5 whitespace-nowrap rounded-md bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white shadow-lg">
          Link copied
        </span>
      )}
    </div>
  );
}
