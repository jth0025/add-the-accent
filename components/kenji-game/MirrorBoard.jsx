"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { mrFlip } from "./tide-engine";
import { RANKS } from "./day2-data";
import { fmtTime } from "./ledger-engine";

const DONE = "Every mirror catches the torchlight at once.";

/* ------------------------------------------------------------------ */
/* The mirrors of the Wall: bronze mirrors ring the cavern pool. Turning */
/* one also turns the mirrors beside it, above it and below it; bring   */
/* every mirror to face the light. `state` is the ring ({n, lit, par,   */
/* presses, elapsed, solvedAt}), edited in place and handed back        */
/* through onChange to be saved.                                        */
/* ------------------------------------------------------------------ */
export default function MirrorBoard({ state, rank, paused, onChange, onSolve, apiRef }) {
  const M = state;
  const n = M.n;
  const [, tick] = useReducer((x) => x + 1, 0);
  const [msg, setMsg] = useState(M.solvedAt ? DONE : "");
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const solvedRef = useRef(!!M.solvedAt);
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
    if (M.solvedAt) return undefined;
    const t = setInterval(() => {
      if (document.hidden || pausedRef.current || solvedRef.current) return;
      M.elapsed += 1;
      if (M.elapsed % 5 === 0) onChangeRef.current(M);
      tick();
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = () => {
    M.solvedAt = Date.now();
    solvedRef.current = true;
    setMsg(DONE);
    onChangeRef.current(M);
    timers.current.push(setTimeout(() => onSolveRef.current(M), 900));
  };

  const turn = (c) => {
    if (solvedRef.current) return;
    mrFlip(M.lit, n, c);
    M.presses += 1;
    onChangeRef.current(M);
    if (M.lit.every(Boolean)) finish();
    tick();
  };

  // Review tools: every mirror to the light.
  useEffect(() => {
    if (!apiRef) return undefined;
    apiRef.current = {
      solve() {
        if (solvedRef.current) return;
        M.lit = M.lit.map(() => true);
        finish();
        tick();
      },
    };
    return () => {
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lit = M.lit.filter(Boolean).length;

  return (
    <div className={`d6-mr${M.solvedAt ? " solved" : ""}`}>
      <div
        className="d6-mr-board"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, width: `min(100%, ${n * 92 + 90}px)`, padding: n < 5 ? "16%" : "12%" }}
      >
        {M.lit.map((on, i) => (
          <button key={i} type="button" className={on ? "lit" : ""} aria-pressed={on} aria-label="Mirror" onClick={() => turn(i)} />
        ))}
      </div>
      <div className="d6-side">
        <p className="d6-stat">
          {RANKS[rank].label} &middot; {fmtTime(M.elapsed)} &middot; {lit} of {n * n} facing the light &middot; turns {M.presses}
        </p>
        <p className="d6-msg" aria-live="polite">
          {msg}
        </p>
      </div>
    </div>
  );
}
