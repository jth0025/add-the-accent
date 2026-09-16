/**
 * A small "tab" hanging off the bottom of the header, linking to the
 * Apple Music radio station. Sits at the far left, flush against the
 * Now Playing bar above it, and plays a one-shot drop-and-fade entrance
 * (.listen-now-drop, in globals.css) every time this page mounts —
 * i.e. every time you navigate to the home page — rather than looping.
 */
export default function ListenNowTab() {
  return (
    <div className="listen-now-drop pl-4 pt-2 sm:pl-6">
      <a
        href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
        target="_blank"
        rel="noopener noreferrer"
        className="group glare-periodic relative block w-64 sm:w-72"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/listen-now-frame.png"
          alt=""
          aria-hidden="true"
          className="block w-full transition-transform duration-500 [filter:drop-shadow(0_6px_14px_rgba(0,0,0,0.55))] group-hover:scale-[1.02]"
        />
        <div className="absolute inset-y-0 left-[9%] right-[30%] flex flex-col justify-center">
          <span className="font-cinema text-[13px] leading-tight tracking-wide text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.9)] sm:text-[15px]">
            CONTINUE THE WAVE
          </span>
          <span className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.14em] text-[#ffc37a] [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-[10px]">
            with Green Maize Radio
          </span>
        </div>
      </a>
    </div>
  );
}
