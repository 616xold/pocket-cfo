import { getOptionalHeaderIndex } from "./csv-utils";
import { FinanceTwinExtractionError } from "./errors";

const OPENING_BALANCE_HEADERS = [
  "opening_balance",
  "opening_balance_amount",
  "beginning_balance",
  "beginning_balance_amount",
  "start_balance",
  "start_balance_amount",
] as const;

const ENDING_BALANCE_HEADERS = [
  "ending_balance",
  "ending_balance_amount",
  "closing_balance",
  "closing_balance_amount",
  "end_balance",
  "end_balance_amount",
] as const;

type BalanceProofColumnRef = {
  header: string;
  index: number;
};

type ExtractedBalanceProofValue = {
  amount: string;
  lineNumber: number;
  sourceColumn: string;
};

export type ExtractedGeneralLedgerBalanceProof = {
  accountCode: string;
  endingBalanceAmount: string | null;
  endingBalanceLineNumber: number | null;
  endingBalanceSourceColumn: string | null;
  openingBalanceAmount: string | null;
  openingBalanceLineNumber: number | null;
  openingBalanceSourceColumn: string | null;
};

export function createGeneralLedgerBalanceProofAccumulator(
  headerLookup: Map<string, number>,
) {
  const openingBalanceColumns = collectBalanceProofColumns(
    headerLookup,
    OPENING_BALANCE_HEADERS,
  );
  const endingBalanceColumns = collectBalanceProofColumns(
    headerLookup,
    ENDING_BALANCE_HEADERS,
  );
  const proofsByAccountCode = new Map<
    string,
    ExtractedGeneralLedgerBalanceProof
  >();

  return {
    addRow(input: { accountCode: string; lineNumber: number; row: string[] }) {
      const openingBalance = readExplicitBalanceProofValue({
        columns: openingBalanceColumns,
        lineNumber: input.lineNumber,
        row: input.row,
        valueLabel: "opening balance",
      });
      const endingBalance = readExplicitBalanceProofValue({
        columns: endingBalanceColumns,
        lineNumber: input.lineNumber,
        row: input.row,
        valueLabel: "ending balance",
      });

      if (openingBalance === null && endingBalance === null) {
        return;
      }

      const existing = proofsByAccountCode.get(input.accountCode) ?? null;
      proofsByAccountCode.set(
        input.accountCode,
        mergeBalanceProof({
          accountCode: input.accountCode,
          existing,
          incoming: {
            endingBalance,
            openingBalance,
          },
        }),
      );
    },
    list() {
      return Array.from(proofsByAccountCode.values()).sort((left, right) =>
        left.accountCode.localeCompare(right.accountCode),
      );
    },
  };
}

function collectBalanceProofColumns(
  headerLookup: Map<string, number>,
  candidateHeaders: readonly string[],
) {
  return candidateHeaders.flatMap((header) => {
    const index = getOptionalHeaderIndex(headerLookup, [header]);

    return index === null ? [] : [{ header, index }];
  });
}

function readExplicitBalanceProofValue(input: {
  columns: BalanceProofColumnRef[];
  lineNumber: number;
  row: string[];
  valueLabel: string;
}): ExtractedBalanceProofValue | null {
  let resolved: ExtractedBalanceProofValue | null = null;

  for (const column of input.columns) {
    const amount = readOptionalMoney(rowCell(input.row, column.index), {
      label: `${input.valueLabel} amount`,
      lineNumber: input.lineNumber,
    });

    if (amount === null) {
      continue;
    }

    if (resolved !== null && resolved.amount !== amount) {
      throw new FinanceTwinExtractionError(
        "general_ledger_balance_proof_conflict",
        `General-ledger CSV row ${input.lineNumber} includes conflicting explicit ${input.valueLabel} fields.`,
      );
    }

    if (resolved === null) {
      resolved = {
        amount,
        lineNumber: input.lineNumber,
        sourceColumn: column.header,
      };
    }
  }

  return resolved;
}

