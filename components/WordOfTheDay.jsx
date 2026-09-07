"use client";

import { useEffect, useState } from "react";

// A rotating vocabulary that leans into the site's themes — perspective,
// selfhood, craft, presence, and becoming. One surfaces each day.
const WORDS = [
  { word: "sonder", pron: "ˈsɒn.dər", pos: "n.", def: "The realization that each passer-by is living a life as vivid and complex as your own." },
  { word: "meraki", pron: "may-ˈrah-kee", pos: "n.", def: "To do a thing with soul, creativity, and love — to leave a piece of yourself in the work." },
  { word: "quiddity", pron: "ˈkwid-ə-tē", pos: "n.", def: "The inherent nature of a thing; the quality that makes something what it is and nothing else." },
  { word: "haecceity", pron: "hek-ˈsē-ə-tē", pos: "n.", def: "‘Thisness’ — the discrete qualities that make a person or thing uniquely itself." },
  { word: "duende", pron: "ˈdwen-dā", pos: "n.", def: "A surge of authenticity and emotion in art that moves the room; soul made audible." },
  { word: "entelechy", pron: "en-ˈtel-ə-kē", pos: "n.", def: "The vital force driving something toward the full realization of what it could be." },
  { word: "sprezzatura", pron: "spret-sə-ˈtur-ə", pos: "n.", def: "Studied nonchalance; making a hard-won thing look effortless." },
  { word: "querencia", pron: "keh-ˈren-see-ə", pos: "n.", def: "The place from which one draws strength — where you feel most at home and most yourself." },
  { word: "eudaimonia", pron: "yoo-dı-ˈmō-nee-ə", pos: "n.", def: "Flourishing that comes from living in line with your own character rather than borrowed ones." },
  { word: "wabi-sabi", pron: "ˈwah-bee ˈsah-bee", pos: "n.", def: "Finding beauty in what is imperfect, weathered, and impermanent." },
  { word: "numinous", pron: "ˈn(y)oo-mə-nəs", pos: "adj.", def: "Describing a moment that leaves you awed and a little undone — fearful yet drawn in." },
  { word: "ineffable", pron: "in-ˈef-ə-bəl", pos: "adj.", def: "Too full or too particular to be captured in words." },
  { word: "palimpsest", pron: "ˈpal-əmp-sest", pos: "n.", def: "Something rewritten yet still carrying visible traces of every earlier version." },
  { word: "terroir", pron: "ter-ˈwahr", pos: "n.", def: "The character a specific place lends to what is made or grown there." },
  { word: "facture", pron: "ˈfak-chər", pos: "n.", def: "The manner of making — the maker’s hand left visible in the finished thing." },
  { word: "sillage", pron: "see-ˈyahzh", pos: "n.", def: "The trace left in the air after someone has passed; the impression that lingers." },
  { word: "apricity", pron: "ə-ˈpris-ə-tē", pos: "n.", def: "The warmth of the sun in winter." },
  { word: "saudade", pron: "sau-ˈdah-də", pos: "n.", def: "A tender longing for something loved and absent, that may never return." },
  { word: "resonance", pron: "ˈrez-ə-nəns", pos: "n.", def: "The quality of being deep and reverberant — of striking something in the listener." },
  { word: "cadence", pron: "ˈkā-dəns", pos: "n.", def: "The rise, fall, and rhythm of a voice; the signature in how a thing is said." },
  { word: "patina", pron: "pə-ˈtē-nə", pos: "n.", def: "The sheen and depth a surface earns only through age, handling, and use." },
  { word: "gestalt", pron: "gə-ˈshtahlt", pos: "n.", def: "A whole that registers as more than the sum of its parts." },
  { word: "threshold", pron: "ˈthresh-hōld", pos: "n.", def: "The point of crossing — the edge where one state of things becomes another." },
  { word: "verve", pron: "vərv", pos: "n.", def: "Energy and spirit, especially in artistic work." },
  { word: "frisson", pron: "frē-ˈsōn", pos: "n.", def: "A sudden shiver of excitement or awe." },
  { word: "lagniappe", pron: "ˈlan-yap", pos: "n.", def: "A little something extra, given freely, beyond what was owed." },
  { word: "redolent", pron: "ˈred-ə-lənt", pos: "adj.", def: "Strongly evocative of something; carrying its scent or memory." },
  { word: "luminous", pron: "ˈloo-mə-nəs", pos: "adj.", def: "Giving off light; making the things around it easier to see." },
  { word: "solivagant", pron: "sə-ˈliv-ə-gənt", pos: "adj.", def: "Wandering alone." },
  { word: "anamnesis", pron: "an-əm-ˈnē-səs", pos: "n.", def: "The act of calling something back to memory; recollection." },
  { word: "attunement", pron: "ə-ˈt(y)oon-mənt", pos: "n.", def: "The state of being at one with a person, place, or moment." },
  { word: "verisimilitude", pron: "ver-ə-sə-ˈmil-ə-t(y)ood", pos: "n.", def: "The quality of feeling true, whether or not it is." },
  { word: "kenopsia", pron: "kə-ˈnɒp-see-ə", pos: "n.", def: "The forlorn atmosphere of a place that is usually full of people but is now empty." },
  { word: "vellichor", pron: "ˈvel-ə-kor", pos: "n.", def: "The wistfulness of secondhand bookshops — many lives held in one room." },
  { word: "koan", pron: "ˈkō-än", pos: "n.", def: "A riddle with no logical answer, used to push thinking past its usual edges." },
  { word: "ipseity", pron: "ip-ˈsē-ə-tē", pos: "n.", def: "Selfhood; the particular identity that is yours and no one else’s." },
];

function todaysIndex() {
  const now = new Date();
  // Local day number, so the word turns over at the viewer's midnight.
  const dayNumber = Math.floor(
    (now.getTime() - now.getTimezoneOffset() * 60000) / 86400000,
  );
  return ((dayNumber % WORDS.length) + WORDS.length) % WORDS.length;
}

export default function WordOfTheDay() {
  // Resolve on the client so the word tracks the viewer's actual date
  // rather than the build date.
  const [entry, setEntry] = useState(null);
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    setEntry(WORDS[todaysIndex()]);
    setDateLabel(
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    );
  }, []);

  return (
    <section className="paper-notebook corner-box mt-8 min-h-[184px] rounded-xl border border-ink/15 bg-card px-7 py-8 sm:px-9">
      <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-widest text-accent sm:gap-3 sm:text-xs">
        <span className="whitespace-nowrap">Word of the Day</span>
        <span className="h-px min-w-[10px] flex-1 bg-accent/40" />
        {dateLabel && (
          <span className="shrink-0 whitespace-nowrap normal-case tracking-normal text-stone/60">
            {dateLabel}
          </span>
        )}
      </div>

      {entry && (
        <div className="mt-4">
          <p className="font-playfair text-3xl font-bold text-ink sm:text-4xl">
            {entry.word}
          </p>
          <p className="mt-1 font-mono text-xs italic tracking-wide text-stone/70">
            {entry.pron} &nbsp;·&nbsp; {entry.pos}
          </p>
          <p className="mt-3 max-w-xl font-serif text-lg leading-relaxed text-ink">
            {entry.def}
          </p>
        </div>
      )}
    </section>
  );
}
