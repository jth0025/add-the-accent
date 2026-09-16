/**
 * A real photographed paperclip (cut out to transparency from a stock
 * photo — see public/icons/paperclip-photo.png), slid on straight and
 * vertical near the top-left of a card, mostly resting on the card's
 * own surface rather than hanging off the edge. Drop it inside any
 * element with position: relative (the "corner-box" class already
 * provides that). Pass `position` to override the default placement
 * (e.g. to slide it further right so it sits on the card rather than
 * off its rounded corner) without touching the other call sites.
 */
export default function PaperClip({ position = "-top-4 left-1 rotate-[7deg]" }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 h-16 w-auto ${position}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/paperclip-photo.png" alt="" className="h-full w-auto" />
    </span>
  );
}
