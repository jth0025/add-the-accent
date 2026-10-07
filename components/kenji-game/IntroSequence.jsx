"use client";

import { useEffect, useRef, useState } from "react";
import "./intro-sequence.css";

// The written opening: 18 stills in a fixed order, each with its own
// two-line beat (see the Intro Sequence brief). No voiceover and no
// movement inside the pictures beyond a very slow push-in; only cuts,
// dissolves, and full-frame fades move between them.
//
// Per scene:
//   lines — the words, one string per line
//   tr    — how this scene arrives: "open" from black, a "cross" dissolve
//           over the previous scene, or a "dip" that fades the previous
//           scene out to a color and the new one in from it
//   fx/fy — where the picture is anchored if the window crops it
//   zx/zy — the point the slow zoom pushes toward
//   zs    — how far the zoom goes (close-ups creep less than full shots)
//   cx/cy/cw — the caption's center and width, as a percent of the
//           picture, placed over empty ground away from any face or body
const SCENES = [
  {
    src: "s01",
    lines: ["Before a journey asks where you are going,", "it asks who is walking."],
    tr: { mode: "open", ms: 1000 },
    read: 5000,
    fx: 36, fy: 50, zx: 32, zy: 28, zs: 1.1,
    cx: 52, cy: 87, cw: 70,
  },
  {
    src: "s02",
    lines: ["He learned to listen", "before he learned to move."],
    tr: { mode: "cross", ms: 800 },
    fx: 42, fy: 50, zx: 44, zy: 46, zs: 1.12,
    cx: 62, cy: 88, cw: 56,
  },
  {
    src: "s03",
    lines: ["Some things are given to us", "before we understand their weight."],
    tr: { mode: "cross", ms: 600 },
    fx: 48, fy: 50, zx: 44, zy: 52, zs: 1.1,
    cx: 68, cy: 15, cw: 52,
  },
  {
    src: "s04",
    lines: ["And some doors do not open", "until we are willing to descend."],
    tr: { mode: "dip", out: 220, in: 230, color: "#1a0e05" },
    fx: 42, fy: 50, zx: 40, zy: 50, zs: 1.1,
    cx: 73, cy: 80, cw: 44,
  },
  {
    src: "s05",
    lines: ["The past does not disappear.", "It waits."],
    tr: { mode: "cross", ms: 600 },
    fx: 50, fy: 50, zx: 50, zy: 35, zs: 1.07,
    cx: 15.5, cy: 66, cw: 21,
  },
  {
    src: "s06",
    lines: ["Sometimes in silence.", "Sometimes in shadow."],
    tr: { mode: "cross", ms: 800 },
    fx: 62, fy: 50, zx: 68, zy: 42, zs: 1.1,
    cx: 32, cy: 80, cw: 50,
  },
  {
    src: "s07",
    lines: ["Beyond home, the world", "does not explain itself."],
    tr: { mode: "dip", out: 600, in: 700, color: "#000" },
    fx: 50, fy: 50, zx: 50, zy: 35, zs: 1.07,
    cx: 84.5, cy: 76, cw: 22,
  },
  {
    src: "s08",
    lines: ["It asks for discipline."],
    tr: { mode: "cross", ms: 500 },
    fx: 50, fy: 50, zx: 50, zy: 60, zs: 1.12,
    cx: 22, cy: 84, cw: 34,
  },
  {
    src: "s09",
    lines: ["It asks what you remember", "when the familiar falls away."],
    tr: { mode: "cross", ms: 500 },
    fx: 50, fy: 50, zx: 50, zy: 35, zs: 1.07,
    cx: 15.5, cy: 74, cw: 21,
  },
  {
    src: "s10",
    lines: ["It asks what you believe", "belongs to you."],
    tr: { mode: "cross", ms: 500 },
    fx: 50, fy: 50, zx: 50, zy: 60, zs: 1.12,
    cx: 20, cy: 83, cw: 34,
  },
  {
    src: "s11",
    lines: ["It lifts you high enough", "to make certainty feel small."],
    tr: { mode: "cross", ms: 400 },
    fx: 50, fy: 50, zx: 50, zy: 35, zs: 1.07,
    cx: 15.5, cy: 72, cw: 21,
  },
  {
    src: "s12",
    lines: ["Wonder and danger", "often share the same horizon."],
    tr: { mode: "cross", ms: 500 },
    fx: 50, fy: 50, zx: 50, zy: 60, zs: 1.12,
    cx: 20, cy: 83, cw: 34,
  },
  {
    src: "s13",
    lines: ["Some powers protect", "because they cannot be possessed."],
    tr: { mode: "cross", ms: 500 },
    fx: 50, fy: 50, zx: 50, zy: 35, zs: 1.07,
    cx: 15.5, cy: 78, cw: 21,
  },
  {
    src: "s14",
    lines: ["Some agreements outlive", "those who first made them."],
    tr: { mode: "cross", ms: 600 },
    fx: 50, fy: 50, zx: 50, zy: 60, zs: 1.12,
    cx: 20, cy: 83, cw: 34,
  },
  {
    src: "s15",
    lines: ["The road will break.", "The choice will remain."],
    tr: { mode: "dip", out: 350, in: 500, color: "#000" },
    fx: 50, fy: 50, zx: 50, zy: 35, zs: 1.07,
    cx: 15.5, cy: 74, cw: 21,
  },
  {
    src: "s16",
    lines: ["When no path is left,", "what you carry within becomes the way."],
    tr: { mode: "cross", ms: 500 },
    fx: 50, fy: 50, zx: 45, zy: 55, zs: 1.12,
    cx: 21, cy: 80, cw: 36,
  },
  {
    src: "s17",
    lines: ["At the edge of what you sought,", "the question changes."],
    tr: { mode: "cross", ms: 800 },
    fx: 50, fy: 50, zx: 50, zy: 35, zs: 1.07,
    cx: 15.5, cy: 76, cw: 21,
  },
  {
    src: "s18",
    lines: [
      "First light is not where you return.",
      "It is what you learn to become.",
    ],
    tr: { mode: "cross", ms: 800 },
    fx: 50, fy: 50, zx: 50, zy: 55, zs: 1.12,
    cx: 21, cy: 83, cw: 38,
    read: 7000,
    final: true,
  },
];