function rowCell(row: string[], index: number) {
  return row[index];
}

function mergeBalanceProof(input: {
  accountCode: string;
  existing: ExtractedGeneralLedgerBalanceProof | null;
  incoming: {
    endingBalance: ExtractedBalanceProofValue | null;
    openingBalance: ExtractedBalanceProofValue | null;
  };
}): ExtractedGeneralLedgerBalanceProof {
  const existingOpening = extractStoredValue({
    amount: input.existing?.openingBalanceAmount ?? null,
    lineNumber: input.existing?.openingBalanceLineNumber ?? null,
    sourceColumn: input.existing?.openingBalanceSourceColumn ?? null,
  });
  const existingEnding = extractStoredValue({
    amount: input.existing?.endingBalanceAmount ?? null,
    lineNumber: input.existing?.endingBalanceLineNumber ?? null,
    sourceColumn: input.existing?.endingBalanceSourceColumn ?? null,
  });
  const openingBalance = mergeBalanceProofValue({
    accountCode: input.accountCode,
    existing: existingOpening,
    incoming: input.incoming.openingBalance,
    valueLabel: "opening balance",
  });
  const endingBalance = mergeBalanceProofValue({
    accountCode: input.accountCode,
    existing: existingEnding,
    incoming: input.incoming.endingBalance,
    valueLabel: "ending balance",
  });

  return {
    accountCode: input.accountCode,
    openingBalanceAmount: openingBalance?.amount ?? null,
    openingBalanceSourceColumn: openingBalance?.sourceColumn ?? null,
    openingBalanceLineNumber: openingBalance?.lineNumber ?? null,
    endingBalanceAmount: endingBalance?.amount ?? null,
    endingBalanceSourceColumn: endingBalance?.sourceColumn ?? null,
    endingBalanceLineNumber: endingBalance?.lineNumber ?? null,
  };
}

function mergeBalanceProofValue(input: {
  accountCode: string;
  existing: ExtractedBalanceProofValue | null;
  incoming: ExtractedBalanceProofValue | null;
  valueLabel: string;
}) {
  if (input.incoming === null) {
    return input.existing;
  }

  if (input.existing === null) {
    return input.incoming;
  }

  if (input.existing.amount !== input.incoming.amount) {
    throw new FinanceTwinExtractionError(
      "general_ledger_balance_proof_conflict",
      `General-ledger CSV includes conflicting explicit ${input.valueLabel} values for account ${input.accountCode}.`,
    );
  }

  return input.existing;
}

function extractStoredValue(input: {
  amount: string | null;
  lineNumber: number | null;
  sourceColumn: string | null;
}) {
  if (
    input.amount === null ||
    input.lineNumber === null ||
    input.sourceColumn === null
  ) {
    return null;
  }

  return {
    amount: input.amount,
    lineNumber: input.lineNumber,
    sourceColumn: input.sourceColumn,
  };
}

function readOptionalMoney(
  value: string | undefined,
  input: { label: string; lineNumber: number },
) {
  const normalized = value?.trim() ?? "";

  if (normalized.length === 0) {
    return null;
  }

  return formatMoney(parseMoneyToCents(normalized, input));
}

function parseMoneyToCents(
  value: string,
  input: { label: string; lineNumber: number },
) {
  const parenthesized = value.startsWith("(") && value.endsWith(")");
  const negative = parenthesized || value.startsWith("-");
  const bare = value
    .replace(/^\(/u, "")
    .replace(/\)$/u, "")
    .replace(/^-+/u, "")
    .replace(/,/gu, "");

  if (!/^\d+(\.\d{1,2})?$/u.test(bare)) {
    throw new FinanceTwinExtractionError(
      "general_ledger_invalid_amount",
      `General-ledger CSV row ${input.lineNumber} has an invalid ${input.label}: ${value}.`,
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
