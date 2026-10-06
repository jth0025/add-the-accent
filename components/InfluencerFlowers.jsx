"use client";

import { useEffect, useState } from "react";

// Each bloom is a ring of petals around a centre. Different counts,
// shapes and colours make the flowers read as different kinds.
const VARIANTS = {
  daisy: { n: 10, rx: 1.9, ry: 6.4, dist: 6.4, fill: "#fffaf0", edge: "#b99a5a", core: "#f2b630", coreEdge: "#a8741a", r: 3.2 },
  sunflower: { n: 12, rx: 1.9, ry: 5.8, dist: 6.6, fill: "#f6c23a", edge: "#a8741a", core: "#5a3a1a", coreEdge: "#2e1c0a", r: 4.6 },
  poppy: { n: 4, rx: 5.4, ry: 5.6, dist: 5.4, fill: "#d9382f", edge: "#7d1a14", core: "#2a1a12", coreEdge: "#120a06", r: 2.4 },
  cosmos: { n: 8, rx: 3.1, ry: 6, dist: 6, fill: "#f08fb4", edge: "#a8456f", core: "#f2c230", coreEdge: "#a8741a", r: 2.6 },
  aster: { n: 14, rx: 1.4, ry: 6.2, dist: 6.4, fill: "#b79ae0", edge: "#6e4fa8", core: "#f2c230", coreEdge: "#a8741a", r: 2.8 },
  marigold: { n: 7, rx: 3.6, ry: 5.2, dist: 5.4, fill: "#f08a2a", edge: "#9a4a0c", core: "#b8561a", coreEdge: "#6a2c08", r: 3 },
};
const NAMES = Object.keys(VARIANTS);

// One flower is slower than the other; each is given a pace (seconds for
// one way, growing or shrinking) from its own range and keeps it.
const SPEEDS = { slow: [28, 36], quick: [17, 23] };

const rand = (min, max) => min + Math.random() * (max - min);
const pickName = (avoid) => {
  const pool = NAMES.filter((n) => !avoid.includes(n));
  return pool[Math.floor(Math.random() * pool.length)];
};

const CSS = `
  .loop-flower .stem { stroke-dasharray: 40; stroke-dashoffset: 40; animation: fl-stem var(--dur) ease-in-out infinite alternate; }
  .loop-flower .leaf, .loop-flower .petal, .loop-flower .core { transform-box: view-box; transform: scale(0); opacity: 0; }
  .loop-flower .leaf-l { transform-origin: 19.6px 49px; animation: fl-leaf var(--dur) ease-out infinite alternate; }
  .loop-flower .leaf-r { transform-origin: 20.4px 42px; animation: fl-leaf var(--dur) ease-out infinite alternate; }
  .loop-flower .core, .loop-flower .petal { transform-origin: 20px 16px; }
  .loop-flower .core { animation: fl-core var(--dur) ease-out infinite alternate; }
  .loop-flower .petal.p0 { animation: fl-pa var(--dur) ease-out infinite alternate; }
  .loop-flower .petal.p1 { animation: fl-pb var(--dur) ease-out infinite alternate; }
  .loop-flower .petal.p2 { animation: fl-pc var(--dur) ease-out infinite alternate; }
  .loop-flower .petal.p3 { animation: fl-pd var(--dur) ease-out infinite alternate; }
  .loop-flower .petal.p4 { animation: fl-pe var(--dur) ease-out infinite alternate; }
  .loop-flower .sway { animation: fl-sway 7s ease-in-out infinite alternate; transform-box: view-box; transform-origin: 20px 58px; }
  /* One direction is the whole growth, bottom up (stem, leaves, bud,
     then petals opening outward) with a short rest at each end; the
     alternate direction plays it backwards — petals close, bud
     shrinks, leaves draw in and the stem sinks back to the ground —
     and then it starts again, forever, at the same pace. */
  @keyframes fl-stem { 0%, 6% { stroke-dashoffset: 40; } 48%, 100% { stroke-dashoffset: 0; } }
  @keyframes fl-leaf { 0%, 14% { transform: scale(0); opacity: 0; } 56%, 100% { transform: scale(1); opacity: 1; } }
  @keyframes fl-core { 0%, 46% { transform: scale(0); opacity: 0; } 62%, 100% { transform: scale(1); opacity: 1; } }
  @keyframes fl-pa { 0%, 56% { transform: scale(0); opacity: 0; } 82%, 100% { transform: scale(1); opacity: 1; } }
  @keyframes fl-pb { 0%, 60% { transform: scale(0); opacity: 0; } 85%, 100% { transform: scale(1); opacity: 1; } }
  @keyframes fl-pc { 0%, 64% { transform: scale(0); opacity: 0; } 88%, 100% { transform: scale(1); opacity: 1; } }
  @keyframes fl-pd { 0%, 68% { transform: scale(0); opacity: 0; } 91%, 100% { transform: scale(1); opacity: 1; } }
  @keyframes fl-pe { 0%, 72% { transform: scale(0); opacity: 0; } 94%, 100% { transform: scale(1); opacity: 1; } }
  @keyframes fl-sway { from { transform: rotate(-2.2deg); } to { transform: rotate(2.2deg); } }
  @media (prefers-reduced-motion: reduce) {
    .loop-flower .stem { animation: none; stroke-dashoffset: 0; }
    .loop-flower .leaf, .loop-flower .petal, .loop-flower .core { animation: none !important; transform: scale(1); opacity: 1; }
    .loop-flower .sway { animation: none; }
  }
`;

