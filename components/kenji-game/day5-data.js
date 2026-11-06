// Day Five: the Era of Confrontation (the Broken Passage). Story data and
// dialogue scripts. The fight itself is "Battle at the Broken Passage", an
// embedded game (public/kenji-game/day5/fight.html) that reports each
// crossing back to the page. Copy follows "Day Five Copy and Dialogue".

import { CAST3, POR3 } from "./day3-data";
import { day3Answered } from "@/lib/kenjiJourney";

const D = "/kenji-game/day5";
const SZ = [1672, 941];
const SZ_JPG = [1280, 720];

export const ART5 = {
  approach: `${D}/passage-approach.jpg`,
  five: `${D}/passage-the-five.jpg`,
  sunset: `${D}/passage-sunset-crossing.webp`,
  plate: "/kenji-game/day4/item-map-plate.webp",
  fight: `${D}/fight.html`,
};

export const POR5 = {
  ...POR3,
  v_staff: `${D}/vashara-staff-fighter.webp`,
  v_chain: `${D}/vashara-ball-and-chain.webp`,
  v_archer: `${D}/vashara-archer.webp`,
  v_smoke: `${D}/vashara-smoke-walker.webp`,
  v_fifth: `${D}/vashara-fifth.webp`,
};

export const CAST5 = {
  ...CAST3,
  staff: { name: "The Staff Fighter", side: "right", art: { close: ["v_staff", "l"] } },
  chain: { name: "The Ball-and-Chain", side: "right", art: { close: ["v_chain", "l"] } },
  archer: { name: "The Archer", side: "right", art: { close: ["v_archer", "l"] } },
  smoke: { name: "The Smoke Walker", side: "right", art: { close: ["v_smoke", "l"] } },
  fifth: { name: "The Vashara Fifth", side: "right", art: { close: ["v_fifth", "l"] } },
  daigo5: { name: "The man in the red-lined hat", side: "right", art: { close: ["watcher", "r"] } },
};

export const SCENES5 = {
  src: {
    approach5: `${D}/passage-approach.jpg`,
    five5: `${D}/passage-the-five.jpg`,
    broken5: `${D}/passage-broken-bridge.jpg`,
    emicho5: `${D}/passage-emicho-rises.webp`,
    court5: `${D}/passage-courtyard.jpg`,
    leap5: `${D}/passage-fifth-falls.webp`,
    plates5: `${D}/passage-two-plates.webp`,
    waits5: `${D}/passage-daigo-waits.webp`,
    empty5: `${D}/passage-empty-bridge.webp`,
    sunset5: `${D}/passage-sunset-crossing.webp`,
    white5: `${D}/passage-white-mist.webp`,
  },
  size: {
    approach5: SZ_JPG, five5: SZ_JPG, broken5: SZ_JPG, emicho5: SZ, court5: SZ_JPG, leap5: SZ, plates5: SZ, waits5: SZ,
    empty5: SZ, sunset5: SZ, white5: SZ,
  },
  pos: {
    approach5: [0.3, 0.5], five5: [0.5, 0.5], broken5: [0.5, 0.5], emicho5: [0.62, 0.5], court5: [0.5, 0.5], leap5: [0.42, 0.5],
    plates5: [0.55, 0.5], waits5: [0.72, 0.5], empty5: [0.72, 0.5], sunset5: [0.35, 0.5], white5: [0.6, 0.5],
  },
};

export const CROSSINGS = ["The carved courtyard", "The ruined ledge", "The rope bridge", "The weathered bridge", "The broken span"];
export const FOES = ["the Staff Fighter", "the Ball-and-Chain", "the Archer", "the Smoke Walker", "the Vashara Fifth"];
export const RANKDIFF = { initiate: 0, disciple: 1, master: 2 };

const has = (st, id) => st.inv.includes(id);
// Did Kenji stay silent at the voice in Naomori? Then Daigo's name is already his.
const heardDaigo = () => day3Answered() === false;

