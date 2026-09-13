/**
 * A real photographed paperclip (cut out to transparency from a stock
 * photo — see public/icons/paperclip-photo.png), clamped over the
 * top-left corner of a card. The photo's own hook faces the image's
 * top-right as shot, so it's mirrored (scaleX) so the hook lands
 * top-left, poking up past the corner, while its body sweeps down and
 * to the right across the card — the way a clip actually bites a
 * corner rather than sitting flat on an edge. A soft contact shadow
 * grounds it into the paper underneath. Drop it inside any element
 * with position: relative (the "corner-box" class already provides
 * that) that does NOT use overflow-hidden, or the part poking past the
 * corner gets clipped away.
 */
export default function PaperClip() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1 -left-1 z-[1] h-8 w-8 -rotate-[20deg] rounded-full bg-black/25 blur-[3px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-5 -left-4 z-20 h-16 w-auto -scale-x-100 -rotate-[18deg] drop-shadow-[0_3px_3px_rgba(0,0,0,0.45)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/paperclip-photo.png" alt="" className="h-full w-auto" />
      </span>
    </>
  );
}
