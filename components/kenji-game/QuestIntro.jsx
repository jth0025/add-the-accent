"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// The seven sacred stages — canon titles only (never "Day 1-7" as
// in-world language; that's production/UI shorthand, per brief). Each
// line is the same non-spoiler description already used on the main
// Kenji's Quest page, so the two stay in sync.
const STAGES = [
  {
    n: "I",
    day: "Day One",
    title: "The Inheritance",
    place: "The Empty Room",
    img: "/kenji-game/montage/day1-inheritance.jpg",
    introClose: "/kenji-game/intro/d1-close.webp",
    introFull: "/kenji-game/intro/d1-full.webp",
    full: "/kenji-game/day1-inheritance.jpg",
    badge: "/kenji-game/badges/day1.webp",
    body: "A ruined room, dust, and one beam of window light — until it catches an old blade and a fragment of scroll waiting exactly where they shouldn't be.",
  },
  {
    n: "II",
    day: "Day Two",
    title: "The Warden City",
    place: "Kosei",
    img: "/kenji-game/montage/day2-warden-city.jpg",
    introClose: "/kenji-game/intro/d2-close.webp",
    introFull: "/kenji-game/intro/d2-full.webp",
    full: "/kenji-game/day2-warden-city.jpg",
    badge: "/kenji-game/badges/day2.webp",
    body: "A guarded city of bridges and terraces, where Kenji's name and his fallen house earn him more questions than welcome.",
  },
  {
    n: "III",
    day: "Day Three",
    title: "The Ancient Grove",
    place: "The Naming Grove",
    img: "/kenji-game/montage/day3-ancient-grove.jpg",
    introClose: "/kenji-game/intro/d3-close.webp",
    introFull: "/kenji-game/intro/d3-full.webp",
    full: "/kenji-game/day3-ancient-grove.jpg",
    badge: "/kenji-game/badges/day3.webp",
    body: "A sacred forest of carved trees and ritual sound, where a flute and an old family rhythm are the only keys that fit.",
  },
  {
    n: "IV",
    day: "Day Four",
    title: "Nest Cliffs",
    place: "The Mirror Tower",
    img: "/kenji-game/montage/day4-nest-cliffs.jpg",
    introClose: "/kenji-game/intro/d4-close.webp",
    introFull: "/kenji-game/intro/d4-full.webp",
    full: "/kenji-game/day4-nest-cliffs.jpg",
    badge: "/kenji-game/badges/day4.webp",
    body: "High winds, nesting birds, and a mirrored tower where an inherited blade turns out to catch more than light.",
  },
  {
    n: "V",
    day: "Day Five",
    title: "Wall of Waves",
    place: "The Hidden Water Gate",
    img: "/kenji-game/montage/day5-wall-of-waves.jpg",
    introClose: "/kenji-game/intro/d5-close.webp",
    introFull: "/kenji-game/intro/d5-full.webp",
    full: "/kenji-game/day5-wall-of-waves.jpg",
    badge: "/kenji-game/badges/day5.webp",
    body: "A concealed wall found only by those paying attention, and a cave behind the falling water where something ancient stirs and is never fully seen.",
  },
  {
    n: "VI",
    day: "Day Six",
    title: "Broken Passage",
    place: "The Fractured Bridge",
    img: "/kenji-game/montage/day6-broken-passage.jpg",
    introClose: "/kenji-game/intro/d6-close.webp",
    introFull: "/kenji-game/intro/d6-full.webp",
    full: "/kenji-game/day6-broken-passage.jpg",
    badge: "/kenji-game/badges/day6.webp",
    body: "A road broken under gathering gloom, where the figures who have been watching Kenji's journey finally stop watching.",
  },
  {
    n: "VII",
    day: "Day Seven",
    title: "First Light",
    place: "The Door of Light",
    img: "/kenji-game/montage/day7-first-light.jpg",
    introClose: "/kenji-game/intro/d7-close.webp",
    introFull: "/kenji-game/intro/d7-full.webp",
    full: "/kenji-game/day7-first-light.jpg",
    badge: "/kenji-game/badges/day7.webp",
    body: "A jungle sanctuary built around a narrow, luminous door — the destination named by the scroll, and the last question Kenji has to answer.",
  },
];

// The intro montage plays each stage as two shots: a close-up first,
// then the full-body version of the same scene.
const INTRO_SHOTS = STAGES.flatMap((s) => [
  { src: s.introClose, kind: "close" },
  { src: s.introFull, kind: "full" },
]);

const PROGRESS_KEY = "kenji-quest-completed-days";

// The kanji numerals for stages one through seven, shown under each
// badge on the Path alongside the English day label.
const KANJI_NUMERALS = ["一", "二", "三", "四", "五", "六", "七"];

// The Legend — what Kenji carries, and what the road still owes him.
// Only the hat starts with him. Everything else — including the
// butterfly — is found once Day 1 is complete, except the satchel and
// the emblem, which stay a mystery until a later stage unlocks them.
const ITEMS = [
  {
    key: "hat",
    name: "The Straw Hat",
    img: "/kenji-game/items/hat.webp",
    body: "Worn in towns, pushed back in the wild — part of the kit from the very first step.",
    startsCollected: true,
  },
  {
    key: "satchel",
    name: "The Satchel",
    img: "/kenji-game/items/satchel.webp",
    body: "Patched, well-traveled, and never quite empty.",
    requiresDay: null,
  },
  {
    key: "butterfly",
    name: "The Butterfly",
    img: "/kenji-game/items/butterfly.webp",
    body: "Small, luminous, and never far. A guide, not a pet.",
    requiresDay: 1,
  },
  {
    key: "hikariwake",
    name: "Hikariwake",
    img: "/kenji-game/items/hikariwake.webp",
    body: "Kenji's father's blade — older than the katana, and almost always sheathed.",
    requiresDay: 1,
  },
  {
    key: "scroll",
    name: "The Scroll",
    img: "/kenji-game/items/scroll.webp",
    body: "Fragmented, and still unfolding.",
    requiresDay: 1,
  },
  {
    key: "emblem",
    name: "The Emblem",
    img: "/kenji-game/items/emblem.webp",
    body: "A leaf-marked medallion, unlike House Mizuhara's reed and ripples — older, and not yet explained.",
    requiresDay: null,
  },
];

// The gate scene at Kosei — Warden Isao stops Kenji before the
// younger warden waves him through. Canon-safe: names House
// Mizuhara's decline without explaining it, reiterates Hikariwake is
// not a katana, and never touches the birth clan.
const WARDEN_DIALOGUE = [
  { speaker: "Warden Isao", line: "Stop there. State your business in Kosei." },
  { speaker: "Kenji", line: "Passing through. I mean no trouble." },
  {
    speaker: "Warden Isao",
    line: "That's old work you're carrying — not a katana, not really. Where does a traveler come by a blade like that?",
  },
  { speaker: "Kenji", line: "It was my father's." },
  { speaker: "Warden Isao", line: "And the house that raised you?" },
  { speaker: "Kenji", line: "House Mizuhara." },
  {
    speaker: "Warden Isao",
    line: "Mizuhara. Thought that name had gone quiet years ago.",
  },
  {
    speaker: "Younger Warden",
    line: "Isao. Whatever he's carrying, it isn't ours to weigh.",
  },
  {
    speaker: "Warden Isao",
    line: "Order is order. Nobody walks my gate without answering for it.",
  },
  {
    speaker: "Warden Isao",
    line: "Kosei doesn't open for a name. It opens for the ones who've already earned passage without knowing it. Answer me true, and you're through.",
  },
];

