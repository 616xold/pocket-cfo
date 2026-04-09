import type { SourceFileRecord } from "@pocket-cto/domain";
import { FinanceTwinExtractionError } from "./errors";

const CSV_MEDIA_TYPES = new Set([
  "application/csv",
  "application/vnd.ms-excel",
  "text/csv",
  "text/plain",
]);

const ACCOUNT_CODE_HEADERS = [
  "account_code",
  "account_number",
  "account",
  "code",
  "gl_code",
];
const ACCOUNT_NAME_HEADERS = [
  "account_name",
  "account_description",
  "description",
  "name",
];
const ACCOUNT_TYPE_HEADERS = ["account_type", "type"];
const PERIOD_END_HEADERS = [
  "as_of",
  "as_of_date",
  "period_end",
  "period_ending",
  "reporting_date",
];
const PERIOD_START_HEADERS = ["period_start", "period_start_date", "start_date"];
const DEBIT_HEADERS = ["debit", "debit_amount", "debits"];
const CREDIT_HEADERS = ["credit", "credit_amount", "credits"];
const CURRENCY_HEADERS = ["currency", "currency_code"];

export type TrialBalanceExtractionResult = {
  reportingPeriod: {
    label: string;
    periodEnd: string;
    periodKey: string;
    periodStart: string | null;
  };
  accounts: Array<{
    accountCode: string;
    accountName: string;
    accountType: string | null;
  }>;
  lines: Array<{
    accountCode: string;
    creditAmount: string;
    currencyCode: string | null;
    debitAmount: string;
    lineNumber: number;
    netAmount: string;
  }>;
};

export function supportsTrialBalanceCsvSource(
  sourceFile: Pick<SourceFileRecord, "mediaType" | "originalFileName">,
) {
  const mediaType = normalizeMediaType(sourceFile.mediaType);
  const fileExtension = getFileExtension(sourceFile.originalFileName);
  return CSV_MEDIA_TYPES.has(mediaType) || fileExtension === "csv";
}

