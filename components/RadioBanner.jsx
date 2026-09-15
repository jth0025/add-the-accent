/**
 * Promo for the Apple Music radio station — a single glass box, sized
 * to exactly match the voice clip beside it (via the row's md:stretch
 * and this box having no explicit height of its own, so flexbox sizes
 * it to the row's cross size). The banner art is an absolutely
 * positioned overlay filling that box (object-cover, cropping as
 * needed) rather than sizing the box itself, and "Listen now!" is a
 * vertical label pinned to the box's right edge — both are taken out of
 * normal flow so neither one drives the box's own height.
 */
export default function RadioBanner() {
  return (
    <a
      href="https://music.apple.com/us/station/green-maizes-station/ra.u-4a3a814146791beb1abb70ff757aa95f"
      target="_blank"
      rel="noopener noreferrer"
      className="group corner-box on-dark relative flex w-full min-h-[5.5rem] overflow-hidden rounded-lg border border-white/25 bg-white/10 md:min-h-0 md:min-w-0 md:flex-1"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/promo-banner.png"
        alt="Green Maize’s Station — Apple Music radio"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
      />
      <span
        className="absolute right-2 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] font-mono text-xs font-normal uppercase tracking-widest text-white underline-offset-4 transition-colors duration-300 [text-shadow:0_1px_4px_rgba(0,0,0,0.8)] group-hover:text-accent group-hover:underline sm:text-sm"
      >
        Listen now!
      </span>
    </a>
  );
}
