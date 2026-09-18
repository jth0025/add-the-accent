import { SERIES_COVER_COLOR, SERIES_TOTAL_PARTS } from "@/lib/seriesColors";

/**
 * A slim "bookmark" progress bar for the top of a series: a status line
 * (In Progress, blinking / Series Complete), a thin ribbon track with a
 * dot marking each planned installment and a bookmark tag riding the
 * leading edge, and a compact fraction. Renders nothing for a series
 * with no known total.
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
  const isComplete = remaining === 0;

  const trackColor = isDark ? "rgba(255,255,255,0.18)" : "rgba(26,26,26,0.12)";
  const dotEmptyFill = isDark ? "#2a2a28" : "#ffffff";
  const dotEmptyBorder = isDark ? "rgba(255,255,255,0.5)" : "rgba(26,26,26,0.3)";

  return (
    <div
      className={className}
      role="img"
      aria-label={`${series}: ${
        isComplete ? "series complete" : "in progress"
      }, ${count} of ${total} installments published${
        remaining > 0 ? `, ${remaining} to go` : ""
      }`}
    >
      {/* Status line — the one word that answers "is this still going?" */}
      <div
        aria-hidden="true"
        className={`mb-1.5 flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wide ${
          isComplete ? "text-[#1f9d55]" : "text-[#e0333f]"
        }`}
      >
        {isComplete ? (
          <span>Series complete</span>
        ) : (
          <>
            <span>In progress</span>
            <span className="inline-flex items-end gap-[2px]">
              <span className="blink-dot h-1 w-1 rounded-full bg-current" style={{ animationDelay: "0ms" }} />
              <span className="blink-dot h-1 w-1 rounded-full bg-current" style={{ animationDelay: "200ms" }} />
              <span className="blink-dot h-1 w-1 rounded-full bg-current" style={{ animationDelay: "400ms" }} />
            </span>
          </>
        )}
      </div>

      <div aria-hidden="true" className="flex items-center gap-3">
        <div
          className="relative h-[3px] flex-1 rounded-full"
          style={{ backgroundColor: trackColor }}
        >
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
          {/* One dot per planned installment, so the total reads at a glance. */}
          {Array.from({ length: total }, (_, i) => {
            const n = i + 1;
            const filled = n <= count;
            return (
              <span
                key={n}
                className="absolute top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${(n / total) * 100}%`,
                  backgroundColor: filled ? color : dotEmptyFill,
                  border: `1px solid ${filled ? color : dotEmptyBorder}`,
                }}
              />
            );
          })}
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
          className={`shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-wide ${
            isDark ? "text-white/70" : "text-stone/70"
          }`}
        >
          {count}/{total}
        </span>
      </div>
    </div>
  );
}
