/**
 * A small "tab" hanging directly off the bottom of the Now Playing bar,
 * linking to the Apple Music radio station. Centered under the middle of
 * the bar, flush against its own bottom border (no overlap, no gap) so it
 * reads as one continuous piece, and plays a one-shot drop-and-fade
 * entrance (.listen-now-drop, in globals.css) every time this page mounts
 * — i.e. every time you navigate to the home page.
 *
 * Copy borrows the small/BIG/small hierarchy and bold condensed-caps
 * treatment of Apple Music's own promo graphics (e.g. its Super Bowl
 * halftime-show art): a tiny "Apple Music" lockup up top, a short "Continue
 * the vibe" line, then the station name as the one large, unmissable word,
 * framed by two small connecting words. The frame image itself sits solid
 * black (brightness-0); the periodic gleam (.tab-copy-gleam) lives on the
 * copy block instead, and glows on hover.
 */
export default function ListenNowTab() {
  return (
    <div className="listen-now-drop relative z-10 flex justify-center">
      <a
        href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block w-[15.5rem] transition-[filter] duration-300 [filter:drop-shadow(0_0_0_rgba(255,255,255,0))] hover:[filter:drop-shadow(0_0_10px_rgba(255,255,255,0.55))_drop-shadow(0_0_22px_rgba(255,255,255,0.3))] sm:w-[17.5rem]"
      >
        <span className="relative block w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/listen-now-frame.png"
            alt=""
            aria-hidden="true"
            className="block w-full transition-transform duration-500 [filter:brightness(0)_drop-shadow(0_6px_14px_rgba(0,0,0,0.55))] group-hover:scale-[1.02]"
          />
        </span>
        <div className="tab-copy-gleam absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center pb-[30%] pl-[16%] pr-[16%] pt-[9%]">
          {/* Small "Apple Music" lockup, echoing the reference art — nudged
              down from the frame's top edge to leave room to breathe. */}
          <span className="flex items-center gap-1 font-sans text-[7px] font-bold uppercase tracking-wide text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-[8px]">
            <svg
              viewBox="0 0 24 24"
              className="h-[1em] w-[1em] shrink-0"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M16.4 1.4c.1 1-.3 2-.9 2.8-.6.8-1.7 1.4-2.7 1.3-.1-1 .4-2 1-2.7.6-.8 1.7-1.3 2.6-1.4Zm2.6 17.2c-.4.9-.6 1.3-1.1 2.1-.7 1.1-1.7 2.6-2.9 2.6-1.1 0-1.3-.7-2.8-.7s-1.7.7-2.8.7c-1.2 0-2.1-1.3-2.8-2.4-1.9-2.9-2.1-6.4-.9-8.2.8-1.3 2.1-2.1 3.4-2.1 1.2 0 2 .7 3 .7s1.9-.8 3.2-.7c1.1.1 2.3.6 3 1.6-1.9 1.2-2.4 4.4-.3 6.4Z" />
            </svg>
            Music
          </span>

          {/* Short tagline, same small-caps aesthetic, sitting on top of
              the main "through GREEN MAIZE radio" line. */}
          <span className="whitespace-nowrap font-sans text-[7px] font-medium uppercase tracking-wide text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-[8px]">
            Continue the vibe
          </span>

          {/* "through GREEN MAIZE radio" — one line, sized small / BIG / small. */}
          <span className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="font-sans text-[7px] font-medium uppercase tracking-wide text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-[8px]">
              through
            </span>
            <span className="font-display text-[13px] uppercase leading-none text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.9)] sm:text-[15px]">
              Green Maize
            </span>
            <span className="font-sans text-[7px] font-medium uppercase tracking-wide text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-[8px]">
              radio
            </span>
          </span>
        </div>
      </a>
    </div>
  );
}
