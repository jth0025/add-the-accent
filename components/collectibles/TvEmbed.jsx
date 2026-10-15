"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { announcePlay, announceStop } from "@/lib/audioBus";
import "./tv-embed.css";

// The YouTube id from a watch / short / embed link.
function videoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    return u.searchParams.get("v") || u.pathname.split("/").filter(Boolean).pop() || null;
  } catch {
    return null;
  }
}

// A small TV set. The screen is a slot: static and a play mark when idle,
// the video itself in the pop-up.
function Tv({ children, className = "", style }) {
  return (
    <span className={`tvx ${className}`} style={style} aria-hidden={children ? undefined : "true"}>
      <i className="tvx-ant tvx-ant--l" />
      <i className="tvx-ant tvx-ant--r" />
      <span className="tvx-body">
        <span className="tvx-bezel">
          <span className="tvx-screen">{children}</span>
        </span>
        <span className="tvx-side">
          <i className="tvx-knob" />
          <i className="tvx-knob" />
          <i className="tvx-grille" />
        </span>
      </span>
      <i className="tvx-foot tvx-foot--l" />
      <i className="tvx-foot tvx-foot--r" />
    </span>
  );
}

/**
 * A small TV placeholder for a video link. Click it and a bigger TV pops up
 * at the side of the screen and the video starts playing by itself. The site
 * music pauses while it plays and comes back when the TV is closed.
 *
 * Sits on the back of a collector's card: the TV set with the label under it.
 */
export default function TvEmbed({ video, linkClassName = "" }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Where the pop-up TV goes: filling the free space on one side of the
  // card, or docked along the bottom of the screen when there is no room
  // beside it.
  const [place, setPlace] = useState(null);
  const id = videoId(video.url);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);

  const measure = useCallback(() => {
    const stage = document.querySelector(".cc-stage");
    if (!stage) return setPlace(null);
    const r = stage.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 16;
    const m = 12;
    const spaceR = vw - r.right - gap - m;
    const spaceL = r.left - gap - m;
    const onRight = spaceR >= spaceL;
    const space = onRight ? spaceR : spaceL;
    // The set is about 0.72 as tall as it is wide.
    const width = Math.min(space, 900, (vh - 2 * m) / 0.72);
    if (space < 260) return setPlace(null);
    const start = onRight ? r.right + gap : r.left - gap - space;
    setPlace({
      left: start + (space - width) / 2,
      width,
      from: onRight ? "60%" : "-60%",
    });
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, measure]);

  useEffect(() => {
    if (!open) return undefined;
    announcePlay("tv-embed");
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      announceStop("tv-embed");
    };
  }, [open, close]);

  // No usable id: fall back to a plain link.
  if (!id) {
    return (
      <a href={video.url} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {video.label} <span aria-hidden="true">&#8599;</span>
      </a>
    );
  }

  const trigger = (
    <button type="button" className="tvx-trigger" onClick={() => setOpen(true)} aria-haspopup="dialog">
      <Tv className="tvx--mini">
        <span className="tvx-static" />
        <span className="tvx-play" />
      </Tv>
      <span className="tvx-label">{video.label}</span>
    </button>
  );

  return (
    <>
      {trigger}
      {mounted &&
        open &&
        createPortal(
          <div
            className={`tvx-pop ${place ? "tvx-pop--side" : ""}`}
            style={place ? { left: place.left, width: place.width, "--pop-from": place.from } : undefined}
            role="dialog"
            aria-label={`${video.label} — video`}
          >
            <Tv className="tvx--big" style={place ? { "--tv": `${place.width / 19}px` } : undefined}>
              <span className="tvx-static" />
              <iframe
                className="tvx-frame"
                src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
                title={video.label}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </Tv>
            <button type="button" className="tvx-close" onClick={close} aria-label="Turn the TV off">
              &times;
            </button>
            <a
              className="tvx-yt"
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open on YouTube <span aria-hidden="true">&#8599;</span>
            </a>
          </div>,
          document.body,
        )}
    </>
  );
}
