/**
 * A small "tab" hanging directly off the bottom of the Now Playing bar,
 * linking to the Apple Music radio station. Centered under the middle of
 * the bar on phones (nudged slightly up into it there too); on desktop
 * it sits at the far left instead, nudged up a bit further. Plays a
 * one-shot drop-and-fade entrance
 * (.listen-now-drop, in globals.css) every time this page mounts — i.e.
 * every time you navigate to the home page.
 *
 * Copy borrows the small/BIG/small hierarchy and bold condensed-caps
 * treatment of Apple Music's own promo graphics: a tiny "Apple Music"
 * lockup up top, a short "Continue the vibe" line, then the station name
 * as the one large, unmissable word, framed by two small connecting
 * words. The frame art (listen-now-frame.png) is already solid
 * black with its own baked-in shadow; the tab glows on its own on a slow
 * cycle (.tab-slow-glow) and holds at full glow for as long as it's
 * hovered. The outer wrapper's clip-path pins a hard boundary at its own
 * (unshifted) top edge — open on every other side — so that glow can
 * never bleed up past where the tab naturally sits and onto whatever's
 * directly above it: the Now Playing bar and header on desktop, or the
 * phone nav menu on mobile (that bar sits between the Now Playing bar
 * and this tab on small screens, so the clip has to hold there too).
 */
export default function ListenNowTab() {
  return (
    <div className="listen-now-drop relative z-10 flex justify-center [clip-path:inset(0_-100vw_-100vw_-100vw)] sm:justify-start sm:pl-6">
      <a
        href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
        target="_blank"
        rel="noopener noreferrer"
        className="tab-slow-glow group relative block w-[17rem] -translate-y-1 transition-transform duration-300 sm:-translate-y-1.5 sm:w-[19.5rem]"
      >
        <span className="relative block w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/listen-now-frame.png"
            alt=""
            aria-hidden="true"
            className="block w-full transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute left-[24%] right-[24%] top-[8%] bottom-[8%] flex flex-col items-center justify-center gap-0.5 text-center">
            {/* Small "Apple Music" lockup, echoing the reference art. */}
            <span className="flex items-center gap-1 font-sans text-[7px] font-bold uppercase tracking-wide text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-[8px]">
              <svg
                viewBox="0 0 24 24"
                className="h-[1.7em] w-[1.7em] shrink-0"
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
              <span className="relative font-sans text-[7px] font-medium uppercase tracking-wide text-transparent sm:text-[8px]">
                through
                {/* A tiny bouncing equalizer, standing in visually for
                    "through" (still here for screen readers, just
                    color:transparent above) — signals "this tab is
                    about music" at a glance, without touching this
                    row's own spacing. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center gap-[2.5px]"
                >
                  <span
                    className="eq-bar h-[10px] w-[2px] rounded-[1px] bg-accent sm:h-[12px]"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="eq-bar h-[10px] w-[2px] rounded-[1px] bg-accent sm:h-[12px]"
                    style={{ animationDelay: "200ms" }}
                  />
                  <span
                    className="eq-bar h-[10px] w-[2px] rounded-[1px] bg-accent sm:h-[12px]"
                    style={{ animationDelay: "400ms" }}
                  />
                  <span
                    className="eq-bar h-[10px] w-[2px] rounded-[1px] bg-accent sm:h-[12px]"
                    style={{ animationDelay: "100ms" }}
                  />
                </span>
              </span>
              <span className="font-display text-[13px] uppercase leading-none text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.9)] sm:text-[15px]">
                Green Maize
              </span>
              <span className="font-sans text-[7px] font-medium uppercase tracking-wide text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-[8px]">
                radio
              </span>
            </span>
          </div>
        </span>
      </a>
    </div>
  );
}
