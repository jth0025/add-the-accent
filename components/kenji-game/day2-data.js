// Day Two: the Era of Proof (Kosei). Story data, dialogue scripts, the
// ledger boards and the market. Copy follows "Day Two Copy and Dialogue".

import { CAST as CAST1, POR as POR1 } from "./day1-data";

const D = "/kenji-game/day2";

export const ART2 = {
  gate: `${D}/gate-arrival.webp`,
  departure: `${D}/departure.webp`,
  chamber: `${D}/chamber.webp`,
  market: `${D}/scene-market.webp`,
  board6: `${D}/board-6.webp`,
  board9: `${D}/board-9.webp`,
  tile: (v) => `${D}/tile-${v}.webp`,
};

export const POR2 = {
  ...POR1,
  warden_close: `${D}/warden-close.webp`,
  warden_full: `${D}/warden-full.webp`,
  warden_back: `${D}/warden-back.webp`,
  watch_helm: `${D}/watch-helm.webp`,
  watch_bare: `${D}/watch-bare.webp`,
  merch_reed: `${D}/merchant-reed.webp`,
  merch_potter: `${D}/merchant-potter.webp`,
};

// Day One's cast, plus Kosei's. `sil` characters are unseen: black
// silhouettes with a red edge.
export const CAST2 = {
  ...CAST1,
  watcher: { ...CAST1.watcher, sil: true },
  warden: {
    name: "The Warden of Kosei",
    side: "right",
    art: { close: ["warden_close", "c"], full: ["warden_full", "c"], back: ["warden_back", "c"] },
  },
  watch: { name: "Gate watch", side: "right", art: { close: ["watch_helm", "c"] } },
  captain: { name: "Watch captain", side: "right", art: { close: ["watch_bare", "c"] } },
  narr: { name: "", side: "right", art: {} },
  scout: { name: "Vashara scout", side: "left", sil: true, art: { close: ["watcher", "r"] } },
  reed: { name: "The reed-seller", side: "right", art: { close: ["merch_reed", "r"] } },
  potter: { name: "The potter", side: "right", art: { close: ["merch_potter", "r"] } },
};

// The cinematic pictures behind the talk, where to hold each on a narrow
// screen (x, y as fractions), where Kenji stands in "facing" for the
// focus effect, and where the fly circles.
export const SCENES = {
  src: {
    enter: `${D}/scene-enter.webp`,
    facing: `${D}/scene-facing.webp`,
    strike: `${D}/scene-strike.webp`,
    market: `${D}/scene-market.webp`,
    archive: `${D}/scene-archive.webp`,
  },
  pos: { enter: [0.4, 0.5], facing: [0.6, 0.5], strike: [0.62, 0.5], market: [0.5, 0.5], archive: [0.5, 0.5] },
  focus: { facing: { x: 0.28, y: 0.6, rx: 0.24, ry: 0.64 } },
  fly: { facing: { x: 0.62, y: 0.26 } },
  // Kenji's pose while a scene shows (hat off in the archive).
  kpose: { archive: "sword" },
};

const noFlute = (st) => !st.inv.includes("flute");
const hasFlute = (st) => st.inv.includes("flute");

