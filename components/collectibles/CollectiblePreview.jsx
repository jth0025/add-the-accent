"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import "./collectible-gallery.css";

// Where a preview goes relative to the box it belongs to: beside it when
// there is room, otherwise above or below, always kept inside the screen.
// Also works out the path of the thought-bubble dots (touch screens), which
// float from the bubble toward the box it belongs to.
export function place(anchor, pw, ph, preferSide, gap = 16) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const m = 12;
  const spaceR = vw - anchor.right - m;
  const spaceL = anchor.left - m;
  const spaceT = anchor.top - m;
  const spaceB = vh - anchor.bottom - m;
  const fits = {
    right: spaceR >= pw + gap,
    left: spaceL >= pw + gap,
    above: spaceT >= ph + gap,
    below: spaceB >= ph + gap,
  };
  let side;
  const sides = [];
  if (preferSide) sides.push(spaceR >= spaceL ? "right" : "left");
  sides.push(spaceT >= spaceB ? "above" : "below");
  if (!preferSide) sides.push(spaceR >= spaceL ? "right" : "left");
  side = sides.find((s) => fits[s]);
  if (!side) {
    // Nothing fits cleanly: take the side that is short by the least, so the
    // preview overlaps a neighbour rather than the figure it belongs to.
    const need = { right: pw + gap, left: pw + gap, above: ph + gap, below: ph + gap };
    const have = { right: spaceR, left: spaceL, above: spaceT, below: spaceB };
    side = Object.keys(need).sort((a, b) => need[a] - have[a] - (need[b] - have[b]))[0];
  }

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  let left;
  let top;
  if (side === "right") {
    left = anchor.right + gap;
    top = anchor.top + anchor.height * 0.12;
  } else if (side === "left") {
    left = anchor.left - gap - pw;
    top = anchor.top + anchor.height * 0.12;
  } else if (side === "above") {
    left = anchor.left + anchor.width / 2 - pw / 2;
    top = anchor.top - gap - ph;
  } else {
    left = anchor.left + anchor.width / 2 - pw / 2;
    top = anchor.bottom + gap;
  }
  left = clamp(left, m, Math.max(m, vw - pw - m));
  top = clamp(top, m, Math.max(m, vh - ph - m));

  // The dots run from the bubble's nearest edge to the box.
  const target =
    side === "right"
      ? { x: anchor.right - 6, y: anchor.top + anchor.height * 0.4 }
      : side === "left"
      ? { x: anchor.left + 6, y: anchor.top + anchor.height * 0.4 }
      : side === "above"
      ? { x: anchor.left + anchor.width / 2, y: anchor.top + 8 }
      : { x: anchor.left + anchor.width / 2, y: anchor.bottom - 8 };
  const cx = clamp(target.x, left + 24, left + pw - 24);
  const cy = clamp(target.y, top + 24, top + ph - 24);
  let start;
  if (side === "right") start = { x: left, y: cy };
  else if (side === "left") start = { x: left + pw, y: cy };
  else if (side === "above") start = { x: cx, y: top + ph };
  else start = { x: cx, y: top };
  const dots = [0.22, 0.52, 0.8].map((t) => ({
    x: start.x + (target.x - start.x) * t - left,
    y: start.y + (target.y - start.y) * t - top,
  }));
  // An invisible bridge from the box to the bubble, so the pointer can
  // cross to it without passing over anything else (a neighbouring figure
  // would otherwise open its own bubble and close this one).
  let b = null;
  if (side === "right") b = { x: anchor.right - 2, y: anchor.top, w: left - anchor.right + 6, h: anchor.height };
  else if (side === "left") b = { x: left + pw - 4, y: anchor.top, w: anchor.left - (left + pw) + 6, h: anchor.height };
  else if (side === "above") b = { x: anchor.left, y: top + ph - 4, w: anchor.width, h: anchor.top - (top + ph) + 6 };
  else b = { x: anchor.left, y: anchor.bottom - 2, w: anchor.width, h: top - anchor.bottom + 6 };
  const bridge = b.w > 0 && b.h > 0 ? { left: b.x - left, top: b.y - top, width: b.w, height: b.h } : null;
  return { side, left, top, dots, bridge };
}

export function Preview({ item, anchorRef, closable = false, onClose, id }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    const update = () => {
      const el = ref.current;
      const anchor = anchorRef.current;
      if (!el || !anchor) return;
      const r = el.getBoundingClientRect();
      setPos(place(anchor.getBoundingClientRect(), r.width, r.height, window.innerWidth >= 700, 40));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [anchorRef]);

  const published = !!item.essayUrl;
  return (
    <div
      ref={ref}
      id={id}
      role="group"
      aria-label={`${item.identity}: ${item.essayTitle}`}
      className={`cg-preview cg-preview--bubble ${pos ? "is-placed" : ""}`}
      style={pos ? { left: pos.left, top: pos.top } : undefined}
      data-side={pos?.side}
    >
      {pos?.bridge && <span aria-hidden="true" className="cg-bridge" style={pos.bridge} />}
      {pos &&
        pos.dots.map((d, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`cg-dot cg-dot--${i + 1}`}
            style={{ left: d.x, top: d.y }}
          />
        ))}
      {closable && (
        <button type="button" className="cg-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
      )}
      <p className="cg-kicker">
        Collectible {item.number} <span aria-hidden="true">/</span> {item.identity}
      </p>
      {item.themes && (
        <p className="cg-themes cg-themes--top">{item.themes.join(" · ")}</p>
      )}
      <h3 className="cg-title">{item.essayTitle}</h3>
      {item.intro && <p className="cg-intro">{item.intro}</p>}
      <p className="cg-blurb">{item.blurb}</p>
      <div className="cg-actions">
        <Link href={`/journal/collectibles/${item.id}`} className="cg-link">
          View the collector&rsquo;s card <span aria-hidden="true">&rarr;</span>
        </Link>
        {item.video && (
          <a href={item.video.url} target="_blank" rel="noopener noreferrer" className="cg-link">
            {item.video.label} <span aria-hidden="true">&#8599;</span>
          </a>
        )}
        {published ? (
          <Link href={item.essayUrl} className="cg-link cg-link--soft">
            {(item.cta || "Read the full essay")} <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : (
          <p className="cg-soon">Story Coming Soon</p>
        )}
      </div>
    </div>
  );
}

