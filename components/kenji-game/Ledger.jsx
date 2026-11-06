"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { ART2, BOARD, EMB, RANKS } from "./day2-data";
import { fmtTime, sdk } from "./ledger-engine";

const pc = (v) => `${(v / 1254) * 100}%`;

function Emblem({ v }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={EMB[v - 1][1]}
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: EMB[v - 1][2] }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* The ledger: a sudoku board drawn on parchment, emblem tiles for     */
/* numbers. `state` is the saved board ({n, rank, puz, sol, cur,       */
/* notes, elapsed, solvedAt}); it is edited in place and handed back   */
/* through onChange so the caller can save it.                         */
/* ------------------------------------------------------------------ */
export default function Ledger({ state, notesAllowed, conflicts: showConflicts, paused, onChange, onSolve, apiRef }) {
  const S = state;
  const n = S.n;
  const { bw, bh } = sdk(n);
  const BD = BOARD[n];
  const [, tick] = useReducer((x) => x + 1, 0);
  const [sel, setSel] = useState(() => Math.max(0, S.puz.findIndex((v) => !v)));
  const [notesMode, setNotesMode] = useState(false);
  const [marks, setMarks] = useState(false);
  const [msg, setMsg] = useState(S.solvedAt ? "The ledger is kept. Nothing missing, nothing twice." : "");
  const cellRefs = useRef([]);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const solvedRef = useRef(!!S.solvedAt);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onSolveRef = useRef(onSolve);
  onSolveRef.current = onSolve;

  const sameZone = useCallback(
    (a, b) => {
      const r = (a / n) | 0;
      const c = a % n;
      const r2 = (b / n) | 0;
      const c2 = b % n;
      return r === r2 || c === c2 || (r - (r % bh) === r2 - (r2 % bh) && c - (c % bw) === c2 - (c2 % bw));
    },
    [n, bw, bh],
  );

  // The squares whose emblem appears twice in a row, column or ward.
  const bad = new Set();
  if (showConflicts) {
    for (let i = 0; i < n * n; i += 1) {
      const v = S.cur[i];
      if (!v) continue;
      for (let j = 0; j < n * n; j += 1) {
        if (j !== i && S.cur[j] === v && sameZone(i, j)) bad.add(i);
      }
    }
  }

  // The clock only runs while the board is in front of Kenji.
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

  const place = (v) => {
    if (sel < 0 || S.puz[sel] || solvedRef.current) return;
    if (notesMode && v) {
      const ns = S.notes[sel] || (S.notes[sel] = []);
      const k = ns.indexOf(v);
      if (k >= 0) ns.splice(k, 1);
      else {
        ns.push(v);
        ns.sort();
      }
    } else {
      S.cur[sel] = S.cur[sel] === v ? 0 : v;
      if (v) {
        S.notes[sel] = [];
        for (let j = 0; j < n * n; j += 1) {
          if (S.notes[j] && sameZone(sel, j)) {
            const k = S.notes[j].indexOf(v);
            if (k >= 0) S.notes[j].splice(k, 1);
          }
        }
      }
    }
    onChangeRef.current(S);
    if (S.cur.every(Boolean)) {
      if (S.cur.every((x, i) => x === S.sol[i])) {
        S.solvedAt = Date.now();
        solvedRef.current = true;
        setMsg("The ledger is kept. Nothing missing, nothing twice.");
        onChangeRef.current(S);
        onSolveRef.current(S.elapsed);
      } else {
        setMsg(showConflicts ? "Every square is filled, but something appears twice." : "Every square is filled, but the ledger does not balance yet.");
      }
    } else {
      setMsg("");
    }
    tick();
  };
  const placeRef = useRef(place);
  placeRef.current = place;

  // Review tools: finish the board but for one square, then place it.
  useEffect(() => {
    if (!apiRef) return undefined;
    apiRef.current = {
      solve() {
        if (solvedRef.current) return;
        let last = -1;
        for (let k = 0; k < n * n; k += 1) {
          if (S.cur[k] !== S.sol[k]) {
            if (last < 0) last = k;
            else S.cur[k] = S.sol[k];
          }
        }
        if (last < 0) last = S.cur.findIndex((v, k) => !S.puz[k]);
        S.cur[last] = 0;
        setSel(last);
        setNotesMode(false);
        setTimeout(() => placeRef.current(S.sol[last]), 0);
      },
    };
    return () => {
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const erase = () => {
    if (sel < 0 || solvedRef.current) return;
    if (S.puz[sel]) {
      setMsg("That emblem was set by the Warden. Only your own can be erased.");
      return;
    }
    if (!S.cur[sel] && !(S.notes[sel] || []).length) {
      setMsg("Choose one of your emblems to erase.");
      return;
    }
    S.cur[sel] = 0;
    S.notes[sel] = [];
    setMsg("");
    onChangeRef.current(S);
    tick();
  };
  const clearMine = () => {
    if (solvedRef.current) return;
    S.cur = S.puz.slice();
    S.notes = {};
    setMsg("Your emblems are cleared. The Warden’s remain.");
    onChangeRef.current(S);
    tick();
  };

  const onKeyDown = (e) => {
    const k = e.key;
    let r = (sel / n) | 0;
    let c = sel % n;
    if (k === "ArrowUp") r = (r + n - 1) % n;
    else if (k === "ArrowDown") r = (r + 1) % n;
    else if (k === "ArrowLeft") c = (c + n - 1) % n;
    else if (k === "ArrowRight") c = (c + 1) % n;
    else if (/^[1-9]$/.test(k) && +k <= n) {
      place(+k);
      e.preventDefault();
      return;
    } else if (k === "Backspace" || k === "Delete" || k === "0") {
      if (!S.puz[sel] && !solvedRef.current) {
        S.cur[sel] = 0;
        onChangeRef.current(S);
        tick();
      }
      e.preventDefault();
      return;
    } else if ((k === "n" || k === "N") && notesAllowed) {
      setNotesMode((m) => !m);
      return;
    } else return;
    e.preventDefault();
    const nx = r * n + c;
    setSel(nx);
    cellRefs.current[nx]?.focus({ preventScroll: true });
  };

  const sv = S.cur[sel];
  const sr = (sel / n) | 0;
  const sc = sel % n;
  const counts = new Array(n + 1).fill(0);
  S.cur.forEach((v) => {
    counts[v] += 1;
  });

  return (
    <div className="d2-lg" onKeyDown={onKeyDown}>
      <div className="d2-board">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="d2-bg" src={BD.src} alt="" draggable={false} />
        <div className="d2-cells" role="grid" aria-label="Ledger">
          {BD.wards.map(([x1, y1, x2, y2], k) => (
            <div
              key={k}
              className="d2-ward"
              style={{
                left: pc(Math.min(x1, x2) - 3),
                top: pc(Math.min(y1, y2) - 3),
                width: pc(Math.abs(x2 - x1) + 6),
                height: pc(Math.abs(y2 - y1) + 6),
              }}
            />
          ))}
          {S.cur.map((v, i) => {
            const r = (i / n) | 0;
            const c = i % n;
            const [x1, x2] = BD.cols[c];
            const [y1, y2] = BD.rows[r];
            const peer = sel >= 0 && (r === sr || c === sc || (r - (r % bh) === sr - (sr % bh) && c - (c % bw) === sc - (sc % bw)));
            const cls = [
              "d2-cell",
              S.puz[i] ? "given" : "",
              i === sel ? "sel" : "",
              peer && i !== sel ? "peer" : "",
              sv && v === sv && i !== sel ? "same" : "",
              bad.has(i) ? "bad" : "",
            ]
              .filter(Boolean)
              .join(" ");
            const ns = S.notes[i] || [];
            return (
              <button
                key={i}
                ref={(el) => {
                  cellRefs.current[i] = el;
                }}
                type="button"
                role="gridcell"
                className={cls}
                style={{ left: pc(x1), top: pc(y1), width: pc(x2 - x1), height: pc(y2 - y1) }}
                aria-label={`Row ${r + 1} column ${c + 1}, ${v ? EMB[v - 1][0] + (S.puz[i] ? ", given" : "") : "empty"}`}
                onClick={() => setSel(i)}
              >
                {v ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="tile" src={ART2.tile(v)} alt="" draggable={false} />
                    {marks && <small>{v}</small>}
                  </>
                ) : ns.length ? (
                  <span className="d2-notes">
                    {ns.map((x) => (
                      <Emblem key={x} v={x} />
                    ))}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
      <div className="d2-lgside">
        <div className="d2-pal">
          {Array.from({ length: n }, (_, k) => k + 1).map((v) => (
            <button
              key={v}
              type="button"
              className={counts[v] >= n ? "done" : ""}
              aria-label={EMB[v - 1][0]}
              onClick={() => place(v)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ART2.tile(v)} alt="" draggable={false} />
              <span>{EMB[v - 1][0]}</span>
            </button>
          ))}
        </div>
        <div className="d2-tools">
          <button type="button" onClick={erase}>
            Erase
          </button>
          <button type="button" onClick={clearMine}>
            Clear mine
          </button>
          <button
            type="button"
            aria-pressed={notesMode}
            disabled={!notesAllowed}
            title={notesAllowed ? "" : "Your ink brush is not in your satchel"}
            onClick={() => setNotesMode((m) => !m)}
          >
            {notesAllowed ? "Notes" : "Notes (needs ink brush)"}
          </button>
          <button type="button" aria-pressed={marks} onClick={() => setMarks((m) => !m)}>
            Show numbers
          </button>
        </div>
        <p className="d2-stat">
          <b>{RANKS[S.rank].label}</b> &middot; {fmtTime(S.elapsed)} &middot; {S.cur.filter(Boolean).length} of {n * n} placed
        </p>
        <p className="d2-msg" aria-live="polite">
          {msg}
        </p>
      </div>
    </div>
  );
}
