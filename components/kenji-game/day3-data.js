// Day Three: the Era of Listening (Naomori, the Ancient Grove). Story data,
// dialogue scripts, the glyph gate and Namonoki's song. Copy follows "Day
// Three Copy and Dialogue".

import { CAST as CAST1 } from "./day1-data";
import { CAST2, POR2 } from "./day2-data";

const D = "/kenji-game/day3";

export const ART3 = {
  prelude: `${D}/prelude.webp`,
  torii: `${D}/scene-torii.webp`,
  glyphs: `${D}/scene-glyphs.webp`,
  tree: `${D}/scene-tree.webp`,
  treelit: `${D}/scene-treelit.webp`,
  daigo: `${D}/scene-daigo.webp`,
  spring: `${D}/scene-spring.webp`,
};

// No new portraits: everyone in the grove is either in the picture or unseen.
export const POR3 = POR2;

// Day One and Two's cast, plus the grove's. `sil` characters are unseen.
export const CAST3 = {
  ...CAST2,
  kenji: CAST1.kenji,
  voice: { name: "A voice in the grove", side: "right", art: {} },
  figure: { name: "A figure in the branches", side: "right", sil: true, art: { close: ["watcher", "r"] } },
  grove: { name: "Namonoki", side: "right", art: {} },
  daigo: { name: "Daigo", side: "right", sil: true, art: { close: ["watcher", "r"] } },
};

// The cinematic pictures behind the talk. `size` is each picture's own size,
// so a box can be set beside a face before the picture has even loaded.
// `faces` is where the faces are in a picture (as fractions of it: left, top,
// right, bottom), which side of the face the box prefers, and where to hold the
// picture on a narrow screen while that character speaks (so the face and its
// box both fit). `kpose` is Kenji's pose while a scene shows (hat off here).
const SZ = { torii: [1672, 814], glyphs: [1671, 814], tree: [1672, 848], treelit: [1672, 848], daigo: [1672, 848], spring: [1672, 851] };

const TREE_FACE = { rect: [0.472, 0.02, 0.575, 0.325], side: "r", pos: [0.53, 0.5] };
const KENJI_AT_TREE = { rect: [0.375, 0.355, 0.43, 0.475], side: "l", pos: [0.26, 0.5] };

export const SCENES3 = {
  src: {
    torii: ART3.torii,
    glyphs: ART3.glyphs,
    tree: ART3.tree,
    treelit: ART3.treelit,
    daigo: ART3.daigo,
    spring: ART3.spring,
  },
  size: SZ,
  pos: { torii: [0.5, 0.5], glyphs: [0.5, 0.5], tree: [0.45, 0.5], treelit: [0.45, 0.5], daigo: [0.45, 0.5], spring: [0.4, 0.5] },
  faces: {
    tree: {
      kenji: KENJI_AT_TREE,
      grove: TREE_FACE,
      figure: { rect: [0.07, 0.035, 0.115, 0.115], side: "r" },
    },
    treelit: { kenji: KENJI_AT_TREE, grove: TREE_FACE },
    daigo: {
      daigo: { rect: [0.378, 0.37, 0.455, 0.5], side: "l", pos: [0.26, 0.5] },
      grove: TREE_FACE,
    },
    spring: { kenji: { rect: [0.1, 0, 0.29, 0.4], side: "r", pos: [0.08, 0.5] } },
  },
  kpose: { torii: "sword", glyphs: "sword", tree: "sword", treelit: "sword", spring: "sword" },
};

const has = (st, id) => st.inv.includes(id);

