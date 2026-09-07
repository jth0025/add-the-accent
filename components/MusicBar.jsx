"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PLAYLIST } from "@/lib/playlist";
import { AUDIOBUS_PLAY, AUDIOBUS_STOP, announcePlay } from "@/lib/audioBus";

const SOURCE_ID = "music";
const STORE_KEY = "ata-music-track";

function fmt(t) {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * A one-line music strip under the header, styled like the voice clip:
 * a bronze play/pause button, the current track, and a thin progress
 * line clear across the screen. It plays 30-second previews of the
 * "Melanated Soul" playlist back to back and tries to start itself as
 * soon as the page loads (falling back to the visitor's first gesture,
 * per browser autoplay rules). Coordinates with the audio bus so it and
 * the voice clip never play over each other.
 */
export default function MusicBar() {
  const audioRef = useRef(null);
  const wantsToPlay = useRef(true); // desired state; a clip can borrow the floor
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = PLAYLIST[index] || PLAYLIST[0];

  // Resume on the track the visitor left off on.
  useEffect(() => {
    try {
      const saved = parseInt(sessionStorage.getItem(STORE_KEY) || "", 10);
      if (Number.isInteger(saved) && saved >= 0 && saved < PLAYLIST.length) {
        setIndex(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const tryPlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.play().catch(() => {
      /* autoplay blocked — a global gesture listener will retry */
    });
  }, []);

  // Attempt autoplay on mount; if the browser blocks it, start on the
  // first interaction anywhere on the page.
  useEffect(() => {
    tryPlay();
    const kick = () => {
      // Let any player that the same gesture started claim the floor first.
      window.setTimeout(() => {
        if (wantsToPlay.current) tryPlay();
      }, 200);
      remove();
    };
    const remove = () => {
      ["pointerdown", "keydown", "touchstart", "scroll"].forEach((e) =>
        window.removeEventListener(e, kick),
      );
    };
    ["pointerdown", "keydown", "touchstart", "scroll"].forEach((e) =>
      window.addEventListener(e, kick, { once: true, passive: true }),
    );
    return remove;
  }, [tryPlay]);

  // Audio bus: yield to the voice clip, take the floor back when it stops.
  useEffect(() => {
    const onOther = (e) => {
      if (e.detail?.sourceId === SOURCE_ID) return;
      wantsToPlay.current = false;
      audioRef.current?.pause();
    };
    const onOtherStop = (e) => {
      if (e.detail?.sourceId === SOURCE_ID) return;
      wantsToPlay.current = true;
      tryPlay();
    };
    window.addEventListener(AUDIOBUS_PLAY, onOther);
    window.addEventListener(AUDIOBUS_STOP, onOtherStop);
    return () => {
      window.removeEventListener(AUDIOBUS_PLAY, onOther);
      window.removeEventListener(AUDIOBUS_STOP, onOtherStop);
    };
  }, [tryPlay]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      wantsToPlay.current = true;
      el.play().catch(() => {});
    } else {
      wantsToPlay.current = false;
      el.pause();
    }
  };

  const advance = useCallback(
    (dir = 1) => {
      setIndex((i) => {
        const next = (i + dir + PLAYLIST.length) % PLAYLIST.length;
        try {
          sessionStorage.setItem(STORE_KEY, String(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      setCurrent(0);
    },
    [],
  );

  // When the track src changes, keep playing if that was the intent.
  useEffect(() => {
    const el = audioRef.current;
    if (el && wantsToPlay.current) el.play().catch(() => {});
  }, [index]);

  const seek = (e) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (e.clientX - rect.left) / rect.width),
    );
    el.currentTime = ratio * duration;
    setCurrent(el.currentTime);
  };

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div className="w-full border-b-2 border-ink/55 bg-ink">
      <div className="flex items-center gap-3 px-4 py-2 sm:px-6">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          className="relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full text-[#2c1a08] ring-1 ring-[#3a2410]/60 transition-transform hover:scale-105 shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,244,230,0.75),inset_0_-3px_6px_rgba(60,30,10,0.55)]"
          style={{
            backgroundImage:
              "radial-gradient(130% 130% at 32% 22%, #fbe6c8 0%, #e6b784 26%, #bd813f 52%, #8a541f 78%, #5a3512 100%)",
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-1 top-0.5 h-1/3 rounded-full bg-white/45 blur-[1.5px]"
          />
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="relative">
              <rect x="5" y="4" width="5" height="16" rx="1" />
              <rect x="14" y="4" width="5" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="relative">
              <path d="M7 4.5v15l13-7.5-13-7.5z" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-white/70">
            <span className="truncate">
              <span className="text-white/40">Now playing&nbsp;·&nbsp;</span>
              {track.title}
              <span className="text-white/40"> — {track.artist}</span>
            </span>
            <span className="shrink-0 tabular-nums text-white/50">
              {fmt(current)} / {fmt(duration)}
            </span>
          </div>
          <div
            onClick={seek}
            className="mt-1 h-1 cursor-pointer rounded-full bg-white/15"
          >
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => advance(1)}
          aria-label="Next track"
          className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-white/45 transition-colors hover:text-white/80"
        >
          Skip &rsaquo;
        </button>
      </div>

      <audio
        ref={audioRef}
        src={track.src}
        preload="auto"
        onPlay={() => {
          setPlaying(true);
          announcePlay(SOURCE_ID);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => advance(1)}
        onError={() => advance(1)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
    </div>
  );
}
