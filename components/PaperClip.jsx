import { useId } from "react";

/**
 * A silver paperclip clamped over the top-left corner of a card — a
 * front loop that overlaps the corner on the diagonal (the way a real
 * clip bites across a corner rather than sitting flat on an edge), a
 * soft contact shadow pressed into the paper underneath it, and a
 * sliver of the clip's back wire peeking out past the corner point to
 * suggest it actually wraps around the paper rather than floating on
 * top of it. Drop it inside any element with position: relative (the
 * "corner-box" class already provides that, and must NOT use
 * overflow-hidden or the corner sliver gets clipped away).
 */
export default function PaperClip() {
  const gradId = useId();

  const clipPath =
    "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48";

  return (
    <>
      {/* Contact shadow — a soft smudge pressed into the card by the
          clip's front loop, anchored to the corner itself. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1 -left-1 z-[1] h-9 w-9 -rotate-[32deg] rounded-full bg-black/30 blur-[3px]"
      />

      {/* Back wire — the same clip, dimmed and offset a touch further
          out along its own axis, sitting BEHIND the card (negative
          z-index against the card's own positioned stacking context)
          so only the sliver that pokes past the corner is visible. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 -left-4 z-[-1] -rotate-[32deg] opacity-70"
      >
        <svg viewBox="0 0 24 24" width="34" height="34">
          <path
            d={clipPath}
            fill="none"
            stroke="#6b6f73"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Front wire — clamped diagonally across the actual corner
          point, drawn last so it sits above the card and its contents. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 -left-3 z-20 -rotate-[32deg] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
      >
        <svg viewBox="0 0 24 24" width="34" height="34">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f4f4f4" />
              <stop offset="45%" stopColor="#bcbfc2" />
              <stop offset="55%" stopColor="#8b8f93" />
              <stop offset="100%" stopColor="#5b5f63" />
            </linearGradient>
          </defs>
          <path
            d={clipPath}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  );
}
