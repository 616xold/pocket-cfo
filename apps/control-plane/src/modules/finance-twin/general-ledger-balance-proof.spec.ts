import { describe, expect, it } from "vitest";
import { buildFinanceGeneralLedgerBalanceProof } from "./general-ledger-balance-proof";

describe("general-ledger balance proof", () => {
  it("stays blocked when activity exists without explicit source-backed balance fields", () => {
    expect(
      buildFinanceGeneralLedgerBalanceProof({
        generalLedgerActivity: {
          journalEntryCount: 1,
          journalLineCount: 1,
          totalDebitAmount: "10.00",
          totalCreditAmount: "0.00",
          earliestEntryDate: "2026-03-31",
          latestEntryDate: "2026-03-31",
        },
        sourceBackedBalanceProof: null,
      }),
    ).toMatchObject({
      proofBasis: "activity_only_no_balance_proof",
      openingBalanceEvidencePresent: false,
      endingBalanceEvidencePresent: false,
      proofSource: null,
      reasonCode: "activity_only_no_balance_proof",
    });
  });

  it("reports explicit source-backed opening and ending balance proof details", () => {
    expect(
      buildFinanceGeneralLedgerBalanceProof({
        generalLedgerActivity: {
          journalEntryCount: 2,
          journalLineCount: 2,
          totalDebitAmount: "10.00",
          totalCreditAmount: "5.00",
          earliestEntryDate: "2026-03-30",
          latestEntryDate: "2026-03-31",
        },
        sourceBackedBalanceProof: {
          id: "11111111-1111-4111-8111-111111111111",
          companyId: "22222222-2222-4222-8222-222222222222",
          ledgerAccountId: "33333333-3333-4333-8333-333333333333",
          syncRunId: "44444444-4444-4444-8444-444444444444",
          openingBalanceAmount: "90.00",
          openingBalanceSourceColumn: "opening_balance",
          openingBalanceLineNumber: 2,
          endingBalanceAmount: "95.00",
          endingBalanceSourceColumn: "closing_balance",
          endingBalanceLineNumber: 2,
          createdAt: "2026-04-12T09:00:00.000Z",
          updatedAt: "2026-04-12T09:00:00.000Z",
        },
      }),
    ).toMatchObject({
      proofBasis: "source_backed_balance_field",
      openingBalanceAmount: "90.00",
      endingBalanceAmount: "95.00",
      openingBalanceEvidencePresent: true,
      endingBalanceEvidencePresent: true,
      openingBalanceSourceColumn: "opening_balance",
      openingBalanceLineNumber: 2,
      endingBalanceSourceColumn: "closing_balance",
      endingBalanceLineNumber: 2,
      reasonCode: "source_backed_opening_and_ending_balance_proof",
      proofSource:
        "Opening balance came from the explicit opening_balance column on row 2. Ending balance came from the explicit closing_balance column on row 2.",
    });
  });
});
