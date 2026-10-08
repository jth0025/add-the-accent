"use client";

// A link that lets the whole page drift away like smoke before the next
// screen takes over (see .kq-leaving in app/kenji-quest/kenji-quest.css).
// Modified clicks (new tab etc.) behave as normal links.
export default function SmokeLink({ href, children, ...rest }) {
  const go = (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) {
      window.location.assign(href);
      return;
    }
    document.documentElement.classList.add("kq-leaving");
    window.setTimeout(() => window.location.assign(href), 950);
  };
  return (
    <a href={href} onClick={go} {...rest}>
      {children}
    </a>
  );
}
