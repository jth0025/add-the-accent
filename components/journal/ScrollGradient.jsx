"use client";

import { useEffect } from "react";

// Touch screens have no hover, so the section titles' gradient plays when
// the title scrolls into view instead (the CSS for `.is-in` only applies
// under `(hover: none)` — see records.css). Renders nothing. An
// IntersectionObserver does the work; a scroll check backs it up for
// browsers or states where observer callbacks are held back.
export default function ScrollGradient({ selector = ".sec-title, .ar-gleam" }) {
  useEffect(() => {
    const pending = new Set(document.querySelectorAll(selector));
    if (!pending.size) return undefined;

    const reveal = (el) => {
      el.classList.add("is-in");
      pending.delete(el);
      io?.unobserve(el);
    };

    const check = () => {
      pending.forEach((el) => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // in view, or already scrolled past
        if (r.top < vh * 0.82) reveal(el);
      });
    };

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && reveal(e.target)),
            { threshold: 0.6 },
          )
        : null;
    pending.forEach((el) => io?.observe(el));

    let timer = 0;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(check, 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io?.disconnect();
    };
  }, [selector]);
  return null;
}
