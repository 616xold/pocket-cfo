import type { Env } from "./index";

const TEST_DATABASE_SUFFIX = "_test";

export function resolveTestDatabaseUrl(
  env: Pick<Env, "DATABASE_URL" | "TEST_DATABASE_URL">,
) {
  const explicitTestDatabaseUrl = env.TEST_DATABASE_URL?.trim();
  if (explicitTestDatabaseUrl) {
    return assertSafeTestDatabaseUrl(explicitTestDatabaseUrl, env.DATABASE_URL);
  }

  return deriveTestDatabaseUrl(env.DATABASE_URL);
}

export function deriveTestDatabaseUrl(databaseUrl: string) {
  const parsedDatabaseUrl = parseDatabaseUrl(databaseUrl, "DATABASE_URL");
  const databaseName = getDatabaseName(parsedDatabaseUrl, "DATABASE_URL");
  const derivedDatabaseName = databaseName.endsWith(TEST_DATABASE_SUFFIX)
    ? databaseName
    : `${databaseName}${TEST_DATABASE_SUFFIX}`;

  parsedDatabaseUrl.pathname = `/${derivedDatabaseName}`;
  return assertSafeTestDatabaseUrl(parsedDatabaseUrl.toString(), databaseUrl);
}

function assertSafeTestDatabaseUrl(
  testDatabaseUrl: string,
  sourceDatabaseUrl: string,
) {
  const parsedTestDatabaseUrl = parseDatabaseUrl(
    testDatabaseUrl,
    "TEST_DATABASE_URL",
  );
  const testDatabaseName = getDatabaseName(
    parsedTestDatabaseUrl,
    "TEST_DATABASE_URL",
  );
  const sourceDatabaseName = getDatabaseName(
    parseDatabaseUrl(sourceDatabaseUrl, "DATABASE_URL"),
    "DATABASE_URL",
  );

  if (!testDatabaseName.endsWith(TEST_DATABASE_SUFFIX)) {
    throw new Error(
      `Refusing to use TEST_DATABASE_URL for "${testDatabaseName}". Use a dedicated *_test database.`,
    );
  }

  if (testDatabaseName === sourceDatabaseName) {
    throw new Error(
      "Refusing to use TEST_DATABASE_URL because it resolves to the same database as DATABASE_URL.",
    );
  }

  return parsedTestDatabaseUrl.toString();
}

function parseDatabaseUrl(databaseUrl: string, variableName: string) {
  try {
    return new URL(databaseUrl);
  } catch {
    throw new Error(`${variableName} must be a valid database URL.`);
  }
}

function getDatabaseName(parsedDatabaseUrl: URL, variableName: string) {
  const databaseName = parsedDatabaseUrl.pathname.replace(/^\/+/, "");
  if (!databaseName) {
    throw new Error(
      `${variableName} must include a database name to resolve the test database.`,
    );
  }

  return databaseName;
}
