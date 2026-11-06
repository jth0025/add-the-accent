// Day Six's two puzzles, apart from how they look: the tide locks (stone
// gates that slide along their own tracks until the tide can run out of the
// right edge of its row) and the mirrors (turn one, and its neighbours turn).

import { rand } from "./ledger-engine";

/* ---------------- the tide locks ---------------- */

export const TL_N = 6;
export const TL_EXIT = 2; // the row the tide runs in

// A piece: {r, c, len, h (horizontal), tide}. Piece 0 is the tide.
export function tlGrid(P) {
  const g = Array(TL_N * TL_N).fill(-1);
  P.forEach((p, i) => {
    for (let k = 0; k < p.len; k += 1) {
      const r = p.r + (p.h ? 0 : k);
      const c = p.c + (p.h ? k : 0);
      g[r * TL_N + c] = i;
    }
  });
  return g;
}
const tlKey = (P) => P.map((p) => (p.h ? p.c : p.r)).join(",");
function tlMoves(P) {
  const g = tlGrid(P);
  const out = [];
  P.forEach((p, i) => {
    for (const d of [-1, 1]) {
      for (let s = 1; s < TL_N; s += 1) {
        let ok = true;
        if (p.h) {
          const c = d < 0 ? p.c - s : p.c + p.len - 1 + s;
          if (c < 0 || c >= TL_N || g[p.r * TL_N + c] !== -1) ok = false;
        } else {
          const r = d < 0 ? p.r - s : p.r + p.len - 1 + s;
          if (r < 0 || r >= TL_N || g[r * TL_N + p.c] !== -1) ok = false;
        }
        if (!ok) break;
        out.push([i, d * s]);
      }
    }
  });
  return out;
}
export const tlApply = (P, i, delta) => P.map((p, k) => (k !== i ? p : p.h ? { ...p, c: p.c + delta } : { ...p, r: p.r + delta }));
export const tlSolved = (P) => P[0].c + P[0].len - 1 === TL_N - 1;

// The fewest moves that solve it (by breadth-first search), or -1 past `cap`.
function tlSolve(P, cap) {
  const seen = new Map([[tlKey(P), 0]]);
  let q = [P];
  let d = 0;
  while (q.length) {
    const nq = [];
    for (const s of q) {
      if (tlSolved(s)) return d;
      for (const [i, dl] of tlMoves(s)) {
        const n = tlApply(s, i, dl);
        const k = tlKey(n);
        if (!seen.has(k)) {
          seen.set(k, 1);
          nq.push(n);
        }
      }
    }
    q = nq;
    d += 1;
    if (d > cap || seen.size > 60000) return -1;
  }
  return -1;
}

// How many of the Wall's moves each rank is asked for.
const TLBAND = { initiate: [4, 7], disciple: [8, 13], master: [14, 40] };

// A board whose best solution is in the rank's band: {P, par}.
export function tlGen(rank) {
  const [lo, hi] = TLBAND[rank];
  let best = null;
  let bestD = -1;
  const t0 = Date.now();
  for (let a = 0; a < 4000 && Date.now() - t0 < 2500; a += 1) {
    const P = [{ r: TL_EXIT, c: rand(2), len: 2, h: true, tide: true }];
    let g = tlGrid(P);
    const np = rank === "initiate" ? 6 + rand(3) : rank === "disciple" ? 8 + rand(4) : 10 + rand(4);
    for (let k = 0; k < np * 6 && P.length <= np; k += 1) {
      const h = Math.random() < 0.5;
      const len = Math.random() < 0.72 ? 2 : 3;
      const r = rand(h ? TL_N : TL_N - len + 1);
      const c = rand(h ? TL_N - len + 1 : TL_N);
      if (h && r === TL_EXIT) continue;
      let ok = true;
      for (let m = 0; m < len; m += 1) if (g[(r + (h ? 0 : m)) * TL_N + c + (h ? m : 0)] !== -1) ok = false;
      if (!ok) continue;
      P.push({ r, c, len, h });
      g = tlGrid(P);
    }
    const d = tlSolve(P, hi);
    if (d < 0) continue;
    if (d >= lo && d <= hi) return { P, par: d };
    if (d > bestD && d <= hi) {
      bestD = d;
      best = { P, par: d };
    }
  }
  return best || tlGenFallback();
}
// A board that always solves: one gate to move aside.
function tlGenFallback() {
  return {
    P: [
      { r: TL_EXIT, c: 0, len: 2, h: true, tide: true },
      { r: 1, c: 3, len: 3, h: false },
    ],
    par: 1,
  };
}

/* ---------------- the mirrors ---------------- */

export const MRSIZE = { initiate: [3, 4, 4], disciple: [4, 5, 5], master: [5, 6, 7] };

export function mrFlip(lit, n, c) {
  const r = (c / n) | 0;
  const col = c % n;
  [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
    const rr = r + dr;
    const cc = col + dc;
    if (rr >= 0 && cc >= 0 && rr < n && cc < n) lit[rr * n + cc] = !lit[rr * n + cc];
  });
}

// A ring of n x n mirrors, scrambled by turning a few of them from the lit state.
export function mrGen(n) {
  const lit = Array(n * n).fill(true);
  const k = Math.max(3, Math.round(n * n * 0.35));
  const pressed = new Set();
  while (pressed.size < k) pressed.add(rand(n * n));
  pressed.forEach((c) => mrFlip(lit, n, c));
  if (lit.every(Boolean)) return mrGen(n);
  return { n, lit, par: k, presses: 0, elapsed: 0 };
}
