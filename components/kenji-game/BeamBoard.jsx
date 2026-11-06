"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { PIECE } from "./day4-data";
import { traceBeam } from "./beam-engine";
import { RANKS } from "./day2-data";
import { fmtTime } from "./ledger-engine";

const S = 60;

/* ------------------------------------------------------------------ */
/* The light of Hikariwake: tap a bronze reflector to turn it. The     */
/* beam must run through every signal stone and into the shield.       */
/* `state` is the board ({rank, L, st, elapsed, solvedAt, prelit}); it  */
/* is edited in place and handed back through onChange to be saved.    */
/* ------------------------------------------------------------------ */
export default function BeamBoard({ state, finalShield, paused, onChange, onSolve, apiRef }) {
  const B = state;
  const L = B.L;
  const n = L.n;
  const W = (n + 2) * S;
  const [, tick] = useReducer((x) => x + 1, 0);
  const [msg, setMsg] = useState(
    B.solvedAt ? (finalShield ? "The shield blazes." : "The signal stone flares, and its light holds.") : "",
  );
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const solvedRef = useRef(!!B.solvedAt);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onSolveRef = useRef(onSolve);
  onSolveRef.current = onSolve;

  const targets = Object.keys(L.cells).filter((k) => L.cells[k].t === "stone" || L.cells[k].t === "shield");
  const cx = (x) => S + x * S + S / 2;
  const cy = (y) => S + y * S + S / 2;

  const trace = () => {
    const tr = traceBeam(L, B.st);
    B.prelit.forEach((k) => tr.lit.add(k));
    return tr;
  };

  useEffect(() => {
    if (B.solvedAt) return undefined;
    const t = setInterval(() => {
      if (document.hidden || pausedRef.current || solvedRef.current) return;
      B.elapsed += 1;
      if (B.elapsed % 5 === 0) onChangeRef.current(B);
      tick();
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const check = () => {
    const tr = trace();
    if (!solvedRef.current && targets.every((k) => tr.lit.has(k))) {
      B.solvedAt = Date.now();
      solvedRef.current = true;
      setMsg(finalShield ? "The shield blazes." : "The signal stone flares, and its light holds.");
      onChangeRef.current(B);
      onSolveRef.current(B.elapsed);
    }
  };

  const turn = (k) => {
    if (solvedRef.current || L.cells[k].fixed) return;
    B.st[k] = 1 - B.st[k];
    onChangeRef.current(B);
    check();
    tick();
  };
  const reset = () => {
    if (solvedRef.current) return;
    Object.keys(B.st).forEach((k) => {
      if (!L.cells[k].fixed) B.st[k] = 0;
    });
    onChangeRef.current(B);
    tick();
  };

  // Review tools: turn every reflector to its answer.
  useEffect(() => {
    if (!apiRef) return undefined;
    apiRef.current = {
      solve() {
        if (solvedRef.current) return;
        Object.keys(L.cells).forEach((k) => {
          if (L.cells[k].t === "m" && !L.cells[k].fixed) B.st[k] = L.cells[k].ans;
        });
        check();
        tick();
      },
    };
    return () => {
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tr = trace();
  const litN = targets.filter((k) => tr.lit.has(k)).length;
  const sx = cx(L.src.x);
  const sy = cy(L.src.y);
  const clampC = (v) => Math.max(-1, Math.min(n, v));

  const img = (id, sz, X, Y, flip) => (
    <image
      href={PIECE[id]}
      x={X - sz / 2}
      y={Y - sz / 2}
      width={sz}
      height={sz}
      preserveAspectRatio="xMidYMid meet"
      transform={flip ? `translate(${2 * X} 0) scale(-1 1)` : undefined}
    />
  );

  return (
    <div className="d4-bm">
      <svg viewBox={`0 0 ${W} ${W}`} role="img" aria-label="Light puzzle">
        <defs>
          <filter id="glow4">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {Array.from({ length: n * n }, (_, i) => (
          <rect key={i} className="cell" x={S + (i % n) * S} y={S + ((i / n) | 0) * S} width={S} height={S} />
        ))}
        {/* the blade catching the sun */}
        <g transform={`translate(${sx} ${sy})`}>
          <circle r="17" fill="#f6d77a" opacity=".35" />
          <path d="M-10 10 L10 -10" stroke="#f1f3f6" strokeWidth="5" strokeLinecap="round" />
          <path d="M-12 12 l-4 4" stroke="#8a6324" strokeWidth="5" strokeLinecap="round" />
        </g>
        <polyline
          points={tr.pts.map(([x, y], i) => (i === 0 ? `${sx},${sy}` : `${cx(clampC(x))},${cy(clampC(y))}`)).join(" ")}
          fill="none"
          stroke="#fff6d6"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow4)"
          opacity=".95"
        />
        {Object.entries(L.cells).map(([k, c]) => {
          const [x, y] = k.split(",").map(Number);
          const X = cx(x);
          const Y = cy(y);
          const on = tr.lit.has(k);
          if (c.t === "rock") return <g key={k}>{img("rock", S - 6, X, Y)}</g>;
          if (c.t === "stone" || (c.t === "shield" && !finalShield))
            return (
              <g key={k}>
                {on && <circle cx={X} cy={Y} r={S * 0.42} fill="#ffd27a" opacity=".55" filter="url(#glow4)" />}
                {img(on ? "siglit" : "sigdark", S - 6, X, Y)}
              </g>
            );
          if (c.t === "shield")
            return (
              <g key={k}>
                {on && <circle cx={X} cy={Y} r={S * 0.5} fill="#ffd27a" opacity=".6" filter="url(#glow4)" />}
                {img(on ? "shlit" : "shdark", S + 6, X, Y)}
              </g>
            );
          // a reflector
          const s = c.fixed ? c.s : B.st[k];
          const x1 = X - S * 0.36;
          const x2 = X + S * 0.36;
          const y1 = s === 0 ? Y + S * 0.36 : Y - S * 0.36;
          const y2 = s === 0 ? Y - S * 0.36 : Y + S * 0.36;
          return (
            <g
              key={k}
              className={c.fixed ? "fix" : "rot"}
              role={c.fixed ? undefined : "button"}
              aria-label={c.fixed ? "Fixed stone reflector" : "Bronze reflector, tap to turn"}
              onClick={() => turn(k)}
            >
              <rect
                x={X - S / 2 + 2}
                y={Y - S / 2 + 2}
                width={S - 4}
                height={S - 4}
                rx="8"
                fill={c.fixed ? "rgba(120,120,120,.16)" : "rgba(217,168,74,.12)"}
              />
              {img(c.fixed ? "dish" : "mirror", S - 8, X, Y, s === 0)}
              <line
                className="mface"
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={c.fixed ? "#c9d0d8" : "#ffe3a8"}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity=".85"
              />
            </g>
          );
        })}
      </svg>
      <div className="d4-bm-side">
        <p className="d4-stat">
          {RANKS[B.rank].label} &middot; {fmtTime(B.elapsed)} &middot; {litN} of {targets.length} lit
        </p>
        <p className="d4-msg" aria-live="polite">
          {msg}
        </p>
        <div className="d2-row">
          <button type="button" className="d2-ghost" onClick={reset}>
            Reset reflectors
          </button>
        </div>
      </div>
    </div>
  );
}
