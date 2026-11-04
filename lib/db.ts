import 'server-only';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

const url = process.env.POSTGRES_URL ?? process.env.POSTGRES_DATABASE_URL;

/** null when no database is configured; public reads fall back to defaults. */
export const db = url ? drizzle(neon(url), { schema }) : null;
export type Db = NonNullable<typeof db>;

export function requireDb(): Db {
  if (!db) throw new Error('POSTGRES_URL is not set. Add it to .env.');
  return db;
}
