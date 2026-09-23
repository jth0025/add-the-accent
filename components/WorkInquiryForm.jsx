"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Same endpoint/env var as ContactButton — see README for setup. Falls
// back to a mailto: draft when it isn't configured yet.
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

const PROJECT_TYPES = [
  "Cover / Key Art",
  "Visual Storytelling / Composite",
  "Creative Direction / Brand Story",
  "Something Else",
];

const BUDGETS = [
  "Not sure yet",
  "Under $500",
  "$500–$1,000",
  "$1,000–$2,500",
  "$2,500+",
];

const SOURCES = [
  "Search",
  "Instagram",
  "A friend or referral",
  "The journal",
  "Somewhere else",
];

// Underlined "fill in the blank" fields on a ruled cream sheet, rather
// than boxed inputs — see the .scantron-sheet rule in globals.css for
// the paper itself.
const fieldClass =
  "w-full border-0 border-b-2 border-dotted border-ink/35 bg-transparent px-0.5 py-1.5 font-mono text-sm text-ink outline-none placeholder:text-stone/50 focus:border-accent disabled:opacity-60";
const labelClass =
  "mb-1 block font-mono text-[10px] uppercase tracking-widest text-stone";

// One "question" on the scantron sheet — a circled number, like an
// answer-sheet row, with the actual field underneath it.
function ScantronField({ n, label, required, children }) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink/60 font-mono text-[11px] font-bold text-ink"
      >
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <label htmlFor={`wwm-${n}`} className={labelClass}>
          {label} {required && <span className="text-[#c0202a]">*</span>}
        </label>
        {children}
      </div>
    </div>
  );
}

/**
 * The Work With Me project-inquiry form — a proper qualifying form
 * (not a lonely name/email/message) so a submission tells JT who just
 * walked in, not just that somebody did. A service card's ServiceCTA
 * stashes a preferred "What are we making?" value in sessionStorage
 * before scrolling here; read it once on mount and pre-select it.
 */
