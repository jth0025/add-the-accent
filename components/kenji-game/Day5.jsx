"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PlaqueButton from "./PlaqueButton";
import Dialogue from "./Dialogue";
import { Finale, Prelude, RankPicker } from "./DayShots";
import useDay from "./useDay";
import { RANKS } from "./day2-data";
import { ART5, CAST5, CROSSINGS, FOES, HEAD5, POR5, RANKDIFF, SCENES5, SCRIPTS5 } from "./day5-data";
import { freshDay5, itemById, loadDay5, saveDay5, writeJourneyDay } from "@/lib/kenjiJourney";
import "./day1.css";
import "./day2.css";
import "./day5.css";

const itemName = (id) => itemById(id)?.name || id;

/* ------------------------------------------------------------------ */
/* The level: five crossings of the Broken Passage, each fought in the */
/* embedded game "Battle at the Broken Passage". The page tells the     */
/* fight which crossing to play and rank to play it at (postMessage),   */
/* and the fight reports each crossing cleared, and the last one won.   */
/* ------------------------------------------------------------------ */
export default function Day5({ reducedMotion, onMenu, onComplete, onPath, reviewApi }) {
  const RM = reducedMotion;
  const { initial, d, dRef, update, replace, later, talking, talkingRef, talk, endTalk } = useDay({
    load: loadDay5,
    fresh: freshDay5,
    save: saveDay5,
    scripts: SCRIPTS5,
  });
  const scrollRef = useRef(null);
  const toTop = () => scrollRef.current?.scrollTo({ top: 0 });
  const stage = d.stage || 1;
  const cross = d.cross;

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
    const t = setTimeout(() => talk("d5_arrive", () => setEnterReady(true)), RM ? 300 : 3400);
    return () => {
      cancelAnimationFrame(a);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prelude]);
  useEffect(() => {
    if (enterReady) enterRef.current?.querySelector("button")?.focus({ preventScroll: true });
  }, [enterReady]);

  const enterPassage = () => {
    update({ arrived: true });
    setPreLeaving(true);
    later(
      () => {
        setPrelude(false);
        setPreOn(false);
        setPreLeaving(false);
        setEnterReady(false);
        toTop();
        later(() => talk("d5_ambush"), 300);
      },
      RM ? 0 : 1300,
    );
  };

  // coming back mid-Day: the ambush is told once, then the fight picks up where it stopped
  useEffect(() => {
    const cur = initial;
    if (cur.arrived && (cur.stage || 1) === 1 && !(cur.seen && cur.seen.d5_ambush)) later(() => talk("d5_ambush"), 500);
    if (cur.done && (cur.stage || 1) >= 2) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    writeJourneyDay(5, { inv: [...dRef.current.inv], plate2: true });
    onComplete();
    go(2);
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

  /* ---- the embedded fight ---- */
  const fightRef = useRef(null);
  const practiceRef = useRef(null);
  const frameRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pStarted, setPStarted] = useState(false); // the practice game has been asked for
  const [pPlaying, setPPlaying] = useState(false);
  const pReady = useRef(false);
  const pPending = useRef(null);
  const readyRef = useRef(false);

  const post = (frame, msg) => {
    try {
      frame.current?.contentWindow?.postMessage(msg, "*");
    } catch {
      /* the fight is not there yet */
    }
  };
  const focusFight = (frame) => {
    later(() => {
      frame.current?.focus();
      post(frame, { kqCmd: "focus" });
    }, 60);
  };

  const playPractice = (i) => {
    pPending.current = null;
    setPPlaying(true);
    post(practiceRef, { kqCmd: "play", stage: i, diff: RANKDIFF[dRef.current.rank], single: true });
    focusFight(practiceRef);
    later(() => practiceRef.current?.scrollIntoView({ block: "center" }), 80);
  };

  const onFightMessage = useCallback(
    (e) => {
      const m = e.data;
      if (!m || !m.kq) return;
      if (fightRef.current && e.source === fightRef.current.contentWindow) {
        if (m.ev === "ready") {
          readyRef.current = true;
          setReady(true);
        }
        if (m.ev === "cleared") update({ cross: Math.max(dRef.current.cross, (m.stage | 0) + 1) });
        if (m.ev === "complete") {
          update({ cross: 5, plate2: true });
          setPlaying(false);
          later(() => talk("d5_after"), 400);
        }
      }
      if (practiceRef.current && e.source === practiceRef.current.contentWindow && m.ev === "ready" && !pReady.current) {
        pReady.current = true;
        if (pPending.current != null) playPractice(pPending.current);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useEffect(() => {
    window.addEventListener("message", onFightMessage);
    return () => window.removeEventListener("message", onFightMessage);
  }, [onFightMessage]);
  // the fight may finish loading before this page is listening: keep asking until it answers
  useEffect(() => {
    const t = setInterval(() => {
      if (readyRef.current) {
        clearInterval(t);
        return;
      }
      post(fightRef, { kqCmd: "ping" });
    }, 600);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startFight = () => {
    if (!ready || dRef.current.cross >= 5) return;
    setPlaying(true);
    post(fightRef, { kqCmd: "play", stage: dRef.current.cross, diff: RANKDIFF[dRef.current.rank] });
    focusFight(fightRef);
    later(() => frameRef.current?.scrollIntoView({ block: "center" }), 80);
  };

  const pickCrossing = (i) => {
    if (!pStarted) {
      pPending.current = i;
      setPStarted(true);
      return;
    }
    if (!pReady.current) {
      pPending.current = i;
      return;
    }
    playPractice(i);
  };

  const restart = () => {
    replace(freshDay5());
    setPlaying(false);
    setPrelude(true);
    setPreOn(false);
    setEnterReady(false);
    requestAnimationFrame(toTop);
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
        // clear every crossing and take the plate
        if (dRef.current.cross < 5) {
          update({ cross: 5, plate2: true });
          setPlaying(false);
          later(() => talk("d5_after"), 300);
        }
      },
      talk(key) {
        talk(key, null, true);
      },
      enter() {
        if (prelude && enterReady) enterPassage();
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

  /* ---- render ---- */
  const HEAD = HEAD5[stage];
  const fig = (id) => (
    <figure key={id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={itemById(id).img} alt="" />
      {itemName(id)}
    </figure>
  );
  const showLeave = cross >= 5 && !!(d.seen && d.seen.d5_after) && !talking;
  const startLabel = !ready ? "Loading the passage…" : cross > 0 ? "Continue the crossings" : "Begin the crossings";

  return (
    <div className="d1 d2 d5 absolute inset-0">
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto">
        <div className="qi-fade-enter mx-auto max-w-5xl px-5 pb-16 pt-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <PlaqueButton nav size="xs" onClick={onMenu}>
              &larr; Menu
            </PlaqueButton>
          </div>

          <header className="mt-6 text-center">
            <p className="d1-kicker">Stage Five &middot; Day Five: The Era of Confrontation</p>
            <h2 className={`d1-title mt-2 text-2xl sm:text-4xl${stage === 1 ? " d5-sheen" : ""}`}>{HEAD.title}</h2>
            <span
              aria-hidden="true"
              className="mt-1 block font-tribal text-2xl text-[var(--qi-gold)] sm:text-3xl"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.85), 0 0 16px rgba(214,166,75,0.4)" }}
            >
              {HEAD.kanji}
            </span>
            <p className="d2-kday">Six days on the road. One day at the Broken Passage.</p>
          </header>

          {stage === 1 && (
            <ol className="d1-trail" aria-label="The five crossings">
              {CROSSINGS.map((s, i) => (
                <li key={s} className={i < cross ? "done" : i === cross ? "now" : ""}>
                  <b>{i + 1}</b>
                  {s}
                </li>
              ))}
            </ol>
          )}

          {/* ---------------- 1: the five crossings ---------------- */}
          {stage === 1 && (
            <section aria-label="Battle at the Broken Passage">
              <div className="d1-frame mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="d5-hero"
                  src={ART5.five}
                  alt="The Vashara Five: a staff fighter, a ball-and-chain, an archer, a smoke walker, and the Vashara Fifth"
                />
              </div>
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              <p className="d1-hint mx-auto mb-3 max-w-3xl text-center">
                Keyboard: A and D or the arrow keys to move, S or down to duck, J to slash, K for a heavy cut, L to guard (tap it
                to parry), Space to dodge, I to Split the Light. On a phone or tablet, use the on-screen pads.
              </p>
              {cross < 5 && !playing && <RankPicker ranks={RANKS} value={d.rank} onPick={(rank) => update({ rank })} />}
              <p className="d2-prog">
                {cross >= 5 ? "All five crossings taken" : `Crossing ${cross + 1} of 5 · ${CROSSINGS[cross]} · ${FOES[cross]}`}
              </p>
              <div ref={frameRef} className={`d5-frame${playing ? " playing" : ""}`}>
                <iframe
                  ref={fightRef}
                  name="kq-fight"
                  src={ART5.fight}
                  title="Battle at the Broken Passage"
                  allow="autoplay"
                />
                {cross < 5 && (
                  <div className="d5-start">
                    <PlaqueButton nav size="lg" disabled={!ready} onClick={startFight}>
                      {startLabel}
                    </PlaqueButton>
                  </div>
                )}
              </div>
              {showLeave && (
                <div className="qi-fade-enter mt-6">
                  <PlaqueButton nav size="lg" onClick={runFinale}>
                    Leave the passage
                  </PlaqueButton>
                </div>
              )}
            </section>
          )}

          {/* ---------------- 2: the summary ---------------- */}
          {stage === 2 && (
            <section aria-label="Day Five complete" className="qi-fade-enter qi-panel d1-scroll rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kenji-game/poses/round-complete.webp"
                alt="Kenji, head bowed, hands pressed together in quiet acknowledgment"
                className="qi-item-glow mx-auto w-28 sm:w-36"
              />
              <p className="d1-kicker mt-3 text-center">Stage Five complete</p>
              <span className="d1-kan d1-kan--sm" lang="ja" role="img" aria-label="Complete (kan)">
                完
              </span>
              <p className="mt-3 leading-relaxed text-[var(--qi-ivory)]/90">
                Day Five is ended. The Vashara Five held every crossing of the Broken Passage, trained in forms Kenji half
                recognized. He took all five with nothing but Hikariwake, Emichō his only witness, and learned that the Vashara
                belong to the same buried history as his house. From the last of them he took a second piece of the route.
              </p>
              <dl>
                <dt>Battle at the Broken Passage</dt>
                <dd>
                  {FOES.map((f, i) => (
                    <span key={f}>
                      {CROSSINGS[i]}: {f}
                      {i < FOES.length - 1 ? <br /> : null}
                    </span>
                  ))}
                  <br />
                  <span className="d1-hint">Rank: {RANKS[d.rank].label}</span>
                </dd>
                <dt>Retrieved</dt>
                <dd>
                  <div className="d1-endlist">
                    <figure>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ART5.plate} alt="" />
                      Second map plate
                    </figure>
                  </div>
                  <span className="d1-hint">It fits the first. The route runs west, toward the sea.</span>
                </dd>
                <dt>Time at the passage</dt>
                <dd>One day, crossed before the sun reached the river</dd>
                <dt>In the satchel</dt>
                <dd>
                  <div className="d1-endlist">{d.inv.map(fig)}</div>
                </dd>
                <dt>Next</dt>
                <dd>
                  Day Six: The Era of Responsibility
                  <br />
                  <span className="text-sm text-[var(--qi-ivory)]/60">On the road to the Wall of Waves</span>
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
                    go(3);
                  }}
                >
                  Practice in the passage
                </PlaqueButton>
                <button
                  type="button"
                  onClick={restart}
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--qi-ivory)]/55 underline-offset-4 hover:text-[var(--qi-gold)] hover:underline"
                >
                  Begin Day Five again
                </button>
              </div>
            </section>
          )}

          {/* ---------------- 3: practice ---------------- */}
          {stage === 3 && (
            <section aria-label="Practice in the passage">
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              <RankPicker ranks={RANKS} value={d.rank} onPick={(rank) => update({ rank })} />
              <div className="d2-row mt-4">
                {CROSSINGS.map((c, i) => (
                  <PlaqueButton key={c} nav size="sm" dim={i > 0} onClick={() => pickCrossing(i)}>
                    {c}
                  </PlaqueButton>
                ))}
              </div>
              <div className="d2-row mt-4">
                <PlaqueButton nav size="xs" dim onClick={() => go(2)}>
                  Back to summary
                </PlaqueButton>
              </div>
              {pStarted && (
                <div className={`d5-frame mt-4${pPlaying ? " playing" : ""}`}>
                  <iframe ref={practiceRef} name="kq-fight" src={ART5.fight} title="Practice crossing" allow="autoplay" />
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {prelude && (
        <Prelude
          cls="d5-prelude"
          label="Day Five opening"
          art={ART5.approach}
          alt="Kenji at the edge of the Broken Passage at sunset, old stone bridges spanning the chasm"
          kicker="Stage Five"
          h1="Day Five"
          dayname="The Era of Confrontation"
          era="Six days on the road. Old stone bridges span the chasm, the only way west toward the setting sun."
          button="Enter the Broken Passage"
          ready={enterReady}
          on={preOn}
          leaving={preLeaving}
          enterRef={enterRef}
          onEnter={enterPassage}
        />
      )}

      {finale && (
        <Finale
          cls="d5-finale"
          label="Day Five closing"
          art={ART5.sunset}
          alt="Kenji on the bridge at sunset, Hikariwake in hand and Emichō by the blade, the river running gold toward the sea"
          kicker="Stage Five complete"
          title="The era of confrontation closes"
          era="The last of the Vashara Five is lost to the mist below the broken span. The sun sinks into the river, and Kenji crosses west, toward the sea. Kenji’s Quest continues: Day Six."
          on={finOn}
          titled={finTitled}
          leaving={finLeaving}
          onContinue={finContinue}
        />
      )}

      {talking && (
        <Dialogue
          key={talking.id}
          cast={CAST5}
          por={POR5}
          scenes={SCENES5}
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
