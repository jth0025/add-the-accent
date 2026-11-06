// Day Four: the Era of Perspective (the Nest Cliffs). Story data and dialogue
// scripts. Copy follows "Day Four Copy and Dialogue".

import { CAST3, POR3 } from "./day3-data";

const D = "/kenji-game/day4";
const SZ = [1672, 941];

export const ART4 = {
  approach: `${D}/cliffs-approach.webp`,
  summit: `${D}/cliffs-summit-shield.webp`,
  plateRoute: `${D}/cliffs-plate-and-the-route.webp`,
  plate: `${D}/item-map-plate.webp`,
  routePlate: `${D}/route-plate.webp`,
};

// The pieces on the light board, and the three views the route reveals.
export const PIECE = {
  mirror: `${D}/piece-bronze-reflector.webp`,
  dish: `${D}/piece-stone-reflector.webp`,
  sigdark: `${D}/piece-signal-stone.webp`,
  siglit: `${D}/piece-signal-stone-lit.webp`,
  shdark: `${D}/piece-shield.webp`,
  shlit: `${D}/piece-shield-lit.webp`,
  rock: `${D}/piece-rock.webp`,
};
export const REVEAL = [`${D}/view-eagles-nest.webp`, `${D}/view-signal-ridge.webp`, `${D}/view-broken-passage.webp`];
export const ROUTE_KINDS = [
  { id: "nest", name: "The eagles’ nest", img: REVEAL[0] },
  { id: "ridge", name: "The signal ridge", img: REVEAL[1] },
  { id: "pass", name: "The broken passage", img: REVEAL[2] },
];

export const POR4 = POR3;

// The Warden on Kosei's walls and the man in the broken hills are painted in
// their pictures: no portrait beside the box.
export const CAST4 = {
  ...CAST3,
  warden4: { name: "The Warden of Kosei", side: "right", art: {} },
  daigo4: { name: "Daigo", side: "right", art: {} },
};

// The pictures behind the talk. `faces` are the painted faces a box must keep
// clear of (left, top, right, bottom as fractions of the picture), and the
// side of the face the box prefers.
export const SCENES4 = {
  src: {
    cliffs: `${D}/cliffs-approach.webp`,
    bridge: `${D}/cliffs-broken-bridge.webp`,
    summit: `${D}/cliffs-summit-shield.webp`,
    beam: `${D}/cliffs-blade-to-the-sun.webp`,
    sunmatch: `${D}/cliffs-two-suns.webp`,
    gate: `${D}/cliffs-shield-opens.webp`,
    beams: `${D}/cliffs-signal-golden-beams.webp`,
    valley: `${D}/cliffs-plate-and-the-route.webp`,
    standoff: `${D}/cliffs-watcher-across-the-gorge.webp`,
    kosei4: `${D}/cliffs-warden-on-the-walls.webp`,
    hills4: `${D}/cliffs-daigo-in-the-hills.webp`,
  },
  size: {
    cliffs: SZ, bridge: SZ, summit: [1671, 941], beam: SZ, sunmatch: SZ, gate: [1671, 941], beams: [2170, 725],
    valley: SZ, standoff: SZ, kosei4: SZ, hills4: SZ,
  },
  pos: {
    cliffs: [0.3, 0.5], bridge: [0.3, 0.5], summit: [0.35, 0.5], beam: [0.3, 0.5], sunmatch: [0.5, 0.5], gate: [0.35, 0.5],
    beams: [0.5, 0.5], valley: [0.35, 0.5], standoff: [0.6, 0.5], kosei4: [0.3, 0.5], hills4: [0.3, 0.5],
  },
  fit: { beams: "contain" },
  faces: {
    kosei4: { warden4: { rect: [0.17, 0.12, 0.27, 0.3], side: "r" } },
    hills4: { daigo4: { rect: [0.24, 0.12, 0.38, 0.34], side: "r" } },
  },
  // Kenji's hat is off at the summit shield.
  kpose: { beam: "sword", sunmatch: "sword", gate: "sword", valley: "sword" },
};

