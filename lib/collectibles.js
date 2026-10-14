// The Collectibles: every figure in the collection, in the order they are
// displayed, with the copy for its preview. All of this is PROVISIONAL
// DRAFT COPY: edit freely. Names, order, text and links all live here.
//
// Fields
//   id               stable key
//   number           shown as "Collectible 001"
//   identity         the figure's editorial name ("The Dreamer")
//   figure           file name in /public/collectibles/figures/
//   alt              description of the figure for screen readers
//   scale            figure size inside the box (1 = fills the window's height)
//   x, y             nudge inside the box, in % of the window (right / down)
//   turn             degrees the figure is turned toward the right, matching
//                    the box's angle (positive = turns right; 0 = straight on)
//   essayTitle       title shown in the preview
//   intro            one italic line under the title (optional)
//   blurb            the 60-100 word excerpt
//   essayUrl         where "Read the full essay" goes. Only set it for a page
//                    that really exists; leave it out and the preview shows
//                    "Story Coming Soon" instead of a link
//   cta              wording of the link (defaults to "Read the full essay")
//   themes           small tags under the excerpt (optional)
//   video            { url, label }: an extra outside link (opens in a new tab)


// The collector's card for each figure (the page at /journal/collectibles/<id>).
// Every number here is MADE UP for fun: edit freely.
//   position   the figure's "position" on the card
//   rarity     badge in the card's corner
//   stats      five attributes, 1-99
//   dims       the figure's measurements and make
//   line       the short quote under the art
const CARDS = {
  dreamer: {
    position: "Storyteller", rarity: "Holo Foil",
    stats: [["Imagination", 99], ["Heart", 96], ["Storytelling", 98], ["Focus", 71], ["Discipline", 66]],
    dims: { height: "6.4 in / 16.3 cm", width: "3.0 in / 7.6 cm", weight: "3.6 oz", material: "Carved basswood", finish: "Hand-oiled, spirit-orange paint" },
    line: "Believes first. Builds second.",
  },
  "land-man": {
    position: "Closer", rarity: "Rare",
    stats: [["Leadership", 92], ["Reliability", 97], ["Presence", 94], ["Composure", 88], ["Spontaneity", 41]],
    dims: { height: "6.6 in / 16.8 cm", width: "2.7 in / 6.9 cm", weight: "3.9 oz", material: "Carved walnut", finish: "Hand-oiled, charcoal wash" },
    line: "Shows up on Monday like it\u2019s a gift.",
  },
  athlete: {
    position: "Power Forward", rarity: "Rare",
    stats: [["Strength", 95], ["Discipline", 98], ["Endurance", 86], ["Recovery", 64], ["Patience", 72]],
    dims: { height: "6.5 in / 16.5 cm", width: "3.3 in / 8.4 cm", weight: "4.4 oz", material: "Carved walnut", finish: "Matte, chalk-dusted" },
    line: "Doesn\u2019t skip the last set.",
  },
  competitor: {
    position: "Baseliner", rarity: "Uncommon",
    stats: [["Focus", 90], ["Footwork", 84], ["Nerve", 93], ["Touch", 79], ["Temper", 58]],
    dims: { height: "6.3 in / 16.0 cm", width: "3.8 in / 9.7 cm", weight: "3.5 oz", material: "Carved maple", finish: "Cream lacquer, green trim" },
    line: "Serves anyway.",
  },
  observer: {
    position: "Spotter", rarity: "Rare",
    stats: [["Perspective", 97], ["Patience", 91], ["Timing", 94], ["Memory", 88], ["Small Talk", 52]],
    dims: { height: "6.4 in / 16.3 cm", width: "3.4 in / 8.6 cm", weight: "3.8 oz", material: "Carved cherry", finish: "Hand-oiled, field-green vest" },
    line: "Notices the second before the laugh.",
  },
  writer: {
    position: "Playmaker", rarity: "Holo Foil",
    stats: [["Reflection", 96], ["Expression", 93], ["Curiosity", 91], ["Deadlines", 47], ["Coffee", 99]],
    dims: { height: "6.4 in / 16.3 cm", width: "3.2 in / 8.1 cm", weight: "3.7 oz", material: "Carved walnut", finish: "Olive wash, leather-brown satchel" },
    line: "Blank page. Full heart.",
  },
  musician: {
    position: "First Chair", rarity: "Rare",
    stats: [["Ear", 99], ["Drive", 98], ["Rhythm", 96], ["Breath Control", 88], ["World Tour Plans", 12]],
    dims: { height: "6.4 in / 16.3 cm", width: "3.4 in / 8.6 cm", weight: "3.6 oz", material: "Carved basswood", finish: "Brass-gold horn, forest-green tee" },
    line: "First in the school. Then the city. Then the state.",
  },
  "phantom-regiment": {
    position: "Trumpet, 2000", rarity: "Legend",
    stats: [["Stamina", 94], ["Discipline", 99], ["Breath Control", 91], ["Posture", 97], ["Days Off", 6]],
    dims: { height: "7.2 in / 18.3 cm", width: "2.4 in / 6.1 cm", weight: "3.3 oz", material: "Carved ebonized walnut", finish: "Silver-leaf visor and horn" },
    line: "Horns up. Left foot. Together.",
  },
  selector: {
    position: "Curator", rarity: "Holo Foil",
    stats: [["Taste", 99], ["Attention", 95], ["Sequencing", 94], ["Mood Reading", 90], ["Skip Rate", 8]],
    dims: { height: "6.4 in / 16.3 cm", width: "3.2 in / 8.1 cm", weight: "3.5 oz", material: "Carved basswood", finish: "Brick-red tee, cassette-black" },
    line: "Made this one just for you.",
  },
  visionary: {
    position: "Sage", rarity: "Legend",
    stats: [["Vision", 99], ["Wonder", 97], ["Follow-Through", 70], ["Spellcraft", 94], ["Sleep", 35]],
    dims: { height: "7.0 in / 17.8 cm", width: "3.9 in / 9.9 cm", weight: "4.1 oz", material: "Carved basswood & maple", finish: "Midnight blue, gold-leaf stars" },
    line: "Sees the finished room in the empty one.",
  },
  wanderer: {
    position: "Wayfinder", rarity: "Legend",
    stats: [["Resolve", 96], ["Honor", 99], ["Stillness", 93], ["Navigation", 80], ["Luggage", 22]],
    dims: { height: "6.5 in / 16.5 cm", width: "3.0 in / 7.6 cm", weight: "3.6 oz", material: "Carved cedar", finish: "Weathered bark, crimson sash" },
    line: "Bows to those who kept the way.",
  },
  homebody: {
    position: "Franchise Player", rarity: "Holo Foil",
    stats: [["Belonging", 99], ["Comfort", 97], ["Self-Knowledge", 90], ["Cardio", 52], ["Going Out", 18]],
    dims: { height: "6.4 in / 16.3 cm", width: "3.2 in / 8.1 cm", weight: "3.7 oz", material: "Carved walnut", finish: "Weathered, flower-patch cap" },
    line: "The one every other figure comes home to.",
  },
};

