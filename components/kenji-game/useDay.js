"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* What every Day from Four on shares: its saved state (kept in a ref as well
   as in React state, so timers and dialogue callbacks always see the latest),
   timers that are cleared when the Day goes, and the dialogue: scripts play
   once (`seen`), a line's `if(state)` is checked as the talk reaches it, and a
   line that asks a question (`choices` with `pickKey`) stores the answer in
   the state at once, so the lines after it can depend on it. */
export default function useDay({ load, fresh, save, scripts }) {
  const initial = useRef(null);
  if (initial.current === null) initial.current = load() || fresh();

  const [d, setD] = useState(initial.current);
  const dRef = useRef(initial.current);
  const update = useCallback(
    (patch) => {
      const next = typeof patch === "function" ? patch(dRef.current) : { ...dRef.current, ...patch };
      dRef.current = next;
      save(next);
      setD(next);
      return next;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const replace = useCallback(
    (next) => {
      dRef.current = next;
      save(next);
      setD(next);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const timers = useRef([]);
  const later = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);
  useEffect(() => {
    const ts = timers.current;
    return () => ts.forEach(clearTimeout);
  }, []);

  const [talking, setTalking] = useState(null);
  const talkingRef = useRef(null);
  const talk = useCallback(
    (key, done, force = false) => {
      const cur = dRef.current;
      if (!scripts[key] || (!force && cur.seen && cur.seen[key])) {
        if (done) done();
        return;
      }
      if (!force) update((s) => ({ ...s, seen: { ...(s.seen || {}), [key]: true } }));
      const lines = scripts[key].map((l) => (l.choices ? { ...l, pick: (o) => update({ [l.pickKey]: o.set }) } : l));
      if (!lines.some((l) => !l.if || l.if(dRef.current))) {
        if (done) done();
        return;
      }
      talkingRef.current = { lines, done: done || null, id: Date.now() + Math.random() };
      setTalking(talkingRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [update],
  );
  const endTalk = useCallback(() => {
    const t = talkingRef.current;
    talkingRef.current = null;
    setTalking(null);
    if (t?.done) t.done();
  }, []);
  // Play a script again (it has already been seen).
  const replay = useCallback((key, done) => talk(key, done, true), [talk]);

  return { initial: initial.current, d, dRef, update, replace, later, talking, talkingRef, talk, endTalk, replay };
}
