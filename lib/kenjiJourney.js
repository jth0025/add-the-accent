// What Kenji gathers, carries and leaves behind. Day One writes it; the
// Legend reads it; later Days read `packed` and `left` to apply each
// item's payoff. Everything is wrapped in try/catch so the game still
// plays when storage is unavailable.

export const DAY1_KEY = "kq.day1.v4";
export const DAY2_KEY = "kq.day2.v1";
export const BEST_KEY = "kq.best.v1";
export const DAY3_KEY = "kq.day3.v1";
export const BEST3_KEY = "kq.best3.v1";
export const DAY4_KEY = "kq.day4.v1";
export const DAY5_KEY = "kq.day5.v2";
export const DAY6_KEY = "kq.day6.v1";
export const DAY7_KEY = "kq.day7.v1";
export const BEST4_KEY = "kq.best4.v1";
export const BEST6_KEY = "kq.best6.v1";
export const BEST7_KEY = "kq.best7.v1";
export const JOURNEY_KEY = "kq.journey";
export const SLOTS = 6;

// The sun seal's rings carve 12, 9 and 6 segments. Each click turns a
// ring by one segment; the puzzle is solved when every ring is back at
// zero, with its marked symbol (gate, sun, blade) under the notch.
export const SEAL_SEGS = [12, 9, 6];
export const sealSolved = (rot) =>
  rot.every((v, i) => ((v % SEAL_SEGS[i]) + SEAL_SEGS[i]) % SEAL_SEGS[i] === 0);

const D = "/kenji-game/day1";

// Every item Day One can hand Kenji. `help` is the payoff when it is
// carried, `cost` is what leaving it behind does. `where` is the stage
// at which it first appears: "room" items are found with the lantern,
// "altar" items are laid out when the satchel is packed.
export const DAY1_ITEMS = [
  {
    id: "scroll",
    name: "Quest scroll",
    img: `${D}/item-scroll.webp`,
    where: "room",
    locked: true,
    desc: "The map that begins the journey.",
    omen: "It will not let you leave it behind.",
    help: "It points the way, inland, toward Kosei.",
    cost: "",
  },
  {
    id: "rice",
    name: "Rice cakes",
    img: `${D}/item-rice.webp`,
    where: "altar",
    desc: "Packed for the walk here. Four left.",
    omen: "A full stomach and a shared meal both open doors.",
    leave: "Kenji sets the rice cakes on the altar. The road ahead will be hungrier.",
    help: "Day Two: shared with a petitioner, they earn the Warden's trust.",
    cost: "Day Two: fewer mistakes allowed at the gate ceremony. They can be bought in Kosei.",
  },
  {
    id: "gourd",
    name: "Water gourd",
    img: `${D}/item-gourd.webp`,
    where: "altar",
    desc: "Filled before the journey. Still half full.",
    omen: "Water given freely is remembered.",
    leave: "The gourd stays on the altar. He will have to find water on his own.",
    help: "Day Three: an offering at the grove spring.",
    cost: "Day Three: only a few drops reach the spring, and the song forgives no mistake.",
  },
  {
    id: "flute",
    name: "Reed flute",
    img: `${D}/item-flute.webp`,
    where: "altar",
    desc: "Light. Plays a soft, low note.",
    omen: "Some doors open to a song, not a sword.",
    help: "Day Three: Namonoki's song is played on all five notes.",
    cost: "Day Three: the song is played on three notes only. A flute can be bargained for in Kosei.",
  },
  {
    id: "letter",
    name: "Sealed letter",
    img: `${D}/item-letter.webp`,
    where: "room",
    desc: "Still unopened. A bear in the wax.",
    omen: "Whoever holds this holds part of the story.",
    leave: "The letter stays sealed on the altar. Someone else may find it first.",
    help: "Day Five: Daigo knows of it. Day Six: Kenji opens it before the sea.",
    cost: "Day Six: the Vashara take it from the altar, and Daigo throws it back across the wet stone.",
  },
  {
    id: "charm",
    name: "Wooden charm",
    img: `${D}/item-charm.webp`,
    where: "room",
    desc: "Three spirals, worn smooth by a thumb.",
    omen: "The spirals look like a tide turning.",
    help: "Day Six: it steadies Kenji before Nami-Kai's question.",
    cost: "Day Six: Kenji faces the question without it.",
  },
  {
    id: "cord",
    name: "Hilt cord",
    img: `${D}/item-cord.webp`,
    where: "room",
    desc: "Faded red, braided by careful hands.",
    omen: "Someone who knew these hands may know this braid.",
    help: "Day Four: it mends the broken bridge. Day Six: Daigo knows the family braid, and goes still.",
    cost: "Day Four: the long way round costs a day. Day Six: that moment never happens.",
  },
  {
    id: "incense",
    name: "Incense sticks",
    img: `${D}/item-incense.webp`,
    where: "altar",
    desc: "Cedar and smoke.",
    omen: "Old places listen more closely through smoke. It will need a flame.",
    help: "Day Three: with flint, the cedar smoke reveals a letter of the carved verses.",
    cost: "Day Three: the carved verses must be read without guidance.",
  },
  {
    id: "flint",
    name: "Flint and steel",
    img: `${D}/item-flint.webp`,
    where: "altar",
    desc: "For a fire on the road.",
    omen: "Light rarely comes on its own.",
    help: "Day Three: lights the incense. Day Four: lights the beacon by hand.",
    cost: "Day Three: the incense will not light. Day Four: one more signal stone to light.",
  },
  {
    id: "brush",
    name: "Ink brush",
    img: `${D}/item-brush.webp`,
    where: "altar",
    desc: "For writing down what you learn.",
    omen: "Some names are lost because no one wrote them down.",
    help: "Day Two: a written petition. Day Three: the forgotten name is recorded.",
    cost: "Day Two: borrowing a brush costs trust. Day Three: the name may fade.",
  },
  {
    id: "whetstone",
    name: "Whetstone",
    img: `${D}/item-whetstone.webp`,
    where: "room",
    desc: "Gritty from its last blade.",
    omen: "Hikariwake hardly dulls. Others might pay well for a good stone.",
    help: "A valuable trade good in Kosei.",
    cost: "Little is lost. It only shows what Kenji valued.",
  },
];