export function extractTrialBalanceCsv(input: {
  body: Buffer;
  sourceFile: Pick<SourceFileRecord, "mediaType" | "originalFileName">;
}): TrialBalanceExtractionResult {
  if (!supportsTrialBalanceCsvSource(input.sourceFile)) {
    throw new FinanceTwinExtractionError(
      "trial_balance_not_csv",
      "The trial-balance extractor only supports CSV-like source files in F2A.",
    );
  }

  const rows = parseCsvRows(decodeText(input.body));
  const header = rows[0];

  if (!header) {
    throw new FinanceTwinExtractionError(
      "trial_balance_empty_csv",
      "Trial-balance CSV did not include a header row.",
    );
  }

  const headerLookup = new Map(
    header.map((value, index) => [normalizeHeader(value), index]),
  );
  const accountCodeIndex = getRequiredHeaderIndex(
    headerLookup,
    ACCOUNT_CODE_HEADERS,
    "account code",
  );
  const accountNameIndex = getRequiredHeaderIndex(
    headerLookup,
    ACCOUNT_NAME_HEADERS,
    "account name",
  );
  const periodEndIndex = getRequiredHeaderIndex(
    headerLookup,
    PERIOD_END_HEADERS,
    "period end",
  );
  const debitIndex = getRequiredHeaderIndex(
    headerLookup,
    DEBIT_HEADERS,
    "debit amount",
  );
  const creditIndex = getRequiredHeaderIndex(
    headerLookup,
    CREDIT_HEADERS,
    "credit amount",
  );
  const accountTypeIndex = getOptionalHeaderIndex(
    headerLookup,
    ACCOUNT_TYPE_HEADERS,
  );
  const periodStartIndex = getOptionalHeaderIndex(
    headerLookup,
    PERIOD_START_HEADERS,
  );
  const currencyIndex = getOptionalHeaderIndex(headerLookup, CURRENCY_HEADERS);

  const lines: TrialBalanceExtractionResult["lines"] = [];
  const accountsByCode = new Map<
    string,
    TrialBalanceExtractionResult["accounts"][number]
  >();
  const periodEnds = new Set<string>();
  const periodStarts = new Set<string>();

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex] ?? [];
    const lineNumber = rowIndex + 1;

    if (row.every((value) => value.trim().length === 0)) {
      continue;
    }

    const accountCode = requireCell(
      row[accountCodeIndex],
      "account code",
      lineNumber,
    );
    const accountName = requireCell(
      row[accountNameIndex],
      "account name",
      lineNumber,
    );
    const periodEnd = parseIsoDate(
      requireCell(row[periodEndIndex], "period end", lineNumber),
      "period end",
      lineNumber,
    );
    const periodStart = periodStartIndex === null
      ? null
      : readOptionalIsoDate(row[periodStartIndex], "period start", lineNumber);
    const debitAmount = parseNonNegativeMoney(
      row[debitIndex],
      "debit amount",
      lineNumber,
    );
    const creditAmount = parseNonNegativeMoney(
      row[creditIndex],
      "credit amount",
      lineNumber,
    );
    const accountType = readOptionalCell(row[accountTypeIndex ?? -1]);
    const currencyCode = normalizeCurrency(row[currencyIndex ?? -1]);
    const existingAccount = accountsByCode.get(accountCode);

    if (
      existingAccount &&
      (existingAccount.accountName !== accountName ||
        existingAccount.accountType !== accountType)
    ) {
      throw new FinanceTwinExtractionError(
        "trial_balance_account_conflict",
        `Account ${accountCode} was defined with conflicting names or types in the same trial-balance CSV.`,
      );
    }

    accountsByCode.set(accountCode, {
      accountCode,
      accountName,
      accountType,
    });
    periodEnds.add(periodEnd);
    if (periodStart) {
      periodStarts.add(periodStart);
    }

    lines.push({
      accountCode,
      debitAmount: formatMoney(debitAmount),
      creditAmount: formatMoney(creditAmount),
      netAmount: formatMoney(debitAmount - creditAmount),
      currencyCode,
      lineNumber,
    });
  }

  if (lines.length === 0) {
    throw new FinanceTwinExtractionError(
      "trial_balance_no_rows",
      "Trial-balance CSV did not include any non-empty data rows.",
    );
  }

  if (periodEnds.size !== 1) {
    throw new FinanceTwinExtractionError(
      "trial_balance_mixed_period_end",
      "Trial-balance CSV must describe exactly one reporting period in F2A.",
    );
  }

  if (periodStarts.size > 1) {
    throw new FinanceTwinExtractionError(
      "trial_balance_mixed_period_start",
      "Trial-balance CSV included multiple period starts, which is outside the F2A slice.",
    );
  }

  const periodEnd = Array.from(periodEnds)[0];

  if (!periodEnd) {
    throw new FinanceTwinExtractionError(
      "trial_balance_missing_period_end",
      "Trial-balance CSV did not resolve a reporting period end date.",
    );
  }

  return {
    reportingPeriod: {
      periodKey: periodEnd,
      label: `Trial balance as of ${periodEnd}`,
      periodStart: Array.from(periodStarts)[0] ?? null,
      periodEnd,
    },
    accounts: Array.from(accountsByCode.values()).sort((left, right) =>
      left.accountCode.localeCompare(right.accountCode),
    ),
    lines,
  };
}

