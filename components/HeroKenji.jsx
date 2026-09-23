"use client";

import { useEffect, useState } from "react";

/**
 * The meditating/levitating Kenji at the top of the Work With Me hero —
 * pulled into its own client component so it can listen for the guide
 * popup opening (see KenjiGuide's "kenji-guide-open" event) and smoke
 * away while his full-body form is out, the same way the launcher
 * avatar does. Reappears the same way once the dialogue closes.
 */
export default function HeroKenji() {
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    const onToggle = (e) => setGuideOpen(!!e.detail);
    window.addEventListener("kenji-guide-open", onToggle);
    return () => window.removeEventListener("kenji-guide-open", onToggle);
  }, []);

  return (
    <div
      className={`relative mx-auto mt-8 w-[13rem] transition-all duration-700 ease-out sm:w-[16rem] ${
        guideOpen ? "scale-90 opacity-0 blur-md" : "scale-100 opacity-100 blur-0"
      }`}
    >
      {/* A wide, grounded shadow that stays put while he drifts above
          it — the gap and the stillness are what sell the levitation,
          rather than a shadow that tracks his every move. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-3 -bottom-4 h-5 rounded-[50%] bg-black/75 blur-[6px] sm:inset-x-4 sm:-bottom-5"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/kenji-meditating.png"
        alt="Kenji, a lone samurai rendered in carved wood and gold armor, seated cross-legged in meditation"
        className="kenji-levitate relative w-full drop-shadow-[0_14px_16px_rgba(0,0,0,0.3)]"
      />
    </div>
  );
}
