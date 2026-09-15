/**
 * Promo for the Apple Music radio station — a single pre-composed
 * banner (art + "Green Maize" title + wave mark) in a transparent,
 * gold-framed box, with just a "Listen now!" call to action set beneath
 * it, centered with the art. Sits beside the intro voice clip in a
 * two-column row from md up (flex-1, so it fills whatever width that
 * leaves it), and stacks full-width below it on narrow screens.
 */
export default function RadioBanner() {
  return (
    <a
      href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full flex-col items-center gap-2 md:min-w-0 md:flex-1"
    >
      <div className="w-full max-w-md rounded-lg border-2 border-accent/70 bg-transparent p-3 transition-colors duration-300 group-hover:border-accent sm:max-w-lg md:max-w-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/promo-banner.png"
          alt="Green Maize’s Station — Apple Music radio"
          className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <span className="font-mono text-xs font-normal uppercase tracking-widest text-white underline-offset-4 transition-colors duration-300 group-hover:text-accent group-hover:underline sm:text-sm">
        Listen now!
      </span>
    </a>
  );
}
