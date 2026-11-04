import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from './_db.mts';

await migrate(db, { migrationsFolder: './db/migrations' });
console.log('migrations applied');
