import Link from "next/link";

/**
 * The teaser/entry point for "Kenji's Quest: First Light" — sized to
 * fill whatever width its container gives it, which the homepage sets
 * to match the Listen Now tab exactly (same width, directly beneath
 * it, at every breakpoint) so the two read as one connected unit.
 * Styled like the homepage's own Features boxes: the corner-box
 * notebook-line frame, a clean image on top (a "Learn more" tag
 * reveals on hover, same as the Features cards), and the copy in a
 * paper-notebook textured card directly underneath.
 */
export default function KenjiQuestPromo() {
  return (
    <div
      className="corner-box overflow-hidden rounded-xl border border-black/30 shadow-lg"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, rgba(231,222,210,.08) 0, rgba(231,222,210,.08) 1px, transparent 1px, transparent 27px), linear-gradient(to right, transparent 0, transparent 34px, rgba(224,168,96,.4) 34px, rgba(224,168,96,.4) 35px, transparent 35px), linear-gradient(135deg, #b9724a 0%, #6b4028 55%, #3a2415 100%)",
        backgroundRepeat: "repeat, no-repeat, no-repeat",
      }}
    >
      <Link
        href="/kenji-quest"
        className="group relative block overflow-hidden"
        aria-label="Learn more about Kenji's Quest: First Light"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kenji-quest-key-art.jpg"
          alt="Kenji's Quest: First Light — a lone samurai stands atop a jungle island over dark water, the game's title carved into the rock beneath him"
          className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-[#e7ded2] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          Learn more &rarr;
        </span>
      </Link>
      <div className="paper-notebook border-t border-ink/15 bg-white px-4 py-5 text-center">
        <span className="badge-glow block font-mono text-xs font-extrabold uppercase tracking-[0.15em] text-[#af691e]">
          Coming Soon
        </span>
        <p className="mt-2 font-cinema text-[10px] uppercase tracking-wide text-ink">
          Kenji&rsquo;s Quest
        </p>
        <p className="title-glow -mt-1 font-athelas font-bold text-xl leading-tight text-[#8a4412]">
          First Light
        </p>
        <p className="mx-auto mt-2 font-serif text-[11px] italic leading-relaxed text-stone">
          An interactive adventure inspired by the stories of Add the
          Accent.
          <br />
          One traveler. Seven sacred stages. A world waiting to be
          explored.
        </p>
        <Link
          href="/kenji-quest"
          className="group/btn mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-[1.03]"
        >
          Learn More
          <span aria-hidden="true" className="transition-transform duration-200 group-hover/btn:translate-x-0.5">
            &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
}
