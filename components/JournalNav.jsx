"use client";

/**
 * The three jump-links that sit at the top of the Journal page —
 * Series, Interludes, All Entries — each pointing at its section on the
 * unfiltered /journal index. On the index itself they smooth-scroll to
 * the section; from a filtered view they fall back to normal navigation
 * over to /journal and land on the section.
 */
const LINKS = [
  { label: "Series", id: "series" },
  { label: "Interludes", id: "interludes" },
  { label: "All Entries", id: "all-entries" },
];

export default function JournalNav({ className = "" }) {
  const handleClick = (event, id) => {
    const target =
      typeof document !== "undefined" && document.getElementById(id);
    if (!target) return; // not on the sectioned index — let the link navigate
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (typeof history !== "undefined") {
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <nav
      aria-label="Journal sections"
      className={`flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs font-bold uppercase tracking-widest ${className}`}
    >
      {LINKS.map((link) => (
        <a
          key={link.id}
          href={`/journal#${link.id}`}
          onClick={(event) => handleClick(event, link.id)}
          className="text-[#4a5714] underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
