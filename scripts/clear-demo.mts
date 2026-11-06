// Removes the demo data added by seed-demo.mts. Only rows with an @sample.invalid email are touched,
// and demo groups (notes starting "DEMO:") that no real customer belongs to.
import { and, like, sql } from 'drizzle-orm';
import { db, schema } from './_db.mts';

const DEMO = '%@sample.invalid';
const c = await db.delete(schema.customers).where(like(schema.customers.email, DEMO)).returning({ id: schema.customers.id });
const e = await db.delete(schema.enquiries).where(like(schema.enquiries.email, DEMO)).returning({ id: schema.enquiries.id });
const s = await db.delete(schema.subscribers).where(like(schema.subscribers.email, DEMO)).returning({ id: schema.subscribers.id });

const inUse = sql`(select distinct ${schema.customers.groupId} from ${schema.customers})`;
const g = await db
  .delete(schema.travelGroups)
  .where(and(like(schema.travelGroups.notes, 'DEMO:%'), sql`${schema.travelGroups.id} not in ${inUse}`))
  .returning({ id: schema.travelGroups.id });
console.log(`removed ${c.length} customers, ${g.length} groups, ${e.length} enquiries, ${s.length} subscribers`);
