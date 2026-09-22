"use client";

import { useEffect, useRef, useState } from "react";

// Kenji's opening dialogue — written like an NPC greeting rather than a
// support-widget script, since he's the guide for the whole "quest"
// framing of this page, not a help bot.
const LINES = [
  "Konnichiwa. I am Kenji — lone samurai, sworn to guide wanderers through this forbidden quest.",
  "You have found your way to Add the Accent seeking treasure: Cover & Key Art, forged to give your idea a world before anyone presses play.",
  "Speak your idea below, and I will walk it to the gate myself. The quest is yours whenever you are ready.",
];

/**
 * A floating quest-giver — Kenji's avatar docked in the corner of the
 * Work With Me page, bobbing gently until clicked open. Opens itself
 * once per visit (a short beat after the page settles) so first-time
 * wanderers get the greeting without having to go looking for it, then
 * stays reachable by hand afterward. Advances one line at a time like
 * game dialogue, ending on a CTA into the inquiry form.
 */
export default function KenjiGuide() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const autoTimer = useRef(null);

  useEffect(() => {
    let alreadyGreeted = false;
    try {
      alreadyGreeted = sessionStorage.getItem("kenji-greeted") === "1";
    } catch {
      /* ignore */
    }
    if (alreadyGreeted) return undefined;

    autoTimer.current = window.setTimeout(() => {
      setOpen(true);
      setStep(0);
      try {
        sessionStorage.setItem("kenji-greeted", "1");
      } catch {
        /* ignore */
      }
    }, 1600);

    return () => window.clearTimeout(autoTimer.current);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isLastLine = step === LINES.length - 1;

  const beginQuest = () => {
    try {
      sessionStorage.setItem("wwm-project-type", "Cover / Key Art");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(
      new CustomEvent("wwm-set-type", { detail: "Cover / Key Art" }),
    );
    setOpen(false);
    document
      .getElementById("inquiry")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed bottom-5 right-5 z-[250] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {open && (
        <div
          role="dialog"
          aria-label="Kenji, your guide"
          className="corner-box relative w-[19rem] rounded-xl border border-[#3a2a16]/60 bg-[#f4ecd8] p-4 text-left shadow-2xl sm:w-80"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 20%)",
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-3 top-2.5 text-lg leading-none text-stone/70 transition-colors hover:text-ink"
          >
            &times;
          </button>

          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kenji-avatar.png"
              alt="Kenji"
              className="h-12 w-12 shrink-0 rounded-full border-2 border-accent/60 object-cover shadow-md"
            />
            <div className="min-w-0 pt-1">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
                Kenji
              </p>
              <p
                key={step}
                className="kenji-line mt-1 font-serif text-[15px] italic leading-snug text-[#2a2115]"
              >
                {LINES[step]}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1.5" aria-hidden="true">
              {LINES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === step ? "bg-accent" : "bg-[#3a2a16]/25"
                  }`}
                />
              ))}
            </div>

            {isLastLine ? (
              <button
                type="button"
                onClick={beginQuest}
                className="rounded-full bg-accent px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-white transition-transform hover:scale-[1.04]"
              >
                Begin the Quest &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(s + 1, LINES.length - 1))}
                className="font-mono text-[11px] font-bold uppercase tracking-widest text-accent hover:underline"
              >
                Next &rsaquo;
              </button>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setStep(0);
        }}
        aria-label={open ? "Close Kenji" : "Talk to Kenji, your guide"}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`kenji-ring rounded-full ${open ? "" : "kenji-bob"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kenji-avatar.png"
          alt=""
          aria-hidden="true"
          className="h-14 w-14 rounded-full border-2 border-accent/70 object-cover shadow-lg sm:h-16 sm:w-16"
        />
      </button>
    </div>
  );
}
