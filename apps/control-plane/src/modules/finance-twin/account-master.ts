import type { FinanceTwinExtractorKey } from "@pocket-cto/domain";

type LedgerAccountMasterState = {
  accountName: string | null;
  accountType: string | null;
};

export function mergeLedgerAccountMasterState(input: {
  existing: LedgerAccountMasterState | null;
  extractorKey: FinanceTwinExtractorKey;
  incoming: LedgerAccountMasterState;
}) {
  const existing = {
    accountName: normalizeOptionalText(input.existing?.accountName),
    accountType: normalizeOptionalText(input.existing?.accountType),
  };
  const incoming = {
    accountName: normalizeOptionalText(input.incoming.accountName),
    accountType: normalizeOptionalText(input.incoming.accountType),
  };

  if (input.extractorKey === "chart_of_accounts_csv") {
    return {
      accountName: incoming.accountName ?? existing.accountName,
      accountType: incoming.accountType ?? existing.accountType,
    } satisfies LedgerAccountMasterState;
  }

  return {
    accountName: existing.accountName ?? incoming.accountName,
    accountType: existing.accountType ?? incoming.accountType,
  } satisfies LedgerAccountMasterState;
}

function normalizeOptionalText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
