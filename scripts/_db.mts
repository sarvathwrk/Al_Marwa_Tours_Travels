import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';

const url = process.env.POSTGRES_URL ?? process.env.POSTGRES_DATABASE_URL;
if (!url) {
  console.error('POSTGRES_URL missing. Run scripts through npm (they load .env).');
  process.exit(1);
}
export const db = drizzle(neon(url), { schema });
export { schema };
