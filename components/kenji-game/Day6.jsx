"use client";

import { useEffect, useRef, useState } from "react";
import PlaqueButton from "./PlaqueButton";
import Dialogue from "./Dialogue";
import TideBoard from "./TideBoard";
import MirrorBoard from "./MirrorBoard";
import { Finale, Prelude, RankPicker } from "./DayShots";
import useDay from "./useDay";
import { MRSIZE, mrGen, tlGen } from "./tide-engine";
import { fmtTime } from "./ledger-engine";
import { RANKS } from "./day2-data";
import { ART6, CAST6, HEAD6, POR6, SCENES6, SCRIPTS6, STEPS6 } from "./day6-data";
import { best6, freshDay6, itemById, loadDay6, saveDay6, writeJourneyDay } from "@/lib/kenjiJourney";
import "./day1.css";
import "./day2.css";
import "./day6.css";

const itemName = (id) => itemById(id)?.name || id;
const uid = () => Math.random().toString(36).slice(2);

/* ------------------------------------------------------------------ */
/* The level: the tide locks under the Wall of Waves, the ring of      */
/* mirrors, Nami-Kai's question, and Daigo.                            */
/* ------------------------------------------------------------------ */
export default function Day6({ reducedMotion, onMenu, onComplete, onPath, reviewApi }) {
  const RM = reducedMotion;
  const { initial, d, dRef, update, replace, later, talking, talkingRef, talk, endTalk, replay } = useDay({
    load: loadDay6,
    fresh: freshDay6,
    save: saveDay6,
    scripts: SCRIPTS6,
  });
  const scrollRef = useRef(null);
  const toTop = () => scrollRef.current?.scrollTo({ top: 0 });
  const has = (id) => d.inv.includes(id);
  const stage = d.stage || 1;
  const paused = !!talking;

  const setKday = (n) => {
    if (n > dRef.current.kday) update({ kday: Math.min(6, n) });
  };
  const go = (n) => {
    update({ stage: n });
    requestAnimationFrame(toTop);
  };

  /* ---- the approach and the leaving ---- */
  const [prelude, setPrelude] = useState(() => !initial.arrived);
  const [preOn, setPreOn] = useState(false);
  const [preLeaving, setPreLeaving] = useState(false);
  const [enterReady, setEnterReady] = useState(false);
  const enterRef = useRef(null);
  const [finale, setFinale] = useState(false);
  const [finOn, setFinOn] = useState(false);
  const [finTitled, setFinTitled] = useState(false);
  const [finLeaving, setFinLeaving] = useState(false);

  useEffect(() => {
    if (!prelude) return undefined;
    const a = requestAnimationFrame(() => requestAnimationFrame(() => setPreOn(true)));
    const t = setTimeout(() => talk("d6_arrive", () => setEnterReady(true)), RM ? 300 : 3400);
    return () => {
      cancelAnimationFrame(a);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prelude]);
  useEffect(() => {
    if (enterReady) enterRef.current?.querySelector("button")?.focus({ preventScroll: true });
  }, [enterReady]);

  const enterWall = () => {
    update({ arrived: true });
    setPreLeaving(true);
    later(
      () => {
        setPrelude(false);
        setPreOn(false);
        setPreLeaving(false);
        setEnterReady(false);
        toTop();
        later(() => talk("d6_enter"), 300);
      },
      RM ? 0 : 1300,
    );
  };

  const runFinale = () => {
    setFinale(true);
    setFinOn(false);
    setFinTitled(false);
    setFinLeaving(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setFinOn(true)));
    later(() => setFinTitled(true), RM ? 300 : 2600);
  };
  const finContinue = () => {
    setFinLeaving(true);
    update({ done: true });
    writeJourneyDay(6, { inv: [...dRef.current.inv], claims: dRef.current.claims });
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

  /* ---- the tide locks ---- */
  const lockApi = useRef(null);
  const mirrorApi = useRef(null);
  const [settling, setSettling] = useState(false);
  // the lock in progress: make it when the stage needs one (it can take a moment)
  useEffect(() => {
    if (!d.arrived || stage !== 1 || d.lock >= 3 || d.tl) return undefined;
    setSettling(true);
    const t = setTimeout(() => {
      const g = tlGen(dRef.current.rank);
      update({ tl: { P: g.P, par: g.par, li: dRef.current.lock, moves: 0, elapsed: 0, id: uid() } });
      setSettling(false);
    }, 40);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.arrived, stage, d.lock, d.tl]);
  useEffect(() => {
    if (!d.arrived || stage !== 2 || d.mir >= 3 || d.mr) return;
    update({ mr: { ...mrGen(MRSIZE[d.rank][d.mir]), mi: d.mir, id: uid() } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.arrived, stage, d.mir, d.mr]);

  const onLockSolve = (S) => {
    const cur = dRef.current;
    const i = cur.lock;
    const moves = [...cur.moves];
    moves[i] = S.moves;
    update({ moves, lock: i + 1, tl: null });
    setKday(i === 0 ? 2 : 3);
    if (i === 2) talk("d6_locks");
  };
  const onMirrorSolve = (M) => {
    const cur = dRef.current;
    const i = cur.mir;
    const presses = [...cur.presses];
    presses[i] = M.presses;
    update({ presses, mir: i + 1, mr: null });
    setKday(i < 2 ? 4 : 5);
  };

  /* ---- Nami-Kai's question ---- */
  const askNamiKai = () => {
    setKday(6);
    const key = dRef.current.asked ? "d6_ask_again" : "d6_question";
    update({ asked: true, answer: null });
    replay(key, () => {
      if (dRef.current.answer === "own") {
        update({ claims: (dRef.current.claims || 0) + 1 });
        replay("d6_own", () => {
          update({ answer: null, mir: 0, mr: null });
          go(2);
        });
      } else {
        update({ answer: "resp" });
        replay("d6_after", runFinale);
      }
    });
  };

  // coming back mid-Day
  useEffect(() => {
    const cur = initial;
    if (cur.arrived && (cur.stage || 1) === 1 && !(cur.seen && cur.seen.d6_enter)) later(() => talk("d6_enter"), 500);
    if (cur.done && (cur.stage || 1) >= 3) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restart = () => {
    replace(freshDay6());
    setPrelude(true);
    setPreOn(false);
    setEnterReady(false);
    requestAnimationFrame(toTop);
  };

  /* ---- practice ---- */
  const [practice, setPractice] = useState(null);
  const [pnote, setPnote] = useState("");
  const [pbusy, setPbusy] = useState(false);
  const newPracticeLock = () => {
    setPnote("");
    setPractice(null);
    setPbusy(true);
    later(() => {
      const g = tlGen(dRef.current.rank);
      setPractice({ kind: "lock", id: uid(), state: { P: g.P, par: g.par, moves: 0, elapsed: 0 } });
      setPbusy(false);
    }, 40);
  };
  const newPracticeMirror = () => {
    setPnote("");
    setPractice({ kind: "mirror", id: uid(), state: mrGen({ initiate: 4, disciple: 5, master: 7 }[dRef.current.rank]) });
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
        if (stage === 2) mirrorApi.current?.solve();
        else lockApi.current?.solve();
      },
      talk(key) {
        talk(key, null, true);
      },
      ask() {
        askNamiKai();
      },
      enter() {
        if (prelude && enterReady) enterWall();
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
  const HEAD = HEAD6[stage];
  const fig = (id) => (
    <figure key={id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={itemById(id).img} alt="" />
      {itemName(id)}
    </figure>
  );
  const bestT = best6.load();
  const ranks = (onPick) => <RankPicker ranks={RANKS} value={d.rank} onPick={onPick} />;
  const progLine =
    stage === 1
      ? d.lock >= 3
        ? "All three locks open"
        : `Tide lock ${d.lock + 1} of 3`
      : stage === 2
      ? d.mir >= 3
        ? "Every mirror faces the light"
        : `${d.claims && d.mir === 0 ? "The mirrors have gone dark. Light them again, and ask properly. " : ""}Ring of mirrors ${d.mir + 1} of 3`
      : "";
  const lockStat = (v) => (v != null ? (v > 0 ? `+${v}` : "even") : "—");

  return (
    <div className="d1 d2 d6 absolute inset-0">
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto">
        <div className="qi-fade-enter mx-auto max-w-5xl px-5 pb-16 pt-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <PlaqueButton nav size="xs" onClick={onMenu}>
              &larr; Menu
            </PlaqueButton>
          </div>

          <header className="mt-6 text-center">
            <p className="d1-kicker">Stage Six &middot; Day Six: The Era of Responsibility</p>
            <h2 className="d1-title mt-2 text-2xl sm:text-4xl">{HEAD.title}</h2>
            <span
              aria-hidden="true"
              className="mt-1 block font-tribal text-2xl text-[var(--qi-gold)] sm:text-3xl"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.85), 0 0 16px rgba(214,166,75,0.4)" }}
            >
              {HEAD.kanji}
            </span>
            <p className="d2-kday">Eleven days on the road. Day {d.kday} of 6 at the Wall.</p>
          </header>

          {stage < 3 && (
            <ol className="d1-trail" aria-label="Day Six steps">
              {STEPS6.map((s, i) => (
                <li key={s} className={i + 1 < stage ? "done" : i + 1 === stage ? "now" : ""}>
                  <b>{i + 1}</b>
                  {s}
                </li>
              ))}
            </ol>
          )}

          {/* ---------------- 1: the tide locks ---------------- */}
          {stage === 1 && (
            <section aria-label="The tide locks">
              <div className="d1-frame mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="d6-hero" src={ART6.tunnel} alt="Kenji walks a torchlit tide channel under the Wall of Waves" />
              </div>
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              <p className="d2-prog">{progLine}</p>
              <div className="d6-host d6-host--lock">
                {d.lock >= 3 ? (
                  <p className="d6-msg">The tide runs all the way to the pool at the heart of the Wall.</p>
                ) : d.tl && d.tl.li === d.lock ? (
                  <TideBoard
                    key={d.tl.id}
                    state={d.tl}
                    rank={d.rank}
                    paused={paused}
                    apiRef={lockApi}
                    onChange={() => saveDay6(dRef.current)}
                    onSolve={onLockSolve}
                  />
                ) : settling ? (
                  <p className="d6-msg">The gates settle into place…</p>
                ) : null}
              </div>
              {d.lock >= 3 && !talking && (
                <div className="qi-fade-enter mt-6">
                  <PlaqueButton nav size="lg" onClick={() => go(2)}>
                    Go deeper
                  </PlaqueButton>
                </div>
              )}
            </section>
          )}

          {/* ---------------- 2: the mirrors ---------------- */}
          {stage === 2 && (
            <section aria-label="The mirrors of the Wall">
              <div className="d1-frame mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="d6-hero" src={ART6.mirrorsDark} alt="Kenji before the dark cavern pool, ringed by unlit bronze mirrors" />
              </div>
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              <p className="d2-prog">{progLine}</p>
              <div className={`d6-host d6-host--mirror${d.mir >= 3 ? " lit" : ""}`}>
                {d.mir >= 3 ? (
                  <p className="d6-msg">The hall is lit. Something in the pool is listening.</p>
                ) : d.mr && d.mr.mi === d.mir ? (
                  <MirrorBoard
                    key={d.mr.id}
                    state={d.mr}
                    rank={d.rank}
                    paused={paused}
                    apiRef={mirrorApi}
                    onChange={() => saveDay6(dRef.current)}
                    onSolve={onMirrorSolve}
                  />
                ) : null}
              </div>
              {d.mir >= 3 && !talking && (
                <div className="qi-fade-enter mt-6">
                  <PlaqueButton nav size="lg" onClick={askNamiKai}>
                    {d.asked ? "Ask the hall again" : "Wait at the water"}
                  </PlaqueButton>
                </div>
              )}
            </section>
          )}

          {/* ---------------- 3: the summary ---------------- */}
          {stage === 3 && (
            <section aria-label="Day Six complete" className="qi-fade-enter qi-panel d1-scroll rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kenji-game/poses/round-complete.webp"
                alt="Kenji, head bowed, hands pressed together in quiet acknowledgment"
                className="qi-item-glow mx-auto w-28 sm:w-36"
              />
              <p className="d1-kicker mt-3 text-center">Stage Six complete</p>
              <span className="d1-kan d1-kan--sm" lang="ja" role="img" aria-label="Complete (kan)">
                完
              </span>
              <p className="mt-3 leading-relaxed text-[var(--qi-ivory)]/90">
                Day Six is ended. Kenji came to the Wall of Waves treating it like another lock, and learned it was asking whether
                he knew how to request an audience. Nami-Kai answered. So did Daigo, who the Vashara call Hakari, and who was once
                sworn on that same water. A promise was broken in the sea guardian’s hall, and the sea kept it.
              </p>
              <dl>
                <dt>The tide locks</dt>
                <dd>
                  Three locks opened
                  <br />
                  <span className="d1-hint">
                    Moves: {d.moves.join(", ")} &middot; Rank: {RANKS[d.rank].label}
                  </span>
                </dd>
                <dt>The mirrors of the Wall</dt>
                <dd>
                  Three rings of mirrors lit
                  <br />
                  <span className="d1-hint">Turns: {d.presses.join(", ")}</span>
                </dd>
                <dt>Kenji’s answer to Nami-Kai</dt>
                <dd>
                  {d.claims
                    ? `“It is mine,” ${d.claims > 1 ? `${d.claims} times` : "at first"}, and the hall went dark. Then: “I belong to it.”`
                    : "“I belong to it.” The spirit stayed calm."}
                </dd>
                <dt>Daigo</dt>
                <dd>
                  Named by Nami-Kai. Called Hakari by the Vashara.
                  {has("cord") ? " He braided the cord on Kenji’s hilt." : ""} The letter’s last line: “My brother is among them.”
                </dd>
                <dt>Time at the Wall</dt>
                <dd>Six days</dd>
                <dt>In the satchel</dt>
                <dd>
                  <div className="d1-endlist">{d.inv.map(fig)}</div>
                </dd>
                <dt>Next</dt>
                <dd>
                  Day Seven: First Light
                  <br />
                  <span className="text-sm text-[var(--qi-ivory)]/60">Beyond the map, to the Aokiri Expanse: the Green Silence</span>
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
                  Practice at the Wall
                </PlaqueButton>
                <button
                  type="button"
                  onClick={restart}
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--qi-ivory)]/55 underline-offset-4 hover:text-[var(--qi-gold)] hover:underline"
                >
                  Begin Day Six again
                </button>
              </div>
            </section>
          )}

          {/* ---------------- 4: practice ---------------- */}
          {stage === 4 && (
            <section aria-label="Practice at the Wall">
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              {ranks((k) => {
                update({ rank: k });
                setPractice(null);
              })}
              <div className="d2-row mt-4">
                <PlaqueButton nav size="sm" onClick={newPracticeLock}>
                  New tide lock
                </PlaqueButton>
                <PlaqueButton nav size="sm" dim onClick={newPracticeMirror}>
                  New mirrors
                </PlaqueButton>
                <PlaqueButton nav size="xs" dim onClick={() => go(3)}>
                  Back to summary
                </PlaqueButton>
              </div>
              <p className="d1-hint mt-3">
                Fewest moves over par on a tide lock:{" "}
                {Object.entries(RANKS)
                  .map(([k, r]) => `${r.label} ${lockStat(bestT[`l_${k}`])}`)
                  .join(" · ")}
                . Fastest mirrors:{" "}
                {Object.entries(RANKS)
                  .map(([k, r]) => `${r.label} ${fmtTime(bestT[`m_${k}`])}`)
                  .join(" · ")}
              </p>
              {pbusy && <p className="d6-msg mt-4">The gates settle into place…</p>}
              {practice && practice.kind === "lock" && (
                <div className="d6-host d6-host--lock mt-4">
                  <TideBoard
                    key={practice.id}
                    state={practice.state}
                    rank={d.rank}
                    paused={paused}
                    apiRef={lockApi}
                    onChange={() => {}}
                    onSolve={(S) => {
                      best6.set(`l_${d.rank}`, S.moves - S.par);
                      setPnote(`The tide runs free in ${S.moves} moves. The Wall’s count was ${S.par}.`);
                    }}
                  />
                  {pnote ? <p className="d2-msg mt-3">{pnote}</p> : null}
                </div>
              )}
              {practice && practice.kind === "mirror" && (
                <div className="d6-host d6-host--mirror mt-4">
                  <MirrorBoard
                    key={practice.id}
                    state={practice.state}
                    rank={d.rank}
                    paused={paused}
                    apiRef={mirrorApi}
                    onChange={() => {}}
                    onSolve={(M) => {
                      const b = best6.set(`m_${d.rank}`, M.elapsed);
                      setPnote(`Lit in ${fmtTime(M.elapsed)}. Best ${RANKS[d.rank].label} time: ${fmtTime(b)}.`);
                    }}
                  />
                  {pnote ? <p className="d2-msg mt-3">{pnote}</p> : null}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {prelude && (
        <Prelude
          cls="d6-prelude"
          label="Day Six opening"
          art={ART6.exterior}
          alt="The Wall of Waves at sunset: towers, waterfalls, and a great wave-carved gate above the sea"
          kicker="Stage Six"
          h1="Day Six"
          dayname="The Era of Responsibility"
          era="Eleven days on the road. The Wall of Waves is older than Kosei: a treaty made into stone."
          button="Enter the Wall"
          ready={enterReady}
          on={preOn}
          leaving={preLeaving}
          enterRef={enterRef}
          onEnter={enterWall}
        />
      )}

      {finale && (
        <Finale
          cls="d6-finale"
          label="Day Six closing"
          art={ART6.leaving}
          alt="Kenji leaving the Wall of Waves at dawn, the road turning inland toward green hills"
          kicker="Stage Six complete"
          title="The era of responsibility closes"
          era="Six days at the Wall. Beyond the map lies the Aokiri Expanse: the Green Silence, and First Light."
          on={finOn}
          titled={finTitled}
          leaving={finLeaving}
          onContinue={finContinue}
        />
      )}

      {talking && (
        <Dialogue
          key={talking.id}
          cast={CAST6}
          por={POR6}
          scenes={SCENES6}
          continuity
          lowThink
          defaultKenjiPose="armed"
          lines={talking.lines}
          lazyIf={() => dRef.current}
          reducedMotion={RM}
          onDone={endTalk}
        />
      )}
    </div>
  );
}
