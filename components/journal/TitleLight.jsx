// A brass picture light hung over a title (the same fitting as the one over
// "Now showing" on the Museum page). Hover the title and the light comes on,
// throwing a warm cone down over the words; on touch screens, which have no
// hover, it stays on and flickers now and then. Pure CSS (see records.css).
//
//  - coneHeight: how far the light falls (CSS length); by default it covers
//    everything inside, which suits a title.
//  - over: the light is painted over its contents (for lighting a box)
//    instead of behind them.
import "./records.css";

export default function TitleLight({ children, coneHeight, over = false, className = "" }) {
  return (
    <div
      className={`jl group relative mx-auto w-fit max-w-full ${over ? "jl--over" : ""} ${className}`}
      style={coneHeight ? { "--jl-cone-h": coneHeight } : undefined}
    >
      <svg
        viewBox="0 0 160 46"
        aria-hidden="true"
        className="relative z-10 mx-auto block h-10 w-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]"
      >
        <defs>
          <linearGradient id="jl-brass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0d58e" />
            <stop offset="0.35" stopColor="#c79a43" />
            <stop offset="0.7" stopColor="#8a6420" />
            <stop offset="1" stopColor="#5d4113" />
          </linearGradient>
        </defs>
        <rect x="70" y="0" width="20" height="5" rx="2" fill="url(#jl-brass)" />
        <path
          d="M80 5 V13 M80 13 Q80 19 52 21 M80 13 Q80 19 108 21"
          stroke="url(#jl-brass)"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
        />
        <rect x="26" y="19" width="108" height="11" rx="5.5" fill="url(#jl-brass)" />
        <rect x="30" y="21" width="100" height="2" rx="1" fill="#fff3c4" opacity="0.55" />
        <rect x="20" y="21" width="7" height="7" rx="2.5" fill="#6f4f17" />
        <rect x="133" y="21" width="7" height="7" rx="2.5" fill="#6f4f17" />
        {/* the bulb strip: dark, and lit on top of it */}
        <rect x="34" y="29" width="92" height="3.2" rx="1.6" fill="#6d5a2c" />
        <rect className="jl-bulb" x="34" y="29" width="92" height="3.2" rx="1.6" fill="#fff4c8" />
      </svg>
      {/* the cone of light */}
      <span aria-hidden="true" className="jl-cone" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
