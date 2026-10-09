import "./records.css";

// A pressed record: grooves, a sheen and a centre label in the
// collection's colour carrying its name and catalog number.
export function VinylDisc({ collection, label, catalog, className = "" }) {
  return (
    <div
      className={`rec-disc ${className}`}
      style={{ "--rec-color": collection.color, "--rec-ink": collection.ink }}
      aria-hidden="true"
    >
      <div className="rec-label">
        <span className="rec-label-name">{label}</span>
        <span className="rec-label-cat">{catalog}</span>
      </div>
    </div>
  );
}

// The sleeve: the cover art fills it edge to edge.
export function Sleeve({ collection, alt = "", className = "", children }) {
  return (
    <div className={`rec-sleeve ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={collection.cover} alt={alt} loading="lazy" />
      {children}
    </div>
  );
}
