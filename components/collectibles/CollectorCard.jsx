"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import "./collector-card.css";
import TvEmbed from "./TvEmbed";

// One collector's card. The front is the player card (figure in the corner,
// stats, measurements); the back is the scouting report (the story). The card
// tilts toward the pointer and flips over.
export default function CollectorCard({ item, total }) {
  const [flipped, setFlipped] = useState(false);
  const wrap = useRef(null);
  const card = item.card;

  const tilt = (e) => {
    const el = wrap.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const rest = () => {
    const el = wrap.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  };

  const published = !!item.essayUrl;

  return (
    <section className="mt-8" aria-label={`${item.identity}, collector's card ${item.number}`}>
      <div className="cc-stage" ref={wrap} onPointerMove={tilt} onPointerLeave={rest}>
        <div className={`cc-card ${flipped ? "is-flipped" : ""}`}>
          {/* ---------- front ---------- */}
          <div className="cc-face cc-front" aria-hidden={flipped} inert={flipped ? "" : undefined}>
            <div className="cc-inner">
              <header className="cc-top">
                <span className="cc-no">No. {item.number}</span>
                <span className="cc-rarity">{card.rarity}</span>
              </header>
              <h1 className="cc-name">{item.identity}</h1>
              <p className="cc-pos">
                <span>Position</span> {card.position}
              </p>

              <div className="cc-art">
                <span className="cc-sun" aria-hidden="true" />
                <span className="cc-rays" aria-hidden="true" />
                {/* The figure, standing in the corner of the card. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="cc-fig"
                  src={`/collectibles/figures/${item.figure}.webp`}
                  alt={item.alt}
                  draggable="false"
                />
                <ul className="cc-stats" aria-label="Stats">
                  {card.stats.map(([label, value]) => (
                    <li key={label}>
                      <span className="cc-stat-label">{label}</span>
                      <span className="cc-stat-bar" aria-hidden="true">
                        <i style={{ width: `${value}%` }} />
                      </span>
                      <b className="cc-stat-val">{value}</b>
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="cc-dims">
                <div><dt>Height</dt><dd>{card.dims.height}</dd></div>
                <div><dt>Width</dt><dd>{card.dims.width}</dd></div>
                <div><dt>Weight</dt><dd>{card.dims.weight}</dd></div>
                <div className="cc-dims-wide"><dt>Made of</dt><dd>{card.dims.material}</dd></div>
                <div className="cc-dims-wide"><dt>Finish</dt><dd>{card.dims.finish}</dd></div>
              </dl>

              <p className="cc-line">&ldquo;{card.line}&rdquo;</p>
              <footer className="cc-foot">
                <span>Add the Accent</span>
                <span>The Collectibles &middot; {item.number} / {String(total).padStart(3, "0")}</span>
              </footer>
            </div>
            <span className="cc-glare" aria-hidden="true" />
          </div>

          {/* ---------- back ---------- */}
          <div className="cc-face cc-back" aria-hidden={!flipped} inert={!flipped ? "" : undefined}>
            <div className="cc-inner">
              <header className="cc-top">
                <span className="cc-no">No. {item.number}</span>
                <span className="cc-rarity">Scouting Report</span>
              </header>
              <p className="cc-back-id">{item.identity}</p>
              <h2 className="cc-back-title">{item.essayTitle}</h2>
              {item.intro && <p className="cc-back-intro">{item.intro}</p>}
              <p className="cc-back-blurb">{item.blurb}</p>
              {item.themes && (
                <ul className="cc-tags" aria-label="Themes">
                  {item.themes.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
              <div className="cc-back-actions">
                {item.video && (
                  <TvEmbed video={item.video} linkClassName="cc-btn cc-btn--video" />
                )}
                {published ? (
                  <Link href={item.essayUrl} className="cc-btn">
                    {item.cta || "Read the full essay"} <span aria-hidden="true">&rarr;</span>
                  </Link>
                ) : (
                  <p className="cc-soon">Story Coming Soon</p>
                )}
              </div>
              <footer className="cc-foot">
                <span aria-hidden="true" className="cc-barcode" />
                <span>{item.number} / {String(total).padStart(3, "0")}</span>
              </footer>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 text-center">
        <button type="button" className="cc-flip" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped}>
          {flipped ? "Back to the front" : "Flip the card"} <span aria-hidden="true">&#8635;</span>
        </button>
      </div>
    </section>
  );
}
