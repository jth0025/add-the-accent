"use client";

import { useEffect, useState } from "react";

// A free, no-account hit counter (abacus.jasoncameron.dev). The namespace
// + key below are this site's bucket; /hit increments, /get just reads.
const BASE = "https://abacus.jasoncameron.dev";
const NS = "add-the-accent-jth";
const KEY = "site-visits";
const SESSION_FLAG = "ata-visit-counted";

export default function VisitCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(
      window.location.hostname,
    );

    let countedThisSession = false;
    try {
      countedThisSession = sessionStorage.getItem(SESSION_FLAG) === "1";
    } catch {
      /* private mode — treat as not counted */
    }

    // Increment once per browser session on the live site; otherwise just read.
    const shouldIncrement = !isLocal && !countedThisSession;
    const url = `${BASE}/${shouldIncrement ? "hit" : "get"}/${NS}/${KEY}`;

    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (typeof data?.value === "number") setCount(data.value);
        if (shouldIncrement) {
          try {
            sessionStorage.setItem(SESSION_FLAG, "1");
          } catch {
            /* ignore */
          }
        }
      })
      .catch(() => {
        /* counter service unreachable — render nothing */
      });
  }, []);

  // Nothing until we have a real number, so the header never shows a stray 0.
  if (count == null) return null;

  return (
    <div
      className="mb-2 hidden shrink-0 select-none flex-col items-center gap-0.5 sm:flex"
      aria-label={`${count.toLocaleString()} site visits`}
      title={`${count.toLocaleString()} site visits`}
    >
      <span className="rounded border border-ink/25 bg-white/40 px-1.5 py-[3px] font-mono text-[10px] font-semibold leading-none tabular-nums tracking-tight text-ink/70">
        {String(count).padStart(4, "0")}
      </span>
      <span className="font-mono text-[6.5px] uppercase tracking-[0.2em] text-ink/45">
        visits
      </span>
    </div>
  );
}
