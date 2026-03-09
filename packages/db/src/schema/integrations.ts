import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "./shared";

export const githubInstallations = pgTable("github_installations", {
  id: id(),
  installationId: text("installation_id").notNull(),
  accountLogin: text("account_login").notNull(),
  accountType: text("account_type").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const repositories = pgTable("repositories", {
  id: id(),
  installationRefId: uuid("installation_ref_id").references(
    () => githubInstallations.id,
    { onDelete: "cascade" },
  ),
  fullName: text("full_name").notNull(),
  defaultBranch: text("default_branch").notNull().default("main"),
  language: text("language"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
