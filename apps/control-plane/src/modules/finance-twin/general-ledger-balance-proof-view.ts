import {
  FinanceGeneralLedgerBalanceProofViewSchema,
  type FinanceCompanyRecord,
  type FinanceGeneralLedgerBalanceProof,
  type FinanceGeneralLedgerBalanceProofRecord,
  type FinanceGeneralLedgerBalanceProofView,
  type FinanceLatestSuccessfulGeneralLedgerSlice,
  type FinanceLineageRecordView,
} from "@pocket-cto/domain";
import { dedupeMessages } from "./diagnostics";

export function buildFinanceGeneralLedgerBalanceProofView(input: {
  company: FinanceCompanyRecord;
  diagnostics: string[];
  latestSuccessfulGeneralLedgerSlice: FinanceLatestSuccessfulGeneralLedgerSlice;
  limitations: string[];
  lineageRecords: FinanceLineageRecordView[];
  proof: FinanceGeneralLedgerBalanceProof | null;
  proofRecord: FinanceGeneralLedgerBalanceProofRecord | null;
  target: {
    ledgerAccountId: string;
    syncRunId: string | null;
  };
}): FinanceGeneralLedgerBalanceProofView {
  const lineageRef =
    input.proofRecord === null
      ? null
      : {
          targetKind: "general_ledger_balance_proof" as const,
          targetId: input.proofRecord.id,
          syncRunId: input.proofRecord.syncRunId,
        };

  return FinanceGeneralLedgerBalanceProofViewSchema.parse({
    company: input.company,
    target: input.target,
    latestSuccessfulGeneralLedgerSlice: input.latestSuccessfulGeneralLedgerSlice,
    proof:
      input.proofRecord === null || input.proof === null
        ? null
        : {
            record: input.proofRecord,
            balanceProof: input.proof,
            lineageRef,
          },
    lineage:
      lineageRef === null
        ? null
        : {
            target: lineageRef,
            recordCount: input.lineageRecords.length,
            records: input.lineageRecords,
          },
    diagnostics: dedupeMessages(input.diagnostics),
    limitations: dedupeMessages(input.limitations),
  });
}
