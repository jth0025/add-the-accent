"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./dialogue.css";

/* ------------------------------------------------------------------ */
/* Dialogue: portraits left and right, thought bubbles, smoky          */
/* memories. Shared by Day One and Day Two.                            */
/*                                                                     */
/* Every portrait slides in from its own edge of the screen when it    */
/* joins the scene and slides back out when it leaves (or when the     */
/* scene ends).                                                        */
/*                                                                     */
/* Day Two adds, per line (all optional):                              */
/*   scene   key into `scenes.src`: a cinematic picture behind the     */
/*           talk ('' clears it). It stays until another line sets one. */
/*   pos     [x, y] where to hold the picture on narrow screens        */
/*   narr    narration: no portrait speaks, the box is plain italics   */
/*   hidePor hide both portraits for this line                         */
/*   pair    [leftWho, rightWho] puts both speakers on stage           */
/*   focus   blur the picture except round Kenji (needs scenes.focus)  */
/*   fly     a fly circles in the picture (needs scenes.fly)           */
/* ------------------------------------------------------------------ */
export default function Dialogue({
  lines,
  onDone,
  reducedMotion,
  onLine,
  cast,
  por,
  scenes = null,
  continuity = false,
  lowThink = false,
  defaultKenjiPose = "close",
}) {
  const [i, setI] = useState(0);
  const [closing, setClosing] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [ports, setPorts] = useState({ left: null, right: null });
  const portsRef = useRef(ports);
  const timers = useRef([]);
  const skipRef = useRef(null);
  const finished = useRef(false);
  const rootRef = useRef(null);
  const lastPose = useRef({});
  const sceneRef = useRef("");

  const [sceneShown, setSceneShown] = useState("");
  const [sceneOn, setSceneOn] = useState(false);
  const [scenePos, setScenePos] = useState([0.5, 0.5]);
  const [focus, setFocus] = useState(null); // { mask }
  const [focusOn, setFocusOn] = useState(false);
  const [fly, setFly] = useState(null); // { x, y }

  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  const put = (side, value) => {
    portsRef.current = { ...portsRef.current, [side]: value };
    setPorts(portsRef.current);
  };

  const line = lines[i];
  const narr = !!line.narr;
  const speaker = cast[line.who];
  const side = narr
    ? null
    : line.pair
    ? line.pair[0] === line.who
      ? "left"
      : "right"
    : speaker.side;

  // Stage one character on one side (slides in, or swaps with a slide out
  // and in when someone else was standing there).
  const stage = useCallback(
    (sd, c, who, opts) => {
      const pose = opts.pose || "close";
      const art = c.art[pose] || c.art.close;
      const key = c.name + pose + (opts.mem ? "m" : "");
      const flip = (sd === "right" && art[1] === "r") || (sd === "left" && art[1] === "l");
      const next = { key, src: por[art[0]], alt: c.name, flip, mem: !!opts.mem, sil: !!opts.sil };
      const cur = portsRef.current[sd];
      if (cur && cur.key === key) {
        put(sd, { ...cur, mem: next.mem, sil: next.sil, out: false });
      } else if (cur) {
        put(sd, { ...cur, out: true });
        later(() => put(sd, { ...next, out: false }), reducedMotion ? 0 : cur.mem ? 850 : 380);
      } else {
        put(sd, { ...next, out: true });
        later(() => put(sd, { ...next, out: false }), 30);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // The picture behind the talk, cross-fading when it changes.
  const showScene = useCallback(
    (key) => {
      sceneRef.current = key;
      if (!key) {
        setSceneOn(false);
        setSceneShown("");
        return;
      }
      setSceneShown((cur) => {
        if (cur === key) return cur;
        if (cur) {
          setSceneOn(false);
          later(() => {
            setSceneShown(key);
            requestAnimationFrame(() => setSceneOn(true));
          }, reducedMotion ? 0 : 300);
          return cur;
        }
        requestAnimationFrame(() => setSceneOn(true));
        return key;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Where a point of the picture (as a fraction of it) falls on the screen,
  // given how the picture is covered and held (`pos`).
  const mapToScene = (img, fx, fy, pos) => {
    const r = rootRef.current.getBoundingClientRect();
    const iw = img.naturalWidth || 1586;
    const ih = img.naturalHeight || 827;
    const k = Math.max(r.width / iw, r.height / ih);
    const dw = iw * k;
    const dh = ih * k;
    return { x: (r.width - dw) * pos[0] + fx * dw, y: (r.height - dh) * pos[1] + fy * dh, dw, dh };
  };

  const focusRef = useRef(null);
  const flyRef = useRef(null);
  const sceneImg = useRef(null);
  const sharpImg = useRef(null);
  const layoutExtras = useCallback(() => {
    const f = focusRef.current;
    const y = flyRef.current;
    const sh = sharpImg.current;
    const sc = sceneImg.current;
    if (f && sh && sh.naturalWidth) {
      const p = mapToScene(sh, f.x, f.y, f.pos);
      setFocus({
        mask: `radial-gradient(ellipse ${f.rx * p.dw}px ${f.ry * p.dh}px at ${p.x}px ${p.y}px, #000 58%, transparent 100%)`,
      });
    } else if (!f) {
      setFocus(null);
    }
    if (y && sc && sc.naturalWidth) {
      const p = mapToScene(sc, y.x, y.y, y.pos);
      setFly({ x: p.x, y: p.y });
    } else if (!y) {
      setFly(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", layoutExtras);
    return () => window.removeEventListener("resize", layoutExtras);
  }, [layoutExtras]);

  // Stage the line.
  useEffect(() => {
    if (onLine) onLine(line.who);

    if (scenes && "scene" in line) showScene(line.scene || "");
    const cur = sceneRef.current;
    const pos = line.pos || (scenes && scenes.pos && scenes.pos[cur]) || [0.5, 0.5];
    setScenePos(pos);
    focusRef.current = line.focus && scenes && scenes.focus && scenes.focus[cur] ? { ...scenes.focus[cur], pos } : null;
    flyRef.current = line.fly && scenes && scenes.fly && scenes.fly[cur] ? { ...scenes.fly[cur], pos } : null;
    setFocusOn(!!focusRef.current);
    if (!focusRef.current) setFocus(null);
    if (!flyRef.current) setFly(null);
    later(layoutExtras, 60);

    if (!line.narr) {
      const c = cast[line.who];
      const sd = line.pair ? (line.pair[0] === line.who ? "left" : "right") : c.side;
      const other = sd === "left" ? "right" : "left";
      stage(sd, c, line.who, { pose: line.pose, mem: line.mem, sil: line.sil });
      lastPose.current[line.who] = line.pose || "close";
      if (continuity) {
        // Whoever is being spoken to stands on the other side.
        const pw = line.pair ? (sd === "left" ? line.pair[1] : line.pair[0]) : line.who !== "kenji" ? "kenji" : null;
        if (pw && cast[pw]) {
          const pc = cast[pw];
          const kp = pw === "kenji" && scenes && scenes.kpose && scenes.kpose[cur];
          const there = portsRef.current[other];
          if (!(there && there.key && there.key.indexOf(pc.name) === 0 && (!kp || there.key === pc.name + kp))) {
            stage(other, pc, pw, {
              sil: !!pc.sil,
              pose: (pw === "kenji" && kp) || lastPose.current[pw] || (pw === "kenji" ? defaultKenjiPose : "close"),
            });
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  const end = () => {
    if (closing || leaving) return;
    const hasMem = [portsRef.current.left, portsRef.current.right].some((p) => p && p.mem);
    if (hasMem && !reducedMotion) {
      setClosing(true);
      later(finish, 900);
      return;
    }
    if (!reducedMotion) {
      // Everyone who is standing there walks back off their own edge.
      setLeaving(true);
      setPorts((p) => ({
        left: p.left && { ...p.left, out: true },
        right: p.right && { ...p.right, out: true },
      }));
      later(finish, 620);
      return;
    }
    finish();
  };
  const endRef = useRef(end);
  endRef.current = end;

  const next = () => {
    if (leaving) return;
    if (i + 1 >= lines.length) end();
    else setI(i + 1);
  };
  const nextRef = useRef(next);
  nextRef.current = next;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        nextRef.current();
      } else if (e.key === "Escape") {
        endRef.current();
      }
    };
    document.addEventListener("keydown", onKey);
    skipRef.current?.focus({ preventScroll: true });
    const ts = timers.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      ts.forEach(clearTimeout);
    };
  }, []);

  const activeMemSide = line.mem ? side : null;
  const gone = !!line.hidePor;
  const renderPor = (s) => {
    const p = ports[s];
    // eslint-disable-next-line @next/next/no-img-element
    if (!p) return <img className={`d1-por ${s}`} alt="" />;
    const dim = narr || s !== side;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={p.src}
        alt={p.alt}
        className={`d1-por ${s}${p.flip ? " flip" : ""}${p.mem ? " mem" : ""}${p.sil ? " sil" : ""}${
          p.out ? " out" : " in"
        }${dim ? " dim" : ""}${gone ? " gone" : ""}`}
      />
    );
  };

  const hasScene = !!sceneShown;
  const anyPort = !!(ports.left || ports.right);
  const porDim = hasScene && !gone && (narr ? anyPort : true);
  const objPos = `${scenePos[0] * 100}% ${scenePos[1] * 100}%`;

  return (
    <div
      ref={rootRef}
      className={`d1-dlg${closing ? " closing" : ""}${leaving ? " leaving" : ""}${hasScene ? " has-scene" : ""}${
        porDim ? " por-dim" : ""
      }${focusOn ? " focus-k" : ""}${lowThink ? " low-think" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Story"
      onClick={(e) => {
        if (e.target.closest("[data-skip]")) {
          e.stopPropagation();
          end();
          return;
        }
        next();
      }}
    >
      {scenes && hasScene && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={sceneImg}
            className={`d1-scene${sceneOn ? " on" : ""}`}
            src={scenes.src[sceneShown]}
            alt=""
            style={{ objectPosition: objPos }}
            onLoad={layoutExtras}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={sharpImg}
            className="d1-scene-sharp"
            src={focusOn ? scenes.src[sceneShown] : undefined}
            alt=""
            style={{
              objectPosition: objPos,
              WebkitMaskImage: focus ? focus.mask : undefined,
              maskImage: focus ? focus.mask : undefined,
            }}
            onLoad={layoutExtras}
          />
        </>
      )}
      {fly && (
        <div className="d1-fly" aria-hidden="true" style={{ left: fly.x, top: fly.y }}>
          <i />
        </div>
      )}
      {renderPor("left")}
      {renderPor("right")}
      <div className={`d1-smoke left${closing ? "" : activeMemSide === "left" ? " on" : ""}`} aria-hidden="true" />
      <div className={`d1-smoke right${closing ? "" : activeMemSide === "right" ? " on" : ""}`} aria-hidden="true" />
      <div className={`d1-box${line.thought && !narr ? ` think from-${side}` : ""}`}>
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <p className="d1-name">
          {narr ? null : speaker.name}
          {narr ? null : line.mem ? (
            <small>remembered</small>
          ) : line.sil ? (
            <small>unseen</small>
          ) : line.thought ? (
            <small>thinking</small>
          ) : null}
        </p>
        <p className={`d1-text${line.thought && !narr ? " thought" : ""}${narr ? " narr" : ""}`} aria-live="polite">
          {line.text}
          {line.gloss && <span className="d1-gloss">{line.gloss}</span>}
        </p>
        <div className="d1-ctl">
          <span>Tap or press Enter</span>
          <button type="button" data-skip ref={skipRef}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
