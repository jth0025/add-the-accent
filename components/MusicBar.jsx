"use client";

import { useEffect, useRef, useState } from "react";
import {
  AUDIOBUS_PLAY,
  AUDIOBUS_STOP,
  announcePlay,
} from "@/lib/audioBus";

const SOURCE_ID = "music";
const EMBED_SRC =
  "https://embed.music.apple.com/us/playlist/several-beautiful-instances-of-the-melanated-soul/pl.u-r2yB16PFP0kBgj";

/**
 * A very thin, full-bleed Apple Music strip directly under the header.
 *
 * Coordination (see lib/audioBus): when any other player announces "play"
 * the iframe is unmounted so its audio stops dead — no overlap. When that
 * player announces "stop" the iframe is remounted (fresh key) so the music
 * is ready again; whether it resumes on its own is up to Apple's embed and
 * the browser's autoplay policy. Clicking into the strip is treated as the
 * music starting, which pauses the other players.
 */
export default function MusicBar() {
  const [mounted, setMounted] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const iframeRef = useRef(null);

  useEffect(() => {
    const onPlay = (e) => {
      if (e.detail?.sourceId !== SOURCE_ID) setMounted(false);
    };
    const onStop = (e) => {
      if (e.detail?.sourceId !== SOURCE_ID) {
        setReloadKey((k) => k + 1);
        setMounted(true);
      }
    };
    window.addEventListener(AUDIOBUS_PLAY, onPlay);
    window.addEventListener(AUDIOBUS_STOP, onStop);
    return () => {
      window.removeEventListener(AUDIOBUS_PLAY, onPlay);
      window.removeEventListener(AUDIOBUS_STOP, onStop);
    };
  }, []);

  // The iframe is cross-origin, so we can't hear it start. But focus moving
  // into it means the viewer just clicked play there — announce that so the
  // voice clip (and anything else) pauses.
  useEffect(() => {
    const onBlur = () => {
      window.setTimeout(() => {
        if (
          iframeRef.current &&
          document.activeElement === iframeRef.current
        ) {
          announcePlay(SOURCE_ID);
        }
      }, 0);
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  return (
    <div className="flex min-h-[82px] w-full items-center justify-center overflow-hidden border-b-2 border-ink/55 bg-ink">
      {mounted ? (
        <iframe
          key={reloadKey}
          ref={iframeRef}
          title="Add the Accent — playlist"
          src={EMBED_SRC}
          allow="autoplay *; encrypted-media *;"
          loading="lazy"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          className="block w-full border-0 bg-transparent"
          style={{ height: 82 }}
        />
      ) : (
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
          music paused &mdash; playing a clip
        </span>
      )}
    </div>
  );
}
