import { dbReady } from "@/lib/db";
import { postTodaysWord } from "@/lib/wordPost";

export const dynamic = "force-dynamic";

// Run once a day by Vercel Cron (see vercel.json): posts the Word of the Day
// to Threads and links the post for the sentence wall. Vercel sends
// "Authorization: Bearer <CRON_SECRET>"; anything else is turned away.
// Add ?dry=1 to see the post without publishing it.
export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Not allowed." }, { status: 401 });
  }
  if (!dbReady()) return Response.json({ error: "DATABASE_URL is not set yet." }, { status: 503 });

  const dryRun = new URL(req.url).searchParams.get("dry") === "1";
  try {
    return Response.json(await postTodaysWord({ dryRun }));
  } catch (e) {
    return Response.json({ error: `Could not post: ${e.message}` }, { status: 502 });
  }
}
