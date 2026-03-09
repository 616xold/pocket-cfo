import { jsonb, pgEnum, pgTable, text, uuid, integer } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./shared";

export const twinEntityTypeEnum = pgEnum("twin_entity_type", [
  "repository",
  "service",
  "package",
  "owner",
  "testSuite",
  "ciJob",
  "runbook",
  "dashboard",
  "flag",
  "doc",
]);

export const twinFreshnessStatusEnum = pgEnum("twin_freshness_status", [
  "fresh",
  "stale",
  "unknown",
]);

export const twinEntities = pgTable("twin_entities", {
  id: id(),
  type: twinEntityTypeEnum("type").notNull(),
  key: text("key").notNull(),
  title: text("title").notNull(),
  repo: text("repo"),
  freshnessStatus: twinFreshnessStatusEnum("freshness_status")
    .notNull()
    .default("unknown"),
  lastObservedAt: text("last_observed_at"),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const twinEdges = pgTable("twin_edges", {
  id: id(),
  fromEntityId: uuid("from_entity_id")
    .references(() => twinEntities.id, { onDelete: "cascade" })
    .notNull(),
  toEntityId: uuid("to_entity_id")
    .references(() => twinEntities.id, { onDelete: "cascade" })
    .notNull(),
  relationType: text("relation_type").notNull(),
  sourceRef: text("source_ref"),
  weight: integer("weight").notNull().default(1),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