// Reading time once all of a scene's text is on screen: a short
// sentence gets a few seconds, a two-line beat a few more.
const READ_ONE = 3500;
const READ_TWO = 4000;
const LINE_FADE = 1400;
const LINE_GAP = 1400;
const TEXT_OUT = 900;

const transitionMs = (tr) => (tr.mode === "dip" ? tr.out + tr.in : tr.ms);

// Derived timing (ms from the moment a scene starts to arrive).
SCENES.forEach((s, i) => {
  const trans = transitionMs(s.tr);
  s.trans = trans;
  s.textDelay = trans + (s.tr.mode === "open" ? 400 : 200);
  const lineSpan = LINE_FADE + (s.lines.length - 1) * LINE_GAP;
  const read = s.read ?? (s.lines.length === 1 ? READ_ONE : READ_TWO);
  s.hold = s.textDelay + lineSpan + read + (s.final ? 0 : TEXT_OUT);
  s.imgSrc = `/kenji-game/intro/${s.src}.webp`;
});
SCENES.forEach((s, i) => {
  const next = SCENES[i + 1];
  // The picture keeps creeping while the next scene dissolves over it.
  s.zoomMs = s.hold + (next ? next.trans : 1500) + 800;
});

function Scene({ s, role, nextTr, reducedMotion }) {
  const rm = reducedMotion;
  const isCur = role === "cur";
  const tr = s.tr;
  const rootStyle = {};
  let rootClass = "qi-seq-scene";

  if (isCur) {
    rootClass += " qi-seq-in";
    if (tr.mode === "dip") {
      rootStyle["--in"] = `${rm ? 150 : tr.in}ms`;
      rootStyle["--in-delay"] = `${rm ? 0 : tr.out}ms`;
    } else {
      rootStyle["--in"] = `${rm ? 200 : tr.ms}ms`;
    }
  } else if (nextTr?.mode === "dip") {
    rootClass += " qi-seq-out";
    rootStyle["--out"] = `${rm ? 150 : nextTr.out}ms`;
  }

  const textDelay = rm ? 200 : s.textDelay;
  const capStyle = {
    "--cx": s.cx,
    "--cy": s.cy,
    "--cw": s.cw,
    "--td": `${textDelay}ms`,
    "--tout": `${s.hold - TEXT_OUT}ms`,
    "--l2": `${textDelay + LINE_GAP}ms`,
  };
  if (rm) {
    capStyle["--l2"] = "300ms";
    capStyle["--tout"] = "99999ms";
  }
  const frameStyle = { "--fx": s.fx, "--fy": s.fy };

  return (
    <div className={rootClass} style={rootStyle}>
      <div className="qi-seq-art" aria-hidden="true">
        <div className="qi-seq-frame" style={frameStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.imgSrc}
            alt=""
            className="qi-seq-img"
            style={{
              "--zx": `${s.zx}%`,
              "--zy": `${s.zy}%`,
              "--zs": s.zs,
              "--zoom": `${s.zoomMs}ms`,
            }}
          />
        </div>
      </div>
      <div className="qi-seq-cap">
        <div className="qi-seq-frame" style={frameStyle}>
          <div
            className={`qi-seq-caption font-serif italic ${
              s.final ? "qi-seq-caption--final" : ""
            }`}
            style={capStyle}
          >
            {s.lines.map((line) => (
              <p key={line} className="qi-seq-line">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IntroSequence({ reducedMotion = false, onDone }) {
  const [i, setI] = useState(0);
  // 0 = scenes playing, 1 = fading to white, 2 = holding white,
  // 3 = white fading to black, 4 = holding black
  const [end, setEnd] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  // Warm every still so each is ready when its turn comes.
  useEffect(() => {
    SCENES.forEach((s) => {
      const img = new window.Image();
      img.src = s.imgSrc;
    });
  }, []);

  useEffect(() => {
    const rm = reducedMotion;
    let ms;
    let next;
    if (end === 0) {
      const last = i >= SCENES.length - 1;
      ms = rm ? 3200 : SCENES[i].hold;
      next = () => (last ? setEnd(1) : setI(i + 1));
    } else if (end === 1) {
      ms = rm ? 250 : 1200;
      next = () => setEnd(2);
    } else if (end === 2) {
      ms = rm ? 150 : 500;
      next = () => setEnd(3);
    } else if (end === 3) {
      ms = rm ? 250 : 900;
      next = () => setEnd(4);
    } else {
      ms = rm ? 300 : 1100;
      next = () => doneRef.current?.();
    }
    const t = setTimeout(next, ms);
    return () => clearTimeout(t);
  }, [i, end, reducedMotion]);

  const cur = SCENES[i];
  const prev = i > 0 ? SCENES[i - 1] : null;
  const dipColor = cur.tr.mode === "dip" ? cur.tr.color : null;

  return (
    <div
      className="qi-seq"
      style={dipColor ? { background: dipColor } : undefined}
    >
      {end < 3 && (
        <>
          {prev && end === 0 && (
            <Scene
              key={i - 1}
              s={prev}
              role="prev"
              nextTr={cur.tr}
              reducedMotion={reducedMotion}
            />
          )}
          <Scene key={i} s={cur} role="cur" reducedMotion={reducedMotion} />
        </>
      )}
      {end === 1 && <div className="qi-seq-white qi-seq-white--in" />}
      {end === 2 && <div className="qi-seq-white qi-seq-white--hold" />}
      {end === 3 && <div className="qi-seq-white qi-seq-white--out" />}
    </div>
  );
}
