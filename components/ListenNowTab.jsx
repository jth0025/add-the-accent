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
    <div className="listen-now-drop relative z-10 -mt-3 pl-4 sm:-mt-4 sm:pl-6">
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
        <div className="absolute inset-y-0 left-[9%] right-[30%] flex flex-col justify-center">
          <span className="block font-sans text-[13px] font-light leading-tight tracking-[0.06em] text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.9)] sm:text-[15px]">
            Continue the{" "}
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              wave
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/wave-icon.png"
                alt=""
                aria-hidden="true"
                className="h-[0.7em] w-auto"
              />
            </span>
          </span>
          <span className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[#ffc37a] [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-[10px]">
            with Green Maize Radio
          </span>
        </div>
      </a>
    </div>
  );
}
