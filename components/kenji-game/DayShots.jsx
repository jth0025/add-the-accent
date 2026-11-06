"use client";

import PlaqueButton from "./PlaqueButton";

/* The two full-screen shots every Day opens and closes with, and the rank
   picker and the "Day N of M" line they share. Days Four to Seven use these;
   they are the same markup as Days Two and Three's. */

export function Prelude({ cls = "", art, alt, kicker, h1, dayname, era, button, ready, on, leaving, enterRef, onEnter, label }) {
  return (
    <section className={`d1-shot ${cls}${on ? " on" : ""}${leaving ? " leaving" : ""}`} aria-label={label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="d1-shot-img" src={art} alt={alt} />
      <div className="d1-shot-shade" />
      <div className="d1-shot-title">
        <p className="d1-kicker">{kicker}</p>
        <h1>{h1}</h1>
        {dayname ? <p className="dayname">{dayname}</p> : null}
        <p className="era">{era}</p>
        <div ref={enterRef} className={`d1-reveal-btn${ready ? " show" : ""}`}>
          <PlaqueButton nav size="xl" disabled={!ready} onClick={onEnter}>
            {button}
          </PlaqueButton>
        </div>
      </div>
    </section>
  );
}

export function Finale({ cls = "", art, alt, kicker, title, era, kan = true, on, titled, leaving, onContinue, label }) {
  return (
    <section className={`d1-shot d1-finale ${cls}${on ? " on" : ""}${titled ? " titled" : ""}${leaving ? " leaving" : ""}`} aria-label={label}>
      <div className="d1-shot-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="d1-shot-fill" src={art} alt={alt} />
      </div>
      <div className="d1-shot-shade" />
      <div className="d1-shot-title">
        <p className="d1-kicker">{kicker}</p>
        <div className="d1-fin-head">
          <h1>{title}</h1>
          {kan ? (
            <span className="d1-kan" lang="ja" role="img" aria-label="Complete (kan)">
              完
            </span>
          ) : null}
        </div>
        <p className="era" style={{ marginBottom: 18 }}>
          {era}
        </p>
        <PlaqueButton nav size="xl" className="d1-fin-continue" onClick={onContinue}>
          Continue
        </PlaqueButton>
      </div>
    </section>
  );
}

export function RankPicker({ ranks, value, onPick }) {
  return (
    <div className="d2-ranks" role="radiogroup" aria-label="Rank">
      {Object.entries(ranks).map(([k, r]) => (
        <button key={k} type="button" role="radio" aria-checked={value === k} className="d2-ghost" onClick={() => onPick(k)}>
          {r.label}
        </button>
      ))}
    </div>
  );
}
