"use client";

import { useEffect, useState } from "react";

// The header's original static sky — used as the default/fallback
// until the client resolves the actual hour in LA, and again if that
// resolution ever fails.
const MORNING =
  "linear-gradient(180deg,#eaf7fd 0%,#d3edf9 40%,#b7e0f3 75%,#9ed3ec 100%)";

// One gradient per stretch of the day, each keeping the same 180deg /
// four-stop shape as the original sky so the header's proportions
// never change — only the color story does.
const SKY = {
  night: "linear-gradient(180deg,#0b1026 0%,#141b3d 40%,#1f2a52 75%,#2a3a68 100%)",
  dawn: "linear-gradient(180deg,#1b2340 0%,#3a3f6b 35%,#7d6f96 70%,#d9a6a0 100%)",
  sunrise: "linear-gradient(180deg,#f7c9a8 0%,#f6d9b8 35%,#dce9f0 70%,#cfeaf7 100%)",
  morning: MORNING,
  midday: "linear-gradient(180deg,#bfe4fb 0%,#9ed7f5 40%,#7ec8ef 75%,#63b9e8 100%)",
  afternoon: "linear-gradient(180deg,#cdeaf9 0%,#f0d9a8 40%,#f3c78a 75%,#eab06a 100%)",
  sunset: "linear-gradient(180deg,#ffb37a 0%,#ff8f7a 35%,#d97a9c 70%,#7c5f9e 100%)",
  dusk: "linear-gradient(180deg,#4a3f75 0%,#33356b 40%,#232b57 75%,#161d3f 100%)",
};

function gradientForHour(hour) {
  if (hour < 5) return SKY.night;
  if (hour < 6) return SKY.dawn;
  if (hour < 8) return SKY.sunrise;
  if (hour < 11) return SKY.morning;
  if (hour < 16) return SKY.midday;
  if (hour < 18) return SKY.afternoon;
  if (hour < 19) return SKY.sunset;
  if (hour < 21) return SKY.dusk;
  return SKY.night;
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
 * original, just a different palette per stretch of the day. Renders
 * as a plain absolutely-positioned fill behind the header's own
 * content (clouds, nav, grass), so nothing else about the header
 * changes. Re-checks every few minutes so a long-open tab still drifts
 * through the day.
 */
export default function HeaderSky() {
  const [gradient, setGradient] = useState(MORNING);

  useEffect(() => {
    const update = () => setGradient(gradientForHour(currentHourInLA()));
    update();
    const id = setInterval(update, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0"
      style={{ backgroundImage: gradient }}
    />
  );
}
