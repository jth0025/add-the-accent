import DesignEditorial from "@/components/DesignEditorial";
import DesignGallery from "@/components/DesignGallery";
import DesignInfluencers from "@/components/DesignInfluencers";
import GoldSparkle from "@/components/GoldSparkle";
import KoiLayer from "@/components/KoiLayer";
import TitleLight from "@/components/journal/TitleLight";
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
        {/* The main art sits straight on the wall — no paper behind it. */}
        <section data-koi-avoid>
          <div className="px-3 pb-2 pt-8 text-center sm:px-6 sm:pt-9">
            {/* A picture light hangs over the three words at the very top. */}
            <TitleLight coneHeight="6rem">
              <div className="jl-text flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent sm:text-xs sm:tracking-[0.28em]">
                <span className="hidden h-px w-8 bg-accent/40 sm:block" />
                <span>Design &middot; Photography &middot; Motion</span>
                <span className="hidden h-px w-8 bg-accent/40 sm:block" />
              </div>
            </TitleLight>

            {/* The title is set into the picture itself, level with the
                figure's head and centred over the tallest pedestal. On
                phones the same spot, just a wider box so the type stays
                readable (it is sized from the box's own width). */}
            <div className="relative mt-5">
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
              <h1 className="absolute left-[40.8%] top-[25.5%] w-[46%] -translate-y-1/2 normal-case leading-[0.95] tracking-tighter text-left text-ink [container-type:inline-size] md:w-[26.6%]">
                <span className="block font-playfair text-[10cqw] font-bold not-italic">
                  Different <span className="gold-foil">mediums</span>.
                </span>
                <span className="relative left-[0.55em] block font-playfair text-[10cqw] font-bold not-italic">
                  Same <span className="gold-foil">signature</span>.
                </span>
              </h1>
            </div>
          </div>
        </section>
      </div>

      <p className="mx-auto mt-9 max-w-2xl px-6 text-center font-playfair text-2xl font-bold italic leading-snug text-[#f1ead9] [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] sm:text-[1.9rem]">
        &ldquo;The Museum is a collection of things seen, imagined, altered,
        remembered, and made visible by yours truly.&rdquo;
        {/* A black sketched heart, hand-drawn (the #urban-sketch roughen
            filter lives in app/layout.jsx). */}
        <svg
          viewBox="0 0 24 24"
          fill="#000"
          stroke="#000"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="ml-2 inline-block h-8 w-8 -rotate-6 align-[-0.4em] [filter:url(#urban-sketch)]"
        >
          <path d="M12 20.5C6 16 3 12.7 3 9.1 3 6.4 5 4.5 7.4 4.5c1.8 0 3.4 1 4.6 2.9 1.2-1.9 2.8-2.9 4.6-2.9C19 4.5 21 6.4 21 9.1c0 3.6-3 6.9-9 11.4z" />
          <path d="M6.6 8.2c.3-1 1.1-1.6 2-1.6" />
        </svg>
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
