// Day Six: the Era of Responsibility (the Wall of Waves). Story data and
// dialogue scripts. Copy follows "Day Six Copy and Dialogue".

import { CAST3, POR3 } from "./day3-data";

const D = "/kenji-game/day6";
const SZ = [1672, 941];

export const ART6 = {
  exterior: `${D}/wall-exterior.webp`,
  leaving: `${D}/wall-leaving.webp`,
  tunnel: `${D}/wall-tide-corridor.webp`,
  mirrorsDark: `${D}/wall-mirrors-dark.webp`,
};

export const POR6 = {
  ...POR3,
  nk_spirit: `${D}/namikai-spirit.webp`,
  nk_vast: `${D}/namikai-vast.webp`,
  daigo_full: `${D}/daigo-full.webp`,
};

export const CAST6 = {
  ...CAST3,
  namikai: { name: "Nami-Kai", side: "right", art: { close: ["nk_spirit", "l"], vast: ["nk_vast", "l"] } },
  stranger6: { name: "The man in the red-lined hat", side: "right", art: { close: ["watcher", "r"] } },
  daigo6: { name: "Daigo", side: "right", art: { close: ["watcher", "r"], full: ["daigo_full", "r"] } },
};

// The pictures behind the talk, the painted faces a box must keep clear of
// (left, top, right, bottom as fractions of the picture), and the side of
// the face the box prefers.
export const SCENES6 = {
  src: {
    sealed6: `${D}/wall-letter-sealed.webp`,
    opened6: `${D}/wall-letter-opened.webp`,
    wrath6: `${D}/wall-namikai-wrath.webp`,
    ruins6: `${D}/wall-ruins-sunset.webp`,
    gate6: `${D}/wall-gate-torch.webp`,
    tunnel6: `${D}/wall-tide-corridor.webp`,
    pooldark6: `${D}/wall-pool-dark.webp`,
    ringdark6: `${D}/wall-mirrors-dark.webp`,
    ringlit6: `${D}/wall-mirrors-lit.webp`,
    spirit6: `${D}/wall-namikai-spirit.webp`,
    stir6: `${D}/wall-pool-stirs.webp`,
    vashara6: `${D}/wall-daigo-vashara.webp`,
    breaks6: `${D}/wall-sea-breaks.webp`,
    holds6: `${D}/wall-kenji-holds.webp`,
    swept6: `${D}/wall-daigo-swept.webp`,
    leave6: `${D}/wall-leaving.webp`,
  },
  size: {
    sealed6: SZ, opened6: SZ, wrath6: SZ, ruins6: [1671, 941], gate6: SZ, tunnel6: SZ, pooldark6: SZ, ringdark6: SZ, ringlit6: SZ,
    spirit6: SZ, stir6: SZ, vashara6: SZ, breaks6: SZ, holds6: SZ, swept6: SZ, leave6: SZ,
  },
  pos: {
    sealed6: [0.5, 0.5], opened6: [0.55, 0.5], wrath6: [0.5, 0.5], ruins6: [0.5, 0.5], gate6: [0.3, 0.5], tunnel6: [0.5, 0.5],
    pooldark6: [0.5, 0.5], ringdark6: [0.3, 0.5], ringlit6: [0.3, 0.5], spirit6: [0.5, 0.5], stir6: [0.5, 0.5],
    vashara6: [0.5, 0.5], breaks6: [0.6, 0.5], holds6: [0.25, 0.5], swept6: [0.6, 0.5], leave6: [0.55, 0.5],
  },
  faces: {
    spirit6: {
      namikai: { rect: [0.46, 0.02, 0.555, 0.19], side: "r" },
      kenji: { rect: [0.48, 0.7, 0.53, 0.8], side: "r" },
    },
    wrath6: { namikai: { rect: [0.4, 0.08, 0.58, 0.3], side: "r" } },
    swept6: { daigo6: { rect: [0.45, 0.52, 0.66, 0.78], side: "r" } },
  },
};

const has = (st, id) => st.inv.includes(id);

const CHOICE6 = {
  who: "kenji",
  pose: "armed",
  hidePor: true,
  thought: true,
  choices: [
    { t: "“It is mine. My house built this, and I am what is left of it.”", set: "own" },
    { t: "“It doesn’t belong to me. I belong to it, and to what it promised.”", set: "resp" },
  ],
  pickKey: "answer",
  text: "What does Kenji answer?",
};

