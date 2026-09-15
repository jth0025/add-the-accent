/**
 * Promo for the Apple Music radio station — a glass box (sized to
 * exactly match the voice clip beside it at md+, via the row's
 * md:stretch) holding just the banner art as a full-bleed overlay.
 * "Listen now!" renders two ways: a plain horizontal line under the
 * box on narrow screens, and — from md up — a vertical label sitting
 * outside the box on its right (absolutely positioned so it never
 * affects the box's own height).
 */
export default function RadioBanner() {
  return (
    <a
      href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full flex-col items-center gap-2 md:h-auto md:min-w-0 md:flex-1 md:flex-row md:items-stretch md:gap-0 md:pr-12"
    >
      <div className="corner-box on-dark relative h-[5.5rem] w-full overflow-hidden rounded-lg border border-white/25 bg-white/10 md:h-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/promo-banner.png"
          alt="Green Maize’s Station — Apple Music radio"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </div>

      {/* Narrow screens: plain label below the box. */}
      <span className="font-mono text-xs font-normal uppercase tracking-widest text-white underline-offset-4 transition-colors duration-300 group-hover:text-accent group-hover:underline sm:text-sm md:hidden">
        Listen now!
      </span>

      {/* md+: vertical label outside the box, flipped so "Listen"
          reads nearest the box rather than "now!". */}
      <span className="hidden font-mono text-xs font-normal uppercase tracking-widest text-white underline-offset-4 transition-colors duration-300 group-hover:text-accent group-hover:underline sm:text-sm md:absolute md:right-0 md:top-1/2 md:block md:[writing-mode:vertical-rl] md:rotate-180 md:-translate-y-1/2">
        Listen now!
      </span>
    </a>
  );
}
