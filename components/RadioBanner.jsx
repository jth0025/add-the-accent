/**
 * Promo for the Apple Music radio station — a glass box (sized to
 * exactly match the voice clip beside it, via the row's md:stretch)
 * holding just the banner art as a full-bleed overlay, plus a vertical
 * "Listen now!" label sitting outside the box on its right. The label
 * is still absolutely positioned (not normal flow) so it never affects
 * the box's own height — it's anchored to this wrapping <a>, which has
 * no overflow-hidden of its own (only the inner box does, to clip the
 * art to its rounded corners), so the label can render past the box's
 * edge without being clipped.
 */
export default function RadioBanner() {
  return (
    <a
      href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full h-[5.5rem] pr-12 md:h-auto md:min-w-0 md:flex-1"
    >
      <div className="corner-box on-dark relative h-full w-full overflow-hidden rounded-lg border border-white/25 bg-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/promo-banner.png"
          alt="Green Maize’s Station — Apple Music radio"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </div>
      <span className="absolute right-0 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] font-mono text-xs font-normal uppercase tracking-widest text-white underline-offset-4 transition-colors duration-300 group-hover:text-accent group-hover:underline sm:text-sm">
        Listen now!
      </span>
    </a>
  );
}
