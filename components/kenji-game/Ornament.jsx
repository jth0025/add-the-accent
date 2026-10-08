import "./game-ornaments.css";

// A gold ornament with a light gleam masked to its own shape, so only
// the gold ever catches the light.
export default function Ornament({ src, className = "", delay = 0 }) {
  return (
    <span
      aria-hidden="true"
      className={`qo-orn ${className}`}
      style={{ "--qo-delay": `${delay}s`, "--orn": `url(${src})` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" />
      <span className="qo-orn-gleam" />
    </span>
  );
}
