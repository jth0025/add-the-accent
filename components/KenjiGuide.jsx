"use client";

import { useEffect, useRef, useState } from "react";

// Kenji's opening dialogue — written like an NPC greeting rather than a
// support-widget script, since he's the guide for the whole "quest"
// framing of this page, not a help bot. The first line is broken into
// its own greeting/name beats rather than one run-on sentence.
const LINES = [
  <>
    <span className="mb-1 block font-tribal text-2xl leading-none tracking-wide text-accent">
      Konnichiwa.
    </span>
    <span className="mb-1.5 block font-cinema text-base uppercase tracking-wide text-[#2a2115]">
      I am Kenji
    </span>
    <span className="block font-serif text-[15px] italic leading-snug text-[#2a2115]">
      &mdash; lone samurai, sworn to guide wanderers through this
      forbidden quest.
    </span>
  </>,
  <p key="l2" className="font-serif text-[15px] italic leading-snug text-[#2a2115]">
    You have found your way to{" "}
    <span className="domain-glow font-bold not-italic">Domain Expansion</span>{" "}
    seeking treasure: Cover &amp; Key Art, forged to give your idea a world
    before anyone presses play.
  </p>,
  <p key="l3" className="font-serif text-[15px] italic leading-snug text-[#2a2115]">
    Speak your idea below, and I will walk it to the gate myself. The
    quest is yours whenever you are ready.
  </p>,
];

/**
 * A floating quest-giver — Kenji's avatar docked in the corner of the
 * Work With Me page, bobbing gently until clicked open. Opens itself
 * once per visit (a short beat after the page settles) so first-time
 * wanderers get the greeting without having to go looking for it, then
 * stays reachable by hand afterward. Advances one line at a time like
 * game dialogue, ending on a CTA into the inquiry form. While open, his
 * full-body form stands beside the dialogue box; closing it sends him
 * away again.
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
        <div className="flex items-end">
          {/* His full form, standing — appears only while the dialogue
              is open, feet planted right in his own shadow (he's
              standing on the ground here, not levitating the way the
              meditating hero shot is). Hidden on the smallest phones,
              where there isn't room beside the box. */}
          <div
            aria-hidden="true"
            className="relative hidden h-80 w-28 shrink-0 sm:block sm:h-[22rem] sm:w-32"
          >
            <div className="absolute inset-x-8 -bottom-1 h-4 rounded-[50%] bg-black/70 blur-[3px] sm:inset-x-9" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kenji-standing.png"
              alt=""
              className="absolute bottom-0 left-1/2 h-full w-auto -translate-x-1/2 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.35)]"
            />
          </div>

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
                <div key={step} className="kenji-line mt-1.5">
                  {LINES[step]}
                </div>
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
