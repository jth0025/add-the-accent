// Day Four's two puzzles, apart from how they look: the beam of light
// (bronze reflectors turned until the light reaches every signal stone and
// the summit shield) and the route plate (tiles turned until one line of
// light runs from the shield to every landmark).

import { rand, shuffle } from "./ledger-engine";

/* ---------------- the beam of light ---------------- */

const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // 0 right, 1 down, 2 left, 3 up
const reflect = (d, m) => (m === 0 ? [3, 2, 1, 0][d] : [1, 0, 3, 2][d]); // m 0 '/', 1 '\\'

// L: {n, src: {x, y, d}, cells: {'x,y': {t: 'm'|'rock'|'stone'|'shield', fixed, s}}}
export function traceBeam(L, states) {
  let { x, y, d } = L.src;
  const pts = [[x, y]];
  const lit = new Set();
  const seen = new Set();
  let ended = "out";
  for (let k = 0; k < 400; k += 1) {
    x += DIRS[d][0];
    y += DIRS[d][1];
    if (x < 0 || y < 0 || x >= L.n || y >= L.n) {
      pts.push([x, y]);
      break;
    }
    const key = `${x},${y}`;
    const c = L.cells[key];
    if (seen.has(`${key}|${d}`)) {
      ended = "loop";
      pts.push([x, y]);
      break;
    }
    seen.add(`${key}|${d}`);
    if (!c) continue;
    if (c.t === "rock") {
      pts.push([x, y]);
      ended = "rock";
      break;
    }
    if (c.t === "stone") {
      lit.add(key);
      continue;
    }
    if (c.t === "shield") {
      lit.add(key);
      pts.push([x, y]);
      ended = "shield";
      break;
    }
    if (c.t === "m") {
      const s = c.fixed ? c.s : states[key];
      d = reflect(d, s);
      pts.push([x, y]);
    }
  }
  return { pts, lit, ended };
}

// cfg: {n, turns, decoys, rocks, stones, fixed}
function genBeam(cfg) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const n = cfg.n;
    const cells = {};
    const path = new Set();
    const side = rand(4);
    let x;
    let y;
    let d;
    if (side === 0) {
      x = -1;
      y = rand(n);
      d = 0;
    } else if (side === 1) {
      x = rand(n);
      y = -1;
      d = 1;
    } else if (side === 2) {
      x = n;
      y = rand(n);
      d = 2;
    } else {
      x = rand(n);
      y = n;
      d = 3;
    }
    const src = { x, y, d };
    const seq = [];
    let ok = true;
    for (let t = 0; t <= cfg.turns; t += 1) {
      const maxLen = [...Array(n)].findIndex((_, k) => {
        const nx = x + DIRS[d][0] * (k + 1);
        const ny = y + DIRS[d][1] * (k + 1);
        return nx < 0 || ny < 0 || nx >= n || ny >= n || path.has(`${nx},${ny}`);
      });
      const room = maxLen < 0 ? n : maxLen;
      if (room < 2) {
        ok = false;
        break;
      }
      const len = 1 + rand(Math.min(room, n - 1));
      const steps = Math.max(1, Math.min(len, room - (t < cfg.turns ? 1 : 0)));
      for (let k = 0; k < steps; k += 1) {
        x += DIRS[d][0];
        y += DIRS[d][1];
        path.add(`${x},${y}`);
        seq.push([x, y, d]);
      }
      if (t < cfg.turns) {
        const nd = (d + (Math.random() < 0.5 ? 1 : 3)) % 4;
        const m = [[3, 2, 1, 0], [1, 0, 3, 2]].findIndex((tab) => tab[d] === nd);
        cells[`${x},${y}`] = { t: "m", s: m, ans: m };
        d = nd;
      }
    }
    if (!ok) continue;
    // the last cell becomes the shield
    const last = seq[seq.length - 1];
    if (cells[`${last[0]},${last[1]}`]) continue;
    cells[`${last[0]},${last[1]}`] = { t: "shield" };
    const straight = seq.filter(([a, b]) => !cells[`${a},${b}`]);
    if (straight.length < cfg.stones) continue;
    shuffle(straight)
      .slice(0, cfg.stones)
      .forEach(([a, b]) => {
        cells[`${a},${b}`] = { t: "stone" };
      });
    const free = [];
    for (let i = 0; i < n; i += 1)
      for (let j = 0; j < n; j += 1) {
        const k = `${i},${j}`;
        if (!path.has(k) && !cells[k]) free.push(k);
      }
    shuffle(free);
    let fi = 0;
    for (let k = 0; k < cfg.decoys && fi < free.length; k += 1) {
      const m = rand(2);
      cells[free[(fi += 1) - 1]] = { t: "m", s: m, ans: m, decoy: true };
    }
    for (let k = 0; k < cfg.rocks && fi < free.length; k += 1) cells[free[(fi += 1) - 1]] = { t: "rock" };
    const mk = Object.keys(cells).filter((k) => cells[k].t === "m");
    shuffle(mk.slice())
      .slice(0, cfg.fixed || 0)
      .forEach((k) => {
        cells[k].fixed = true;
      });
    const L = { n, src, cells };
    // the intended answer must solve it, and nothing else on the board can interfere
    const ans = {};
    mk.forEach((k) => {
      ans[k] = cells[k].ans;
    });
    const tr = traceBeam(L, ans);
    const targets = Object.keys(cells).filter((k) => cells[k].t === "stone" || cells[k].t === "shield");
    if (tr.ended !== "shield" || !targets.every((k) => tr.lit.has(k))) continue;
    // scramble the rotatable mirrors
    const st = {};
    let changed = 0;
    mk.forEach((k) => {
      if (cells[k].fixed) {
        st[k] = cells[k].s;
        return;
      }
      const v = rand(2);
      st[k] = v;
      if (v !== cells[k].ans && !cells[k].decoy) changed += 1;
    });
    const pathM = mk.filter((k) => !cells[k].decoy && !cells[k].fixed);
    if (changed < Math.ceil(pathM.length / 2)) {
      pathM.forEach((k) => {
        st[k] = 1 - cells[k].ans;
      });
    }
    const t0 = traceBeam(L, st);
    if (targets.every((k) => t0.lit.has(k))) continue;
    return { L, st };
  }
  return null;
}

