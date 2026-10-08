"use client";

import Link from "next/link";

/**
 * JT's signature mark, shown solid in its own colour with a steady silver
 * gleam sweeping across it. Hovering lights it like a spotlight: the whole
 * screen dims (an overlay on <html>, see app/globals.css) except a soft
 * pool of light centred on the signature, which also glows. The overlay's
 * centre is measured on hover so it holds the mark wherever the page is
 * scrolled. Clicking the mark switches the light off and follows the link.
 */
export default function SignatureMark({ className = "" }) {
  const lightUp = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--jt-x", `${r.left + r.width / 2}px`);
    root.style.setProperty("--jt-y", `${r.top + r.height / 2}px`);
    root.style.setProperty("--jt-rx", `${r.width * 0.98}px`);
    root.style.setProperty("--jt-ry", `${r.height * 1.35}px`);
    root.classList.add("jt-spot");
  };
  const lightOut = () => document.documentElement.classList.remove("jt-spot");

  return (
    <Link
      href="/about#profile"
      aria-label="View JT's profile"
      onMouseEnter={lightUp}
      onMouseLeave={lightOut}
      onFocus={lightUp}
      onBlur={lightOut}
      onClick={lightOut}
      className={`jt-reveal-link relative block cursor-pointer ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/jt-signature.png" alt="" className="jt-mark-img w-full" />
      <div
        aria-hidden="true"
        className="jt-mark pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage: "url(/jt-signature.png)",
          maskImage: "url(/jt-signature.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      >
        <span className="jt-mark-gleam absolute inset-0 block" />
      </div>
    </Link>
  );
}
