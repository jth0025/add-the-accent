/**
 * Small promo banner for the Apple Music radio station, sized to sit
 * beside (or, on narrow screens, beneath) the intro voice clip. Matches
 * VoiceClip's dark glass-card treatment so the two read as a pair.
 */
export default function RadioBanner() {
  return (
    <a
      href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
      target="_blank"
      rel="noopener noreferrer"
      className="corner-box on-dark group flex w-full items-center gap-3 rounded-lg border border-white/25 bg-white/10 px-3 py-3 text-left backdrop-blur-sm transition-colors hover:bg-white/15 md:max-w-[15rem]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/jt-portrait-1.jpg"
        alt=""
        aria-hidden="true"
        className="h-14 w-14 shrink-0 rounded-md object-cover ring-1 ring-white/25"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-accent">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3 shrink-0"
            aria-hidden="true"
          >
            <path d="M4 15V9" />
            <path d="M9 18V6" />
            <path d="M14 15V9" />
            <path d="M19 18V6" />
          </svg>
          <span className="truncate">Apple Music &middot; Radio</span>
        </div>
        <p className="mt-1 font-hand text-[16px] font-semibold leading-[1.15] text-white/95">
          Continue the wave
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-white/70">
          through{" "}
          <span className="text-white/90">Green Maize&rsquo;s Station</span>
          &nbsp;&mdash;{" "}
          <span className="text-accent underline-offset-2 group-hover:underline">
            follow along
          </span>
        </p>
      </div>
    </a>
  );
}
