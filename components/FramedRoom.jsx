"use client";

import { useLayoutEffect, useRef, useState } from "react";

// A section set inside a picture of a bright room: the picture fills the
// whole section (stretched to its edges, never zoomed or cropped), and the
// words sit inside the picture's own inner box. The section grows tall
// enough that the words always fit inside that box.
//
// The inner box of /about-room.jpg (2000 x 1260), as shares of the picture:
const BOX = { left: 21.25, right: 21.3, top: 20.6, bottom: 20.7 };
const BOX_H = 100 - BOX.top - BOX.bottom; // the inner box's share of the height

export default function FramedRoom({ children, className = "" }) {
  const content = useRef(null);
  const [h, setH] = useState(null); // measured content height, px

  useLayoutEffect(() => {
    const el = content.current;
    if (!el) return undefined;
    const measure = () => setH(el.offsetHeight);
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Tall enough that the content fits the inner box (with a little air);
  // never shorter than the picture's own proportions.
  const need = h ? Math.ceil(((h + 24) / BOX_H) * 100) : null;

  return (
    <section
      className={`relative w-full overflow-hidden rounded-xl border border-ink/15 ${className}`}
      style={{
        aspectRatio: "2000 / 1260",
        minHeight: need ? `${need}px` : undefined,
        backgroundImage: "url(/about-room.jpg)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#d9d1ce",
      }}
    >
      <div
        className="absolute"
        style={{ left: `${BOX.left}%`, right: `${BOX.right}%`, top: `${BOX.top}%`, bottom: `${BOX.bottom}%` }}
      >
        <div ref={content} className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-1 py-2 text-center">
          {children}
        </div>
      </div>
    </section>
  );
}
