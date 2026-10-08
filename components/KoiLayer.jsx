"use client";

import { useEffect, useRef, useState } from "react";
import "./koi-layer.css";

// Carved-stone koi (public/koi), in their own colours, scattered down the
// Museum at every scale. The gallery reshuffles on every visit (and refilters), so the
// koi are never at fixed spots: each starts from the rough position
// below, then is fitted against the live page. A koi will not sit on any
// text, behind the boxes marked data-koi-avoid, or touch another koi;
// it may tuck behind anything else (cards, the statue, the edges). It is
// moved to the nearest free spot, shrunk if it must be, or left out.
// Put it as a child of a positioned container.
//
// [image, top %, left %, width px, rotation deg, flip]
const KOI = [
  [12, 1.5, -2.26, 90, 185, 1],
  [7, 3.0, -4.0, 120, 315, 1],
  [6, 3.6, 95.99, 110, 25, 1],
  [8, 5.1, 96.23, 140, 0, 1],
  [6, 6.9, -2.93, 100, 10, 1],
  [5, 8.6, 96.66, 85, 185, -1],
  [5, 9.35, 88.27, 720, 170, -1],
  [3, 9.5, 11.0, 150, 65, -1],
  [12, 9.91, 89.86, 340, 15, 1],
  [4, 10.1, 64.0, 95, 205, 1],
  [10, 10.1, 31.0, 75, 30, 1],
  [5, 13.9, -3.93, 110, 220, 1],
  [6, 19.1, 95.0, 100, 135, 1],
  [9, 26.56, -33.53, 880, 25, 1],
  [18, 28.13, 8.0, 230, 260, 1],
  [3, 30.1, 82.0, 170, 10, -1],
  [9, 31.3, 19.0, 85, 280, 1],
  [4, 33.0, 85.0, 560, 110, 1],
  [7, 35.3, 38.33, 70, 20, -1],
  [12, 37.5, 85.43, 100, 180, -1],
  [2, 41.1, 93.5, 260, 190, 1],
  [7, 41.7, 64.27, 130, 70, 1],
  [9, 42.3, 26.73, 130, 210, 1],
  [14, 47.89, -6.97, 420, 265, 1],
  [8, 49.37, 5.6, 170, 5, 1],
  [6, 49.59, 45.94, 115, 285, 1],
  [16, 51.8, -29.79, 700, 250, -1],
  [16, 52.2, -24.6, 700, 265, 1],
  [16, 52.2, -29.79, 700, 25, -1],
  [16, 52.41, -40.19, 700, 160, -1],
  [16, 53.23, -34.99, 700, 150, -1],
  [3, 54.41, 47.03, 115, 220, 1],
  [9, 55.2, 27.37, 70, 295, 1],
  [17, 55.29, 92.47, 460, 300, -1],
  [4, 57.7, 28.33, 70, 355, 1],
  [14, 60.3, 27.4, 70, 105, 1],
  [6, 61.19, 82.9, 170, 260, 1],
  [6, 62.27, -13.73, 620, 85, -1],
  [2, 65.37, 64.03, 130, 180, 1],
  [18, 65.41, 58.2, 85, 185, -1],
  [14, 66.8, 90.23, 150, 155, 1],
  [4, 69.1, 47.1, 130, 150, -1],
  [10, 71.2, 94.27, 190, 155, 1],
  [6, 74.5, 68.37, 70, 285, -1],
  [1, 77.9, 82.0, 700, 245, 1],
  [18, 78.13, 23.37, 130, 355, 1],
  [8, 78.7, 86.86, 70, 35, -1],
  [10, 80.1, 44.2, 115, 200, -1],
  [6, 82.19, 86.37, 100, 245, 1],
  [11, 85.6, 2.5, 95, 80, -1],
  [9, 86.21, 45.8, 130, 340, -1],
  [5, 86.9, 83.0, 170, 320, -1],
  [3, 91.89, 45.56, 85, 115, -1],
  [14, 93.79, 5.0, 110, 200, 1],
  [18, 94.6, 90.0, 95, 275, -1],
  [18, 96.0, 36.27, 80, 140, -1],
  [7, 97.8, 64.0, 105, 340, 1],
  [15, 22, 4, 90, 40, 1],
  [13, 28, 92, 95, 60, 1],
  [13, 37, 94, 110, 200, -1],
  [15, 58, 3, 120, 120, 1],
  [13, 73, 95, 85, 300, 1],
  [15, 86, 6, 100, 250, -1],
];