function LoopFlower({ v, dur }) {
  const f = VARIANTS[v];
  return (
    <svg
      viewBox="0 0 40 60"
      aria-hidden="true"
      className="loop-flower h-auto w-full overflow-visible"
      style={{ "--dur": `${dur}s` }}
    >
      <g>
        <g className="sway [filter:url(#urban-sketch)]">
          <path
            className="stem"
            pathLength="40"
            d="M20 58 C 19 50, 21.5 42, 20 18"
            fill="none"
            stroke="#4a5714"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            className="leaf leaf-l"
            d="M19.6 49 C 12 49, 8 44, 8 40 C 14 40, 18.6 43.5, 19.6 49 Z"
            fill="#7d9a2c"
            stroke="#4a5714"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            className="leaf leaf-r"
            d="M20.4 42 C 27 42, 31.5 37.5, 31.5 33.5 C 25.5 33.5, 21.2 36.5, 20.4 42 Z"
            fill="#7d9a2c"
            stroke="#4a5714"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {Array.from({ length: f.n }).map((_, i) => (
            <g key={i} transform={`rotate(${(360 / f.n) * i} 20 16)`}>
              <ellipse
                className={`petal p${i % 5}`}
                cx="20"
                cy={16 - f.dist}
                rx={f.rx}
                ry={f.ry}
                fill={f.fill}
                stroke={f.edge}
                strokeWidth="0.8"
              />
            </g>
          ))}
          <circle
            className="core"
            cx="20"
            cy="16"
            r={f.r}
            fill={f.core}
            stroke={f.coreEdge}
            strokeWidth="0.8"
          />
        </g>
      </g>
    </svg>
  );
}

/**
 * Wraps the two influencer portraits with one small flower growing on
 * each side. There are only ever two flowers, and they are always two
 * different kinds. Each grows from its stem up and out into a bloom, then
 * grows back down to the ground and begins again — at the same size and
 * the same pace every time. The two grow at different speeds. The kinds
 * and speeds are picked at random on each visit, after mount, so the
 * server and browser never disagree.
 */
export default function InfluencerFlowers({ children }) {
  const [flowers, setFlowers] = useState(null);

  useEffect(() => {
    const leftSlow = Math.random() < 0.5;
    const a = pickName([]);
    const b = pickName([a]);
    setFlowers({
      left: { v: a, dur: rand(...SPEEDS[leftSlow ? "slow" : "quick"]) },
      right: { v: b, dur: rand(...SPEEDS[leftSlow ? "quick" : "slow"]) },
    });
  }, []);

  const slot = (side) => (
    <div className="w-9 shrink-0 self-center sm:w-14">
      {flowers && <LoopFlower v={flowers[side].v} dur={flowers[side].dur} />}
    </div>
  );

  return (
    <div className="mx-auto mt-8 flex max-w-xl items-start justify-center gap-2 sm:gap-5 md:gap-8">
      <style>{CSS}</style>
      <div className="flex self-stretch">{slot("left")}</div>
      {children}
      <div className="flex self-stretch">{slot("right")}</div>
    </div>
  );
}
