"use client";

import { useEffect, useRef } from "react";

// A very faint field of gold specks that twinkle at random, drawn on one
// fixed canvas behind the page's content so it only shows where the
// background does. Each speck has its own position, rhythm and phase, and
// the brightest few catch a tiny four-point glint. Holds still for people
// who ask for reduced motion.
export default function GoldSparkle({ count = 110 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let w = 0;
    let h = 0;
    let raf = 0;
    let specks = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const seed = () => {
      const n = Math.round((count * (w * h)) / (1440 * 900));
      specks = Array.from({ length: Math.max(40, Math.min(n, 220)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.1,
        // slow, uneven twinkles: 2.5–8 s per cycle, random phase
        speed: (Math.PI * 2) / (2500 + Math.random() * 5500),
        phase: Math.random() * Math.PI * 2,
        // most specks stay dim; a few get brighter and a glint
        peak: Math.random() < 0.12 ? 0.55 : 0.12 + Math.random() * 0.22,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of specks) {
        // sharpen the sine so each speck mostly rests and flares briefly
        const wave = Math.max(0, Math.sin(t * s.speed + s.phase));
        const a = s.peak * wave * wave * wave;
        if (a < 0.01) continue;
        ctx.fillStyle = `rgba(232, 193, 98, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.peak > 0.5 && a > 0.2) {
          const len = 4 + s.r * 3 * wave;
          ctx.strokeStyle = `rgba(255, 230, 150, ${a * 0.7})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(s.x - len, s.y);
          ctx.lineTo(s.x + len, s.y);
          ctx.moveTo(s.x, s.y - len);
          ctx.lineTo(s.x, s.y + len);
          ctx.stroke();
        }
      }
    };

    const loop = (t) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduced) {
      draw(1500);
    } else {
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