const BEAMCFG = {
  initiate: { n: 6, turns: 3, decoys: 2, rocks: 3, fixed: 0 },
  disciple: { n: 8, turns: 5, decoys: 5, rocks: 6, fixed: 1 },
  master: { n: 9, turns: 7, decoys: 8, rocks: 8, fixed: 2 },
};

export function newBeam(rank, stones) {
  let g = null;
  for (let t = 0; t < 40 && !g; t += 1) g = genBeam({ ...BEAMCFG[rank], stones });
  if (!g) g = genBeam({ ...BEAMCFG.initiate, stones });
  while (!g) g = genBeam({ ...BEAMCFG.initiate, stones });
  return { id: Math.random().toString(36).slice(2), rank, L: g.L, st: g.st, elapsed: 0, solvedAt: 0, prelit: [] };
}

/* ---------------- the route plate ---------------- */

export const RBIT = [1, 2, 4, 8];
export const RDX = [0, 1, 0, -1];
export const RDY = [-1, 0, 1, 0];
export const rotM = (m, r) => {
  let v = m;
  for (let i = 0; i < r; i += 1) v = ((v << 1) | (v >> 3)) & 15;
  return v;
};

export function routeLit(R) {
  const n = R.n;
  const lit = new Set([R.src]);
  const q = [R.src];
  const m = (c) => rotM(R.base[c], R.rot[c]);
  while (q.length) {
    const c = q.shift();
    const x = c % n;
    const y = (c / n) | 0;
    const mc = m(c);
    for (let d = 0; d < 4; d += 1) {
      if (!(mc & RBIT[d])) continue;
      const nx = x + RDX[d];
      const ny = y + RDY[d];
      if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
      const nc = ny * n + nx;
      if (lit.has(nc)) continue;
      if (m(nc) & RBIT[(d + 2) % 4]) {
        lit.add(nc);
        q.push(nc);
      }
    }
  }
  return { lit, done: R.marks.every((c) => lit.has(c)) };
}

// A random tree of lines over an n x n plate, from the shield (bottom row)
// out to k far landmarks, every tile turned at random.
export function genRoute(n, k) {
  for (let attempt = 0; attempt < 2000; attempt += 1) {
    const N = n * n;
    const base = Array(N).fill(0);
    const seen = Array(N).fill(false);
    const src = (n - 1) * n + rand(n);
    const stack = [src];
    seen[src] = true;
    while (stack.length) {
      const c = stack[stack.length - 1];
      const x = c % n;
      const y = (c / n) | 0;
      const opts = [0, 1, 2, 3].filter((d) => {
        const nx = x + RDX[d];
        const ny = y + RDY[d];
        return nx >= 0 && ny >= 0 && nx < n && ny < n && !seen[ny * n + nx];
      });
      if (!opts.length) {
        stack.pop();
        continue;
      }
      const d = opts[rand(opts.length)];
      const nc = (y + RDY[d]) * n + x + RDX[d];
      base[c] |= RBIT[d];
      base[nc] |= RBIT[(d + 2) % 4];
      seen[nc] = true;
      stack.push(nc);
    }
    const dist = Array(N).fill(-1);
    dist[src] = 0;
    const q = [src];
    while (q.length) {
      const c = q.shift();
      const x = c % n;
      const y = (c / n) | 0;
      for (let d = 0; d < 4; d += 1)
        if (base[c] & RBIT[d]) {
          const nc = (y + RDY[d]) * n + x + RDX[d];
          if (dist[nc] < 0) {
            dist[nc] = dist[c] + 1;
            q.push(nc);
          }
        }
    }
    const leaves = [...Array(N).keys()]
      .filter((c) => c !== src && [1, 2, 4, 8].filter((b) => base[c] & b).length === 1)
      .sort((a, b) => dist[b] - dist[a]);
    const marks = [];
    for (const c of leaves) {
      if (marks.length >= k) break;
      const cx = c % n;
      const cy = (c / n) | 0;
      if (dist[c] < n) continue;
      if (marks.every((m) => Math.abs((m % n) - cx) + Math.abs(((m / n) | 0) - cy) >= Math.max(2, n - 3))) marks.push(c);
    }
    if (marks.length < k) continue;
    marks.sort((a, b) => dist[a] - dist[b]);
    const rot = base.map((_, c) => (c === src ? 0 : rand(4)));
    const R = { id: Math.random().toString(36).slice(2), n, base, rot, src, marks, elapsed: 0, solvedAt: 0 };
    if (routeLit(R).done) continue;
    return R;
  }
  return null;
}

export const ROUTEN = { initiate: 5, disciple: 6, master: 7 };
