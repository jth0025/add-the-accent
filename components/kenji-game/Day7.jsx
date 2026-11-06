"use client";

import { useEffect, useRef, useState } from "react";
import PlaqueButton from "./PlaqueButton";
import Dialogue from "./Dialogue";
import SlideScroll, { scNew } from "./SlideScroll";
import Stillness from "./Stillness";
import { Finale, Prelude, RankPicker } from "./DayShots";
import useDay from "./useDay";
import { RANKS } from "./day2-data";
import { ART7, CARRY, CAST7, HEAD7, POR7, SCENES7, SCN, SCRIPTS7, STEPS7 } from "./day7-data";
import { best7, freshDay7, itemById, loadDay7, saveDay7, writeJourneyDay } from "@/lib/kenjiJourney";
import "./day1.css";
import "./day2.css";
import "./day7.css";

const itemName = (id) => itemById(id)?.name || id;

// The trials the Sanctuary offers: each opens a Day's practice (Day Seven's
// own is a fresh scroll). The day number is the Day's place on the Path.
const TRIALS = [
  { day: 2, name: "The Warden’s Ledger", sub: "Day Two · Kosei" },
  { day: 3, name: "The glyph gate and Namonoki’s song", sub: "Day Three · Naomori" },
  { day: 4, name: "The light of Hikariwake and the route", sub: "Day Four · the Nest Cliffs" },
  { day: 5, name: "Battle at the Broken Passage", sub: "Day Five · the Broken Passage" },
  { day: 6, name: "The tide locks and the mirrors", sub: "Day Six · the Wall of Waves" },
  { day: 7, name: "The assembled scroll", sub: "Day Seven · the Green Silence" },
];

