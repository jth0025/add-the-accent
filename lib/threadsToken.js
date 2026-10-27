import { dbReady, sql } from "@/lib/db";

// The Threads access token lives in the database so the site can renew it
// itself. Until one is saved there, THREADS_ACCESS_TOKEN from Vercel is used.
// Exchanging a short-lived token needs THREADS_APP_SECRET (the Threads app
// secret from the app's Threads settings).
const AUTH = "https://graph.threads.net";
const DAY = 24 * 60 * 60 * 1000;
const RENEW_WITHIN_DAYS = 20;
const ASSUMED_DAYS = 30;

let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  await sql`
    create table if not exists threads_token (
      id int primary key,
      token text not null,
      expires_at timestamptz not null,
      saved_at timestamptz not null default now()
    )`;
  tableReady = true;
}

async function stored() {
  if (!dbReady()) return null;
  try {
    await ensureTable();
    const [row] = await sql`select token, expires_at, saved_at from threads_token where id = 1`;
    return row || null;
  } catch {
    return null;
  }
}

async function save(token, expiresInSeconds) {
  await ensureTable();
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
  await sql`
    insert into threads_token (id, token, expires_at, saved_at) values (1, ${token}, ${expiresAt}, now())
    on conflict (id) do update set token = excluded.token, expires_at = excluded.expires_at, saved_at = now()`;
  return expiresAt;
}

async function authCall(path, params) {
  const res = await fetch(`${AUTH}${path}?${new URLSearchParams(params)}`);
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || "Threads token request failed");
  return data;
}

// The token to post with: the saved one while it is still valid, else Vercel's.
export async function getToken() {
  const row = await stored();
  if (row && new Date(row.expires_at).getTime() > Date.now()) return row.token;
  return process.env.THREADS_ACCESS_TOKEN;
}

// Swaps a short-lived token (about an hour) for a 60-day one and saves it.
export async function exchangeShortToken(shortToken) {
  const secret = process.env.THREADS_APP_SECRET;
  if (!secret) throw new Error("THREADS_APP_SECRET is not set in Vercel yet.");
  const token = shortToken.trim();
  try {
    const data = await authCall("/access_token", {
      grant_type: "th_exchange_token",
      client_secret: secret,
      access_token: token,
    });
    return save(data.access_token, data.expires_in);
  } catch (e) {
    // Meta's generator may already hand out a 60-day token, which can not be
    // exchanged. If this one works for the account, keep it as it is. Its real
    // end date is unknown, so assume a short one: the daily job starts
    // renewing it (which sets the true 60 days) once it is under 20 days away.
    const res = await fetch(`https://graph.threads.com/v1.0/me?${new URLSearchParams({ fields: "id,username", access_token: token })}`);
    const me = await res.json();
    if (res.ok && !me.error) return save(token, ASSUMED_DAYS * 24 * 60 * 60);
    throw e;
  }
}

// Gives the saved token another 60 days once it is near the end. Safe to
// call every day: it does nothing until the token is within 20 days of expiry.
export async function renewIfDue({ force = false } = {}) {
  const row = await stored();
  if (!row) return { renewed: false, reason: "no-saved-token" };
  const left = new Date(row.expires_at).getTime() - Date.now();
  if (left <= 0) return { renewed: false, reason: "expired" };
  if (!force && left > RENEW_WITHIN_DAYS * DAY) return { renewed: false, reason: "not-due" };
  const data = await authCall("/refresh_access_token", {
    grant_type: "th_refresh_token",
    access_token: row.token,
  });
  const expiresAt = await save(data.access_token, data.expires_in);
  return { renewed: true, expiresAt };
}

// For the admin page: where the token comes from and when it runs out.
export async function tokenStatus() {
  const row = await stored();
  if (!row) return { source: process.env.THREADS_ACCESS_TOKEN ? "vercel" : "none", expiresAt: null, expired: false };
  const expired = new Date(row.expires_at).getTime() <= Date.now();
  return { source: expired ? "expired" : "saved", expiresAt: row.expires_at, expired };
}
