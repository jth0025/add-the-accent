"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { GLYPHS } from "./day3-data";
import { ALPHA, sentence, verseLetters, verseSolved } from "./day3-engine";
import { RANKS } from "./day2-data";
import { fmtTime, rand } from "./ledger-engine";

function Glyph({ g }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d={GLYPHS[g]} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* A carved verse: each glyph hides one letter (the same glyph is      */
/* always the same letter). `state` is the verse ({text, rank, map,    */
/* guess, locked, elapsed, solvedAt}); it is edited in place and       */
/* handed back through onChange so the caller can save it.             */
/* ------------------------------------------------------------------ */
export default function Glyphs({ state, incense, onUseIncense, paused, onChange, onSolve, apiRef }) {
  const V = state;
  const [, tick] = useReducer((x) => x + 1, 0);
  const letters = verseLetters(V);
  const glyphOf = (L) => V.map[L];
  const order = V.text
    .split(" ")
    .flatMap((w) => w.split("").map((L) => glyphOf(L)));
  const [sel, setSel] = useState(() => {
    if (V.solvedAt) return -1;
    const first = order.find((g) => !V.guess[g]);
    return first === undefined ? -1 : first;
  });
  const [msg, setMsg] = useState(V.solvedAt ? sentence(V.text) : "");
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const solvedRef = useRef(!!V.solvedAt);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onSolveRef = useRef(onSolve);
  onSolveRef.current = onSolve;

  // The clock only runs while the stone is in front of Kenji.
  useEffect(() => {
    if (V.solvedAt) return undefined;
    const t = setInterval(() => {
      if (document.hidden || pausedRef.current || solvedRef.current) return;
      V.elapsed += 1;
      if (V.elapsed % 5 === 0) onChangeRef.current(V);
      tick();
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const check = () => {
    if (!letters.every((L) => V.guess[glyphOf(L)])) {
      setMsg("");
      return;
    }
    if (verseSolved(V)) {
      V.solvedAt = Date.now();
      solvedRef.current = true;
      setSel(-1);
      setMsg(sentence(V.text));
      onChangeRef.current(V);
      onSolveRef.current(V.elapsed);
    } else {
      setMsg("Every glyph is marked, but the verse does not read true yet.");
    }
  };

  const assign = (L) => {
    if (sel < 0 || solvedRef.current) return;
    if (V.locked.includes(sel)) {
      setMsg("That glyph is already clear.");
      return;
    }
    // a letter belongs to one glyph at a time
    Object.keys(V.guess).forEach((g) => {
      if (V.guess[g] === L && +g !== sel && !V.locked.includes(+g)) delete V.guess[g];
    });
    if (V.guess[sel] === L) delete V.guess[sel];
    else V.guess[sel] = L;
    // move on to the next glyph still unmarked
    const start = order.indexOf(sel);
    for (let k = 1; k <= order.length; k += 1) {
      const g = order[(start + k) % order.length];
      if (!V.guess[g]) {
        setSel(g);
        break;
      }
    }
    onChangeRef.current(V);
    check();
    tick();
  };
  const assignRef = useRef(assign);
  assignRef.current = assign;

  const clear = () => {
    if (sel >= 0 && !V.locked.includes(sel) && !solvedRef.current) {
      delete V.guess[sel];
      setMsg("");
      onChangeRef.current(V);
      tick();
    }
  };

  const burn = () => {
    if (!incense || incense() <= 0 || solvedRef.current) return;
    const left = [...new Set(letters)].filter((L) => V.guess[glyphOf(L)] !== L);
    if (!left.length) return;
    const L = left[rand(left.length)];
    const g = glyphOf(L);
    Object.keys(V.guess).forEach((k) => {
      if (V.guess[k] === L) delete V.guess[k];
    });
    V.guess[g] = L;
    V.locked.push(g);
    onUseIncense();
    setMsg(`The cedar smoke settles into one carving, and its letter shows: ${L}.`);
    onChangeRef.current(V);
    check();
    tick();
  };

  // Review tools: read the whole verse.
  useEffect(() => {
    if (!apiRef) return undefined;
    apiRef.current = {
      solve() {
        if (solvedRef.current) return;
        letters.forEach((L) => {
          V.guess[glyphOf(L)] = L;
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

  const onKeyDown = (e) => {
    if (/^[a-z]$/i.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      assign(e.key.toUpperCase());
      e.preventDefault();
    } else if (e.key === "Backspace" || e.key === "Delete") {
      clear();
      e.preventDefault();
    }
  };

  const usedBy = {};
  Object.values(V.guess).forEach((L) => {
    usedBy[L] = (usedBy[L] || 0) + 1;
  });
  const total = new Set(letters).size;
  const done = [...new Set(letters)].filter((L) => V.guess[glyphOf(L)]).length;
  const left = incense ? incense() : 0;

  return (
    <div className="d3-vs" onKeyDown={onKeyDown}>
      <div className="d3-stone">
        <div className="d3-verse">
          {V.text.split(" ").map((w, wi) => (
            <span className="d3-vw" key={wi}>
              {w.split("").map((L, k) => {
                const g = glyphOf(L);
                const mark = V.guess[g] || "";
                const lock = V.locked.includes(g);
                return (
                  <button
                    key={k}
                    type="button"
                    className={`d3-gc${g === sel ? " sel" : ""}${lock ? " lock" : ""}`}
                    aria-label={`Glyph${mark ? `, marked ${mark}` : ", unmarked"}${lock ? ", revealed" : ""}`}
                    onClick={() => {
                      if (!solvedRef.current) setSel(g);
                    }}
                  >
                    <Glyph g={g} />
                    <span className="d3-slot">{mark}</span>
                  </button>
                );
              })}
            </span>
          ))}
        </div>
      </div>
      <div className="d3-vkb">
        {ALPHA.map((L) => (
          <button key={L} type="button" className={usedBy[L] ? "used" : ""} onClick={() => assign(L)}>
            {L}
          </button>
        ))}
      </div>
      <div className="d3-vtools">
        <button type="button" className="d2-ghost" onClick={clear}>
          Clear this glyph
        </button>
        {incense && !V.solvedAt ? (
          <button type="button" className="d2-ghost" disabled={left <= 0} onClick={burn}>
            Burn incense ({left} left)
          </button>
        ) : null}
        <span className="d3-vstat">
          {RANKS[V.rank].label} &middot; {fmtTime(V.elapsed)} &middot; {done} of {total} glyphs marked
        </span>
      </div>
      <p className="d3-vmsg" aria-live="polite">
        {msg}
      </p>
    </div>
  );
}
