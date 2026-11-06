// Day Three's two puzzles, apart from how they look: the carved verses (a
// substitution cipher, one glyph per letter) and Namonoki's flute (notes
// and rests to be played back on the beat).

import { rand, shuffle } from "./ledger-engine";
import { NOTE_FREQ } from "./day3-data";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export { ALPHA };

// A fresh verse: every letter gets its own glyph, at random. Initiates see the
// three commonest letters already marked, disciples one, masters none.
export function newVerse(text, rank) {
  const letters = [...new Set(text.replace(/ /g, "").split(""))];
  const perm = shuffle([...Array(26).keys()]);
  const map = {};
  ALPHA.forEach((L, i) => {
    map[L] = perm[i];
  });
  const freq = {};
  text
    .replace(/ /g, "")
    .split("")
    .forEach((L) => {
      freq[L] = (freq[L] || 0) + 1;
    });
  const byFreq = letters.slice().sort((a, b) => freq[b] - freq[a]);
  const reveal = rank === "initiate" ? byFreq.slice(0, 3) : rank === "disciple" ? [letters[rand(letters.length)]] : [];
  const guess = {};
  reveal.forEach((L) => {
    guess[map[L]] = L;
  });
  return { id: Math.random().toString(36).slice(2), text, rank, map, guess, locked: reveal.map((L) => map[L]), elapsed: 0, solvedAt: 0 };
}

export const verseLetters = (V) => V.text.replace(/ /g, "").split("");
export const verseSolved = (V) => verseLetters(V).every((L) => V.guess[V.map[L]] === L);
export const sentence = (text) => `“${text.charAt(0)}${text.slice(1).toLowerCase()}.”`;

// ---- the flute ----

let AC = null;
export function audio() {
  if (!AC && typeof window !== "undefined") {
    try {
      AC = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      AC = null;
    }
  }
  if (AC && AC.state === "suspended") AC.resume();
  return AC;
}

// One soft flute note (a sine and a triangle with a little vibrato).
export function tone(i, dur) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const g = a.createGain();
  const o = a.createOscillator();
  const o2 = a.createOscillator();
  const v = a.createOscillator();
  const vg = a.createGain();
  o.type = "sine";
  o2.type = "triangle";
  o.frequency.value = o2.frequency.value = NOTE_FREQ[i];
  v.frequency.value = 5.2;
  vg.gain.value = 3.5;
  v.connect(vg);
  vg.connect(o.frequency);
  vg.connect(o2.frequency);
  const g2 = a.createGain();
  g2.gain.value = 0.25;
  o.connect(g);
  o2.connect(g2);
  g2.connect(g);
  g.connect(a.destination);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.32, t + 0.05);
  g.gain.setValueAtTime(0.3, t + dur * 0.7);
  g.gain.linearRampToValueAtTime(0, t + dur);
  [o, o2, v].forEach((x) => {
    x.start(t);
    x.stop(t + dur + 0.05);
  });
}

// The count-in click.
export function tick() {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = "square";
  o.frequency.value = 1200;
  g.gain.setValueAtTime(0.05, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  o.connect(g);
  g.connect(a.destination);
  o.start(t);
  o.stop(t + 0.06);
}

// Grow a phrase by one token: usually a note, sometimes a rest.
export function addToken(seq, nn) {
  const last = seq[seq.length - 1];
  if (seq.length >= 2 && last !== "r" && Math.random() < 0.3) seq.push("r");
  else seq.push(rand(nn));
  return seq;
}
