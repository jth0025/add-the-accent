// Ledgers are sudoku boards: six emblems on a 6x6 board (2x3 wards) or nine
// on a 9x9 (3x3 wards). Every row, column and ward holds each emblem once.

import { RANKS } from "./day2-data";

export const rand = (n) => Math.floor(Math.random() * n);

export const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function sdk(n) {
  const bw = 3;
  const bh = n === 6 ? 2 : 3;
  const N = n * n;
  const cand = (g, i) => {
    const r = (i / n) | 0;
    const c = i % n;
    const used = new Array(n + 1).fill(false);
    for (let k = 0; k < n; k += 1) {
      used[g[r * n + k]] = true;
      used[g[k * n + c]] = true;
    }
    const br = r - (r % bh);
    const bc = c - (c % bw);
    for (let y = 0; y < bh; y += 1) for (let x = 0; x < bw; x += 1) used[g[(br + y) * n + bc + x]] = true;
    const o = [];
    for (let v = 1; v <= n; v += 1) if (!used[v]) o.push(v);
    return o;
  };
  // How many solutions (up to `lim`) the grid has.
  const count = (g, lim) => {
    let best = -1;
    let bc = null;
    for (let i = 0; i < N; i += 1) {
      if (!g[i]) {
        const c = cand(g, i);
        if (!c.length) return 0;
        if (!bc || c.length < bc.length) {
          best = i;
          bc = c;
          if (c.length === 1) break;
        }
      }
    }
    if (best < 0) return 1;
    let t = 0;
    for (const v of bc) {
      g[best] = v;
      t += count(g, lim - t);
      if (t >= lim) break;
    }
    g[best] = 0;
    return t;
  };
  const solve = (g) => {
    let best = -1;
    let bc = null;
    for (let i = 0; i < N; i += 1) {
      if (!g[i]) {
        const c = cand(g, i);
        if (!c.length) return false;
        if (!bc || c.length < bc.length) {
          best = i;
          bc = c;
        }
      }
    }
    if (best < 0) return true;
    for (const v of shuffle(bc.slice())) {
      g[best] = v;
      if (solve(g)) return true;
    }
    g[best] = 0;
    return false;
  };
  return {
    n,
    bw,
    bh,
    N,
    count,
    // A full board, then squares lifted out one at a time while the
    // puzzle still has exactly one answer.
    make(givens) {
      const g = new Array(N).fill(0);
      solve(g);
      const sol = g.slice();
      const puz = sol.slice();
      let filled = N;
      for (const i of shuffle([...Array(N).keys()])) {
        if (filled <= givens) break;
        const v = puz[i];
        puz[i] = 0;
        if (count(puz.slice(), 2) !== 1) puz[i] = v;
        else filled -= 1;
      }
      return { puz, sol };
    },
  };
}

export function newLedgerState(rank, forceN, givens) {
  const R = RANKS[rank];
  const n = forceN || R.n;
  const { puz, sol } = sdk(n).make(givens || R.givens);
  return { n, rank, puz, sol, cur: puz.slice(), notes: {}, elapsed: 0, solvedAt: 0 };
}

export const fmtTime = (s) => (s == null ? "—" : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`);
