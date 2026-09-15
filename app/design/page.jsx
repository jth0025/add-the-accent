import DesignGallery from "@/components/DesignGallery";

export const metadata = { title: "Design — Add the Accent" };

export default function DesignPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <section className="paper-notebook corner-box rounded-xl border border-ink/15 bg-card px-7 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
          <span className="h-px w-8 bg-accent/40" />
          <span>Design</span>
          <span className="h-px w-8 bg-accent/40" />
        </div>
        <h1 className="mt-3 font-display text-3xl uppercase tracking-tight text-ink sm:text-4xl">
          Graphic Design
        </h1>
        <div className="mt-3 flex items-center justify-center gap-4">
          <img
            src="/icons/icon-spaceship.png"
            alt=""
            className="h-9 w-auto sm:h-11"
          />
          <img
            src="/icons/icon-thunderstorm-cloud.png"
            alt=""
            className="h-9 w-auto sm:h-11"
          />
        </div>
        <p className="mx-auto mt-4 max-w-xl text-stone">
          Composite work, album art, and one-off visual ideas — click any
          piece to see it full size.
        </p>
      </section>

      <div className="mt-10">
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
    </div>
  );
}
