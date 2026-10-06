"use client";

import { useEffect } from "react";
import { tagsOf } from "@/lib/designPieces";
import {
  isCommissioned,
  labelOf,
  mediumOf,
  titleOf,
} from "@/lib/designCategories";

// Full-size view for a Museum piece: the work hangs in a mat and a dark
// frame, with a small museum placard beneath it — title, maker, medium and
// the piece's tags — instead of a bare image on a black screen.
export default function DesignPlacard({ piece, onClose }) {
  useEffect(() => {
    if (!piece) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [piece, onClose]);

  if (!piece) return null;

  const title = titleOf(piece.alt);
  const tags = tagsOf(piece.alt).filter((t) => t.length > 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || "Artwork"}
      className="fixed inset-0 z-[200] flex cursor-zoom-out overflow-y-auto bg-[radial-gradient(ellipse_at_50%_35%,rgba(58,52,44,0.96)_0%,rgba(14,12,10,0.98)_75%)] p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="fixed right-5 top-3 z-10 cursor-pointer text-4xl leading-none text-[#e7ded2] hover:text-white"
      >
        &times;
      </button>

      <figure
        className="m-auto flex max-w-full cursor-default flex-col items-stretch gap-5 py-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Frame → mat → work. */}
        <div className="bg-gradient-to-br from-[#4a3720] via-[#20160b] to-[#46341d] p-[9px] shadow-[0_34px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(201,162,74,0.35)] sm:p-[14px]">
          <div className="bg-[#f4f0e6] p-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.22),inset_0_0_0_1px_rgba(0,0,0,0.1)] sm:p-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={piece.src}
              alt={piece.alt}
              className="mx-auto block h-auto max-h-[56vh] w-auto max-w-[calc(100vw-5.5rem)] shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.25)] sm:max-h-[62vh] sm:max-w-[min(calc(100vw-9rem),1100px)]"
            />
          </div>
        </div>

        {/* The placard — hung low and to the right, like a wall label. */}
        <figcaption className="ml-auto w-full max-w-[19rem] border border-[#cfc6ad] bg-[#efe9da] px-4 py-3 text-left text-[#26211a] shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
          <div className="font-playfair text-[17px] font-bold italic leading-tight">
            {title || "Untitled"}
          </div>
          <div className="mt-0.5 font-serif text-[13px]">J.T. Harris</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6b5f45]">
            {mediumOf(piece.alt)}
          </div>
          {isCommissioned(piece.alt) && (
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a6a14]">
              Commissioned work
            </div>
          )}
          {tags.length > 0 && (
            <div className="mt-2 border-t border-[#26211a]/20 pt-2 font-serif text-[12px] leading-snug text-[#4b4331]">
              {tags.map(labelOf).join(" · ")}
            </div>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