// Line options (as in Day One): thought, mem, sil, if(st). Day Two adds
// scene, pos, narr, hidePor, pair, focus and fly (see Dialogue.jsx).
export const SCRIPTS2 = {
  d2_arrive: [
    { who: "kenji", pose: "travel", thought: true, text: "Four days since the shrine. The scroll said only this: follow the water until law stands above it." },
    { who: "kenji", pose: "armed", thought: true, text: "There, above the falls. The Warden’s citadel. Law, standing above the water." },
  ],
  d2_warden: [
    { who: "watch", scene: "enter", text: "The Warden will see you. Keep your hands where he can see them." },
    { who: "warden", pose: "back", text: "A dangerous traveler with an old blade, asking about histories most people have learned not to discuss." },
    { who: "warden", scene: "facing", hidePor: true, text: "Tell me why Kosei should open anything to you." },
    { who: "kenji", pose: "armed", thought: true, focus: true, fly: true, hidePor: true, pos: [0.28, 0.5], text: "A fly has been circling his seat since I walked in." },
    { who: "watch", fly: true, pair: ["watch", "warden"], text: "With respect, Warden, he hardly looks like a threat. A straw hat and an old sword." },
    { who: "narr", narr: true, scene: "strike", hidePor: true, text: "Without looking away from the Warden, Kenji draws the pin from his hair. A flick of the wrist. The fly hangs pinned to the pillar beside the Warden’s seat." },
    { who: "warden", pose: "full", scene: "facing", pair: ["watch", "warden"], text: "Watchman." },
    { who: "warden", pair: ["watch", "warden"], text: "You judged the hat and missed the hand. That is why you guard doors, and not this room." },
    { who: "watch", pair: ["watch", "warden"], text: "Forgive me, Warden." },
    { who: "narr", narr: true, hidePor: true, text: "The watchman bows and steps out into the hallway. The door closes behind him." },
    { who: "warden", text: "Attention. I can see you have that. Few men in this city do." },
    { who: "warden", pose: "full", text: "Come closer. Into the light." },
    { who: "warden", text: "That sun on your breastplate. Who gave you the right to wear it?" },
    { who: "kenji", pose: "armed", text: "It came with the armor. I never thought to ask." },
    { who: "warden", text: "I have not seen that sun worn openly in twenty years." },
    { who: "kenji", pose: "armed", thought: true, text: "He knows this sun. The same one hung on the banners at the shrine." },
    { who: "warden", text: "Attention can be taught to anyone. Order is something else. The house that wore that sun kept order like a prayer." },
    { who: "warden", pose: "full", text: "Keep a ledger for me. Every row, every column, every ward. Each emblem once. Nothing missing, nothing twice. I want to see what kind of hands were trained under that sun." },
  ],
  d2_l1: [
    { who: "warden", scene: "facing", text: "Clean. No hesitation in the corners. Where are you from, Kenji?" },
    { who: "kenji", pose: "armed", text: "House Mizuhara. Master Ren raised me." },
    { who: "warden", text: "Ren of the Mizuhara. Reed and three ripples. Patient people; I know the name." },
    { who: "warden", pose: "full", text: "But you were not born to them. You stand like the old house, not like the river." },
    { who: "warden", text: "And that medallion at your sash. The Mizuhara give those only to the ones they choose. A gift, not a birthright." },
    { who: "kenji", pose: "armed", text: "They chose me." },
    { who: "warden", text: "Then who did not?" },
    { who: "kenji", pose: "armed", thought: true, text: "That is the question I walked four days to ask." },
    { who: "warden", text: "Rest tonight in the barracks. Tomorrow I will set you a harder ledger." },
  ],
  d2_l2: [
    { who: "warden", pose: "full", scene: "facing", text: "Two more ledgers. The second is mine." },
    { who: "warden", text: "The third is not. It has lain open on this table for twenty years. My predecessor could not finish it, and neither could I." },
    { who: "warden", text: "Choose how you wish to be tested. I will know either way." },
    { who: "ren", mem: true, text: "Do not rush the empty spaces, Kenji. They tell you more than the full ones." },
  ],
  d2_l2b: [
    { who: "warden", scene: "facing", text: "Halfway. Most of my clerks stop here and ask for wine." },
    { who: "kenji", pose: "armed", text: "I’m not one of your clerks." },
    { who: "warden", pose: "full", text: "No. That much is plain." },
  ],
  d2_reveal: [
    { who: "warden", pose: "full", scene: "facing", text: "..." },
    { who: "narr", narr: true, hidePor: true, text: "The Warden lays a yellowed ledger beside Kenji’s, its last page blank for twenty years. Row for row, the way the emblems were placed is the same. The same order. The same hand." },
    { who: "warden", text: "This is how the old house kept its accounts. No one in Kosei has balanced one since it fell." },
    { who: "warden", text: "Your teacher could not have taught you this. It is older than the Mizuhara. It is in your hands." },
    { who: "kenji", pose: "armed", text: "Then the old house and the sun on my armor are the same house." },
    { who: "warden", pose: "full", text: "I invited you to the archives as a guest. I am asking you now to help me read them." },
  ],
  d2_archive: [
    { who: "warden", pose: "full", scene: "archive", text: "Some of these charts have not been unrolled since before the walls. Read with me." },
    { who: "narr", narr: true, hidePor: true, pos: [0.35, 0.6], text: "Together they work through the night. Near dawn, beneath charts older than Kosei itself, Kenji finds a grove marked east of the city. Beside it is a sign drawn in the same hand as his scroll." },
    { who: "warden", text: "Whoever wrote that knew this city before it had walls." },
    { who: "kenji", pose: "sword", text: "Then that is where I go." },
    { who: "warden", text: "The Ancient Grove. Do not call it a forest. It is a memory." },
    { who: "warden", text: "Every name ever spoken beneath those trees is kept there. The living, and the lost. Kosei has guarded its edge since before these walls. We do not enter it. We keep others from entering it badly." },
    { who: "warden", text: "Go without noise. Cut nothing, draw nothing. It will speak to you in sound long before it shows you anything." },
    { who: "warden", text: "Its stones are carved in the old script, and it listens to the silences between notes more closely than the notes themselves." },
    { who: "warden", pose: "full", text: "And if you hear your own name in there, do not answer until you are certain who is asking." },
    { who: "kenji", pose: "sword", thought: true, text: "My own name. Who else would know it?" },
    { who: "narr", narr: true, hidePor: true, pos: [0.88, 0.6], text: "The Warden unrolls one more chart: the coast, and a long stone wall standing in the sea." },
    { who: "warden", pos: [0.88, 0.6], text: "This is the other promise Kosei keeps. Older than my office, older than the city." },
    { who: "warden", pose: "full", pos: [0.88, 0.6], text: "The land will not command the sea. The sea will not consume the land. What comes to destroy one will answer to both." },
    { who: "warden", pos: [0.88, 0.6], text: "My office keeps that promise on the land’s side. Something far older keeps it on the other." },
    { who: "kenji", pose: "sword", text: "Who keeps it on the sea’s side?" },
    { who: "warden", text: "Pray you never have to ask him. The fishermen say the tide has been restless this year, as if something beneath it is listening for a broken word." },
    { who: "warden", text: "And the grove does not open for blades. Every account agrees: it answers music." },
    { who: "warden", if: noFlute, text: "You will need a reed. The reed-seller by the stone bridge makes the best in Kosei. Bargain well; he enjoys it." },
    { who: "kenji", pose: "sword", if: hasFlute, text: "I carry a flute already." },
    { who: "warden", if: hasFlute, text: "Then show the reed-seller. He will tell you if it is fit for the grove. And walk the market before you leave. A city is more than its ledgers." },
    { who: "captain", text: "I’ll take you as far as the market. The east gate is through it." },
  ],
  d2_market: [
    { who: "kenji", pose: "armed", thought: true, scene: "market", text: "Children chasing each other under the banners. Two merchants arguing over the weight of salt. Nobody here is waiting to be rescued." },
    { who: "kenji", pose: "armed", thought: true, text: "This is what a home looks like when it survives." },
    { who: "kenji", pose: "armed", thought: true, if: noFlute, text: "A reed for the grove. The reed-seller by the stone bridge." },
  ],
  d2_needreed: [
    { who: "kenji", pose: "armed", thought: true, scene: "market", text: "Not without a reed. The grove will not open to a blade, and the reed-seller is still by the bridge." },
  ],
  // The reed-seller: a few words with Kenji before the bargain, a look back
  // at it afterwards. He stands up (slides in) to start and again to close.
  d2_reed: [
    { who: "reed", scene: "market", text: "A traveler who stops for music. Good. Most only stop for food." },
    { who: "kenji", pose: "armed", text: "The Warden sent me. He says you make the best reeds in Kosei, and that you enjoy a bargain." },
    { who: "reed", text: "Did he now. Then you will enjoy this. Every flute I sell has a word inside it. Guess the word, and the price stays kind." },
    { who: "kenji", pose: "armed", thought: true, if: noFlute, text: "Ren would laugh to see me bargaining for a flute. Then he would tell me to listen first." },
  ],
  d2_reed_again: [
    { who: "reed", scene: "market", text: "Back for another word? Let us see what is inside this one." },
    { who: "kenji", pose: "armed", text: "Let us." },
  ],
  d2_reed_win: [
    { who: "reed", scene: "market", text: "There. A good voice in it. It will hold a low note a long way." },
    { who: "kenji", pose: "armed", text: "Thank you. I will take care of it." },
    { who: "reed", text: "Play it softly where you are going, and listen before it answers." },
  ],
  d2_reed_short: [
    { who: "reed", scene: "market", text: "You have the word, traveler, and not the coins. Come back when your purse agrees with your head." },
    { who: "kenji", pose: "armed", text: "I will." },
  ],
  d2_reed_lose: [
    { who: "reed", scene: "market", text: "Six wrong letters! Ha. Do not look so grim. The word will keep until tomorrow." },
    { who: "kenji", pose: "armed", text: "Then I will listen harder." },
  ],
  d2_potter: [
    { who: "potter", scene: "market", text: "Mind the shelves. Everything here holds water except my patience." },
    { who: "potter", text: "You want a gourd? Then you want a word. Mine are never short." },
  ],
  d2_recog_cord: [
    { who: "reed", scene: "market", text: "Wait. That red cord on your satchel. Let me see the braid." },
    { who: "reed", text: "I have seen this knot once before. Years ago. A swordsman stood where you stand and bought nothing." },
    { who: "kenji", pose: "armed", text: "Who was he?" },
    { who: "reed", text: "He never gave a name. He wore a hat lined red as a wound, and he asked about the old house in the hills." },
    { who: "reed", text: "Same braid. Same way of standing still before he moves. You could be his son." },
    { who: "kenji", pose: "armed", thought: true, text: "The old house. My shrine. Someone with my family’s braid walked these streets before me." },
  ],
  d2_recog_walk: [
    { who: "potter", scene: "market", text: "Hold on. You walk like a man I sold water jars to, years back. Same shoulders. Same quiet." },
    { who: "potter", text: "He wore a hat lined red as a wound. He asked about the old house in the hills, and he paid in coins nobody here had seen before." },
    { who: "kenji", pose: "armed", text: "Did he give a name?" },
    { who: "potter", text: "Not one he meant." },
    { who: "kenji", pose: "armed", thought: true, text: "Someone was asking about my family’s shrine before I ever knew it existed." },
  ],
  d2_end: [
    { who: "kenji", pose: "travel", thought: true, text: "Nine days. I came looking for what my people lost. Kosei showed me what a home looks like when it survives." },
    { who: "kenji", pose: "armedback", thought: true, text: "And somewhere ahead of me, or behind, a man in a red-lined hat who knew my family before I did." },
    { who: "watcher", sil: true, pair: ["scout", "watcher"], text: "Nine days inside their walls, and he leaves with merchants waving after him." },
    { who: "scout", sil: true, pair: ["scout", "watcher"], text: "I can’t tell where he’s headed. Only that he walks like someone being led." },
    { who: "watcher", sil: true, pair: ["scout", "watcher"], text: "Keep on him. And send word to the master: he should be intercepted soon, before he finds whatever the old house left behind." },
  ],
};

