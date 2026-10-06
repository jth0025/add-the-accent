import fs from "node:fs";
import path from "node:path";
import { influencersOfTheWeek } from "@/lib/influencers";
import InfluencerFlowers from "@/components/InfluencerFlowers";

const initialsOf = (name) =>
  name
    .replace(/\./g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

const hasImage = (image) =>
  fs.existsSync(path.join(process.cwd(), "public", image));

function Portrait({ person }) {
  const photo = hasImage(person.image);
  return (
    <figure className="min-w-0 max-w-[15rem] flex-1">
      {/* Frame → mat → portrait, the same hang as the gallery placard. */}
      <div className="bg-gradient-to-br from-[#4a3720] via-[#20160b] to-[#46341d] p-[6px] shadow-[0_8px_16px_rgba(0,0,0,0.4),0_0_0_1px_rgba(201,162,74,0.35)] sm:p-[9px]">
        <div className="bg-[#f4f0e6] p-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.22),inset_0_0_0_1px_rgba(0,0,0,0.1)] sm:p-4">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#2a2620] shadow-[0_0_0_1px_rgba(0,0,0,0.3)]">
            {photo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={person.image}
                alt={`Portrait of ${person.name}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover grayscale-[0.15]"
                style={{ objectPosition: person.pos || "50% 22%" }}
              />
            ) : (
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#4a4237,#1d1a15)] font-playfair text-4xl font-bold italic text-[#c9a24a]/80 sm:text-6xl"
              >
                {initialsOf(person.name)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Wall label. */}
      <figcaption className="mx-auto mt-3 w-[92%] border border-[#cfc6ad] bg-[#efe9da] px-2.5 py-2 text-left text-[#26211a] shadow-[0_4px_10px_rgba(0,0,0,0.3)] sm:px-3">
        <div className="font-playfair text-[13px] font-bold italic leading-tight sm:text-[15px]">
          {person.name}
        </div>
        <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#6b5f45] sm:text-[10px]">
          {person.years}
        </div>
        <div className="mt-1 hidden font-serif text-[12px] leading-snug text-[#4b4331] sm:block">
          {person.known}
        </div>
        {photo && person.credit && (
          <div className="mt-1.5 hidden font-mono text-[8px] uppercase leading-snug tracking-wider text-[#6b5f45]/80 sm:block">
            Photo: {person.credit}
          </div>
        )}
      </figcaption>
    </figure>
  );
}

/**
 * "Men and women creating in purpose" — two portraits (a man and a woman
 * who shaped Black history through their work) hung side by side in
 * gallery frames above the collection's filter bar. The pair changes
 * every week (see lib/influencers.js).
 */
export default function DesignInfluencers() {
  const [first, second] = influencersOfTheWeek();
  return (
    <section
      aria-label="Influencers of history"
      className="mx-auto mb-16 text-center"
    >
      <h2 className="font-playfair text-[1.65rem] font-bold italic leading-tight tracking-tight text-ink min-[400px]:text-3xl sm:text-4xl md:text-5xl">
        Men and women creating in{" "}
        <span className="gold-foil not-italic">purpose</span>.
      </h2>
      <p className="mt-3 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.4em] text-[#3b3f44] sm:text-xs">
        <span aria-hidden="true" className="h-px w-8 bg-accent/50 sm:w-12" />
        <span className="pl-[0.4em]">Influencers of History</span>
        <span aria-hidden="true" className="h-px w-8 bg-accent/50 sm:w-12" />
      </p>

      <InfluencerFlowers>
        <Portrait person={first} />
        <Portrait person={second} />
      </InfluencerFlowers>
    </section>
  );
}
