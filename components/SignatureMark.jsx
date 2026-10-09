"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * JT's signature mark: solid black until a quick silver gleam crosses it
 * (rarely), ending in a lens flare on the tip of the "t". Hovering lights
 * it like a spotlight: everything below the header dims (an overlay on
 * <html>, see app/globals.css) except a soft pool of light centred on the
 * signature. The overlay's centre is measured on hover so it holds the
 * mark wherever the page is scrolled. Clicking the mark switches the light
 * off and follows the link.
 */
export default function SignatureMark({ className = "" }) {
  // Set by a click: the "who is ?" and the spotlight go, even though the
  // pointer is still over the mark while the next page loads.
  const [clicked, setClicked] = useState(false);
  const lightUp = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--jt-x", `${r.left + r.width / 2}px`);
    root.style.setProperty("--jt-y", `${r.top + r.height / 2}px`);
    // The header (logo, nav and the player bar, everything above <main>)
    // never dims: the overlay starts where it ends.
    const main = document.querySelector("main");
    const top = main ? Math.max(0, main.getBoundingClientRect().top) : 0;
    root.style.setProperty("--jt-top", `${top}px`);
    root.style.setProperty("--jt-rx", `${r.width * 0.98}px`);
    root.style.setProperty("--jt-ry", `${r.height * 1.35}px`);
    root.classList.add("jt-spot");
  };
  const lightOut = () => document.documentElement.classList.remove("jt-spot");
  const leave = () => {
    lightOut();
    setClicked(false);
  };
  const click = () => {
    lightOut();
    setClicked(true);
  };

  return (
    <Link
      href="/about#profile"
      aria-label="View JT's profile"
      onMouseEnter={lightUp}
      onMouseLeave={leave}
      onFocus={lightUp}
      onBlur={lightOut}
      onClick={click}
      className={`jt-reveal-link relative block cursor-pointer ${clicked ? "jt-clicked" : ""} ${className}`}
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
      {/* The sweep ends in a lens flare on the tip of the "t"'s long
          stroke, right where the light leaves the signature. */}
      <span aria-hidden="true" className="jt-flare" />
      {/* Only while hovered (see app/globals.css). */}
      <span aria-hidden="true" className="jt-who">
        who is
      </span>
      <span aria-hidden="true" className="jt-q">
        ?
      </span>
    </Link>
  );
}
