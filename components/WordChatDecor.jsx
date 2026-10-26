// The little illustrations that frame the sentence wall: a leafy plant
// growing out of an apple on the left, two pencils among more leaves (and a
// small apple) on the right. Drawn in the same thin dark line and soft grey
// shading as the reference. The leaves sway a little.

const INK = "#23262e";

function Defs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-l1`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#dcdddf" />
      </linearGradient>
      <linearGradient id={`${id}-l2`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#eceded" />
        <stop offset="1" stopColor="#a6a8ac" />
      </linearGradient>
      <linearGradient id={`${id}-l3`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9a9ca1" />
        <stop offset="1" stopColor="#4a4d55" />
      </linearGradient>
      <radialGradient id={`${id}-apple`} cx="0.38" cy="0.32" r="0.8">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.7" stopColor="#e4e5e6" />
        <stop offset="1" stopColor="#bfc1c4" />
      </radialGradient>
      <linearGradient id={`${id}-pen`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.55" stopColor="#ececed" />
        <stop offset="1" stopColor="#b9bbbf" />
      </linearGradient>
    </defs>
  );
}

// An almond-shaped leaf growing from (x, y), tilted `rot` degrees, with a
// midrib and a few veins.
function Leaf({ id, x, y, len, w, rot, shade = 1, delay = 0 }) {
  const d = `M0 0 C ${w * 0.7} ${-len * 0.2} ${w * 0.55} ${-len * 0.8} 0 ${-len} C ${-w * 0.55} ${-len * 0.8} ${-w * 0.7} ${-len * 0.2} 0 0 Z`;
  const veins = [0.3, 0.5, 0.7].map((t) => {
    const vy = -len * t;
    return `M0 ${vy} L ${w * 0.42} ${vy - len * 0.14} M0 ${vy} L ${-w * 0.42} ${vy - len * 0.14}`;
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <g className="wcd-sway" style={{ animationDelay: `${delay}s` }}>
        <path d={d} fill={`url(#${id}-l${shade})`} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
        <path d={`M0 0 L0 ${-len * 0.92}`} stroke={INK} strokeWidth="1.1" fill="none" />
        <path d={veins.join(" ")} stroke={INK} strokeWidth="0.9" fill="none" opacity="0.7" />
      </g>
    </g>
  );
}

function Apple({ id, x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M50 14 C 28 6 4 22 4 52 C 4 82 26 100 50 94 C 74 100 96 82 96 52 C 96 22 72 6 50 14 Z"
        fill={`url(#${id}-apple)`}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M22 40 C 24 30 32 24 40 22" stroke={INK} strokeWidth="1.2" fill="none" opacity="0.5" strokeLinecap="round" />
      <path d="M50 14 C 50 8 52 3 57 -2" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      <g className="wcd-sway" style={{ animationDelay: "0.4s" }}>
        <path d="M54 4 C 66 -8 82 -6 86 2 C 76 10 62 10 54 4 Z" fill={`url(#${id}-l1)`} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M56 4 L 78 -1" stroke={INK} strokeWidth="0.9" fill="none" />
      </g>
    </g>
  );
}

function Pencil({ id, x, y, h, rot = 0 }) {
  const w = 22;
  const tip = 30;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {/* wood cone and graphite point */}
      <path d={`M0 ${tip} L ${w / 2} 0 L ${w} ${tip} Z`} fill="#efede7" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d={`M${w / 2 - 3.2} 9.6 L ${w / 2} 0 L ${w / 2 + 3.2} 9.6 Z`} fill={INK} />
      {/* body */}
      <rect x="0" y={tip} width={w} height={h - tip - 24} fill={`url(#${id}-pen)`} stroke={INK} strokeWidth="1.5" />
      <path d={`M${w / 2} ${tip} L ${w / 2} ${h - 24}`} stroke={INK} strokeWidth="0.9" opacity="0.45" />
      {/* metal band and eraser */}
      <rect x="0" y={h - 24} width={w} height="9" fill="#8e9094" stroke={INK} strokeWidth="1.5" />
      <path d={`M0 ${h - 21} H ${w} M0 ${h - 18} H ${w}`} stroke={INK} strokeWidth="0.8" opacity="0.6" />
      <rect x="0" y={h - 15} width={w} height="15" rx="3" fill="#d7d8da" stroke={INK} strokeWidth="1.5" />
    </g>
  );
}

