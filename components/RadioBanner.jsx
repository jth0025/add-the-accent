/**
 * Small promo for the Apple Music radio station, sized to sit beside
 * (or, on narrow screens, beneath) the intro voice clip. No card frame —
 * the station art floats on a soft glow, with the copy set like a
 * cinematic title card rather than a boxed link.
 */
export default function RadioBanner() {
  return (
    <a
      href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full items-center gap-4 text-left md:max-w-[17rem]"
    >
      <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
        {/* White sunburst behind the art. Bottom-anchored (not centered)
            so it can flare out past the top and sides but its own lower
            edge never crosses the artwork's bottom edge. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/sunburst.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1/2 bottom-0 w-[190%] max-w-none -translate-x-1/2 opacity-90 transition-transform duration-500 group-hover:scale-105"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/playlist-art.png"
          alt=""
          aria-hidden="true"
          className="relative h-full w-full object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
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
        <p className="mt-1 font-serif text-xl italic leading-[1.2] text-white [text-shadow:0_3px_14px_rgba(0,0,0,0.65)] sm:text-2xl">
          Continue the{" "}
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            wave
            {/* White stencil wave icon, facing right — two even swells
                running into a small curling crest at the tail. */}
            <svg
              viewBox="0 0 28 16"
              fill="none"
              aria-hidden="true"
              className="h-3.5 w-6 shrink-0 not-italic sm:h-4 sm:w-7"
            >
              <path
                d="M1 11c2.2 0 2.2-5 4.5-5s2.3 5 4.5 5 2.3-5 4.5-5c1.7 0 2.8 1.2 3.2 2.6"
                stroke="white"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7 8.6c1.7-.9 3.6-.1 3.9 1.7.3 1.8-1.1 3.4-3 3.6"
                stroke="white"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </p>
        <p className="mt-1 text-[11px] leading-snug text-white/70">
          through <span className="text-white/90">Green Maize&rsquo;s Station</span>
        </p>
        <span className="mt-1.5 block text-center font-mono text-xs font-semibold uppercase tracking-widest text-accent underline-offset-4 group-hover:underline">
          Listen now!
        </span>
      </div>
    </a>
  );
}
