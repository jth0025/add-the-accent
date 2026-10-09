import { trackArt } from "@/lib/catalog";

// A small square piece of track art beside an essay's title, so every
// track reads as a record at a glance. `forthcoming` draws the empty
// slot of a track that isn't out yet.
export default function TrackArt({ entry, size = 40, forthcoming = false, className = "" }) {
  const box = { width: size, height: size };
  if (forthcoming || !entry) {
    return (
      <span
        aria-hidden="true"
        className={`inline-block shrink-0 rounded-[3px] border border-dashed border-white/30 bg-white/5 ${className}`}
        style={box}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={trackArt(entry)}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`shrink-0 rounded-[3px] object-cover shadow-[0_2px_5px_rgba(0,0,0,0.45)] ${className}`}
      style={box}
    />
  );
}
