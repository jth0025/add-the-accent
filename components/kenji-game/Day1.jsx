"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import PlaqueButton from "./PlaqueButton";
import { ART, CAST, CLUES, FRAGS, POR, SCRIPTS, STEPS } from "./day1-data";
import {
  DAY1_ITEMS,
  SEAL_SEGS,
  SLOTS,
  freshDay1,
  itemById,
  loadDay1,
  saveDay1,
  sealSolved,
  writeJourney,
} from "@/lib/kenjiJourney";
import "./day1.css";

const norm = (v, i) => ((v % SEAL_SEGS[i]) + SEAL_SEGS[i]) % SEAL_SEGS[i];
// Degrees each click turns a ring (one carved segment), and the nudge that
// puts the gate ring's torii (carved just left of its seam) under the notch.
const SEAL_STEP = [30, 40, 60];
const SEAL_OFFSET = [15, 0, 0];
const clamp01 = (v) => Math.min(1, Math.max(0, v));

/* ------------------------------------------------------------------ */
/* Dialogue: portraits left and right, thought bubbles, smoky memories */
/* ------------------------------------------------------------------ */
function Dialogue({ lines, onDone, reducedMotion, onLine }) {
  const [i, setI] = useState(0);
  const [closing, setClosing] = useState(false);
  const [ports, setPorts] = useState({ left: null, right: null });
  const portsRef = useRef(ports);
  const timers = useRef([]);
  const skipRef = useRef(null);
  const finished = useRef(false);

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  const put = (side, value) => {
    portsRef.current = { ...portsRef.current, [side]: value };
    setPorts(portsRef.current);
  };

  const line = lines[i];
  const cast = CAST[line.who];
  const side = cast.side;

  // Stage the portrait for the current line.
  useEffect(() => {
    if (onLine) onLine(line.who);
    const pose = line.pose || "close";
    const art = cast.art[pose] || cast.art.close;
    const key = cast.name + pose + (line.mem ? "m" : "");
    const flip = (side === "right" && art[1] === "r") || (side === "left" && art[1] === "l");
    const next = { key, src: POR[art[0]], alt: cast.name, flip, mem: !!line.mem, sil: !!line.sil };
    const cur = portsRef.current[side];
    if (cur && cur.key === key) {
      put(side, { ...cur, mem: next.mem, sil: next.sil, out: false });
    } else if (cur) {
      put(side, { ...cur, out: true });
      later(() => put(side, { ...next, out: false }), reducedMotion ? 0 : cur.mem ? 850 : 260);
    } else {
      put(side, { ...next, out: true });
      later(() => put(side, { ...next, out: false }), 30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  const end = () => {
    if (closing) return;
    const hasMem = [portsRef.current.left, portsRef.current.right].some((p) => p && p.mem);
    if (hasMem && !reducedMotion) {
      setClosing(true);
      later(finish, 900);
      return;
    }
    finish();
  };
  const endRef = useRef(end);
  endRef.current = end;

  const next = () => {
    if (i + 1 >= lines.length) end();
    else setI(i + 1);
  };
  const nextRef = useRef(next);
  nextRef.current = next;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        nextRef.current();
      } else if (e.key === "Escape") {
        endRef.current();
      }
    };
    document.addEventListener("keydown", onKey);
    skipRef.current?.focus({ preventScroll: true });
    const ts = timers.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      ts.forEach(clearTimeout);
    };
  }, []);

  const activeMemSide = line.mem ? side : null;
  const renderPor = (s) => {
    const p = ports[s];
    // eslint-disable-next-line @next/next/no-img-element
    if (!p) return <img className={`d1-por ${s}`} alt="" />;
    const dim = s !== side;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={p.src}
        alt={p.alt}
        className={`d1-por ${s}${p.flip ? " flip" : ""}${p.mem ? " mem" : ""}${p.sil ? " sil" : ""}${
          p.out ? " out" : " in"
        }${dim ? " dim" : ""}`}
      />
    );
  };

  return (
    <div
      className={`d1-dlg${closing ? " closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Story"
      onClick={(e) => {
        if (e.target.closest("[data-skip]")) {
          e.stopPropagation();
          end();
          return;
        }
        next();
      }}
    >
      {renderPor("left")}
      {renderPor("right")}
      <div className={`d1-smoke left${closing ? "" : activeMemSide === "left" ? " on" : ""}`} aria-hidden="true" />
      <div className={`d1-smoke right${closing ? "" : activeMemSide === "right" ? " on" : ""}`} aria-hidden="true" />
      <div className={`d1-box${line.thought ? ` think from-${side}` : ""}`}>
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <p className="d1-name">
          {cast.name}
          {line.mem ? <small>remembered</small> : line.sil ? <small>unseen</small> : line.thought ? <small>thinking</small> : null}
        </p>
        <p className={`d1-text${line.thought ? " thought" : ""}`} aria-live="polite">
          {line.text}
          {line.gloss && <span className="d1-gloss">{line.gloss}</span>}
        </p>
        <div className="d1-ctl">
          <span>Tap or press Enter</span>
          <button type="button" data-skip ref={skipRef}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Altar reveal: dial burns, wall opens, Emichō enters the blade        */
/* ------------------------------------------------------------------ */
function AltarReveal({ already, reducedMotion, talk, onTaken, onNext }) {
  const T = (ms) => (reducedMotion ? Math.min(ms, 300) : ms);
  const [note, setNote] = useState(already ? "Hikariwake is yours." : "The dial burns with light.");
  const [wide, setWide] = useState(!!already);
  const [open, setOpen] = useState(!!already);
  const [glow, setGlow] = useState("");
  const [emi, setEmi] = useState({ on: false, left: "50%", top: "44%", dissolve: false });
  const [bladeUp, setBladeUp] = useState(false);
  const [anoint, setAnoint] = useState(already ? "set" : "");
  const [motes, setMotes] = useState([]);
  const [closeup, setCloseup] = useState(!!already);
  const rvRef = useRef(null);
  const emiRef = useRef(null);
  const bladeRef = useRef(null);
  const closeRef = useRef(null);
  const timers = useRef([]);
  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => {
    const ts = timers.current;
    if (!already) {
      later(() => setGlow("on"), T(300));
      later(() => {
        setNote("Stone grinds. The floor before the altar parts, and the old wall gives way to sunrise.");
        setGlow("flash");
        setOpen(true);
        setWide(true);
      }, T(2200));
      later(() => setGlow(""), T(4200));
      later(() => {
        setEmi((e) => ({ ...e, on: true }));
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setEmi((e) => ({ ...e, left: "50.5%", top: "74%" }))),
        );
        setNote("Emichō settles over something resting in the opened floor.");
      }, T(5200));
      later(() => {
        setBladeUp(true);
        setNote("Tap the blade to take it.");
      }, T(7400));
    }
    return () => ts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bladeUp) bladeRef.current?.focus({ preventScroll: true });
  }, [bladeUp]);

  const takeBlade = () => {
    setBladeUp(false);
    setNote("Emichō sinks into the steel, and the blade takes her light.");
    setEmi((e) => ({ ...e, dissolve: true }));
    if (!reducedMotion && rvRef.current && emiRef.current) {
      const er = emiRef.current.getBoundingClientRect();
      const rr = rvRef.current.getBoundingClientRect();
      const cx = er.left - rr.left + er.width / 2;
      const cy = er.top - rr.top + er.height / 2;
      const made = Array.from({ length: 16 }, (_, k) => ({
        k,
        left: cx + (Math.random() - 0.5) * 50,
        top: cy + (Math.random() - 0.5) * 40,
        dx: (Math.random() - 0.5) * rr.width * 0.28,
        dy: rr.height * 0.06 + Math.random() * rr.height * 0.06,
        delay: Math.random() * 0.6,
      }));
      setMotes(made);
      later(() => setMotes([]), 2400);
    }
    later(() => setAnoint("on"), T(500));
    later(() => {
      setEmi((e) => ({ ...e, on: false, dissolve: false }));
      talk("blade", () => {
        onTaken();
        setAnoint("set");
        setNote("Kenji lifts it from the stone. It is lighter than it looks.");
        setCloseup(true);
        later(
          () => closeRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" }),
          60,
        );
      });
    }, T(2200));
  };

  return (
    <div>
      <div className="d1-frame">
        <div className="d1-rv" ref={rvRef}>
          <div className={`d1-rv-cam${wide ? " wide" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="d1-rv-img" src={ART.shrineClosed} alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`d1-rv-img d1-rv-open${open ? " on" : ""}`}
              src={ART.shrineOpened}
              alt="The altar floor opened, with Hikariwake resting inside and sunrise breaking through the wall"
            />
            <div className={`d1-rv-glow${glow ? ` ${glow}` : ""}`} />
            <div className={`d1-rv-anoint${anoint ? ` ${anoint}` : ""}`} />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={emiRef}
            className={`d1-rv-emi${emi.on ? " on" : ""}${emi.dissolve ? " dissolve" : ""}`}
            src={ART.emicho}
            alt=""
            style={{ left: emi.left, top: emi.top }}
          />
          {motes.map((m) => (
            <span
              key={m.k}
              className="d1-mote"
              style={{ left: m.left, top: m.top, "--dx": `${m.dx}px`, "--dy": `${m.dy}px`, animationDelay: `${m.delay}s` }}
            />
          ))}
          {bladeUp && (
            <button ref={bladeRef} type="button" className="d1-rv-blade" aria-label="Take Hikariwake" onClick={takeBlade} />
          )}
        </div>
      </div>
      <p className="d1-note" aria-live="polite">
        {note}
      </p>
      {closeup && (
        <figure className="d1-closeup" ref={closeRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="anointed"
            src={ART.blade}
            alt="Hikariwake resting on its stone cradle, sheathed in black and gold"
          />
          <figcaption>
            <span className="d1-kicker">Received and anointed</span>
            <h3>Hikariwake</h3>
            <p>
              An ancient blade, older than the katana and nearly indestructible. Emichō&rsquo;s light now lives in the
              steel. It is tied to light, truth, and inheritance, and it has been waiting.
            </p>
          </figcaption>
        </figure>
      )}
      {closeup && (
        <div className="mt-6">
          <PlaqueButton nav size="lg" onClick={onNext}>
            Take up Hikariwake
          </PlaqueButton>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The level                                                           */
/* ------------------------------------------------------------------ */
export default function Day1({ reducedMotion, onMenu, onComplete, onPath }) {
  const RM = reducedMotion;
  const initial = useRef(null);
  if (initial.current === null) initial.current = loadDay1() || freshDay1();

  const [st, setSt] = useState(initial.current);
  const stRef = useRef(initial.current);
  const update = useCallback((patch) => {
    const next = typeof patch === "function" ? patch(stRef.current) : { ...stRef.current, ...patch };
    stRef.current = next;
    saveDay1(next);
    setSt(next);
  }, []);

  const timers = useRef([]);
  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);
  useEffect(() => {
    const ts = timers.current;
    return () => ts.forEach(clearTimeout);
  }, []);

  const scrollRef = useRef(null);
  const toTop = () => scrollRef.current?.scrollTo({ top: 0 });

  /* dialogue */
  const [talking, setTalking] = useState(null);
  const talkingRef = useRef(null);
  const talk = useCallback(
    (key, done, force = false) => {
      const cur = stRef.current;
      if (!SCRIPTS[key] || (!force && cur.seen && cur.seen[key])) {
        if (done) done();
        return;
      }
      if (!force) update((s) => ({ ...s, seen: { ...(s.seen || {}), [key]: true } }));
      const lines = SCRIPTS[key].filter((l) => !l.if || l.if(stRef.current));
      talkingRef.current = { lines, done: done || null };
      setTalking(talkingRef.current);
    },
    [update],
  );
  const endTalk = useCallback(() => {
    const t = talkingRef.current;
    talkingRef.current = null;
    setTalking(null);
    setFinSpeaker(null);
    if (t?.done) t.done();
  }, []);

  /* the opening shot */
  const [prelude, setPrelude] = useState(() => !initial.current.arrived);
  const [preOn, setPreOn] = useState(false);
  const [preLeaving, setPreLeaving] = useState(false);
  const [climbReady, setClimbReady] = useState(false);
  const climbRef = useRef(null);

  /* the room */
  const roomRef = useRef(null);
  const [rw, setRw] = useState(0);
  const [light, setLight] = useState({ x: 0.5, y: 0.8 });
  const lightRef = useRef(light);
  const [note, setNote] = useState(
    initial.current.found.length === FRAGS.length ? "All five found. The dial on the altar feels warm." : "",
  );
  const [roomDone, setRoomDone] = useState(initial.current.found.length === FRAGS.length);
  const [emi, setEmi] = useState({ on: false, left: "50%", top: "50%" });
  const idle = useRef(null);

  /* the seal / reveal */
  const [revealing, setRevealing] = useState(() => !!initial.current.revealed && sealSolved(initial.current.rot));
  const [confirmSlots, setConfirmSlots] = useState("");

  /* the leaving */
  const [finale, setFinale] = useState(false);
  const [finOn, setFinOn] = useState(false);
  const [finTitled, setFinTitled] = useState(false);
  const [finLeaving, setFinLeaving] = useState(false);
  // Who is speaking in the closing shot: when the Vashara watcher does, the
  // picture pans across to him (on a portrait screen, where it is cropped).
  const [finSpeaker, setFinSpeaker] = useState(null);

  const stage = st.stage || 1;
  const solved = sealSolved(st.rot);

  const go = (n) => {
    update({ stage: n });
    requestAnimationFrame(toTop);
    if (n === 2 && !sealSolved(stRef.current.rot)) later(() => talk("seal"), 250);
    if (n === 3) later(() => talk("pack"), 250);
  };

  /* ---- opening ---- */
  useEffect(() => {
    if (!prelude) return;
    let a = requestAnimationFrame(() => requestAnimationFrame(() => setPreOn(true)));
    const t = setTimeout(
      () =>
        talk("arrive", () => {
          setClimbReady(true);
        }),
      RM ? 300 : 3400,
    );
    return () => {
      cancelAnimationFrame(a);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prelude]);

  useEffect(() => {
    if (climbReady) climbRef.current?.querySelector("button")?.focus({ preventScroll: true });
  }, [climbReady]);

  const introEmichoBeat = useCallback(() => {
    // Emichō's first appearance: she rises beside the lantern before the search begins.
    if (stRef.current.met) return;
    update({ met: true });
    const l = lightRef.current;
    setEmi({ on: true, left: `${l.x * 100}%`, top: `${l.y * 100}%` });
    setNote("A pale light drifts out of the dark and settles by the lantern. Emichō. She has been waiting too.");
    later(() => setEmi((e) => ({ ...e, on: false })), RM ? 2500 : 5000);
  }, [update, later, RM]);

  const climb = () => {
    update({ arrived: true });
    setPreLeaving(true);
    later(
      () => {
        setPrelude(false);
        setPreOn(false);
        setPreLeaving(false);
        toTop();
        later(() => talk("intro", introEmichoBeat), 300);
      },
      RM ? 0 : 1300,
    );
  };

  // Returning mid-Day (already arrived): the room greets Kenji again.
  useEffect(() => {
    if (!initial.current.arrived || (initial.current.stage || 1) !== 1) return;
    const t = setTimeout(() => talk("intro", introEmichoBeat), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initial.current.arrived && initial.current.stage === 2 && !sealSolved(initial.current.rot)) {
      const t = setTimeout(() => talk("seal"), 400);
      return () => clearTimeout(t);
    }
    if (initial.current.arrived && initial.current.stage === 3) {
      const t = setTimeout(() => talk("pack"), 400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Day One is complete once it has been seen through to the end.
  useEffect(() => {
    if (initial.current.done && (initial.current.stage || 1) === 4) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- room: the lantern ---- */
  useLayoutEffect(() => {
    const el = roomRef.current;
    if (!el) return undefined;
    const measure = () => setRw(el.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stage]);

  const radius = () => (roomRef.current ? roomRef.current.clientWidth * 0.11 : 0);
  const moveLight = (x, y) => {
    const next = { x: clamp01(x), y: clamp01(y) };
    lightRef.current = next;
    setLight(next);
  };
  const isLit = (f) => {
    const el = roomRef.current;
    if (!el) return false;
    const l = lightRef.current;
    const dx = (f.x / 100 - l.x) * el.clientWidth;
    const dy = (f.y / 100 - l.y) * el.clientHeight;
    return Math.hypot(dx, dy) < radius() * 0.95;
  };

  const guide = useCallback(() => {
    const left = FRAGS.filter((f) => !stRef.current.found.includes(f.id));
    if (!left.length) return;
    const l = lightRef.current;
    let best = left[0];
    let bd = 9;
    left.forEach((f) => {
      const d = Math.hypot(f.x / 100 - l.x, f.y / 100 - l.y);
      if (d < bd) {
        bd = d;
        best = f;
      }
    });
    setEmi({ on: true, left: `${l.x * 100}%`, top: `${l.y * 100}%` });
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setEmi((e) => ({ ...e, left: `${best.x}%`, top: `${best.y}%` }))),
    );
    setNote("Emichō drifts ahead of you. Follow her light.");
  }, []);

  const resetIdle = useCallback(() => {
    clearTimeout(idle.current);
    setEmi((e) => (e.on ? { ...e, on: false } : e));
    if (stRef.current.found.length < FRAGS.length) idle.current = setTimeout(guide, 9000);
  }, [guide]);

  useEffect(() => {
    if (stage === 1 && !prelude) resetIdle();
    return () => clearTimeout(idle.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, prelude]);

  const finishRoom = () => {
    clearTimeout(idle.current);
    setEmi((e) => ({ ...e, on: false }));
    later(
      () =>
        talk("found", () => {
          setNote("All five found. The dial on the altar feels warm.");
          setRoomDone(true);
        }),
      1600,
    );
  };

  const tryPick = (f) => {
    const cur = stRef.current;
    if (cur.found.includes(f.id)) return;
    if (!isLit(f)) {
      setNote("Too dark to see. Bring the lantern closer.");
      return;
    }
    const found = [...cur.found, f.id];
    update({ found });
    setNote(f.text);
    resetIdle();
    if (found.length === FRAGS.length) finishRoom();
  };

  const onRoomMove = (e) => {
    const r = roomRef.current.getBoundingClientRect();
    moveLight((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  };
  const onRoomKey = (e) => {
    const s = 0.04;
    const k = e.key;
    const l = lightRef.current;
    if (k === "ArrowLeft") moveLight(l.x - s, l.y);
    else if (k === "ArrowRight") moveLight(l.x + s, l.y);
    else if (k === "ArrowUp") moveLight(l.x, l.y - s);
    else if (k === "ArrowDown") moveLight(l.x, l.y + s);
    else if (k === "Enter" || k === " ") {
      e.preventDefault();
      const f = FRAGS.find((fr) => !stRef.current.found.includes(fr.id) && isLit(fr));
      if (f) tryPick(f);
      else setNote("Nothing in the light here.");
      return;
    } else return;
    e.preventDefault();
  };

  const r = rw * 0.11;
  const lanternW = r * 0.7;

  /* ---- seal ---- */
  const turn = (i, d) => {
    if (sealSolved(stRef.current.rot)) return;
    update((s) => ({ ...s, rot: s.rot.map((v, j) => (j >= i ? v + d : v)) }));
  };
  const onSealClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const h = rect.width / 2;
    const d = Math.hypot(e.clientX - rect.left - h, e.clientY - rect.top - h) / h;
    if (d > 0.97 || d < 0.17) return;
    turn(d > 0.71 ? 0 : d > 0.447 ? 1 : 2, 1);
  };
  const marks = ["gate", "sun", "blade"].filter((n, i) => norm(st.rot[i], i) === 0);
  const sealHint = solved
    ? "The rings lock. Deep in the altar, something gives way."
    : marks.length
    ? `In place: the ${marks.join(" and the ")}.`
    : "Nothing rests under the notch yet.";

  /* ---- satchel ---- */
  const [packHint, setPackHint] = useState("");
  const toggle = (id) => {
    const it = itemById(id);
    const cur = stRef.current;
    if (it.locked) {
      setPackHint(it.omen);
      return;
    }
    const idx = cur.packed.indexOf(id);
    if (idx >= 0) {
      update({ packed: cur.packed.filter((p) => p !== id) });
      setPackHint(it.leave || `The ${it.name.toLowerCase()} goes back on the altar.`);
    } else if (cur.packed.length < SLOTS) {
      update({ packed: [...cur.packed, id] });
      setPackHint(`${it.name} packed.`);
    } else {
      setPackHint("The satchel is full. Tap something in it to set it back on the altar.");
    }
  };
  const leave = () => {
    const cur = stRef.current;
    const room = SLOTS - cur.packed.length;
    if (room > 0 && !cur.warned) {
      update({ warned: true });
      setPackHint(`There is still room for ${room} more. Tap Leave the shrine again to go anyway.`);
      return;
    }
    const next = {
      ...cur,
      done: true,
      left: DAY1_ITEMS.filter((i) => !cur.packed.includes(i.id)).map((i) => i.id),
    };
    stRef.current = next;
    saveDay1(next);
    setSt(next);
    writeJourney(next);
    onComplete();
    setFinale(true);
    setFinOn(false);
    setFinTitled(false);
    setFinLeaving(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setFinOn(true)));
    later(() => talk("end", () => setFinTitled(true), true), RM ? 300 : 3200);
  };
  const finContinue = () => {
    setFinLeaving(true);
    go(4);
    later(
      () => {
        setFinale(false);
        setFinOn(false);
        setFinTitled(false);
        setFinLeaving(false);
      },
      RM ? 0 : 1300,
    );
  };

  /* ---- begin again ---- */
  const restart = () => {
    const fresh = freshDay1();
    stRef.current = fresh;
    saveDay1(fresh);
    setSt(fresh);
    setNote("");
    setRoomDone(false);
    setRevealing(false);
    setPackHint("");
    moveLight(0.5, 0.8);
    setPrelude(true);
    setClimbReady(false);
    setPreOn(false);
    requestAnimationFrame(toTop);
  };

  const left = st.left || DAY1_ITEMS.filter((i) => !st.packed.includes(i.id)).map((i) => i.id);
  const fig = (id) => {
    const it = itemById(id);
    return (
      <figure key={id}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={it.img} alt="" />
        {it.name}
      </figure>
    );
  };

  /* ---- header copy per scene ---- */
  const HEAD = {
    1: { kanji: "探", title: "The Empty Room", lede: "The old shrine is quiet. Move the lantern to search the dark and tap what the light reveals. Five fragments are waiting." },
    2: { kanji: "印", title: "The Sun Seal", lede: "Three bronze rings turn on the altar dial. Turn each ring until the symbol the room pointed to rests directly under the notch. Turning a ring also turns the ones inside it." },
    3: { kanji: "荷", title: "Pack the Satchel", lede: "Kenji's satchel holds six things. The rice cakes and water gourd came with him on the walk here, and the quest scroll goes in now. Everything else waits on the altar. What he carries will help him on the road. What he leaves behind stays here, and getting it back later may cost him." },
    4: { kanji: "継", title: "What Day One Leaves Behind", lede: "" },
  }[stage];

  return (
    <div className="d1 absolute inset-0">
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto">
        <div className="qi-fade-enter mx-auto max-w-5xl px-5 pb-16 pt-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <PlaqueButton nav size="xs" onClick={onMenu}>
              &larr; Menu
            </PlaqueButton>
          </div>

          <header className="mt-6 text-center">
            <p className="d1-kicker">Stage One &middot; Day One: The Era of Inheritance</p>
            <h2 className="d1-title mt-2 text-2xl sm:text-4xl">{HEAD.title}</h2>
            <span
              aria-hidden="true"
              className="mt-1 block font-tribal text-2xl text-[var(--qi-gold)] sm:text-3xl"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.85), 0 0 16px rgba(214,166,75,0.4)" }}
            >
              {HEAD.kanji}
            </span>
          </header>

          {stage < 4 && (
            <ol className="d1-trail" aria-label="Day One steps">
              {STEPS.map((s, i) => (
                <li key={s} className={i + 1 < stage ? "done" : i + 1 === stage ? "now" : ""}>
                  <b>{i + 1}</b>
                  {s}
                </li>
              ))}
            </ol>
          )}

          {/* ---------------- 1: the lantern room ---------------- */}
          {stage === 1 && (
            <section aria-label="The empty room">
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              <div className="d1-frame">
                <div
                  ref={roomRef}
                  className="d1-room"
                  tabIndex={0}
                  aria-label="Dark room. Use arrow keys to move the lantern and Enter to pick up what is lit."
                  onPointerMove={onRoomMove}
                  onPointerDown={(e) => {
                    onRoomMove(e);
                    resetIdle();
                  }}
                  onKeyDown={onRoomKey}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="d1-walls" src={ART.shrineClosed} alt="" />
                  <div>
                    {FRAGS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        tabIndex={-1}
                        aria-label={f.name}
                        data-id={f.id}
                        className={`d1-frag${st.found.includes(f.id) ? " found" : ""}`}
                        style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}%` }}
                        onClick={() => tryPick(f)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={itemById(f.id).img} alt="" />
                      </button>
                    ))}
                  </div>
                  <div
                    className="d1-dark"
                    style={{
                      "--x": `${light.x * 100}%`,
                      "--y": `${light.y * 100}%`,
                      "--r1": `${r * 0.55}px`,
                      "--r2": `${r * 1.15}px`,
                    }}
                  />
                  <div
                    className="d1-lantern"
                    aria-hidden="true"
                    style={{
                      width: `${lanternW}px`,
                      left: `${light.x * 100}%`,
                      top: `${light.y * (roomRef.current ? roomRef.current.clientHeight : 0) - r * 0.35}px`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ART.lantern} alt="" />
                  </div>
                  <div className={`d1-emi${emi.on ? " on" : ""}`} aria-hidden="true" style={{ left: emi.left, top: emi.top }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ART.emicho} alt="" />
                  </div>
                </div>
              </div>
              <ul className="d1-found">
                {FRAGS.map((f) => (
                  <li key={f.id} className={st.found.includes(f.id) ? "got" : ""}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={itemById(f.id).img} alt="" />
                    {f.name}
                    {f.clue && st.found.includes(f.id) && (
                      <span className="d1-cluetag" title="A clue for the dial">
                        clue
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="d1-note" aria-live="polite">
                {note}
              </p>
            </section>
          )}

          {/* ---------------- 2: the sun seal, then the altar ---------------- */}
          {stage === 2 && (
            <section aria-label="The sun seal">
              {!revealing && (
                <>
                  <p className="d1-lede mx-auto mb-5 text-center">{HEAD.lede}</p>
                  <div className="d1-clues" aria-label="What the room told Kenji">
                    {CLUES.map((c) => (
                      <div key={c.id} className={`d1-clue${norm(st.rot[c.ring], c.ring) === 0 ? " set" : ""}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.glyph} alt={`${c.name}, as carved on the ring`} />
                        <p>
                          <span className="d1-kicker">{c.from}</span>
                          {c.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="d1-sealwrap">
                    <div className="d1-frame">
                      <div className="d1-sealstage" style={{ "--seal-bg": `url(${ART.sealBackdrop})` }}>
                        <div className="d1-seal" role="img" aria-label="Bronze sun seal with three turning rings" onClick={onSealClick}>
                          {[ART.ringGate, ART.ringSun, ART.ringBlade].map((src, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={src}
                              className="layer d1-ring"
                              src={src}
                              alt=""
                              style={{ transform: `rotate(${st.rot[i] * SEAL_STEP[i] + SEAL_OFFSET[i]}deg)` }}
                            />
                          ))}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className={`layer d1-core${solved ? " lit" : ""}`} src={ART.sealCenter} alt="" />
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className="layer d1-notch" src={ART.sealNotch} alt="" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="d1-ringbtns">
                        {["Gate ring", "Sun ring", "Blade ring"].map((label, i) => (
                          <div key={label} className="d1-ringrow">
                            <span>{label}</span>
                            <button
                              type="button"
                              className="d1-turn"
                              disabled={solved}
                              aria-label={`Turn ${label.toLowerCase()} left`}
                              onClick={() => turn(i, -1)}
                            >
                              &#8634;
                            </button>
                            <button
                              type="button"
                              className="d1-turn"
                              disabled={solved}
                              aria-label={`Turn ${label.toLowerCase()} right`}
                              onClick={() => turn(i, 1)}
                            >
                              &#8635;
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="d1-hint mt-4" aria-live="polite">
                        {sealHint}
                      </p>
                      {solved && (
                        <div className="qi-fade-enter mt-4">
                          <PlaqueButton nav size="lg" onClick={() => setRevealing(true)}>
                            Watch the altar
                          </PlaqueButton>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              {revealing && (
                <AltarReveal
                  already={!!st.revealed}
                  reducedMotion={RM}
                  talk={talk}
                  onTaken={() => update({ revealed: true })}
                  onNext={() => go(3)}
                />
              )}
            </section>
          )}

          {/* ---------------- 3: the satchel ---------------- */}
          {stage === 3 && (
            <section aria-label="Pack the satchel">
              <p className="d1-lede mx-auto mb-2 text-center">{HEAD.lede}</p>
              <p className="d1-sub">In the satchel</p>
              <div className="d1-slots" aria-label="Satchel slots">
                {Array.from({ length: SLOTS }, (_, i) => {
                  const id = st.packed[i];
                  if (!id) {
                    return <button key={i} type="button" className="d1-slot" disabled aria-label="Empty slot" />;
                  }
                  const it = itemById(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      className="d1-slot full"
                      aria-label={it.locked ? `${it.name}, must stay` : `Take out ${it.name}`}
                      onClick={() => toggle(id)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.img} alt="" />
                      {it.name}
                    </button>
                  );
                })}
              </div>
              <p className="d1-sub">On the altar</p>
              <div className="d1-items">
                {DAY1_ITEMS.filter((it) => !it.locked).map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    className="d1-item"
                    aria-pressed={st.packed.includes(it.id)}
                    onClick={() => toggle(it.id)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.img} alt="" />
                    <div>
                      <strong>{it.name}</strong>
                      <span>{it.desc}</span>
                      <em>{it.omen}</em>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <PlaqueButton nav size="xl" onClick={leave}>
                  Leave the shrine
                </PlaqueButton>
                <span className="d1-hint" aria-live="polite">
                  {packHint}
                </span>
              </div>
            </section>
          )}

          {/* ---------------- 4: the summary ---------------- */}
          {stage === 4 && (
            <section aria-label="Day One complete" className="qi-fade-enter qi-panel d1-scroll rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kenji-game/poses/round-complete.webp"
                alt="Kenji, head bowed, hands pressed together in quiet acknowledgment"
                className="qi-item-glow mx-auto w-28 sm:w-36"
              />
              <p className="d1-kicker mt-3 text-center">Stage One complete</p>
              <p className="mt-3 leading-relaxed text-[var(--qi-ivory)]/90">
                Day One is ended. What was handed down has been received: a blade, a map, a handful of things worth
                carrying. Kenji steps out of the shrine owning more than he came for, and owing more than he knows.
                The scroll points inland, toward the watched city of Kosei.
              </p>
              <dl>
                <dt>Blade</dt>
                <dd>Hikariwake</dd>
                <dt>Guide</dt>
                <dd>The quest scroll, and Emichō, whose light now lives in the blade</dd>
                <dt>In the satchel</dt>
                <dd>
                  <div className="d1-endlist">{st.packed.map(fig)}</div>
                </dd>
                <dt>Left in the shrine</dt>
                <dd>
                  {left.length ? (
                    <>
                      <div className="d1-endlist">{left.map(fig)}</div>
                      <p className="d1-hint mt-2">What stays behind is not lost for good. Finding it again may cost something.</p>
                    </>
                  ) : (
                    "Nothing. Kenji carries it all."
                  )}
                </dd>
                <dt>Next</dt>
                <dd>
                  Day Two: The Era of Proof
                  <br />
                  <span className="text-sm text-[var(--qi-ivory)]/60">Stage Two. The Warden City of Kosei</span>
                  <br />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--qi-gold)]">Coming Soon</span>
                </dd>
              </dl>
              <p className="mt-4 text-sm italic text-[var(--qi-ivory)]/60">
                Every item is written into The Legend, with what it will do for Kenji, or what its absence will cost.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
                <PlaqueButton nav size="xl" onClick={onPath}>
                  Return to the Path &rarr;
                </PlaqueButton>
                <button
                  type="button"
                  onClick={restart}
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--qi-ivory)]/55 underline-offset-4 hover:text-[var(--qi-gold)] hover:underline"
                >
                  Begin Day One again
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ---------------- the approach: opening shot ---------------- */}
      {prelude && (
        <section className={`d1-shot${preOn ? " on" : ""}${preLeaving ? " leaving" : ""}`} aria-label="Day One opening">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="d1-shot-img"
            src={ART.approach}
            alt="Kenji climbs the overgrown steps toward an old shrine hung with faded sun banners"
          />
          <div className="d1-shot-shade" />
          <div className="d1-shot-title">
            <p className="d1-kicker">Stage One</p>
            <h1>Day One</h1>
            <p className="dayname">The Era of Inheritance</p>
            <p className="era">
              In the Reach, a Day is not counted by the sun. It is an era, and it ends only when its work is done. The
              first is the era of inheritance: everything Kenji is given before he knows what it costs.
            </p>
            <div ref={climbRef} className={`d1-reveal-btn${climbReady ? " show" : ""}`}>
              <PlaqueButton nav size="xl" disabled={!climbReady} onClick={climb}>
                Climb the steps
              </PlaqueButton>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- the leaving: closing shot ---------------- */}
      {finale && (
        <section
          className={`d1-shot d1-finale${finOn ? " on" : ""}${finTitled ? " titled" : ""}${finLeaving ? " leaving" : ""}${finSpeaker === "watcher" ? " watch" : ""}`}
          aria-label="Day One closing"
        >
          <div className="d1-shot-img">
            {/* The picture and the lens flare on the hilt of Kenji's sword
                share one box (the picture's own size), so the flare stays
                put on the hilt however the shot is cropped or panned. */}
            <div className="d1-pan">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="d1-shot-fill"
                src={ART.closing}
                alt="At sunset, a Vashara in a red-lined hat watches from the brush as Kenji walks away from the broken shrine"
              />
              <span className="d1-flare" aria-hidden="true" style={{ left: "87.6%", top: "57.5%" }}>
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>
          <div className="d1-shot-shade" />
          <div className="d1-shot-title">
            <p className="d1-kicker">Stage One complete</p>
            <div className="d1-fin-head">
              <h1>The era of inheritance closes</h1>
              <span className="d1-kan" lang="ja" role="img" aria-label="Complete (kan)">
                完
              </span>
            </div>
            <PlaqueButton nav size="xl" className="d1-fin-continue" onClick={finContinue}>
              Continue
            </PlaqueButton>
            <p className="era d1-watch">Someone was watching when the wall came down.</p>
          </div>
        </section>
      )}

      {roomDone && stage === 1 && !talking && !prelude && (
        <div className="d1-approach">
          <p>The dial on the altar has gone warm.</p>
          <PlaqueButton nav size="xl" onClick={() => go(2)}>
            Approach the door
          </PlaqueButton>
        </div>
      )}

      {talking && (
        <Dialogue
          lines={talking.lines}
          reducedMotion={RM}
          onDone={endTalk}
          onLine={finale ? setFinSpeaker : undefined}
        />
      )}
    </div>
  );
}