/* ------------------------------------------------------------------ */
/* The level: the assembled scroll, the door of light, stillness, and  */
/* the Sanctuary: a hub that opens every Day's practice again.         */
/* ------------------------------------------------------------------ */
export default function Day7({ reducedMotion, onMenu, onComplete, onPath, onTrial, reviewApi }) {
  const RM = reducedMotion;
  const { initial, d, dRef, update, replace, later, talking, talkingRef, talk, endTalk } = useDay({
    load: loadDay7,
    fresh: freshDay7,
    save: saveDay7,
    scripts: SCRIPTS7,
  });
  const scrollRef = useRef(null);
  const toTop = () => scrollRef.current?.scrollTo({ top: 0 });
  const stage = d.stage || 1;
  const paused = !!talking;

  const setKday = (n) => {
    if (n > dRef.current.kday) update({ kday: Math.min(4, n) });
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
    const t = setTimeout(() => talk("d7_arrive", () => setEnterReady(true)), RM ? 300 : 3400);
    return () => {
      cancelAnimationFrame(a);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prelude]);
  useEffect(() => {
    if (enterReady) enterRef.current?.querySelector("button")?.focus({ preventScroll: true });
  }, [enterReady]);

  const enterSilence = () => {
    update({ arrived: true });
    setPreLeaving(true);
    later(
      () => {
        setPrelude(false);
        setPreOn(false);
        setPreLeaving(false);
        setEnterReady(false);
        toTop();
        later(() => talk("d7_enter"), 300);
      },
      RM ? 0 : 1300,
    );
  };

  const runFinale = () => {
    if (!dRef.current.carry) update({ carry: "remember" });
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
    writeJourneyDay(7, { inv: [...dRef.current.inv], carry: dRef.current.carry });
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

  /* ---- the assembled scroll ---- */
  const scrollApi = useRef(null);
  const stillApi = useRef(null);
  useEffect(() => {
    if (!d.arrived || stage !== 1 || d.scDone || d.sc) return;
    update({ sc: scNew(SCN[d.rank]) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.arrived, stage, d.scDone, d.sc]);

  const onScrollSolve = (S) => {
    update({ scMoves: S.moves, scDone: true, sc: null });
    setKday(2);
    best7.set(`s_${dRef.current.rank}`, S.moves);
    talk("d7_scroll");
  };
  const followRoad = () => {
    setKday(3);
    talk("d7_light", () => go(2));
  };

  /* ---- stillness ---- */
  const onStill = () => {
    update({ stilled: true });
    setKday(4);
    talk("d7_end", runFinale);
  };

  // coming back mid-Day
  useEffect(() => {
    const cur = initial;
    if (cur.arrived && (cur.stage || 1) === 1 && !(cur.seen && cur.seen.d7_enter)) later(() => talk("d7_enter"), 500);
    if (cur.done && (cur.stage || 1) >= 3) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restart = () => {
    replace(freshDay7());
    setPrelude(true);
    setPreOn(false);
    setEnterReady(false);
    requestAnimationFrame(toTop);
  };

  /* ---- the Sanctuary ---- */
  const openTrial = (t) => {
    if (t.day === 7) {
      update({ sc: scNew(SCN[dRef.current.rank]), scDone: false, stage: 1 });
      requestAnimationFrame(toTop);
    } else {
      onTrial(t.day);
    }
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
        if (stage === 2) stillApi.current?.solve();
        else scrollApi.current?.solve();
      },
      talk(key) {
        talk(key, null, true);
      },
      enter() {
        if (prelude && enterReady) enterSilence();
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
  const HEAD = HEAD7[stage];
  const fig = (id) => (
    <figure key={id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={itemById(id).img} alt="" />
      {itemName(id)}
    </figure>
  );
  const daily = TRIALS[Math.floor(Date.now() / 864e5) % TRIALS.length];
  const carry = d.carry || "remember";

  return (
    <div className="d1 d2 d7 absolute inset-0">
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto">
        <div className="qi-fade-enter mx-auto max-w-5xl px-5 pb-16 pt-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <PlaqueButton nav size="xs" onClick={onMenu}>
              &larr; Menu
            </PlaqueButton>
          </div>

          <header className="mt-6 text-center">
            <p className="d1-kicker">Stage Seven &middot; Day Seven: First Light</p>
            <h2 className="d1-title mt-2 text-2xl sm:text-4xl">{HEAD.title}</h2>
            <span
              aria-hidden="true"
              className="mt-1 block font-tribal text-2xl text-[var(--qi-gold)] sm:text-3xl"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.85), 0 0 16px rgba(214,166,75,0.4)" }}
            >
              {HEAD.kanji}
            </span>
            <p className="d2-kday">Fifteen days on the road. Day {d.kday} of 4 in the Green Silence.</p>
          </header>

          {stage < 3 && (
            <ol className="d1-trail" aria-label="Day Seven steps">
              {STEPS7.map((s, i) => (
                <li key={s} className={i + 1 < stage ? "done" : i + 1 === stage ? "now" : ""}>
                  <b>{i + 1}</b>
                  {s}
                </li>
              ))}
            </ol>
          )}

          {/* ---------------- 1: the assembled scroll ---------------- */}
          {stage === 1 && (
            <section aria-label="The assembled scroll">
              <div className="d1-frame mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="d7-hero"
                  src={ART7.table}
                  alt="Kenji at a stone table in the jungle ruins, the scroll and bronze pieces laid out before him"
                />
              </div>
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              {!d.scDone && <RankPicker ranks={RANKS} value={d.rank} onPick={(rank) => rank !== d.rank && update({ rank, sc: null })} />}
              <div className="d7-host">
                {d.scDone ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="d7-whole" src={ART7.scroll} alt="The whole scroll" />
                ) : d.sc ? (
                  <SlideScroll
                    key={d.sc.id}
                    state={d.sc}
                    rank={d.rank}
                    paused={paused}
                    apiRef={scrollApi}
                    onChange={() => saveDay7(dRef.current)}
                    onSolve={onScrollSolve}
                  />
                ) : null}
              </div>
              {d.scDone && !talking && (
                <div className="qi-fade-enter mt-6">
                  <PlaqueButton nav size="lg" onClick={followRoad}>
                    Follow the road to its end
                  </PlaqueButton>
                </div>
              )}
            </section>
          )}

          {/* ---------------- 2: stillness ---------------- */}
          {stage === 2 && (
            <section aria-label="Stillness">
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              <Stillness done={d.stilled ? 3 : 0} blocked={paused || finale} reducedMotion={RM} apiRef={stillApi} onAllDone={onStill} />
            </section>
          )}

          {/* ---------------- 3: the summary ---------------- */}
          {stage === 3 && (
            <section aria-label="Kenji's Quest is complete" className="qi-fade-enter qi-panel d1-scroll rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kenji-game/poses/round-complete.webp"
                alt="Kenji, head bowed, hands pressed together in quiet acknowledgment"
                className="qi-item-glow mx-auto w-28 sm:w-36"
              />
              <p className="d1-kicker mt-3 text-center">Kenji’s Quest is complete</p>
              <span className="d1-kan d1-kan--sm" lang="ja" role="img" aria-label="Complete (kan)">
                完
              </span>
              <p className="mt-3 leading-relaxed text-[var(--qi-ivory)]/90">
                Kenji came looking for a kingdom and found an almost empty room. His ancestors did not build a road to treasure.
                They built a road toward readiness, and he has walked all of it.
              </p>
              <dl>
                <dt>The assembled scroll</dt>
                <dd>
                  Solved in {d.scMoves} moves
                  <br />
                  <span className="d1-hint">Rank: {RANKS[d.rank].label}</span>
                </dd>
                <dt>Stillness</dt>
                <dd>Fear, grief, and desire, noticed and let pass</dd>
                <dt>What Kenji carries forward</dt>
                <dd>{d.carry ? CARRY[d.carry][1] : ""}</dd>
                <dt>The whole road</dt>
                <dd>The shrine, Kosei, Naomori, the Nest Cliffs, the Broken Passage, the Wall of Waves, and the Green Silence</dd>
                <dt>In the satchel</dt>
                <dd>
                  <div className="d1-endlist">{d.inv.map(fig)}</div>
                </dd>
              </dl>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
                <PlaqueButton nav size="xl" onClick={() => go(4)}>
                  Enter the Sanctuary
                </PlaqueButton>
                <PlaqueButton nav size="sm" dim onClick={onPath}>
                  Return to the Path
                </PlaqueButton>
                <button
                  type="button"
                  onClick={restart}
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--qi-ivory)]/55 underline-offset-4 hover:text-[var(--qi-gold)] hover:underline"
                >
                  Begin Day Seven again
                </button>
              </div>
            </section>
          )}

          {/* ---------------- 4: the Sanctuary ---------------- */}
          {stage === 4 && (
            <section aria-label="The Sanctuary">
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              <div className="d7-daily">
                <b>Today’s trial</b>
                <p>
                  {daily.name} <span className="d1-hint">({daily.sub})</span>
                </p>
                <PlaqueButton nav size="sm" onClick={() => openTrial(daily)}>
                  Begin today’s trial
                </PlaqueButton>
              </div>
              <div className="d7-grid">
                {TRIALS.map((t) => (
                  <button key={t.day} type="button" className="d2-ghost" onClick={() => openTrial(t)}>
                    <b>{t.name}</b>
                    {t.sub}
                  </button>
                ))}
              </div>
              <div className="d2-row">
                <PlaqueButton nav size="xs" dim onClick={() => go(3)}>
                  Back
                </PlaqueButton>
                <PlaqueButton nav size="xs" dim onClick={onPath}>
                  Return to the Path
                </PlaqueButton>
              </div>
            </section>
          )}
        </div>
      </div>

      {prelude && (
        <Prelude
          cls="d7-prelude"
          label="Day Seven opening"
          art={ART7.edge}
          alt="Kenji at the edge of the Aokiri Expanse, where the last road ends at towering jungle"
          kicker="Stage Seven"
          h1="Day Seven"
          dayname="First Light"
          era="Fifteen days on the road. Beyond the last of them, the Aokiri Expanse: the Green Silence."
          button="Enter the Green Silence"
          ready={enterReady}
          on={preOn}
          leaving={preLeaving}
          enterRef={enterRef}
          onEnter={enterSilence}
        />
      )}

      {finale && (
        <Finale
          cls="d7-finale"
          label="The end"
          art={ART7.firstLight}
          alt="Kenji walking out through a sun-carved gate into a morning valley of jungle and waterfalls"
          kicker="Kenji’s Quest: First Light"
          title="First Light"
          era={`The journey was the inheritance. ${CARRY[carry][1]}`}
          on={finOn}
          titled={finTitled}
          leaving={finLeaving}
          onContinue={finContinue}
        />
      )}

      {talking && (
        <Dialogue
          key={talking.id}
          cast={CAST7}
          por={POR7}
          scenes={SCENES7}
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
