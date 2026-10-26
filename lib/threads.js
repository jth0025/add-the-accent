// Posts from YOUR Threads account only. Needs THREADS_ACCESS_TOKEN. Calls go to
// "me" (the account the token belongs to), so a wrong or missing THREADS_USER_ID
// can not break them.
const BASE = "https://graph.threads.com/v1.0";

async function call(path, params, method = "POST") {
  const body = new URLSearchParams({ ...params, access_token: process.env.THREADS_ACCESS_TOKEN });
  const url = method === "GET" ? `${BASE}${path}?${body}` : `${BASE}${path}`;
  const res = await fetch(url, method === "GET" ? {} : { method, body });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || "Threads request failed");
  return data;
}

// Reply under the day's word post as your account, tagging the visitor.
export async function replyOnThreads({ replyToId, name, handle, sentence }) {
  const text = `${name} (@${handle}): ${sentence}`.slice(0, 500);
  const userId = "me";
  const container = await call(`/${userId}/threads`, { media_type: "TEXT", text, reply_to_id: replyToId });
  const published = await call(`/${userId}/threads_publish`, { creation_id: container.id });
  return published.id;
}

// Your most recent posts, so you can pick which one is today's word.
export async function recentPosts() {
  const data = await call("/me/threads",
    { fields: "id,text,timestamp,permalink", limit: "8" }, "GET");
  return data.data || [];
}
