"use client";

import { useEffect, useState } from "react";

// One gradient per stretch of the day, each keeping the same 180deg /
// four-stop shape as the original sky so the header's proportions
// never change — only the color story does. Paired with a foreground
// color chosen for contrast against that gradient's own bottom edge
// (where the nav text and grass actually sit), and whether it's dark
// enough for the twinkling stars below to show.
const PERIODS = {
  night: {
    gradient: "linear-gradient(180deg,#0b1026 0%,#141b3d 40%,#1f2a52 75%,#2a3a68 100%)",
    fg: "#f3ead9",
    dark: true,
  },
  dawn: {
    gradient: "linear-gradient(180deg,#1b2340 0%,#3a3f6b 35%,#7d6f96 70%,#d9a6a0 100%)",
    fg: "#f3ead9",
    dark: true,
  },
  sunrise: {
    gradient: "linear-gradient(180deg,#f7c9a8 0%,#f6d9b8 35%,#dce9f0 70%,#cfeaf7 100%)",
    fg: "#2a2a2a",
    dark: false,
  },
  morning: {
    gradient: "linear-gradient(180deg,#eaf7fd 0%,#d3edf9 40%,#b7e0f3 75%,#9ed3ec 100%)",
    fg: "#2a2a2a",
    dark: false,
  },
  midday: {
    gradient: "linear-gradient(180deg,#bfe4fb 0%,#9ed7f5 40%,#7ec8ef 75%,#63b9e8 100%)",
    fg: "#1a1a1a",
    dark: false,
  },
  afternoon: {
    gradient: "linear-gradient(180deg,#cdeaf9 0%,#f0d9a8 40%,#f3c78a 75%,#eab06a 100%)",
    fg: "#2a2a2a",
    dark: false,
  },
  sunset: {
    gradient: "linear-gradient(180deg,#ffb37a 0%,#ff8f7a 35%,#d97a9c 70%,#7c5f9e 100%)",
    fg: "#f3ead9",
    dark: false,
  },
  dusk: {
    gradient: "linear-gradient(180deg,#4a3f75 0%,#33356b 40%,#232b57 75%,#161d3f 100%)",
    fg: "#f3ead9",
    dark: true,
  },
};

// A small scattered field of stars — position/size/delay only, so the
// same handful reads as independent twinkling points rather than one
// shape repeating in lockstep (same idea as the header's own clouds).
const STARS = [
  { left: 8, top: 12, size: 2.5, delay: -0.4 },
  { left: 18, top: 30, size: 1.8, delay: -2.1 },
  { left: 30, top: 8, size: 2, delay: -3.6 },
  { left: 42, top: 22, size: 1.6, delay: -1.2 },
  { left: 55, top: 10, size: 2.2, delay: -4.4 },
  { left: 64, top: 26, size: 1.8, delay: -0.9 },
  { left: 75, top: 14, size: 2.6, delay: -2.8 },
  { left: 85, top: 32, size: 1.8, delay: -3.2 },
  { left: 93, top: 9, size: 2, delay: -1.7 },
  { left: 24, top: 40, size: 1.5, delay: -2.5 },
  { left: 70, top: 42, size: 1.6, delay: -0.6 },
];

function periodForHour(hour) {
  if (hour < 5) return "night";
  if (hour < 6) return "dawn";
  if (hour < 8) return "sunrise";
  if (hour < 11) return "morning";
  if (hour < 16) return "midday";
  if (hour < 18) return "afternoon";
  if (hour < 19) return "sunset";
  if (hour < 21) return "dusk";
  return "night";
}

function currentHourInLA() {
  const hourString = new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    hour12: false,
  });
  return parseInt(hourString, 10) % 24;
}

/**
 * The header's sky, recolored for whatever time of day it actually is
 * in Los Angeles right now — same 180deg gradient shape as the
 * original, just a different palette per stretch of the day. Also
 * drives the --header-fg CSS variable (read by the nav text, tagline,
 * and temperature elsewhere in the header) so text always stays
 * legible against whichever sky is showing, and shows a field of
 * twinkling stars once it's actually dark out. Renders behind the
 * header's own content (clouds, nav, grass); re-checks every few
 * minutes so a long-open tab still drifts through the day.
 */
export default function HeaderSky() {
  const [period, setPeriod] = useState("morning");

  useEffect(() => {
    const update = () => {
      const next = periodForHour(currentHourInLA());
      setPeriod(next);
      document.documentElement.style.setProperty(
        "--header-fg",
        PERIODS[next].fg,
      );
      // Toggled instead of read via React state so the thunderhead
      // (rendered from static markup in layout.jsx, not by this
      // component) can react to it purely in CSS — see
      // html.header-dark .header-cloud--storm in globals.css.
      document.documentElement.classList.toggle(
        "header-dark",
        PERIODS[next].dark,
      );
    };
    update();
    const id = setInterval(update, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const { gradient, dark } = PERIODS[period];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ backgroundImage: gradient }}
    >
      {dark &&
        STARS.map((star, i) => (
          <span
            key={i}
            className="header-star absolute rounded-full bg-[#fdf6e3]"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              boxShadow: "0 0 3px 1px rgba(253, 246, 227, 0.6)",
            }}
          />
        ))}
      {dark && <span className="shooting-star absolute" />}
    </div>
  );
}
