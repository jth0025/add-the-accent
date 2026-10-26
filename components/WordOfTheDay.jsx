"use client";

import { useEffect, useState } from "react";
import WordChat from "./WordChat";
import { wordForDate } from "@/lib/words";
import { AppleSolo } from "./WordChatDecor";

export default function WordOfTheDay() {
  // Resolve on the client so the word tracks today's date (Los Angeles)
  // rather than the build date.
  const [entry, setEntry] = useState(null);
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    setEntry(wordForDate());
    setDateLabel(
      new Date().toLocaleDateString("en-US", {
        timeZone: "America/Los_Angeles",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    );
  }, []);

  return (
    <div className="relative mt-12">
    {entry && <AppleSolo className="wc-topapple" />}
    <section className="paper-notebook corner-box relative min-h-[184px] rounded-t-xl border border-b-0 border-ink/15 bg-card px-7 py-8 sm:px-9">
      <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-widest text-accent sm:gap-3 sm:text-xs">
        <span className="whitespace-nowrap">
          <strong className="font-bold">Accent</strong> Word of the Day
        </span>
        <span className="h-px min-w-[10px] flex-1 bg-accent/40" />
        {dateLabel && (
          <span className="shrink-0 whitespace-nowrap normal-case tracking-normal text-stone/60">
            {dateLabel}
          </span>
        )}
      </div>

      {entry && (
        <div className="mt-4">
          <p className="font-playfair text-3xl font-bold text-ink sm:text-4xl">
            {entry.word}
          </p>
          <p className="mt-1 font-mono text-xs italic tracking-wide text-stone/70">
            {entry.pron} &nbsp;·&nbsp; {entry.pos}
          </p>
          <p className="mt-3 max-w-xl font-serif text-lg leading-relaxed text-ink">
            {entry.def}
          </p>
        </div>
      )}
    </section>
    {entry ? (
      <WordChat word={entry.word} />
    ) : (
      <div className="h-px" aria-hidden="true" />
    )}
    </div>
  );
}