export const STEPS2 = ["The Warden’s ledger", "The last ledgers", "The market of Kosei"];

export const HEAD2 = {
  1: {
    kanji: "証",
    title: "The Warden’s Ledger",
    lede: "Every row, every column, and every walled ward must hold each emblem exactly once. Nothing missing. Nothing twice. Choose a square, then an emblem.",
  },
  2: {
    kanji: "帳",
    title: "The Last Ledgers",
    lede: "Two more ledgers stand between Kenji and the archives: one of the Warden’s, and one that has lain unfinished on his table for twenty years. Choose how the Warden should test you. Disciple and Master ledgers are the full nine emblems.",
  },
  3: {
    kanji: "市",
    title: "The Market of Kosei",
    lede: "The Warden has sent Kenji for a reed before he leaves for the grove. Every stall bargains the same way. The merchant names a price and thinks of a word. Guess its letters. Each wrong letter raises the price by a coin, and six wrong letters end the bargain for the day.",
  },
  4: { kanji: "証", title: "What Day Two Proved", lede: "" },
  5: {
    kanji: "習",
    title: "Practice in Kosei",
    lede: "Fresh ledgers and fresh bargains, as many as you like. Best times are kept on this device.",
  },
};

// ---- the ledger ----

// Emblems 1 to 9: name, ink colour and a small drawing (for pencil notes).
export const EMB = [
  ["Tree", "#86b562", '<path d="M12 22v-8M12 15l-3.5-2.5M12 15l3.5-2.5"/><circle cx="12" cy="8.5" r="5.5"/>'],
  ["Sun", "#e5b54c", '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>'],
  ["Wave", "#5aa6d0", '<path d="M2 11c3-4 5-4 7 0s4 4 6 0 4-4 7 0M2 17c3-3 5-3 7 0s4 3 6 0 4-3 7 0"/>'],
  ["Gate", "#dc5d55", '<path d="M2.5 6.5h19M5 10.5h14M7 6.5V21M17 6.5V21M3.5 4.5h17"/>'],
  ["Reed", "#4fbfa6", '<path d="M12 22V3.5M12 10C9 8 6.5 8 4.5 9.5M12 14.5c3-2 5.5-2 7.5-.5M12 3.5c1.5-1 3-1 4 .5"/>'],
  ["Blade", "#cfd5de", '<path d="M12 2l2 4.5V16h-4V6.5z"/><path d="M7.5 16h9M12 16v6"/>'],
  ["Banner", "#b07fe0", '<path d="M6 2.5v19M6 3.5h12.5L15 8l3.5 4.5H6"/>'],
  ["Bridge", "#d3a06a", '<path d="M2 9.5h20M4 9.5V19M20 9.5V19M4 19c3.5-6 12.5-6 16 0"/>'],
  ["Scale", "#ec90b0", '<path d="M12 3v17M7 21h10M4 6.5h16M4 6.5L1.5 12.5h5zM20 6.5l-2.5 6h5z"/>'],
];

