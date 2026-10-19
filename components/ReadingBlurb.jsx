"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./reading-blurb.css";

// Where the book can be bought. Bookshop.org first (it supports independent
// stores); swap either for a direct product page whenever you like.
const BOOK = {
  title: "Rain of Gold",
  author: "Victor Villaseñor",
  kind: "A biographical memoir",
  shop: "https://bookshop.org/search?keywords=Rain+of+Gold+Victor+Villasenor",
  amazon: "https://www.amazon.com/s?k=Rain+of+Gold+Victor+Villasenor",
};

// A hand-made icon of the book: green cloth, gold foil, golden hills and a
// little rain of gold. (Not the publisher's cover: a stand-in.)
function BookIcon() {
  return (
    <svg viewBox="0 0 132 184" className="rb-book-svg" role="img" aria-label="Rain of Gold, the book">
      <defs>
        <linearGradient id="rb-cloth" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f6b4a" />
          <stop offset="1" stopColor="#173a2a" />
        </linearGradient>
        <linearGradient id="rb-foil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0b0" />
          <stop offset="0.45" stopColor="#e2b44f" />
          <stop offset="1" stopColor="#9a6c1c" />
        </linearGradient>
        <clipPath id="rb-cover">
          <rect x="10" y="6" width="104" height="164" rx="5" />
        </clipPath>
      </defs>
      {/* page block and spine */}
      <rect x="16" y="12" width="108" height="166" rx="4" fill="#efe2bf" />
      <path d="M20 176h100M20 173h100M20 170h100" stroke="#c9b27a" strokeWidth="1" />
      <rect x="10" y="6" width="104" height="164" rx="5" fill="url(#rb-cloth)" />
      <rect x="10" y="6" width="12" height="164" rx="5" fill="#0f2a1e" opacity="0.55" />
      <g clipPath="url(#rb-cover)">
        {/* golden hills */}
        <path className="rb-hill rb-hill--b" d="M10 132c22-16 40-16 62-3s30 12 42 4V170H10z" fill="#c8922b" />
        <path className="rb-hill rb-hill--a" d="M10 146c18-12 34-14 54-4s34 10 50-2V170H10z" fill="url(#rb-foil)" />
        {/* the rain of gold */}
        <g fill="#f4cf6a">
          <circle className="rb-drop" cx="40" cy="62" r="2.2" />
          <circle className="rb-drop rb-drop--2" cx="62" cy="54" r="2.6" />
          <circle className="rb-drop rb-drop--3" cx="84" cy="64" r="2.2" />
          <circle className="rb-drop rb-drop--4" cx="52" cy="80" r="1.8" />
          <circle className="rb-drop rb-drop--5" cx="76" cy="84" r="1.8" />
        </g>
      </g>
      {/* foil frame and title */}
      <rect x="22" y="14" width="86" height="148" rx="3" fill="none" stroke="url(#rb-foil)" strokeWidth="1.4" />
      <text x="65" y="36" textAnchor="middle" fontFamily="Playfair Display, Georgia, serif" fontWeight="800" fontSize="15" fill="url(#rb-foil)" letterSpacing="1.5">
        RAIN
      </text>
      <text x="65" y="50" textAnchor="middle" fontFamily="Playfair Display, Georgia, serif" fontStyle="italic" fontSize="10" fill="#f4e3a3">
        of
      </text>
      <text x="65" y="66" textAnchor="middle" fontFamily="Playfair Display, Georgia, serif" fontWeight="800" fontSize="15" fill="url(#rb-foil)" letterSpacing="1.5">
        GOLD
      </text>
      <text x="65" y="156" textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace" fontSize="6.4" fill="#fff3c4" letterSpacing="1.2">
        VICTOR VILLASEÑOR
      </text>
    </svg>
  );
}

// The real cover, if its file is in /public/books (rain-of-gold.jpg); until
// then the drawn stand-in above.
function BookCover() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const probe = new window.Image();
    probe.onload = () => setOk(true);
    probe.onerror = () => setOk(false);
    probe.src = "/books/rain-of-gold.jpg";
  }, []);
  if (!ok) return <BookIcon />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/books/rain-of-gold.jpg" alt="Rain of Gold, the book's cover" className="rb-cover" draggable="false" />
  );
}

