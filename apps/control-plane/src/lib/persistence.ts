import type { DbExecutor } from "@pocket-cto/db";

export type PersistenceSession =
  | { kind: "memory" }
  | { kind: "db"; executor: DbExecutor };

export interface TransactionalRepository {
  transaction<T>(
    operation: (session: PersistenceSession) => Promise<T>,
  ): Promise<T>;
}

export function createMemorySession(): PersistenceSession {
  return { kind: "memory" };
}

export function createDbSession(executor: DbExecutor): PersistenceSession {
  return { kind: "db", executor };
}

export function getDbExecutor(
  session?: PersistenceSession,
): DbExecutor | undefined {
  if (!session || session.kind !== "db") {
    return undefined;
  }

  return session.executor;
}