// Line options (as in Days One and Two): thought, mem, sil, narr, scene, pos,
// hidePor, if(st). Day Three adds zoom, focusAt, choices and faces (see
// Dialogue.jsx). A speaker whose face is in the picture gets the box beside it.
export const SCRIPTS3 = {
  d3_arrive: [
    { who: "kenji", pose: "travel", thought: true, text: "Five days east of Kosei, and the road simply ends at the trees. The Warden called it the Ancient Grove. The old charts called it Naomori." },
    { who: "kenji", pose: "armed", thought: true, text: "The forest of the True Name. Old torii, one after another, half swallowed by roots. Everything here is quiet, and the quiet is paying attention." },
  ],
  d3_enter: [
    { who: "kenji", pose: "sword", thought: true, scene: "torii", text: "The gate. Hat off; it seems the right thing to do here." },
    { who: "kenji", pose: "sword", thought: true, text: "These are not decorations. The pillars are written on, top to bottom, in a script I almost know." },
    { who: "ren", mem: true, text: "Close your eyes, Kenji. A blindfold takes nothing from you. It gives back what your eyes were drowning out." },
    { who: "kenji", pose: "sword", thought: true, if: (st) => has(st, "incense") && has(st, "flint"), text: "Ren always burned cedar before a lesson. Smoke makes old carvings easier to read." },
    { who: "kenji", pose: "sword", thought: true, if: (st) => has(st, "incense") && !has(st, "flint"), text: "Incense, and nothing to light it with. I should have kept the flint." },
    { who: "kenji", pose: "sword", thought: true, text: "No one passes this gate without reading it first. Then I read it." },
  ],
  d3_read: [
    { who: "kenji", pose: "sword", thought: true, scene: "glyphs", text: "“Pass beneath the gate in silence. Carry the sign of those who raised you. Naomori keeps every true name.”" },
    { who: "kenji", pose: "sword", thought: true, text: "Not a welcome. Instructions. Then I do exactly what it says, and nothing more." },
  ],
  d3_gate: [
    { who: "narr", narr: true, scene: "torii", hidePor: true, text: "As Kenji steps out from beneath the beam, the Mizuhara medallion warms in his hand, and the reed carved on it begins to glow a faint river green." },
    { who: "kenji", pose: "sword", thought: true, text: "It woke. Ren never told me it could do that." },
    { who: "kenji", pose: "sword", thought: true, text: "Reed and three ripples. Whatever this forest is, it knows the people who raised me." },
  ],
  // Kenji has reached the naming tree: from here the boxes sit beside faces.
  d3_name: [
    { who: "narr", narr: true, scene: "tree", hidePor: true, text: "At the heart of Naomori stands Namonoki, the oldest tree in the Reach, a face asleep in its bark. As Kenji lifts the flute, a voice drifts between the branches. Close, and everywhere at once." },
    { who: "voice", narr: true, hidePor: true, text: "“Mizuhara.”" },
    { who: "kenji", pose: "sword", thought: true, hidePor: true, text: "The name of the house that raised me. Do not answer until you are certain who is asking." },
    {
      who: "kenji",
      pose: "sword",
      thought: true,
      hidePor: true,
      choices: [
        { t: "Answer: “Who’s there?”", set: true },
        { t: "Stay silent, and listen", set: false },
      ],
      text: "Answer it, or keep still?",
    },
    { who: "kenji", pose: "sword", hidePor: true, if: (st) => st.answered === true, text: "Who’s there?" },
    { who: "narr", narr: true, hidePor: true, if: (st) => st.answered === true, text: "The voice stops. High above, a branch creaks, and something heavy moves away through the canopy." },
    { who: "kenji", pose: "sword", thought: true, hidePor: true, if: (st) => st.answered === true, text: "Whoever that was knows I am here now. Or knew it already." },
    { who: "narr", narr: true, hidePor: true, if: (st) => st.answered === false, text: "The voice comes again, softer. Then another name after it, as if the forest were reciting a list it has kept for years." },
    { who: "voice", narr: true, hidePor: true, if: (st) => st.answered === false, text: "“Daigo.”" },
    { who: "kenji", pose: "sword", thought: true, hidePor: true, if: (st) => st.answered === false, text: "Daigo. I have never heard that name. Then why does it sound like it belongs next to mine?" },
    { who: "figure", thought: true, hidePor: true, pos: [0.1, 0.1], zoom: { s: 2.2, x: 0.1, y: 0.07 }, focusAt: { x: 0.1, y: 0.075, rx: 0.06, ry: 0.08 }, if: (st) => st.answered === false, text: "It still remembers me." },
    { who: "figure", thought: true, hidePor: true, pos: [0.1, 0.1], zoom: { s: 2.2, x: 0.1, y: 0.07 }, focusAt: { x: 0.1, y: 0.075, rx: 0.06, ry: 0.08 }, text: "Let him find whatever is waiting. Then we will see what it is worth." },
  ],
  d3_spring: [
    { who: "voice", narr: true, scene: "tree", hidePor: true, text: "“Water,” the voice says, softer now, from somewhere inside the bark. “Before you play, bring water from the spring beneath my roots. Carried. Not spilled.”" },
    { who: "narr", narr: true, scene: "spring", hidePor: true, text: "Below Namonoki, the roots open around a still pool. Lanterns burn along its edge, and red leaves turn slowly on the surface." },
    { who: "kenji", pose: "sword", thought: true, hidePor: true, if: (st) => has(st, "gourd"), text: "The gourd. Good thing I kept it." },
    { who: "narr", narr: true, hidePor: true, if: (st) => has(st, "gourd"), text: "Kenji kneels and fills the gourd without disturbing the leaves, then carries it back up between the roots and pours it slowly at the base of the tree." },
    { who: "kenji", pose: "sword", thought: true, hidePor: true, if: (st) => !has(st, "gourd"), text: "No gourd. My hands will have to do." },
    { who: "narr", narr: true, hidePor: true, if: (st) => !has(st, "gourd"), text: "Kenji cups the water in his hands and climbs back between the roots. Most of it slips through his fingers before he reaches the tree." },
    { who: "kenji", pose: "sword", thought: true, scene: "tree", hidePor: true, if: (st) => has(st, "gourd"), text: "A sip of water, carried and given back. Something in the forest settles." },
    { who: "kenji", pose: "sword", thought: true, scene: "tree", hidePor: true, if: (st) => !has(st, "gourd"), text: "Only a few drops. The forest takes them anyway." },
    { who: "ren", mem: true, text: "Listen to the whole phrase before you answer it. The rests are part of the song." },
  ],
  d3_open: [
    { who: "narr", narr: true, scene: "treelit", hidePor: true, text: "The last note fades, and Kenji holds the silence after it. Beneath Namonoki, light opens under the torii like a held breath let go." },
    { who: "grove", hidePor: true, text: "Mizuhara." },
    { who: "kenji", pose: "sword", hidePor: true, text: "You know the name I carry." },
    { who: "grove", hidePor: true, text: "I know the name that carried you. Reed and river. Three ripples on still water." },
    { who: "grove", hidePor: true, text: "But roots remember older rain. You came in wearing one house, and you listen like another." },
    { who: "kenji", pose: "sword", hidePor: true, text: "Which other?" },
    { who: "grove", hidePor: true, text: "The one whose sun rides on your breast. You wear it the way a seed wears a forest: without knowing." },
    { who: "grove", hidePor: true, text: "A name is not given, Mizuhara. It is grown. Yours is not finished." },
    { who: "grove", hidePor: true, text: "Climb. The cliffs will show you what the roots cannot." },
    { who: "kenji", pose: "sword", thought: true, hidePor: true, text: "It looked at me the way the Warden looked at the sun on my armor. As if it recognized someone I have never met." },
  ],
  d3_daigo: [
    { who: "narr", narr: true, scene: "daigo", hidePor: true, zoom: { s: 3.2, x: 0.525, y: 0.62, tx: 0.5, ty: 0.42 }, text: "Kenji is a speck of light at the top of the stairs, and then he is gone. A man in a red-lined hat steps out of the trees and stands where Kenji stood." },
    { who: "grove", hidePor: true, text: "Son of the sun-house. Second root of the old line—" },
    { who: "daigo", hidePor: true, text: "Not that name. That house is ash, and I left it in the ash. I am Daigo." },
    { who: "grove", hidePor: true, text: "Daigo, then. A name you chose for yourself. Naomori keeps those too." },
    { who: "daigo", hidePor: true, text: "So you still know me, old tree." },
    { who: "grove", hidePor: true, text: "Every name spoken beneath my branches stays. Yours fell here once, like a seed beside another." },
    { who: "daigo", hidePor: true, text: "Then tell me what the old house left him." },
    { who: "grove", hidePor: true, text: "Nothing that can be taken. Only what can be carried." },
    { who: "daigo", hidePor: true, text: "Riddles. You were always better at riddles than at keeping promises." },
    { who: "grove", hidePor: true, text: "The blade he carries remembers the hand that left it behind. So do you." },
    { who: "daigo", hidePor: true, text: "..." },
    { who: "grove", hidePor: true, text: "Two roots from one seed. One reached toward the light. One reached beneath the others, and drank their water." },
    { who: "grove", hidePor: true, text: "A season is coming when you must choose which root you are. A root chooses only once." },
    { who: "daigo", hidePor: true, text: "I chose twenty years ago." },
    { who: "grove", hidePor: true, text: "You chose first. Naomori remembers that too. First is not the same as last." },
    { who: "grove", hidePor: true, text: "Go, Daigo. We will keep your name until you come back for it." },
    { who: "daigo", hidePor: true, text: "Then keep it well. When I come back, it will not be for my name." },
  ],
};

