import { SERIES_TOTAL_PARTS } from "@/lib/seriesColors";

// Each series' bar is lit in the colors of its own key art: Homebody's
// burnt orange on charcoal, Domain Expansion's neon-jungle spectrum under
// a gold frame, Back to Oui's sunset running ember to amber. `stops` is
// the gradient across the lit run (left → right), `glow` the halo around
// it, `accent` the trim (ticks, rim, fraction).
const HUD_PALETTES = {
  Homebody: {
    stops: ["#7a3512", "#d9813f", "#f6cf98"],
    glow: "rgba(217,129,63,0.6)",
    accent: "#e8955a",
  },
  "Domain Expansion": {
    stops: ["#27c9e8", "#58e39a", "#b98cff"],
    glow: "rgba(88,227,170,0.55)",
    accent: "#e2c27a",
  },
  "Back to Oui": {
    stops: ["#9e2f0c", "#f0701f", "#ffc94d"],
    glow: "rgba(240,112,31,0.6)",
    accent: "#ffb547",
  },
};

const DEFAULT_PALETTE = {
  stops: ["#8a4a12", "#e0a860", "#f6dca8"],
  glow: "rgba(224,168,96,0.55)",
  accent: "#e0a860",
};

/**
 * A sci-fi HUD readout for the top of a series: a status line (In
 * Progress, blinking / Series Complete) over a circular gauge — a lit arc
 * and the percent in its dark lens — docked to an angled gunmetal
 * housing that holds one segment per planned installment. The lit
 * segments share a single continuous gradient (each cell shows its slice
 * of it), glow in the series' colors, and the leading cell breathes while
 * the series is still going. Renders nothing for a series with no known
 * total.
 */
export default function SeriesProgress({ series, entries, className = "" }) {
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
  const isComplete = remaining === 0;
  const palette = HUD_PALETTES[series] || DEFAULT_PALETTE;
  const [from, mid, to] = palette.stops;
  const gradient = `linear-gradient(90deg, ${from} 0%, ${mid} 55%, ${to} 100%)`;
  const id = `hud-${series.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  // Gauge geometry: a 270° arc opening at the bottom, like a dial.
  const r = 22;
  const circumference = 2 * Math.PI * r;
  const sweep = circumference * 0.75;

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
        className={`mb-2 flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wide ${
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

      <div aria-hidden="true" className="relative flex items-center">
        {/* ---- Gauge ---- */}
        <div className="relative z-10 h-16 w-16 shrink-0 rounded-full bg-gradient-to-b from-[#4a4a4e] to-[#141416] p-[3px] shadow-[0_4px_10px_rgba(0,0,0,0.45)]">
          <svg viewBox="0 0 58 58" className="h-full w-full">
            <defs>
              <linearGradient id={`${id}-arc`} x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor={from} />
                <stop offset="55%" stopColor={mid} />
                <stop offset="100%" stopColor={to} />
              </linearGradient>
              <radialGradient id={`${id}-lens`} cx="50%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#3a3a3e" />
                <stop offset="100%" stopColor="#0d0d0f" />
              </radialGradient>
            </defs>
            <circle cx="29" cy="29" r="28" fill="#18181a" />
            {/* Unlit track, then the lit arc over it. */}
            <circle
              cx="29"
              cy="29"
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="5"
              strokeDasharray={`${sweep} ${circumference}`}
              transform="rotate(135 29 29)"
            />
            <circle
              cx="29"
              cy="29"
              r={r}
              fill="none"
              stroke={`url(#${id}-arc)`}
              strokeWidth="5"
              strokeLinecap="butt"
              strokeDasharray={`${(sweep * count) / total} ${circumference}`}
              transform="rotate(135 29 29)"
              style={{ filter: `drop-shadow(0 0 2px ${palette.glow})` }}
            />
            {/* Fine tick ring, one notch per installment. */}
            {Array.from({ length: total + 1 }, (_, i) => {
              const a = ((135 + (270 * i) / total) * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={29 + Math.cos(a) * 26}
                  y1={29 + Math.sin(a) * 26}
                  x2={29 + Math.cos(a) * 27.6}
                  y2={29 + Math.sin(a) * 27.6}
                  stroke={palette.accent}
                  strokeOpacity="0.7"
                  strokeWidth="0.8"
                />
              );
            })}
            <circle cx="29" cy="29" r="17" fill={`url(#${id}-lens)`} stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
            <text
              x="29"
              y="30"
              textAnchor="middle"
              fill={to}
              className="font-mono"
              fontSize="11"
              fontWeight="700"
            >
              {pct}
            </text>
            <text x="29" y="39" textAnchor="middle" fill={palette.accent} fillOpacity="0.8" className="font-mono" fontSize="5.5">
              %
            </text>
          </svg>
        </div>

        {/* ---- Housing: angled gunmetal slab docked to the gauge ---- */}
        <div className="relative -ml-3 flex-1">
          {/* Trim dashes riding the top edge, as on a cockpit panel. */}
          <span
            className="absolute -top-[5px] right-10 h-[2px] w-8 rounded-full"
            style={{ backgroundColor: palette.accent, opacity: 0.85 }}
          />
          <span className="absolute -top-[5px] right-[5.25rem] h-[2px] w-3 rounded-full bg-white/30" />

          <div
            className="relative flex h-9 items-center gap-3 bg-gradient-to-b from-[#45454a] via-[#26262a] to-[#151517] pl-6 pr-9 shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
            style={{ clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 100%, 0 100%)" }}
          >
            {/* Recessed channel holding the segments. */}
            <div className="relative flex h-4 flex-1 gap-[3px] rounded-[3px] bg-black/55 p-[2px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
              {Array.from({ length: total }, (_, i) => {
                const lit = i < count;
                const leading = lit && i === count - 1 && !isComplete;
                return (
                  <span
                    key={i}
                    className={`relative flex-1 overflow-hidden rounded-[2px] ${leading ? "hud-pulse" : ""}`}
                    style={
                      lit
                        ? {
                            backgroundImage: gradient,
                            // Every lit cell shows its own slice of one
                            // gradient stretched over the lit run, so the
                            // run reads continuous and always spans the
                            // full palette, however far along it is.
                            backgroundSize: `${count * 100}% 100%`,
                            backgroundPosition: `${count > 1 ? (i / (count - 1)) * 100 : 0}% 0`,
                            boxShadow: `0 0 6px ${palette.glow}`,
                          }
                        : { backgroundColor: "rgba(255,255,255,0.06)" }
                    }
                  >
                    {lit && (
                      // Glassy top highlight.
                      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent" />
                    )}
                  </span>
                );
              })}
              {/* A light sheen sweeping across the lit run. */}
              {count > 0 && (
                <span
                  className="pointer-events-none absolute inset-y-[2px] left-[2px] overflow-hidden rounded-[2px]"
                  style={{ width: `calc(${(count / total) * 100}% - 4px)` }}
                >
                  <span className="hud-sheen absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </span>
              )}
            </div>
            <span
              className="shrink-0 whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-wide"
              style={{ color: palette.accent }}
            >
              {count}/{total}
            </span>
          </div>
          {/* Thin lit rim along the housing's bottom edge. */}
          <span
            className="absolute -bottom-[3px] left-6 h-[2px] w-1/3 rounded-full"
            style={{ backgroundImage: gradient, opacity: 0.9 }}
          />
        </div>
      </div>
    </div>
  );
}
