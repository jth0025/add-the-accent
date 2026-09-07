"use client";

/**
 * A tiny page-wide bus so only one audio source plays at a time.
 *
 * window events:
 *   "audiobus:play"  — a player started; every other player should stop/pause
 *   "audiobus:stop"  — the active player stopped; a background player may resume
 *
 * Each dispatch carries { detail: { sourceId } } so a player ignores its own
 * announcements.
 */
export const AUDIOBUS_PLAY = "audiobus:play";
export const AUDIOBUS_STOP = "audiobus:stop";

export function announcePlay(sourceId) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUDIOBUS_PLAY, { detail: { sourceId } }),
  );
}

export function announceStop(sourceId) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUDIOBUS_STOP, { detail: { sourceId } }),
  );
}