const GRID_KOI = [
  [8, 35.9, 87.4, 90, 180, -1],
  [1, 37.8, 70.9, 110, 10, -1],
  [5, 40.3, 86.4, 80, 105, -1],
  [2, 41.9, 19.3, 100, 20, -1],
  [7, 44.0, 15.7, 80, 300, 1],
  [1, 45.6, 19.7, 70, 110, 1],
  [8, 47.1, 58.4, 100, 115, -1],
  [2, 49.8, 33.5, 70, 65, 1],
  [16, 51.1, 77.0, 70, 10, 1],
  [15, 52.7, 83.8, 90, 270, -1],
  [1, 55.0, 61.1, 80, 110, 1],
  [2, 57.3, 66.2, 110, 65, 1],
  [14, 59.3, 61.1, 110, 50, -1],
  [4, 60.8, 85.0, 70, 140, -1],
  [15, 62.4, 63.0, 90, 285, 1],
  [9, 65.1, 52.3, 110, 155, -1],
  [11, 66.3, 73.0, 100, 240, -1],
  [3, 68.6, 26.7, 70, 135, 1],
  [16, 69.9, 62.0, 60, 150, 1],
  [4, 72.1, 27.8, 110, 75, -1],
  [7, 74.1, 53.1, 90, 250, -1],
  [12, 76.4, 12.3, 100, 95, 1],
  [6, 77.8, 42.1, 60, 25, -1],
  [13, 79.4, 81.9, 80, 180, 1],
  [13, 81.3, 57.7, 60, 175, -1],
  [16, 83.3, 63.9, 70, 60, -1],
  [8, 85.5, 47.7, 90, 185, 1],
  [16, 87.0, 83.3, 90, 30, 1],
  [7, 89.5, 42.2, 90, 205, -1],
  [14, 91.2, 77.7, 70, 105, -1],
];

// The two big ones at the bottom, either side of the statue: swimming in
// different directions, tilted and turned, one larger than the other.
// Anchored to the bottom edge (px from the foot of the page).
const BOTTOM = [
  { n: 2, left: 17, w: 290, rot: -24, flip: 1, fromBottom: 70 },
  { n: 17, left: 71, w: 230, rot: 168, flip: -1, fromBottom: 120 },
];

const FISH = [
  ...KOI.map(([n, top, left, w, rot, flip]) => ({ n, top, left, w, rot, flip })),
  ...GRID_KOI.map(([n, top, left, w, rot, flip]) => ({ n, top, left, w, rot, flip, grid: true })),
  ...BOTTOM.map((b) => ({ ...b, pinned: true })),
];

const CELL = 4; // px per cell of the occupancy grids
const GAP = 16; // keep this far from text, and from other koi
const src = (n) => `/koi/koi-${String(n).padStart(2, "0")}.webp`;

// Reads each cut-out's silhouette (alpha) into a small grid, once.
function loadMask(n) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const gw = 72;
      const gh = Math.max(2, Math.round((gw * img.naturalHeight) / img.naturalWidth));
      const c = document.createElement("canvas");
      c.width = gw;
      c.height = gh;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, gw, gh);
      const d = ctx.getImageData(0, 0, gw, gh).data;
      const a = new Uint8Array(gw * gh);
      for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3] > 40 ? 1 : 0;
      resolve({ gw, gh, a, aspect: img.naturalHeight / img.naturalWidth, nw: img.naturalWidth });
    };
    img.onerror = () => resolve(null);
    img.src = src(n);
  });
}

function fillRect(grid, gw, gh, x0, y0, x1, y1, pad) {
  const cx0 = Math.max(0, Math.floor((x0 - pad) / CELL));
  const cy0 = Math.max(0, Math.floor((y0 - pad) / CELL));
  const cx1 = Math.min(gw - 1, Math.floor((x1 + pad) / CELL));
  const cy1 = Math.min(gh - 1, Math.floor((y1 + pad) / CELL));
  for (let y = cy0; y <= cy1; y++) grid.fill(1, y * gw + cx0, y * gw + cx1 + 1);
}

