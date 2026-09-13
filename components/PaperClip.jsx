/**
 * A real photographed paperclip (cut out to transparency from a stock
 * photo — see public/icons/paperclip-photo.png), slid on straight and
 * vertical near the top-left of a card, mostly resting on the card's
 * own surface rather than hanging off the edge. Drop it inside any
 * element with position: relative (the "corner-box" class already
 * provides that).
 */
export default function PaperClip() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-2 left-3 z-20 h-16 w-auto rotate-[7deg]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/paperclip-photo.png" alt="" className="h-full w-auto" />
    </span>
  );
}
