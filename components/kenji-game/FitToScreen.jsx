"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Keeps everything inside it in view, whatever the screen: the content
// keeps its natural layout, and is scaled down (never up) just enough to
// fit the space it is given, centred. `reserveY` keeps clear of the
// buttons pinned to the top of the screen.
export default function FitToScreen({
  children,
  className = "",
  reserveY = 96,
  reserveX = 24,
}) {
  const outer = useRef(null);
  const inner = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return undefined;
    const fit = () => {
      const w = i.offsetWidth;
      const h = i.offsetHeight;
      if (!w || !h) return;
      const s = Math.min(
        1,
        (o.clientWidth - reserveX) / w,
        (o.clientHeight - reserveY) / h,
      );
      setScale(Math.max(0.3, s));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [reserveX, reserveY]);

  return (
    <div
      ref={outer}
      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
    >
      <div
        ref={inner}
        className={className}
        style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
      >
        {children}
      </div>
    </div>
  );
}
