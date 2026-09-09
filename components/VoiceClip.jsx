"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AUDIOBUS_PLAY, announcePlay, announceStop } from "@/lib/audioBus";

const SOURCE_ID = "voiceclip";

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

  // Voice-memo .m4a files often report `duration: Infinity` until the
  // browser is nudged to resolve it — seek past the end once, then reset.
  const resolveDuration = useCallback((el) => {
    if (!el) return;
    if (Number.isFinite(el.duration)) {
      setDuration(el.duration);
      return;
    }
    const onTimeUpdate = () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.currentTime = 0;
      if (Number.isFinite(el.duration)) setDuration(el.duration);
    };
    el.addEventListener("timeupdate", onTimeUpdate);
    el.currentTime = 1e101;
  }, []);

  // The <audio> element can fire loadedmetadata before React attaches its
  // handlers (hydration race), so also sync once on mount.
  useEffect(() => {
    const el = audioRef.current;
    if (el && el.readyState >= 1) resolveDuration(el);
  }, [resolveDuration]);

  // Pause when another player (the music strip) takes over.
  useEffect(() => {
    const onOtherPlay = (e) => {
      if (e.detail?.sourceId !== SOURCE_ID) audioRef.current?.pause();
    };
    window.addEventListener(AUDIOBUS_PLAY, onOtherPlay);
    return () => window.removeEventListener(AUDIOBUS_PLAY, onOtherPlay);
  }, []);

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div className="corner-box on-dark flex w-full max-w-sm items-center gap-3 rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-left backdrop-blur-sm">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${label}` : `Play ${label}`}
        className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full text-[#2c1a08] ring-1 ring-[#3a2410]/60 transition-transform hover:scale-105 shadow-[0_3px_8px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,244,230,0.75),inset_0_-4px_7px_rgba(60,30,10,0.55)]"
        style={{
          backgroundImage:
            "radial-gradient(130% 130% at 32% 22%, #fbe6c8 0%, #e6b784 26%, #bd813f 52%, #8a541f 78%, #5a3512 100%)",
        }}
      >
        {/* top glint — the shine on the metal */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1.5 top-1 h-1/3 rounded-full bg-white/45 blur-[1.5px]"
        />
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="relative drop-shadow-[0_1px_0_rgba(255,240,220,0.5)]">
            <rect x="5" y="4" width="5" height="16" rx="1" />
            <rect x="14" y="4" width="5" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="relative drop-shadow-[0_1px_0_rgba(255,240,220,0.5)]">
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
        onPlay={() => {
          setPlaying(true);
          announcePlay(SOURCE_ID);
        }}
        onPause={() => {
          setPlaying(false);
          announceStop(SOURCE_ID);
        }}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
          announceStop(SOURCE_ID);
        }}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => resolveDuration(e.currentTarget)}
        onDurationChange={(e) => {
          if (Number.isFinite(e.currentTarget.duration)) {
            setDuration(e.currentTarget.duration);
          }
        }}
      />
    </div>
  );
}
