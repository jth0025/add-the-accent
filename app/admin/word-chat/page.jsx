"use client";

import { useState } from "react";

// Your private moderation page at /admin/word-chat. Not linked anywhere on the site.
export default function WordChatAdmin() {
  const [key, setKey] = useState("");
  const [data, setData] = useState(null);
  const [note, setNote] = useState("");

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
        <h2 className="mb-2 text-lg">Today’s Threads post ({data.date})</h2>
        <p className="mb-3 text-sm text-neutral-600">
          {data.linkedPostId ? "Linked. Approved sentences will reply under it." : "Pick the post that holds today’s word."}
        </p>
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
