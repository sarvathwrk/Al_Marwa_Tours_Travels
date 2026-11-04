import { hashPassword } from '../lib/password';
import { db, schema } from './_db.mts';
import { sql } from 'drizzle-orm';

const [rawUsername, password] = process.argv.slice(2);
const username = rawUsername?.toLowerCase();

if (!username || !/^[a-z0-9._-]{3,40}$/.test(username) || !password || password.length < 10) {
  console.error('Usage: npm run admin:create -- <username 3-40 chars a-z 0-9 . _ -> <password min 10 chars>');
  process.exit(1);
}

const passwordHash = hashPassword(password);
await db
  .insert(schema.admins)
  .values({ username, passwordHash })
  .onConflictDoUpdate({
    target: schema.admins.username,
    set: {
      passwordHash,
      tokenVersion: sql`${schema.admins.tokenVersion} + 1`,
      failedAttempts: 0,
      lockedUntil: null,
    },
  });
console.log(`admin "${username}" saved (scrypt hash in table admins)`);