const STORAGE_KEY = "kenji-quest-intro-seen";

// Approximate marker positions (percent of image width/height) for
// each of the seven numbered stages on the reach map art, landscape
// and portrait crops separately since the composition differs. These
// are read off the map images, not baked into them.
const MAP_MARKERS = {
  landscape: [
    { x: 41.6, y: 85.7 },
    { x: 16.5, y: 60.4 },
    { x: 54.5, y: 62.1 },
    { x: 82.0, y: 44.0 },
    { x: 39.0, y: 36.1 },
    { x: 67.1, y: 22.5 },
    { x: 77.5, y: 17.5 },
  ],
  portrait: [
    { x: 55.3, y: 83.6 },
    { x: 10.9, y: 75.1 },
    { x: 53.9, y: 61.0 },
    { x: 72.7, y: 41.5 },
    { x: 28.3, y: 45.4 },
    { x: 37.8, y: 21.5 },
    { x: 61.7, y: 14.4 },
  ],
};

// An overlay on top of the map art: the dotted path greys out ahead
// of wherever the player has actually reached, and a glow halo marks
// whichever stage is up next. Both are approximate reads of the map
// image's own marker positions, not a pixel-traced redraw of its path.
function MapOverlay({ variant, unlockedCheck, currentDayIndex }) {
  const points = MAP_MARKERS[variant];
  const current = currentDayIndex >= 0 ? points[currentDayIndex] : null;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${
        variant === "landscape" ? "hidden sm:block" : "block sm:hidden"
      }`}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {points.slice(0, -1).map((pt, i) => {
          if (unlockedCheck(i + 1)) return null;
          const next = points[i + 1];
          return (
            <line
              key={i}
              x1={pt.x}
              y1={pt.y}
              x2={next.x}
              y2={next.y}
              stroke="rgba(45,45,45,0.9)"
              strokeWidth="16"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ filter: "blur(4px)" }}
            />
          );
        })}
      </svg>
      {current && (
        <span
          className="qi-map-halo absolute h-14 w-14 rounded-full sm:h-16 sm:w-16"
          style={{ left: `${current.x}%`, top: `${current.y}%` }}
        />
      )}
    </div>
  );
}

// A small flanking torch — wooden handle, flickering flame — used to
// frame a panel of lore text.
function Torch({ side }) {
  const sideClass = side === "left" ? "-left-2 sm:-left-12" : "-right-2 sm:-right-12";
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-6 z-20 flex -translate-y-1/2 flex-col items-center ${sideClass}`}
    >
      <span className="qi-torch-flame block h-6 w-5 sm:h-8 sm:w-6" />
      <span className="block h-10 w-2 rounded-sm bg-gradient-to-b from-[#6b4a2a] via-[#4a3018] to-[#2c1c0d] sm:h-16 sm:w-2.5" />
    </div>
  );
}