const has = (st, id) => st.inv.includes(id);

export const SCRIPTS4 = {
  d4_arrive: [
    { who: "kenji", pose: "travel", thought: true, text: "Seven days of climbing. Namonoki said the cliffs would show me what the roots cannot." },
    { who: "kenji", pose: "armed", thought: true, text: "Wind like a hand against my chest. And nests up there the size of houses." },
  ],
  d4_climb: [
    { who: "narr", narr: true, scene: "bridge", text: "Halfway up, the path ends at a rope bridge strung between two crags. One of its hand lines has snapped and hangs loose over the clouds." },
    { who: "kenji", pose: "armed", thought: true, if: (st) => has(st, "cord"), text: "The red cord from the shrine. Someone braided it to hold a hilt. It can hold a bridge for one crossing." },
    { who: "narr", narr: true, if: (st) => has(st, "cord"), text: "Kenji lashes the broken line with the braided cord, tests it twice, and crosses. The wind pulls at him the whole way, and the cord holds." },
    { who: "kenji", pose: "armed", thought: true, if: (st) => !has(st, "cord"), text: "No rope to mend it with. The long way around, then." },
    { who: "narr", narr: true, if: (st) => !has(st, "cord"), text: "The way around the crag costs Kenji a full day on narrow ledges, his back to the stone and the eagles circling below his feet." },
  ],
  d4_summit: [
    { who: "narr", narr: true, scene: "summit", text: "At the highest point stands an old temple open to the sky. In its center hangs what looks like a great mirror." },
    { who: "kenji", pose: "armed", thought: true, text: "Not a mirror. A shield. Bronze, ceremonial, older than anything in Kosei. Dull with dust, catching only a glint of the sun." },
    { who: "kenji", pose: "armed", thought: true, text: "Signal stones along the ridge, each with a bronze reflector beside it. They were built to carry light from one to the next. All the way to this shield." },
    { who: "narr", narr: true, hidePor: true, scene: "beam", text: "Kenji draws Hikariwake to cut away the vines. The sun catches the blade, and a white beam leaps from the steel across the stone." },
    { who: "kenji", pose: "sword", thought: true, hidePor: true, text: "This is what it was for. Whoever left this blade for me meant it to be more than a weapon. It is a key." },
    { who: "ren", mem: true, noPartner: true, text: "Where you stand decides what you see, Kenji. Before you move anything, move yourself." },
    { who: "kenji", pose: "sword", thought: true, text: "Then I start by standing where the light can find me." },
    { who: "kenji", pose: "sword", thought: true, if: (st) => has(st, "flint"), text: "And the beacon basin at the top of the ridge. With the flint, I can light that one by hand." },
  ],
  d4_signal: [
    { who: "narr", narr: true, hidePor: true, scene: "sunmatch", text: "The shield blazes. At its center, one carved sun burns brighter than the rest, and Kenji knows it before he can say why." },
    { who: "kenji", pose: "sword", thought: true, hidePor: true, text: "The sun on my breastplate. The same sun. The one the Warden saw. The one Namonoki said I wear without knowing." },
    { who: "kenji", pose: "sword", thought: true, hidePor: true, text: "My house built this." },
    { who: "narr", narr: true, hidePor: true, scene: "gate", text: "With a sound like a long breath let go, the sun at the shield’s heart turns and sinks into the bronze. Ring after ring draws back. In the hollow behind them rests a plate of old bronze, warm from the light." },
    { who: "kenji", pose: "sword", thought: true, hidePor: true, text: "A map. Or part of one. Left here for whoever could carry the light this far." },
    { who: "narr", narr: true, hidePor: true, text: "Kenji lifts the plate free and slips it into his satchel." },
    { who: "narr", narr: true, hidePor: true, scene: "beams", anchor: { x: 0.705, y: 0.035, w: 0.28 }, text: "Light pours through the open shield and splits across the Reach. Signal stone after signal stone, fires wake on peaks Kenji has never seen. Every eagle on the cliffs lifts into the air at once." },
    { who: "narr", narr: true, hidePor: true, scene: "kosei4", anchor: { x: 0.64, y: 0.035, w: 0.33 }, text: "Far to the west, on the walls of Kosei, the Warden watches a pillar of light rise from the Nest Cliffs." },
    { who: "warden4", hidePor: true, anchor: { x: 0.33, y: 0.08, w: 0.28 }, text: "The old signal. Twenty years dark." },
    { who: "warden4", hidePor: true, anchor: { x: 0.33, y: 0.08, w: 0.28 }, text: "So. The boy has found his house." },
    { who: "warden4", hidePor: true, anchor: { x: 0.33, y: 0.08, w: 0.28 }, text: "Send riders to the coast. If the sea has seen this too, it will want to know who woke the land." },
    { who: "narr", narr: true, hidePor: true, scene: "hills4", anchor: { x: 0.64, y: 0.035, w: 0.33 }, text: "In the broken hills, men in red-lined hats watch the same light." },
    { who: "daigo4", hidePor: true, anchor: { x: 0.37, y: 0.14, w: 0.28 }, text: "Twenty years dark, and he lights it in a day." },
    { who: "daigo4", hidePor: true, anchor: { x: 0.37, y: 0.14, w: 0.28 }, text: "No more shadows, then. Let him see us." },
    { who: "narr", narr: true, hidePor: true, scene: "valley", text: "On the summit, the light crosses the plate in Kenji’s hands. Lines on its surface burn gold, and the same lines run across the land below." },
    { who: "kenji", pose: "sword", thought: true, hidePor: true, text: "The light is drawing the route. If I trace what it shows me, I will know where to go." },
  ],
  d4_watched: [
    { who: "narr", narr: true, hidePor: true, scene: "standoff", pos: [0.8, 0.5], text: "On the broken ruins across the gorge, a figure stands in plain sight. A red-lined hat. Watching. It does not move when Kenji sees it." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, pos: [0.2, 0.5], text: "Not hiding anymore. Someone has been behind me since the shrine. Maybe longer." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, pos: [0.2, 0.5], text: "Let them watch. I am not turning back." },
  ],
  d4_route: [
    { who: "kenji", pose: "armed", thought: true, scene: "cliffs", text: "A passage through broken stone, across a windswept plain. Bridges that do not reach the other side." },
    { who: "kenji", pose: "armed", thought: true, text: "That is where the route goes. Down, and into the broken places." },
  ],
};

export const STEPS4 = ["The light of Hikariwake", "Trace the route"];
export const STORY_BEAMS = ["The first signal stone", "The second signal stone", "The third signal stone", "The summit shield"];
export const ROUTE_STOPS = ["To the eagles’ nest", "To the signal ridge", "To the broken passage"];

export const HEAD4 = {
  1: {
    kanji: "光",
    title: "The Light of Hikariwake",
    lede: "Sunlight strikes Hikariwake and leaps off the blade in a white beam. Old bronze reflectors stand along the ridge. Tap a reflector to turn it. Guide the beam through every signal stone and into the target. Grey stone reflectors are fixed in place; rocks stop the light.",
  },
  2: {
    kanji: "道",
    title: "Trace the Route",
    lede: "The bronze plate is cut into square tiles, each carrying a piece of an old engraved line. Light enters from the shield. Tap a tile to turn it. Connect one unbroken line of light from the shield to every landmark on the plate, and the route will show itself on the land below.",
  },
  3: { kanji: "視", title: "What the Cliffs Showed", lede: "" },
  4: {
    kanji: "習",
    title: "Practice on the Cliffs",
    lede: "Fresh light puzzles and fresh pictures, as many as you like. Best times are kept on this device.",
  },
};