export const SCRIPTS6 = {
  d6_arrive: [
    { who: "kenji", pose: "travel", thought: true, text: "Eleven days west of the passage. The plates end here, where the land runs out." },
    { who: "kenji", pose: "armed", thought: true, text: "Monument, fortress, shrine, warning. The Warden called it a promise." },
  ],
  d6_enter: [
    { who: "narr", narr: true, hidePor: true, scene: "gate6", text: "The Wall of Waves rises out of the surf, older than Kosei, older than the names people give it. At its foot, a tunnel glows the colour of deep water." },
    { who: "narr", narr: true, hidePor: true, scene: "tunnel6", text: "Kenji enters with a torch and the opened scroll. Hikariwake stays in its sheath. Inside, the sea breathes through stone." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, text: "Stone gates over the tide channels. Another lock. Open it, and the way goes on." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, if: (st) => has(st, "letter"), text: "The letter is still sealed. He told me to open it. Not yet." },
  ],
  d6_locks: [
    { who: "narr", narr: true, hidePor: true, scene: "pooldark6", text: "The last gate grinds aside, and the tide runs in under the Wall, all the way to a dark pool at its heart." },
    { who: "kenji", pose: "armed", hidePor: true, parch: true, title: "Cut above the pool, worn almost smooth", text: "Audience must be requested." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, text: "The Warden’s words. I have been forcing doors. This was never a lock. It is asking whether I know how to ask." },
    { who: "ren", mem: true, noPartner: true, text: "A guest does not open the host’s doors, Kenji. He knocks, and waits, and lets himself be seen." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, scene: "ringdark6", text: "The mirrors around the pool. Light every one, and the hall is lit for whoever lives here." },
  ],
  d6_question: [
    { who: "narr", narr: true, hidePor: true, scene: "ringlit6", text: "Every mirror catches the torchlight at once. The pool goes still, then brightens from beneath." },
    { who: "narr", narr: true, hidePor: true, flash: true, scene: "spirit6", text: "Out of the light rises Nami-Kai, the sea guardian, in his luminous form: robes of moving water, a staff wound with rope and shell." },
    { who: "namikai", hidePor: true, anchor: { x: 0.56, y: 0.1, w: 0.3 }, text: "You lit my hall, little sun. Few remember how." },
    { who: "kenji", pose: "armed", hidePor: true, anchor: { x: 0.56, y: 0.62, w: 0.3 }, text: "I am Kenji, of the Mizuhara. The plates brought me here." },
    { who: "namikai", hidePor: true, anchor: { x: 0.56, y: 0.1, w: 0.3 }, text: "The plates. The blade. The scroll. You carry a great deal that is not yours." },
    { who: "narr", narr: true, hidePor: true, if: (st) => has(st, "charm"), text: "In Kenji’s palm, the wooden charm’s spirals turn warm. His breathing slows before he answers." },
    { who: "namikai", hidePor: true, anchor: { x: 0.56, y: 0.1, w: 0.3 }, text: "So tell me. Why do you believe the past belongs to you, simply because you inherited it?" },
    CHOICE6,
  ],
  d6_ask_again: [
    { who: "narr", narr: true, hidePor: true, scene: "ringlit6", text: "Every mirror catches the torchlight again. The pool stills, and brightens from beneath." },
    { who: "namikai", hidePor: true, flash: true, scene: "spirit6", anchor: { x: 0.56, y: 0.1, w: 0.3 }, text: "Again, little sun. Why do you believe the past belongs to you, simply because you inherited it?" },
    CHOICE6,
  ],
  d6_own: [
    { who: "kenji", pose: "armed", hidePor: true, scene: "spirit6", anchor: { x: 0.56, y: 0.62, w: 0.3 }, text: "It is mine. My house built this, and I am what is left of it." },
    { who: "namikai", hidePor: true, anchor: { x: 0.56, y: 0.1, w: 0.3 }, text: "Another said the same, once, standing where you stand. Look what it made of him." },
    { who: "narr", narr: true, hidePor: true, scene: "ringdark6", text: "The light drains out of every mirror at once. The pool goes black and still, and Nami-Kai is gone." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, text: "I answered like an owner. The hall will have to be asked again, and asked properly." },
  ],
  d6_resp: [
    { who: "kenji", pose: "armed", hidePor: true, scene: "spirit6", anchor: { x: 0.56, y: 0.62, w: 0.3 }, text: "It doesn’t belong to me. I belong to it, and to what it promised." },
    { who: "narr", narr: true, hidePor: true, text: "The light in the water steadies. The spirit’s long form settles, and the Wall grows quiet." },
    { who: "namikai", hidePor: true, anchor: { x: 0.56, y: 0.1, w: 0.3 }, text: "Then you may stand in my water a while longer." },
  ],
  d6_daigo: [
    { who: "narr", narr: true, hidePor: true, whip: true, scene: "vashara6", text: "Before Kenji can say more, the torches gutter. Boots on wet stone. Red-lined hats fill the passage behind him, and at their head walks a man with a blade already wet." },
    { who: "stranger6", text: "You lit the old hall. I wondered whether you would." },
    { who: "kenji", pose: "armed", text: "You. On the bridge you would not give me your name." },
    { who: "namikai", text: "Then I will give it. Daigo. Second son of the sun-house. You swore on this water once." },
    { who: "daigo6", text: "The Vashara call me Hakari now. That oath drowned with everything else." },
    { who: "daigo6", text: "I know the blade you carry. I know the scroll, and who taught you to stand like that, and the river people who raised you." },
    { who: "narr", narr: true, hidePor: true, if: (st) => has(st, "cord"), text: "His eyes fall to the red braid on Kenji’s hilt, and for a moment he goes completely still." },
    { who: "daigo6", if: (st) => has(st, "cord"), text: "I braided that cord. For my brother’s sword." },
    { who: "daigo6", if: (st) => has(st, "letter"), text: "And you still have not opened it. The letter in your satchel." },
    { who: "narr", narr: true, hidePor: true, scene: "sealed6", if: (st) => has(st, "letter"), text: "Kenji draws it out. The bear seal is still whole, dark red against paper gone soft with sea air." },
    { who: "kenji", pose: "armed", hidePor: true, if: (st) => has(st, "letter"), text: "On the bridge you told me to open it. Why do you care what it says?" },
    { who: "daigo6", if: (st) => !has(st, "letter"), text: "Your father left you a letter, did you know? It stayed on the altar when you left the shrine. We found it." },
    { who: "narr", narr: true, hidePor: true, scene: "sealed6", if: (st) => !has(st, "letter"), text: "Daigo flicks it across the wet stone. Kenji catches it. The bear seal is still whole, dark red against paper gone soft with sea air." },
    { who: "kenji", pose: "armed", hidePor: true, if: (st) => !has(st, "letter"), text: "You kept it sealed. Why?" },
    { who: "daigo6", hidePor: true, if: (st) => !has(st, "letter"), text: "Because it was never mine to open. Open it. Here, in front of the water." },
    { who: "daigo6", hidePor: true, if: (st) => has(st, "letter"), text: "Because I already know. Open it. Here, in front of the water." },
    { who: "narr", narr: true, hidePor: true, cut: true, scene: "opened6", text: "Kenji breaks the seal. The hand is unfamiliar. The words are few." },
    { who: "kenji", pose: "armed", hidePor: true, parch: true, title: "The letter reads", anchor: { x: 0.748, y: 0.02, w: 0.245 }, text: "If you are reading this, the sun-house has fallen and you have come to the sea.\nIf you find anyone with your skin, your hair, and your crest, remember they are home until you discover they are not.\nMy brother is among them." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, text: "My brother is among them." },
    { who: "daigo6", scene: "vashara6", text: "He always did write too much." },
    { who: "kenji", pose: "armed", text: "His brother. Then my father was—" },
    { who: "daigo6", text: "Not here. Not in front of the water." },
    { who: "daigo6", text: "Take him." },
    { who: "narr", narr: true, hidePor: true, text: "The Vashara draw steel inside the Wall." },
    { who: "namikai", hidePor: true, scene: "wrath6", anchor: { x: 0.62, y: 0.08, w: 0.3 }, text: "Steel, in my hall. The land will not command the sea. The sea will not consume the land. What comes to destroy one will answer to both." },
    { who: "narr", narr: true, hidePor: true, scene: "breaks6", text: "The pool erupts. Nami-Kai rises in his vast form, and the sea comes through the Wall like a door thrown open. The Vashara are swept back into the dark passages." },
    { who: "narr", narr: true, hidePor: true, scene: "holds6", text: "Kenji braces against the stone with Hikariwake drawn as the sea pours past him, through gates the Wall has kept shut for twenty years." },
    { who: "daigo6", hidePor: true, scene: "swept6", anchor: { x: 0.7, y: 0.5, w: 0.26 }, text: "This is not finished, boy. It was never only yours." },
    { who: "narr", narr: true, hidePor: true, text: "When the water falls, Daigo is gone." },
    { who: "namikai", scene: "ruins6", text: "I did not do this for you, little sun. A promise was broken in my hall, and I keep my promises." },
    { who: "namikai", text: "Go beyond the map. To the Aokiri Expanse. The Green Silence. Whatever your house left last, it left there. First Light." },
    { who: "narr", narr: true, hidePor: true, scene: "leave6", text: "At dawn, Kenji leaves the Wall of Waves behind. The road turns inland, toward green hills and a silence he can almost hear." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, text: "Daigo. Hakari. My father’s brother, or near enough to it. And he wants what my house left as much as I do." },
  ],
};
// Answering "It doesn't belong to me" carries straight on into Daigo and the sea.
SCRIPTS6.d6_after = [...SCRIPTS6.d6_resp, ...SCRIPTS6.d6_daigo];

export const STEPS6 = ["The tide locks", "The mirrors of the Wall"];

export const HEAD6 = {
  1: {
    kanji: "潮",
    title: "The Tide Locks",
    lede: "Stone gates block the tide channels under the Wall. Each gate slides only along its own track. Drag the gates to clear a path, then slide the tide out through the open side, toward the cavern. Every slide is one move; try to match the Wall’s own count.",
  },
  2: {
    kanji: "鏡",
    title: "The Mirrors of the Wall",
    lede: "Bronze mirrors ring the cavern pool. Turning one mirror also turns the mirrors beside it, above it, and below it. Bring every mirror to face the torchlight at once.",
  },
  3: { kanji: "責", title: "What the Wall Asked", lede: "" },
  4: {
    kanji: "習",
    title: "Practice at the Wall",
    lede: "Fresh locks and fresh mirrors. Best results are kept on this device.",
  },
};
