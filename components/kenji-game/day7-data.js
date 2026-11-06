// Day Seven: First Light (the Aokiri Expanse). Story data and dialogue scripts.
// Copy follows "Day Seven Copy and Dialogue".

import { CAST3, POR3 } from "./day3-data";

const D = "/kenji-game/day7";
const SZ = [1672, 941];

export const ART7 = {
  edge: `${D}/expanse-edge.webp`,
  firstLight: `${D}/expanse-first-light.webp`,
  table: `${D}/expanse-puzzle-table.webp`,
  scroll: `${D}/scroll-whole-route.webp`,
  stillness: `${D}/sanctuary-stillness.webp`,
};

export const POR7 = POR3;
export const CAST7 = CAST3;

export const SCENES7 = {
  src: {
    deep7: `${D}/expanse-deep.webp`,
    table7: `${D}/expanse-scroll-table.webp`,
    scroll7: `${D}/scroll-whole-route.webp`,
    path7: `${D}/expanse-light-path.webp`,
    door7: `${D}/expanse-door.webp`,
    sanct7: `${D}/sanctuary-empty.webp`,
    sit7: `${D}/sanctuary-stillness.webp`,
  },
  size: { deep7: SZ, table7: [1671, 941], scroll7: [1254, 1254], path7: SZ, door7: SZ, sanct7: SZ, sit7: SZ },
  pos: { deep7: [0.35, 0.5], table7: [0.5, 0.5], scroll7: [0.5, 0.5], path7: [0.4, 0.5], door7: [0.55, 0.5], sanct7: [0.45, 0.5], sit7: [0.5, 0.5] },
  fit: { scroll7: "contain" },
};

// What Kenji carries forward: the choice that closes the game.
export const CARRY = {
  teach: ["Teach", "He will teach what he was taught, so no one has to find it alone."],
  protect: ["Protect", "He will stand between the Reach and whatever comes to break it."],
  remember: ["Remember", "He will remember, without being imprisoned by memory."],
  build: ["Build", "He will build where others destroyed."],
};

export const SCRIPTS7 = {
  d7_arrive: [
    { who: "kenji", pose: "travel", thought: true, text: "Fifteen days inland from the sea. The roads ended three days ago." },
    { who: "kenji", pose: "armed", thought: true, text: "Trees taller than the Wall. Things moving under the roots. Nothing here hurries." },
  ],
  d7_enter: [
    { who: "narr", narr: true, hidePor: true, scene: "deep7", text: "Past the established roads, the jungle grows taller and denser. Old creatures move beneath roots and through branches. No one has cut a path here in a very long time." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, text: "No single clue is enough here. The scroll, the plates, the blade. Everything I carry has to become one thing." },
    { who: "narr", narr: true, hidePor: true, scene: "table7", text: "Kenji spreads everything out on a flat stone: the quest scroll, the two bronze plates, and the pieces of the route each place gave him along the way." },
  ],
  d7_scroll: [
    { who: "narr", narr: true, hidePor: true, scene: "scroll7", text: "The pieces lock together, and for the first time the scroll makes sense: the shrine, Kosei, the grove, the cliffs, the passage, the Wall. A single road, drawn by one hand, ending at a door of light." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, text: "Order, from Kosei. Listening, from the grove. Alignment, from the cliffs. Composure, from the passage. Respect, from the Wall." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, text: "Every place taught me one thing. The road only works if I carry all of them at once." },
  ],
  d7_light: [
    { who: "narr", narr: true, hidePor: true, scene: "path7", text: "Morning breaks through the trees." },
    { who: "narr", narr: true, hidePor: true, text: "Emichō appears once more, on wings of pale fire. When the sunlight reaches Hikariwake, the blade throws a single line of light across the jungle floor." },
    { who: "narr", narr: true, hidePor: true, scene: "door7", text: "It ends at a narrow door in the roots of the oldest tree, light leaking at its edges." },
    { who: "narr", narr: true, hidePor: true, text: "Kenji opens the way." },
    { who: "narr", narr: true, hidePor: true, flash: true, scene: "sanct7", text: "No kingdom. No army. No treasure. Nothing that can return his family, or rebuild the world that was lost." },
    { who: "narr", narr: true, hidePor: true, text: "The sanctuary is almost empty. A mat. A bowl of water. Words cut into the floor." },
    { who: "kenji", pose: "armed", hidePor: true, parch: true, title: "Cut into the floor", text: "Sit. Breathe.\nSee what is there, and nothing else." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, text: "This is it? After everything?" },
    { who: "ren", mem: true, noPartner: true, text: "Stillness is not doing nothing, Kenji. It is refusing to be moved by the wrong things." },
  ],
  d7_end: [
    { who: "narr", narr: true, hidePor: true, scene: "sit7", text: "The fear passes. The grief passes. The wanting passes. What remains is the room, the light, and Kenji in it, seeing clearly." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, text: "The journey was the inheritance. They did not build a road to treasure. They built a road toward readiness." },
    { who: "narr", narr: true, hidePor: true, text: "Emichō settles on the rim of the water bowl, opens her wings once, and is gone into the light." },
    { who: "narr", narr: true, hidePor: true, text: "He cannot recreate the world his family lost. But he can teach, protect, remember without being imprisoned by memory, and build where others destroyed." },
    {
      who: "kenji",
      pose: "armed",
      thought: true,
      hidePor: true,
      choices: Object.entries(CARRY).map(([k, v]) => {
        const s = v[1].replace(/^He will /, "").replace(/\.$/, "");
        return { t: s.charAt(0).toUpperCase() + s.slice(1), set: k };
      }),
      pickKey: "carry",
      text: "What will Kenji carry forward?",
    },
  ],
};

// Stillness: fear, grief and desire come to Kenji, and he lets each pass.
export const VISIONS = [
  { k: "fear", name: "Fear", img: "/kenji-game/day6/daigo-full.webp", whisper: "“Turn around, boy. I am right behind you.”" },
  { k: "grief", name: "Grief", img: `${D}/vision-grief.webp`, whisper: "“Kenji. Come home. We waited so long.”" },
  { k: "desire", name: "Desire", img: `${D}/vision-desire.webp`, whisper: "“All of it could be yours again. The house, the banners, the sun on every wall. Just reach.”" },
];

export const SCN = { initiate: 3, disciple: 4, master: 5 };

export const STEPS7 = ["The assembled scroll", "Stillness"];

export const HEAD7 = {
  1: {
    kanji: "巻",
    title: "The Assembled Scroll",
    lede: "Every place on the road gave Kenji a piece of the scroll. Slide the pieces into the empty space until they make one picture. Only the whole scroll makes sense.",
  },
  2: {
    kanji: "静",
    title: "Stillness",
    lede: "Press and hold to sit still: hold the button, or the space bar. Things will come to you. Notice them, and let them pass. Letting go, or moving, breaks the stillness.",
  },
  3: { kanji: "光", title: "First Light", lede: "" },
  4: {
    kanji: "庵",
    title: "The Sanctuary",
    lede: "The road is open in every direction now. Return to any trial, at any rank, as often as you like. The daily trial changes every day.",
  },
};
