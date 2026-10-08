"use client";

import { useState } from "react";
import "./scroll-button.css";

// Short, spoiler-free lines the scrolls might be inked with.
const LINES = [
  ["the road", "remembers"],
  ["seven stages,", "one door"],
  ["first light", "waits"],
  ["listen", "before you step"],
  ["what do you", "carry?"],
  ["Kuroshio", "Reach"],
  ["the butterfly", "knows the way"],
  ["stillness", "is a path"],
  ["follow the", "light home"],
  ["not every", "door opens"],
];

const rand = (n) => Math.floor(Math.random() * n);

function roll() {
  const side = () =>
    Math.random() < 0.5
      ? {
          kind: "map",
          x: rand(100),
          y: rand(100),
          zoom: 170 + rand(110),
        }
      : { kind: "text", lines: LINES[rand(LINES.length)], tilt: rand(5) - 2 };
  return { l: side(), r: side() };
}

function Side({ data, pos }) {
  return (
    <span className={`qs-side qs-side--${pos}`} aria-hidden="true">
      {data.kind === "map" ? (
        <span
          className="qs-map"
          style={{
            backgroundPosition: `${data.x}% ${data.y}%`,
            backgroundSize: `${data.zoom}%`,
          }}
        />
      ) : (
        <span
          className="qs-writing"
          style={{ transform: `rotate(${data.tilt}deg)` }}
        >
          <span>{data.lines[0]}</span>
          <span>{data.lines[1]}</span>
        </span>
      )}
    </span>
  );
}

// A menu button drawn as an old scroll. Closed, it's a rolled-up
// strip with the label on it; on hover (or keyboard focus) it unrolls
// sideways, and the new parchment is inked with a fresh random mix of
// map fragments and handwriting each time. Disabled scrolls stay
// rolled and greyed.
export default function ScrollButton({
  children,
  onClick,
  disabled = false,
  big = false,
  dim = false,
  type = "button",
}) {
  const [art, setArt] = useState(() => ({
    l: { kind: "map", x: 22, y: 40, zoom: 360 },
    r: { kind: "text", lines: LINES[0], tilt: 0 },
  }));
  const reroll = () => {
    if (!disabled) setArt(roll());
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={reroll}
      onFocus={reroll}
      className={`qs ${big ? "qs--big" : ""} ${dim ? "qs--dim" : ""}`}
    >
      <span className="qs-group">
        <span className="qs-rod" aria-hidden="true" />
        <span className="qs-paper">
          <Side data={art.l} pos="l" />
          <Side data={art.r} pos="r" />
          <span className="qs-label">{children}</span>
        </span>
        <span className="qs-rod" aria-hidden="true" />
      </span>
    </button>
  );
}
