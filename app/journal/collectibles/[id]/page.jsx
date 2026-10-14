import Link from "next/link";
import { notFound } from "next/navigation";
import CollectorCard from "@/components/collectibles/CollectorCard";
import { COLLECTIBLES, collectibleById } from "@/lib/collectibles";

export function generateStaticParams() {
  return COLLECTIBLES.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }) {
  const item = collectibleById(params.id);
  if (!item) return { title: "The Collectibles — Add the Accent" };
  return {
    title: `${item.identity}: Collector's Card ${item.number} — Add the Accent`,
    description: item.card?.line,
  };
}

// A collector's card for one of the Collectibles: the figure in the corner,
// with made-up stats and measurements, and the story on the back.
export default function CollectibleCardPage({ params }) {
  const item = collectibleById(params.id);
  if (!item) notFound();
  const i = COLLECTIBLES.indexOf(item);
  const prev = COLLECTIBLES[(i + COLLECTIBLES.length - 1) % COLLECTIBLES.length];
  const next = COLLECTIBLES[(i + 1) % COLLECTIBLES.length];

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-10">
      <Link
        href="/journal#collectibles"
        className="font-mono text-xs font-bold uppercase tracking-widest text-white underline-offset-4 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] hover:text-accent hover:underline"
      >
        &larr; The Collectibles
      </Link>
      <CollectorCard item={item} total={COLLECTIBLES.length} />
      <nav
        aria-label="More cards"
        className="mx-auto mt-10 flex max-w-[26rem] items-center justify-between gap-4 font-mono text-[11px] font-bold uppercase tracking-widest"
      >
        <Link href={`/journal/collectibles/${prev.id}`} className="text-white underline-offset-4 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] hover:text-accent hover:underline">
          &larr; {prev.identity}
        </Link>
        <Link href={`/journal/collectibles/${next.id}`} className="text-right text-white underline-offset-4 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] hover:text-accent hover:underline">
          {next.identity} &rarr;
        </Link>
      </nav>
    </div>
  );
}
