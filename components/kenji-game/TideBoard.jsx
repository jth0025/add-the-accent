"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { TL_N, tlApply, tlGrid, tlSolved } from "./tide-engine";
import { RANKS } from "./day2-data";
import { fmtTime } from "./ledger-engine";

const C = 100 / TL_N;
const D6 = "/kenji-game/day6";

/* ------------------------------------------------------------------ */
/* The tide locks: stone gates slide along their own tracks (drag      */
/* them), until the tide (the water piece) can slide out of the right  */
/* edge of its row. Every slide is one move. `state` is the board      */
/* ({P, par, moves, elapsed, cur, solvedAt}); it is edited in place    */
/* and handed back through onChange to be saved.                       */
/* ------------------------------------------------------------------ */
export default function TideBoard({ state, rank, paused, onChange, onSolve, apiRef }) {
  const S = state;
  S.moves = S.moves || 0;
  S.elapsed = S.elapsed || 0;
  const [P, setP] = useState(() => (S.cur ? S.cur : S.P).map((p) => ({ ...p })));
  const [drag, setDrag] = useState(null); // { i, pos } while a gate is held
  const dragRef = useRef(null);
  const boardRef = useRef(null);
  const innerRef = useRef(null);
  const [, tick] = useReducer((x) => x + 1, 0);
  const [msg, setMsg] = useState(S.solvedAt ? "The tide runs free." : "");
  const [out, setOut] = useState(!!S.solvedAt); // the tide has slid away
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

  const finish = (text) => {
    S.solvedAt = Date.now();
    solvedRef.current = true;
    setOut(true);
    setMsg(text);
    onChangeRef.current(S);
    timers.current.push(setTimeout(() => onSolveRef.current(S), 900));
  };

  // how far a gate may slide, from where it stands
  const range = (i) => {
    const g = tlGrid(P);
    const p = P[i];
    let lo = p.h ? p.c : p.r;
    let hi = lo;
    if (p.h) {
      while (lo - 1 >= 0 && g[p.r * TL_N + lo - 1] === -1) lo -= 1;
      while (hi + p.len < TL_N && g[p.r * TL_N + hi + p.len] === -1) hi += 1;
    } else {
      while (lo - 1 >= 0 && g[(lo - 1) * TL_N + p.c] === -1) lo -= 1;
      while (hi + p.len < TL_N && g[(hi + p.len) * TL_N + p.c] === -1) hi += 1;
    }
    return [lo, hi];
  };

  const onDown = (e) => {
    const el = e.target.closest("[data-i]");
    if (!el || solvedRef.current) return;
    e.preventDefault();
    const i = +el.dataset.i;
    const p = P[i];
    const start = p.h ? p.c : p.r;
    dragRef.current = {
      i,
      start,
      pos: start,
      x: e.clientX,
      y: e.clientY,
      cell: innerRef.current.getBoundingClientRect().width / TL_N,
      rg: range(i),
    };
    setDrag({ i, pos: start });
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* not capturable: the board still hears the move */
    }
  };
  const onMove = (e) => {
    const dr = dragRef.current;
    if (!dr) return;
    const p = P[dr.i];
    const dd = (p.h ? e.clientX - dr.x : e.clientY - dr.y) / dr.cell;
    const pos = Math.max(dr.rg[0], Math.min(dr.rg[1], Math.round(dr.start + dd)));
    if (pos !== dr.pos) {
      dr.pos = pos;
      setDrag({ i: dr.i, pos });
    }
  };
  const onUp = () => {
    const dr = dragRef.current;
    if (!dr) return;
    dragRef.current = null;
    setDrag(null);
    if (dr.pos === dr.start) return;
    const next = tlApply(P, dr.i, dr.pos - dr.start);
    setP(next);
    S.moves += 1;
    S.cur = next;
    onChangeRef.current(S);
    if (tlSolved(next) && !solvedRef.current) {
      finish(S.moves <= S.par ? "The tide runs free, in the Wall’s own count." : `The tide runs free. The Wall did it in ${S.par}.`);
    }
  };

  const reset = () => {
    if (solvedRef.current) return;
    setP(S.P.map((p) => ({ ...p })));
    S.cur = null;
    S.moves = 0;
    setMsg("");
    onChangeRef.current(S);
    tick();
  };

  // Review tools: let the tide run free.
  useEffect(() => {
    if (!apiRef) return undefined;
    apiRef.current = {
      solve() {
        if (solvedRef.current) return;
        S.moves = S.par;
        finish("The tide runs free.");
        tick();
      },
    };
    return () => {
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d6-tl">
      <div
        ref={boardRef}
        className="d6-tl-board"
        aria-label="Tide lock board"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div ref={innerRef} className="d6-tl-inner">
          {P.map((p, i) => {
            const held = drag && drag.i === i;
            const r = p.h ? p.r : held ? drag.pos : p.r;
            const c = p.h ? (held ? drag.pos : p.c) : p.c;
            const style = {
              left: `${c * C + 0.8}%`,
              top: `${r * C + 0.8}%`,
              width: `${(p.h ? p.len : 1) * C - 1.6}%`,
              height: `${(p.h ? 1 : p.len) * C - 1.6}%`,
            };
            if (p.tide && out) {
              style.left = "110%";
              style.transition = "left .9s ease-in";
            }
            return (
              <div
                key={i}
                data-i={i}
                className={`d6-tl-piece${p.tide ? " tide" : ""}${p.h ? "" : " v"} l${p.len}${held ? " drag" : ""}`}
                aria-label={p.tide ? "The tide" : "Stone gate"}
                style={style}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  draggable="false"
                  src={p.tide ? `${D6}/tide-water.webp` : p.len > 2 ? `${D6}/tide-gate-long.webp` : `${D6}/tide-gate-short.webp`}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="d6-side">
        <p className="d6-stat">
          {RANKS[rank].label} &middot; {fmtTime(S.elapsed)} &middot; moves {S.moves} &middot; the Wall’s count {S.par}
        </p>
        <p className="d6-msg" aria-live="polite">
          {msg}
        </p>
        <div className="d2-row">
          <button type="button" className="d2-ghost" onClick={reset}>
            Reset the gates
          </button>
        </div>
      </div>
    </div>
  );
}
