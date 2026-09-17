import { SERIES_COVER_COLOR, SERIES_TOTAL_PARTS } from "@/lib/seriesColors";

/**
 * A slim "bookmark" progress bar for the top of a series: a thin ribbon
 * track filled up to the highest published part, with a little bookmark
 * tag riding the leading edge (echoing the site's book-cover motif) and
 * a caption naming how many installments remain. Renders nothing for a
 * series with no known total.
 */
export default function SeriesProgress({ series, entries, tone = "light", className = "" }) {
  const total = SERIES_TOTAL_PARTS[series];
  if (!total) return null;

  const published = Math.max(
    0,
    ...entries.map((e) => e.part || 0),
    entries.length,
  );
  const count = Math.min(published, total);
  const remaining = total - count;
  const pct = Math.round((count / total) * 100);
  const color = SERIES_COVER_COLOR[series] || "#33322d";
  const isDark = tone === "dark";

  return (
    <div
      className={`flex items-center gap-3 ${className}`}
      role="img"
      aria-label={`${series}: ${count} of ${total} installments published${
        remaining > 0 ? `, ${remaining} to go` : ", complete"
      }`}
    >
      <div
        aria-hidden="true"
        className="relative h-[3px] flex-1 rounded-full"
        style={{ backgroundColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(26,26,26,0.12)" }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
        <svg
          viewBox="0 0 10 14"
          className="absolute -top-[6px] h-[15px] w-auto -translate-x-1/2 drop-shadow-sm"
          style={{ left: `${pct}%` }}
        >
          <path
            d="M1 0h8a1 1 0 0 1 1 1v12l-5-3-5 3V1a1 1 0 0 1 1-1z"
            fill={color}
            stroke={isDark ? "rgba(255,255,255,0.55)" : "rgba(26,26,26,0.3)"}
            strokeWidth="0.6"
          />
        </svg>
      </div>
      <span
        aria-hidden="true"
        className={`shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-wide ${
          isDark ? "text-white/70" : "text-stone/70"
        }`}
      >
        {remaining > 0 ? `${count}/${total} — ${remaining} to go` : `Complete — ${total}/${total}`}
      </span>
    </div>
  );
}
