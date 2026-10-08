import DesignEditorial from "@/components/DesignEditorial";
import DesignGallery from "@/components/DesignGallery";
import DesignInfluencers from "@/components/DesignInfluencers";
import GoldSparkle from "@/components/GoldSparkle";
import KoiLayer from "@/components/KoiLayer";
import "./design.css";

export const metadata = { title: "The Museum — Add the Accent" };

// Re-render at least every few hours so the weekly influencer pair flips
// on time even though the rest of the page is static.
export const revalidate = 21600;

export default function DesignPage() {
  return (
    <div className="relative overflow-x-clip">
      <KoiLayer />
      <GoldSparkle />
      <div className="mx-auto max-w-[1240px] px-3 pt-16 sm:px-5">
        {/* The art box and the index card beneath it share one outline, so
            the card reads as the box's own lower tab. */}
        <section data-koi-avoid className="corner-box rounded-xl border border-ink/15 bg-card">
          <div className="paper-notebook rounded-t-xl px-3 pb-4 pt-8 text-center sm:px-6 sm:pt-9">
            <div className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent sm:text-xs sm:tracking-[0.28em]">
              <span className="hidden h-px w-8 bg-accent/40 sm:block" />
              <span>Design &middot; Photography &middot; Motion</span>
              <span className="hidden h-px w-8 bg-accent/40 sm:block" />
            </div>

            {/* The title is set into the picture itself, level with the
                figure's head and centred over the tallest pedestal (on
                phones, where that is too small to read, it sits above the
                picture instead). */}
            <div className="relative mt-5 flex flex-col-reverse gap-5 md:block">
              <div className="relative">
                <img
                  src="/design/hero-pillars.jpg"
                  alt="A small wooden figure with a raised fist stands on the left of three concrete pedestals in a gallery niche"
                  className="block w-full rounded-sm"
                />
                {/* The J.T. signature, laid across the front pedestal at
                    the lower right, faint like a stamp on the concrete. */}
                <img
                  src="/design/jt-signature-mark.png"
                  alt="J.T. signature"
                  className="pointer-events-none absolute left-[58.5%] top-[78.6%] w-[13.5%] rotate-[12deg] opacity-40 mix-blend-multiply"
                />
              </div>
              <h1 className="normal-case leading-[0.95] tracking-tighter text-ink md:absolute md:left-[40.8%] md:top-[25.5%] md:w-[26.6%] md:-translate-y-1/2 md:text-left md:[container-type:inline-size]">
                <span className="block font-playfair text-[1.65rem] font-bold not-italic min-[400px]:text-3xl sm:text-5xl md:text-[10cqw]">
                  Different <span className="gold-foil">mediums</span>.
                </span>
                <span className="relative left-[0.55em] block font-playfair text-[1.65rem] font-bold not-italic min-[400px]:text-3xl sm:text-5xl md:text-[10cqw]">
                  Same <span className="gold-foil">signature</span>.
                </span>
              </h1>
            </div>
          </div>

          <div className="museum-card rounded-b-xl px-5 py-6 sm:px-10 sm:py-7">
            <p className="museum-card-text mx-auto max-w-3xl font-hand text-[1.5rem] text-[#2b2a26] sm:text-[2.1rem]">
              <strong className="font-bold">The Museum</strong> is an evolving
              collection of{" "}
              <strong className="font-bold">graphic design</strong>,{" "}
              <strong className="font-bold">photography</strong>,{" "}
              <strong className="font-bold">motion</strong>,{" "}
              <strong className="font-bold">experiments</strong>,{" "}
              <strong className="font-bold">commissions</strong>, and things
              that didn&rsquo;t fit neatly anywhere else.
            </p>
          </div>
        </section>
      </div>

      <p className="mx-auto mt-10 max-w-xl px-6 text-center font-playfair text-lg font-bold italic leading-snug text-[#f1ead9] [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] sm:text-xl">
        &ldquo;A collection of things seen, imagined, altered, remembered, and
        made visible.&rdquo;
      </p>

      <DesignEditorial />

      <div className="mx-auto mt-16 max-w-6xl px-6">
        <DesignInfluencers />
        <DesignGallery />
      </div>

      <div className="mt-10 text-center">
        <a
          href="https://www.instagram.com/addtheaccent"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs uppercase tracking-widest text-accent hover:underline"
        >
          More on Instagram &rarr;
        </a>
      </div>

      {/* The statue holding "The Deep End" stands at the very bottom of
          the page, its base resting directly on the footer's top line. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/design/deep-end-statue.webp"
        alt="A stone statue of a boy in a cap holding up a sign that reads The Deep End, bubbles rising beside him"
        className="mx-auto mt-12 block w-44 sm:w-56"
      />
    </div>
  );
}
