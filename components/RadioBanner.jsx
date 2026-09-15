/**
 * Promo for the Apple Music radio station — a single pre-composed
 * banner (art + "Green Maize" title + wave mark) with just a "Listen
 * now!" call to action set beneath it, centered with the art. On hover
 * the banner catches the same gold gleam as the "perspective" callout
 * in the hero heading (.gold-foil) — that trick clips a moving
 * highlight to text, which an image can't use, so here it's the
 * image-equivalent .bronze-glare sweep instead, in the same bronze/gold
 * tones, triggered by hover rather than running on a timer.
 */
export default function RadioBanner() {
  return (
    <a
      href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full flex-col items-center gap-2"
    >
      <div className="relative w-full max-w-sm overflow-hidden sm:max-w-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/promo-banner.png"
          alt="Green Maize’s Station — Apple Music radio"
          className="relative w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="bronze-glare" aria-hidden="true" />
      </div>
      <span className="font-mono text-sm font-semibold uppercase tracking-widest text-accent underline-offset-4 group-hover:underline sm:text-base">
        Listen now!
      </span>
    </a>
  );
}