export const itemById = (id) => DAY1_ITEMS.find((i) => i.id === id);

// A fresh run: random seal offsets (never already solved), rice cakes
// and the water gourd already packed from the walk, and the scroll,
// which cannot be removed.
export function freshDay1() {
  // One to three segments off the notch, either way, never already solved.
  const opts = [-3, -2, -1, 1, 2, 3];
  const pick = () => opts[Math.floor(Math.random() * opts.length)];
  return {
    stage: 1,
    found: [],
    rot: [pick(), pick(), pick()],
    packed: ["scroll", "rice", "gourd"],
  };
}

function readJSON(key) {
  try {
    const v = window.localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the game plays on without saving.
  }
}

export const loadDay1 = () => readJSON(DAY1_KEY);
export const saveDay1 = (st) => writeJSON(DAY1_KEY, st);
export const loadJourney = () => readJSON(JOURNEY_KEY);

// ---- Day Two: the Era of Proof (Kosei) ----

// What Kenji carries out of Day One: the finished run's satchel, else the
// one in progress, else the starting three.
export function day1Kit() {
  const done = loadJourney()?.day1?.packed;
  if (Array.isArray(done)) return [...done];
  const live = loadDay1()?.packed;
  if (Array.isArray(live)) return [...live];
  return ["scroll", "rice", "gourd"];
}

// A fresh Day Two: Kenji arrives with what Day One left in his satchel
// and eight coins.
export function freshDay2() {
  return {
    started: true,
    stage: 1,
    arrived: false,
    kday: 1,
    inv: day1Kit(),
    bought: [],
    sold: [],
    shared: false,
    purse: 8,
    kind: 0,
    haggles: 0,
    rank: "initiate",
    lg: null,
    lgDone: 0,
    times: [],
    done: false,
    seen: {},
  };
}

export const loadDay2 = () => readJSON(DAY2_KEY);
export const saveDay2 = (st) => writeJSON(DAY2_KEY, st);

export const loadBest = () => readJSON(BEST_KEY) || {};
export function recordBest(rank, seconds) {
  const best = loadBest();
  if (!best[rank] || seconds < best[rank]) {
    best[rank] = seconds;
    writeJSON(BEST_KEY, best);
  }
  return best[rank];
}

// Written when Kenji leaves Kosei, so the Legend (and the days after) know
// what is still in his satchel.
export function writeJourney2(st) {
  const j = loadJourney() || {};
  writeJSON(JOURNEY_KEY, {
    ...j,
    day2: { done: true, inv: [...st.inv], bought: [...st.bought], sold: [...st.sold], shared: !!st.shared },
  });
}

