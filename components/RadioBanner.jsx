/**
 * Promo for the Apple Music radio station — a single pre-composed
 * banner (art + "Green Maize" title + wave mark) with just a "Listen
 * now!" call to action set beneath it, centered with the art.
 */
export default function RadioBanner() {
  return (
    <a
      href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full flex-col items-center gap-2"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/promo-banner.png"
        alt="Green Maize’s Station — Apple Music radio"
        className="w-full max-w-sm transition-transform duration-500 group-hover:scale-[1.03] sm:max-w-md"
      />
      <span className="font-mono text-sm font-semibold uppercase tracking-widest text-accent underline-offset-4 group-hover:underline sm:text-base">
        Listen now!
      </span>
    </a>
  );
}
