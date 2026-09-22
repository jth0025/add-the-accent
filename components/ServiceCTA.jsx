"use client";

/**
 * The "START A PROJECT →" / "START A CONVERSATION →" buttons on each
 * Work With Me service card. Rather than routing through the URL, a
 * click just stashes which service was picked (read once by
 * WorkInquiryForm on mount) and smooth-scrolls down to the shared
 * inquiry form — one form, pre-aimed at the right dropdown option.
 */
export default function ServiceCTA({ presetType, children, className = "" }) {
  const handleClick = () => {
    // The form is already mounted by the time this fires, so a plain
    // custom event is what actually reaches it live; sessionStorage is
    // kept too as a fallback for the (rarer) case of landing on #inquiry
    // fresh, e.g. a shared link, before the form's own mount effect runs.
    try {
      sessionStorage.setItem("wwm-project-type", presetType);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(
      new CustomEvent("wwm-set-type", { detail: presetType }),
    );
    document
      .getElementById("inquiry")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-transform duration-200 hover:scale-[1.03] hover:bg-[#c27b28] ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      >
        &rarr;
      </span>
    </button>
  );
}
