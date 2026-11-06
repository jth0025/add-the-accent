"use client";

import { useState } from "react";
import { FRAGS } from "./day1-data";
import {
  DAY1_ITEMS,
  DAY1_KEY,
  DAY2_KEY,
  DAY3_KEY,
  DAY4_KEY,
  DAY5_KEY,
  DAY6_KEY,
  DAY7_KEY,
  BEST4_KEY,
  BEST6_KEY,
  BEST7_KEY,
  JOURNEY_KEY,
  BEST_KEY,
  BEST3_KEY,
  freshDay1,
  freshDay2,
  freshDay3,
  freshDay4,
  freshDay5,
  freshDay6,
  freshDay7,
} from "@/lib/kenjiJourney";
import "./review-panel.css";

// REVIEW TAB (local builds only: QuestIntro compiles it out of a production
// build). A tab on the left edge opens a list of every screen of the game,
// so each can be reached directly instead of played toward, plus tools to
// skip a scene, solve the puzzle on screen, or wipe the saves.

const store = (k, v) => {
  try {
    window.localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* ignore */
  }
};

const ALL_D1 = ["arrive", "intro", "found", "seal", "blade", "pack", "end"];
const ALL_D2 = ["d2_arrive", "d2_warden", "d2_l1", "d2_l2", "d2_l2b", "d2_reveal", "d2_archive", "d2_market"];
const ALL_D3 = ["d3_arrive", "d3_enter", "d3_read", "d3_gate", "d3_name", "d3_spring", "d3_open", "d3_daigo"];
const seenOf = (keys, upTo) => Object.fromEntries(keys.slice(0, upTo).map((k) => [k, true]));

// A finished Day One, as the journey (and Day Two) read it.
function finishDay1() {
  const packed = ["scroll", "rice", "gourd", "charm", "cord"];
  const left = DAY1_ITEMS.filter((i) => !packed.includes(i.id)).map((i) => i.id);
  store(DAY1_KEY, {
    ...freshDay1(),
    stage: 4,
    found: FRAGS.map((f) => f.id),
    rot: [0, 0, 0],
    packed,
    arrived: true,
    revealed: true,
    done: true,
    left,
    seen: seenOf(ALL_D1, ALL_D1.length),
  });
  store(JOURNEY_KEY, { day1: { done: true, hikariwake: true, packed, left } });
}

function day2At(patch) {
  finishDay1();
  const base = freshDay2();
  store(DAY2_KEY, { ...base, arrived: true, seen: seenOf(ALL_D2, 1), ...patch });
}

// A finished Day Two, as Day Three reads it: a flute in the satchel.
function finishDay2() {
  finishDay1();
  const inv = ["scroll", "rice", "gourd", "charm", "cord", "flute"];
  const j = JSON.parse(window.localStorage.getItem(JOURNEY_KEY) || "{}");
  store(JOURNEY_KEY, { ...j, day2: { done: true, inv, bought: ["flute"], sold: [], shared: false } });
}

function day3At(patch) {
  finishDay2();
  const base = freshDay3();
  store(DAY3_KEY, { ...base, arrived: true, seen: seenOf(ALL_D3, 2), ...patch });
}

// A finished Day Three, as Day Four reads it: the satchel Kenji left the
// grove with, and that he stayed silent at the voice.
function finishDay3() {
  finishDay2();
  const j = JSON.parse(window.localStorage.getItem(JOURNEY_KEY) || "{}");
  store(JOURNEY_KEY, {
    ...j,
    day3: { done: true, inv: ["scroll", "rice", "gourd", "charm", "cord", "flute", "incense", "flint", "letter"], answered: false, watered: true },
  });
}

const ALL_D4 = ["d4_arrive", "d4_climb", "d4_summit", "d4_signal", "d4_watched", "d4_route"];
function day4At(patch) {
  finishDay3();
  store(DAY4_KEY, { ...freshDay4(), arrived: true, seen: seenOf(ALL_D4, 3), ...patch });
}

const ALL_D5 = ["d5_arrive", "d5_ambush", "d5_after"];
function day5At(patch) {
  finishDay3();
  store(DAY5_KEY, { ...freshDay5(), arrived: true, seen: seenOf(ALL_D5, 2), ...patch });
}

