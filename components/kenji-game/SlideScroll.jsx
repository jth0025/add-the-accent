"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { ART7 } from "./day7-data";
import { RANKS } from "./day2-data";
import { fmtTime, rand } from "./ledger-engine";

const DONE = "The scroll is whole.";

// A scrambled n x n sliding picture: t[i] is the piece at place i, the last
// piece (n*n-1) is the blank. Scrambled by sliding from the finished picture,
// so it can always be solved.
export function scNew(n) {
  const t = [...Array(n * n).keys()];
  let b = n * n - 1;
  let last = -1;
  for (let k = 0; k < n * n * 30; k += 1) {
    const r = (b / n) | 0;
    const c = b % n;
    const opts = [];
    if (r > 0) opts.push(b - n);
    if (r < n - 1) opts.push(b + n);
    if (c > 0) opts.push(b - 1);
    if (c < n - 1) opts.push(b + 1);
    const f = opts.filter((o) => o !== last);
    const o = f[rand(f.length)];
    [t[b], t[o]] = [t[o], t[b]];
    last = b;
    b = o;
  }
  if (t.every((v, i) => v === i)) return scNew(n);
  return { id: Math.random().toString(36).slice(2), n, t, moves: 0, elapsed: 0, solvedAt: 0 };
}

/* ------------------------------------------------------------------ */
/* The assembled scroll: tap a piece in the blank's row or column to    */
/* slide it (and every piece between) toward the blank. `state` is the  */
/* picture ({n, t, moves, elapsed, solvedAt}), edited in place and      */
/* handed back through onChange to be saved.                           */
/* ------------------------------------------------------------------ */
export default function SlideScroll({ state, rank, paused, onChange, onSolve, apiRef }) {
  const S = state;
  const n = S.n;
  const C = 100 / n;
  const [, tick] = useReducer((x) => x + 1, 0);
  const [msg, setMsg] = useState(S.solvedAt ? DONE : "");
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const solvedRef = useRef(!!S.solvedAt);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onSolveRef = useRef(onSolve);
  onSolveRef.current = onSolve;
  const timers = useRef([]);
  useEffect(() => {
    const ts = timers.current;
    return () => ts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (S.solvedAt) return undefined;
    const t = setInterval(() => {
      if (document.hidden || pausedRef.current || solvedRef.current) return;
      S.elapsed += 1;
      if (S.elapsed % 5 === 0) onChangeRef.current(S);
      tick();
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = () => {
    S.solvedAt = Date.now();
    solvedRef.current = true;
    setMsg(DONE);
    onChangeRef.current(S);
    timers.current.push(setTimeout(() => onSolveRef.current(S), 900));
  };

  const slide = (v) => {
    if (solvedRef.current) return;
    const i = S.t.indexOf(v);
    const b = S.t.indexOf(n * n - 1);
    const ri = (i / n) | 0;
    const ci = i % n;
    const rb = (b / n) | 0;
    const cb = b % n;
    if (ri !== rb && ci !== cb) return;
    // every piece between the blank and the tapped piece moves one step
    const step = ri === rb ? (ci < cb ? -1 : 1) : ri < rb ? -n : n;
    let cur = b;
    while (cur !== i) {
      const nx = cur + step;
      S.t[cur] = S.t[nx];
      cur = nx;
    }
    S.t[i] = n * n - 1;
    S.moves += 1;
    onChangeRef.current(S);
    if (S.t.every((x, k) => x === k)) finish();
    tick();
  };

  // Review tools: the picture whole.
  useEffect(() => {
    if (!apiRef) return undefined;
    apiRef.current = {
      solve() {
        if (solvedRef.current) return;
        S.t = S.t.map((_, k) => k);
        finish();
        tick();
      },
    };
    return () => {
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`d7-sc${S.solvedAt ? " solved" : ""}`}>
      <div className="d7-sc-board">
        {S.t.map((v, i) => {
          if (v === n * n - 1) return null;
          return (
            <button
              key={v}
              type="button"
              className="d7-sc-tile"
              aria-label={`Scroll piece ${v + 1}`}
              onClick={() => slide(v)}
              style={{
                left: `${(i % n) * C}%`,
                top: `${((i / n) | 0) * C}%`,
                width: `${C}%`,
                height: `${C}%`,
                backgroundImage: `url(${ART7.scroll})`,
                backgroundSize: `${n * 100}% ${n * 100}%`,
                backgroundPosition: `${((v % n) / (n - 1)) * 100}% ${(((v / n) | 0) / (n - 1)) * 100}%`,
              }}
            />
          );
        })}
      </div>
      <div className="d7-side">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="d7-sc-ref" src={ART7.scroll} alt="The finished scroll, for reference" />
        <p className="d7-stat">
          {RANKS[rank].label} &middot; {fmtTime(S.elapsed)} &middot; moves {S.moves}
        </p>
        <p className="d7-msg" aria-live="polite">
          {msg}
        </p>
      </div>
    </div>
  );
}