export const STEPS3 = ["The glyph gate", "Namonoki’s song"];

export const HEAD3 = {
  1: {
    kanji: "門",
    title: "The Glyph Gate",
    lede: "Three inscriptions cover the torii at the edge of Naomori: one on each pillar, one on the beam above. Each is carved in the old script. Every glyph stands for one letter, and the same glyph is always the same letter. Choose a glyph, then the letter you think it hides. Short words and repeated patterns are your best friends. When all three are read, do what they say.",
  },
  2: {
    kanji: "歌",
    title: "Namonoki’s Song",
    lede: "Namonoki plays a phrase of notes and silences. Then it is your turn. Play each note on its beat, and let every silence stay silent: a note sounded in a rest breaks the phrase as surely as a wrong one. Each phrase you repeat grows longer.",
  },
  3: { kanji: "聴", title: "What Naomori Heard", lede: "" },
  4: {
    kanji: "習",
    title: "Practice in the Grove",
    lede: "Fresh verses and endless phrases. Best results are kept on this device.",
  },
};

// ---- the glyph gate ----

export const STORY_VERSES = ["PASS BENEATH THE GATE IN SILENCE", "CARRY THE SIGN OF THOSE WHO RAISED YOU", "NAOMORI KEEPS EVERY TRUE NAME"];
export const STONE_NAMES = ["The left pillar", "The right pillar", "The beam above"];

