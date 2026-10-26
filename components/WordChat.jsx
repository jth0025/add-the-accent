"use client";

import { useEffect, useRef, useState } from "react";
import "./word-chat.css";
import { PlantLeft, PlantRight } from "./WordChatDecor";

// Sits directly under the Word of the Day box. That box has square bottom
// corners so the two read as one piece.
const THREADS_HANDLE = "addtheaccent"; // the Threads account visitors follow


// Today's word is red; any other day's word gets its own colour (the same one
// every time, chosen from the word itself). Each has a deeper tone for the
// light bubbles and a lighter one for the dark ones.
const RED = ["#c4261d", "#ff8f82"];
const OTHERS = [
  ["#1d5fb4", "#8fc0ff"],
  ["#2e7d32", "#9be39f"],
  ["#7b3fb5", "#d2b0ff"],
  ["#00796b", "#7fe3d4"],
  ["#c25a00", "#ffc07a"],
  ["#b0286b", "#ff9ccb"],
];
// One colour per word on the wall: today's word is red, and each other word
// takes the colour its name points to, moving on to the next free one if
// another word already has it, so two different words never share a colour.
function colorMap(words, todaysWord) {
  const map = new Map();
  const taken = new Set();
  const today = todaysWord.toLowerCase();
  map.set(today, RED);
  for (const raw of words) {
    const w = raw.toLowerCase();
    if (map.has(w)) continue;
    let h = 0;
    for (const ch of w) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    let i = h % OTHERS.length;
    for (let tries = 0; taken.has(i) && tries < OTHERS.length; tries++) i = (i + 1) % OTHERS.length;
    taken.add(i);
    map.set(w, OTHERS[i]);
  }
  return map;
}

// The sentence with the word (and its endings, like "sillages") coloured.
function Highlighted({ text, word, colors, dark }) {
  if (!word) return text;
  const stem = word.length > 4 ? word.slice(0, -1) : word;
  const re = new RegExp(`(${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\p{L}\u2019'-]*)`, "giu");
  const parts = text.split(re);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="wc-mark" style={{ color: dark ? colors[1] : colors[0] }}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export default function WordChat({ word }) {
  const [messages, setMessages] = useState([]);
  const [mine, setMine] = useState([]); // this visitor's posts awaiting approval
  const [followed, setFollowed] = useState(false);
  const [form, setForm] = useState({ name: "", handle: "", sentence: "", website: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const threadRef = useRef(null);

  useEffect(() => {
    try {
      setFollowed(localStorage.getItem("wordchat-followed") === "1");
      const saved = JSON.parse(localStorage.getItem("wordchat-me") || "{}");
      setForm((f) => ({ ...f, name: saved.name || "", handle: saved.handle || "" }));
    } catch {}
    fetch("/api/word-chat")
      .then((r) => r.json())
      .then((rows) => Array.isArray(rows) && setMessages(rows))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, mine]);

  function follow() {
    window.open(`https://www.threads.com/@${THREADS_HANDLE}`, "_blank", "noopener");
    setFollowed(true);
    try { localStorage.setItem("wordchat-followed", "1"); } catch {}
  }

  function update(key) {
    return (e) => { setForm({ ...form, [key]: e.target.value }); setError(""); };
  }

  async function send(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    const res = await fetch("/api/word-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, word }),
    }).catch(() => null);
    setSending(false);
    const data = res ? await res.json().catch(() => ({})) : {};
    if (!res || !res.ok) return setError(data.error || "Couldn’t send. Try again.");

    const handle = form.handle.trim().replace(/^@/, "");
    setMine([...mine, { id: `me-${Date.now()}`, name: form.name.trim(), handle,
      sentence: form.sentence.trim(), created_at: new Date().toISOString() }]);
    setForm({ ...form, sentence: "" });
    try { localStorage.setItem("wordchat-me", JSON.stringify({ name: form.name.trim(), handle })); } catch {}
  }

  const all = [
    ...messages.map((m) => ({ ...m, pending: false })),
    ...mine.map((m) => ({ ...m, pending: true })),
  ];
  const colors = colorMap(all.map((m) => m.word || word), word);

  return (
    <div className="wc-wrap">
    <section className="wc" aria-label={`Sentences using ${word}`}>
      <div className="wc-bar" aria-hidden="true">
        <i /><i /><i />
        <span>The Sentence Wall</span>
      </div>

      <div className="wc-body">
        <div className="wc-card">
          <div className="wc-card-head">
            <span>Used in a sentence</span>
            <span>{all.length} {all.length === 1 ? "line" : "lines"}</span>
          </div>
          <div ref={threadRef} className="wc-thread" aria-live="polite">
            {all.length === 0 && (
              <p className="wc-empty">
                Be the first to use {word} today.
                <span className="wc-empty-note">an apple for the first one in</span>
              </p>
            )}
            {all.map((m, i) => {
              const day = dayLabel(m.created_at);
              const showDay = i === 0 || dayLabel(all[i - 1].created_at) !== day;
              return (
                <div key={m.id}>
                  {showDay && <p className="wc-day">{day}</p>}
                  <div className={`wc-msg ${m.pending ? "wc-msg--mine" : ""}`}>
                    <p className="wc-bubble">
                      <Highlighted
                        text={m.sentence}
                        word={m.word || word}
                        colors={colors.get((m.word || word).toLowerCase())}
                        dark={m.pending}
                      />
                    </p>
                    <p className="wc-by">
                      <b>{m.name}</b>
                      <a href={`https://www.threads.com/@${m.handle}`} target="_blank" rel="noopener noreferrer">
                        @{m.handle}
                      </a>
                      <span>{timeLabel(m.created_at)}{m.pending && " · waiting for approval"}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={send} className="wc-form">
          <h3 className="wc-title">Now your turn!</h3>

          {!followed ? (
            <div className="text-center">
              <button type="button" onClick={follow} className="wc-btn">
                Follow @{THREADS_HANDLE} on Threads
              </button>
            </div>
          ) : (
            <div className="wc-grid">
              {/* honeypot: hidden from people, filled by bots */}
              <input type="text" name="website" value={form.website} onChange={update("website")}
                tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <div className="wc-row">
                <input value={form.name} onChange={update("name")} placeholder="Your name" required maxLength={40}
                  aria-label="Your name" className="wc-input" />
                <input value={form.handle} onChange={update("handle")} placeholder="@threadshandle" required maxLength={31}
                  aria-label="Threads handle" className="wc-input" />
              </div>
              <div className="wc-row wc-row--send">
                <input value={form.sentence} onChange={update("sentence")} placeholder={`Use ${word.toLowerCase()} in a sentence`}
                  required maxLength={280} aria-label="Your sentence" className="wc-input" />
                <button type="submit" disabled={sending} aria-label="Send" className="wc-btn wc-send">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d="M3 21 L4.5 15.5 L16.5 3.5 L20.5 7.5 L8.5 19.5 Z M14.5 5.5 L18.5 9.5 M4.5 15.5 L8.5 19.5"
                      fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              {error && <p className="wc-error">{error}</p>}
            </div>
          )}
        </form>
      </div>
    </section>
    <PlantLeft />
    <PlantRight />
    {/* The writer, lying on his stomach under the sentence box, between the
        plant and the pencils, his elbows just over the bottom edge. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/word-chat/writer.webp" alt="" className="wc-writer" aria-hidden="true" />
    </div>
  );
}

function dayLabel(iso) {
  const d = new Date(iso), now = new Date();
  const start = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((start(now) - start(d)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

function timeLabel(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
