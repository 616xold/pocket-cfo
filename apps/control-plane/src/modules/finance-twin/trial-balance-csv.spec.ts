import { describe, expect, it } from "vitest";
import { FinanceTwinExtractionError } from "./errors";
import {
  extractTrialBalanceCsv,
  supportsTrialBalanceCsvSource,
} from "./trial-balance-csv";

describe("trial-balance CSV extractor", () => {
  it("parses raw CSV bytes into one reporting period, accounts, and balance lines", () => {
    const extracted = extractTrialBalanceCsv({
      body: Buffer.from(
        [
          "account_code,account_name,period_end,debit,credit,currency_code,account_type",
          "1000,Cash,2026-03-31,125000.00,0.00,USD,asset",
          "2000,Accounts Payable,2026-03-31,0.00,42000.00,USD,liability",
        ].join("\n"),
      ),
      sourceFile: {
        mediaType: "text/csv",
        originalFileName: "trial-balance.csv",
      },
    });

    expect(extracted.reportingPeriod).toEqual({
      periodKey: "2026-03-31",
      label: "Trial balance as of 2026-03-31",
      periodStart: null,
      periodEnd: "2026-03-31",
    });
    expect(extracted.accounts).toEqual([
      {
        accountCode: "1000",
        accountName: "Cash",
        accountType: "asset",
      },
      {
        accountCode: "2000",
        accountName: "Accounts Payable",
        accountType: "liability",
      },
    ]);
    expect(extracted.lines).toEqual([
      {
        accountCode: "1000",
        debitAmount: "125000.00",
        creditAmount: "0.00",
        netAmount: "125000.00",
        currencyCode: "USD",
        lineNumber: 2,
      },
      {
        accountCode: "2000",
        debitAmount: "0.00",
        creditAmount: "42000.00",
        netAmount: "-42000.00",
        currencyCode: "USD",
        lineNumber: 3,
      },
    ]);
  });

  it("rejects mixed reporting periods inside one CSV", () => {
    expect(() =>
      extractTrialBalanceCsv({
        body: Buffer.from(
          [
            "account_code,account_name,period_end,debit,credit",
            "1000,Cash,2026-03-31,10.00,0.00",
            "2000,Revenue,2026-04-30,0.00,10.00",
          ].join("\n"),
        ),
        sourceFile: {
          mediaType: "text/csv",
          originalFileName: "trial-balance.csv",
        },
      }),
    ).toThrowError(FinanceTwinExtractionError);
  });

  it("uses the media type or file extension to recognize supported CSV sources", () => {
    expect(
      supportsTrialBalanceCsvSource({
        mediaType: "text/csv",
        originalFileName: "trial-balance.txt",
      }),
    ).toBe(true);
    expect(
      supportsTrialBalanceCsvSource({
        mediaType: "application/octet-stream",
        originalFileName: "trial-balance.csv",
      }),
    ).toBe(true);
    expect(
      supportsTrialBalanceCsvSource({
        mediaType: "application/pdf",
        originalFileName: "board-deck.pdf",
      }),
    ).toBe(false);
  });
});
