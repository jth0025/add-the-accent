"use client";

import { useEffect, useMemo, useState } from "react";
import { PIECES, tagsOf } from "@/lib/designPieces";

function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const ALL_TAGS = Array.from(new Set(PIECES.flatMap((p) => tagsOf(p.alt)))).sort();

export default function DesignGallery() {
  const [lightbox, setLightbox] = useState(null);
  const [pieces, setPieces] = useState(PIECES);
  const [activeTag, setActiveTag] = useState("all");

  useEffect(() => {
    setPieces(shuffle(PIECES));
  }, []);

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

  const visiblePieces = useMemo(() => {
    if (activeTag === "all") return pieces;
    return pieces.filter((p) => tagsOf(p.alt).includes(activeTag));
  }, [pieces, activeTag]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
          Filter
          <select
            value={activeTag}
            onChange={(e) => setActiveTag(e.target.value)}
            className="rounded-md border border-ink/20 bg-card px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-ink"
          >
            <option value="all">All pieces</option>
            {ALL_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent">
          <span className="commission-legend relative block h-8 w-8 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/design/commission-badge.png"
              alt=""
              className="h-full w-full object-contain"
            />
          </span>
          <span>= Commissioned piece</span>
        </div>
      </div>

      <div className="columns-2 gap-5 sm:columns-3">
        {visiblePieces.map((piece, i) => {
          const isCommission = tagsOf(piece.alt).includes("commission");
          return (
            <button
              key={piece.src}
              type="button"
              onClick={() => setLightbox(piece)}
              style={{
                animationDelay: `${Math.min(i * 40, 640)}ms`,
                "--deal-rot": i % 2 === 0 ? "-4deg" : "4deg",
              }}
              className="deal-in group relative mb-5 block w-full cursor-zoom-in overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl"
              aria-label={`Enlarge: ${piece.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={piece.src}
                alt={piece.alt}
                className="block w-full"
                loading="lazy"
              />
              <span className="bronze-glare" aria-hidden="true" />
              {isCommission && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/design/commission-badge.png"
                  alt="Commissioned piece"
                  className="pointer-events-none absolute -left-2 -top-2 z-10 h-12 w-12 drop-shadow-md sm:h-14 sm:w-14"
                />
              )}
            </button>
          );
        })}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-black/85 p-10"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            aria-label="Close"
            className="absolute right-7 top-5 cursor-pointer text-3xl leading-none text-[#e7ded2]"
          >
            &times;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] cursor-default rounded-lg shadow-2xl"
          />
          {lightbox.alt && (
            <div className="absolute inset-x-10 bottom-7 whitespace-pre-line text-center font-sans text-[13px] text-[#e7ded2]">
              {lightbox.alt}
            </div>
          )}
        </div>
      )}
    </>
  );
}
