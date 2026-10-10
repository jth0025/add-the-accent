import Link from "next/link";
import "./kenji-quest-promo.css";

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
    <div>
      {/* The shelf this card sits on: the site's games. */}
      <h2 className="kq-games kq-stone mb-3 rounded-xl border border-black/30 shadow-lg">
        <span className="kq-games-text">Games</span>
        <span aria-hidden="true" className="kq-games-rule" />
      </h2>
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
        aria-label="Enter Kenji's Quest: First Light"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kenji-quest-key-art.jpg"
          alt="Kenji's Quest: First Light — a lone samurai stands atop a jungle island over dark water, the game's title carved into the rock beneath him"
          className="block h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </Link>
      <div className="kq-stone border-t border-black/50 px-3 pb-3.5 pt-3 text-center">
        {/* The logo carries a slow gold gleam, masked to its own letters. */}
        <div className="kq-title-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kenji-game/title-mark.webp"
            alt="Kenji's Quest: First Light"
            className="kq-title"
          />
          <span aria-hidden="true" className="kq-title-gleam" />
        </div>
        <p className="kq-tagline mx-auto -mt-2 font-serif italic">
          <span className="block">An interactive adventure</span>
          <span className="block">Powered by</span>
          <span className="kq-brand block">Add the Accent</span>
        </p>
        <Link
          href="/kenji-quest"
          aria-label="Enter Kenji's Quest: First Light"
          className="kq-enter"
          style={{ containerType: "inline-size" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kenji-ui/enter-plaque.webp" alt="" />
          <span className="kq-enter-text">Enter</span>
        </Link>
      </div>
    </div>
    </div>
  );
}
