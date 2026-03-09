import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pools = new Map<string, Pool>();

export function getPool(connectionString: string): Pool {
  const existingPool = pools.get(connectionString);
  if (existingPool) {
    return existingPool;
  }

  const pool = new Pool({ connectionString });
  pools.set(connectionString, pool);
  return pool;
}

export function createDb(connectionString: string) {
  return drizzle(getPool(connectionString), { schema });
}

export type Db = ReturnType<typeof createDb>;
export type DbTransaction = Parameters<Parameters<Db["transaction"]>[0]>[0];
export type DbExecutor = Db | DbTransaction;

export async function closePool(connectionString: string) {
  const pool = pools.get(connectionString);
  if (!pool) {
    return;
  }

  pools.delete(connectionString);
  await pool.end();
}

export async function closeAllPools() {
  const openPools = [...pools.values()];
  pools.clear();

  await Promise.all(openPools.map(async (pool) => pool.end()));
}
