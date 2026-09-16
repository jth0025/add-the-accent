/**
 * A small "tab" hanging off the bottom of the header, linking to the
 * Apple Music radio station. Sits at the far left, overlapping the Now
 * Playing bar above it slightly, and plays a one-shot drop-and-fade
 * entrance (.listen-now-drop, in globals.css) every time this page
 * mounts — i.e. every time you navigate to the home page.
 *
 * Copy borrows the small/BIG/small hierarchy and bold condensed-caps
 * treatment of Apple Music's own promo graphics (e.g. its Super Bowl
 * halftime-show art): a tiny "Apple Music" lockup up top, then the
 * station name as the one large, unmissable word, framed by two small
 * connecting words. The periodic glare (.glare-periodic) is scoped to
 * just the frame image — and since it's a mix-blend-mode overlay, the
 * math itself keeps it visible on the frame's bright gold sections and
 * all but invisible on the dark ones, without needing separate masking.
 */
export default function ListenNowTab() {
  return (
    <div className="listen-now-drop relative z-10 -mt-1 pl-4 sm:-mt-1.5 sm:pl-6">
      <a
        href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block w-[19rem] sm:w-[22rem]"
      >
        <span className="glare-periodic relative block w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/listen-now-frame.png"
            alt=""
            aria-hidden="true"
            className="block w-full transition-transform duration-500 [filter:drop-shadow(0_6px_14px_rgba(0,0,0,0.55))] group-hover:scale-[1.02]"
          />
        </span>
        <div className="absolute inset-0 flex flex-col items-start justify-center gap-1 pb-[16%] pl-[7%] pr-[16%] pt-[10%]">
          {/* Small "Apple Music" lockup, echoing the reference art. */}
          <span className="flex items-center gap-1 font-sans text-[9px] font-bold uppercase tracking-wide text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-[10px]">
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

          {/* "through GREEN MAIZE radio" — one line, sized small / BIG / small. */}
          <span className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="font-sans text-[9px] font-medium uppercase tracking-wide text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-[10px]">
              through
            </span>
            <span className="font-display text-[17px] uppercase leading-none text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.9)] sm:text-[20px]">
              Green Maize
            </span>
            <span className="font-sans text-[9px] font-medium uppercase tracking-wide text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-[10px]">
              radio
            </span>
          </span>
        </div>
      </a>
    </div>
  );
}