// ---- Day Three: the Era of Listening (Naomori) ----

// What Kenji carries out of Kosei: the finished Day Two's satchel, else the
// one in progress, else whatever Day One left him.
export function day2Kit() {
  const done = loadJourney()?.day2?.inv;
  if (Array.isArray(done)) return [...done];
  const live = loadDay2()?.inv;
  if (Array.isArray(live)) return [...live];
  return day1Kit();
}

// A fresh Day Three: Kenji arrives with what Day Two left in his satchel.
export function freshDay3() {
  return {
    started: true,
    stage: 1,
    arrived: false,
    kday: 1,
    inv: day2Kit(),
    rank: "initiate",
    stone: 0, // inscriptions read (0 to 3)
    read: false, // the gate read aloud
    cross: 0, // 0 choose the sign, 1 walk beneath, 2 across
    crossed: false,
    vz: null, // the inscription in progress
    incense: 0,
    watered: false,
    songDone: false,
    longest: 0,
    answered: null, // did Kenji answer the voice?
    times: [],
    done: false,
    seen: {},
  };
}

export const loadDay3 = () => readJSON(DAY3_KEY);
export const saveDay3 = (st) => writeJSON(DAY3_KEY, st);

export const loadBest3 = () => readJSON(BEST3_KEY) || {};
export function recordBest3(key, value, lower) {
  const best = loadBest3();
  if (best[key] == null || (lower ? value < best[key] : value > best[key])) {
    best[key] = value;
    writeJSON(BEST3_KEY, best);
  }
  return best[key];
}

// Written when Kenji leaves the grove, so the Legend (and the days after)
// know what is still in his satchel.
export function writeJourney3(st) {
  const j = loadJourney() || {};
  writeJSON(JOURNEY_KEY, {
    ...j,
    day3: { done: true, inv: [...st.inv], answered: st.answered, watered: !!st.watered },
  });
}

// ---- Days Four to Seven ----

// What Kenji carries out of the grove: the finished Day Three's satchel, else
// the one in progress, else what Kosei left him. Nothing is traded after
// Naomori, so Days Four to Seven all read this.
export function day3Kit() {
  const done = loadJourney()?.day3?.inv;
  if (Array.isArray(done)) return [...done];
  const live = loadDay3()?.inv;
  if (Array.isArray(live)) return [...live];
  return day2Kit();
}

// Did Kenji answer the voice in Naomori? (Daigo mentions it on Day Five.)
export function day3Answered() {
  const j = loadJourney()?.day3;
  if (j && j.answered !== undefined) return j.answered;
  return loadDay3()?.answered ?? null;
}

export const freshDay4 = () => ({
  started: true, stage: 1, arrived: false, kday: 1, rank: "initiate", inv: day3Kit(),
  plate: false, lvl: 0, bm: null, pic: 0, rt: null, bridge: null, times: [], ntimes: [], done: false, seen: {},
});
export const freshDay5 = () => ({
  started: true, stage: 1, arrived: false, rank: "initiate", inv: day3Kit(), cross: 0, plate2: false, done: false, seen: {},
});
export const freshDay6 = () => ({
  started: true, stage: 1, arrived: false, kday: 1, rank: "initiate", inv: day3Kit(),
  lock: 0, tl: null, mir: 0, mr: null, answer: null, asked: false, claims: 0, moves: [], presses: [], done: false, seen: {},
});
export const freshDay7 = () => ({
  started: true, stage: 1, arrived: false, kday: 1, rank: "initiate", inv: day3Kit(),
  sc: null, scDone: false, scMoves: 0, stilled: false, carry: null, done: false, seen: {},
});
export const loadDay4 = () => readJSON(DAY4_KEY);
export const saveDay4 = (st) => writeJSON(DAY4_KEY, st);
export const loadDay5 = () => readJSON(DAY5_KEY);
export const saveDay5 = (st) => writeJSON(DAY5_KEY, st);
export const loadDay6 = () => readJSON(DAY6_KEY);
export const saveDay6 = (st) => writeJSON(DAY6_KEY, st);
export const loadDay7 = () => readJSON(DAY7_KEY);
export const saveDay7 = (st) => writeJSON(DAY7_KEY, st);

