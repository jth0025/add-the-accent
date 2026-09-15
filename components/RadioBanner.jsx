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
      className="group flex w-full items-start gap-4 text-left md:w-auto"
    >
      {/* Sized to match the text column's own natural height (measured
          in-layout: ~122px on a narrow phone width, ~91px once the
          "Apple Music · Radio" eyebrow has room to sit on one line)
          rather than a flex-stretch percentage — percentage heights on
          an img don't resolve against a stretched, otherwise-auto flex
          container, so that route just renders the image at its full
          intrinsic size instead of matching. */}
      <div className="relative h-[107px] w-auto shrink-0 sm:h-[91px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/playlist-art.png"
          alt=""
          aria-hidden="true"
          className="relative h-full w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {/* Bronze gleam, sweeping bottom to top on hover. */}
        <span className="bronze-glare-vertical" aria-hidden="true" />
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/wave-icon.png"
              alt=""
              aria-hidden="true"
              className="h-4 w-auto shrink-0 not-italic sm:h-5"
            />
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
