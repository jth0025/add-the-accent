"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PLAYLIST } from "@/lib/playlist";
import { AUDIOBUS_PLAY, AUDIOBUS_STOP, announcePlay } from "@/lib/audioBus";

const SOURCE_ID = "music";
const STORE_KEY = "ata-music-track";
const FADE = 2.5; // crossfade length, seconds
const QUICK_FADE = 0.8; // manual skip / very short previews
const MUSIC_LEVEL = 0.6; // foreground playback level (background music sits under everything)

function fmt(t) {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * A one-line music strip under the header, styled like the voice clip:
 * bronze play/pause button, the current track only, and a thin progress
 * line across the screen.
 *
 * Two <audio> elements are routed through a Web Audio gain graph so each
 * preview crossfades into the next on the audio thread (smooth even when
 * the tab is backgrounded). It autoplays on load (first-gesture fallback)
 * and, via the audio bus, yields to the voice clip and resumes after.
 */
export default function MusicBar() {
  const els = [useRef(null), useRef(null)];
  const primary = useRef(0); // which <audio> is foreground
  const idxRef = useRef(0);
  const fading = useRef(false);
  const wantsToPlay = useRef(true);
  const commitTimer = useRef(null);

  // Web Audio graph (created lazily once a gesture allows it)
  const ctxRef = useRef(null);
  const gainRefs = useRef([null, null]);
  const noiseBufRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const primaryEl = useCallback(() => els[primary.current].current, [els]);
  const otherEl = useCallback(() => els[primary.current ^ 1].current, [els]);
  const track = PLAYLIST[index] || PLAYLIST[0];

  const persist = (i) => {
    try {
      sessionStorage.setItem(STORE_KEY, String(i));
    } catch {
      /* ignore */
    }
  };

  const ensureGraph = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      els.forEach((r, i) => {
        // The gain node is now the single level control — the element's own
        // volume would otherwise multiply on top of it.
        try {
          r.current.volume = 1;
        } catch {
          /* ignore */
        }
        const node = ctx.createMediaElementSource(r.current);
        const gain = ctx.createGain();
        gain.gain.value = i === primary.current ? MUSIC_LEVEL : 0;
        node.connect(gain).connect(ctx.destination);
        gainRefs.current[i] = gain;
      });
      ctxRef.current = ctx;
      return ctx;
    } catch {
      return null; // fall back to element .volume
    }
  }, [els]);

  const setGain = useCallback(
    (slot, target, seconds) => {
      const ctx = ctxRef.current;
      const gain = gainRefs.current[slot];
      if (ctx && gain) {
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        if (seconds > 0) gain.gain.linearRampToValueAtTime(target, now + seconds);
        else gain.gain.setValueAtTime(target, now);
      } else {
        // no graph — ramp the element volume with a timer
        const el = els[slot].current;
        if (!el) return;
        const from = Number.isFinite(el.volume) ? el.volume : 1;
        if (seconds <= 0) {
          try {
            el.volume = target;
          } catch {
            /* ignore */
          }
          return;
        }
        const steps = Math.max(1, Math.round(seconds / 0.05));
        let n = 0;
        const id = setInterval(() => {
          n += 1;
          try {
            el.volume = Math.max(
              0,
              Math.min(1, from + (target - from) * (n / steps)),
            );
          } catch {
            /* ignore */
          }
          if (n >= steps) clearInterval(id);
        }, 50);
      }
    },
    [els],
  );

  const resumeCtx = useCallback(() => {
    ensureGraph();
    ctxRef.current?.resume?.().catch(() => {});
  }, [ensureGraph]);

  // A short burst of filtered static + a tuning whistle, layered over the
  // crossfade so the switch sounds like dialing between stations on an old
  // radio.
  const playTuningBurst = useCallback((seconds) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    if (!noiseBufRef.current) {
      const len = Math.floor(ctx.sampleRate * 2);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
      noiseBufRef.current = buf;
    }

    const now = ctx.currentTime;
    const end = now + seconds;

    // Static: white noise, band-limited and swept like a dial.
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBufRef.current;
    noise.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 450;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 2.4;
    bp.frequency.setValueAtTime(850, now);
    bp.frequency.linearRampToValueAtTime(3400, now + seconds * 0.55);
    bp.frequency.linearRampToValueAtTime(1300, end);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, now);
    ng.gain.linearRampToValueAtTime(0.16, now + 0.1);
    ng.gain.setValueAtTime(0.16, Math.max(now + 0.11, end - 0.3));
    ng.gain.linearRampToValueAtTime(0.0001, end);
    noise.connect(hp).connect(bp).connect(ng).connect(ctx.destination);
    noise.start(now);
    noise.stop(end + 0.05);

    // Whistle: a sine that slides, the sound of passing a station.
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1600, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(2700, now + seconds * 0.7);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, now);
    og.gain.linearRampToValueAtTime(0.035, now + 0.2);
    og.gain.exponentialRampToValueAtTime(0.0001, now + seconds * 0.85);
    osc.connect(og).connect(ctx.destination);
    osc.start(now + 0.12);
    osc.stop(now + seconds);
  }, []);

  const load = (el, i) => {
    if (el) {
      el.src = PLAYLIST[i].src;
      el.load();
    }
  };

  const nextIndex = () => (idxRef.current + 1) % PLAYLIST.length;

  const crossfade = useCallback(
    (nextIdx, quick = false) => {
      if (fading.current || !wantsToPlay.current) return;
      const from = primaryEl();
      const to = otherEl();
      if (!from || !to) return;

      resumeCtx();
      fading.current = true;
      const dur = quick ? QUICK_FADE : FADE;
      const fromSlot = primary.current;
      const toSlot = primary.current ^ 1;

      playTuningBurst(quick ? 0.7 : 1.5);

      load(to, nextIdx);
      try {
        to.currentTime = 0;
      } catch {
        /* ignore */
      }
      if (!ctxRef.current) to.volume = 0;
      to.play().catch(() => {});

      setGain(toSlot, MUSIC_LEVEL, dur);
      setGain(fromSlot, 0, dur);

      clearTimeout(commitTimer.current);
      commitTimer.current = setTimeout(
        () => {
          try {
            from.pause();
          } catch {
            /* ignore */
          }
          if (!ctxRef.current) {
            from.volume = MUSIC_LEVEL;
            to.volume = MUSIC_LEVEL;
          }
          primary.current = toSlot;
          idxRef.current = nextIdx;
          persist(nextIdx);
          setIndex(nextIdx);
          setCurrent(0);
          setDuration(Number.isFinite(to.duration) ? to.duration : 0);
          fading.current = false;
        },
        dur * 1000 + 80,
      );
    },
    [primaryEl, otherEl, resumeCtx, setGain, playTuningBurst],
  );

  // ---- mount: resume position, start playback, gesture fallback ----
  useEffect(() => {
    let start = 0;
    try {
      const s = parseInt(sessionStorage.getItem(STORE_KEY) || "", 10);
      if (Number.isInteger(s) && s >= 0 && s < PLAYLIST.length) start = s;
    } catch {
      /* ignore */
    }
    idxRef.current = start;
    setIndex(start);
    primary.current = 0;

    const el = els[0].current;
    if (el) {
      el.volume = MUSIC_LEVEL;
      load(el, start);
      el.play().catch(() => {});
    }

    const kick = () => {
      resumeCtx();
      window.setTimeout(() => {
        if (wantsToPlay.current) primaryEl()?.play().catch(() => {});
      }, 200);
      remove();
    };
    const remove = () =>
      ["pointerdown", "keydown", "touchstart", "scroll"].forEach((e) =>
        window.removeEventListener(e, kick),
      );
    ["pointerdown", "keydown", "touchstart", "scroll"].forEach((e) =>
      window.addEventListener(e, kick, { once: true, passive: true }),
    );
    return () => {
      remove();
      clearTimeout(commitTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- audio bus: yield to the voice clip, resume when it stops ----
  useEffect(() => {
    const onOther = (e) => {
      if (e.detail?.sourceId === SOURCE_ID) return;
      wantsToPlay.current = false;
      clearTimeout(commitTimer.current);
      fading.current = false;
      els.forEach((r) => {
        try {
          r.current?.pause();
        } catch {
          /* ignore */
        }
      });
    };
    const onOtherStop = (e) => {
      if (e.detail?.sourceId === SOURCE_ID) return;
      wantsToPlay.current = true;
      setGain(primary.current, MUSIC_LEVEL, 0);
      setGain(primary.current ^ 1, 0, 0);
      const el = primaryEl();
      if (el) {
        if (!ctxRef.current) el.volume = MUSIC_LEVEL;
        el.play().catch(() => {});
      }
    };
    window.addEventListener(AUDIOBUS_PLAY, onOther);
    window.addEventListener(AUDIOBUS_STOP, onOtherStop);
    return () => {
      window.removeEventListener(AUDIOBUS_PLAY, onOther);
      window.removeEventListener(AUDIOBUS_STOP, onOtherStop);
    };
  }, [els, primaryEl, setGain]);

  const toggle = () => {
    const el = primaryEl();
    if (!el) return;
    resumeCtx();
    if (el.paused) {
      wantsToPlay.current = true;
      setGain(primary.current, MUSIC_LEVEL, 0);
      if (!ctxRef.current) el.volume = MUSIC_LEVEL;
      el.play().catch(() => {});
    } else {
      wantsToPlay.current = false;
      clearTimeout(commitTimer.current);
      fading.current = false;
      try {
        otherEl()?.pause();
      } catch {
        /* ignore */
      }
      el.pause();
    }
  };

  const onTimeUpdate = (e) => {
    const el = e.currentTarget;
    if (el !== primaryEl()) return;
    setCurrent(el.currentTime);
    if (
      !fading.current &&
      wantsToPlay.current &&
      Number.isFinite(el.duration) &&
      el.duration > FADE + 3 &&
      el.duration - el.currentTime <= FADE
    ) {
      crossfade(nextIndex());
    }
  };

  const onEnded = (e) => {
    if (e.currentTarget !== primaryEl() || fading.current) return;
    crossfade(nextIndex(), true);
  };

  const onError = (e) => {
    const el = e.currentTarget;
    if (fading.current && el === otherEl()) {
      clearTimeout(commitTimer.current);
      fading.current = false;
      setGain(primary.current, MUSIC_LEVEL, 0);
      crossfade((idxRef.current + 2) % PLAYLIST.length, true);
      return;
    }
    if (el === primaryEl()) {
      clearTimeout(commitTimer.current);
      fading.current = false;
      const n = nextIndex();
      idxRef.current = n;
      persist(n);
      setIndex(n);
      load(el, n);
      if (!ctxRef.current) el.volume = MUSIC_LEVEL;
      if (wantsToPlay.current) el.play().catch(() => {});
    }
  };

  const seek = (e) => {
    const el = primaryEl();
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    el.currentTime = ratio * duration;
    setCurrent(el.currentTime);
  };

  const pct = duration ? (current / duration) * 100 : 0;

  const audioProps = {
    preload: "auto",
    crossOrigin: "anonymous",
    onPlay: () => {
      setPlaying(true);
      announcePlay(SOURCE_ID);
    },
    onPause: (e) => {
      if (e.currentTarget === primaryEl() && !fading.current) setPlaying(false);
    },
    onLoadedMetadata: (e) => {
      if (e.currentTarget === primaryEl()) setDuration(e.currentTarget.duration);
    },
    onTimeUpdate,
    onEnded,
    onError,
  };

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
          onClick={() => crossfade(nextIndex(), true)}
          aria-label="Next track"
          className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-white/45 transition-colors hover:text-white/80"
        >
          Skip &rsaquo;
        </button>
      </div>

      <audio ref={els[0]} {...audioProps} />
      <audio ref={els[1]} {...audioProps} />
    </div>
  );
}
