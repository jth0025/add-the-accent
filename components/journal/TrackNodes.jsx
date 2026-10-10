import { TOTAL_TRACKS } from "@/lib/catalog";

/**
 * The seven-part structure of a long play, in plain terms: seven nodes,
 * one per track — the ones that are out are filled, the rest are greyed
 * and simply "forthcoming" (nothing is locked or to be earned). The
 * album itself counts as unpublished until all seven are down.
 */
export default function TrackNodes({
  published,
  total = TOTAL_TRACKS,
  color = "#d3ac52",
  className = "",
  showNote = false,
  compact = false,
}) {
  const count = Math.min(published, total);
  const complete = count >= total;
  return (
    <div
      className={className}
      role="img"
      aria-label={`${count} of ${total} essays available${
        complete ? ", collection complete" : ", collection in progress"
      }`}
    >
      <div
        aria-hidden="true"
        className={`flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wide ${
          complete ? "text-[#4fd18a]" : "text-[#ff6b75]"
        }`}
      >
        {complete ? (
          <span>Collection complete</span>
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
      <div aria-hidden="true" className="mt-2 flex items-center">
        {Array.from({ length: total }, (_, i) => {
          const out = i < count;
          return (
            <span key={i} className="flex items-center">
              {i > 0 && (
                <span
                  className={`h-[2px] ${compact ? "w-2.5" : "w-4 sm:w-6"}`}
                  style={{ background: i < count ? color : "rgba(255,255,255,0.18)" }}
                />
              )}
              <span
                className={`block rounded-full border-2 ${compact ? "h-3 w-3" : "h-3.5 w-3.5"}`}
                style={
                  out
                    ? { background: color, borderColor: color }
                    : { background: "transparent", borderColor: "rgba(255,255,255,0.28)" }
                }
              />
            </span>
          );
        })}
      </div>
      <p aria-hidden="true" className="mt-2 font-mono text-xs uppercase tracking-widest text-white/80">
        {count} of {total} essays
      </p>
      {showNote && !complete && (
        <p aria-hidden="true" className="mt-1 max-w-xs text-[12px] italic text-white/55">
          The collection is in progress; {count} of {total} essays available.
        </p>
      )}
    </div>
  );
}
