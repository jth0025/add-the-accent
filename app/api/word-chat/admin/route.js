import { dbReady, sql, todayLA } from "@/lib/db";
import { replyOnThreads, recentPosts } from "@/lib/threads";
import { postTodaysWord } from "@/lib/wordPost";

export const dynamic = "force-dynamic";

const authed = (req) =>
  Boolean(process.env.WORD_CHAT_ADMIN_KEY) &&
  req.headers.get("x-admin-key") === process.env.WORD_CHAT_ADMIN_KEY;
const notReady = () => Response.json({ error: "DATABASE_URL is not set yet." }, { status: 503 });
const deny = () => Response.json({ error: "Wrong admin key." }, { status: 401 });

export async function GET(req) {
  if (!authed(req)) return deny();
  if (!dbReady()) return notReady();
  const date = todayLA();
  const pending = await sql`
    select * from word_chat_sentences where status = 'pending' order by created_at asc`;
  const [linked] = await sql`
    select threads_post_id from word_chat_threads_posts where word_date = ${date}`;
  let posts = [];
  try { posts = await recentPosts(); } catch {}
  return Response.json({ date, pending, linkedPostId: linked?.threads_post_id || null, posts });
}

export async function POST(req) {
  if (!authed(req)) return deny();
  if (!dbReady()) return notReady();
  const { action, id, postId } = await req.json();

  if (action === "postWord") {
    try {
      return Response.json({ ok: true, ...(await postTodaysWord()) });
    } catch (e) {
      return Response.json({ error: `Not posted. Threads said: ${e.message}` }, { status: 502 });
    }
  }

  if (action === "link") {
    await sql`
      insert into word_chat_threads_posts (word_date, threads_post_id) values (${todayLA()}, ${postId})
      on conflict (word_date) do update set threads_post_id = excluded.threads_post_id`;
    return Response.json({ ok: true });
  }

  const [row] = await sql`select * from word_chat_sentences where id = ${id}`;
  if (!row) return Response.json({ error: "Sentence not found." }, { status: 404 });

  if (action === "reject") {
    await sql`update word_chat_sentences set status = 'rejected' where id = ${id}`;
    return Response.json({ ok: true });
  }

  if (action === "approve") {
    const [link] = await sql`
      select threads_post_id from word_chat_threads_posts where word_date = ${row.word_date}`;
    let replyId = null;
    if (link) {
      try {
        replyId = await replyOnThreads({
          replyToId: link.threads_post_id, name: row.name, handle: row.handle, sentence: row.sentence,
        });
      } catch (e) {
        return Response.json({ error: `Not approved. Threads said: ${e.message}` }, { status: 502 });
      }
    }
    await sql`
      update word_chat_sentences set status = 'approved', threads_reply_id = ${replyId} where id = ${id}`;
    return Response.json({ ok: true, postedToThreads: Boolean(replyId) });
  }

  return Response.json({ error: "Unknown action." }, { status: 400 });
}
