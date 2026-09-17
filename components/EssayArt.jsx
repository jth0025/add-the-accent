/**
 * A single polaroid-framed image — the lead art for a journal essay.
 * Kept small and centered so it reads as an illustration for the piece
 * rather than competing with the writing (see lib/essayArt.js for the
 * per-slug image list).
 */
export default function EssayArt({ src, alt, rotate = -2 }) {
  return (
    <div className="my-8 flex justify-center">
      <div
        className="w-56 shrink-0 rounded-sm border border-black/10 bg-white p-3 pb-6 shadow-[0_14px_24px_-8px_rgba(0,0,0,0.4),0_4px_10px_rgba(0,0,0,0.25)] sm:w-64"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block w-full" />
      </div>
    </div>
  );
}
