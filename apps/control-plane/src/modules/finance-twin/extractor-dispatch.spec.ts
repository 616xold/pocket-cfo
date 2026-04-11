import { describe, expect, it } from "vitest";
import { extractFinanceTwinSource } from "./extractor-dispatch";

describe("finance twin extractor dispatch", () => {
  it("detects trial-balance CSV without colliding with other finance families", () => {
    const extracted = extractFinanceTwinSource({
      body: Buffer.from(
        [
          "account_code,account_name,period_end,debit,credit",
          "1000,Cash,2026-03-31,125000.00,0.00",
        ].join("\n"),
      ),
      sourceFile: {
        mediaType: "text/csv",
        originalFileName: "trial-balance.csv",
      },
    });

    expect(extracted?.extractorKey).toBe("trial_balance_csv");
  });

  it("detects chart-of-accounts CSV without colliding with trial balance", () => {
    const extracted = extractFinanceTwinSource({
      body: Buffer.from(
        [
          "account_code,account_name,account_type,detail_type,parent_account_code,is_active",
          "1000,Cash,asset,current_asset,,true",
        ].join("\n"),
      ),
      sourceFile: {
        mediaType: "text/csv",
        originalFileName: "chart-of-accounts.csv",
      },
    });

    expect(extracted?.extractorKey).toBe("chart_of_accounts_csv");
  });

  it("detects general-ledger CSV before trial-balance-style amount columns can collide", () => {
    const extracted = extractFinanceTwinSource({
      body: Buffer.from(
        [
          "journal_id,transaction_date,period_end,account_code,account_name,debit,credit",
          "J-100,2026-03-31,2026-03-31,1000,Cash,100.00,0.00",
          "J-100,2026-03-31,2026-03-31,3000,Common Stock,0.00,100.00",
        ].join("\n"),
      ),
      sourceFile: {
        mediaType: "text/csv",
        originalFileName: "general-ledger.csv",
      },
    });

    expect(extracted?.extractorKey).toBe("general_ledger_csv");
  });
});