// Best results kept on the device: Day Four (light, route), Six (locks,
// mirrors) and Seven (the scroll). Lower is better for all of them.
const bestOf = (key) => ({
  load: () => readJSON(key) || {},
  set(k, v) {
    const b = readJSON(key) || {};
    if (b[k] == null || v < b[k]) {
      b[k] = v;
      writeJSON(key, b);
    }
    return b[k];
  },
});
export const best4 = bestOf(BEST4_KEY);
export const best6 = bestOf(BEST6_KEY);
export const best7 = bestOf(BEST7_KEY);

// The Sanctuary (after Day Seven) opens any Day's practice: set that Day's
// saved state to its practice stage, and the Day opens there.
const PRACTICE_STAGE = { 2: [DAY2_KEY, 5], 3: [DAY3_KEY, 4], 4: [DAY4_KEY, 4], 5: [DAY5_KEY, 3], 6: [DAY6_KEY, 4] };
export function openPractice(day) {
  const [key, stage] = PRACTICE_STAGE[day] || [];
  const st = key && readJSON(key);
  if (st) writeJSON(key, { ...st, stage, arrived: true });
}

export function writeJourneyDay(n, patch) {
  const j = loadJourney() || {};
  writeJSON(JOURNEY_KEY, { ...j, [`day${n}`]: { done: true, ...patch } });
}

// Written when Kenji leaves the shrine, so Day Two onward can read it.
// Beginning Day One again does not erase it until the new run is done.
export function writeJourney(st) {
  const left = DAY1_ITEMS.filter((i) => !st.packed.includes(i.id)).map((i) => i.id);
  const j = loadJourney() || {};
  writeJSON(JOURNEY_KEY, {
    ...j,
    day1: { done: true, hikariwake: true, packed: [...st.packed], left },
  });
}

// What the Legend should show for each item, given the current run (or
// the finished one) and the days already completed. Each entry is
// `{ collected, status }` where status is one of
//   found    seen in the room, not yet decided
//   altar    laid out on the altar, not in the satchel
//   packed   in the satchel, Kenji has not left yet
//   carried  Kenji left the shrine with it
//   left     Kenji left it on the altar
export function legendState(completedDays = []) {
  const journey = loadJourney()?.day1;
  const live = loadDay1();
  // A finished run outranks a replay in progress; a replay in progress
  // outranks nothing.
  const rec = journey ? { ...journey, stage: 4, done: true, revealed: true, found: DAY1_ITEMS.map((i) => i.id) } : live;
  const out = {};
  const set = (key, collected, status = null) => {
    out[key] = { collected, status };
  };
  const legacy = !rec && completedDays.includes(1);
  const stage = rec?.stage || 0;
  const done = !!rec?.done;
  const revealed = !!rec?.revealed;
  const packed = rec?.packed || [];
  const found = rec?.found || [];

  set("hat", true, "carried");
  set("satchel", stage >= 3 || legacy, stage >= 3 || legacy ? (done || legacy ? "carried" : "packed") : null);
  set("hikariwake", revealed || legacy, revealed || legacy ? (done || legacy ? "carried" : "found") : null);
  set("butterfly", revealed || legacy, revealed || legacy ? (done || legacy ? "carried" : "found") : null);
  set("emblem", false);

  for (const it of DAY1_ITEMS) {
    const collected =
      it.id === "scroll" && legacy
        ? true
        : it.where === "room"
        ? found.includes(it.id) || stage >= 3
        : revealed || stage >= 3;
    let status = null;
    if (collected) {
      if (it.locked) status = done || legacy ? "carried" : "found";
      else if (done) status = packed.includes(it.id) ? "carried" : "left";
      else if (stage >= 3) status = packed.includes(it.id) ? "packed" : "altar";
      else status = "found";
    }
    set(it.id, collected, status);
  }
  // Once Day Two is done, the satchel is whatever Kenji left Kosei with (and
  // once Day Three is done, what he took out of the grove).
  const j = loadJourney();
  const kosei = j?.day3?.done ? j.day3 : j?.day2;
  if (kosei?.done && Array.isArray(kosei.inv)) {
    for (const it of DAY1_ITEMS) {
      if (!out[it.id]?.collected) continue;
      out[it.id] = { collected: true, status: kosei.inv.includes(it.id) ? "carried" : "left" };
    }
  }
  return out;
}
