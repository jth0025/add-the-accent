"use client";

import { useCallback, useRef, useState } from "react";

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * A small tap-to-play audio clip styled for the site — an accent-amber
 * play button, a mono label, and a scrubbable progress bar — sized to
 * sit on the dark hero ground beneath the epigraph.
 */
export default function VoiceClip({ src, label = "Voice note" }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  }, []);

  const seekToClientX = useCallback(
    (clientX, track) => {
      const el = audioRef.current;
      if (!el || !duration) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      el.currentTime = ratio * duration;
      setCurrent(el.currentTime);
    },
    [duration],
  );

  const onTrackKeyDown = useCallback(
    (event) => {
      const el = audioRef.current;
      if (!el || !duration) return;
      if (event.key === "ArrowRight") {
        el.currentTime = Math.min(duration, el.currentTime + 5);
        setCurrent(el.currentTime);
      } else if (event.key === "ArrowLeft") {
        el.currentTime = Math.max(0, el.currentTime - 5);
        setCurrent(el.currentTime);
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        toggle();
      }
    },
    [duration, toggle],
  );

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div className="corner-box on-dark mx-auto mt-5 flex w-full max-w-sm items-center gap-3 rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-left backdrop-blur-sm">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${label}` : `Play ${label}`}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-white shadow-[0_2px_6px_rgba(0,0,0,0.35)] transition-transform hover:scale-105"
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="5" y="4" width="5" height="16" rx="1" />
            <rect x="14" y="4" width="5" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 4.5v15l13-7.5-13-7.5z" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-widest text-white/85">
          <span className="truncate">{label}</span>
          <span className="shrink-0 tabular-nums">
            {formatTime(current)} / {formatTime(duration)}
          </span>
        </div>
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Seek within ${label}`}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration) || 0}
          aria-valuenow={Math.round(current)}
          onKeyDown={onTrackKeyDown}
          onClick={(e) => seekToClientX(e.clientX, e.currentTarget)}
          className="h-1.5 cursor-pointer rounded-full bg-white/25 outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        >
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
        }}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
    </div>
  );
}
