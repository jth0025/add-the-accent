// Day One: story data. Dialogue scripts, cast, portrait art and the
// positions of the five things hidden in the room.

const D = "/kenji-game/day1";

export const ART = {
  approach: `${D}/approach-establishing.webp`,
  closing: `${D}/closing-overlook.webp`,
  shrineClosed: `${D}/shrine-closed.webp`,
  shrineOpened: `${D}/shrine-opened.webp`,
  blade: `${D}/hikariwake-closeup.webp`,
  lantern: `${D}/lantern.webp`,
  emicho: `${D}/emicho.webp`,
  sealBackdrop: `${D}/seal-altar-backdrop.webp`,
  ringGate: `${D}/seal-ring-gate.webp`,
  ringSun: `${D}/seal-ring-sun.webp`,
  ringBlade: `${D}/seal-ring-blade.webp`,
  sealCenter: `${D}/seal-center.webp`,
  sealNotch: `${D}/seal-notch.webp`,
};

// Where each of the five room items sits, as a percentage of the room
// image, and how wide it draws.
export const FRAGS = [
  { id: "scroll", name: "Quest scroll", x: 27.4, y: 63.6, w: 8.5, text: "A rolled map, bound with braided cord and a sun clasp. Not the summons. Something older. In its margin, a small drawing of the altar dial: a sun, set directly under a notch.", clue: "sun" },
  { id: "charm", name: "Wooden charm", x: 42.2, y: 69.6, w: 3.4, text: "Three spirals carved into old wood, worn smooth by a thumb." },
  { id: "letter", name: "Sealed letter", x: 74.4, y: 63.8, w: 6.6, text: "Unopened. The red wax bears a roaring bear. On the back, in a careful hand: Let the gate stand beneath the mark.", clue: "gate" },
  { id: "cord", name: "Hilt cord", x: 28.7, y: 80.2, w: 9.5, text: "Faded red cord, braided by careful hands. It once wrapped a hilt." },
  { id: "whetstone", name: "Whetstone", x: 78.9, y: 80.8, w: 8.1, text: "A whetstone on worn leather, still gritty from its last blade. A sword is cut into its side, point upward, as if turned toward a mark.", clue: "blade" },
];

// What the room tells Kenji about the sun seal. Each clue is carried by
// one of the five finds, and points to one ring's symbol, which must
// rest under the notch.
export const CLUES = [
  { id: "gate", ring: 0, from: "Sealed letter", glyph: `${D}/clue-gate.webp`, name: "The gate", text: "On the back of the letter: Let the gate stand beneath the mark." },
  { id: "sun", ring: 1, from: "Quest scroll", glyph: `${D}/clue-sun.webp`, name: "The sun", text: "In the scroll's margin, the altar dial: a sun drawn directly under a notch." },
  { id: "blade", ring: 2, from: "Whetstone", glyph: `${D}/clue-blade.webp`, name: "The blade", text: "Cut into the whetstone, a sword with its point turned up, toward the mark." },
];

export const POR = {
  kenji_full: `${D}/kenji-back-armed.webp`,
  ren_close: `${D}/ren-close.webp`,
  ren_full: `${D}/ren-full.webp`,
  kenji_front: `${D}/kenji-front-armed.webp`,
  kenji_bow: `${D}/kenji-bow.webp`,
  kenji_sword: `${D}/kenji-sword.webp`,
  kenji_travel: `${D}/kenji-travel.webp`,
  kenji_walk: `${D}/kenji-back-walking.webp`,
  kenji_walk_close: `${D}/kenji-back-close.webp`,
  kenji_hat: `${D}/kenji-front-hat.webp`,
  watcher: `${D}/vashara-watcher-silhouette-src.webp`,
};

