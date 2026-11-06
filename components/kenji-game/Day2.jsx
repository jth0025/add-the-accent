"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PlaqueButton from "./PlaqueButton";
import Dialogue from "./Dialogue";
import Ledger from "./Ledger";
import { fmtTime, newLedgerState, rand } from "./ledger-engine";
import {
  ART2,
  CAST2,
  HEAD2,
  HINT,
  POR2,
  RANKS,
  SCENES,
  SCRIPTS2,
  STALLS,
  STEPS2,
  VIGN,
  WORDS,
} from "./day2-data";
import {
  SLOTS,
  freshDay2,
  itemById,
  loadBest,
  loadDay2,
  recordBest,
  saveDay2,
  writeJourney2,
} from "@/lib/kenjiJourney";
import "./day1.css";
import "./day2.css";

const itemName = (id) => itemById(id)?.name || id;

/* ------------------------------------------------------------------ */
/* The level: the Warden's ledgers, the archives, the market, the road */
/* out of Kosei.                                                       */
/* ------------------------------------------------------------------ */
export default function Day2({ reducedMotion, onMenu, onComplete, onPath, reviewApi }) {
  const RM = reducedMotion;
  const initial = useRef(null);
  if (initial.current === null) initial.current = loadDay2() || freshDay2();

  const [d, setD] = useState(initial.current);
  const dRef = useRef(initial.current);
  const update = useCallback((patch) => {
    const next = typeof patch === "function" ? patch(dRef.current) : { ...dRef.current, ...patch };
    dRef.current = next;
    saveDay2(next);
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
  const noFlute = !has("flute");

  /* ---- the Day count ---- */
  const setKday = (n) => {
    if (n > dRef.current.kday) update({ kday: Math.min(9, n) });
  };

  /* ---- dialogue ---- */
  const [talking, setTalking] = useState(null);
  const talkingRef = useRef(null);
  const talk = useCallback(
    (key, done, force = false) => {
      const cur = dRef.current;
      if (!SCRIPTS2[key] || (!force && cur.seen && cur.seen[key])) {
        if (done) done();
        return;
      }
      if (!force) update((s) => ({ ...s, seen: { ...(s.seen || {}), [key]: true } }));
      const lines = SCRIPTS2[key].filter((l) => !l.if || l.if(dRef.current));
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

  /* ---- shots: the gate, the road out ---- */
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

  /* ---- ledgers ---- */
  const ledgerApi = useRef(null);
  const [l3Ready, setL3Ready] = useState(false);
  const paused = !!talking || prelude || finale;

  const ensureLedger = (which, force = false) => {
    const cur = dRef.current;
    if (!force && cur.lg && cur.lg.which === which) return cur.lg;
    const lg =
      which === 1
        ? { ...newLedgerState("initiate", 6, 16), which, id: Date.now() }
        : { ...newLedgerState(cur.rank), which, id: Date.now() };
    update({ lg });
    return lg;
  };

  const go = (n) => {
    update({ stage: n });
    requestAnimationFrame(toTop);
    if (n === 1) ensureLedger(1);
    if (n === 2) {
      const cur = dRef.current;
      if (cur.lgDone < 3) ensureLedger(cur.lgDone >= 2 ? 3 : 2);
      setL3Ready(cur.lgDone >= 3 || !!(cur.lg && cur.lg.solvedAt));
      later(() => talk("d2_l2"), 250);
    }
    if (n === 3) {
      setKday(7);
      later(
        () =>
          talk("d2_market", () => {
            if (!dRef.current.inv.includes("flute") && !hgRef.current) startHaggle(STALLS[0], "flute", 3);
          }),
        250,
      );
    }
    if (n === 4) writeJourney2(dRef.current);
  };

  /* ---- arrival ---- */
  useEffect(() => {
    if (!prelude) return undefined;
    const a = requestAnimationFrame(() => requestAnimationFrame(() => setPreOn(true)));
    const t = setTimeout(
      () => talk("d2_arrive", () => setEnterReady(true)),
      RM ? 300 : 3400,
    );
    return () => {
      cancelAnimationFrame(a);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prelude]);

  useEffect(() => {
    if (enterReady) enterRef.current?.querySelector("button")?.focus({ preventScroll: true });
  }, [enterReady]);

  const enterKosei = () => {
    update({ arrived: true });
    setPreLeaving(true);
    later(
      () => {
        setPrelude(false);
        setPreOn(false);
        setPreLeaving(false);
        setEnterReady(false);
        toTop();
        later(() => talk("d2_warden"), 300);
      },
      RM ? 0 : 1300,
    );
  };

  // Coming back mid-Day: set the stage up again.
  useEffect(() => {
    const cur = initial.current;
    if (cur.arrived) {
      const st = cur.stage || 1;
      if (st === 1) {
        ensureLedger(1);
        if (!(cur.seen && cur.seen.d2_warden)) later(() => talk("d2_warden"), 500);
      }
      if (st === 2) {
        if (cur.lgDone < 3) ensureLedger(cur.lgDone >= 2 ? 3 : 2);
        setL3Ready(cur.lgDone >= 3 || !!(cur.lg && cur.lg.solvedAt));
        later(() => talk("d2_l2"), 400);
      }
      if (st === 3) later(() => go(3), 200);
    } else {
      ensureLedger(1);
    }
    if (cur.done && (cur.stage || 1) === 4) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- ledger I ---- */
  const onSolve1 = (s) => {
    const cur = dRef.current;
    const times = [...cur.times];
    times[0] = s;
    update({ lgDone: Math.max(cur.lgDone, 1), times });
    recordBest(cur.lg.rank, s);
    setKday(2);
    later(() => talk("d2_l1"), 900);
  };

  /* ---- ledgers II and III ---- */
  const onSolve3 = (s) => {
    const cur = dRef.current;
    const which = cur.lg.which;
    const times = [...cur.times];
    times[which - 1] = s;
    update({ lgDone: which, times });
    recordBest(cur.lg.rank, s);
    setKday(which === 2 ? 4 : 6);
    setL3Ready(false);
    if (which === 2) later(() => talk("d2_l2b"), 900);
    if (which === 3) later(() => talk("d2_reveal", () => setL3Ready(true)), 900);
    else later(() => setL3Ready(true), 700);
  };
  const pickRank = (rank) => {
    const cur = dRef.current;
    update({ rank });
    // Before a first move the board is simply drawn again at the new rank.
    if (cur.stage === 2 && cur.lgDone < 3 && cur.lg && !cur.lg.cur.some((v, i) => v && !cur.lg.puz[i])) {
      const lg = { ...newLedgerState(rank), which: cur.lg.which, id: Date.now() };
      update({ rank, lg });
    }
  };
  const nextLedger = () => {
    const cur = dRef.current;
    if (cur.lgDone >= 3) {
      talk("d2_archive", () => go(3));
      return;
    }
    setL3Ready(false);
    ensureLedger(cur.lgDone >= 2 ? 3 : 2, true);
  };

  /* ---- the market ---- */
  const [hg, setHg] = useState(null);
  const hgRef = useRef(null);
  const setHaggle = (v) => {
    hgRef.current = v;
    setHg(v);
  };
  const [mHint, setMHint] = useState("");

  function startHaggle(stall, id, price) {
    const cur = dRef.current;
    const pool = WORDS[cur.rank];
    const [word, clue] = pool[rand(pool.length)];
    setHaggle({
      stall: stall.id,
      id,
      base: price,
      word,
      clue,
      guessed: [],
      wrong: 0,
      swap: null,
      over: false,
      needSwap: cur.inv.length >= SLOTS,
      result: "",
    });
    setMHint("");
    if (stall.id === "reed") {
      // First time: the full introduction (once); after that a shorter hello.
      if (cur.seen && cur.seen.d2_reed) talk("d2_reed_again", null, true);
      else talk("d2_reed");
    }
    if (stall.id === "potter") talk("d2_potter");
  }

  const guess = useCallback(
    (ch, free) => {
      const h = hgRef.current;
      if (!h || h.over || h.guessed.includes(ch)) return;
      const next = { ...h, guessed: [...h.guessed, ch] };
      if (!next.word.includes(ch) && !free) next.wrong += 1;
      const solved = next.word.split("").every((c) => c === " " || next.guessed.includes(c));
      const price = next.base + next.wrong;
      if (solved || next.wrong >= 6) {
        next.over = true;
        let cur = dRef.current;
        const haggles = cur.haggles + 1;
        let patch = { haggles };
        if (haggles % 2 === 0) patch.kday = Math.max(cur.kday, Math.min(8, cur.kday + 1));
        if (solved && price <= cur.purse) {
          let inv = [...cur.inv, next.id];
          const sold = [...cur.sold];
          if (next.swap) {
            inv = inv.filter((x) => x !== next.swap);
            sold.push(next.swap);
          }
          patch = { ...patch, purse: cur.purse - price, inv, bought: [...cur.bought, next.id], sold };
          next.result = `“${next.word.charAt(0)}${next.word.slice(1).toLowerCase()}.” Bargain struck for ${price} coins. ${itemName(next.id)} goes into the satchel${
            next.swap ? `, and the ${itemName(next.swap).toLowerCase()} stays at the stall.` : "."
          }`;
        } else if (solved) {
          next.result = `You guessed it, but the price has climbed to ${price} coins and your purse holds ${cur.purse}. The merchant shrugs. Come back with more.`;
        } else {
          next.result = "Six wrong letters. The merchant laughs and waves you off for the day.";
        }
        // The reed-seller stands up again to close the exchange.
        if (next.stall === "reed") {
          const key = next.result.startsWith("Six")
            ? "d2_reed_lose"
            : next.result.includes("goes into the satchel")
            ? "d2_reed_win"
            : "d2_reed_short";
          later(() => talk(key, null, true), 900);
        }
        cur = update({ ...cur, ...patch });
      }
      setHaggle(next);
    },
    [update, later, talk],
  );

  useEffect(() => {
    const onKey = (e) => {
      const h = hgRef.current;
      if (stage !== 3 || !h || h.over || (h.needSwap && !h.swap) || talking) return;
      if (/^[a-z]$/i.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) guess(e.key.toUpperCase());
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [stage, talking, guess]);

  const spendKind = () => {
    const h = hgRef.current;
    if (!h) return;
    const left = [...new Set(h.word.replace(/ /g, "").split(""))].filter((ch) => !h.guessed.includes(ch));
    if (left.length) {
      update({ kind: dRef.current.kind - 1 });
      guess(left[rand(left.length)], true);
    }
  };

  const trade = (t) => {
    const cur = dRef.current;
    if (t === "sellw") {
      update({ inv: cur.inv.filter((x) => x !== "whetstone"), sold: [...cur.sold, "whetstone"], purse: cur.purse + 4 });
      setMHint("The ironmonger tests the stone with his thumb and pays four coins.");
    }
    if (t === "sellr") {
      update({ inv: cur.inv.filter((x) => x !== "rice"), sold: [...cur.sold, "rice"], purse: cur.purse + 2 });
      setMHint("The rice stall buys them back for two coins.");
    }
    if (t === "share") {
      update({ inv: cur.inv.filter((x) => x !== "rice"), shared: true, kind: cur.kind + 2 });
      setMHint("The children’s mother insists on repaying you. Merchants on this street will give you two free letters.");
    }
  };

  /* ---- leaving Kosei ---- */
  const runFinale = () => {
    setFinale(true);
    setFinOn(false);
    setFinTitled(false);
    setFinLeaving(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setFinOn(true)));
    later(() => talk("d2_end", () => setFinTitled(true), true), RM ? 300 : 3000);
  };
  const leaveMarket = () => {
    const cur = dRef.current;
    if (!cur.inv.includes("flute")) {
      setMHint("The grove will not open without music. Bargain with the reed-seller first.");
      talk("d2_needreed", null, true);
      return;
    }
    setHaggle(null);
    setKday(9);
    talk(cur.inv.includes("cord") ? "d2_recog_cord" : "d2_recog_walk", runFinale, true);
  };
  const finContinue = () => {
    setFinLeaving(true);
    update({ done: true });
    writeJourney2(dRef.current);
    onComplete();
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

  const restart = () => {
    const fresh = { ...freshDay2() };
    dRef.current = fresh;
    saveDay2(fresh);
    setD(fresh);
    setHaggle(null);
    setMHint("");
    setL3Ready(false);
    setPrelude(true);
    setPreOn(false);
    setEnterReady(false);
    ensureLedger(1);
    requestAnimationFrame(toTop);
  };

  /* ---- practice ---- */
  const [practice, setPractice] = useState(null); // { kind: 'ledger'|'word', ... }
  const newPracticeLedger = () => {
    const state = { ...newLedgerState(dRef.current.rank), which: 0, id: Date.now() };
    setPractice({ kind: "ledger", state, note: "" });
  };
  const newPracticeWord = () => {
    const pool = WORDS[dRef.current.rank];
    const [word, clue] = pool[rand(pool.length)];
    setPractice({ kind: "word", word, clue, guessed: [], wrong: 0, over: false });
  };
  const practiceGuess = (ch) => {
    setPractice((p) => {
      if (!p || p.over || p.guessed.includes(ch)) return p;
      const guessed = [...p.guessed, ch];
      const wrong = p.wrong + (p.word.includes(ch) ? 0 : 1);
      const solved = p.word.split("").every((c) => c === " " || guessed.includes(c));
      return { ...p, guessed, wrong, over: solved || wrong >= 6 };
    });
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
        const h = hgRef.current;
        if (stage === 3 && h && !h.over && (!h.needSwap || h.swap)) {
          const letters = [...new Set(h.word.replace(/ /g, "").split(""))];
          const rest = letters.filter((ch) => !h.guessed.includes(ch));
          if (!rest.length) return;
          const nx = { ...h, guessed: [...h.guessed, ...rest.slice(0, -1)] };
          setHaggle(nx);
          hgRef.current = nx;
          setTimeout(() => guess(rest[rest.length - 1], true), 0);
          return;
        }
        ledgerApi.current?.solve();
      },
      flute() {
        const cur = dRef.current;
        if (!cur.inv.includes("flute")) update({ inv: [...cur.inv, "flute"] });
      },
      enter() {
        if (prelude && enterReady) enterKosei();
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
  const HEAD = HEAD2[stage];
  const fig = (id) => (
    <figure key={id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={itemById(id).img} alt="" />
      {itemName(id)}
    </figure>
  );
  const best = loadBest();
  const lg = d.lg;
  const lgKey = lg ? `${lg.which}-${lg.id}` : "none";
  const onChangeLedger = () => saveDay2(dRef.current);

  const wordRow = (word, guessed, over, solved) =>
    word.split(" ").map((w, wi) => (
      <span className="w" key={wi}>
        {w.split("").map((ch, ci) => (
          <span key={ci} className={`l${over && !solved && !guessed.includes(ch) ? " miss" : ""}`}>
            {guessed.includes(ch) || over ? ch : " "}
          </span>
        ))}
      </span>
    ));
  const keyboard = (guessed, word, onPick) => (
    <div className="d2-kb">
      {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((ch) => {
        const used = guessed.includes(ch);
        return (
          <button
            key={ch}
            type="button"
            disabled={used}
            className={used ? (word.includes(ch) ? "hit" : "no") : ""}
            onClick={() => onPick(ch)}
          >
            {ch}
          </button>
        );
      })}
    </div>
  );

  const renderMarket = () => {
    const vign = VIGN[d.haggles % VIGN.length];
    const trades = [];
    if (has("whetstone"))
      trades.push(
        <button key="sw" type="button" className="d2-ghost" onClick={() => trade("sellw")}>
          Sell the whetstone (+4 coins)
        </button>,
      );
    if (has("rice") && !d.shared) {
      trades.push(
        <button key="sr" type="button" className="d2-ghost" onClick={() => trade("sellr")}>
          Sell the rice cakes (+2 coins)
        </button>,
        <button key="sh" type="button" className="d2-ghost" onClick={() => trade("share")}>
          Share the rice cakes with the children
        </button>,
      );
    }
    return (
      <>
        <div className="d2-purse">
          <span>
            Purse <b>{d.purse}</b> coins
          </span>
          <span>
            Satchel {d.inv.length} of {SLOTS}
          </span>
          {d.kind ? (
            <span>
              Kindness owed to you: {d.kind} free letter{d.kind > 1 ? "s" : ""}
            </span>
          ) : null}
        </div>
        <p className="d2-vign">
          {vign}
          {d.haggles === 2 ? " A man in a dark hat watches from the far side of the canal. When Kenji looks again, he is gone." : ""}
        </p>
        <div className="d2-stalls">
          {STALLS.map((s) => (
            <div className="d2-stall" key={s.id}>
              {s.face && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="av" src={POR2[s.face]} alt="" />
              )}
              <h3>{s.name}</h3>
              <p>{s.where}</p>
              {s.wares.map(([id, price]) => {
                const own = has(id);
                return (
                  <div className={`d2-ware${id === "flute" && !own ? " need" : ""}`} key={id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={itemById(id).img} alt="" />
                    <span>
                      {itemName(id)}
                      <small>{own ? "Already in your satchel" : `Asking ${price} coins`}</small>
                    </span>
                    {own ? null : (
                      <button type="button" className="d2-ghost" onClick={() => startHaggle(s, id, price)}>
                        Bargain
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {trades.length ? <div className="d2-trades">{trades}</div> : null}
      </>
    );
  };

  const renderHaggle = () => {
    const h = hg;
    const s = STALLS.find((x) => x.id === h.stall);
    const price = h.base + h.wrong;
    const solved = h.word.split("").every((c) => c === " " || h.guessed.includes(c));
    const shortName = s.name.replace("The ", "the ");
    return (
      <div className="d2-hg">
        <div className={`d2-hgtop${s.face ? " merch" : ""}`}>
          {s.face && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="mp" src={POR2[s.face]} alt="" />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={itemById(h.id).img} alt="" />
          <div>
            <h3>
              {s.name}: {itemName(h.id)}
            </h3>
            <p>
              {s.greet} {HINT[d.rank]}.
            </p>
          </div>
        </div>
        {h.needSwap && !h.swap ? (
          <>
            <p className="d2-lede">
              Your satchel is full. If the bargain succeeds, what will you leave with {shortName} in exchange?
            </p>
            <div className="d2-swap">
              {d.inv
                .filter((x) => x !== "scroll")
                .map((x) => (
                  <button key={x} type="button" className="d2-ghost" onClick={() => setHaggle({ ...h, swap: x })}>
                    {itemName(x)}
                  </button>
                ))}
            </div>
            <div className="mt-5">
              <button type="button" className="d2-ghost" onClick={() => setHaggle(null)}>
                Walk away
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="d2-clue">
              <span>{s.name}&rsquo;s hint</span>
              &ldquo;{h.clue}&rdquo;
            </p>
            <div className="d2-word" aria-live="polite">
              {wordRow(h.word, h.guessed, h.over, solved)}
            </div>
            <div className="d2-price">
              <span>Price</span>
              <span className="coins">
                {Array.from({ length: price }, (_, k) => (
                  <i key={k} className={k >= h.base ? "up" : ""} />
                ))}
              </span>
              <span>
                {price} coins &middot; your purse {d.purse}
              </span>
              <span>Wrong letters {h.wrong} of 6</span>
            </div>
            {h.over ? (
              <>
                <p className="d2-msg">{h.result}</p>
                <div className="mt-4">
                  <PlaqueButton nav size="md" onClick={() => setHaggle(null)}>
                    Back to the stalls
                  </PlaqueButton>
                </div>
              </>
            ) : (
              <>
                {keyboard(h.guessed, h.word, (ch) => guess(ch))}
                <div className="d2-row mt-4">
                  {d.kind ? (
                    <button type="button" className="d2-ghost" onClick={spendKind}>
                      Use a free letter ({d.kind})
                    </button>
                  ) : null}
                  <button type="button" className="d2-ghost" onClick={() => setHaggle(null)}>
                    Walk away
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const ranks = (onPick) => (
    <div className="d2-ranks" role="radiogroup" aria-label="Rank">
      {Object.entries(RANKS).map(([k, r]) => (
        <button
          key={k}
          type="button"
          role="radio"
          aria-checked={d.rank === k}
          className="d2-ghost"
          onClick={() => onPick(k)}
        >
          {r.label}
          {k === "initiate" ? " (six emblems)" : " (nine emblems)"}
        </button>
      ))}
    </div>
  );

  const l3Which = lg && lg.which >= 2 ? lg.which : d.lgDone >= 2 ? 3 : 2;
  const l3Solved = !!(lg && lg.solvedAt);

  return (
    <div className="d1 d2 absolute inset-0">
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto">
        <div className="qi-fade-enter mx-auto max-w-5xl px-5 pb-16 pt-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <PlaqueButton nav size="xs" onClick={onMenu}>
              &larr; Menu
            </PlaqueButton>
          </div>

          <header className="mt-6 text-center">
            <p className="d1-kicker">Stage Two &middot; Day Two: The Era of Proof</p>
            <h2 className="d1-title mt-2 text-2xl sm:text-4xl">{HEAD.title}</h2>
            <span
              aria-hidden="true"
              className="mt-1 block font-tribal text-2xl text-[var(--qi-gold)] sm:text-3xl"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.85), 0 0 16px rgba(214,166,75,0.4)" }}
            >
              {HEAD.kanji}
            </span>
            <p className="d2-kday">Four days on the road. Day {d.kday} of 9 in Kosei.</p>
          </header>

          {stage < 4 && (
            <ol className="d1-trail" aria-label="Day Two steps">
              {STEPS2.map((s, i) => (
                <li key={s} className={i + 1 < stage ? "done" : i + 1 === stage ? "now" : ""}>
                  <b>{i + 1}</b>
                  {s}
                </li>
              ))}
            </ol>
          )}

          {/* ---------------- 1: the Warden's ledger ---------------- */}
          {stage === 1 && (
            <section aria-label="The Warden's ledger">
              <div className="d1-frame mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="d2-hero"
                  src={ART2.chamber}
                  alt="The Warden's chamber at sunset: Kenji stands before the Warden, who looks out over the coast, with guards at either side and a ledger board on the table"
                />
              </div>
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              <div className="d2-host">
                {lg && lg.which === 1 && (
                  <Ledger
                    key={lgKey}
                    state={lg}
                    notesAllowed={has("brush")}
                    conflicts={RANKS[lg.rank].conf}
                    paused={paused}
                    apiRef={ledgerApi}
                    onChange={onChangeLedger}
                    onSolve={onSolve1}
                  />
                )}
              </div>
              {d.lgDone >= 1 && !talking && (
                <div className="qi-fade-enter mt-6">
                  <PlaqueButton nav size="lg" onClick={() => go(2)}>
                    The next day
                  </PlaqueButton>
                </div>
              )}
            </section>
          )}

          {/* ---------------- 2: the last ledgers ---------------- */}
          {stage === 2 && (
            <section aria-label="The last ledgers">
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              {d.lgDone < 3 && !l3Solved && ranks(pickRank)}
              <p className="d2-prog">
                {d.lgDone >= 3
                  ? "All three ledgers kept"
                  : l3Which === 2
                  ? "Ledger two of three: the Warden’s"
                  : "Ledger three of three: the unfinished ledger, open for twenty years"}
              </p>
              <div className="d2-host">
                {lg && lg.which >= 2 && (
                  <Ledger
                    key={lgKey}
                    state={lg}
                    notesAllowed={has("brush")}
                    conflicts={RANKS[lg.rank].conf}
                    paused={paused}
                    apiRef={ledgerApi}
                    onChange={onChangeLedger}
                    onSolve={onSolve3}
                  />
                )}
              </div>
              {(l3Ready || d.lgDone >= 3) && !talking && (
                <div className="qi-fade-enter mt-6">
                  <PlaqueButton nav size="lg" onClick={nextLedger}>
                    {d.lgDone >= 3 ? "Go to the archives" : "Next ledger"}
                  </PlaqueButton>
                </div>
              )}
            </section>
          )}

          {/* ---------------- 3: the market ---------------- */}
          {stage === 3 && (
            <section aria-label="The market of Kosei">
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              <div className="d2-market">{hg ? renderHaggle() : renderMarket()}</div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <PlaqueButton nav size="lg" onClick={leaveMarket}>
                  Leave Kosei
                </PlaqueButton>
                <span className="d1-hint" aria-live="polite">
                  {mHint}
                </span>
              </div>
            </section>
          )}

          {/* ---------------- 4: the summary ---------------- */}
          {stage === 4 && (
            <section aria-label="Day Two complete" className="qi-fade-enter qi-panel d1-scroll rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/kenji-game/poses/round-complete.webp"
                alt="Kenji, head bowed, hands pressed together in quiet acknowledgment"
                className="qi-item-glow mx-auto w-28 sm:w-36"
              />
              <p className="d1-kicker mt-3 text-center">Stage Two complete</p>
              <span className="d1-kan d1-kan--sm" lang="ja" role="img" aria-label="Complete (kan)">
                完
              </span>
              <p className="mt-3 leading-relaxed text-[var(--qi-ivory)]/90">
                Day Two is ended. Kenji came to Kosei looking for what his people lost. He leaves having seen what a
                home looks like when it survives, and with the archives&rsquo; answer: east, to the grove.
              </p>
              <dl>
                <dt>Proof</dt>
                <dd>
                  Three ledgers kept
                  <br />
                  <span className="d1-hint">
                    Times: {d.times.map(fmtTime).join(", ")} &middot; Rank: {RANKS[d.rank].label}
                  </span>
                </dd>
                <dt>Time in Kosei</dt>
                <dd>Nine days</dd>
                {d.bought.length ? (
                  <>
                    <dt>Bargained for</dt>
                    <dd>
                      <div className="d1-endlist">{d.bought.map(fig)}</div>
                    </dd>
                  </>
                ) : null}
                {d.sold.length || d.shared ? (
                  <>
                    <dt>Given or sold in Kosei</dt>
                    <dd>
                      <div className="d1-endlist">
                        {d.sold.map(fig)}
                        {d.shared ? (
                          <figure>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={itemById("rice").img} alt="" />
                            Rice cakes (shared)
                          </figure>
                        ) : null}
                      </div>
                    </dd>
                  </>
                ) : null}
                <dt>Still in the satchel</dt>
                <dd>
                  <div className="d1-endlist">{d.inv.map(fig)}</div>
                  {noFlute ? <p className="d1-hint mt-2">No flute. The grove will be harder.</p> : null}
                </dd>
                <dt>Best ledger times</dt>
                <dd className="d1-hint">
                  {Object.entries(RANKS)
                    .map(([k, r]) => `${r.label} ${fmtTime(best[k])}`)
                    .join(" · ")}
                </dd>
                <dt>Next</dt>
                <dd>
                  Day Three: The Era of Listening
                  <br />
                  <span className="text-sm text-[var(--qi-ivory)]/60">Five days on the road to the Ancient Grove</span>
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
                    update({ stage: 5 });
                    setPractice(null);
                    requestAnimationFrame(toTop);
                  }}
                >
                  Practice in Kosei
                </PlaqueButton>
                <button
                  type="button"
                  onClick={restart}
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--qi-ivory)]/55 underline-offset-4 hover:text-[var(--qi-gold)] hover:underline"
                >
                  Begin Day Two again
                </button>
              </div>
            </section>
          )}

          {/* ---------------- 5: practice ---------------- */}
          {stage === 5 && (
            <section aria-label="Practice in Kosei">
              <p className="d1-lede mx-auto mb-4 text-center">{HEAD.lede}</p>
              {ranks((k) => update({ rank: k }))}
              <div className="d2-row mt-4">
                <PlaqueButton nav size="sm" onClick={newPracticeLedger}>
                  New ledger
                </PlaqueButton>
                <PlaqueButton nav size="sm" dim onClick={newPracticeWord}>
                  New bargain
                </PlaqueButton>
                <PlaqueButton nav size="xs" dim onClick={() => go(4)}>
                  Back to summary
                </PlaqueButton>
              </div>
              <p className="d1-hint mt-3">
                Best ledger times:{" "}
                {Object.entries(RANKS)
                  .map(([k, r]) => `${r.label} ${fmtTime(best[k])}`)
                  .join(" · ")}
              </p>
              {practice && practice.kind === "ledger" && (
                <div className="d2-host mt-4">
                  <Ledger
                    key={practice.state.id}
                    state={practice.state}
                    notesAllowed
                    conflicts={RANKS[practice.state.rank].conf}
                    paused={paused}
                    apiRef={ledgerApi}
                    onChange={() => {}}
                    onSolve={(s) => {
                      const b = recordBest(practice.state.rank, s);
                      setPractice((p) => ({ ...p, note: `Kept in ${fmtTime(s)}. Best ${RANKS[practice.state.rank].label} time: ${fmtTime(b)}.` }));
                    }}
                  />
                  {practice.note ? <p className="d2-msg mt-3">{practice.note}</p> : null}
                </div>
              )}
              {practice && practice.kind === "word" && (
                <div className="d2-market mt-4">
                  <div className="d2-hg">
                    <p className="d2-prog">
                      {HINT[d.rank]} &middot; wrong letters {practice.wrong} of 6
                    </p>
                    <p className="d2-clue">
                      <span>Hint</span>
                      &ldquo;{practice.clue}&rdquo;
                    </p>
                    <div className="d2-word">
                      {wordRow(
                        practice.word,
                        practice.guessed,
                        practice.over,
                        practice.word.split("").every((c) => c === " " || practice.guessed.includes(c)),
                      )}
                    </div>
                    {practice.over ? (
                      <p className="d2-msg">
                        {practice.word.split("").every((c) => c === " " || practice.guessed.includes(c))
                          ? "Well bargained."
                          : "The merchant wins this one."}
                      </p>
                    ) : (
                      keyboard(practice.guessed, practice.word, practiceGuess)
                    )}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {/* ---------------- the approach: Kosei's gate ---------------- */}
      {prelude && (
        <section
          className={`d1-shot d2-prelude${preOn ? " on" : ""}${preLeaving ? " leaving" : ""}`}
          aria-label="Day Two opening"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="d1-shot-img"
            src={ART2.gate}
            alt="Kenji climbs the steps toward Kosei's great gate under cherry blossoms, purple tree-of-life banners on the walls, guards on either side, and children running through into the city"
          />
          <div className="d1-shot-shade" />
          <div className="d1-shot-title">
            <p className="d1-kicker">Stage Two</p>
            <h1>Day Two</h1>
            <p className="dayname">The Era of Proof</p>
            <p className="era">
              Four days on the road. In Kosei nothing is believed until it is shown, and a stranger is weighed before he
              is welcomed.
            </p>
            <div ref={enterRef} className={`d1-reveal-btn${enterReady ? " show" : ""}`}>
              <PlaqueButton nav size="xl" disabled={!enterReady} onClick={enterKosei}>
                Enter Kosei
              </PlaqueButton>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- the leaving: the road east ---------------- */}
      {finale && (
        <section
          className={`d1-shot d1-finale d2-finale${finOn ? " on" : ""}${finTitled ? " titled" : ""}${finLeaving ? " leaving" : ""}`}
          aria-label="Day Two closing"
        >
          <div className="d1-shot-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="d1-shot-fill"
              src={ART2.departure}
              alt="At sunset Kenji walks out through Kosei's gate between tree-of-life banners, the road winding east toward the hills"
            />
          </div>
          <div className="d1-shot-shade" />
          <div className="d1-shot-title">
            <p className="d1-kicker">Stage Two complete</p>
            <div className="d1-fin-head">
              <h1>The era of proof closes</h1>
              <span className="d1-kan" lang="ja" role="img" aria-label="Complete (kan)">
                完
              </span>
            </div>
            <p className="era" style={{ marginBottom: 18 }}>
              Nine days in Kosei. The road turns east.
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
          cast={CAST2}
          por={POR2}
          scenes={SCENES}
          continuity
          lowThink
          defaultKenjiPose="armed"
          lines={talking.lines}
          reducedMotion={RM}
          onDone={endTalk}
        />
      )}
    </div>
  );
}
