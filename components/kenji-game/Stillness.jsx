"use client";

import { useEffect, useRef, useState } from "react";
import { VISIONS } from "./day7-data";

/* ------------------------------------------------------------------ */
/* Stillness: press and hold (the button, or the space bar) to sit      */
/* still. Fear, grief and desire come in turn; notice each, and let it  */
/* pass. Letting go, moving, or reacting breaks the stillness.          */
/* ------------------------------------------------------------------ */
export default function Stillness({ done: doneAtStart, blocked, reducedMotion, onAllDone, apiRef }) {
  const DUR = reducedMotion ? 5000 : 11000;
  const [done, setDone] = useState(doneAtStart);
  const [holding, setHolding] = useState(false);
  const [vision, setVision] = useState({ k: "", img: "", on: false });
  const [whisper, setWhisper] = useState({ text: "", on: false });
  const [name, setName] = useState({ text: "", on: false });
  const [msg, setMsg] = useState(doneAtStart >= 3 ? "Nothing left to move you." : "Sit. Breathe. Press and hold.");

  const hostRef = useRef(null);
  const raf = useRef(0);
  const t0 = useRef(0);
  const holdingRef = useRef(false);
  const doneRef = useRef(doneAtStart);
  const pos = useRef(null);
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;
  const timers = useRef([]);
  const onAllDoneRef = useRef(onAllDone);
  onAllDoneRef.current = onAllDone;
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const clearV = () => {
    setVision((v) => ({ ...v, on: false }));
    setWhisper((w) => ({ ...w, on: false }));
    setName((n) => ({ ...n, on: false }));
  };

  const brk = (why) => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    setHolding(false);
    cancelAnimationFrame(raf.current);
    clearV();
    setMsg(`${why} The stillness breaks. Breathe, and begin again.`);
  };

  const flags = useRef({ v: false, w: false, n: false, o: false });
  const tick = (now) => {
    if (!holdingRef.current) return;
    const t = now - t0.current;
    const v = VISIONS[doneRef.current];
    const f = flags.current;
    // the vision rises, whispers, is named, and fades: each once
    if (t > DUR * 0.08 && !f.v) {
      f.v = true;
      setVision((s) => ({ ...s, on: true }));
    }
    if (t > DUR * 0.32 && !f.w) {
      f.w = true;
      setWhisper({ text: v.whisper, on: true });
    }
    if (t > DUR * 0.66 && !f.n) {
      f.n = true;
      setName({ text: `${v.name}. Noticed.`, on: true });
      setWhisper((w) => ({ ...w, on: false }));
    }
    if (t > DUR * 0.78 && !f.o) {
      f.o = true;
      setVision((s) => ({ ...s, on: false }));
    }
    if (t >= DUR) {
      doneRef.current += 1;
      setDone(doneRef.current);
      holdingRef.current = false;
      setHolding(false);
      later(() => setName((n) => ({ ...n, on: false })), 900);
      if (doneRef.current >= 3) {
        setMsg("Nothing left to move you.");
        later(() => onAllDoneRef.current(), 1400);
        return;
      }
      setMsg(`${VISIONS[doneRef.current - 1].name} passes. Press and hold again when you are ready.`);
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const begin = (e) => {
    if (doneRef.current >= 3 || holdingRef.current) return;
    if (e) e.preventDefault();
    holdingRef.current = true;
    setHolding(true);
    setMsg("Stay still.");
    pos.current = null;
    flags.current = { v: false, w: false, n: false, o: false };
    t0.current = performance.now();
    const v = VISIONS[doneRef.current];
    setVision({ k: v.k, img: v.img, on: false });
    setWhisper({ text: "", on: false });
    setName({ text: "", on: false });
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const mv = (e) => {
      if (!holdingRef.current) return;
      if (pos.current === null) {
        pos.current = [e.clientX, e.clientY];
        return;
      }
      if (Math.hypot(e.clientX - pos.current[0], e.clientY - pos.current[1]) > 34) brk("You moved toward it.");
    };
    const kd = (e) => {
      if (e.key === " " && !e.repeat && !blockedRef.current) {
        begin(e);
      } else if (holdingRef.current && e.key !== " ") brk("You reacted.");
    };
    const ku = (e) => {
      if (e.key === " " && holdingRef.current) brk("You let go.");
    };
    window.addEventListener("pointermove", mv);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    later(() => hostRef.current?.scrollIntoView({ block: "center", behavior: reducedMotion ? "auto" : "smooth" }), 300);
    const ts = timers.current;
    return () => {
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      cancelAnimationFrame(raf.current);
      ts.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Review tools: all three visions pass at once.
  useEffect(() => {
    if (!apiRef) return undefined;
    apiRef.current = {
      solve() {
        if (doneRef.current >= 3) return;
        holdingRef.current = false;
        cancelAnimationFrame(raf.current);
        doneRef.current = 3;
        setDone(3);
        setHolding(false);
        clearV();
        setMsg("Nothing left to move you.");
        later(() => onAllDoneRef.current(), 600);
      },
    };
    return () => {
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={hostRef} className="d7-still">
      {vision.img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={`d7-vision ${vision.k}${vision.on ? " on" : ""}`} src={vision.img} alt="" />
      )}
      <p className={`d7-whisper${whisper.on ? " on" : ""}`}>{whisper.text}</p>
      <p className={`d7-vname${name.on ? " on" : ""}`}>{name.text}</p>
      <div className="d7-still-ui">
        <div className="d7-dots">
          {VISIONS.map((v, i) => (
            <i key={v.k} className={i < done ? "done" : ""} />
          ))}
        </div>
        <button
          type="button"
          className={`d7-hold${holding ? " held" : ""}`}
          aria-label="Hold to stay still"
          onPointerDown={begin}
          onPointerUp={() => brk("You let go.")}
          onPointerCancel={() => brk("You let go.")}
          onPointerLeave={() => brk("You let go.")}
        >
          Hold
        </button>
        <p className="d7-still-msg" aria-live="polite">
          {msg}
        </p>
      </div>
    </div>
  );
}
