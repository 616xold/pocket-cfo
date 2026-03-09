import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getPool, createDb } from "./client";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/pocket_cto";
const migrationsFolder = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "drizzle",
);

async function main() {
  const db = createDb(connectionString);
  await migrate(db, { migrationsFolder });
  await getPool(connectionString).end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
