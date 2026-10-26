import { dbReady, sql, todayLA } from "@/lib/db";

export const dynamic = "force-dynamic";

// Approved sentences for the thread, oldest first.
export async function GET() {
  if (!dbReady()) return Response.json([]);
  try {
    const rows = await sql`
      select id, name, handle, sentence, word, created_at
      from word_chat_sentences where status = 'approved'
      order by created_at desc limit 60`;
    return Response.json(rows.reverse());
  } catch {
    return Response.json([]);
  }
}

const HANDLE = /^[A-Za-z0-9._]{1,30}$/;

export async function POST(req) {
  if (!dbReady()) return err("The sentence wall isn\u2019t open yet. Check back soon.");
  try {
    return await handlePost(req);
  } catch {
    return err("Couldn\u2019t send. Try again.");
  }
}

async function handlePost(req) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return Response.json({ ok: true }); // honeypot: bots fill hidden fields

  const name = String(b.name || "").trim().slice(0, 40);
  const handle = String(b.handle || "").trim().replace(/^@/, "");
  const sentence = String(b.sentence || "").trim();
  const word = String(b.word || "").trim();

  if (!name) return err("Enter your name.");
  if (!HANDLE.test(handle)) return err("Enter a valid Threads handle.");
  if (!sentence || sentence.length > 280) return err("Keep your sentence under 280 characters.");
  const stem = word.length > 4 ? word.slice(0, -1) : word;
  if (!sentence.toLowerCase().includes(stem.toLowerCase())) return err(`Use “${word}” in your sentence.`);

  const date = todayLA();
  const [{ count }] = await sql`
    select count(*)::int as count from word_chat_sentences
    where lower(handle) = lower(${handle}) and word_date = ${date}`;
  if (count >= 3) return err("You’ve posted 3 sentences today. Come back tomorrow.");

  await sql`
    insert into word_chat_sentences (word_date, word, name, handle, sentence)
    values (${date}, ${word}, ${name}, ${handle}, ${sentence})`;
  return Response.json({ ok: true });
}

function err(message) {
  return Response.json({ error: message }, { status: 400 });
}