const ALL_D6 = ["d6_arrive", "d6_enter", "d6_locks"];
function day6At(patch) {
  finishDay3();
  store(DAY6_KEY, { ...freshDay6(), arrived: true, seen: seenOf(ALL_D6, 2), ...patch });
}
const ALL_D7 = ["d7_arrive", "d7_enter", "d7_scroll", "d7_light", "d7_end"];
function day7At(patch) {
  finishDay3();
  store(DAY7_KEY, { ...freshDay7(), arrived: true, seen: seenOf(ALL_D7, 2), ...patch });
}
// every Day finished, as the Sanctuary expects
function finishAll() {
  finishDay3();
  const keep = (key, patch) => {
    const cur = JSON.parse(window.localStorage.getItem(key) || "null");
    if (!cur) store(key, patch);
  };
  keep(DAY4_KEY, { ...freshDay4(), arrived: true, stage: 3, lvl: 4, pic: 3, plate: true, kday: 5, done: true, bridge: true, times: [40, 55, 70, 90], ntimes: [50, 60, 80] });
  keep(DAY5_KEY, { ...freshDay5(), arrived: true, stage: 2, cross: 5, plate2: true, done: true });
  keep(DAY6_KEY, { ...freshDay6(), arrived: true, stage: 3, lock: 3, mir: 3, kday: 6, done: true, moves: [4, 5, 6], presses: [6, 8, 9] });
}

