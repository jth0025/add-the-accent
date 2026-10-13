// What Kenji gathers, carries and leaves behind. Day One writes it; the
// Legend reads it; later Days read `packed` and `left` to apply each
// item's payoff. Everything is wrapped in try/catch so the game still
// plays when storage is unavailable.

export const DAY1_KEY = "kq.day1.v4";
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
    cost: "Day Three: the breath gate is harder, and water returns only after an extra grove trial.",
  },
  {
    id: "flute",
    name: "Reed flute",
    img: `${D}/item-flute.webp`,
    where: "altar",
    desc: "Light. Plays a soft, low note.",
    omen: "Some doors open to a song, not a sword.",
    help: "Day Five: a flute offering when Kenji asks for the tide.",
    cost: "Day Five: only the bow and stillness remain. A flute can be traded for in Kosei.",
  },
  {
    id: "letter",
    name: "Sealed letter",
    img: `${D}/item-letter.webp`,
    where: "room",
    desc: "Still unopened. A bear in the wax.",
    omen: "Whoever holds this holds part of the story.",
    leave: "The letter stays sealed on the altar. Someone else may find it first.",
    help: "Day Six: restores a memory Kenji is missing.",
    cost: "The Vashara take it.",
  },
  {
    id: "charm",
    name: "Wooden charm",
    img: `${D}/item-charm.webp`,
    where: "room",
    desc: "Three spirals, worn smooth by a thumb.",
    omen: "The spirals look like a tide turning.",
    help: "Day Five: Nami-Kai begins calmer.",
    cost: "Day Five: Nami-Kai begins less trusting.",
  },
  {
    id: "cord",
    name: "Hilt cord",
    img: `${D}/item-cord.webp`,
    where: "room",
    desc: "Faded red, braided by careful hands.",
    omen: "Someone who knew these hands may know this braid.",
    help: "Day Six: Daigo knows the family braid, and hesitates.",
    cost: "Day Six: that moment never happens.",
  },
  {
    id: "incense",
    name: "Incense sticks",
    img: `${D}/item-incense.webp`,
    where: "altar",
    desc: "Cedar and smoke.",
    omen: "Old places listen more closely through smoke. It will need a flame.",
    help: "Day Three: reveals the order of the naming stones.",
    cost: "Day Three: the naming stones must be solved without guidance.",
  },
  {
    id: "flint",
    name: "Flint and steel",
    img: `${D}/item-flint.webp`,
    where: "altar",
    desc: "For a fire on the road.",
    omen: "Light rarely comes on its own.",
    help: "Lights the incense, and signals the eagle on Day Four.",
    cost: "The incense will not light, and the Day Four eagle rite runs longer.",
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
  return out;
}
