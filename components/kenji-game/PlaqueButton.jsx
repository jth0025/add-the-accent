import Link from "next/link";
import "./game-ornaments.css";

// The gold plaque as a button. `nav` marks buttons that take you to
// another screen — those get the light-and-glow hover; plain actions
// (like submitting an answer) only scale.
export default function PlaqueButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  nav = false,
  size = "md",
  href,
  dim = false,
  className = "",
  ...rest
}) {
  const cls = `qo-plaque qo-plaque--${size} ${nav ? "qo-plaque--nav" : ""} ${
    dim ? "qo-plaque--dim" : ""
  } ${className}`;
  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/kenji-ui/enter-plaque.webp" alt="" draggable={false} />
      <span className="qo-plaque-sheen" aria-hidden="true" />
      <span className="qo-plaque-text">{children}</span>
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls} {...rest}>
        {inner}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      {...rest}
    >
      {inner}
    </button>
  );
}
