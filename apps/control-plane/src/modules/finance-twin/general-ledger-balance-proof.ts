import {
  FinanceGeneralLedgerBalanceProofSchema,
  type FinanceGeneralLedgerActivity,
  type FinanceGeneralLedgerBalanceProof,
  type FinanceGeneralLedgerBalanceProofRecord,
} from "@pocket-cto/domain";

export function buildFinanceGeneralLedgerBalanceProof(input: {
  generalLedgerActivity: FinanceGeneralLedgerActivity | null;
  sourceBackedBalanceProof: FinanceGeneralLedgerBalanceProofRecord | null;
}): FinanceGeneralLedgerBalanceProof {
  if (input.sourceBackedBalanceProof !== null) {
    const openingPresent =
      input.sourceBackedBalanceProof.openingBalanceAmount !== null;
    const endingPresent =
      input.sourceBackedBalanceProof.endingBalanceAmount !== null;

    return FinanceGeneralLedgerBalanceProofSchema.parse({
      openingBalanceAmount: input.sourceBackedBalanceProof.openingBalanceAmount,
      endingBalanceAmount: input.sourceBackedBalanceProof.endingBalanceAmount,
      openingBalanceEvidencePresent: openingPresent,
      endingBalanceEvidencePresent: endingPresent,
      openingBalanceSourceColumn:
        input.sourceBackedBalanceProof.openingBalanceSourceColumn,
      openingBalanceLineNumber:
        input.sourceBackedBalanceProof.openingBalanceLineNumber,
      endingBalanceSourceColumn:
        input.sourceBackedBalanceProof.endingBalanceSourceColumn,
      endingBalanceLineNumber:
        input.sourceBackedBalanceProof.endingBalanceLineNumber,
      proofBasis: "source_backed_balance_field",
      proofSource: buildProofSourceSummary(input.sourceBackedBalanceProof),
      reasonCode: buildReasonCode({
        endingPresent,
        openingPresent,
      }),
      reasonSummary: buildReasonSummary({
        endingPresent,
        openingPresent,
      }),
    });
  }

  if (input.generalLedgerActivity === null) {
    return FinanceGeneralLedgerBalanceProofSchema.parse({
      openingBalanceAmount: null,
      endingBalanceAmount: null,
      openingBalanceEvidencePresent: false,
      endingBalanceEvidencePresent: false,
      openingBalanceSourceColumn: null,
      openingBalanceLineNumber: null,
      endingBalanceSourceColumn: null,
      endingBalanceLineNumber: null,
      proofBasis: "no_general_ledger_activity",
      proofSource: null,
      reasonCode: "missing_general_ledger_activity",
      reasonSummary:
        "No general-ledger activity is present for this account in the latest successful general-ledger slice, so source-backed balance proof is unavailable.",
    });
  }

  // F2H stays truthful by reporting the absence of source-backed balance proof
  // rather than inferring opening or ending balances from activity totals.
  return FinanceGeneralLedgerBalanceProofSchema.parse({
    openingBalanceAmount: null,
    endingBalanceAmount: null,
    openingBalanceEvidencePresent: false,
    endingBalanceEvidencePresent: false,
    openingBalanceSourceColumn: null,
    openingBalanceLineNumber: null,
    endingBalanceSourceColumn: null,
    endingBalanceLineNumber: null,
    proofBasis: "activity_only_no_balance_proof",
    proofSource: null,
    reasonCode: "activity_only_no_balance_proof",
    reasonSummary:
      "The latest successful general-ledger slice only provides activity totals for this account; it does not expose source-backed opening-balance or ending-balance proof.",
  });
}

export function hasSourceBackedBalanceProof(
  balanceProof: FinanceGeneralLedgerBalanceProof,
) {
  return (
    balanceProof.openingBalanceEvidencePresent ||
    balanceProof.endingBalanceEvidencePresent
  );
}

function buildProofSourceSummary(
  balanceProof: FinanceGeneralLedgerBalanceProofRecord,
) {
  const sources = [
    buildSourceFragment({
      balanceLabel: "Opening balance",
      lineNumber: balanceProof.openingBalanceLineNumber,
      sourceColumn: balanceProof.openingBalanceSourceColumn,
    }),
    buildSourceFragment({
      balanceLabel: "Ending balance",
      lineNumber: balanceProof.endingBalanceLineNumber,
      sourceColumn: balanceProof.endingBalanceSourceColumn,
    }),
  ].filter((value): value is string => value !== null);

  return sources.length > 0 ? sources.join(" ") : null;
}

function buildSourceFragment(input: {
  balanceLabel: string;
  lineNumber: number | null;
  sourceColumn: string | null;
}) {
  if (input.lineNumber === null || input.sourceColumn === null) {
    return null;
  }

  return `${input.balanceLabel} came from the explicit ${input.sourceColumn} column on row ${input.lineNumber}.`;
}

function buildReasonCode(input: {
  endingPresent: boolean;
  openingPresent: boolean;
}) {
  if (input.openingPresent && input.endingPresent) {
    return "source_backed_opening_and_ending_balance_proof";
  }

  if (input.openingPresent) {
    return "source_backed_opening_balance_proof";
  }

  return "source_backed_ending_balance_proof";
}

function buildReasonSummary(input: {
  endingPresent: boolean;
  openingPresent: boolean;
}) {
  if (input.openingPresent && input.endingPresent) {
    return "The latest successful general-ledger slice includes explicit source-backed opening-balance and ending-balance fields for this account.";
  }

  if (input.openingPresent) {
    return "The latest successful general-ledger slice includes an explicit source-backed opening-balance field for this account.";
  }

  return "The latest successful general-ledger slice includes an explicit source-backed ending-balance field for this account.";
}
