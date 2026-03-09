import { sql } from "drizzle-orm";
import { timestamp, uuid, text } from "drizzle-orm/pg-core";

export const id = () => uuid("id").defaultRandom().primaryKey();

export const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).defaultNow().notNull();

export const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => sql`now()`);

export const actorText = () => text("actor").notNull().default("system");