export default function WorkInquiryForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [projectType, setProjectType] = useState("");

  useEffect(() => {
    try {
      const preset = sessionStorage.getItem("wwm-project-type");
      if (preset && PROJECT_TYPES.includes(preset)) {
        setProjectType(preset);
        sessionStorage.removeItem("wwm-project-type");
      }
    } catch {
      /* ignore */
    }

    // The form is mounted the whole time a ServiceCTA/KenjiGuide button
    // might be clicked, so the live event (not just the mount-time
    // sessionStorage read above) is what actually catches that click.
    const onSetType = (e) => {
      if (PROJECT_TYPES.includes(e.detail)) setProjectType(e.detail);
    };
    window.addEventListener("wwm-set-type", onSetType);
    return () => window.removeEventListener("wwm-set-type", onSetType);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — real visitors never fill this in.
    if (data.get("_gotcha")) return;

    if (!FORMSPREE_ENDPOINT) {
      const lines = [
        `Name: ${data.get("name") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Company / Artist / Brand: ${data.get("company") || ""}`,
        `What are we making?: ${data.get("project_type") || ""}`,
        `Tell me about it: ${data.get("message") || ""}`,
        `When do you need it?: ${data.get("timeline") || ""}`,
        `Budget: ${data.get("budget") || ""}`,
        `Reference link: ${data.get("reference") || ""}`,
        `How did you find Add the Accent?: ${data.get("source") || ""}`,
      ];
      window.location.href = `mailto:info@addtheaccent.com?subject=${encodeURIComponent(
        `Project inquiry from ${data.get("name") || "someone"}`,
      )}&body=${encodeURIComponent(lines.join("\n"))}`;
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error("Formspree request failed");
      setStatus("sent");
      form.reset();
      setProjectType("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="py-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-accent/40" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kenji-avatar.png"
            alt=""
            aria-hidden="true"
            className="h-14 w-14 shrink-0 rounded-full border-2 border-accent/50 object-cover shadow-md"
          />
          <span aria-hidden="true" className="h-px w-8 bg-accent/40" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/quest-path.png"
          alt=""
          aria-hidden="true"
          className="mx-auto mt-4 h-24 w-24 object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.25)]"
        />
        <p className="mx-auto mt-4 max-w-sm font-hand text-lg text-accent">
          Kenji nods once, and slips back into the fog.
        </p>
        {/* A second hanko stamp, bookending the "始" (begin) one up in
            the hero — 完 ("kan") reads as "complete." */}
        <div className="mt-3 flex justify-center" aria-hidden="true">
          <span className="grunge-text flex h-11 w-11 rotate-[6deg] items-center justify-center rounded-[3px] bg-[#8f2c1a] font-serif text-2xl font-bold text-[#f4e4c4] shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
            完
          </span>
        </div>
        <p className="mt-5 font-serif text-2xl italic text-ink">
          And we&rsquo;re off.
        </p>
        <p className="mx-auto mt-3 max-w-sm text-stone">
          Your idea made it through. I&rsquo;ll review what you sent and
          reach out at the email provided.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-stone">
          In the meantime, wander around a little.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest">
          <Link href="/design" className="text-accent hover:underline">
            View Museum Gallery &rarr;
          </Link>
          <Link href="/journal" className="text-accent hover:underline">
            Read the Journal &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
        <span className="h-px w-8 bg-accent/40" />
        <span>Have Something in Mind?</span>
        <span className="h-px w-8 bg-accent/40" />
      </div>
      <p className="mx-auto mt-4 max-w-md text-center font-playfair text-xl italic text-ink sm:text-2xl">
        You don&rsquo;t need the perfect creative brief.
      </p>
      <p className="mx-auto mt-2 max-w-md text-center text-stone">
        Tell me what you&rsquo;re making, why you&rsquo;re making it, and
        where you feel stuck. We&rsquo;ll start there.
      </p>
      <form
        onSubmit={handleSubmit}
        className="scantron-sheet relative mt-6 space-y-5 rounded-lg p-5 text-left sm:p-7"
      >
      <input
        type="hidden"
        name="_subject"
        value="New project inquiry — Add the Accent"
      />
      {/* Honeypot — hidden from real visitors, irresistible to bots. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <ScantronField n="01" label="Your name" required>
          <input
            id="wwm-01"
            name="name"
            type="text"
            required
            disabled={status === "sending"}
            className={fieldClass}
            placeholder="Jane Doe"
          />
        </ScantronField>
        <ScantronField n="02" label="Email" required>
          <input
            id="wwm-02"
            name="email"
            type="email"
            required
            disabled={status === "sending"}
            className={fieldClass}
            placeholder="jane@email.com"
          />
        </ScantronField>
      </div>

      <ScantronField n="03" label="Company / Artist / Brand">
        <input
          id="wwm-03"
          name="company"
          type="text"
          disabled={status === "sending"}
          className={fieldClass}
          placeholder="Optional"
        />
      </ScantronField>

      <ScantronField n="04" label="What are we making?" required>
        <select
          id="wwm-04"
          name="project_type"
          required
          disabled={status === "sending"}
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          className={`${fieldClass} appearance-none bg-transparent`}
        >
          <option value="" disabled>
            Choose one
          </option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </ScantronField>

      <ScantronField n="05" label="Tell me about it" required>
        <textarea
          id="wwm-05"
          name="message"
          required
          rows={5}
          disabled={status === "sending"}
          className={`${fieldClass} resize-none`}
          placeholder="The idea, the reference, the feeling you're after — whatever you've got."
        />
      </ScantronField>

      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <ScantronField n="06" label="When do you need it?">
          <input
            id="wwm-06"
            name="timeline"
            type="text"
            disabled={status === "sending"}
            className={fieldClass}
            placeholder="No rush / a date"
          />
        </ScantronField>
        <ScantronField n="07" label="Budget" required>
          <select
            id="wwm-07"
            name="budget"
            required
            defaultValue=""
            disabled={status === "sending"}
            className={`${fieldClass} appearance-none bg-transparent`}
          >
            <option value="" disabled>
              Choose one
            </option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </ScantronField>
      </div>

      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <ScantronField n="08" label="Reference link">
          <input
            id="wwm-08"
            name="reference"
            type="url"
            disabled={status === "sending"}
            className={fieldClass}
            placeholder="Optional"
          />
        </ScantronField>
        <ScantronField n="09" label="How did you find Add the Accent?">
          <select
            id="wwm-09"
            name="source"
            defaultValue=""
            disabled={status === "sending"}
            className={`${fieldClass} appearance-none bg-transparent`}
          >
            <option value="">Optional</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </ScantronField>
      </div>

      {status === "error" && (
        <p className="text-sm text-[#c0202a]">
          Something went wrong sending that — try again, or email{" "}
          <a
            href="mailto:info@addtheaccent.com"
            className="underline underline-offset-2"
          >
            info@addtheaccent.com
          </a>{" "}
          directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-accent py-2.5 pl-3 pr-5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kenji-avatar.png"
          alt=""
          aria-hidden="true"
          className="h-8 w-8 shrink-0 rounded-full border-2 border-white/80 object-cover"
        />
        {status === "sending" ? "Sending…" : "Send it to Kenji →"}
      </button>
      </form>
    </>
  );
}
