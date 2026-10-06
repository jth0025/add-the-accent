"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A small hand-drawn flower that grows up beside a heading once it
 * scrolls into view — the stem draws itself, the leaves unfurl, then the
 * petals open one by one. Sized to the line of text it sits beside
 * (about 1.4em tall), so it never outgrows the word.
 */
export default function InterludeFlower({ className = "" }) {
  const ref = useRef(null);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGrown(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGrown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const petals = [0, 72, 144, 216, 288];

  return (
    <svg
      ref={ref}
      viewBox="0 0 24 34"
      aria-hidden="true"
      className={`interlude-flower h-[1.45em] w-auto overflow-visible ${
        grown ? "is-grown" : ""
      } ${className}`}
    >
      <style>{`
        .interlude-flower .stem { stroke-dasharray: 22; stroke-dashoffset: 22; }
        .interlude-flower .leaf, .interlude-flower .petal, .interlude-flower .core {
          transform-box: view-box; transform: scale(0); opacity: 0;
        }
        .interlude-flower .leaf-l { transform-origin: 11.6px 27px; }
        .interlude-flower .leaf-r { transform-origin: 12.2px 24px; }
        .interlude-flower .petal, .interlude-flower .core { transform-origin: 12px 11px; }
        /* Bottom up: the stem draws first, slowly; the leaves push out
           from it as it passes; then a bud forms at the top and the
           petals open outward from its centre. */
        .interlude-flower.is-grown .stem { stroke-dashoffset: 0; transition: stroke-dashoffset 3s ease-in-out; }
        .interlude-flower.is-grown .leaf { transform: scale(1); opacity: 1; transition: transform 1.8s ease-out 1.2s, opacity 0.6s ease 1.2s; }
        .interlude-flower.is-grown .leaf-r { transition-delay: 1.9s; }
        .interlude-flower.is-grown .core { transform: scale(1); opacity: 1; transition: transform 1.2s ease-out 2.9s, opacity 0.6s ease 2.9s; }
        .interlude-flower.is-grown .petal { transform: scale(1); opacity: 1; transition: transform 1.8s ease-out, opacity 0.8s ease; }
        @keyframes interlude-sway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
        .interlude-flower.is-grown .sway { animation: interlude-sway 6s ease-in-out 6.5s infinite; transform-origin: 12px 32px; }
        @media (prefers-reduced-motion: reduce) {
          .interlude-flower .stem { stroke-dashoffset: 0; }
          .interlude-flower .leaf, .interlude-flower .petal, .interlude-flower .core { transform: scale(1); opacity: 1; }
          .interlude-flower .sway { animation: none; }
        }
      `}</style>
      <g className="sway [filter:url(#urban-sketch)]">
        {/* stem */}
        <path
          className="stem"
          d="M12 33 C 11 27, 13 22, 12 15"
          fill="none"
          stroke="#4a5714"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* leaves */}
        <path
          className="leaf leaf-l"
          d="M11.6 27 C 6 27, 3 23.5, 3 20.5 C 7.5 20.5, 10.8 23, 11.6 27 Z"
          fill="#7d9a2c"
          stroke="#4a5714"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          className="leaf leaf-r"
          d="M12.2 24 C 17.5 24, 20.5 20.5, 20.5 17.5 C 16 17.5, 12.8 20, 12.2 24 Z"
          fill="#7d9a2c"
          stroke="#4a5714"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* bloom: five petals around a centre */}
        {petals.map((deg, i) => (
          <g key={deg} transform={`rotate(${deg} 12 11)`}>
            <ellipse
              className="petal"
              cx="12"
              cy="6.2"
              rx="2.7"
              ry="4.2"
              fill="#f0b94a"
              stroke="#af691e"
              strokeWidth="0.9"
              style={{ transitionDelay: `${3.4 + i * 0.35}s` }}
            />
          </g>
        ))}
        <circle
          className="core"
          cx="12"
          cy="11"
          r="2.6"
          fill="#8a4a14"
          stroke="#4a2a0c"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}
