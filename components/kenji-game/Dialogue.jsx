"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { placeBox } from "./anchor-box";
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
/*                                                                     */
/* Day Three adds:                                                     */
/*   zoom    {s, x, y, tx, ty} push in on a point of the picture       */
/*   focusAt {x, y, rx, ry} blur all but one spot of the picture       */
/*   choices [{t}] + pick(o): the player answers before the talk goes  */
/*           on (the box waits)                                        */
/*   if      with `lazyIf`, a line's `if(state)` is checked as the     */
/*           talk reaches it, so an answer can change what follows     */
/*   faces   scenes.faces[scene][who] = {rect, side}: a speaker whose  */
/*           face is in the picture gets the box beside the face, never */
/*           over any face, set once (it does not slide or bounce)     */
/*                                                                     */
/* Days Four to Seven add:                                             */
/*   anchor  {x, y, w}: the box sits at a point of the picture (as     */
/*           fractions of it); moved clear of any face if it would     */
/*           cover one, and kept on the screen                         */
/*   parch   the line is written (a letter, an inscription): `title`   */
/*           heads a parchment card                                    */
/*   mist    'gust' | 'roll' | 'full' | 'off': a mist layer behind the */
/*           portraits and the box                                     */
/*   flash   fade to white, then show this line's picture              */
/*   whip    a hard camera whip-pan into this line's picture           */
/*   cut     change the picture at once, no cross-fade                 */
/*   reveal  a silhouette (`sil`) turns into the full portrait         */
/*   noPartner  the listener's portrait is not shown for this line     */
/*   scenes.fit[scene] = 'contain': a wide picture shown whole         */
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
  lazyIf = null,
}) {
  // With `lazyIf`, a line's `if(state)` is checked as the talk reaches it.
  const shows = (l) => !l || !lazyIf || !l.if || l.if(lazyIf());
  const firstFrom = (from) => {
    let j = from;
    while (j < lines.length && !shows(lines[j])) j += 1;
    return j;
  };
  const [i, setI] = useState(() => Math.min(firstFrom(0), lines.length - 1));
  // The picture each line stands in front of (the last `scene` the talk has set).
  const sceneKey = useRef(null);
  if (sceneKey.current === null) {
    let cur = "";
    for (let j = 0; j <= i; j += 1) if (shows(lines[j]) && "scene" in lines[j]) cur = lines[j].scene || "";
    sceneKey.current = cur;
  }
  const boxRef = useRef(null);
  const [lay, setLay] = useState({ line: -1, anch: null, zoom: null, delay: 0, pos: null });
  const [vpTick, setVpTick] = useState(0);
  const prevZoom = useRef(""); // the view (picture, hold, zoom) of the previous line
  const [fx, setFx] = useState(null); // 'flash' | 'whip-out' | 'whip-in' | 'whip-settle'
  const fxDone = useRef(-1); // the line whose flash or whip has already played
  const [mist, setMist] = useState("");
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

  // Where to hold the picture for a line: its own `pos`, else (on a tall,
  // narrow screen, where only a slice of the picture shows) the speaker's, so
  // their face and their box both fit, else the picture's usual place. On a
  // wide screen the picture stays put between speakers.
  const posFor = (ln, cur) => {
    const r = rootRef.current ? rootRef.current.getBoundingClientRect() : null;
    const tall = r && r.width / r.height < 1.25;
    return (
      ln.pos ||
      (tall && scenes && scenes.faces && scenes.faces[cur] && scenes.faces[cur][ln.who] && scenes.faces[cur][ln.who].pos) ||
      (scenes && scenes.pos && scenes.pos[cur]) ||
      [0.5, 0.5]
    );
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
      if (!art) return; // a voice or a tree: no portrait to stand there
      const key = c.name + pose + (opts.mem ? "m" : "");
      const flip = (sd === "right" && art[1] === "r") || (sd === "left" && art[1] === "l");
      const next = { key, src: por[art[0]], alt: c.name, flip, mem: !!opts.mem, sil: !!opts.sil, reveal: false };
      const cur = portsRef.current[sd];
      if (opts.reveal) {
        // the silhouette turns into the person, slowly
        later(() => {
          const now = portsRef.current[sd];
          if (now && now.key === key) put(sd, { ...now, sil: false, reveal: true });
        }, 1100);
      }
      if (cur && cur.key === key) {
        put(sd, { ...cur, mem: next.mem, sil: next.sil && !cur.reveal, out: false });
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
    (key, cut) => {
      sceneRef.current = key;
      if (!key) {
        setSceneOn(false);
        setSceneShown("");
        return;
      }
      if (cut) {
        setSceneShown(key);
        setSceneOn(true);
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
    const onResize = () => {
      layoutExtras();
      setVpTick((n) => n + 1);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [layoutExtras]);

  // Where the picture sits on screen for this line (zoomed in or not), and,
  // for a speaker whose face is in the picture, where the box goes beside
  // that face. Worked out before the line is painted, from the picture's
  // known size, so the box appears where it will stay.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const ln = lines[i];
    if (!root || !ln || !scenes || !scenes.size) return; // only Day Three on carries picture sizes
    const cur = sceneKey.current;
    const r = root.getBoundingClientRect();
    const W = r.width;
    const H = r.height;
    const size = scenes.size[cur];
    const contain = !!(scenes.fit && scenes.fit[cur] === "contain");
    const pos = contain ? [0.5, 0.5] : posFor(ln, cur);
    let zoom = null;
    let map = null;
    if (size) {
      const k = contain ? Math.min(W / size[0], H / size[1]) : Math.max(W / size[0], H / size[1]);
      const dw = size[0] * k;
      const dh = size[1] * k;
      const ox = (W - dw) * pos[0];
      const oy = (H - dh) * pos[1];
      map = (fx, fy) => ({ x: ox + fx * dw, y: oy + fy * dh, dw, dh });
      if (ln.zoom) {
        const z = ln.zoom.s;
        const f = map(ln.zoom.x, ln.zoom.y);
        const e0 = map(0, 0);
        const e1 = map(1, 1);
        let tx = W * (ln.zoom.tx != null ? ln.zoom.tx : 0.3) - z * f.x;
        let ty = H * (ln.zoom.ty != null ? ln.zoom.ty : 0.3) - z * f.y;
        tx = Math.max(Math.min(tx, -z * e0.x), W - z * e1.x);
        ty = Math.max(Math.min(ty, -z * e0.y), H - z * e1.y);
        zoom = { z, tx, ty };
      }
    }
    const toScreen = (fx, fy) => {
      const p = map(fx, fy);
      return zoom ? { x: zoom.z * p.x + zoom.tx, y: zoom.z * p.y + zoom.ty, dw: p.dw * zoom.z, dh: p.dh * zoom.z } : p;
    };
    const px = (rc) => {
      const a = toScreen(rc[0], rc[1]);
      const b = toScreen(rc[2], rc[3]);
      return [a.x, a.y, b.x, b.y];
    };
    let anch = null;
    const faces = (scenes.faces && scenes.faces[cur]) || {};
    const mine = !ln.narr && faces[ln.who];
    const el = boxRef.current;
    const measure = (w) => {
      el.style.width = `${w}px`;
      return el.offsetHeight;
    };
    const avoid = Object.values(faces).map((f) => px(f.rect));
    if (ln.anchor && map && el) {
      // an author's point on the picture: the box's top-left corner and its width.
      // A wide, short picture (shown whole) has no room on it: the box sits below.
      const A = ln.anchor;
      const p = toScreen(A.x, A.y);
      const bandTop = toScreen(0, 0).y;
      const bandBottom = toScreen(1, 1).y;
      const maxW = Math.min(460, W - 40);
      const w = Math.max(Math.min(320, maxW), Math.min(maxW, (A.w || 0.3) * p.dw));
      const h = measure(w);
      let left = Math.max(20, Math.min(p.x, W - 20 - w));
      let top = p.y;
      if (bandBottom - bandTop < 300 || h > bandBottom - bandTop - 12) {
        const wide = Math.min(460, W - 40);
        const h2 = measure(wide);
        left = (W - wide) / 2;
        top = Math.min(bandBottom + 12, H - 20 - h2);
        anch = { left: Math.round(left), top: Math.round(Math.max(20, top)), width: Math.round(wide), height: Math.round(h2), dir: "box", at: 0 };
      } else {
        top = Math.max(bandTop + 6, Math.min(top, bandBottom - h - 6));
        const box = [left, top, left + w, top + h];
        const hit = avoid.some((a) => !(box[2] <= a[0] - 8 || box[0] >= a[2] + 8 || box[3] <= a[1] - 8 || box[1] >= a[3] + 8));
        if (!hit) anch = { left: Math.round(left), top: Math.round(top), width: Math.round(w), height: Math.round(h), dir: "box", at: 0 };
      }
    }
    if (!anch && mine && map && el) {
      anch = placeBox({ W, H, face: px(mine.rect), avoid, prefer: mine.side, measure });
    }
    if (el) el.style.width = "";
    // Let the picture finish moving (pushing in or out, or panning to the next
    // speaker) before the box appears over it.
    const view = `${cur}|${pos.join(",")}|${ln.zoom ? "z" : ""}`;
    const delay = prevZoom.current && prevZoom.current !== view ? 0.95 : 0;
    prevZoom.current = view;
    setLay({ line: i, anch, zoom, delay, pos, contain });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, vpTick]);

  // Stage the line.
  useEffect(() => {
    const run = (cutScene) => {
      if (onLine) onLine(line.who);

      if (line.mist !== undefined) {
        setMist(line.mist === "off" ? "" : line.mist);
        if (line.mist === "gust") later(() => setMist((m) => (m === "gust" ? "roll" : m)), 1800);
      }
      if (scenes && "scene" in line) showScene(line.scene || "", cutScene || !!line.cut);
      const cur = sceneRef.current;
      const pos = posFor(line, cur);
      setScenePos(pos);
      focusRef.current = line.focusAt
        ? { ...line.focusAt, pos }
        : line.focus && scenes && scenes.focus && scenes.focus[cur]
        ? { ...scenes.focus[cur], pos }
        : null;
      flyRef.current = line.fly && scenes && scenes.fly && scenes.fly[cur] ? { ...scenes.fly[cur], pos } : null;
      setFocusOn(!!focusRef.current);
      if (!focusRef.current) setFocus(null);
      if (!flyRef.current) setFly(null);
      later(layoutExtras, 60);

      if (!line.narr) {
        const c = cast[line.who];
        const sd = line.pair ? (line.pair[0] === line.who ? "left" : "right") : c.side;
        const other = sd === "left" ? "right" : "left";
        stage(sd, c, line.who, { pose: line.pose, mem: line.mem, sil: line.sil, reveal: line.reveal });
        lastPose.current[line.who] = line.pose || "close";
        if (continuity && !line.noPartner) {
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
    };
    if ((line.flash || line.whip) && fxDone.current !== i) {
      // a fade to white, or a whip-pan, first; then the line itself
      fxDone.current = i;
      if (line.whip) {
        setFx("whip-out");
        later(
          () => {
            run(true);
            setFx("whip-in");
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                setFx("whip-settle");
                later(() => setFx(null), 380);
              }),
            );
          },
          reducedMotion ? 0 : 210,
        );
      } else {
        setFx("flash");
        later(
          () => {
            run(true);
            later(() => setFx(null), 250);
          },
          reducedMotion ? 60 : 1100,
        );
      }
      return;
    }
    run(false);
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

  const advance = () => {
    if (leaving || fx) return;
    const j = firstFrom(i + 1);
    if (j >= lines.length) {
      end();
      return;
    }
    if ("scene" in lines[j]) sceneKey.current = lines[j].scene || "";
    setI(j);
  };
  // A line that asks a question waits for the answer.
  const next = () => {
    if (lines[i].choices || fx) return;
    advance();
  };
  const nextRef = useRef(next);
  nextRef.current = next;
  const choose = (o) => {
    if (lines[i].pick) lines[i].pick(o);
    advance();
  };

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
    const hide = gone || (line.noPartner && s !== side);
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={p.src}
        alt={p.alt}
        className={`d1-por ${s}${p.flip ? " flip" : ""}${p.mem ? " mem" : ""}${p.sil ? " sil" : ""}${
          p.reveal ? " reveal" : ""
        }${p.out ? " out" : " in"}${dim ? " dim" : ""}${hide ? " gone" : ""}`}
      />
    );
  };

  const parch = !!line.parch;
  const hasScene = !!sceneShown;
  const anyPort = !!(ports.left || ports.right);
  const porDim = hasScene && !gone && (narr ? anyPort : true);
  const holdPos = scenes && scenes.size && lay.line === i && lay.pos ? lay.pos : scenePos;
  const objPos = `${holdPos[0] * 100}% ${holdPos[1] * 100}%`;
  const contain = !!(scenes && scenes.fit && scenes.fit[sceneKey.current] === "contain");

  // Day Three: a speaker whose face is in the picture has the box beside it.
  const faces = scenes && scenes.faces && scenes.faces[sceneKey.current];
  const hasFace = !!(scenes && scenes.size && ((faces && !narr && faces[line.who]) || line.anchor));
  const measured = lay.line === i;
  const anchored = hasFace && (!measured || !!lay.anch); // false once placing failed: the usual place
  const placed = anchored && measured ? lay.anch : null;
  const zoomStyle =
    measured && lay.zoom
      ? { transformOrigin: "0 0", transform: `translate(${lay.zoom.tx}px, ${lay.zoom.ty}px) scale(${lay.zoom.z})` }
      : {};
  const boxCls = anchored
    ? `d1-box anch${placed ? ` anch-${placed.dir}` : ""}${parch ? " parch compact" : line.thought ? " think" : ""}`
    : `d1-box${parch ? " parch" : line.thought && !narr ? ` think from-${side}` : ""}`;
  const boxStyle = anchored
    ? placed
      ? { left: placed.left, top: placed.top, width: placed.width, "--at": `${placed.at}px`, "--anch-delay": `${lay.delay}s` }
      : { left: 0, top: 0, visibility: "hidden" }
    : undefined;

  return (
    <div
      ref={rootRef}
      className={`d1-dlg${closing ? " closing" : ""}${leaving ? " leaving" : ""}${hasScene ? " has-scene" : ""}${
        porDim ? " por-dim" : ""
      }${focusOn ? " focus-k" : ""}${lowThink ? " low-think" : ""}${fx ? ` fx-${fx}` : ""}${
        fx && fx !== "flash" ? " whipping" : ""
      }`}
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
            style={{ objectPosition: objPos, objectFit: contain ? "contain" : undefined, ...zoomStyle }}
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
              objectFit: contain ? "contain" : undefined,
              ...zoomStyle,
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
      <div className={`d1-mist${mist ? ` ${mist}` : ""}`} aria-hidden="true">
        <i />
        <i />
      </div>
      {renderPor("left")}
      {renderPor("right")}
      <div className={`d1-smoke left${closing ? "" : activeMemSide === "left" ? " on" : ""}`} aria-hidden="true" />
      <div className={`d1-smoke right${closing ? "" : activeMemSide === "right" ? " on" : ""}`} aria-hidden="true" />
      <div key={anchored ? `a${i}` : "box"} ref={boxRef} className={boxCls} style={boxStyle}>
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <p className="d1-name">
          {parch ? line.title || null : narr ? null : speaker.name}
          {narr || parch ? null : line.mem ? (
            <small>remembered</small>
          ) : line.sil && !line.reveal ? (
            <small>unseen</small>
          ) : line.thought ? (
            <small>thinking</small>
          ) : null}
        </p>
        <p
          className={`d1-text${line.thought && !narr && !parch ? " thought" : ""}${narr ? " narr" : ""}${parch ? " parch-text" : ""}`}
          aria-live="polite"
        >
          {line.text}
          {line.gloss && <span className="d1-gloss">{line.gloss}</span>}
        </p>
        {line.choices && (
          <div className="d1-choices">
            {line.choices.map((o) => (
              <button
                key={o.t}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  choose(o);
                }}
              >
                {o.t}
              </button>
            ))}
          </div>
        )}
        <div className="d1-ctl">
          <span>Tap or press Enter</span>
          <button type="button" data-skip ref={skipRef}>
            Skip
          </button>
        </div>
      </div>
      <div className={`d1-flash${fx === "flash" ? " on" : ""}`} aria-hidden="true" />
    </div>
  );
}