function Butterfly({ className = "", wing = true, style }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className={`butterfly-color-cycle ${className}`}
      style={style}
    >
      {/* Far wing — smaller and dimmer, reading as the side turned
          away, so the pair suggests an angled, in-flight view instead
          of a flat top-down symmetric shape. */}
      <g
        className={wing ? "butterfly-wing" : ""}
        style={{ transformOrigin: "15px 16px" }}
      >
        <path
          d="M15 15 C 9 8, 3 9, 4 15 C 3 21, 9 23, 15 17 Z"
          fill="currentColor"
          opacity="0.55"
        />
      </g>
      {/* Near wing — larger, full opacity, closer to the viewer. */}
      <g
        className={wing ? "butterfly-wing" : ""}
        style={{ transformOrigin: "15px 16px" }}
      >
        <path
          d="M15 15 C 23 5, 31 8, 27 16 C 31 24, 23 27, 15 17 Z"
          fill="currentColor"
        />
      </g>
      <path
        d="M14 9 Q 17 16 14 25"
        stroke="#2a2015"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// The game's cover art, shown briefly — during every jump between
// major areas (menu, the archive, the path, a stage) — so a switch
// never feels like a hard cut. The very first entrance skips this
// entirely and goes straight to "touch the light."
function LoadingScreen() {
  return (
    <div className="qi-loading-fade absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[var(--qi-ink)] p-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/kenji-quest-key-art.jpg"
        alt="Kenji's Quest: First Light"
        className="qi-cover-grow-fade max-h-[75vh] max-w-[88vw] rounded-lg object-contain shadow-2xl sm:max-h-[80vh]"
      />
      <span className="qi-breathe font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--qi-gold)]">
        entering the reach
      </span>
    </div>
  );
}

// The small nav that lets you move between tracking day-by-day
// progress (the Path) and what's been carried or found along the way
// (the Legend), without a trip back through the menu each time.
function HubTabs({ active, onSelect }) {
  const tabs = [
    { key: "levels", label: "The Path" },
    { key: "items", label: "The Legend" },
  ];
  return (
    <div className="mx-auto mb-10 flex w-fit gap-2 rounded-full border border-[var(--qi-gold)]/25 bg-black/30 p-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onSelect(t.key)}
          className={`rounded-full px-5 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
            active === t.key
              ? "bg-[var(--qi-gold)] text-[var(--qi-ink)]"
              : "text-[var(--qi-ivory)]/60 hover:text-[var(--qi-ivory)]"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function QuestIntro() {
  const [phase, setPhase] = useState("boot"); // boot -> idle -> title -> question -> montage -> kenji -> menu -> lore | day1
  const [reducedMotion, setReducedMotion] = useState(false);
  // On the live site the game stops at this menu: every item is greyed
  // out ("Coming Soon") except Replay Intro. Local development keeps the
  // whole game playable; add ?menuonly to the URL there to preview the
  // live behavior.
  const [menuOnly, setMenuOnly] = useState(
    process.env.NODE_ENV === "production",
  );
  const [montageIndex, setMontageIndex] = useState(0);
  // 0 = shots playing, 1 = fading to white, 2 = white fading to black, 3 = holding black
  const [montageEnd, setMontageEnd] = useState(0);
  const [questionLine, setQuestionLine] = useState(0);
  const [butterflyPos, setButterflyPos] = useState({ x: 50, y: 46 });
  const [riddleValue, setRiddleValue] = useState("");
  const [riddleSolved, setRiddleSolved] = useState(false);
  const [riddleHint, setRiddleHint] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [riddle2Value, setRiddle2Value] = useState("");
  const [riddle2Solved, setRiddle2Solved] = useState(false);
  const [riddle2Hint, setRiddle2Hint] = useState(false);
  const [completedDays, setCompletedDays] = useState([]);
  const [lockedNotice, setLockedNotice] = useState(null);
  const [loadingTarget, setLoadingTarget] = useState(null);
  const [idleTextVisible, setIdleTextVisible] = useState(false);
  const [idleIgniting, setIdleIgniting] = useState(false);
  const [dayIntroIndex, setDayIntroIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null); // { src, alt } | null
  const rootRef = useRef(null);
  const pathScrollRef = useRef(null);

  const scrollPathBy = (delta) => {
    pathScrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  // Resolve reduced-motion + saved progress after mount (avoids a
  // hydration mismatch from reading window/localStorage during
  // render). Every entrance — first-time or returning — skips the
  // cover-art beat entirely and goes straight to "touch the light."
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    if (new URLSearchParams(window.location.search).has("menuonly")) {
      setMenuOnly(true);
    }
    try {
      const saved = JSON.parse(
        window.localStorage.getItem(PROGRESS_KEY) || "[]",
      );
      if (Array.isArray(saved)) setCompletedDays(saved);
      if (saved.includes(1)) setRiddleSolved(true);
      if (saved.includes(2)) setRiddle2Solved(true);
    } catch {
      // Ignore malformed/unavailable storage — progress just starts fresh.
    }
    setPhase("idle");
  }, []);

  // Any queued cover-art loading beat resolves into its target phase
  // after the art has had room to grow in and hold — every screen
  // load with an image gets at least 5 seconds (reduced-motion still
  // gets a real pause, just a shorter one).
  useEffect(() => {
    if (!loadingTarget) return;
    const t = setTimeout(
      () => {
        setPhase(loadingTarget);
        setLoadingTarget(null);
      },
      reducedMotion ? 1200 : 5000,
    );
    return () => clearTimeout(t);
  }, [loadingTarget, reducedMotion]);

  // Navigate to another major area with a brief cover-art loading beat
  // in between, instead of a hard cut.
  const goTo = (next) => setLoadingTarget(next);

  const markDayComplete = (n) => {
    setCompletedDays((prev) => {
      if (prev.includes(n)) return prev;
      const next = [...prev, n];
      try {
        window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      } catch {
        // Fine to skip persistence if storage is unavailable.
      }
      return next;
    });
  };

  const isUnlocked = (dayIndex) =>
    dayIndex === 0 || completedDays.includes(dayIndex);

  // The one stage that's actually next — the first unlocked day not
  // yet complete. Gets the pulsing "you are here" treatment on the
  // Path.
  const currentDayIndex = STAGES.findIndex(
    (_, i) => isUnlocked(i) && !completedDays.includes(i + 1),
  );

  const isItemCollected = (item) =>
    item.startsCollected ||
    (item.requiresDay != null && completedDays.includes(item.requiresDay));

  // Days One and Two are playable; the rest are still in development.
  const BUILT_DAYS = [0, 1];

  const selectDay = (dayIndex) => {
    if (BUILT_DAYS.includes(dayIndex) && isUnlocked(dayIndex)) {
      // A built stage: the day's own key art full-screen, then a
      // moment with Kenji, then the stage itself — no generic loading
      // beat in between.
      setDayIntroIndex(dayIndex);
      setPhase("dayArt");
      return;
    }
    // Locked or simply not built yet — either way, a click here should
    // say something rather than do nothing.
    setLockedNotice(dayIndex);
    window.clearTimeout(selectDay._t);
    selectDay._t = window.setTimeout(() => setLockedNotice(null), 2800);
  };

  const goMenu = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // localStorage unavailable (private mode etc.) — fine to skip.
    }
    setPhase("menu");
  };

  // Auto-advance timers per phase.
  useEffect(() => {
    if (phase === "question") {
      if (questionLine === 0) {
        const t = setTimeout(() => setQuestionLine(1), reducedMotion ? 700 : 3200);
        return () => clearTimeout(t);
      }
    }
    // Entering a stage: its key art full-screen, then a moment with
    // Kenji, both held at least 5 seconds, before the stage itself.
    if (phase === "dayArt") {
      const t = setTimeout(() => setPhase("dayKenji"), reducedMotion ? 1200 : 5000);
      return () => clearTimeout(t);
    }
    if (phase === "dayKenji") {
      const next = dayIntroIndex === 1 ? "day2" : "day1";
      const t = setTimeout(() => setPhase(next), reducedMotion ? 1200 : 5000);
      return () => clearTimeout(t);
    }
  }, [phase, questionLine, dayIntroIndex, reducedMotion]);

  // The reach montage: each stage plays a close-up, then its full-body
  // shot. After the last full-body shot (First Light) the screen goes
  // to white, fades to black, holds there a couple of seconds, and only
  // then resolves into the menu — whose own staged reveal (butterfly,
  // backlight, Kenji, title, menu) starts from that black.
  useEffect(() => {
    if (phase !== "montage") return;
    const lastShot = INTRO_SHOTS.length - 1;
    let ms;
    let next;
    if (montageEnd === 0) {
      if (montageIndex >= lastShot) {
        ms = reducedMotion ? 600 : 3800;
        next = () => setMontageEnd(1);
      } else {
        const isClose = INTRO_SHOTS[montageIndex].kind === "close";
        ms = reducedMotion ? 500 : isClose ? 2600 : 3400;
        next = () => setMontageIndex((i) => i + 1);
      }
    } else if (montageEnd === 1) {
      ms = reducedMotion ? 300 : 1900;
      next = () => setMontageEnd(2);
    } else if (montageEnd === 2) {
      ms = reducedMotion ? 300 : 2100;
      next = () => setMontageEnd(3);
    } else {
      ms = reducedMotion ? 400 : 2200;
      next = goMenu;
    }
    const t = setTimeout(next, ms);
    return () => clearTimeout(t);
  }, [phase, montageIndex, montageEnd, reducedMotion]);

  // Warm the intro art so each shot is ready when its turn comes.
  useEffect(() => {
    INTRO_SHOTS.forEach((shot) => {
      const img = new window.Image();
      img.src = shot.src;
    });
  }, []);

  // Idle: the light fades in and flares first; "touch the light" only
  // appears once it's had a moment to be seen. Resets clean every time
  // idle is (re)entered, including via Replay Intro.
  useEffect(() => {
    if (phase !== "idle") {
      setIdleTextVisible(false);
      setIdleIgniting(false);
      return;
    }
    setIdleTextVisible(false);
    const t = setTimeout(
      () => setIdleTextVisible(true),
      reducedMotion ? 400 : 1700,
    );
    return () => clearTimeout(t);
  }, [phase, reducedMotion]);

  const handleTouchLight = () => {
    setIdleIgniting(true);
    // Cuts to the question beat while the light is still dissolving
    // into smoke — the two overlap, so the words feel like they're
    // forming out of it rather than replacing it on a hard cut.
    window.setTimeout(() => setPhase("question"), reducedMotion ? 150 : 550);
  };

  // Idle: the butterfly drifts toward the pointer.
  useEffect(() => {
    if (phase !== "idle") return;
    const handleMove = (clientX, clientY) => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      setButterflyPos({
        x: Math.min(85, Math.max(15, x)),
        y: Math.min(75, Math.max(15, y)),
      });
    };
    const onMouse = (e) => handleMove(e.clientX, e.clientY);
    const onTouch = (e) => {
      const t = e.touches[0];
      if (t) handleMove(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch);
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [phase]);

  // Global Enter/Space to advance the two waiting beats.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (phase === "idle") {
        e.preventDefault();
        handleTouchLight();
      } else if (phase === "question" && questionLine >= 1) {
        e.preventDefault();
        setPhase("montage");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, questionLine]);

  const handleRiddleSubmit = (e) => {
    e.preventDefault();
    const normalized = riddleValue.trim().toLowerCase();
    if (normalized === "light" || normalized === "the light") {
      setRiddleSolved(true);
      markDayComplete(1);
    } else {
      setRiddleHint(true);
    }
  };

  // Day Two resets its dialogue every time it's (re)entered, so
  // returning to an already-solved gate scene still plays it — the
  // riddle form only shows once the last line has been reached.
  useEffect(() => {
    if (phase === "day2") setDialogueIndex(0);
  }, [phase]);

  const advanceDialogue = () => {
    setDialogueIndex((i) => Math.min(i + 1, WARDEN_DIALOGUE.length));
  };

  const handleRiddle2Submit = (e) => {
    e.preventDefault();
    const normalized = riddle2Value.trim().toLowerCase();
    if (normalized === "trust") {
      setRiddle2Solved(true);
      markDayComplete(2);
    } else {
      setRiddle2Hint(true);
    }
  };

  const showSkip = ["idle", "question", "montage"].includes(phase);

  if (phase === "boot" && !loadingTarget) {
    return <div className="qi-root fixed inset-0 z-50" />;
  }

  return (
    <div
      ref={rootRef}
      className="qi-root fixed inset-0 z-50 overflow-hidden font-serif"
    >
      {loadingTarget && <LoadingScreen />}
      {showSkip && (
        <button
          type="button"
          onClick={goMenu}
          className="absolute right-4 top-4 z-50 rounded-full border border-[var(--qi-gold)]/40 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--qi-ivory)]/80 backdrop-blur-sm transition-colors hover:border-[var(--qi-gold)] hover:text-[var(--qi-gold)] sm:right-6 sm:top-6"
        >
          Skip Intro
        </button>
      )}

      {/* ---------------- IDLE: black / breath ---------------- */}
      {phase === "idle" && (
        <button
          type="button"
          onClick={handleTouchLight}
          aria-label="Begin — a small light waits in the dark"
          className="absolute inset-0 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-6 text-center"
        >
          <span
            className={`pointer-events-none absolute h-3 w-3 rounded-full bg-[var(--qi-gold)] blur-[1px] transition-[left,top] duration-[1200ms] ease-out ${
              idleIgniting ? "qi-smoke-dissolve" : "qi-light-ignite"
            }`}
            style={{
              left: `${butterflyPos.x}%`,
              top: `${butterflyPos.y}%`,
              boxShadow: "0 0 16px 6px rgba(214,166,75,0.65)",
            }}
          />
          <Butterfly
            wing={!reducedMotion}
            className={`qi-drift pointer-events-none absolute h-6 w-6 text-[var(--qi-gold)] transition-[left,top] duration-[1400ms] ease-out ${
              idleIgniting ? "qi-smoke-dissolve" : ""
            }`}
            style={{
              left: `${butterflyPos.x}%`,
              top: `${butterflyPos.y}%`,
              transform: "translate(-50%, -50%)",
              filter: "drop-shadow(0 0 8px rgba(214,166,75,0.7))",
            }}
          />
          {idleTextVisible && (
            <span className="qi-fade-enter mt-24 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--qi-ivory)]/40 sm:mt-32">
              touch the light
            </span>
          )}
        </button>
      )}

      {/* ---------------- QUESTION: two story lines ---------------- */}
      {phase === "question" && (
        <div
          className="qi-smoke-materialize absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          role="button"
          tabIndex={0}
          onClick={() => questionLine >= 1 && setPhase("montage")}
        >
          <p className="max-w-lg font-serif text-xl italic leading-relaxed text-[var(--qi-ivory)] sm:text-2xl">
            He went looking for the home that was taken.
          </p>
          {questionLine >= 1 && (
            <p className="qi-fade-enter mt-6 max-w-lg font-serif text-xl italic leading-relaxed text-[var(--qi-gold)] sm:text-2xl">
              The road would ask a different question.
            </p>
          )}
          {questionLine >= 1 && (
            <span className="qi-fade-enter mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--qi-ivory)]/40">
              tap to continue
            </span>
          )}
        </div>
      )}

      {/* ---------------- MONTAGE: the reach ---------------- */}
      {phase === "montage" && (
        <div className="absolute inset-0 bg-[var(--qi-ink)]">
          {/* The shot before the current one stays underneath so each
              new shot crossfades over it instead of dipping to black.
              Hidden once the finale's white takes over. */}
          {montageEnd < 2 &&
            INTRO_SHOTS.map((shot, i) =>
              i === montageIndex || i === montageIndex - 1 ? (
                <div
                  key={i}
                  className={`absolute inset-0 ${
                    i === montageIndex ? "qi-fade-enter z-10" : "z-0"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shot.src}
                    alt=""
                    aria-hidden="true"
                    className={`h-full w-full object-cover object-center ${
                      reducedMotion
                        ? ""
                        : shot.kind === "close"
                          ? "qi-intro-close"
                          : "qi-intro-full"
                    }`}
                  />
                </div>
              ) : null,
            )}
          {montageEnd === 0 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 text-center sm:bottom-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--qi-ivory)]/60">
                the kuroshio reach
              </span>
            </div>
          )}
          {/* Finale: the last full-body shot floods to white, then the
              white drains away into black. */}
          {montageEnd === 1 && (
            <div className="qi-white-in pointer-events-none absolute inset-0 z-30 bg-white" />
          )}
          {montageEnd === 2 && (
            <div className="qi-white-out pointer-events-none absolute inset-0 z-30 bg-white" />
          )}
        </div>
      )}

      {/* ---------------- MENU: Kenji resolves, title drops, menu rises ---------------- */}
      {phase === "menu" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-y-auto px-6 py-10 text-center"
          style={{ background: "var(--qi-ink)" }}
        >
          {/* The screen starts completely black (just the container
              above) — this jungle gradient only fades in once Kenji
              starts to resolve, on the same timing as his reveal. */}
          <div
            aria-hidden="true"
            className="qi-bg-fade pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(160deg, #16241a 0%, #1c2f1e 35%, #2a2312 70%, #1a1409 100%)",
            }}
          />

          {/* Title — drops in from above once Kenji has fully resolved,
              the mark itself catching a slow, consistent light glare. */}
          <div className="qi-drop-in relative z-10 w-full max-w-xs sm:max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kenji-game/title-mark.webp"
              alt="Kenji's Quest: First Light"
              className="w-full"
            />
            <div
              aria-hidden="true"
              className="qi-title-glare-sweep pointer-events-none absolute inset-0"
              style={{
                WebkitMaskImage: "url(/kenji-game/title-mark.webp)",
                maskImage: "url(/kenji-game/title-mark.webp)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          </div>

          {/* Kenji — order of effects: solid black, the butterfly's
              light fades in alone, the backlight fades in behind him
              (revealing his silhouette), then he resolves into full
              color, before the title and menu follow. A ground shadow
              grounds him instead of him floating. */}
          <div className="relative z-10 my-2 w-40 sm:w-48">
            <span className="pointer-events-none absolute inset-0 z-0 [clip-path:inset(-100vh_-100vw_0_-100vw)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-backlight.png"
                alt=""
                aria-hidden="true"
                className="qi-backlight-fade absolute left-1/2 top-1/2 w-[170%] max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
              />
            </span>
            <div
              aria-hidden="true"
              className="qi-backlight-fade absolute inset-x-8 bottom-1 z-[5] h-3 rounded-[50%] bg-black/60 blur-[6px]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kenji-standing.png"
              alt="Kenji, a lone Afro-Japanese traveler in carved wood and gold armor, standing ready with a sheathed blade"
              className="qi-kenji-reveal relative z-10 w-full"
            />
            <Butterfly
              className="qi-menu-butterfly-fade butterfly-glow pointer-events-none absolute left-[74%] top-[13%] z-20 h-5 w-5 -translate-x-1/2 -translate-y-[75%] text-[#f6d999] sm:h-6 sm:w-6"
            />
          </div>

          {/* Menu — rises in from below, under Kenji. */}
          <div className="qi-rise-in relative z-10 flex flex-col items-center gap-3">
            {menuOnly && (
              <p className="qi-coming-soon mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--qi-gold)] sm:text-xs">
                Coming Soon to Add the Accent
              </p>
            )}
            {menuOnly ? (
              <>
                {["Begin the Quest", "Enter the Lore", "The Legend"].map(
                  (label, i) => (
                    <button
                      key={label}
                      type="button"
                      disabled
                      aria-disabled="true"
                      className={`cursor-not-allowed rounded-full font-mono uppercase tracking-widest text-white/30 ${
                        i === 0
                          ? "bg-white/10 px-8 py-3 text-xs font-bold"
                          : "border border-white/15 px-6 py-2.5 text-[11px]"
                      }`}
                    >
                      {label}
                    </button>
                  ),
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => goTo("levels")}
                  className="rounded-full bg-[var(--qi-gold)] px-8 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[var(--qi-ink)] shadow-lg transition-transform hover:scale-[1.03]"
                >
                  Begin the Quest
                </button>
                <button
                  type="button"
                  onClick={() => goTo("lore")}
                  className="rounded-full border border-[var(--qi-gold)]/50 px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest text-[var(--qi-ivory)]/80 transition-colors hover:border-[var(--qi-gold)] hover:text-[var(--qi-gold)]"
                >
                  Enter the Lore
                </button>
                <button
                  type="button"
                  onClick={() => goTo("items")}
                  className="rounded-full border border-[var(--qi-gold)]/50 px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest text-[var(--qi-ivory)]/80 transition-colors hover:border-[var(--qi-gold)] hover:text-[var(--qi-gold)]"
                >
                  The Legend
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setMontageIndex(0);
                setMontageEnd(0);
                setQuestionLine(0);
                setPhase("idle");
              }}
              className={
                menuOnly
                  ? "mt-1 rounded-full border border-[var(--qi-gold)] px-6 py-2.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--qi-gold)] transition-colors hover:bg-[var(--qi-gold)] hover:text-[var(--qi-ink)]"
                  : "mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--qi-ivory)]/40 hover:text-[var(--qi-ivory)]/70"
              }
            >
              Replay Intro
            </button>
          </div>

          <Link
            href="/kenji-quest"
            className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest text-[var(--qi-ivory)]/50 hover:text-[var(--qi-gold)] sm:left-6 sm:top-6"
          >
            &larr; Add the Accent
          </Link>
        </div>
      )}

      {/* ---------------- LORE / ARCHIVE + MAP ---------------- */}
      {phase === "lore" && (
        <div className="qi-fade-enter absolute inset-0 overflow-y-auto px-6 py-16 sm:px-10">
          <div className="mx-auto max-w-3xl">
            <button
              type="button"
              onClick={() => setPhase("menu")}
              className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[var(--qi-gold)] hover:underline"
            >
              &larr; Back
            </button>

            <h2 className="text-center font-cinema text-2xl uppercase tracking-wide text-[var(--qi-ivory)] sm:text-4xl">
              Lore of the Reach
            </h2>
            <span
              aria-hidden="true"
              className="mt-2 block text-center font-tribal text-3xl text-black sm:text-4xl"
              style={{
                textShadow:
                  "0 0 6px rgba(241,230,207,0.5), 0 1px 0 rgba(241,230,207,0.25)",
              }}
            >
              伝
            </span>
          </div>

          {/* The map, same size as its counterpart on The Path — wide
              enough to actually read the stage markers, so it breaks
              out of the narrower text column above and below it. */}
          <div className="relative mx-auto mt-8 w-full max-w-6xl overflow-hidden rounded-xl border border-[var(--qi-gold)]/25 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kenji-game/reach-map-landscape.jpg"
              alt="A lore map of the Kuroshio Reach, tracing the seven sacred stages from The Inheritance to First Light"
              className="hidden w-full sm:block"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kenji-game/reach-map-portrait.jpg"
              alt="A lore map of the Kuroshio Reach, tracing the seven sacred stages from The Inheritance to First Light"
              className="block w-full sm:hidden"
            />
          </div>
          <p className="mx-auto mt-4 max-w-sm text-center text-xs text-[var(--qi-ivory)]/50">
            Seven sacred stages. Track your progress and choose one on The
            Path.
          </p>

          <div className="mx-auto max-w-3xl">
            {/* Character background — who Kenji is, before any of the
                seven stages, ending exactly at the threshold of Day
                One. No birth-clan name, no Daigo, nothing past the
                empty room. */}
            <div className="relative mx-auto mt-12 max-w-lg">
              {/* Two flaming torches flanking the panel, just outside
                  its edges. */}
              <Torch side="left" />
              <Torch side="right" />
              <div className="qi-panel rounded-xl p-6 sm:p-8">
                <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--qi-gold)]">
                  The Forgotten Samurai
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/kenji-meditating.png"
                  alt="Kenji seated in quiet meditation"
                  className="float-left mr-4 mt-3 w-28 rounded-lg drop-shadow-[0_8px_12px_rgba(0,0,0,0.4)] sm:w-36"
                />
                <p className="mt-5 text-sm leading-relaxed text-[var(--qi-ivory)]/85">
                  Before Level One, before the empty room, there was only
                  Kenji &mdash; quiet, deliberate, slow to anger, raised
                  inside House Mizuhara&rsquo;s discipline after a
                  tragedy he barely remembers. He carries himself like
                  someone who was taught early exactly what restraint
                  costs, and exactly what it protects.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--qi-ivory)]/85">
                  He isn&rsquo;t of the house that raised him, not by
                  blood. His birth clan is a fragment he can&rsquo;t
                  fully picture &mdash; a name he was never given, a fall
                  he didn&rsquo;t cause. What he does have is what he can
                  carry: a coarse straw hat pulled low in the wild, an
                  old satchel that&rsquo;s outlasted three seasons of
                  travel, and a small butterfly that&rsquo;s been with
                  him longer than either.
                </p>
                <p className="clear-left mt-4 text-sm italic leading-relaxed text-[var(--qi-ivory)]/70">
                  He doesn&rsquo;t know yet why the road is calling him.
                  He only knows that it is &mdash; and that the answer,
                  whatever it turns out to be, is waiting somewhere past
                  the door of an empty room he hasn&rsquo;t opened yet.
                </p>
              </div>
            </div>

            {/* The story so far — told only as far as you've actually
                gotten. Everything past that is redacted rather than
                spoiled. The image behind any current or completed
                entry opens large on click; locked ones don't. */}
            <div className="mt-12">
              <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--qi-ivory)]/50">
                The Story So Far
              </p>
              <div className="mx-auto mt-6 max-w-xl space-y-4">
                {STAGES.map((s, i) => {
                  const complete = completedDays.includes(i + 1);
                  const clickable = isUnlocked(i);
                  return (
                    <div
                      key={s.title}
                      className="qi-panel flex items-center gap-4 rounded-lg p-3 sm:p-4"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          clickable &&
                          setLightbox({
                            src: s.full,
                            alt: `${s.n}. ${s.title} — ${s.place}`,
                          })
                        }
                        disabled={!clickable}
                        aria-label={
                          clickable
                            ? `View a large image of ${s.day}: ${s.title}`
                            : `${s.day} — locked`
                        }
                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border ${
                          clickable
                            ? "qi-item-gleam cursor-pointer border-[var(--qi-gold)]/40"
                            : "cursor-default border-white/10"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.img}
                          alt=""
                          className={`h-full w-full object-cover ${
                            clickable ? "" : "grayscale opacity-40"
                          }`}
                        />
                      </button>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--qi-gold)]">
                          {s.n} &middot; {s.day}: {s.title}
                        </p>
                        {complete ? (
                          <p className="mt-1 text-sm text-[var(--qi-ivory)]/85">
                            {s.body}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm italic text-[var(--qi-ivory)]/40">
                            &#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;
                            &#9608;&#9608;&#9608;&#9608;&#9608; &mdash; complete{" "}
                            {s.day} to read on&hellip;
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => goTo("levels")}
                className="rounded-full bg-[var(--qi-gold)] px-8 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[var(--qi-ink)] shadow-lg transition-transform hover:scale-[1.03]"
              >
                Begin the Quest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- LIGHTBOX: large source image ---------------- */}
      {lightbox && (
        <div
          className="qi-fade-enter fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-4 top-4 font-mono text-xs uppercase tracking-widest text-[var(--qi-ivory)]/70 hover:text-[var(--qi-gold)] sm:right-6 sm:top-6"
          >
            Close &times;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}

      {/* ---------------- LEVEL SELECT: the path ---------------- */}
      {phase === "levels" && (
        <div
          className="qi-fade-enter absolute inset-0 overflow-y-auto px-6 py-16 sm:px-10"
          style={{ background: "#2a2a2a" }}
        >
          <button
            type="button"
            onClick={() => setPhase("menu")}
            className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[var(--qi-gold)] hover:underline"
          >
            &larr; Menu
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kenji-game/poses/set-off.webp"
            alt="Kenji, packed and ready, setting off down the road"
            className="qi-item-glow mx-auto w-28 sm:w-32"
          />

          <h2 className="mt-2 text-center font-cinema text-2xl uppercase tracking-wide text-[var(--qi-ivory)] sm:text-4xl">
            The Path
          </h2>
          <span
            aria-hidden="true"
            className="mt-2 block text-center font-tribal text-3xl text-black sm:text-4xl"
            style={{
              textShadow:
                "0 0 6px rgba(241,230,207,0.5), 0 1px 0 rgba(241,230,207,0.25)",
            }}
          >
            道
          </span>
          <p className="mx-auto mb-8 mt-5 max-w-none whitespace-nowrap text-center font-serif italic text-[var(--qi-ivory)]/70 text-[min(calc((100vw-3rem)/58),1rem)]">
            Seven sacred stages across the Kuroshio Reach. Each one opens
            only once the last is behind you.
          </p>

          <HubTabs active="levels" onSelect={setPhase} />

          <div className="relative mx-auto mt-2 flex max-w-full items-center gap-2">
            <button
              type="button"
              onClick={() => scrollPathBy(-280)}
              aria-label="Scroll the path left"
              className="qi-bamboo-arrow flex shrink-0"
            >
              &lsaquo;
            </button>
            <div
              ref={pathScrollRef}
              className="qi-scrollbar-hidden overflow-x-auto pb-6"
            >
              <div className="flex w-max items-start gap-0 px-2 sm:px-4">
              {STAGES.map((s, i) => {
                const unlocked = isUnlocked(i);
                const complete = completedDays.includes(i + 1);
                const current = unlocked && !complete && i === currentDayIndex;
                return (
                  <div key={s.title} className="flex items-center">
                    <div className="flex w-36 shrink-0 flex-col items-center text-center sm:w-44">
                      <button
                        type="button"
                        onClick={() => selectDay(i)}
                        aria-label={
                          current
                            ? `${s.day}: ${s.title} — up next`
                            : unlocked
                              ? `${s.day}: ${s.title}`
                              : `${s.day} — locked, complete the previous stage first`
                        }
                        className={`relative aspect-square w-32 overflow-hidden rounded-full border-2 transition-transform sm:w-40 ${
                          current
                            ? "qi-current-pulse border-[var(--qi-gold)] hover:scale-[1.04] cursor-pointer"
                            : unlocked
                              ? "border-[var(--qi-gold)] hover:scale-[1.04] cursor-pointer"
                              : "cursor-pointer border-white/15 hover:scale-[1.02]"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.badge}
                          alt=""
                          className={`h-full w-full object-cover ${
                            unlocked ? "" : "grayscale opacity-40"
                          }`}
                        />
                        {!unlocked && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 flex items-center justify-center bg-black/40"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/kenji-game/lock.png"
                              alt=""
                              className="w-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] sm:w-12"
                            />
                          </span>
                        )}
                      </button>
                      {complete && (
                        <span className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#4ade80]">
                          Complete
                        </span>
                      )}
                      {current && (
                        <span className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--qi-gold)]">
                          Up Next
                        </span>
                      )}
                      {unlocked && (
                        <>
                          <p className="mt-1 font-cinema text-sm uppercase tracking-wide text-[var(--qi-ivory)]">
                            {s.day}
                          </p>
                          <p
                            aria-hidden="true"
                            className="font-athelas text-xs text-[var(--qi-gold)]/70"
                          >
                            {KANJI_NUMERALS[i]}
                          </p>
                        </>
                      )}
                    </div>
                    {i < STAGES.length - 1 && (
                      <span
                        aria-hidden="true"
                        className={`h-px w-8 shrink-0 sm:w-14 ${
                          isUnlocked(i + 1)
                            ? "bg-[var(--qi-gold)]/60"
                            : "bg-white/10"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
              </div>
            </div>
            <button
              type="button"
              onClick={() => scrollPathBy(280)}
              aria-label="Scroll the path right"
              className="qi-bamboo-arrow flex shrink-0"
            >
              &rsaquo;
            </button>
          </div>

          {/* The map again, for reference right below the stages —
              nearly full width, with just enough margin to read as
              framed rather than edge-to-edge. */}
          <div className="relative mx-auto mt-10 w-full max-w-6xl overflow-hidden rounded-xl border border-[var(--qi-gold)]/25 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kenji-game/reach-map-landscape.jpg"
              alt="A lore map of the Kuroshio Reach, tracing the seven sacred stages from The Inheritance to First Light"
              className="hidden w-full sm:block"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kenji-game/reach-map-portrait.jpg"
              alt="A lore map of the Kuroshio Reach, tracing the seven sacred stages from The Inheritance to First Light"
              className="block w-full sm:hidden"
            />
            <MapOverlay
              variant="landscape"
              unlockedCheck={isUnlocked}
              currentDayIndex={currentDayIndex}
            />
            <MapOverlay
              variant="portrait"
              unlockedCheck={isUnlocked}
              currentDayIndex={currentDayIndex}
            />
          </div>

          {lockedNotice != null && (
            <div className="qi-fade-enter mx-auto mt-4 flex max-w-sm flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  lockedNotice === 5
                    ? "/kenji-game/poses/battle-ready.webp"
                    : "/kenji-game/poses/set-off.webp"
                }
                alt={
                  lockedNotice === 5
                    ? "Kenji, blades drawn, ready to meet whoever waits on the far side of the bridge"
                    : "Kenji, packed and ready, still on the road toward this stage"
                }
                className="mb-3 w-24 opacity-90 sm:w-28"
              />
              <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--qi-gold)]">
                {isUnlocked(lockedNotice)
                  ? `${STAGES[lockedNotice].day} is still being built — check back soon.`
                  : `Complete ${STAGES[lockedNotice - 1].day} first to reach ${STAGES[lockedNotice].day}.`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ---------------- THE LEGEND: items ---------------- */}
      {phase === "items" && (
        <div
          className="qi-fade-enter absolute inset-0 overflow-y-auto px-6 py-16 sm:px-10"
          style={{ background: "#2a2a2a" }}
        >
          <button
            type="button"
            onClick={() => setPhase("menu")}
            className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[var(--qi-gold)] hover:underline"
          >
            &larr; Menu
          </button>

          <h2 className="text-center font-cinema text-2xl uppercase tracking-wide text-[var(--qi-ivory)] sm:text-4xl">
            The Legend
          </h2>
          <span
            aria-hidden="true"
            className="mt-2 block text-center font-tribal text-3xl text-black sm:text-4xl"
            style={{
              textShadow:
                "0 0 6px rgba(241,230,207,0.5), 0 1px 0 rgba(241,230,207,0.25)",
            }}
          >
            宝
          </span>
          <p className="mx-auto mb-8 mt-5 max-w-md text-center font-serif italic text-[var(--qi-ivory)]/70">
            What Kenji carries, and what the road still owes him.
          </p>

          <HubTabs active="items" onSelect={setPhase} />

          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-3">
            {ITEMS.map((item) => {
              const collected = isItemCollected(item);
              return (
                <div
                  key={item.key}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className="qi-item-gleam qi-panel flex aspect-square w-full items-center justify-center rounded-xl p-5"
                    tabIndex={0}
                    role="img"
                    aria-label={
                      collected
                        ? item.name
                        : `${item.name} — not yet found`
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img}
                      alt=""
                      className={`h-full w-full object-contain transition-[filter,opacity] duration-300 ${
                        collected
                          ? "qi-item-glow opacity-100"
                          : "opacity-30 grayscale"
                      }`}
                    />
                  </div>
                  {!collected && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src="/kenji-game/lock.png"
                      alt=""
                      aria-hidden="true"
                      className="-mt-1 w-6 opacity-80"
                    />
                  )}
                  {collected && (
                    <>
                      <p className="mt-3 font-cinema text-xs uppercase tracking-wide text-[var(--qi-ivory)] sm:text-sm">
                        {item.name}
                      </p>
                      <p className="mt-1 max-w-[10rem] text-[11px] text-[var(--qi-ivory)]/50">
                        {item.body}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- STAGE ENTRY: the day's art, full-screen ---------------- */}
      {phase === "dayArt" && (
        <div className="qi-fade-enter absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--qi-ink)] p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={STAGES[dayIntroIndex].full}
            alt={`${STAGES[dayIntroIndex].title} — the stage Kenji is about to enter`}
            className="qi-cover-grow-fade max-h-[80vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}

      {/* ---------------- STAGE ENTRY: a moment with Kenji ---------------- */}
      {phase === "dayKenji" && (
        <div
          className="qi-fade-enter absolute inset-0 flex flex-col items-center justify-center gap-5 p-6"
          style={{
            background:
              "linear-gradient(160deg, #16241a 0%, #1c2f1e 35%, #2a2312 70%, #1a1409 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kenji-game/poses/set-off.webp"
            alt="Kenji, ready to enter the stage ahead"
            className="qi-cover-grow max-h-[65vh] max-w-[80vw] object-contain"
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--qi-gold)]">
            {STAGES[dayIntroIndex].n} &middot; {STAGES[dayIntroIndex].title}
          </p>
        </div>
      )}

      {/* ---------------- DAY 1: THE INHERITANCE ---------------- */}
      {phase === "day1" && (
        <div className="qi-fade-enter absolute inset-0 overflow-y-auto">
          <div className="relative min-h-[50vh] w-full sm:min-h-[60vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={STAGES[0].full}
              alt="Kenji stepping into a ruined, water-filled chamber lit by a single shaft of light"
              className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--qi-ink)] via-[var(--qi-ink)]/10 to-[var(--qi-ink)]/40" />
            <button
              type="button"
              onClick={() => setPhase("menu")}
              className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest text-[var(--qi-ivory)]/70 hover:text-[var(--qi-gold)] sm:left-6 sm:top-6"
            >
              &larr; Menu
            </button>
            <div className="absolute inset-x-0 bottom-0 px-6 pb-8 text-center sm:pb-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--qi-gold)]">
                I &middot; The Inheritance
              </p>
              <h2 className="mt-2 font-cinema text-2xl uppercase tracking-wide text-[var(--qi-ivory)] sm:text-4xl">
                The Empty Room
              </h2>
              <span
                aria-hidden="true"
                className="mt-1 block text-center font-tribal text-2xl text-[var(--qi-gold)] sm:text-3xl"
                style={{
                  textShadow:
                    "0 2px 8px rgba(0,0,0,0.85), 0 0 16px rgba(214,166,75,0.4)",
                }}
              >
                継
              </span>
            </div>
          </div>

          <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
            <p className="font-serif italic leading-relaxed text-[var(--qi-ivory)]/90">
              The door gives easier than it should. Inside: still water
              over old stone, two silent statues, and one shaft of
              light falling exactly where nothing should still be
              standing. Something in the room has been waiting for
              someone who knows how to look.
            </p>

            {!riddleSolved ? (
              <form
                onSubmit={handleRiddleSubmit}
                className="qi-panel mt-8 rounded-xl p-6 text-center sm:p-8"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--qi-gold)]">
                  The First Riddle
                </p>
                <p className="mx-auto mt-3 max-w-sm font-serif italic leading-relaxed text-[var(--qi-ivory)]">
                  &ldquo;I am not lit, yet I show the way. I am not
                  spoken, yet I am understood. Stay still long enough,
                  and I will find you.&rdquo;
                </p>
                <label htmlFor="qi-riddle" className="sr-only">
                  Your answer
                </label>
                <input
                  id="qi-riddle"
                  type="text"
                  autoFocus
                  value={riddleValue}
                  onChange={(e) => {
                    setRiddleValue(e.target.value);
                    if (riddleHint) setRiddleHint(false);
                  }}
                  placeholder="What am I?"
                  className="mx-auto mt-5 block w-full max-w-xs rounded-full border border-[var(--qi-gold)]/40 bg-black/30 px-4 py-2.5 text-center text-sm text-[var(--qi-ivory)] outline-none placeholder:text-[var(--qi-ivory)]/40 focus:border-[var(--qi-gold)]"
                />
                <button
                  type="submit"
                  className="mx-auto mt-4 block rounded-full bg-[var(--qi-gold)] px-6 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--qi-ink)] transition-transform hover:scale-[1.03]"
                >
                  Answer
                </button>
                {riddleHint && (
                  <p className="mt-4 text-xs text-[var(--qi-ivory)]/60">
                    Not quite. Look at what the shaft from above is
                    doing to the room, not what&rsquo;s said aloud.
                  </p>
                )}
              </form>
            ) : (
              <div className="qi-fade-enter qi-panel mt-8 rounded-xl p-6 text-center sm:p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/kenji-game/poses/round-complete.webp"
                  alt="Kenji, head bowed, hands pressed together in quiet acknowledgment"
                  className="qi-item-glow mx-auto w-32 sm:w-40"
                />
                {STAGES[dayIntroIndex + 1] && (
                  <p className="mt-2 font-serif text-xs italic text-[var(--qi-ivory)]/50">
                    Days pass on the road to{" "}
                    {STAGES[dayIntroIndex + 1].title}&hellip;
                  </p>
                )}
                <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[var(--qi-gold)]">
                  Light
                </p>
                <p className="mx-auto mt-3 max-w-md font-serif italic leading-relaxed text-[var(--qi-ivory)]">
                  The circle in the floor answers before Kenji touches
                  it. Where the shaft lands, an old blade waits, and
                  beside it, a fragment of scroll &mdash; the first
                  piece of an inheritance he didn&rsquo;t know he was
                  owed.
                </p>
                <p className="mx-auto mt-4 max-w-md text-sm text-[var(--qi-ivory)]/70">
                  <strong className="font-bold italic">Hikariwake</strong>{" "}
                  is his now, sheathed, waiting. Ahead, the bridges of{" "}
                  <strong className="font-bold italic">
                    The Warden City
                  </strong>{" "}
                  rise out of the mist.
                </p>
                <button
                  type="button"
                  onClick={() => goTo("levels")}
                  className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[var(--qi-gold)] px-6 py-2.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--qi-ink)] transition-transform hover:scale-[1.03]"
                >
                  Return to the Path
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- DAY 2: THE WARDEN CITY ---------------- */}
      {phase === "day2" && (
        <div className="qi-fade-enter absolute inset-0 overflow-y-auto">
          <div className="relative min-h-[50vh] w-full sm:min-h-[60vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={STAGES[1].full}
              alt="Kenji approaching the guarded bridges of Kosei at dusk"
              className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--qi-ink)] via-[var(--qi-ink)]/10 to-[var(--qi-ink)]/40" />
            <button
              type="button"
              onClick={() => setPhase("menu")}
              className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest text-[var(--qi-ivory)]/70 hover:text-[var(--qi-gold)] sm:left-6 sm:top-6"
            >
              &larr; Menu
            </button>
            <div className="absolute inset-x-0 bottom-0 px-6 pb-8 text-center sm:pb-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--qi-gold)]">
                II &middot; The Warden City
              </p>
              <h2 className="mt-2 font-cinema text-2xl uppercase tracking-wide text-[var(--qi-ivory)] sm:text-4xl">
                Kosei
              </h2>
              <span
                aria-hidden="true"
                className="mt-1 block text-center font-tribal text-2xl text-[var(--qi-gold)] sm:text-3xl"
                style={{
                  textShadow:
                    "0 2px 8px rgba(0,0,0,0.85), 0 0 16px rgba(214,166,75,0.4)",
                }}
              >
                守
              </span>
            </div>
          </div>

          <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
            <p className="font-serif italic leading-relaxed text-[var(--qi-ivory)]/90">
              The bridges of Kosei rise out of the mist before the city
              itself does &mdash; terraces stacked in switchbacks,
              banners the color of dusk hung from every rail. A
              checkpoint waits at the first crossing, manned by wardens
              who have clearly done this before.
            </p>

            {!riddle2Solved && dialogueIndex < WARDEN_DIALOGUE.length && (
              <div
                role="button"
                tabIndex={0}
                onClick={advanceDialogue}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    advanceDialogue();
                  }
                }}
                className="qi-panel mt-8 cursor-pointer rounded-xl p-6 text-left sm:p-8"
              >
                <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-widest text-[var(--qi-gold)]">
                  The Gate at Kosei
                </p>
                <div className="space-y-3">
                  {WARDEN_DIALOGUE.slice(0, dialogueIndex + 1).map((d, i) => (
                    <p
                      key={i}
                      className="qi-fade-enter font-serif text-sm leading-relaxed text-[var(--qi-ivory)]/90"
                    >
                      <span
                        className={`font-mono text-[10px] uppercase tracking-widest ${
                          d.speaker === "Kenji"
                            ? "text-[var(--qi-ivory)]/60"
                            : "text-[var(--qi-gold)]"
                        }`}
                      >
                        {d.speaker}
                      </span>
                      <br />
                      {d.line}
                    </p>
                  ))}
                </div>
                <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--qi-ivory)]/40">
                  tap to continue
                </p>
              </div>
            )}

            {!riddle2Solved && dialogueIndex >= WARDEN_DIALOGUE.length && (
              <form
                onSubmit={handleRiddle2Submit}
                className="qi-fade-enter qi-panel mt-8 rounded-xl p-6 text-center sm:p-8"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--qi-gold)]">
                  The Warden&rsquo;s Test
                </p>
                <p className="mx-auto mt-3 max-w-sm font-serif italic leading-relaxed text-[var(--qi-ivory)]">
                  &ldquo;I have no gate to force, no wall to climb. I
                  open only for those who&rsquo;ve already earned
                  passage &mdash; without knowing it. What am
                  I?&rdquo;
                </p>
                <label htmlFor="qi-riddle-2" className="sr-only">
                  Your answer
                </label>
                <input
                  id="qi-riddle-2"
                  type="text"
                  autoFocus
                  value={riddle2Value}
                  onChange={(e) => {
                    setRiddle2Value(e.target.value);
                    if (riddle2Hint) setRiddle2Hint(false);
                  }}
                  placeholder="What am I?"
                  className="mx-auto mt-5 block w-full max-w-xs rounded-full border border-[var(--qi-gold)]/40 bg-black/30 px-4 py-2.5 text-center text-sm text-[var(--qi-ivory)] outline-none placeholder:text-[var(--qi-ivory)]/40 focus:border-[var(--qi-gold)]"
                />
                <button
                  type="submit"
                  className="mx-auto mt-4 block rounded-full bg-[var(--qi-gold)] px-6 py-2 font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--qi-ink)] transition-transform hover:scale-[1.03]"
                >
                  Answer
                </button>
                {riddle2Hint && (
                  <p className="mt-4 text-xs text-[var(--qi-ivory)]/60">
                    Not quite. Isao already told you what Kosei really
                    guards &mdash; listen again to what he said, not
                    just what he asked.
                  </p>
                )}
              </form>
            )}

            {riddle2Solved && (
              <div className="qi-fade-enter qi-panel mt-8 rounded-xl p-6 text-center sm:p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/kenji-game/poses/round-complete.webp"
                  alt="Kenji, head bowed, hands pressed together in quiet acknowledgment"
                  className="qi-item-glow mx-auto w-32 sm:w-40"
                />
                {STAGES[dayIntroIndex + 1] && (
                  <p className="mt-2 font-serif text-xs italic text-[var(--qi-ivory)]/50">
                    Days pass on the road to{" "}
                    {STAGES[dayIntroIndex + 1].title}&hellip;
                  </p>
                )}
                <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[var(--qi-gold)]">
                  Trust
                </p>
                <p className="mx-auto mt-3 max-w-md font-serif italic leading-relaxed text-[var(--qi-ivory)]">
                  Isao studies him a moment longer, then steps aside
                  without another word. The younger warden&rsquo;s nod
                  is smaller, but it&rsquo;s there. The gate opens onto
                  bridges and banners, and for the first time since
                  House Mizuhara, someone has looked at Kenji and seen
                  more than a name.
                </p>
                <p className="mx-auto mt-4 max-w-md text-sm text-[var(--qi-ivory)]/70">
                  The scroll is no lighter for it, but it feels
                  &mdash; for a moment &mdash; less alone. The road to{" "}
                  <strong className="font-bold italic">
                    The Ancient Grove
                  </strong>{" "}
                  is still being built.
                </p>
                <button
                  type="button"
                  onClick={() => goTo("levels")}
                  className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[var(--qi-gold)] px-6 py-2.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--qi-ink)] transition-transform hover:scale-[1.03]"
                >
                  Return to the Path
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
