"use client";

import { useState } from "react";

// Your private moderation page at /admin/word-chat. Not linked anywhere on the site.
export default function WordChatAdmin() {
  const [key, setKey] = useState("");
  const [data, setData] = useState(null);
  const [note, setNote] = useState("");
  const [shortToken, setShortToken] = useState("");

  async function load(k = key) {
    const res = await fetch("/api/word-chat/admin", { headers: { "x-admin-key": k } });
    const json = await res.json();
    if (!res.ok) return setNote(json.error);
    setData(json); setNote("");
  }

  async function act(body) {
    const res = await fetch("/api/word-chat/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) return setNote(json.error);
    if (body.action === "setToken") {
      setShortToken("");
      setNote("Saved. The site will keep this token renewed by itself.");
    }
    if (body.action === "postWord") setNote(json.posted ? `Posted today\u2019s word (${json.word}) to Threads.` : "Today\u2019s word already has a post.");
    if (body.action === "approve") setNote(json.postedToThreads ? "Approved and posted to Threads." : "Approved on the site. Link today’s Threads post to also post it there.");
    load();
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-md p-8">
        <h1 className="mb-4 text-2xl">Word chat moderation</h1>
        <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Admin key"
          className="mb-3 w-full rounded border px-3 py-2" />
        <button onClick={() => load()} className="rounded bg-black px-4 py-2 text-white">Open</button>
        {note && <p className="mt-3 text-sm text-red-700">{note}</p>}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-8">
      <h1 className="text-2xl">Word chat moderation</h1>
      {note && <p className="rounded bg-neutral-100 p-3 text-sm">{note}</p>}

      <section>
        <h2 className="mb-2 text-lg">Threads connection</h2>
        <p className="mb-3 text-sm text-neutral-600">
          {data.token.source === "saved" && "Connected. The site renews the token by itself."}
          {data.token.source === "expired" && "The saved token has expired. Paste a fresh short-lived token below."}
          {data.token.source === "vercel" && "Using the token from Vercel. Paste a short-lived token below to let the site keep it renewed."}
          {data.token.source === "none" && "No token yet. Paste a short-lived token below."}
        </p>
        <div className="flex gap-2">
          <input type="password" value={shortToken} onChange={(e) => setShortToken(e.target.value)}
            placeholder="Short-lived token from Meta" className="w-full rounded border px-3 py-2 text-sm" />
          <button onClick={() => act({ action: "setToken", shortToken })} disabled={!shortToken.trim()}
            className="shrink-0 rounded bg-black px-3 py-1 text-sm text-white disabled:opacity-40">
            Save token
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg">Today’s Threads post ({data.date})</h2>
        <p className="mb-3 text-sm text-neutral-600">
          {data.linkedPostId
            ? "Linked. Approved sentences will reply under it."
            : "The site posts the word to Threads by itself just after midnight (LA). If it hasn\u2019t yet, post it now, or pick a post you made yourself."}
        </p>
        {!data.linkedPostId && (
          <button onClick={() => act({ action: "postWord" })} className="mb-3 rounded bg-black px-3 py-1 text-sm text-white">
            Post today’s word to Threads now
          </button>
        )}
        <ul className="space-y-2">
          {data.posts.map((p) => (
            <li key={p.id} className="flex items-start justify-between gap-3 rounded border p-3 text-sm">
              <span className="line-clamp-2">{p.text || "(no text)"}</span>
              <button onClick={() => act({ action: "link", postId: p.id })}
                className="shrink-0 rounded border px-3 py-1">
                {data.linkedPostId === p.id ? "Linked" : "Use this"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-lg">Waiting for approval ({data.pending.length})</h2>
        {data.pending.length === 0 && <p className="text-sm text-neutral-600">All caught up.</p>}
        <ul className="space-y-2">
          {data.pending.map((s) => (
            <li key={s.id} className="rounded border p-3 text-sm">
              <p className="mb-1">{s.sentence}</p>
              <p className="mb-2 text-neutral-500">
                {s.name},{" "}
                <a href={`https://www.threads.com/@${s.handle}`} target="_blank" rel="noopener noreferrer" className="underline">@{s.handle}</a>
                {" "}· word: {s.word}
              </p>
              <div className="flex gap-2">
                <button onClick={() => act({ action: "approve", id: s.id })} className="rounded bg-black px-3 py-1 text-white">Approve</button>
                <button onClick={() => act({ action: "reject", id: s.id })} className="rounded border px-3 py-1">Reject</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