export const RANKS = {
  initiate: { label: "Initiate", n: 6, givens: 14, conf: true },
  disciple: { label: "Disciple", n: 9, givens: 32, conf: true },
  master: { label: "Master", n: 9, givens: 25, conf: false },
};

// Where each square sits on the board art (pixels of its 1254 x 1254
// picture), and the walls drawn between wards on the six-emblem board.
export const BOARD = {
  6: {
    src: ART2.board6,
    cols: [[187, 315], [337, 465], [487, 616], [637, 766], [787, 916], [937, 1066]],
    rows: [[192, 325], [344, 477], [496, 629], [648, 782], [800, 931], [950, 1081]],
    wards: [[626, 187, 626, 1081], [187, 486, 1066, 486], [187, 791, 1066, 791]],
  },
  9: {
    src: ART2.board9,
    cols: [[176, 262], [272, 358], [366, 454], [486, 573], [583, 669], [680, 766], [796, 885], [895, 981], [989, 1077]],
    rows: [[189, 277], [285, 374], [382, 471], [495, 585], [593, 682], [689, 778], [802, 891], [899, 988], [998, 1083]],
    wards: [],
  },
};

// ---- the market ----

// Each entry is [word, the merchant's hint].
export const WORDS = {
  initiate: [
    ["LANTERN", "It carries a small fire so you can see in the dark."],
    ["HARBOR", "Where ships rest from the sea."],
    ["CANAL", "Water taught to walk a city’s streets."],
    ["BANNER", "Kosei hangs its tree on these."],
    ["MERCHANT", "Me, and everyone else shouting on this street."],
    ["POTTERY", "What the potter’s hands make from clay."],
    ["BRIDGE", "It lets you cross the water without getting wet."],
    ["TEMPLE", "A house built for prayer."],
    ["GARDEN", "Planted, tended, and walked in at evening."],
    ["ISLAND", "Land with the sea on every side."],
    ["MELODY", "Notes that follow one another into a tune."],
    ["RHYTHM", "The beat beneath every song."],
    ["BAMBOO", "Hollow and green. The best flutes are cut from it."],
    ["HARVEST", "When the rice comes in from the fields."],
    ["COMPASS", "It tells a traveler which way is north."],
    ["WARDEN", "The man in the citadel who keeps this city’s order."],
    ["FISHERMAN", "He goes out on the tide and comes back with dinner."],
    ["KETTLE", "It sings on the fire when the tea water is ready."],
    ["RIBBON", "A narrow strip of silk tied in a girl’s hair."],
    ["SPIRAL", "A curl that winds in toward its own center."],
    ["WILLOW", "A tree that weeps over the riverbank."],
    ["ORCHARD", "Rows and rows of fruit trees."],
    ["LEDGER", "The book the Warden makes strangers balance."],
    ["MONSOON", "The season the rains arrive all at once."],
    ["PEBBLE", "A small stone the river has smoothed."],
    ["CEDAR", "A fragrant tree. Temple beams and incense come from it."],
    ["SANDALS", "What you wear on your feet on a hot road."],
    ["PADDLE", "It moves a boat when there is no wind."],
    ["SPICES", "Ginger, pepper, and all their cousins."],
    ["CARAVAN", "Traders who travel the long road together."],
    ["FERRY", "A boat that carries people across and back, all day long."],
    ["THREAD", "What the needle pulls behind it."],
    ["INKSTONE", "Where the scribe grinds her ink."],
    ["TEAHOUSE", "Where Kosei sits, sips, and gossips."],
    ["BELLTOWER", "It rings the hours over the city."],
    ["RIVERBANK", "Where the river meets the land."],
  ],
  disciple: [
    ["RICE PADDY", "A flooded field where rice grows."],
    ["SEA WALL", "Stone that keeps the tide out of the town."],
    ["WARDEN CITY", "What travelers call Kosei."],
    ["RIVER STONES", "What the water smooths and the children skip."],
    ["PAPER LANTERN", "A light with walls you could tear with one finger."],
    ["TEMPLE BELL", "Struck at dawn so the whole city wakes."],
    ["NORTH CANAL", "The waterway this market sits beside."],
    ["HOUSE MIZUHARA", "Reed and three ripples. A family by the river."],
    ["KUROSHIO REACH", "This whole land between the mountains and the sea, by its proper name."],
    ["STRAW HAT", "What you are wearing on your head."],
    ["SALT MERCHANT", "The man three stalls down, arguing about the weight of what he sells."],
    ["NIGHT MARKET", "When the stalls open again after sunset."],
    ["STONE BRIDGE", "Where I sit and sell my flutes."],
    ["CEDAR SMOKE", "What incense smells like when it burns."],
    ["TIDE TABLE", "The fishermen’s chart of when the water comes and goes."],
    ["BAMBOO FLUTE", "What you came to this stall to buy."],
    ["MOUNTAIN PASS", "The narrow way between two peaks."],
    ["HARBOR MASTER", "The man who decides which ship docks where."],
    ["SPRING FESTIVAL", "When the blossoms open and the whole city dances."],
    ["WAVE PATTERN", "The curling design on the potter’s jars and the hem of my robe."],
    ["EMERALD FOREST", "Woods named for their color."],
    ["CLOUD PEAKS", "Mountains so high they wear the clouds."],
    ["WINDSWEPT PLAINS", "Grassland where the wind never rests."],
    ["FISH MARKET", "Follow your nose to the harbor in the morning."],
    ["WOVEN BASKET", "What the rice seller carries her rice in."],
  ],
  master: [
    ["WHAT IS CARRIED LIVES", "The words stitched on the Mizuhara banner."],
    ["LISTEN BEFORE YOU MOVE", "What every good teacher tells a restless student."],
    ["AUDIENCE MUST BE REQUESTED", "Said of the Warden, and of things far older than him. You do not take it."],
    ["THE LAND WILL NOT COMMAND THE SEA", "The first line of the old treaty."],
    ["FOLLOW THE WATER", "Advice for anyone lost in the hills. It always leads somewhere."],
    ["A LOCK IS A QUESTION", "Force it, and it only holds tighter."],
    ["WATER REMEMBERS EVERY STONE", "The river never forgets what it has worn smooth."],
    ["A FULL SATCHEL IS A HEAVY ONE", "Said to travelers who will not leave anything behind."],
    ["THE TIDE RETURNS FOR WHAT IT LEFT", "A fishermen’s saying: nothing on the beach is yours for long."],
    ["EVERY BRIDGE BEGINS AS A RIVER", "Before anyone can cross, something must divide."],
    ["A QUIET HAND STEADIES THE SCALE", "What the Warden’s clerks are told on their first day."],
    ["HOME IS AN AGREEMENT", "Not a place you own. Something you keep."],
    ["THE PATIENT NET CATCHES MORE FISH", "A fisherman’s advice against hurrying."],
    ["BORROWED SALT STILL SEASONS", "A favor still helps, even when it is not yours."],
    ["NO LANTERN LIGHTS ITSELF", "Every light needs someone to carry the flame."],
    ["A CITY IS ITS PROMISES KEPT", "What Kosei says it is, behind its walls."],
  ],
};

