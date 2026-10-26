import { sql, todayLA } from "@/lib/db";
import { publishPost } from "@/lib/threads";
import { wordForDate } from "@/lib/words";

// The text of a day's Threads post.
export function wordPostText(entry) {
  return [
    `Word of the Day: ${entry.word}`,
    `${entry.pron} · ${entry.pos}`,
    "",
    entry.def,
    "",
    `Use ${entry.word} in a sentence at addtheaccent.com`,
  ].join("\n");
}

// Posts today's word to Threads and links the post to today, so approved
// sentences reply under it. Does nothing if today already has a post.
// With dryRun it only reports what it would post.
export async function postTodaysWord({ dryRun = false } = {}) {
  const date = todayLA();
  const entry = wordForDate(date);
  const text = wordPostText(entry);

  const [existing] = await sql`
    select threads_post_id from word_chat_threads_posts where word_date = ${date}`;
  if (existing) {
    return { date, word: entry.word, posted: false, reason: "already-linked", postId: existing.threads_post_id, text };
  }
  if (dryRun) return { date, word: entry.word, posted: false, reason: "dry-run", text };

  const postId = await publishPost(text);
  await sql`
    insert into word_chat_threads_posts (word_date, threads_post_id) values (${date}, ${postId})
    on conflict (word_date) do nothing`;
  return { date, word: entry.word, posted: true, postId, text };
}
