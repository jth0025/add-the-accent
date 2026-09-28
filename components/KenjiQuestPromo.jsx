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
        className="group relative block aspect-[16/9] overflow-hidden"
        aria-label="Learn more about Kenji's Quest: First Light"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kenji-quest-key-art.jpg"
          alt="Kenji's Quest: First Light — a lone samurai stands atop a jungle island over dark water, the game's title carved into the rock beneath him"
          className="absolute inset-0 h-full w-full object-cover object-[center_38%] transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <span className="pointer-events-none absolute bottom-1.5 right-1.5 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest text-[#e7ded2] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          Learn more &rarr;
        </span>
      </Link>
      <div className="paper-notebook border-t border-ink/15 bg-white px-3 py-2.5 text-center">
        <span className="badge-glow block font-mono text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#af691e]">
          Coming Soon
        </span>
        <p className="font-cinema text-[9px] uppercase tracking-wide text-ink">
          Kenji&rsquo;s Quest
        </p>
        <p className="title-glow -mt-0.5 font-athelas font-bold text-lg leading-none text-[#8a4412]">
          First Light
        </p>
        <p className="mx-auto mt-1 font-serif text-[10px] italic leading-snug text-stone">
          An interactive adventure inspired by Add the Accent.
        </p>
        <Link
          href="/kenji-quest"
          className="group/btn mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-[1.03]"
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