export default function ReviewPanel({ setPhase, bump, reviewApi, setCompletedDays, setDayIntroIndex }) {
  const [open, setOpen] = useState(false);

  const go = (phase, prep, after) => () => {
    if (prep) prep();
    bump();
    setPhase(phase);
    if (after) setTimeout(after, 900);
  };

  const d1 = (patch, after) =>
    go(
      "day1",
      () => {
        store(DAY1_KEY, {
          ...freshDay1(),
          arrived: true,
          found: patch.stage >= 2 ? FRAGS.map((f) => f.id) : [],
          rot: patch.stage >= 3 || patch.solved ? [0, 0, 0] : freshDay1().rot,
          revealed: patch.stage >= 3,
          seen: seenOf(ALL_D1, 7),
          ...patch,
        });
      },
      after,
    );

  const d2 = (patch, after) => go("day2", () => day2At(patch), after);
  const d3 = (patch, after) => go("day3", () => day3At(patch), after);
  const d4 = (patch, after) => go("day4", () => day4At(patch), after);
  const d5 = (patch, after) => go("day5", () => day5At(patch), after);
  const d6 = (patch, after) => go("day6", () => day6At(patch), after);
  const d7 = (patch, after) => go("day7", () => day7At(patch), after);
  const DONE6 = { stage: 3, lock: 3, mir: 3, kday: 6, done: true, moves: [4, 5, 6], presses: [6, 8, 9], seen: seenOf(ALL_D6, 3) };
  // the gate crossed: Kenji stands before the naming tree
  const AT_TREE = { stone: 3, read: true, cross: 2, crossed: true, kday: 4 };

  const api = () => reviewApi.current || {};

  const sections = [
    {
      title: "Game",
      items: [
        ["Touch the light", () => setPhase("idle")],
        ["Main menu", () => setPhase("menu")],
        ["The Path", () => setPhase("levels")],
        ["The Legend", () => setPhase("items")],
        ["Lore and map", () => setPhase("lore")],
      ],
    },
    {
      title: "Day One",
      items: [
        ["Opening shot", d1({ arrived: false, seen: {} })],
        ["Search the room", d1({ stage: 1, seen: seenOf(ALL_D1, 1) })],
        ["Sun seal", d1({ stage: 2, seen: seenOf(ALL_D1, 3) })],
        ["Altar reveal", d1({ stage: 2, solved: true, seen: seenOf(ALL_D1, 3) })],
        ["Satchel", d1({ stage: 3, seen: seenOf(ALL_D1, 5) })],
        ["Closing shot", d1({ stage: 3, warned: true, seen: seenOf(ALL_D1, 5) }, () => api().finale?.())],
        ["Summary", () => {
          finishDay1();
          bump();
          setPhase("day1");
        }],
      ],
    },
    {
      title: "Day Two",
      items: [
        ["Path: Day art", () => {
          finishDay1();
          setCompletedDays((c) => (c.includes(1) ? c : [...c, 1]));
          setDayIntroIndex(1);
          setPhase("dayArt");
        }],
        ["Road to Kosei (Kenji standing)", () => {
          setDayIntroIndex(1);
          setPhase("dayKenji");
        }],
        ["Gate opening", d2({ arrived: false, seen: {} })],
        ["Warden: first meeting", d2({ stage: 1, seen: {} })],
        ["Ledger I", d2({ stage: 1, seen: seenOf(ALL_D2, 2) })],
        ["Ledger II", d2({ stage: 2, lgDone: 1, times: [95], kday: 2, seen: seenOf(ALL_D2, 3) })],
        ["Ledger III", d2({ stage: 2, lgDone: 2, times: [95, 180], kday: 4, seen: seenOf(ALL_D2, 5) })],
        ["The archives", d2({ stage: 2, lgDone: 3, times: [95, 180, 260], kday: 6, seen: seenOf(ALL_D2, 5) })],
        ["Market", d2({ stage: 3, lgDone: 3, times: [95, 180, 260], kday: 7, seen: seenOf(ALL_D2, 7) })],
        ["Leaving Kosei", d2({ stage: 3, lgDone: 3, times: [95, 180, 260], kday: 9, seen: seenOf(ALL_D2, 8) }, () => api().closing?.())],
        ["Summary", d2({ stage: 4, lgDone: 3, done: true, times: [95, 180, 260], kday: 9, seen: seenOf(ALL_D2, 8) })],
        ["Practice", d2({ stage: 5, lgDone: 3, done: true, times: [95, 180, 260], kday: 9, seen: seenOf(ALL_D2, 8) })],
      ],
    },
    {
      title: "Day Three",
      items: [
        ["Path: Day art", () => {
          finishDay2();
          try {
            window.localStorage.removeItem(DAY3_KEY); // a first visit
          } catch {
            /* ignore */
          }
          setCompletedDays((c) => [...new Set([...c, 1, 2])]);
          setDayIntroIndex(2);
          setPhase("dayArt");
        }],
        ["Road to Day Three (fire camp)", () => {
          setDayIntroIndex(2);
          setPhase("dayKenji");
        }],
        ["Opening: the torii path", d3({ arrived: false, seen: {} })],
        ["Glyph gate: first stone", d3({ stone: 0, seen: seenOf(ALL_D3, 2) })],
        ["Glyph gate: third stone", d3({ stone: 2, kday: 3, seen: seenOf(ALL_D3, 2) })],
        ["The gate, translated", d3({ stone: 3, kday: 4, seen: seenOf(ALL_D3, 2) })],
        ["Crossing: the sign", d3({ stone: 3, read: true, kday: 4, seen: seenOf(ALL_D3, 3) })],
        ["Crossing: walk beneath", d3({ stone: 3, read: true, cross: 1, kday: 4, seen: seenOf(ALL_D3, 3) })],
        ["Naming tree: the voice", d3({ ...AT_TREE, seen: seenOf(ALL_D3, 4) }, () => api().talk?.("d3_name"))],
        ["The spring", d3({ ...AT_TREE, answered: false, seen: seenOf(ALL_D3, 5) }, () => api().talk?.("d3_spring"))],
        ["Namonoki's song", d3({ ...AT_TREE, stage: 2, answered: false, watered: true, kday: 5, seen: seenOf(ALL_D3, 6) })],
        ["Namonoki speaks to Kenji", d3({ ...AT_TREE, stage: 2, answered: false, watered: true, songDone: true, longest: 6, kday: 6, seen: seenOf(ALL_D3, 6) }, () => api().talk?.("d3_open"))],
        ["Namonoki and Daigo", d3({ ...AT_TREE, stage: 2, answered: false, watered: true, songDone: true, longest: 6, kday: 7, seen: seenOf(ALL_D3, 7) }, () => api().talk?.("d3_daigo"))],
        ["Leaving Naomori", d3({ ...AT_TREE, stage: 2, answered: false, watered: true, songDone: true, longest: 6, kday: 7, seen: seenOf(ALL_D3, 8) }, () => api().closing?.())],
        ["Summary", d3({ ...AT_TREE, stage: 3, answered: false, watered: true, songDone: true, longest: 6, done: true, times: [70, 95, 120], kday: 7, seen: seenOf(ALL_D3, 8) })],
        ["Practice", d3({ ...AT_TREE, stage: 4, answered: false, watered: true, songDone: true, longest: 6, done: true, times: [70, 95, 120], kday: 7, seen: seenOf(ALL_D3, 8) })],
      ],
    },
    {
      title: "Day Four",
      items: [
        ["Path: Day art", () => {
          finishDay3();
          try {
            window.localStorage.removeItem(DAY4_KEY); // a first visit
          } catch {
            /* ignore */
          }
          setCompletedDays((c) => [...new Set([...c, 1, 2, 3])]);
          setDayIntroIndex(3);
          setPhase("dayArt");
        }],
        ["Opening: the cliffs", d4({ arrived: false, seen: {} })],
        ["The climb and the shield", d4({ seen: seenOf(ALL_D4, 1) })],
        ["Light puzzle: first stone", d4({ lvl: 0, seen: seenOf(ALL_D4, 3) })],
        ["Light puzzle: the shield", d4({ lvl: 3, kday: 3, seen: seenOf(ALL_D4, 3) })],
        ["The shield blazes", d4({ lvl: 4, plate: true, kday: 3, seen: seenOf(ALL_D4, 3) }, () => api().talk?.("d4_signal"))],
        ["Route: first view", d4({ lvl: 4, plate: true, stage: 2, kday: 3, seen: seenOf(ALL_D4, 4) })],
        ["Route: the watcher", d4({ lvl: 4, plate: true, stage: 2, kday: 4, seen: seenOf(ALL_D4, 4) }, () => api().talk?.("d4_watched"))],
        ["Route: last view", d4({ lvl: 4, plate: true, stage: 2, pic: 2, kday: 4, seen: seenOf(ALL_D4, 5) })],
        ["Route traced", d4({ lvl: 4, plate: true, stage: 2, pic: 3, kday: 4, seen: seenOf(ALL_D4, 6) })],
        ["Leaving the cliffs", d4({ lvl: 4, plate: true, stage: 2, pic: 3, kday: 5, seen: seenOf(ALL_D4, 6) }, () => api().closing?.())],
        ["Summary", d4({ lvl: 4, plate: true, stage: 3, pic: 3, kday: 5, done: true, bridge: true, times: [40, 55, 70, 90], ntimes: [50, 60, 80], seen: seenOf(ALL_D4, 6) })],
        ["Practice", d4({ lvl: 4, plate: true, stage: 4, pic: 3, kday: 5, done: true, bridge: true, times: [40, 55, 70, 90], ntimes: [50, 60, 80], seen: seenOf(ALL_D4, 6) })],
      ],
    },
    {
      title: "Day Five",
      items: [
        ["Path: Day art", () => {
          finishDay3();
          try {
            window.localStorage.removeItem(DAY5_KEY); // a first visit
          } catch {
            /* ignore */
          }
          setCompletedDays((c) => [...new Set([...c, 1, 2, 3, 4])]);
          setDayIntroIndex(4);
          setPhase("dayArt");
        }],
        ["Opening: the passage", d5({ arrived: false, seen: {} })],
        ["The Vashara Five", d5({ seen: seenOf(ALL_D5, 1) })],
        ["Crossing three of five", d5({ cross: 2, seen: seenOf(ALL_D5, 2) })],
        ["After the last crossing", d5({ cross: 5, plate2: true, seen: seenOf(ALL_D5, 2) }, () => api().talk?.("d5_after"))],
        ["Leaving the passage", d5({ cross: 5, plate2: true, seen: seenOf(ALL_D5, 3) }, () => api().closing?.())],
        ["Summary", d5({ stage: 2, cross: 5, plate2: true, done: true, seen: seenOf(ALL_D5, 3) })],
        ["Practice", d5({ stage: 3, cross: 5, plate2: true, done: true, seen: seenOf(ALL_D5, 3) })],
      ],
    },
    {
      title: "Day Six",
      items: [
        ["Path: Day art", () => {
          finishDay3();
          try {
            window.localStorage.removeItem(DAY6_KEY); // a first visit
          } catch {
            /* ignore */
          }
          setCompletedDays((c) => [...new Set([...c, 1, 2, 3, 4, 5])]);
          setDayIntroIndex(5);
          setPhase("dayArt");
        }],
        ["Opening: the Wall", d6({ arrived: false, seen: {} })],
        ["Into the Wall", d6({ seen: seenOf(ALL_D6, 1) })],
        ["Tide lock: first", d6({ lock: 0 })],
        ["Tide lock: last", d6({ lock: 2, kday: 3 })],
        ["The pool and its inscription", d6({ lock: 3, kday: 3 }, () => api().talk?.("d6_locks"))],
        ["Mirrors: first ring", d6({ stage: 2, lock: 3, kday: 3, seen: seenOf(ALL_D6, 3) })],
        ["Mirrors lit: wait at the water", d6({ stage: 2, lock: 3, mir: 3, kday: 5, seen: seenOf(ALL_D6, 3) })],
        ["Nami-Kai asks", d6({ stage: 2, lock: 3, mir: 3, kday: 5, seen: seenOf(ALL_D6, 3) }, () => api().ask?.())],
        ["Daigo and the letter", d6({ stage: 2, lock: 3, mir: 3, kday: 6, answer: "resp", asked: true, seen: seenOf(ALL_D6, 3) }, () => api().talk?.("d6_after"))],
        ["Leaving the Wall", d6({ stage: 2, lock: 3, mir: 3, kday: 6, seen: seenOf(ALL_D6, 3) }, () => api().closing?.())],
        ["Summary", d6(DONE6)],
        ["Practice", d6({ ...DONE6, stage: 4 })],
      ],
    },
    {
      title: "Day Seven",
      items: [
        ["Path: Day art", () => {
          finishDay3();
          try {
            window.localStorage.removeItem(DAY7_KEY); // a first visit
          } catch {
            /* ignore */
          }
          setCompletedDays((c) => [...new Set([...c, 1, 2, 3, 4, 5, 6])]);
          setDayIntroIndex(6);
          setPhase("dayArt");
        }],
        ["Opening: the Expanse", d7({ arrived: false, seen: {} })],
        ["The scroll table", d7({ seen: seenOf(ALL_D7, 1) })],
        ["The scroll, assembled", d7({ scDone: true, scMoves: 40, kday: 2, seen: seenOf(ALL_D7, 3) }, () => api().talk?.("d7_scroll"))],
        ["The door of light", d7({ scDone: true, scMoves: 40, kday: 3, seen: seenOf(ALL_D7, 3) }, () => api().talk?.("d7_light"))],
        ["Stillness", d7({ stage: 2, scDone: true, scMoves: 40, kday: 3, seen: seenOf(ALL_D7, 4) })],
        ["What Kenji carries forward", d7({ stage: 2, scDone: true, scMoves: 40, kday: 4, stilled: true, seen: seenOf(ALL_D7, 4) }, () => api().talk?.("d7_end"))],
        ["The ending", d7({ stage: 2, scDone: true, scMoves: 40, kday: 4, stilled: true, carry: "build", seen: seenOf(ALL_D7, 5) }, () => api().closing?.())],
        ["Summary", d7({ stage: 3, scDone: true, scMoves: 40, kday: 4, stilled: true, carry: "build", done: true, seen: seenOf(ALL_D7, 5) })],
        ["The Sanctuary", () => {
          finishAll();
          store(DAY7_KEY, { ...freshDay7(), arrived: true, stage: 4, scDone: true, scMoves: 40, kday: 4, stilled: true, carry: "build", done: true, seen: seenOf(ALL_D7, 5) });
          bump();
          setPhase("day7");
        }],
      ],
    },
    {
      title: "Tools",
      items: [
        ["Skip scene or dialogue", () => {
          const a = api();
          if (a.skip?.()) return;
          a.climb?.();
          a.enter?.();
          a.finish?.();
        }],
        ["Solve what is on screen", () => api().solve?.()],
        ["Give Kenji a flute", () => api().flute?.()],
        ["Open every Day on the Path", () => {
          setCompletedDays([1, 2, 3, 4, 5, 6, 7]);
          try {
            window.localStorage.setItem("kenji-quest-completed-days", JSON.stringify([1, 2, 3, 4, 5, 6, 7]));
          } catch {
            /* ignore */
          }
        }],
        ["Clear all saves", () => {
          try {
            Object.keys(window.localStorage)
              .filter((k) => k.startsWith("kq.") || k.startsWith("kenji-quest"))
              .forEach((k) => window.localStorage.removeItem(k));
            window.localStorage.removeItem(BEST_KEY);
            window.localStorage.removeItem(BEST3_KEY);
            window.localStorage.removeItem(BEST4_KEY);
            window.localStorage.removeItem(BEST6_KEY);
            window.localStorage.removeItem(BEST7_KEY);
            window.sessionStorage.clear();
          } catch {
            /* ignore */
          }
          window.location.reload();
        }],
      ],
    },
  ];

  return (
    <div className={`rv-panel${open ? " open" : ""}`} onPointerUpCapture={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="rv-tab"
        aria-expanded={open}
        tabIndex={-1}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
      >
        Review
      </button>
      {open && (
        <div className="rv-drawer" role="region" aria-label="Review tools">
          <p className="rv-note">Local build only. Jump to any screen.</p>
          {sections.map((sec) => (
            <div key={sec.title}>
              <p className="rv-h">{sec.title}</p>
              {sec.items.map(([label, fn]) => (
                <button key={label} type="button" tabIndex={-1} onMouseDown={(e) => e.preventDefault()} onClick={fn}>
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
