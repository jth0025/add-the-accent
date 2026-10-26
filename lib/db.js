import { neon } from "@neondatabase/serverless";

// The database connection is made on first use, so the site still builds and
// runs (with the sentence wall switched off) until DATABASE_URL is set.
let client = null;

export function dbReady() {
  return Boolean(process.env.DATABASE_URL);
}

export function sql(...args) {
  if (!client) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set.");
    client = neon(process.env.DATABASE_URL);
  }
  return client(...args);
}

// The site's "today", pinned to LA time so the day flips at your midnight.
export function todayLA() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(new Date());
}