function Grass({ x, y, n = 7, spread = 70 }) {
  const blades = Array.from({ length: n }, (_, i) => {
    const bx = x + (i / (n - 1)) * spread;
    const lean = (i - (n - 1) / 2) * 3.2;
    const hgt = 14 + ((i * 7) % 5) * 3;
    return `M${bx} ${y} Q ${bx + lean * 0.4} ${y - hgt * 0.6} ${bx + lean} ${y - hgt}`;
  });
  return <path d={blades.join(" ")} stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />;
}

export function PlantLeft() {
  const id = "wcdl";
  return (
    <svg viewBox="0 0 200 230" className="wcd wcd--left" aria-hidden="true" focusable="false">
      <Defs id={id} />
      {/* leaves, back to front */}
      <Leaf id={id} x={92} y={150} len={118} w={34} rot={-8} shade={1} delay={0.0} />
      <Leaf id={id} x={96} y={152} len={104} w={30} rot={-38} shade={2} delay={0.6} />
      <Leaf id={id} x={92} y={154} len={96} w={32} rot={-66} shade={1} delay={1.1} />
      <Leaf id={id} x={100} y={150} len={92} w={28} rot={24} shade={3} delay={0.3} />
      <Leaf id={id} x={104} y={156} len={74} w={24} rot={52} shade={2} delay={0.9} />
      <Leaf id={id} x={88} y={158} len={70} w={22} rot={-92} shade={2} delay={1.4} />
      {/* a sprig with buds */}
      <path d="M26 214 C 30 190 36 176 44 168" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <ellipse cx="47" cy="165" rx="4" ry="8" transform="rotate(30 47 165)" fill={`url(#${id}-l2)`} stroke={INK} strokeWidth="1.2" />
      <ellipse cx="36" cy="178" rx="3.4" ry="6.5" transform="rotate(-24 36 178)" fill={`url(#${id}-l1)`} stroke={INK} strokeWidth="1.2" />
      <Apple id={id} x={64} y={150} s={0.95} />
      <Grass x={6} y={226} n={9} spread={120} />
      <path d="M0 227 H 200" stroke={INK} strokeWidth="1.6" />
    </svg>
  );
}

export function PlantRight() {
  const id = "wcdr";
  return (
    <svg viewBox="0 0 240 260" className="wcd wcd--right" aria-hidden="true" focusable="false">
      <Defs id={id} />
      <Leaf id={id} x={118} y={236} len={150} w={40} rot={-16} shade={3} delay={0.2} />
      <Leaf id={id} x={150} y={236} len={120} w={36} rot={34} shade={2} delay={0.8} />
      <Leaf id={id} x={150} y={238} len={100} w={34} rot={66} shade={1} delay={1.2} />
      <Leaf id={id} x={104} y={238} len={96} w={30} rot={-50} shade={2} delay={0.5} />
      <Leaf id={id} x={170} y={240} len={72} w={22} rot={92} shade={2} delay={1.6} />
      {/* thin sprigs */}
      <path d="M176 232 C 190 190 204 160 218 142" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M200 168 C 210 160 222 156 236 156" stroke={INK} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M218 142 C 214 130 216 120 224 112 C 230 122 228 134 218 142 Z" fill={`url(#${id}-l1)`} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      {/* the pencils */}
      <Pencil id={id} x={78} y={46} h={192} rot={0} />
      <Pencil id={id} x={104} y={30} h={208} rot={0} />
      <Apple id={id} x={10} y={190} s={0.66} />
      <Grass x={92} y={254} n={9} spread={120} />
      <path d="M0 255 H 240" stroke={INK} strokeWidth="1.6" />
    </svg>
  );
}

// One apple on its own, for sitting on top of the Word of the Day box.
export function AppleSolo({ className = "" }) {
  const id = "wcda";
  return (
    <svg viewBox="-4 -16 108 120" className={className} aria-hidden="true" focusable="false">
      <Defs id={id} />
      <Apple id={id} x={0} y={0} s={1} />
    </svg>
  );
}