export const HINT = {
  initiate: "A word of the Reach",
  disciple: "A name or place of the Reach, two or more words",
  master: "A saying of the Reach",
};

export const STALLS = [
  { id: "reed", name: "The reed-seller", where: "By the stone bridge", greet: "He plays a few notes before he names a price.", wares: [["flute", 3]], face: "merch_reed" },
  { id: "potter", name: "The potter", where: "Under the purple awning", greet: "Her hands are still grey with clay.", wares: [["gourd", 2]], face: "merch_potter" },
  { id: "rice", name: "The rice stall", where: "Beside the granary steps", greet: "Steam rises from the baskets.", wares: [["rice", 2]] },
  { id: "iron", name: "The ironmonger", where: "In the smoke of the forge lane", greet: "He weighs you the way he weighs iron.", wares: [["flint", 3], ["whetstone", 3]] },
  { id: "scribe", name: "The scribe", where: "Inside the archive gate", greet: "She is writing even while she talks.", wares: [["brush", 3], ["incense", 2]] },
];

export const VIGN = [
  "Two boys race paper boats along the canal, shouting the names of ships.",
  "A grandmother corrects a merchant’s scale with one finger, and he lets her.",
  "Soldiers at the gate share their lunch with a stray dog.",
  "A family argues happily over whose turn it is to carry the youngest.",
  "Someone is singing in the teahouse, badly, and everyone is clapping anyway.",
];
