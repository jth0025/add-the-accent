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

const fieldClass =
  "w-full rounded-md border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-stone/60 focus:border-accent disabled:opacity-60";
const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-stone";

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/kenji-avatar.png"
          alt=""
          aria-hidden="true"
          className="mx-auto h-14 w-14 rounded-full border-2 border-accent/50 object-cover shadow-md"
        />
        <p className="mt-4 font-serif text-2xl italic text-ink">
          And we&rsquo;re off.
        </p>
        <p className="mx-auto mt-3 max-w-sm text-stone">
          Your idea made it through. I&rsquo;ll review what you sent and
          reach out at the email provided.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-stone">
          In the meantime, wander around a little.
        </p>
        <p className="mx-auto mt-3 max-w-sm font-hand text-lg text-accent">
          Kenji nods once, and slips back into the fog.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest">
          <Link href="/design" className="text-accent hover:underline">
            View the Design Gallery &rarr;
          </Link>
          <Link href="/journal" className="text-accent hover:underline">
            Read the Journal &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wwm-name" className={labelClass}>
            Your name <span className="text-accent">*</span>
          </label>
          <input
            id="wwm-name"
            name="name"
            type="text"
            required
            disabled={status === "sending"}
            className={fieldClass}
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label htmlFor="wwm-email" className={labelClass}>
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="wwm-email"
            name="email"
            type="email"
            required
            disabled={status === "sending"}
            className={fieldClass}
            placeholder="jane@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="wwm-company" className={labelClass}>
          Company / Artist / Brand
        </label>
        <input
          id="wwm-company"
          name="company"
          type="text"
          disabled={status === "sending"}
          className={fieldClass}
          placeholder="Optional"
        />
      </div>

      <div>
        <label htmlFor="wwm-project-type" className={labelClass}>
          What are we making? <span className="text-accent">*</span>
        </label>
        <select
          id="wwm-project-type"
          name="project_type"
          required
          disabled={status === "sending"}
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          className={`${fieldClass} appearance-none bg-white`}
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
      </div>

      <div>
        <label htmlFor="wwm-message" className={labelClass}>
          Tell me about it <span className="text-accent">*</span>
        </label>
        <textarea
          id="wwm-message"
          name="message"
          required
          rows={5}
          disabled={status === "sending"}
          className={`${fieldClass} resize-none`}
          placeholder="The idea, the reference, the feeling you're after — whatever you've got."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wwm-timeline" className={labelClass}>
            When do you need it?
          </label>
          <input
            id="wwm-timeline"
            name="timeline"
            type="text"
            disabled={status === "sending"}
            className={fieldClass}
            placeholder="No rush / a date"
          />
        </div>
        <div>
          <label htmlFor="wwm-budget" className={labelClass}>
            Budget <span className="text-accent">*</span>
          </label>
          <select
            id="wwm-budget"
            name="budget"
            required
            defaultValue=""
            disabled={status === "sending"}
            className={`${fieldClass} appearance-none bg-white`}
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
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wwm-reference" className={labelClass}>
            Reference link
          </label>
          <input
            id="wwm-reference"
            name="reference"
            type="url"
            disabled={status === "sending"}
            className={fieldClass}
            placeholder="Optional"
          />
        </div>
        <div>
          <label htmlFor="wwm-source" className={labelClass}>
            How did you find Add the Accent?
          </label>
          <select
            id="wwm-source"
            name="source"
            defaultValue=""
            disabled={status === "sending"}
            className={`${fieldClass} appearance-none bg-white`}
          >
            <option value="">Optional</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
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
        className="w-full rounded-full bg-accent py-3 font-mono text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send it to Kenji →"}
      </button>
    </form>
  );
}