// art[pose] = [portrait key, which way the art naturally faces: 'l',
// 'r', or 'c' for centred / back views]. Kenji never appears with a
// sword (sword, bow, armed, armedback, travel) before he takes the blade.
export const CAST = {
  kenji: {
    name: "Kenji",
    side: "left",
    art: {
      close: ["kenji_hat", "c"],
      back: ["kenji_walk_close", "c"],
      backfull: ["kenji_walk", "c"],
      armed: ["kenji_front", "c"],
      armedback: ["kenji_full", "c"],
      bow: ["kenji_bow", "c"],
      sword: ["kenji_sword", "c"],
      travel: ["kenji_travel", "c"],
    },
  },
  watcher: { name: "Vashara watcher", side: "right", art: { close: ["watcher", "r"] } },
  ren: { name: "Master Ren", side: "right", art: { close: ["ren_close", "r"], full: ["ren_full", "r"] } },
};

// Line options: thought (inner voice), mem (a memory, sepia and
// smoke), sil (unseen speaker, black silhouette), if(st) (plays only
// when true, used for choice payoffs).
export const SCRIPTS = {
  arrive: [
    { who: "kenji", pose: "backfull", thought: true, text: "The summons said only this: the shrine at the edge of the Reach. What remains there is yours." },
    { who: "kenji", pose: "back", thought: true, text: "Someone hung those banners. Someone kept that sun from fading." },
    { who: "kenji", text: "Four days of walking. Let’s see what was worth the road." },
  ],
  intro: [
    { who: "kenji", pose: "back", thought: true, text: "So this is what they left me. A shrine the forest has nearly swallowed." },
    { who: "kenji", pose: "back", thought: true, text: "No lamp left burning. No note. Only the dark, and whatever is waiting in it." },
    { who: "ren", mem: true, text: "When your eyes fail you, do not hurry. Listen. A room always tells you what it keeps." },
    { who: "kenji", text: "Slowly, then. Lantern first." },
  ],
  found: [
    { who: "kenji", thought: true, text: "A map. A letter I can’t bring myself to open. A cord someone braided by hand." },
    { who: "kenji", thought: true, text: "The map’s margin sketches the altar dial: a sun, set directly under a notch." },
    { who: "kenji", thought: true, text: "The letter’s back says to let the gate stand beneath the mark. The whetstone has a blade cut into it." },
    { who: "kenji", thought: true, text: "A gate, a sun, a blade, each beneath the notch. That is what the dial is asking. And it has gone warm." },
  ],
  seal: [
    { who: "ren", pose: "full", mem: true, text: "A lock is a question. Force it, and it only learns to hold tighter." },
    { who: "kenji", text: "Then I’ll answer it. Gate, sun and blade, each beneath the notch." },
  ],
  blade: [
    { who: "kenji", pose: "sword", thought: true, text: "Hikariwake. I only ever knew the name." },
    { who: "kenji", pose: "bow", text: "Rei. Kansha shimasu.", gloss: "A bow. I give thanks." },
    { who: "kenji", pose: "bow", thought: true, text: "Honor to my ancestor, who guarded such a gift for me through all these years. I am grateful. I will carry it with honor." },
    { who: "ren", mem: true, text: "A blade is not the inheritance, Kenji. It is only the part you can hold." },
    { who: "kenji", pose: "armed", thought: true, text: "Then the rest is still out there." },
  ],
  pack: [
    { who: "kenji", pose: "armed", thought: true, text: "I can’t carry all of it. Whatever stays on this altar stays here." },
    { who: "ren", mem: true, text: "Carry what you will use. Leave what you only mean to keep." },
  ],
  end: [
    { who: "kenji", pose: "travel", thought: true, text: "The summons brought me here. The map takes me further." },
    { who: "kenji", pose: "armedback", thought: true, text: "Inland, then. Toward Kosei, and the Warden’s city." },
    { who: "watcher", sil: true, text: "That wall stood for twenty years. Today it fell." },
    { who: "watcher", sil: true, text: "And that light on his blade. The old house has chosen someone." },
    { who: "watcher", sil: true, if: (st) => !st.packed.includes("letter"), text: "He left the letter on the altar. Careless. Or trusting. Either way, it’s ours now." },
    { who: "watcher", sil: true, if: (st) => st.packed.includes("letter"), text: "He took the letter. Then sooner or later, he will read it." },
    { who: "watcher", sil: true, text: "Send word to the others. Someone has opened the old house." },
  ],
};

export const STEPS = ["Search the room", "Open the sun seal", "Pack the satchel"];