export const COLLECTIBLES = [
  {
    id: "dreamer",
    identity: "The Dreamer",
    figure: "saiyan",
    alt: "A carved wooden figure of an anime martial artist in an orange gi with spiked black hair",
    essayTitle: "Before I Knew It Was Storytelling",
    intro: "Every extraordinary story begins with the belief that something more is possible.",
    blurb:
      "I didn’t know it then, but watching anime was my first introduction to the power of imagination. Heroes, transformations, impossible battles, and worlds without limits taught me that storytelling wasn’t just about escaping reality. Sometimes, it was about seeing what reality could become. Long before I had the words for it, I was learning how to believe in a bigger version of myself.",
    themes: ["Imagination", "Storytelling"],
  },
  {
    id: "land-man",
    identity: "Land Man",
    figure: "professional",
    alt: "A carved wooden figure in a dark suit, tie and glasses, hands in his pockets",
    essayTitle: "Land Man",
    intro: "Responsibility looks good on a hanger. It feels different on a Monday.",
    blurb:
      "The suit teaches you something the mood board never does: showing up is a skill. Deadlines, meetings, people counting on you. None of it is glamorous, and all of it builds you. I used to think the work was the thing I did for the money. Now I see it as the place I practice leadership, patience, and follow-through. Land Man is the essay where I wrote it all down.",
    essayUrl: "/journal/land-man",
    themes: ["Career", "Leadership", "Responsibility"],
  },
  {
    id: "athlete",
    identity: "The Athlete",
    figure: "lifter",
    alt: "A carved wooden figure of a weightlifter holding a dumbbell and water bottle, a towel over his shoulder",
    essayTitle: "Reps Don’t Lie",
    intro: "The bar doesn’t care how you feel. That is exactly why it helps.",
    blurb:
      "Nothing shows you who you are quite like a set you don’t want to finish. The weight is honest. It tells you where you are, never where you pretend to be. Somewhere between the first rep and the last I stopped training for how I looked and started training for how I could hold up: for the people, the work, and the days that ask more of me than I planned.",
    themes: ["Health", "Discipline", "Self-image"],
  },
  {
    id: "competitor",
    identity: "The Competitor",
    figure: "tennis",
    alt: "A carved wooden figure in white tennis clothes with green trim, holding a racket and a ball",
    essayTitle: "Love, 40",
    intro: "Every point is a small argument with yourself.",
    blurb:
      "Tennis is the loneliest team sport there is. No one to pass to, no clock to hide behind, just you, the net, and the voice in your head deciding what the last point meant. I’ve learned more from losing a close one than from any easy win. Composure isn’t the absence of nerves. It’s serving anyway.",
    themes: ["Focus", "Composure", "Play"],
  },
  {
    id: "observer",
    identity: "The Observer",
    figure: "photographer",
    alt: "A carved wooden figure in a utility vest holding one camera and wearing another, a shoulder bag at his side",
    essayTitle: "What the Frame Leaves Out",
    intro: "A photograph is a decision about what matters.",
    blurb:
      "Before I ever called myself a designer, I was a kid with a camera, noticing. Light on a wall. A stranger’s posture. The second before the laugh. Photography taught me that perspective isn’t a talent, it’s a habit of paying attention. Every frame is a small act of memory, and every crop is a choice about what I’m willing to leave behind.",
    themes: ["Perspective", "Photography", "Memory"],
  },
  {
    id: "writer",
    identity: "The Writer",
    figure: "writer",
    alt: "A carved wooden figure in a knit beanie and olive jacket, holding a notebook and pen, a leather bag over his shoulder",
    essayTitle: "I Know Why the Blocked Writer Sings",
    intro: "Sometimes the page stays empty until you stop demanding it be perfect.",
    blurb:
      "I carry a notebook everywhere, and most days it stays mostly blank. That used to feel like failure. Now I think of it as listening. The sentences that matter arrive when I stop chasing them: in the car, in the shower, halfway through a song. Writing is how I make sense of what I’ve already lived, and how I find out what I actually think.",
    essayUrl: "/journal/i-know-why-the-blocked-writer-sings",
    themes: ["Reflection", "Expression"],
  },
  {
    id: "musician",
    identity: "The Musician",
    figure: "trumpeter-green",
    alt: "A carved wooden figure in a backwards cap and green tee, holding a gold trumpet",
    essayTitle: "First Chair",
    intro: "I never wanted to be good. I wanted to be first.",
    blurb:
      "The trumpet is where I first met my ear. I could mimic anything I heard, even great-quality sound, and once I knew that, I wanted to be great at it. Not good. The best. First the best Black trumpet player in my school, then the city, then the state. The world was too big; I never dreamed that far. That obsession with first chair is still the engine under everything I build: listen closely, practice in private, never settle for almost.",
    themes: ["Excellence", "Ear", "Ambition"],
  },
  {
    id: "phantom-regiment",
    identity: "Phantom Regiment",
    figure: "drum-major",
    alt: "A carved wooden figure in a black drum corps uniform with a tall plume, a silver visor and a trumpet",
    essayTitle: "2000 & Beyond",
    intro: "A hundred people, one breath, one count.",
    blurb:
      "In 2000 I marched trumpet with the Phantom Regiment. Drum corps is where I learned what it means to be part of something bigger than my own sound: long days in the heat, horns up until your lip gave out, and a hundred people trying to hit the same note at the same moment. Everything I know about discipline, staying in step, and showing up for the people next to me started on that field.",
    themes: ["Drum Corps", "Discipline", "Brotherhood"],
    video: { url: "https://www.youtube.com/watch?v=mc0j7UWBEpU&list=RDmc0j7UWBEpU&start_radio=1", label: "Watch on YouTube" },
  },
  {
    id: "selector",
    identity: "The Selector",
    figure: "listener-red",
    alt: "A carved wooden figure in big headphones and a red tee, holding a cassette player",
    essayTitle: "Made for the Playlist",
    intro: "Taste is just a conversation you keep having with the songs you love.",
    blurb:
      "Headphones were my first private room: the place I could finally hear my own thoughts, with a melody holding them steady. Listening turned into curating. Every playlist I make is a small portrait: the order, the mood, the track I couldn\u2019t cut. I sequence songs the way I sequence essays, a slow open, a lift in the middle, something warm to leave you with. It says I thought of you.",
    themes: ["Listening", "Taste", "Curation"],
  },
  {
    id: "visionary",
    identity: "The Visionary",
    figure: "wizard",
    alt: "A carved wooden figure in a star-covered wizard hat and blue robe, holding a twisting staff topped with a blue orb",
    essayTitle: "Seeing It Before It’s There",
    intro: "Every made thing was once only a feeling.",
    blurb:
      "I’ve always been the kind of person who sees the finished room in the empty one. Call it fantasy if you like. I call it practice. The staff and the stars are just a way of admitting that imagination is a tool, and that the first step of any build is believing it into a shape. Then comes the long, unglamorous work of making the magic hold.",
    themes: ["Fantasy", "Possibility", "Vision"],
  },
  {
    id: "wanderer",
    identity: "The Wanderer",
    figure: "wanderer",
    alt: "A carved wooden figure of a wandering swordsman in a straw hat and dark robes, hands folded, bowing",
    essayTitle: "The Road to First Light",
    intro: "He begins by trying to recover a home. He ends by learning how to build one.",
    blurb:
      "Kenji was the first protagonist of my home, the one who led to its inspiration in decor and energy. He was the prototype for exploration and peace. He walks the Kuroshio Reach through seven sacred stages, and I walk it with him. He is who I write when I need to say something too tender for a plain essay: about inheritance, about bowing to the people who kept something safe for you, about the long road from searching to creating.",
    essayUrl: "/kenji-quest",
    cta: "Enter Kenji’s Quest",
    themes: ["Domain Expansion", "Inheritance", "Story"],
  },
  {
    id: "homebody",
    identity: "The Homebody",
    figure: "homebody",
    alt: "A carved wooden figure in a flower-patch cap and cream tee, hands in his pockets",
    essayTitle: "Homebody",
    intro: "The one who sits at the center of all the others.",
    blurb:
      "Strip away the costumes and this is who is left: hands in his pockets, comfortable in his own room. The Homebody is the series that never leaves home, a case study in cleaning the room that lives inside you, one session and one rep at a time. Every other figure here is a version of him, and he is the reason they all fit in one story.",
    essayUrl: "/journal?series=Homebody",
    cta: "Read the Homebody series",
    themes: ["Homebody", "Identity", "Belonging"],
  },
].map((c, i) => ({
  number: String(i + 1).padStart(3, "0"),
  scale: 1,
  x: 0,
  y: 0,
  turn: 12,
  ...c,
  card: CARDS[c.id],
}));

export const collectibleById = (id) => COLLECTIBLES.find((c) => c.id === id);

// The original figures on the home page's left rail, matched to the cards
// above (two of them were combined into one collectible).
export const FIGURE_ALIASES = {
  listener: "listener-red",
  trumpeter: "trumpeter-green",
};
