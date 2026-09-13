"use client";

import { useEffect, useState } from "react";

// Downtown LA — close enough for a header ornament, no API key needed.
const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=34.05&longitude=-118.24&current=temperature_2m&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles";

/**
 * The current temperature in Los Angeles, fetched once on mount.
 * Renders nothing until it resolves, so it never leaves a placeholder
 * behind if the request fails.
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
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (temp == null) return null;

  return <span>{temp}&deg;F LA</span>;
}
