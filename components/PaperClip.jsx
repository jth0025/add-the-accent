import { useId } from "react";

/**
 * A little silver paperclip pinned at the top-left corner of a journal
 * box — sits half on/half off the box's own top edge. Drop it inside
 * any element with position: relative (the "corner-box" class already
 * provides that).
 */
export default function PaperClip() {
  const gradId = useId();

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-[15px] left-4 z-10 rotate-[8deg] drop-shadow-[0_3px_3px_rgba(0,0,0,0.4)]"
    >
      <svg viewBox="0 0 24 24" width="30" height="30">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f4f4f4" />
            <stop offset="45%" stopColor="#bcbfc2" />
            <stop offset="55%" stopColor="#8b8f93" />
            <stop offset="100%" stopColor="#5b5f63" />
          </linearGradient>
        </defs>
        <path
          d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