function parseCsvRows(text: string) {
  if (text.length === 0) {
    return [] as string[][];
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (character === undefined) {
      break;
    }

    if (inQuotes) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          currentField += '"';
          index += 1;
          continue;
        }

        inQuotes = false;
        continue;
      }

      currentField += character;
      continue;
    }

    if (character === '"') {
      inQuotes = true;
      continue;
    }

    if (character === ",") {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") {
        index += 1;
      }

      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = "";
      continue;
    }

    currentField += character;
  }

  if (inQuotes) {
    throw new FinanceTwinExtractionError(
      "trial_balance_unterminated_quote",
      "Trial-balance CSV ended while a quoted field was still open.",
    );
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

function decodeText(body: Buffer) {
  return new TextDecoder("utf-8").decode(body).replace(/^\uFEFF/u, "");
}

function getRequiredHeaderIndex(
  headerLookup: Map<string, number>,
  candidateHeaders: string[],
  label: string,
) {
  const index = getOptionalHeaderIndex(headerLookup, candidateHeaders);

  if (index === null) {
    throw new FinanceTwinExtractionError(
      "trial_balance_missing_column",
      `Trial-balance CSV is missing the required ${label} column.`,
    );
  }

  return index;
}

function getOptionalHeaderIndex(
  headerLookup: Map<string, number>,
  candidateHeaders: string[],
) {
  for (const candidate of candidateHeaders) {
    const index = headerLookup.get(candidate);

    if (index !== undefined) {
      return index;
    }
  }

  return null;
}

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "_")
    .replace(/^_+|_+$/gu, "");
}

function requireCell(value: string | undefined, label: string, lineNumber: number) {
  const normalized = value?.trim();

  if (!normalized) {
    throw new FinanceTwinExtractionError(
      "trial_balance_missing_cell",
      `Trial-balance CSV row ${lineNumber} is missing ${label}.`,
    );
  }

  return normalized;
}

function readOptionalCell(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function readOptionalIsoDate(
  value: string | undefined,
  label: string,
  lineNumber: number,
) {
  const normalized = value?.trim();
  return normalized ? parseIsoDate(normalized, label, lineNumber) : null;
}

function parseIsoDate(value: string, label: string, lineNumber: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    throw new FinanceTwinExtractionError(
      "trial_balance_invalid_date",
      `Trial-balance CSV row ${lineNumber} has an invalid ${label}: ${value}.`,
    );
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new FinanceTwinExtractionError(
      "trial_balance_invalid_date",
      `Trial-balance CSV row ${lineNumber} has an invalid ${label}: ${value}.`,
    );
  }

  return value;
}

function parseNonNegativeMoney(
  value: string | undefined,
  label: string,
  lineNumber: number,
) {
  const cents = parseMoneyToCents(value, label, lineNumber);

  if (cents < 0n) {
    throw new FinanceTwinExtractionError(
      "trial_balance_negative_amount",
      `Trial-balance CSV row ${lineNumber} has a negative ${label}, which F2A does not accept.`,
    );
  }

  return cents;
}

function parseMoneyToCents(
  value: string | undefined,
  label: string,
  lineNumber: number,
) {
  const normalized = value?.trim() ?? "";

  if (normalized.length === 0) {
    return 0n;
  }

  const parenthesized = normalized.startsWith("(") && normalized.endsWith(")");
  const negative = parenthesized || normalized.startsWith("-");
  const bare = normalized
    .replace(/^\(/u, "")
    .replace(/\)$/u, "")
    .replace(/^-+/u, "")
    .replace(/,/gu, "");

  if (!/^\d+(\.\d{1,2})?$/u.test(bare)) {
    throw new FinanceTwinExtractionError(
      "trial_balance_invalid_amount",
      `Trial-balance CSV row ${lineNumber} has an invalid ${label}: ${normalized}.`,
    );
  }

  const [wholePart = "0", fractionalPart = ""] = bare.split(".");
  const cents =
    BigInt(wholePart) * 100n + BigInt((fractionalPart + "00").slice(0, 2));

  return negative ? -cents : cents;
}

function formatMoney(cents: bigint) {
  const absolute = cents < 0n ? -cents : cents;
  const sign = cents < 0n ? "-" : "";
  const whole = absolute / 100n;
  const fraction = (absolute % 100n).toString().padStart(2, "0");
  return `${sign}${whole.toString()}.${fraction}`;
}

function normalizeCurrency(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized.toUpperCase() : null;
}

function getFileExtension(fileName: string) {
  const lastDot = fileName.lastIndexOf(".");
  return lastDot < 0 || lastDot === fileName.length - 1
    ? null
    : fileName.slice(lastDot + 1).toLowerCase();
}

function normalizeMediaType(mediaType: string) {
  return mediaType.split(";")[0]?.trim().toLowerCase() ?? mediaType.trim().toLowerCase();
}
