"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PlaqueButton from "./PlaqueButton";
import Dialogue from "./Dialogue";
import Glyphs from "./Glyphs";
import Song from "./Song";
import { fmtTime, rand } from "./ledger-engine";
import { newVerse, sentence } from "./day3-engine";
import { RANKS } from "./day2-data";
import {
  ART3,
  CAST3,
  HEAD3,
  POR3,
  SCENES3,
  SCRIPTS3,
  SIGNS,
  SIGN_NO,
  STEPS3,
  STONE_NAMES,
  STORY_VERSES,
  VERSE_POOL,
} from "./day3-data";
import {
  freshDay3,
  itemById,
  loadBest3,
  loadDay3,
  recordBest3,
  saveDay3,
  writeJourney3,
} from "@/lib/kenjiJourney";
import "./day1.css";
import "./day2.css";
import "./day3.css";

const itemName = (id) => itemById(id)?.name || id;
const NOTES_WITH_FLUTE = 5;
const NOTES_WITHOUT = 3;

/* ------------------------------------------------------------------ */
/* The level: the glyph gate at the edge of Naomori, the crossing,    */
/* the naming tree and its song, and Daigo at the end.                */
/* ------------------------------------------------------------------ */
export default function Day3({ reducedMotion, onMenu, onComplete, onPath, reviewApi }) {
  const RM = reducedMotion;
  const initial = useRef(null);
  if (initial.current === null) initial.current = loadDay3() || freshDay3();

  const [d, setD] = useState(initial.current);
  const dRef = useRef(initial.current);
  const update = useCallback((patch) => {
    const next = typeof patch === "function" ? patch(dRef.current) : { ...dRef.current, ...patch };
    dRef.current = next;
    saveDay3(next);
    setD(next);
    return next;
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
  const has = (id) => d.inv.includes(id);

  /* ---- the Day count ---- */
  const setKday = (n) => {
    if (n > dRef.current.kday) update({ kday: Math.min(7, n) });
  };

  /* ---- dialogue ---- */
  const [talking, setTalking] = useState(null);
  const talkingRef = useRef(null);
  const talk = useCallback(
    (key, done, force = false) => {
      const cur = dRef.current;
      if (!SCRIPTS3[key] || (!force && cur.seen && cur.seen[key])) {
        if (done) done();
        return;
      }
      if (!force) update((s) => ({ ...s, seen: { ...(s.seen || {}), [key]: true } }));
      // A line that asks a question stores the answer as soon as it is picked,
      // so the lines after it can depend on it.
      const lines = SCRIPTS3[key].map((l) => (l.choices ? { ...l, pick: (o) => update({ answered: o.set }) } : l));
      if (!lines.some((l) => !l.if || l.if(dRef.current))) {
        if (done) done();
        return;
      }
      talkingRef.current = { lines, done: done || null, id: Date.now() + Math.random() };
      setTalking(talkingRef.current);
    },
    [update],
  );
  const endTalk = useCallback(() => {
    const t = talkingRef.current;
    talkingRef.current = null;
    setTalking(null);
    if (t?.done) t.done();
  }, []);

  /* ---- shots: the arrival, the leaving ---- */
  const [prelude, setPrelude] = useState(() => !initial.current.arrived);
  const [preOn, setPreOn] = useState(false);
  const [preLeaving, setPreLeaving] = useState(false);
  const [enterReady, setEnterReady] = useState(false);
  const enterRef = useRef(null);
  const [finale, setFinale] = useState(false);
  const [finOn, setFinOn] = useState(false);
  const [finTitled, setFinTitled] = useState(false);
  const [finLeaving, setFinLeaving] = useState(false);

  const stage = d.stage || 1;
  const paused = !!talking || prelude || finale;

  const verseApi = useRef(null);
  const songApi = useRef(null);
  const crossApi = useRef(null);

  const go = (n) => {
    update({ stage: n });
    requestAnimationFrame(toTop);
    if (n === 3) writeJourney3(dRef.current);
  };

  /* ---- arrival ---- */
  useEffect(() => {
    if (!prelude) return undefined;
    const a = requestAnimationFrame(() => requestAnimationFrame(() => setPreOn(true)));
    const t = setTimeout(() => talk("d3_arrive", () => setEnterReady(true)), RM ? 300 : 3400);
    return () => {
      cancelAnimationFrame(a);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prelude]);

  useEffect(() => {
    if (enterReady) enterRef.current?.querySelector("button")?.focus({ preventScroll: true });
  }, [enterReady]);

  const enterNaomori = () => {
    update({ arrived: true });
    setPreLeaving(true);
    later(
      () => {
        setPrelude(false);
        setPreOn(false);
        setPreLeaving(false);
        setEnterReady(false);
        toTop();
        later(() => talk("d3_enter"), 300);
      },
      RM ? 0 : 1300,
    );
  };

  // The inscription in progress: make it when the gate needs one.
  useEffect(() => {
    if (!d.arrived || stage !== 1 || d.stone >= 3) return;
    if (!d.vz || d.vz.text !== STORY_VERSES[d.stone]) update({ vz: newVerse(STORY_VERSES[d.stone], d.rank) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.arrived, stage, d.stone, d.vz]);

  // Coming back mid-Day: pick the scene up again.
  useEffect(() => {
    const cur = initial.current;
    if (cur.arrived && (cur.stage || 1) === 1 && !(cur.seen && cur.seen.d3_enter)) later(() => talk("d3_enter"), 500);
    // closed the page on a finished inscription: on to the next
    if (cur.vz && cur.vz.solvedAt && cur.stone < 3) update({ stone: cur.stone + 1, vz: null });
    if (cur.done && (cur.stage || 1) >= 3) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- the glyph gate ---- */
  const onVerseSolve = (s) => {
    const cur = dRef.current;
    const i = cur.stone;
    const times = [...cur.times];
    times[i] = s;
    update({ times });
    setKday(i + 2);
    // a moment on the finished verse, then the next inscription
    later(() => update((x) => ({ ...x, stone: i + 1, vz: null })), RM ? 400 : 1700);
  };
  const onChangeVerse = () => saveDay3(dRef.current);

  const readAloud = () => talk("d3_read", () => update({ read: true }), true);

  const afterCross = () => {
    setKday(4);
    talk("d3_gate", () =>
      talk("d3_name", () => {
        if (dRef.current.answered === null) update({ answered: false });
        talk("d3_spring", () => {
          if (dRef.current.inv.includes("gourd")) update({ watered: true });
          setKday(5);
          go(2);
        });
      }),
    );
  };

  /* ---- the crossing ---- */
  const [signMsg, setSignMsg] = useState("");
  const [walkMsg, setWalkMsg] = useState("");
  const [whisper, setWhisper] = useState(false);
  const walk = useRef({ prog: 0, holding: false, last: 0, raf: 0, whispered: false });
  const fillRef = useRef(null);
  const walkBtn = useRef(null);
  const [walkDone, setWalkDone] = useState(false);

  const pickSign = (k) => {
    if (k === "medallion") {
      setSignMsg("The glyphs on the pillars brighten, one line at a time.");
      later(() => {
        update({ cross: 1 });
        setSignMsg("");
      }, RM ? 300 : 1400);
      return;
    }
    setSignMsg(SIGN_NO[k]);
  };

  const finishWalk = () => {
    const w = walk.current;
    w.holding = false;
    setWhisper(false);
    setWalkDone(true);
    setWalkMsg("Kenji passes beneath the beam without a word.");
    update({ cross: 2, crossed: true });
    later(afterCross, RM ? 300 : 1100);
  };
  const walkTick = (t) => {
    const w = walk.current;
    if (!w.holding) return;
    const DUR = RM ? 2500 : 5200;
    w.prog = Math.min(1, w.prog + (t - w.last) / DUR);
    w.last = t;
    if (fillRef.current) fillRef.current.style.width = `${w.prog * 100}%`;
    if (!w.whispered && w.prog > 0.42) {
      w.whispered = true;
      setWhisper(true);
      later(() => setWhisper(false), RM ? 1500 : 2600);
    }
    if (w.prog >= 1) {
      finishWalk();
      return;
    }
    w.raf = requestAnimationFrame(walkTick);
  };
  const startWalk = (e) => {
    if (e) e.preventDefault();
    const w = walk.current;
    if (walkDone || w.holding) return;
    w.holding = true;
    w.last = performance.now();
    setWalkMsg("");
    w.raf = requestAnimationFrame(walkTick);
  };
  const stopWalk = () => {
    const w = walk.current;
    if (!w.holding) return;
    w.holding = false;
    cancelAnimationFrame(w.raf);
    if (w.prog < 1) setWalkMsg("Kenji stops beneath the beam, listening. Hold again to keep walking.");
  };
  const answerWalk = () => {
    const w = walk.current;
    w.holding = false;
    cancelAnimationFrame(w.raf);
    w.prog = 0;
    w.whispered = false;
    if (fillRef.current) fillRef.current.style.width = "0%";
    setWhisper(false);
    setWalkMsg("Kenji answered. The glyphs dim, and the path beyond the gate fades into mist. He steps back. The gate asked for silence.");
  };
  useEffect(() => {
    const w = walk.current;
    return () => cancelAnimationFrame(w.raf);
  }, []);
  useEffect(() => {
    crossApi.current = {
      complete() {
        if (dRef.current.cross === 0) update({ cross: 1 });
        else if (!walkDone) finishWalk();
      },
    };
  });

  /* ---- Namonoki's song ---- */
  const onSongProgress = (n) => {
    if (dRef.current.longest < n) update({ longest: n });
  };
  const onSongDone = (n) => {
    update({ songDone: true, longest: Math.max(dRef.current.longest, n) });
    setKday(6);
    later(() => talk("d3_open"), 1200);
  };
  const pickRank = (rank) => {
    update({ rank });
  };

  /* ---- leaving Naomori ---- */
  const runFinale = () => {
    setFinale(true);
    setFinOn(false);
    setFinTitled(false);
    setFinLeaving(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setFinOn(true)));
    later(() => setFinTitled(true), RM ? 300 : 2600);
  };
  const followPath = () => {
    setKday(7);
    talk("d3_daigo", runFinale);
  };
  const finContinue = () => {
    setFinLeaving(true);
    update({ done: true });
    writeJourney3(dRef.current);
    onComplete();
    go(3);
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

  const restart = () => {
    const fresh = freshDay3();
    dRef.current = fresh;
    saveDay3(fresh);
    setD(fresh);
    setSignMsg("");
    setWalkMsg("");
    setWalkDone(false);
    walk.current = { prog: 0, holding: false, last: 0, raf: 0, whispered: false };
    setPrelude(true);
    setPreOn(false);
    setEnterReady(false);
    requestAnimationFrame(toTop);
  };

  /* ---- practice ---- */
  const [practice, setPractice] = useState(null); // { kind: 'verse'|'song', ... }
  const [pnote, setPnote] = useState("");
  const newPracticeVerse = () => {
    setPnote("");
    setPractice({ kind: "verse", id: Date.now(), state: newVerse(VERSE_POOL[rand(VERSE_POOL.length)], dRef.current.rank) });
  };
  const newPracticeSong = () => {
    setPnote("");
    setPractice({ kind: "song", id: Date.now() });
  };

  /* ---- review tools (local build only) ---- */
  useEffect(() => {
    if (!reviewApi) return undefined;
    reviewApi.current = {
      skip() {
        if (talkingRef.current) {
          endTalk();
          return true;
        }
        return false;
      },
      solve() {
        const cur = dRef.current;
        if (cur.stage === 1 && cur.stone >= 3 && cur.read && !cur.crossed) crossApi.current?.complete();
        else if (cur.stage === 1 && cur.stone >= 3 && !cur.read) readAloud();
        else if (cur.stage === 2) songApi.current?.solve();
        else verseApi.current?.solve();
      },
      flute() {
        const cur = dRef.current;
        if (!cur.inv.includes("flute")) update({ inv: [...cur.inv, "flute"] });
      },
      talk(key) {
        talk(key, null, true);
      },
      enter() {
        if (prelude && enterReady) enterNaomori();
      },
      finish() {
        if (finale && finTitled) finContinue();
      },
      closing() {
        runFinale();
      },
    };
    return () => {
      reviewApi.current = null;
    };
  });

  /* ---- render helpers ---- */
  const HEAD = HEAD3[stage];
  const fig = (id) => (
    <figure key={id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={itemById(id).img} alt="" />
      {itemName(id)}
    </figure>
  );
  const best = loadBest3();
  const notes = has("flute") ? NOTES_WITH_FLUTE : NOTES_WITHOUT;
  const incense = has("incense") && has("flint") ? () => Math.max(0, 3 - dRef.current.incense) : null;

  const ranks = (onPick) => (
    <div className="d2-ranks" role="radiogroup" aria-label="Rank">
      {Object.entries(RANKS).map(([k, r]) => (
        <button key={k} type="button" role="radio" aria-checked={d.rank === k} className="d2-ghost" onClick={() => onPick(k)}>
          {r.label}
        </button>
      ))}
    </div>
  );

  const gateLines = (cls) =>
    STORY_VERSES.map((v, k) => (
      <p key={v} className={cls} style={{ animationDelay: `${k * 0.9}s` }}>
        {sentence(v)}
      </p>
    ));

  const progLine =
    stage === 1
      ? d.crossed
        ? "The gate is crossed"
        : d.stone >= 3
        ? d.read
          ? "The crossing"
          : "The gate, translated"
        : `${STONE_NAMES[d.stone]}, inscription ${d.stone + 1} of 3`
      : "";

  const renderGate = () => {
    if (d.stone < 3) {
      return d.vz && d.vz.text === STORY_VERSES[d.stone] ? (
        <Glyphs
          key={d.vz.id}
          state={d.vz}
          incense={incense}
          onUseIncense={() => update({ incense: dRef.current.incense + 1 })}
          paused={paused}
          apiRef={verseApi}
          onChange={onChangeVerse}
          onSolve={onVerseSolve}
        />
      ) : null;
    }
    if (d.crossed) {
      return (
        <div className="d3-readout">
          <p className="d3-gr-k">Naomori</p>
          {gateLines("d3-gr-l")}
          {!talking && (
            <div className="qi-fade-enter mt-5">
              <PlaqueButton nav size="lg" onClick={afterCross}>
                Walk deeper into Naomori
              </PlaqueButton>
            </div>
          )}
        </div>
      );
    }
    if (!d.read) {
      return (
        <div className="d3-readout">
          <p className="d3-gr-k">The gate reads</p>
          {gateLines("d3-gr-l")}
          <div className="mt-5">
            <PlaqueButton nav size="lg" onClick={readAloud}>
              Read it aloud
            </PlaqueButton>
          </div>
        </div>
      );
    }
    if ((d.cross || 0) === 0) {
      return (
        <div className="d3-cross">
          <p className="d3-cross-k">“Carry the sign of those who raised you.”</p>
          <p className="d3-cross-t">What does Kenji raise before the gate?</p>
          <div className="d3-opts">
            {SIGNS.map(([k, t]) => (
              <button key={k} type="button" className="d3-opt" onClick={() => pickSign(k)}>
                {t}
              </button>
            ))}
          </div>
          <p className="d3-vmsg" aria-live="polite">
            {signMsg}
          </p>
        </div>
      );
    }
    return (
      <div className="d3-cross">
        <p className="d3-cross-k">“Pass beneath the gate in silence.”</p>
        <p className="d3-cross-t">Press and hold to walk. Whatever you hear, say nothing.</p>
        <div className="d3-walk" aria-hidden="true">
          <div className="d3-walk-fill" ref={fillRef} />
        </div>
        <div className="d2-row">
          <button
            ref={walkBtn}
            type="button"
            className="d3-go d3-walkbtn"
            disabled={walkDone}
            onPointerDown={startWalk}
            onPointerUp={stopWalk}
            onPointerLeave={stopWalk}
            onPointerCancel={stopWalk}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter") && !e.repeat) startWalk(e);
            }}
            onKeyUp={(e) => {
              if (e.key === " " || e.key === "Enter") stopWalk();
            }}
          >
            Hold to walk beneath
          </button>
          {whisper && (
            <span className="d3-whisper">
              <span>“Kenji?” someone calls from just beyond the gate.</span>{" "}
              <button type="button" className="d2-ghost" onClick={answerWalk}>
                Answer
              </button>
            </span>
          )}
        </div>
        <p className="d3-vmsg" aria-live="polite">
          {walkMsg}
        </p>
      </div>
    );
  };

  return (
    <div className="d1 d2 d3 absolute inset-0">
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto">
        <div className="qi-fade-enter mx-auto max-w-5xl px-5 pb-16 pt-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <PlaqueButton nav size="xs" onClick={onMenu}>
              &larr; Menu
            </PlaqueButton>
          </div>

          <header className="mt-6 text-center">
            <p className="d1-kicker">Stage Three &middot; Day Three: The Era of Listening</p>
            <h2 className="d1-title mt-2 text-2xl sm:text-4xl">{HEAD.title}</h2>
            <span
              aria-hidden="true"
              className="mt-1 block font-tribal text-2xl text-[var(--qi-gold)] sm:text-3xl"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.85), 0 0 16px rgba(214,166,75,0.4)" }}
            >
              {HEAD.kanji}
            </span>
            <p className="d2-kday">Five days on the road. Day {d.kday} of 7 in Naomori.</p>
          </header>

          {stage < 3 && (
            <ol className="d1-trail" aria-label="Day Three steps">
              {STEPS3.map((s, i) => (
                <li key={s} className={i + 1 < stage ? "done" : i + 1 === stage ? "now" : ""}>
                  <b>{i + 1}</b>
                  {s}
                </li>
              ))}
            </ol>
          )}

          {/* ---------------- 1: the glyph gate ---------------- */}
          {stage === 1 && (
            <section aria-label="The glyph gate">
              <div className="d1-frame mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="d3-hero"
                  src={ART3.glyphs}
                  alt="Kenji climbs toward a great torii whose pillars are carved top to bottom in the old script"
                />
              </div>
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              <p className="d2-prog">{progLine}</p>
              <div className="d3-host d3-host--gate">{renderGate()}</div>
            </section>
          )}

          {/* ---------------- 2: Namonoki's song ---------------- */}
          {stage === 2 && (
            <section aria-label="Namonoki's song">
              <div className="d1-frame mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="d3-hero"
                  src={ART3.tree}
                  alt="Kenji stands before the sacred tree, a great face carved into its trunk, the torii at the top of the stairs still dark"
                />
              </div>
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              {!d.songDone && ranks(pickRank)}
              <div className="d3-host d3-host--song">
                {d.songDone ? (
                  <p className="d3-song-msg">The phrase is complete. The roots have drawn back from the path.</p>
                ) : (
                  <Song
                    key={d.rank}
                    rank={d.rank}
                    notes={notes}
                    forgive={!!d.watered}
                    blocked={!!talking}
                    apiRef={songApi}
                    onProgress={onSongProgress}
                    onDone={onSongDone}
                  />
                )}
              </div>
              {d.songDone && !talking && (
                <div className="qi-fade-enter mt-6">
                  <PlaqueButton nav size="lg" onClick={followPath}>
                    Follow the open path
                  </PlaqueButton>
                </div>
              )}
            </section>
          )}

          {/* ---------------- 3: the summary ---------------- */}
          {stage === 3 && (
            <section aria-label="Day Three complete" className="qi-fade-enter qi-panel d1-scroll rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kenji-game/poses/round-complete.webp"
                alt="Kenji, head bowed, hands pressed together in quiet acknowledgment"
                className="qi-item-glow mx-auto w-28 sm:w-36"
              />
              <p className="d1-kicker mt-3 text-center">Stage Three complete</p>
              <span className="d1-kan d1-kan--sm" lang="ja" role="img" aria-label="Complete (kan)">
                完
              </span>
              <p className="mt-3 leading-relaxed text-[var(--qi-ivory)]/90">
                Day Three is ended. Kenji came to Naomori expecting a path. He found a gate that would only open to someone
                willing to read it, a forest that would only open to someone willing to listen, and an ancient tree that knew
                him better than he knows himself.
              </p>
              <dl>
                <dt>The glyph gate</dt>
                <dd>
                  {STORY_VERSES.map((v, k) => (
                    <span key={v}>
                      {sentence(v)}
                      {k < STORY_VERSES.length - 1 ? <br /> : null}
                    </span>
                  ))}
                  <br />
                  <span className="d1-hint">Times: {d.times.map(fmtTime).join(", ")}</span>
                </dd>
                <dt>The song</dt>
                <dd>
                  Longest phrase: {d.longest} beats
                  <br />
                  <span className="d1-hint">
                    Rank: {RANKS[d.rank].label}
                    {d.watered ? " · the gourd’s water given to the spring" : ""}
                  </span>
                </dd>
                <dt>The voice in Naomori</dt>
                <dd>
                  {d.answered
                    ? "Kenji answered. Whoever was listening heard him."
                    : "Kenji kept silent, and heard a second name: Daigo."}
                </dd>
                <dt>Time in Naomori</dt>
                <dd>Seven days</dd>
                <dt>In the satchel</dt>
                <dd>
                  <div className="d1-endlist">{d.inv.map(fig)}</div>
                </dd>
                <dt>Next</dt>
                <dd>
                  Day Four: The Era of Perspective
                  <br />
                  <span className="text-sm text-[var(--qi-ivory)]/60">Seven days on the road to the Nest Cliffs</span>
                  <br />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--qi-gold)]">Coming Soon</span>
                </dd>
              </dl>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
                <PlaqueButton nav size="xl" onClick={onPath}>
                  Return to the Path &rarr;
                </PlaqueButton>
                <PlaqueButton
                  nav
                  size="sm"
                  dim
                  onClick={() => {
                    update({ stage: 4 });
                    setPractice(null);
                    setPnote("");
                    requestAnimationFrame(toTop);
                  }}
                >
                  Practice in the grove
                </PlaqueButton>
                <button
                  type="button"
                  onClick={restart}
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--qi-ivory)]/55 underline-offset-4 hover:text-[var(--qi-gold)] hover:underline"
                >
                  Begin Day Three again
                </button>
              </div>
            </section>
          )}

          {/* ---------------- 4: practice ---------------- */}
          {stage === 4 && (
            <section aria-label="Practice in the grove">
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              {ranks((k) => {
                update({ rank: k });
                if (practice) setPractice(null);
              })}
              <div className="d2-row mt-4">
                <PlaqueButton nav size="sm" onClick={newPracticeVerse}>
                  New verse
                </PlaqueButton>
                <PlaqueButton nav size="sm" dim onClick={newPracticeSong}>
                  Endless phrase
                </PlaqueButton>
                <PlaqueButton nav size="xs" dim onClick={() => go(3)}>
                  Back to summary
                </PlaqueButton>
              </div>
              <p className="d1-hint mt-3">
                Best verse times:{" "}
                {Object.entries(RANKS)
                  .map(([k, r]) => `${r.label} ${fmtTime(best[`v_${k}`])}`)
                  .join(" · ")}
                . Longest endless phrase: {best.song || 0} beats.
              </p>
              {practice && practice.kind === "verse" && (
                <div className="d3-host d3-host--gate mt-4">
                  <Glyphs
                    key={practice.id}
                    state={practice.state}
                    incense={null}
                    paused={paused}
                    apiRef={verseApi}
                    onChange={() => {}}
                    onSolve={(s) => {
                      const b = recordBest3(`v_${practice.state.rank}`, s, true);
                      setPnote(`Read in ${fmtTime(s)}. Best ${RANKS[practice.state.rank].label} time: ${fmtTime(b)}.`);
                    }}
                  />
                  {pnote ? <p className="d2-msg mt-3">{pnote}</p> : null}
                </div>
              )}
              {practice && practice.kind === "song" && (
                <div className="d3-host d3-host--song mt-4">
                  <Song
                    key={practice.id + d.rank}
                    rank={d.rank}
                    notes={NOTES_WITH_FLUTE}
                    endless
                    blocked={!!talking}
                    onProgress={(n) => recordBest3("song", n)}
                    onDone={() => {}}
                  />
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {/* ---------------- the approach: the torii path ---------------- */}
      {prelude && (
        <section className={`d1-shot d3-prelude${preOn ? " on" : ""}${preLeaving ? " leaving" : ""}`} aria-label="Day Three opening">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="d1-shot-img"
            src={ART3.prelude}
            alt="Kenji walks a lantern-lit stone path toward a vine-covered torii, enormous trees and waterfalls beyond; a dark figure crouches in the ferns at the left"
          />
          <div className="d1-shot-shade" />
          <div className="d1-shot-title">
            <p className="d1-kicker">Stage Three</p>
            <h1>Day Three</h1>
            <p className="dayname">The Era of Listening</p>
            <p className="era">
              Five days on the road. Naomori, the forest of the True Name, is not abandoned. It is listening.
            </p>
            <div ref={enterRef} className={`d1-reveal-btn${enterReady ? " show" : ""}`}>
              <PlaqueButton nav size="xl" disabled={!enterReady} onClick={enterNaomori}>
                Enter Naomori
              </PlaqueButton>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- the leaving: the path climbs ---------------- */}
      {finale && (
        <section
          className={`d1-shot d1-finale d3-finale${finOn ? " on" : ""}${finTitled ? " titled" : ""}${finLeaving ? " leaving" : ""}`}
          aria-label="Day Three closing"
        >
          <div className="d1-shot-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="d1-shot-fill" src={ART3.prelude} alt="The torii path through the grove at golden hour" />
          </div>
          <div className="d1-shot-shade" />
          <div className="d1-shot-title">
            <p className="d1-kicker">Stage Three complete</p>
            <div className="d1-fin-head">
              <h1>The era of listening closes</h1>
              <span className="d1-kan" lang="ja" role="img" aria-label="Complete (kan)">
                完
              </span>
            </div>
            <p className="era" style={{ marginBottom: 18 }}>
              Seven days in Naomori. Namonoki keeps two names tonight, and the path climbs toward the cliffs.
            </p>
            <PlaqueButton nav size="xl" className="d1-fin-continue" onClick={finContinue}>
              Continue
            </PlaqueButton>
          </div>
        </section>
      )}

      {talking && (
        <Dialogue
          key={talking.id}
          cast={CAST3}
          por={POR3}
          scenes={SCENES3}
          continuity
          lowThink
          defaultKenjiPose="sword"
          lines={talking.lines}
          lazyIf={() => dRef.current}
          reducedMotion={RM}
          onDone={endTalk}
        />
      )}
    </div>
  );
}
