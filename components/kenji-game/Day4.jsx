"use client";

import { useEffect, useRef, useState } from "react";
import PlaqueButton from "./PlaqueButton";
import Dialogue from "./Dialogue";
import BeamBoard from "./BeamBoard";
import RouteBoard from "./RouteBoard";
import { Finale, Prelude, RankPicker } from "./DayShots";
import useDay from "./useDay";
import { newBeam, genRoute, ROUTEN } from "./beam-engine";
import { fmtTime } from "./ledger-engine";
import { RANKS } from "./day2-data";
import { ART4, CAST4, HEAD4, POR4, REVEAL, ROUTE_KINDS, ROUTE_STOPS, SCENES4, SCRIPTS4, STEPS4, STORY_BEAMS } from "./day4-data";
import { best4, freshDay4, itemById, loadDay4, saveDay4, writeJourneyDay } from "@/lib/kenjiJourney";
import "./day1.css";
import "./day2.css";
import "./day4.css";

const itemName = (id) => itemById(id)?.name || id;

/* ------------------------------------------------------------------ */
/* The level: the climb, the summit shield and the light of Hikariwake, */
/* and the route the light draws on the bronze plate.                   */
/* ------------------------------------------------------------------ */
export default function Day4({ reducedMotion, onMenu, onComplete, onPath, reviewApi }) {
  const RM = reducedMotion;
  const { initial, d, dRef, update, replace, later, talking, talkingRef, talk, endTalk } = useDay({
    load: loadDay4,
    fresh: freshDay4,
    save: saveDay4,
    scripts: SCRIPTS4,
  });
  const scrollRef = useRef(null);
  const toTop = () => scrollRef.current?.scrollTo({ top: 0 });
  const has = (id) => d.inv.includes(id);
  const stage = d.stage || 1;
  const paused = !!talking;

  const setKday = (n) => {
    if (n > dRef.current.kday) update({ kday: Math.min(5, n) });
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
    const t = setTimeout(() => talk("d4_arrive", () => setEnterReady(true)), RM ? 300 : 3400);
    return () => {
      cancelAnimationFrame(a);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prelude]);
  useEffect(() => {
    if (enterReady) enterRef.current?.querySelector("button")?.focus({ preventScroll: true });
  }, [enterReady]);

  const playClimb = () =>
    talk("d4_climb", () => {
      if (dRef.current.bridge === null) {
        update({ bridge: dRef.current.inv.includes("cord") });
        if (!dRef.current.inv.includes("cord")) setKday(2);
      }
      talk("d4_summit");
    });
  const climb = () => {
    update({ arrived: true });
    setPreLeaving(true);
    later(
      () => {
        setPrelude(false);
        setPreOn(false);
        setPreLeaving(false);
        setEnterReady(false);
        toTop();
        later(playClimb, 300);
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
    writeJourneyDay(4, { inv: [...dRef.current.inv], plate: true, bridge: !!dRef.current.bridge });
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

  /* ---- the light of Hikariwake ---- */
  const beamApi = useRef(null);
  const routeApi = useRef(null);
  // the puzzle in progress: make it when the stage needs one
  useEffect(() => {
    if (!d.arrived || stage !== 1 || d.lvl >= 4 || d.bm) return;
    const i = d.lvl;
    const flint = d.inv.includes("flint");
    const bm = { ...newBeam(d.rank, i === 3 ? (flint ? 1 : 2) : i === 2 ? 1 : 0), lvl: i };
    if (i === 3 && flint) bm.prelit = Object.keys(bm.L.cells).filter((k) => bm.L.cells[k].t === "stone").slice(0, 1);
    update({ bm });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.arrived, stage, d.lvl, d.bm]);
  useEffect(() => {
    if (!d.arrived || stage !== 2 || d.pic >= 3 || d.rt) return;
    const i = d.pic;
    update({ rt: { ...genRoute(ROUTEN[d.rank] + (i === 2 ? 1 : 0), i + 1), pi: i } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.arrived, stage, d.pic, d.rt]);

  const afterSignal = () => talk("d4_signal", () => update({ lvl: 4, bm: null, plate: true }));
  const onBeamSolve = (s) => {
    const cur = dRef.current;
    const i = cur.lvl;
    const times = [...cur.times];
    times[i] = s;
    update({ times });
    setKday(i >= 2 ? 3 : 2);
    if (i < 3) later(() => update({ lvl: i + 1, bm: null }), RM ? 400 : 1600);
    else later(afterSignal, 1000);
  };

  /* ---- trace the route ---- */
  const [justSolved, setJustSolved] = useState(-1);
  const onRouteSolve = (s) => {
    const cur = dRef.current;
    const i = cur.pic;
    const ntimes = [...cur.ntimes];
    ntimes[i] = s;
    update({ ntimes });
    setKday(4);
    later(() => setJustSolved(i), 600);
    const next = () =>
      later(
        () => {
          setJustSolved(-1);
          update({ pic: i + 1, rt: null });
        },
        RM ? 400 : 2200,
      );
    if (i === 0) later(() => talk("d4_watched", next), 1800);
    else if (i === 2)
      later(
        () =>
          talk("d4_route", () => {
            setJustSolved(-1);
            update({ pic: 3, rt: null });
          }),
        1800,
      );
    else next();
  };
  const startDown = () => {
    setKday(5);
    runFinale();
  };

  // coming back mid-Day: finish what was left half done
  useEffect(() => {
    const cur = initial;
    if (cur.arrived && (cur.stage || 1) === 1 && !(cur.seen && cur.seen.d4_climb)) later(playClimb, 500);
    if (cur.bm && cur.bm.solvedAt) {
      if (cur.lvl < 3) update({ lvl: cur.lvl + 1, bm: null });
      else if (cur.lvl === 3) later(afterSignal, 400);
    }
    if (cur.rt && cur.rt.solvedAt) update({ pic: cur.pic + 1, rt: null });
    if (cur.done && (cur.stage || 1) >= 3) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restart = () => {
    replace(freshDay4());
    setJustSolved(-1);
    setPrelude(true);
    setPreOn(false);
    setEnterReady(false);
    requestAnimationFrame(toTop);
  };

  /* ---- practice ---- */
  const [practice, setPractice] = useState(null);
  const [pnote, setPnote] = useState("");
  const newPracticeBeam = () => {
    setPnote("");
    setPractice({ kind: "beam", id: Date.now(), state: newBeam(dRef.current.rank, dRef.current.rank === "master" ? 2 : 1) });
  };
  const newPracticeRoute = () => {
    setPnote("");
    setPractice({ kind: "route", id: Date.now(), state: genRoute(ROUTEN[dRef.current.rank] + 1, 3) });
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
        if (stage === 2 || (practice && practice.kind === "route" && stage === 4)) routeApi.current?.solve();
        else beamApi.current?.solve();
      },
      talk(key) {
        talk(key, null, true);
      },
      enter() {
        if (prelude && enterReady) climb();
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
  const HEAD = HEAD4[stage];
  const fig = (id) => (
    <figure key={id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={itemById(id).img} alt="" />
      {itemName(id)}
    </figure>
  );
  const bestT = best4.load();
  const ranks = (onPick) => <RankPicker ranks={RANKS} value={d.rank} onPick={onPick} />;
  const progLine =
    stage === 1
      ? d.lvl >= 4
        ? "Every stone is lit"
        : `${STORY_BEAMS[d.lvl]}, ${d.lvl + 1} of 4`
      : stage === 2
      ? d.pic >= 3
        ? "The whole route traced"
        : `${ROUTE_STOPS[d.pic]}, ${d.pic + 1} of 3`
      : "";

  return (
    <div className="d1 d2 d4 absolute inset-0">
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto">
        <div className="qi-fade-enter mx-auto max-w-5xl px-5 pb-16 pt-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <PlaqueButton nav size="xs" onClick={onMenu}>
              &larr; Menu
            </PlaqueButton>
          </div>

          <header className="mt-6 text-center">
            <p className="d1-kicker">Stage Four &middot; Day Four: The Era of Perspective</p>
            <h2 className="d1-title mt-2 text-2xl sm:text-4xl">{HEAD.title}</h2>
            <span
              aria-hidden="true"
              className="mt-1 block font-tribal text-2xl text-[var(--qi-gold)] sm:text-3xl"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.85), 0 0 16px rgba(214,166,75,0.4)" }}
            >
              {HEAD.kanji}
            </span>
            <p className="d2-kday">Seven days on the road. Day {d.kday} of 5 on the cliffs.</p>
          </header>

          {stage < 3 && (
            <ol className="d1-trail" aria-label="Day Four steps">
              {STEPS4.map((s, i) => (
                <li key={s} className={i + 1 < stage ? "done" : i + 1 === stage ? "now" : ""}>
                  <b>{i + 1}</b>
                  {s}
                </li>
              ))}
            </ol>
          )}

          {/* ---------------- 1: the light of Hikariwake ---------------- */}
          {stage === 1 && (
            <section aria-label="The light of Hikariwake">
              <div className="d1-frame mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="d4-hero" src={ART4.summit} alt="Kenji, blade drawn, before the great bronze shield in the summit temple" />
              </div>
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              <p className="d2-prog">{progLine}</p>
              <div className="d4-host d4-host--beam">
                {d.lvl >= 4 ? (
                  <p className="d4-msg">The shield blazes, and the ridge answers it stone by stone.</p>
                ) : d.bm && d.bm.lvl === d.lvl ? (
                  <BeamBoard
                    key={d.bm.id}
                    state={d.bm}
                    finalShield={d.lvl === 3}
                    paused={paused}
                    apiRef={beamApi}
                    onChange={() => saveDay4(dRef.current)}
                    onSolve={onBeamSolve}
                  />
                ) : null}
              </div>
              {d.lvl >= 4 && !talking && (
                <div className="qi-fade-enter mt-6">
                  <PlaqueButton nav size="lg" onClick={() => go(2)}>
                    Trace the route the light reveals
                  </PlaqueButton>
                </div>
              )}
            </section>
          )}

          {/* ---------------- 2: trace the route ---------------- */}
          {stage === 2 && (
            <section aria-label="Trace the route">
              <div className="d1-frame mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="d4-hero"
                  src={ART4.plateRoute}
                  alt="Kenji holds the glowing bronze plate beside the blazing shield; beams of light run across the land below"
                />
              </div>
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              <p className="d2-prog">{progLine}</p>
              <div className="d4-host d4-host--route">
                {d.pic >= 3 ? (
                  <div className="d4-gallery">
                    {ROUTE_KINDS.map((k) => (
                      <figure key={k.id}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={k.img} alt={k.name} />
                        <figcaption>{k.name}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : d.rt && d.rt.pi === d.pic ? (
                  <>
                    <RouteBoard
                      key={d.rt.id}
                      state={d.rt}
                      rank={d.rank}
                      paused={paused}
                      apiRef={routeApi}
                      onChange={() => saveDay4(dRef.current)}
                      onSolve={onRouteSolve}
                    />
                    {justSolved === d.pic && (
                      <figure className="d4-reveal on">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={REVEAL[d.pic]} alt={ROUTE_KINDS[d.pic].name} />
                        <figcaption>{ROUTE_KINDS[d.pic].name}</figcaption>
                      </figure>
                    )}
                  </>
                ) : null}
              </div>
              {d.pic >= 3 && !talking && (
                <div className="qi-fade-enter mt-6">
                  <PlaqueButton nav size="lg" onClick={startDown}>
                    Start down the cliffs
                  </PlaqueButton>
                </div>
              )}
            </section>
          )}

          {/* ---------------- 3: the summary ---------------- */}
          {stage === 3 && (
            <section aria-label="Day Four complete" className="qi-fade-enter qi-panel d1-scroll rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kenji-game/poses/round-complete.webp"
                alt="Kenji, head bowed, hands pressed together in quiet acknowledgment"
                className="qi-item-glow mx-auto w-28 sm:w-36"
              />
              <p className="d1-kicker mt-3 text-center">Stage Four complete</p>
              <span className="d1-kan d1-kan--sm" lang="ja" role="img" aria-label="Complete (kan)">
                完
              </span>
              <p className="mt-3 leading-relaxed text-[var(--qi-ivory)]/90">
                Day Four is ended. Kenji’s blade turned out to be a key. The summit shield it woke bears the same sun as his
                breastplate, and from its heart he took a bronze map plate left by his house. The signal has been seen across
                the Reach, in Kosei and in the broken hills alike. He is no longer being followed in secret.
              </p>
              <dl>
                <dt>The light of Hikariwake</dt>
                <dd>
                  Three signal stones and the summit shield lit
                  <br />
                  <span className="d1-hint">
                    Times: {d.times.map(fmtTime).join(", ")} &middot; Rank: {RANKS[d.rank].label}
                    {has("flint") ? " · the beacon lit by hand with flint" : ""}
                  </span>
                </dd>
                <dt>The route on the plate</dt>
                <dd>
                  {ROUTE_KINDS.map((k) => k.name).join(", ")}
                  <br />
                  <span className="d1-hint">Times: {d.ntimes.map(fmtTime).join(", ")}</span>
                </dd>
                <dt>Retrieved</dt>
                <dd>
                  <div className="d1-endlist">
                    <figure>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ART4.plate} alt="" />
                      Bronze map plate
                    </figure>
                  </div>
                  <span className="d1-hint">From the heart of the summit shield, which bears the same sun as Kenji’s breastplate</span>
                </dd>
                <dt>The broken bridge</dt>
                <dd>{d.bridge ? "Mended with the red hilt cord." : "Crossed the long way around, at the cost of a day."}</dd>
                <dt>Time on the cliffs</dt>
                <dd>Five days</dd>
                <dt>In the satchel</dt>
                <dd>
                  <div className="d1-endlist">{d.inv.map(fig)}</div>
                </dd>
                <dt>Next</dt>
                <dd>
                  Day Five: The Era of Confrontation
                  <br />
                  <span className="text-sm text-[var(--qi-ivory)]/60">Six days on the road to the Broken Passage</span>
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
                  Practice on the cliffs
                </PlaqueButton>
                <button
                  type="button"
                  onClick={restart}
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--qi-ivory)]/55 underline-offset-4 hover:text-[var(--qi-gold)] hover:underline"
                >
                  Begin Day Four again
                </button>
              </div>
            </section>
          )}

          {/* ---------------- 4: practice ---------------- */}
          {stage === 4 && (
            <section aria-label="Practice on the cliffs">
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              {ranks((k) => {
                update({ rank: k });
                setPractice(null);
              })}
              <div className="d2-row mt-4">
                <PlaqueButton nav size="sm" onClick={newPracticeBeam}>
                  New light puzzle
                </PlaqueButton>
                <PlaqueButton nav size="sm" dim onClick={newPracticeRoute}>
                  New route
                </PlaqueButton>
                <PlaqueButton nav size="xs" dim onClick={() => go(3)}>
                  Back to summary
                </PlaqueButton>
              </div>
              <p className="d1-hint mt-3">
                Best light times:{" "}
                {Object.entries(RANKS)
                  .map(([k, r]) => `${r.label} ${fmtTime(bestT[`b_${k}`])}`)
                  .join(" · ")}
                . Best route times:{" "}
                {Object.entries(RANKS)
                  .map(([k, r]) => `${r.label} ${fmtTime(bestT[`n_${k}`])}`)
                  .join(" · ")}
              </p>
              {practice && practice.kind === "beam" && (
                <div className="d4-host d4-host--beam mt-4">
                  <BeamBoard
                    key={practice.id}
                    state={practice.state}
                    finalShield
                    paused={paused}
                    apiRef={beamApi}
                    onChange={() => {}}
                    onSolve={(s) => {
                      const b = best4.set(`b_${practice.state.rank}`, s);
                      setPnote(`Lit in ${fmtTime(s)}. Best ${RANKS[practice.state.rank].label} time: ${fmtTime(b)}.`);
                    }}
                  />
                  {pnote ? <p className="d2-msg mt-3">{pnote}</p> : null}
                </div>
              )}
              {practice && practice.kind === "route" && (
                <div className="d4-host d4-host--route mt-4">
                  <RouteBoard
                    key={practice.id}
                    state={practice.state}
                    rank={d.rank}
                    paused={paused}
                    apiRef={routeApi}
                    onChange={() => {}}
                    onSolve={(s) => {
                      const b = best4.set(`n_${d.rank}`, s);
                      setPnote(`Traced in ${fmtTime(s)}. Best ${RANKS[d.rank].label} time: ${fmtTime(b)}.`);
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
          cls="d4-prelude"
          label="Day Four opening"
          art={ART4.approach}
          alt="Kenji on a high ledge at sunrise, the Nest Cliffs rising out of the clouds, nests on every spire and an eagle overhead"
          kicker="Stage Four"
          h1="Day Four"
          dayname="The Era of Perspective"
          era="Seven days on the road. Up here the whole Reach lies open, and nothing can hide. Not even you."
          button="Climb the cliffs"
          ready={enterReady}
          on={preOn}
          leaving={preLeaving}
          enterRef={enterRef}
          onEnter={climb}
        />
      )}

      {finale && (
        <Finale
          cls="d4-finale"
          label="Day Four closing"
          art={ART4.approach}
          alt="The cliffs at evening, the way down toward a windswept plain"
          kicker="Stage Four complete"
          title="The era of perspective closes"
          era="Five days on the cliffs. The way down leads to the Broken Passage."
          on={finOn}
          titled={finTitled}
          leaving={finLeaving}
          onContinue={finContinue}
        />
      )}

      {talking && (
        <Dialogue
          key={talking.id}
          cast={CAST4}
          por={POR4}
          scenes={SCENES4}
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