export const SCRIPTS5 = {
  d5_arrive: [
    { who: "kenji", pose: "travel", thought: true, text: "Six days down from the Nest Cliffs. The route on the plate ends here, at the Broken Passage." },
    { who: "kenji", pose: "armed", thought: true, text: "Old stone bridges over the chasm. The only way west. And before the sun reaches the river, I have to be across." },
  ],
  d5_ambush: [
    { who: "narr", narr: true, hidePor: true, scene: "empty5", text: "The Vashara Five hold every crossing, from the carved courtyard to the broken span." },
    { who: "narr", narr: true, hidePor: true, text: "Kenji tightens the straps of his pack. Hikariwake waits at his side, the blade that splits light." },
    { who: "narr", narr: true, hidePor: true, text: "Before the sun reaches the river, he must cross." },
    { who: "narr", narr: true, hidePor: true, scene: "court5", text: "Smoke drifts across the carved courtyard at the mouth of the passage. When it thins, Kenji is no longer alone." },
    { who: "narr", narr: true, hidePor: true, scene: "five5", text: "Five Vashara. Five crossings: the courtyard, the ruined ledge, the rope bridge, the weathered bridge, and the broken span. A hooded figure at every one." },
    { who: "staff", scene: "court5", text: "Mizuhara’s stray. The master said you would come down the old road." },
    { who: "kenji", pose: "armed", text: "Who is your master?" },
    { who: "staff", text: "Someone who remembers your house better than you do. The courtyard is ours, samurai. Turn back." },
    { who: "chain", text: "Let him come. The ledge is narrow, and iron is patient." },
    { who: "archer", text: "I will see him long before he sees me." },
    { who: "smoke", text: "And I will be wherever he is not looking." },
    { who: "fifth", text: "Enough. The master wants to know what the boy is worth. Let the passage tell him." },
    { who: "kenji", pose: "armed", thought: true, text: "Their stances. I know them. Ren’s forms, bent. Every strike turned toward a trick." },
    { who: "narr", narr: true, hidePor: true, scene: "emicho5", text: "Light gathers along Hikariwake’s edge, and Emichō rises from it on wings of pale fire. She does not strike. She does not show him the way. She stays near. A witness." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, text: "Five crossings. One sword. Then I had better be worth watching." },
    { who: "ren", mem: true, noPartner: true, text: "A guard is not waiting, Kenji. It is a question answered at the last possible moment. Answer too early and you have only flinched." },
  ],
  d5_after: [
    { who: "narr", narr: true, hidePor: true, scene: "leap5", text: "The Fifth leaps the gap for one last cut." },
    { who: "narr", narr: true, hidePor: true, text: "Kenji stamps the planks, and the broken span gives way beneath the leap." },
    { who: "narr", narr: true, hidePor: true, text: "The last of the Vashara Five falls into the mist. Something bronze clatters onto the last solid board." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, text: "They knew Ren’s forms. They knew my house. The Vashara are part of the same story I am digging up." },
    { who: "narr", narr: true, hidePor: true, scene: "plates5", text: "It is a second bronze plate, its edge cut to fit the first. Side by side, the lines run on unbroken, west, toward the sea." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, text: "A gate in the west, lit like a rising sun. That is where the route leads." },
    { who: "narr", narr: true, hidePor: true, scene: "waits5", mist: "gust", text: "Mist climbs out of the chasm. Where the bridge meets the cliff, a man in a red-lined hat has been watching." },
    { who: "daigo5", sil: true, reveal: true, text: "Five of mine, and you walked through them with the light still on your blade." },
    { who: "kenji", pose: "armed", text: "You. On the ruins across the gorge. You have been following me since the shrine." },
    { who: "daigo5", text: "Since before the shrine. Since before you could walk." },
    { who: "kenji", pose: "armed", text: "Who are you?" },
    { who: "daigo5", if: () => heardDaigo(), text: "The grove already told you, if you were listening. Namonoki never forgets a name. Not even the ones we try to bury." },
    { who: "daigo5", if: () => !heardDaigo(), text: "Someone who knew the hand that left you that sword. That will do, for now." },
    { who: "kenji", pose: "armed", text: "Then why not fight me yourself?" },
    { who: "daigo5", text: "Because a blade is not a man. I wanted to see which one the old house sent." },
    { who: "daigo5", text: "Go to the sea. Learn what your house promised it. Then we will speak of what you owe, and to whom." },
    { who: "daigo5", if: (st) => has(st, "letter"), text: "And open the letter you carry. Before someone opens it for you." },
    { who: "kenji", pose: "armed", thought: true, if: (st) => has(st, "letter"), text: "He knows about the letter." },
    { who: "narr", narr: true, hidePor: true, scene: "white5", mist: "full", text: "Mist rolls over the far end of the bridge, until there is nothing left but white." },
    { who: "narr", narr: true, hidePor: true, scene: "empty5", mist: "off", text: "When it clears, the cliff is empty." },
    { who: "narr", narr: true, hidePor: true, scene: "sunset5", text: "The sun sinks into the river. Emichō settles back into the light of the blade, and the light goes quiet." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, if: () => heardDaigo(), text: "The grove said a second name after mine. Daigo. Was it his? Whoever he is to me, the next time we meet, he will not walk away." },
    { who: "kenji", pose: "armed", thought: true, hidePor: true, if: () => !heardDaigo(), text: "He never gave me his name. Whoever he is to me, the next time we meet, he will not walk away." },
    { who: "narr", narr: true, hidePor: true, text: "Hikariwake catches the last light. The river runs gold toward the sea." },
  ],
};

export const HEAD5 = {
  1: {
    kanji: "戦",
    title: "Battle at the Broken Passage",
    lede: "Five Vashara hold five crossings. Each crossing is best of three rounds. Win the round that decides a match and the Vashara is left dazed: Split the Light to finish him with Hikariwake. Read each opponent: guard just before a strike lands to parry it, duck the low ones, dodge the ones you cannot block.",
  },
  2: { kanji: "越", title: "What the Passage Cost", lede: "" },
  3: { kanji: "習", title: "Practice in the Passage", lede: "Fight any crossing again, at any rank." },
};
