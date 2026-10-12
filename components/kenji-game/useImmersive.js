"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Phone/tablet immersion for the game. On a touch screen the game takes
// the whole screen, portrait or landscape: the first tap asks the browser
// for full screen (where it allows that), and the game's own buttons stay
// out of sight until the screen is tapped, then tuck away again.
//
// iPhone Safari has no page full-screen API; there the browser bars still
// fold away as the browser allows, and only the in-game buttons hide.

const TOUCH = "(hover: none) and (pointer: coarse)";
const SHOW_MS = 3500;

function fsElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

export default function useImmersive() {
  const [touch, setTouch] = useState(false);
  const [hud, setHud] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const timer = useRef(0);
  const askedOnce = useRef(false);
  const userExited = useRef(false);

  const peek = useCallback(() => {
    setHud(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setHud(false), SHOW_MS);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(TOUCH);
    const sync = () => setTouch(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    const el = document.documentElement;
    setCanFullscreen(Boolean(el.requestFullscreen || el.webkitRequestFullscreen));
    const onFs = () => setFullscreen(Boolean(fsElement()));
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs);
    peek();
    // No rubber-band or pull-to-refresh while the game is on screen.
    const prevOverscroll = el.style.overscrollBehavior;
    el.style.overscrollBehavior = "none";
    return () => {
      el.style.overscrollBehavior = prevOverscroll;
      mq.removeEventListener?.("change", sync);
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("webkitfullscreenchange", onFs);
      window.clearTimeout(timer.current);
      if (fsElement()) {
        try {
          (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
        } catch {
          /* leaving the page ends full screen anyway */
        }
      }
    };
  }, [peek]);

  const enterFullscreen = useCallback(() => {
    const el = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!req || fsElement()) return;
    try {
      const p = req.call(el, { navigationUI: "hide" });
      p?.catch?.(() => {});
    } catch {
      /* not allowed here — the game still fills the viewport */
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    userExited.current = true;
    try {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    } catch {
      /* ignore */
    }
  }, []);

  // Wired to the game root's pointerup (a gesture browsers accept for
  // full screen): a tap shows the buttons for a
  // moment, and the very first tap also takes the screen full.
  const onTap = useCallback(() => {
    peek();
    if (touch && canFullscreen && !askedOnce.current && !userExited.current) {
      askedOnce.current = true;
      enterFullscreen();
    }
  }, [peek, touch, canFullscreen, enterFullscreen]);

  return {
    touch,
    // Buttons are always shown with a mouse; on touch they follow the taps.
    hudVisible: !touch || hud,
    fullscreen,
    canFullscreen: touch && canFullscreen,
    onTap,
    enterFullscreen,
    exitFullscreen,
  };
}
