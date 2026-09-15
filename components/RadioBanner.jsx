/**
 * Promo for the Apple Music radio station — a glass box (sized to
 * exactly match the voice clip beside it at md+, via the row's
 * md:stretch). On narrow screens the box holds just the banner art
 * (full-bleed overlay) with a plain "Listen now!" line below it; from
 * md up, "Listen now!" moves inside the box, upright, beside the art —
 * the box becomes a two-part row (art filling the remaining space,
 * label at a fixed width) instead of a single full-bleed image.
 */
export default function RadioBanner() {
  return (
    <a
      href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full flex-col items-center gap-2 md:min-w-0 md:flex-1"
    >
      <div className="corner-box on-dark flex h-[5.5rem] w-full items-stretch overflow-hidden rounded-lg border border-white/25 bg-white/10 md:h-auto">
        <div className="relative flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/promo-banner.png"
            alt="Green Maize’s Station — Apple Music radio"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </div>

        {/* md+ only: upright label inside the box, beside the art. */}
        <span className="hidden shrink-0 items-center whitespace-nowrap px-3 font-mono text-xs font-normal uppercase tracking-widest text-white underline-offset-4 transition-colors duration-300 group-hover:text-accent group-hover:underline sm:text-sm md:flex">
          Listen now!
        </span>
      </div>

      {/* Narrow screens only: plain label below the box. */}
      <span className="font-mono text-xs font-normal uppercase tracking-widest text-white underline-offset-4 transition-colors duration-300 group-hover:text-accent group-hover:underline sm:text-sm md:hidden">
        Listen now!
      </span>
    </a>
  );
}
