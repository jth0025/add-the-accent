/**
 * Promo for the Apple Music radio station — a single pre-composed
 * banner (art + "Green Maize" title + wave mark), boxed to match the
 * voice clip beside it (same corner-box glass treatment), with "Listen
 * now!" set beneath it.
 */
export default function RadioBanner() {
  return (
    <a
      href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full flex-col items-center gap-2 md:min-w-0 md:flex-1"
    >
      <div className="corner-box on-dark flex w-full max-w-md items-center justify-center rounded-lg border border-white/25 bg-white/10 p-3 backdrop-blur-sm sm:max-w-lg md:max-w-none">
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