/**
 * The boy reading on top of the TV. Hover him (or tap him on a touch screen,
 * or focus him) and a thought bubble floats up from his head: a small open
 * book whose left page holds the book itself (a link) and where to buy it,
 * and whose right page holds his note. The dots, the book, the rain and the
 * golden hills all move.
 */
export default function ReadingBlurb() {
  const [open, setOpen] = useState(false);
  // "above": the cloud opens above him, its tail dropping to his head. If
  // that would run up into the header, it opens below him instead.
  const [side, setSide] = useState("above");
  const spreadRef = useRef(null);
  const rootRef = useRef(null);
  const closeTimer = useRef(null);
  const lastType = useRef("mouse");

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 260);
  };

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // The cloud always opens above him. If that would run it up into the
  // header, it is scaled down to fit under it (and only if that would make
  // it too small does it open below him instead).
  useLayoutEffect(() => {
    const el = spreadRef.current;
    if (!open) {
      setSide("above");
      if (el) el.style.scale = "";
      return;
    }
    if (!el) return;
    el.style.animation = "none"; // measure at rest, not mid pop-in
    el.style.scale = "";
    const main = document.querySelector("main");
    const limit = (main ? main.getBoundingClientRect().top + window.scrollY : 0) + 10;
    const r = el.getBoundingClientRect();
    el.style.animation = "";
    if (side === "below" || r.top + window.scrollY >= limit) return;
    const k = (r.bottom + window.scrollY - limit) / r.height;
    if (k >= 0.6) el.style.scale = String(k);
    else setSide("below");
  }, [open, side]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <div
      ref={rootRef}
      data-side={side}
      className={`rb absolute bottom-full -left-9 z-30 w-24 sm:-left-7 sm:w-32 ${open ? "is-open" : ""}`}
      style={{ transform: "translateY(40%)" }}
      onPointerEnter={(e) => {
        lastType.current = e.pointerType;
        if (e.pointerType === "mouse") show();
      }}
      onPointerDownCapture={(e) => {
        lastType.current = e.pointerType;
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") hideSoon();
      }}
    >
      <button
        type="button"
        className="rb-boy"
        aria-expanded={open}
        aria-controls="rb-note"
        aria-label="What he is reading: Rain of Gold"
        onClick={(e) => {
          // A mouse has already opened it by hovering; touch and keyboard toggle.
          if (lastType.current === "mouse" && e.detail > 0) return show();
          setOpen((o) => !o);
        }}
        onFocus={(e) => {
          // Keyboard focus opens it; a mouse press is handled by the click.
          if (e.currentTarget.matches(":focus-visible")) show();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mascot-reading.png" alt="" className="w-full [filter:drop-shadow(0_5px_6px_rgba(0,0,0,0.4))]" draggable="false" />
        <span aria-hidden="true" className="rb-spark rb-spark--1" />
        <span aria-hidden="true" className="rb-spark rb-spark--2" />
      </button>

      {/* the hand-drawn cloud, with his note and the book inside it */}
      <section id="rb-note" ref={spreadRef} className="rb-spread" aria-label="Rain of Gold" hidden={!open}>
        <span aria-hidden="true" className="rb-cloud" />
        <div className="rb-inner">
          <div className="rb-side">
            <a
              className="rb-book"
              href={BOOK.shop}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buy ${BOOK.title} by ${BOOK.author} (opens in a new tab)`}
            >
              <BookCover />
            </a>
            <div className="rb-buy">
              <a href={BOOK.shop} target="_blank" rel="noopener noreferrer">
                Bookshop.org
              </a>
              <a href={BOOK.amazon} target="_blank" rel="noopener noreferrer">
                Amazon
              </a>
            </div>
          </div>
          <div className="rb-note">
            <p className="rb-text">
              When my head is in a cloud reading any book, I tend to compare it to my first true love,{" "}
              <span className="rb-title">Rain of Gold by Victor Villaseñor</span>. I can still hear, taste, see and feel vibrant imagery painted against the pages and
              the captivating love and journey of a young Lupe and Juan during personal conflict and the Mexican
              Revolution and their journey to pre-settled California.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
