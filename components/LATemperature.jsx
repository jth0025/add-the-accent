"use client";

import { useEffect, useState } from "react";

// Precise Downtown LA coordinates (Pershing Square / City Hall area) —
// the header just labels it "LA", but the reading itself is DTLA's,
// not a citywide average. No API key needed.
const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=34.0407&longitude=-118.2468&current=temperature_2m,precipitation&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles";

/**
 * The current temperature in Downtown LA, fetched once on mount.
 * Renders nothing until it resolves, so it never leaves a placeholder
 * behind if the request fails. Also toggles html.header-raining off the
 * same response, so the header's rain (see globals.css) only ever shows
 * when it's actually raining right now — not on a decorative schedule.
 */
export default function LATemperature() {
  const [temp, setTemp] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(FORECAST_URL)
      .then((res) => res.json())
      .then((data) => {
        const value = data?.current?.temperature_2m;
        if (!cancelled && typeof value === "number") {
          setTemp(Math.round(value));
        }
        const precipitation = data?.current?.precipitation;
        if (!cancelled && typeof precipitation === "number") {
          document.documentElement.classList.toggle(
            "header-raining",
            precipitation > 0,
          );
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (temp == null) return null;

  return <span>{temp}&deg;F LA</span>;
}
