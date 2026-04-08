import type { SourceIngestCsvReceiptSummary } from "@pocket-cto/domain";
import { SourceIngestExecutionError } from "../errors";
import type { SourceParserInput, SourceParserResult } from "../parser-registry";

export function parseCsvReceipt(input: SourceParserInput): SourceParserResult {
  const rows = parseCsvRows(decodeText(input.body));
  const header = rows[0] ?? null;
  const dataRows = header ? rows.slice(1) : [];
  const columnCount = rows.reduce(
    (maxCount, row) => Math.max(maxCount, row.length),
    0,
  );
  const summary: SourceIngestCsvReceiptSummary = {
    kind: "csv_tabular",
    columnCount,
    header,
    rowCount: dataRows.length,
    sampleRows: dataRows.slice(0, 3),
  };
  const warnings = new Set<string>();

  for (const row of dataRows) {
    if (row.length !== columnCount) {
      warnings.add("CSV rows have inconsistent column counts");
      break;
    }
  }

  return {
    receiptSummary: summary,
    warnings: [...warnings].map((message) => ({
      code: "csv_irregular_columns",
      message,
    })),
  };
}

function decodeText(body: Buffer) {
  return new TextDecoder("utf-8")
    .decode(body)
    .replace(/^\uFEFF/u, "");
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

    if (character === "\n") {
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = "";
      continue;
    }

    if (character === "\r") {
      if (text[index + 1] === "\n") {
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
    throw new SourceIngestExecutionError(
      "csv_unterminated_quote",
      "CSV input ended while a quoted field was still open",
    );
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}
