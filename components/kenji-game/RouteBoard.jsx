"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { ROUTE_KINDS } from "./day4-data";
import { RBIT, RDX, RDY, routeLit } from "./beam-engine";
import { RANKS } from "./day2-data";
import { fmtTime } from "./ledger-engine";

const S = 90;
const DONE_MSG = "The line of light runs unbroken. The plate blazes.";

/* ------------------------------------------------------------------ */
/* Trace the route: the bronze plate is cut into tiles, each with a    */
/* piece of an engraved line. Tap a tile to turn it until one line of  */
/* light runs from the shield to every landmark. `state` is the plate  */
/* ({n, base, rot, deg, src, marks, elapsed, solvedAt}), edited in     */
/* place and handed back through onChange to be saved.                 */
/* ------------------------------------------------------------------ */
export default function RouteBoard({ state, rank, paused, onChange, onSolve, apiRef }) {
  const R = state;
  const n = R.n;
  const W = n * S;
  if (!R.deg) R.deg = R.rot.map((r) => r * 90);
  const [, tick] = useReducer((x) => x + 1, 0);
  const [msg, setMsg] = useState(R.solvedAt ? DONE_MSG : "");
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const solvedRef = useRef(!!R.solvedAt);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onSolveRef = useRef(onSolve);
  onSolveRef.current = onSolve;

  useEffect(() => {
    if (R.solvedAt) return undefined;
    const t = setInterval(() => {
      if (document.hidden || pausedRef.current || solvedRef.current) return;
      R.elapsed += 1;
      if (R.elapsed % 5 === 0) onChangeRef.current(R);
      tick();
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const check = () => {
    if (!solvedRef.current && routeLit(R).done) {
      R.solvedAt = Date.now();
      solvedRef.current = true;
      setMsg(DONE_MSG);
      onChangeRef.current(R);
      onSolveRef.current(R.elapsed);
    }
  };

  const turn = (c) => {
    if (solvedRef.current) return;
    if (c === R.src) {
      setMsg("The shield is fixed. The light starts here.");
      return;
    }
    R.rot[c] = (R.rot[c] + 1) % 4;
    R.deg[c] += 90;
    setMsg("");
    onChangeRef.current(R);
    check();
    tick();
  };

  // Review tools: turn every tile home.
  useEffect(() => {
    if (!apiRef) return undefined;
    apiRef.current = {
      solve() {
        if (solvedRef.current) return;
        R.rot = R.rot.map(() => 0);
        R.deg = R.deg.map((d) => Math.round(d / 360) * 360);
        check();
        tick();
      },
    };
    return () => {
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { lit } = routeLit(R);
  const got = R.marks.filter((c) => lit.has(c)).length;
  const sx = (R.src % n) * S + S / 2;
  const sy = ((R.src / n) | 0) * S + S / 2;

  return (
    <div className={`d4-rt${R.solvedAt ? " solved" : ""}`}>
      <div className="d4-rt-board">
        <svg viewBox={`0 0 ${W} ${W}`} role="img" aria-label="Bronze plate route puzzle">
          <defs>
            <filter id="rtglow">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {Array.from({ length: n * n }, (_, c) => (
            <rect key={c} x={(c % n) * S + 3} y={((c / n) | 0) * S + 3} width={S - 6} height={S - 6} rx="10" className="rt-cell" />
          ))}
          {Array.from({ length: n * n }, (_, c) => {
            const x = (c % n) * S + S / 2;
            const y = ((c / n) | 0) * S + S / 2;
            const b = R.base[c];
            let p = "";
            for (let d = 0; d < 4; d += 1) if (b & RBIT[d]) p += `M${x} ${y}L${x + (RDX[d] * S) / 2} ${y + (RDY[d] * S) / 2}`;
            return (
              <g
                key={c}
                className={`rt-tile${c === R.src ? " src" : ""}${lit.has(c) ? " on" : ""}`}
                style={{ transformOrigin: `${x}px ${y}px`, transform: `rotate(${R.deg[c]}deg)` }}
                onClick={() => turn(c)}
              >
                <rect x={x - S / 2 + 3} y={y - S / 2 + 3} width={S - 6} height={S - 6} fill="transparent" />
                <path className="rim" d={p} />
                <path className="groove" d={p} />
                <path className="lightline" d={p} />
                <circle className="node" cx={x} cy={y} r="9" />
              </g>
            );
          })}
          <image href="/kenji-game/day4/piece-shield-lit.webp" x={sx - 30} y={sy - 30} width="60" height="60" pointerEvents="none" />
          {R.marks.map((c, i) => {
            const x = (c % n) * S + S / 2;
            const y = ((c / n) | 0) * S + S / 2;
            return (
              <g key={c} className={`rt-mark${lit.has(c) ? " on" : ""}`} pointerEvents="none">
                <circle cx={x} cy={y} r="38" className="mk-ring" />
                <image href={ROUTE_KINDS[i].img} x={x - 34} y={y - 34} width="68" height="68" />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="d4-bm-side">
        <p className="d4-stat">
          {RANKS[rank].label} &middot; {fmtTime(R.elapsed)} &middot; {got} of {R.marks.length} reached
        </p>
        <p className="d4-msg" aria-live="polite">
          {msg}
        </p>
        <p className="d4-rt-key">
          {R.marks.map((c, i) => (
            <span key={c}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ROUTE_KINDS[i].img} alt="" />
              {ROUTE_KINDS[i].name}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