export const VERSE_POOL = [
  "WATER REMEMBERS EVERY STONE",
  "LISTEN BEFORE YOU MOVE",
  "A LOCK IS A QUESTION",
  "THE ROOTS HOLD WHAT THE BRANCHES FORGET",
  "WHAT IS CARRIED LIVES",
  "NO LANTERN LIGHTS ITSELF",
  "THE PATIENT NET CATCHES MORE FISH",
  "EVERY BRIDGE BEGINS AS A RIVER",
  "A NAME SPOKEN HERE IS NEVER LOST",
  "THE TALLEST TREE WAS ONCE A SEED",
  "SILENCE IS ALSO AN ANSWER",
  "HOME IS AN AGREEMENT",
  "THE TIDE RETURNS FOR WHAT IT LEFT",
  "A QUIET HAND STEADIES THE SCALE",
  "WALK SOFTLY WHERE THE OLD ONES SLEEP",
  "THE WIND CARRIES WHAT THE MOUTH WILL NOT",
];

// The old script: 26 carved marks, each built from strokes on a 3x3 grid (a
// fixed seed, so the marks are the same every time).
export const GLYPHS = (() => {
  let s = 20261018;
  const r = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  const P = [[4, 4], [12, 4], [20, 4], [4, 12], [12, 12], [20, 12], [4, 20], [12, 20], [20, 20]];
  const seen = new Set();
  const out = [];
  while (out.length < 26) {
    const n = 3 + Math.floor(r() * 2);
    const segs = [];
    for (let k = 0; k < n; k += 1) {
      const a = Math.floor(r() * 9);
      let b = Math.floor(r() * 9);
      if (a === b) b = (b + 4) % 9;
      segs.push(a < b ? `${a}-${b}` : `${b}-${a}`);
    }
    const key = [...new Set(segs)].sort().join(",");
    if (seen.has(key) || new Set(segs).size < 3) continue;
    seen.add(key);
    let d = key
      .split(",")
      .map((sg) => {
        const [a, b] = sg.split("-").map(Number);
        return `M${P[a][0]} ${P[a][1]}L${P[b][0]} ${P[b][1]}`;
      })
      .join("");
    if (r() < 0.35) {
      const c = P[Math.floor(r() * 9)];
      d += `M${c[0] - 1.6} ${c[1]}a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0`;
    }
    out.push(d);
  }
  return out;
})();

// ---- Namonoki's song ----

// Tempo, the phrase to reach, and whether the beats show note and rest.
export const SONG = {
  initiate: { bpm: 70, goal: 6, show: true },
  disciple: { bpm: 84, goal: 8, show: true },
  master: { bpm: 96, goal: 10, show: false },
};
export const NOTE_FREQ = [293.66, 349.23, 392.0, 440.0, 523.25];

// ---- the crossing ----

export const SIGNS = [
  ["blade", "Draw Hikariwake and hold it up"],
  ["scroll", "Hold up the quest scroll"],
  ["sun", "Turn so the sun on his breastplate faces the gate"],
  ["medallion", "Lift the Mizuhara medallion from his sash"],
];
export const SIGN_NO = {
  blade: "The glyphs stay dark. A blade is not the sign of anyone who raised him. And the gate asked for silence, not steel.",
  scroll: "The scroll brought him here. It did not raise him. The gate does not stir.",
  sun: "The sun is older than the people who raised him. The gate does not stir, but something in the bark seems to lean closer.",
};
