/**
 * A small "tab" hanging off the bottom of the header, linking to the
 * Apple Music radio station. Sits at the far left, overlapping the Now
 * Playing bar above it slightly so the two read as one attached piece,
 * and plays a one-shot drop-and-fade entrance (.listen-now-drop, in
 * globals.css) every time this page mounts — i.e. every time you
 * navigate to the home page — rather than looping. The periodic glare
 * (.glare-periodic) is scoped to just the gold frame image, not the
 * text sitting over it.
 */
export default function ListenNowTab() {
  return (
    <div className="listen-now-drop relative z-10 -mt-1 pl-4 sm:-mt-1.5 sm:pl-6">
      <a
        href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block w-64 sm:w-72"
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
        <div className="absolute inset-y-0 left-[8%] right-[22%] flex min-h-0 flex-col justify-center overflow-hidden">
          <span className="flex items-center gap-1 whitespace-nowrap font-sans text-[9px] font-light uppercase tracking-[0.04em] text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.9)] sm:text-[11px]">
            Continue the wave
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/wave-icon.png"
              alt=""
              aria-hidden="true"
              className="h-[0.8em] w-auto shrink-0"
            />
          </span>
          <span className="mt-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-[#ffc37a] [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-[12px]">
            with Green Maize Radio
          </span>
        </div>
      </a>
    </div>
  );
}