function fit(layer, masks) {
  const root = layer.parentElement;
  const L = layer.getBoundingClientRect();
  const W = L.width;
  const H = L.height;
  if (W < 50 || H < 50) return null;
  const ox = L.left + window.scrollX;
  const oy = L.top + window.scrollY;
  const gw = Math.ceil(W / CELL) + 2;
  const gh = Math.ceil(H / CELL) + 2;
  const forb = new Uint8Array(gw * gh); // text and the protected boxes
  const cov = new Uint8Array(gw * gh); // things a koi would hide behind
  const occ = new Uint8Array(gw * gh); // koi already placed (with margin)
  const rel = (r) => [r.left + window.scrollX - ox, r.top + window.scrollY - oy, r.right + window.scrollX - ox, r.bottom + window.scrollY - oy];

  // Every piece of text on the page, line by line. Text inside a sticky
  // element that is currently stuck is skipped (its home is reserved below).
  const stickyCache = new Map();
  const stuckAncestor = (el) => {
    for (let e = el; e && e !== root; e = e.parentElement) {
      if (!stickyCache.has(e)) {
        const cs = getComputedStyle(e);
        stickyCache.set(e, cs.position === "sticky" ? e : null);
      }
      if (stickyCache.get(e)) return stickyCache.get(e);
    }
    return null;
  };
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  const stuck = new Set();
  let node;
  while ((node = walker.nextNode())) {
    if (!node.textContent.trim()) continue;
    const el = node.parentElement;
    if (!el || layer.contains(el) || el.closest("script,style,canvas")) continue;
    const sticky = stuckAncestor(el);
    if (sticky) {
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      if (Math.abs(sticky.getBoundingClientRect().top - top) < 2 && window.scrollY > 0) {
        stuck.add(sticky);
        continue;
      }
    }
    range.selectNodeContents(node);
    for (const q of range.getClientRects()) {
      if (q.width < 2 || q.height < 2) continue;
      const [x0, y0, x1, y1] = rel(q);
      fillRect(forb, gw, gh, x0, y0, x1, y1, 10);
    }
  }
  // The home of any stuck bar: its parent's top, as tall as the bar.
  stuck.forEach((s) => {
    const p = s.parentElement.getBoundingClientRect();
    const h = s.getBoundingClientRect().height;
    const [x0, y0, x1] = rel(p);
    fillRect(forb, gw, gh, x0, y0, x1, y0 + h, 12);
  });
  // The two top boxes, and anything else marked to keep clear.
  root.querySelectorAll("[data-koi-avoid]").forEach((el) => {
    const [x0, y0, x1, y1] = rel(el.getBoundingClientRect());
    fillRect(forb, gw, gh, x0, y0, x1, y1, 14);
  });

  // What hides a koi: pictures, video, and anything with a solid background.
  root.querySelectorAll("*").forEach((el) => {
    if (layer.contains(el) || el === layer || el.tagName === "CANVAS") return;
    const r = el.getBoundingClientRect();
    if (r.width < 40 || r.height < 40 || (r.width > W * 0.95 && r.height > 2500)) return;
    let solid = el.tagName === "IMG" || el.tagName === "VIDEO";
    if (!solid) {
      const cs = getComputedStyle(el);
      const m = cs.backgroundColor.match(/[\d.]+/g) || [];
      const alpha = m.length > 3 ? parseFloat(m[3]) : cs.backgroundColor === "rgba(0, 0, 0, 0)" ? 0 : 1;
      solid = alpha >= 0.6 || (cs.backgroundImage !== "none" && !/gradient/.test(cs.backgroundImage.slice(0, 22)));
    }
    if (!solid) return;
    const [x0, y0, x1, y1] = rel(r);
    fillRect(cov, gw, gh, x0, y0, x1, y1, 0);
  });

  const small = W < 768;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const order = FISH.map((f, i) => i).sort((a, b) => FISH[b].w - FISH[a].w);
  const out = new Array(FISH.length).fill(null);

  for (const i of order) {
    const f = FISH[i];
    const mask = masks[f.n];
    if (!mask) continue;
    for (const shrink of f.pinned ? [1, 0.88] : f.grid ? [1, 0.8] : [1, 0.8, 0.64]) {
      // Never drawn larger than its own pixels allow, so none looks pixelated.
      const w = Math.min(f.w * shrink, (mask.nw * 1.15) / dpr) * (small ? 0.42 : 1);
      const h = w * mask.aspect;
      // Sample the silhouette, rotated and flipped, as points around its centre.
      const step = Math.max(6, w / 60);
      const rad = (f.rot * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const pts = [];
      for (let v = step / 2; v < h; v += step) {
        for (let u = step / 2; u < w; u += step) {
          const mx = Math.min(mask.gw - 1, Math.floor((u / w) * mask.gw));
          const my = Math.min(mask.gh - 1, Math.floor((v / h) * mask.gh));
          if (!mask.a[my * mask.gw + mx]) continue;
          const x = (u - w / 2) * f.flip;
          const y = v - h / 2;
          pts.push(x * cos - y * sin, x * sin + y * cos);
        }
      }
      const count = pts.length / 2;
      if (!count) continue;
      const need = f.grid ? 6 : Math.min(150, Math.max(10, count * 0.2));
      const c0x = (f.left / 100) * W + w / 2;
      const c0y = f.fromBottom != null ? H - f.fromBottom - h / 2 : (f.top / 100) * H + h / 2;
      const test = (cx, cy) => {
        if (cx < -0.3 * w || cx > W + 0.3 * w) return false;
        let seen = 0;
        for (let k = 0; k < pts.length; k += 2) {
          const gx = Math.floor((cx + pts[k]) / CELL);
          const gy = Math.floor((cy + pts[k + 1]) / CELL);
          if (gx < 0 || gx >= gw) continue; // off the side: clipped, fine
          if (gy < 0 || gy >= gh) return false; // never past the top or the footer
          const idx = gy * gw + gx;
          if (forb[idx] || occ[idx]) return false;
          if (!cov[idx]) seen++;
        }
        return seen >= need;
      };
      let found = null;
      const R = f.pinned ? 140 : f.grid ? 260 : 800;
      const ringStep = Math.max(14, Math.min(28, w / 8));
      search: for (let r = 0; r <= R; r += ringStep) {
        const n = r === 0 ? 1 : Math.max(8, Math.round((2 * Math.PI * r) / ringStep));
        for (let k = 0; k < n; k++) {
          const t = (k / n) * 2 * Math.PI;
          const cx = c0x + r * Math.cos(t);
          const cy = c0y + r * Math.sin(t);
          if (test(cx, cy)) {
            found = [cx, cy];
            break search;
          }
        }
      }
      if (!found) continue;
      // Reserve the koi, with a margin all round, so no other touches it.
      const m = Math.ceil(GAP / CELL);
      for (let k = 0; k < pts.length; k += 2) {
        const gx = Math.floor((found[0] + pts[k]) / CELL);
        const gy = Math.floor((found[1] + pts[k + 1]) / CELL);
        for (let dy = -m; dy <= m; dy++) {
          const yy = gy + dy;
          if (yy < 0 || yy >= gh) continue;
          for (let dx = -m; dx <= m; dx++) {
            const xx = gx + dx;
            if (xx >= 0 && xx < gw) occ[yy * gw + xx] = 1;
          }
        }
      }
      out[i] = { left: found[0] - w / 2, top: found[1] - h / 2, w };
      break;
    }
  }
  return out;
}

export default function KoiLayer() {
  const ref = useRef(null);
  const [placed, setPlaced] = useState(null);

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return undefined;
    const root = layer.parentElement;
    let masks = null;
    let timer = null;
    let alive = true;

    const run = () => {
      if (!alive || !masks) return;
      const out = fit(layer, masks);
      if (out) setPlaced(out);
    };
    const later = (ms = 350) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(run, ms);
    };

    Promise.all([...new Set(FISH.map((f) => f.n))].map(async (n) => [n, await loadMask(n)])).then(
      (entries) => {
        masks = Object.fromEntries(entries);
        run();
        later(1800); // once the gallery has shuffled and settled
      },
    );

    const ro = new ResizeObserver(() => later());
    ro.observe(root);
    const mo = new MutationObserver((list) => {
      if (list.some((m) => !layer.contains(m.target))) later();
    });
    mo.observe(root, { childList: true, subtree: true, characterData: true });
    const onLoad = (e) => {
      if (e && e.target instanceof Node && layer.contains(e.target)) return;
      later(500);
    };
    root.addEventListener("load", onLoad, true);
    window.addEventListener("resize", onLoad);
    return () => {
      alive = false;
      window.clearTimeout(timer);
      ro.disconnect();
      mo.disconnect();
      root.removeEventListener("load", onLoad, true);
      window.removeEventListener("resize", onLoad);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="koi-layer">
      {FISH.map((f, i) => {
        const p = placed && placed[i];
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src(f.n)}
            alt=""
            loading="lazy"
            decoding="async"
            className="koi-fish"
            data-on={p ? "1" : undefined}
            style={
              p
                ? {
                    left: `${p.left}px`,
                    top: `${p.top}px`,
                    width: `${p.w}px`,
                    transform: `rotate(${f.rot}deg) scaleX(${f.flip})`,
                  }
                : { left: 0, top: 0, width: `${f.w}px` }
            }
          />
        );
      })}
    </div>
  );
}
