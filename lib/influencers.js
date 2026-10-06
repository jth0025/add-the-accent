// "Men and women creating in purpose" — the Museum's influencers of the
// week. Each week shows one pair (a man and a woman) and the pair changes
// every Monday, cycling through this list in order. Add a pair by adding a
// row; add a portrait by dropping a file at the path in `image` (a square
// or 4:5 JPEG works best). Until a portrait file exists the frame shows
// the person's initials instead of a broken image.

const p = (slug) => `/design/influencers/${slug}.jpg`;

// Chosen to echo the site's own threads: one signature across many
// mediums, the camera and the pen, naming and fathers, series and
// storytelling, collage and composite, the empty room that becomes a
// life, and the icons the work pays tribute to. `credit` is the photo
// credit shown under each frame (licenses: public domain unless noted).
export const INFLUENCER_PAIRS = [
  [
    { name: "Gordon Parks", years: "1912–2006", known: "Photographer, filmmaker, writer, composer", image: p("gordon-parks"), credit: "Iris Schneider, Los Angeles Times · CC BY 4.0" },
    { name: "Zora Neale Hurston", years: "1891–1960", known: "Novelist, anthropologist, folklorist", image: p("zora-neale-hurston"), credit: "Library of Congress" },
  ],
  [
    { name: "James Baldwin", years: "1924–1987", known: "Essayist, novelist", image: p("james-baldwin"), credit: "Allan Warren · CC BY-SA 3.0" },
    { name: "Toni Morrison", years: "1931–2019", known: "Novelist, Nobel laureate in Literature", image: p("toni-morrison"), credit: "John Mathew Smith · CC BY-SA 2.0" },
  ],
  [
    { name: "Jacob Lawrence", years: "1917–2000", known: "Painter of The Migration Series", image: p("jacob-lawrence"), credit: "Carl Van Vechten, Library of Congress" },
    { name: "Faith Ringgold", years: "1930–2024", known: "Painter, story quilter, author", image: p("faith-ringgold"), pos: "50% 0%", credit: "Gordon Alexander" },
  ],
  [
    { name: "Romare Bearden", years: "1911–1988", known: "Collage artist, painter", image: p("romare-bearden"), credit: "Carl Van Vechten, Library of Congress" },
    { name: "Augusta Savage", years: "1892–1962", known: "Sculptor, teacher, arts advocate", image: p("augusta-savage"), credit: "U.S. Government" },
  ],
  [
    { name: "Langston Hughes", years: "1901–1967", known: "Poet, playwright, Harlem Renaissance voice", image: p("langston-hughes"), credit: "Carl Van Vechten, Library of Congress" },
    { name: "Maya Angelou", years: "1928–2014", known: "Poet, memoirist, civil-rights activist", image: p("maya-angelou"), credit: "William J. Clinton Presidential Library" },
  ],
  [
    { name: "Frederick Douglass", years: "c. 1818–1895", known: "Abolitionist, writer, orator", image: p("frederick-douglass"), credit: "George Kendall Warren" },
    { name: "Sojourner Truth", years: "c. 1797–1883", known: "Abolitionist, women’s-rights speaker", image: p("sojourner-truth"), credit: "Randall Studio" },
  ],
  [
    { name: "Duke Ellington", years: "1899–1974", known: "Composer, bandleader, pianist", image: p("duke-ellington"), credit: "Publicity photograph" },
    { name: "Nina Simone", years: "1933–2003", known: "Singer, pianist, activist", image: p("nina-simone"), credit: "Gerrit de Bruin · CC BY 4.0" },
  ],
  [
    { name: "Muhammad Ali", years: "1942–2016", known: "Three-time heavyweight champion, activist", image: p("muhammad-ali"), credit: "Ira Rosenberg, New York World-Telegram" },
    { name: "Wilma Rudolph", years: "1940–1994", known: "Sprinter, triple gold medalist, Rome 1960", image: p("wilma-rudolph"), credit: "Henk Lindeboom / Anefo · CC BY-SA 3.0 NL" },
  ],
  [
    { name: "Kobe Bryant", years: "1978–2020", known: "Athlete, storyteller, Oscar winner for Dear Basketball", image: p("kobe-bryant"), credit: "Keith Allison · CC BY-SA 2.0" },
    { name: "Althea Gibson", years: "1927–2003", known: "Tennis champion, first Black Grand Slam winner", image: p("althea-gibson"), credit: "Fred Palumbo, New York World-Telegram" },
  ],
  [
    { name: "Malcolm X", years: "1925–1965", known: "Minister, orator, author, activist", image: p("malcolm-x"), credit: "Eddie Adams" },
    { name: "Ida B. Wells", years: "1862–1931", known: "Journalist, anti-lynching crusader", image: p("ida-b-wells"), credit: "Portrait by Mary Garrity" },
  ],
  [
    { name: "George Washington Carver", years: "c. 1864–1943", known: "Scientist, educator, inventor", image: p("george-washington-carver"), credit: "Restoration by Adam Cuerden" },
    { name: "Katherine Johnson", years: "1918–2020", known: "Mathematician, NASA trajectory analyst", image: p("katherine-johnson"), credit: "NASA" },
  ],
  [
    { name: "Paul Robeson", years: "1898–1976", known: "Actor, singer, scholar, activist", image: p("paul-robeson"), credit: "Gordon Parks, Office of War Information" },
    { name: "Josephine Baker", years: "1906–1975", known: "Performer, Resistance agent, civil-rights activist", image: p("josephine-baker"), credit: "Studio Harcourt" },
  ],
];

// Weeks are counted from a fixed Monday so the pair flips every Monday
// (UTC) and everyone sees the same one.
const EPOCH = Date.UTC(2026, 0, 5);
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function influencersOfTheWeek(now = new Date()) {
  const week = Math.floor((now.getTime() - EPOCH) / WEEK_MS);
  const n = INFLUENCER_PAIRS.length;
  return INFLUENCER_PAIRS[((week % n) + n) % n];
}
