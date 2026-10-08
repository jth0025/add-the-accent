"use client";

import { useEffect, useRef, useState } from "react";
import "./smudge-layer.css";

const FADE =
  "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.78) 35%, rgba(0,0,0,0.42) 70%, rgba(0,0,0,0.16) 100%)";

// How far an element's shadow reaches past its box, from its computed
// box-shadow / drop-shadow / blur. 0 means it casts none.
function shadowReach(cs) {
  let reach = 0;
  const nums = (str) => (str.match(/-?\d*\.?\d+px/g) || []).map(parseFloat);
  if (cs.boxShadow && cs.boxShadow !== "none") {
    // Several shadows are comma-separated at the top level.
    cs.boxShadow.split(/,(?![^(]*\))/).forEach((sh) => {
      if (/inset/.test(sh)) return;
      const [x = 0, y = 0, blur = 0, spread = 0] = nums(sh);
      reach = Math.max(reach, Math.max(Math.abs(x), Math.abs(y)) + blur + spread);
    });
  }
  if (cs.filter && cs.filter !== "none") {
    (cs.filter.match(/drop-shadow\([^)]*\)[^)]*\)?/g) || []).forEach((sh) => {
      const [x = 0, y = 0, blur = 0] = nums(sh);
      reach = Math.max(reach, Math.max(Math.abs(x), Math.abs(y)) + blur * 1.5);
    });
    const b = cs.filter.match(/blur\((-?\d*\.?\d+)px\)/);
    if (b) reach = Math.max(reach, parseFloat(b[1]) * 3);
  }
  return Math.min(reach, 140);
}

// A smudge wall (public/textures/smudges.webp) multiplied into whatever
// is behind it — always the wall's own color, only darker — and kept
// out of the way of every shadow: anything casting a shadow is cut out
// of the layer with room to spare. Put it as the first child of a
// positioned container.
export default function SmudgeLayer({ variant = "home", className = "" }) {
  const ref = useRef(null);
  const [mask, setMask] = useState(null);

  useEffect(() => {
    const layer = ref.current;
    const parent = layer?.parentElement;
    if (!layer || !parent) return undefined;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const lr = layer.getBoundingClientRect();
      const W = Math.round(lr.width);
      const H = Math.round(lr.height);
      if (W < 2 || H < 2) return;
      const rects = [];
      parent.querySelectorAll("*").forEach((el) => {
        if (layer.contains(el)) return;
        if (el.tagName.toLowerCase() !== "svg" && el.closest("svg")) return;
        const cs = getComputedStyle(el);
        const reach = shadowReach(cs);
        if (reach < 3) return;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return;
        let { left, top, right, bottom } = r;
        for (let a = el.parentElement; a && a !== parent; a = a.parentElement) {
          const acs = getComputedStyle(a);
          if (acs.overflowX !== "visible" || acs.overflowY !== "visible") {
            const ar = a.getBoundingClientRect();
            left = Math.max(left, ar.left - reach);
            top = Math.max(top, ar.top - reach);
            right = Math.min(right, ar.right + reach);
            bottom = Math.min(bottom, ar.bottom + reach);
          }
        }
        if (right <= left || bottom <= top) return;
        const pad = reach + 16;
        const x = left - lr.left - pad;
        const y = top - lr.top - pad;
        const w = right - left + pad * 2;
        const h = bottom - top + pad * 2;
        if (w >= W * 0.98 && h >= H * 0.9) return;
        rects.push(
          `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="14"/>`,
        );
      });
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
        `<defs><filter id="b" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feGaussianBlur stdDeviation="14"/></filter>` +
        `<mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/>` +
        `<g filter="url(#b)" fill="#000">${rects.join("")}</g></mask></defs>` +
        `<rect width="${W}" height="${H}" fill="#000" mask="url(#m)"/></svg>`;
      setMask(`url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(parent);
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    document.fonts?.ready?.then(schedule);
    const t1 = window.setTimeout(schedule, 700);
    const t2 = window.setTimeout(schedule, 2500);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`smudge-layer smudge-layer--${variant} ${className}`}
      style={
        mask
          ? {
              // The shadow cut-outs, times a top-to-bottom fade (strongest
              // at the top of the wall, dying away toward the bottom).
              WebkitMaskImage: `${mask}, ${FADE}`,
              maskImage: `${mask}, ${FADE}`,
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect",
              WebkitMaskSize: "100% 100%, 100% 100%",
              maskSize: "100% 100%, 100% 100%",
            }
          : { visibility: "hidden" }
      }
    />
  );
}
