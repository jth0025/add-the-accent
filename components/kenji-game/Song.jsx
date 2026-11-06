"use client";

import { useEffect, useRef, useState } from "react";
import { SONG } from "./day3-data";
import { addToken, audio, tick, tone } from "./day3-engine";
import { rand } from "./ledger-engine";

/* ------------------------------------------------------------------ */
/* Namonoki's song: the grove plays a phrase of notes and silences,    */
/* then the player plays it back on the beat (a note in a rest breaks  */
/* the phrase as surely as a wrong note). Each phrase grows by one.    */
/*                                                                     */
/* Props: rank, notes (holes on the flute), endless (practice), forgive */
/* (the gourd's water forgives one mistake per phrase), blocked (a talk */
/* is open: keys do nothing), onProgress(len), onDone(len).            */
/* The component is remounted (key) when the rank changes.             */
/* ------------------------------------------------------------------ */
export default function Song({ rank, notes, endless = false, forgive = false, blocked = false, onProgress, onDone, apiRef }) {
  const R = SONG[rank];
  const beat = 60000 / R.bpm;
  const nn = notes;

  const seq = useRef(null);
  if (seq.current === null) seq.current = [rand(nn), rand(nn), rand(nn)];
  const phase = useRef("idle"); // idle | grove | count | play
  const t0 = useRef(0);
  const raf = useRef(0);
  const hits = useRef({});
  const results = useRef({});
  const forgiveLeft = useRef(forgive ? 1 : 0);
  const best = useRef(0);
  const timers = useRef([]);
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;
  const cb = useRef({ onProgress, onDone });
  cb.current = { onProgress, onDone };

  const [view, setView] = useState({ len: 3, show: false, cur: -1, res: {}, seq: [] });
  const [msg, setMsg] = useState("Press Listen to hear the grove’s phrase.");
  const [listen, setListen] = useState({ label: "Listen", disabled: false, hidden: false });
  const [lit, setLit] = useState({});
  const [forgiven, setForgiven] = useState(false);

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };

  const draw = (show, cur, res) =>
    setView({ len: seq.current.length, show, cur, res: res ? { ...res } : {}, seq: seq.current.slice() });
  const light = (i, ms) => {
    setLit((l) => ({ ...l, [i]: true }));
    later(() => setLit((l) => ({ ...l, [i]: false })), ms);
  };

  useEffect(() => {
    draw(false, -1);
    return () => {
      timers.current.forEach(clearTimeout);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForgive = () => {
    forgiveLeft.current = forgive ? 1 : 0;
    setForgiven(false);
  };

  const succeed = () => {
    phase.current = "idle";
    cancelAnimationFrame(raf.current);
    const len = seq.current.length;
    best.current = Math.max(best.current, len);
    if (cb.current.onProgress) cb.current.onProgress(len);
    if (!endless && len >= R.goal) {
      draw(true, -1, results.current);
      setMsg("The phrase is complete. The grove is quiet, and something in it has opened.");
      setListen((l) => ({ ...l, hidden: true }));
      cb.current.onDone(len);
      return;
    }
    addToken(seq.current, nn);
    draw(false, -1);
    setMsg("Good. The grove adds to the phrase.");
    setListen({ label: "Listen", disabled: false, hidden: false });
    resetForgive();
  };

  const fail = (k, why) => {
    if (forgiveLeft.current > 0) {
      forgiveLeft.current -= 1;
      if (hits.current[k] === undefined) hits.current[k] = -1;
      results.current[k] = "ok";
      setMsg(`${why} The grove lets it pass, once.`);
      setForgiven(true);
      return;
    }
    phase.current = "idle";
    cancelAnimationFrame(raf.current);
    results.current[k] = "miss";
    draw(R.show, -1, results.current);
    setMsg(`${why}${endless ? ` Your longest phrase: ${best.current}.` : " Listen again, and try once more."}`);
    setListen({ label: endless ? "Start over" : "Listen again", disabled: false, hidden: false });
    if (endless) seq.current = [rand(nn), rand(nn), rand(nn)];
    resetForgive();
  };

  const loop = () => {
    if (phase.current !== "play") return;
    const now = performance.now();
    const k = Math.floor((now - t0.current + beat * 0.35) / beat);
    const s = seq.current;
    // a note slot that passed without a press
    for (let j = 0; j < Math.min(k, s.length); j += 1) {
      if (s[j] !== "r" && hits.current[j] === undefined && now - t0.current > j * beat + beat * 0.5) {
        fail(j, `The note on beat ${j + 1} never came.`);
        if (phase.current !== "play") return;
      }
      if (s[j] === "r" && !results.current[j] && now - t0.current > j * beat + beat * 0.5) results.current[j] = "ok";
    }
    draw(R.show, Math.min(k, s.length - 1), results.current);
    if (now - t0.current > (s.length - 1) * beat + beat * 0.55) {
      succeed();
      return;
    }
    raf.current = requestAnimationFrame(loop);
  };

  const countIn = () => {
    phase.current = "count";
    setMsg("Your turn. Two beats, then begin.");
    tick();
    later(tick, beat);
    later(() => {
      phase.current = "play";
      t0.current = performance.now();
      hits.current = {};
      results.current = {};
      loop();
    }, beat * 2);
  };

  const play = () => {
    phase.current = "grove";
    setListen((l) => ({ ...l, disabled: true }));
    setMsg("The grove plays. Listen to the notes, and to the silences between them.");
    const s = seq.current;
    s.forEach((x, k) => {
      later(() => {
        draw(R.show, k);
        if (x !== "r") {
          tone(x, (beat / 1000) * 0.85);
          light(x, beat * 0.8);
        }
      }, 400 + k * beat);
    });
    later(() => {
      draw(R.show, -1);
      countIn();
    }, 400 + s.length * beat + beat * 0.5);
  };

  const press = (i) => {
    light(i, 180);
    tone(i, 0.35);
    if (phase.current !== "play") return;
    const t = performance.now() - t0.current;
    const k = Math.round(t / beat);
    const off = Math.abs(t - k * beat);
    const s = seq.current;
    if (k < 0 || k >= s.length || off > beat * 0.38) {
      fail(Math.max(0, Math.min(s.length - 1, k)), "Off the beat.");
      return;
    }
    if (hits.current[k] !== undefined) {
      fail(k, "Two notes on one beat.");
      return;
    }
    if (s[k] === "r") {
      fail(k, "A note sounded in the silence.");
      return;
    }
    if (s[k] !== i) {
      fail(k, "The wrong note.");
      return;
    }
    hits.current[k] = i;
    results.current[k] = "ok";
  };
  const pressRef = useRef(press);
  pressRef.current = press;

  useEffect(() => {
    const kd = (e) => {
      if (blockedRef.current || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = +e.key;
      if (n >= 1 && n <= nn) {
        pressRef.current(n - 1);
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", kd);
    return () => document.removeEventListener("keydown", kd);
  }, [nn]);

  // Review tools: grow the phrase to its goal and finish.
  useEffect(() => {
    if (!apiRef) return undefined;
    apiRef.current = {
      solve() {
        if (endless) return;
        phase.current = "idle";
        cancelAnimationFrame(raf.current);
        timers.current.forEach(clearTimeout);
        while (seq.current.length < R.goal) addToken(seq.current, nn);
        best.current = seq.current.length;
        draw(true, -1);
        setListen((l) => ({ ...l, hidden: true }));
        setMsg("The phrase is complete.");
        cb.current.onDone(seq.current.length);
      },
    };
    return () => {
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d3-song">
      <div className="d3-song-top">
        <span>
          Phrase length <b>{view.len}</b>
        </span>
        <span>{endless ? "Endless" : <>Goal <b>{R.goal}</b></>}</span>
        <span>
          Tempo <b>{R.bpm}</b>
        </span>
        {forgive ? (
          <span>
            Gourd offering: <b>{forgiven ? "used for this phrase" : "1 mistake forgiven per phrase"}</b>
          </span>
        ) : null}
      </div>
      <div className="d3-beats" aria-hidden="true">
        {view.seq.map((x, k) => (
          <span
            key={k}
            className={`d3-beat${view.show ? (x === "r" ? " rest" : " note") : ""}${k === view.cur ? " now" : ""}${
              view.res[k] ? ` ${view.res[k]}` : ""
            }`}
          />
        ))}
      </div>
      <div className="d3-flute">
        {Array.from({ length: nn }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`d3-hole${lit[i] ? " lit" : ""}`}
            aria-label={`Note ${i + 1}`}
            onPointerDown={(e) => {
              e.preventDefault();
              audio();
              press(i);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") e.preventDefault(); // the number keys play; Enter stays free
            }}
          >
            <span>{i + 1}</span>
          </button>
        ))}
      </div>
      <p className="d3-song-msg" aria-live="polite">
        {msg}
      </p>
      <div className="d2-row">
        {!listen.hidden && (
          <button
            type="button"
            className="d3-go"
            disabled={listen.disabled}
            onClick={() => {
              audio();
              play();
            }}
          >
            {listen.label}
          </button>
        )}
      </div>
    </div>
  );
}
