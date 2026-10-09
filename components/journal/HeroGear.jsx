// Studio kit drawn faintly around the Journal hero's main art — a boom mic
// on its stand, a pop filter, a small mixer, a monitor speaker and a pair
// of headphones on a hook, joined by loose cable. Hand-sketched line work
// at a low opacity so it sets the scene (these essays are pressed like
// records) without competing with the character at the desk.
export default function HeroGear() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 760 380"
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none absolute inset-0 h-full w-full text-[#3a2a16] opacity-[0.2] [filter:url(#urban-sketch)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ---- Boom mic stand, left ---- */}
      <g>
        {/* tripod base */}
        <path d="M118 372 L96 372 M118 372 L140 372 M118 372 L118 356" />
        <path d="M118 356 L82 372 M118 356 L154 372" />
        {/* upright */}
        <path d="M118 356 V150" strokeWidth="5" />
        {/* clutch */}
        <rect x="108" y="140" width="20" height="16" rx="3" fill="currentColor" fillOpacity="0.25" />
        {/* the boom arm, reaching in over the desk */}
        <path d="M118 148 L262 62" strokeWidth="5" />
        {/* counterweight */}
        <rect x="76" y="156" width="34" height="18" rx="4" transform="rotate(-30 93 165)" fill="currentColor" fillOpacity="0.3" />
        {/* shock mount + large-diaphragm mic */}
        <g transform="rotate(-30 268 66)">
          <ellipse cx="268" cy="66" rx="9" ry="26" />
          <rect x="258" y="42" width="20" height="48" rx="10" fill="currentColor" fillOpacity="0.2" />
          <path d="M258 52 H278 M258 60 H278 M258 68 H278 M258 76 H278" strokeWidth="2" />
          <path d="M250 40 Q268 22 286 40 M250 92 Q268 110 286 92" strokeWidth="2.5" />
        </g>
      </g>

      {/* ---- Pop filter on a gooseneck, left of centre ---- */}
      <g>
        <path d="M205 345 C 222 300, 168 270, 188 214" strokeWidth="4" />
        <circle cx="190" cy="188" r="30" fill="currentColor" fillOpacity="0.08" />
        <circle cx="190" cy="188" r="22" strokeWidth="2" />
        <path d="M168 188 H212 M190 166 V210 M174 172 L206 204 M206 172 L174 204" strokeWidth="1.5" />
      </g>

      {/* ---- Little mixing desk, bottom left ---- */}
      <g>
        <path d="M24 372 H178 L190 332 H36 Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M58 360 V344 M84 360 V344 M110 360 V344 M136 360 V344" strokeWidth="2.5" />
        <rect x="54" y="350" width="8" height="5" fill="currentColor" />
        <rect x="80" y="346" width="8" height="5" fill="currentColor" />
        <rect x="106" y="353" width="8" height="5" fill="currentColor" />
        <rect x="132" y="348" width="8" height="5" fill="currentColor" />
        <circle cx="62" cy="337" r="3.5" />
        <circle cx="96" cy="337" r="3.5" />
        <circle cx="130" cy="337" r="3.5" />
      </g>

      {/* ---- Monitor speaker, right ---- */}
      <g>
        <rect x="580" y="214" width="118" height="158" rx="10" fill="currentColor" fillOpacity="0.1" />
        <circle cx="639" cy="262" r="15" />
        <circle cx="639" cy="262" r="6" fill="currentColor" fillOpacity="0.35" />
        <circle cx="639" cy="324" r="29" />
        <circle cx="639" cy="324" r="19" strokeWidth="2" />
        <circle cx="639" cy="324" r="8" fill="currentColor" fillOpacity="0.35" />
        {/* stand */}
        <path d="M612 372 H666 M639 372 V380" />
      </g>

      {/* ---- Headphones hanging from a hook, top right ---- */}
      <g>
        <path d="M640 0 V28" />
        <path d="M640 28 q-10 0 -10 10" />
        <path d="M588 120 C 588 62, 692 62, 692 120" strokeWidth="5" />
        <rect x="574" y="112" width="26" height="46" rx="12" fill="currentColor" fillOpacity="0.28" />
        <rect x="680" y="112" width="26" height="46" rx="12" fill="currentColor" fillOpacity="0.28" />
        <path d="M580 128 H594 M580 138 H594 M686 128 H700 M686 138 H700" strokeWidth="2" />
      </g>

      {/* ---- Cable, running between it all ---- */}
      <path d="M118 372 C 60 392, 40 330, 100 336" strokeWidth="2.5" strokeDasharray="1 7" />
      <path d="M178 360 C 300 392, 440 396, 580 340" strokeWidth="2.5" />
      <path d="M270 90 C 330 150, 232 190, 252 248 C 266 296, 214 330, 190 340" strokeWidth="2.5" />

      {/* ---- A couple of small things: a second mic on a short stand, right */}
      <g>
        <path d="M534 372 H566 M550 372 V312" strokeWidth="4" />
        <rect x="538" y="268" width="24" height="46" rx="12" fill="currentColor" fillOpacity="0.22" />
        <path d="M538 280 H562 M538 288 H562 M538 296 H562" strokeWidth="2" />
      </g>
    </svg>
  );
}
