import type {
  SourceFileRecord,
  SourceIngestMessage,
  SourceIngestReceiptSummary,
  SourceParserKey,
  SourceRecord,
} from "@pocket-cto/domain";
import { parseCsvReceipt } from "./parsers/csv-parser";
import { parseMarkdownReceipt } from "./parsers/markdown-parser";
import { parseMetadataFallbackReceipt } from "./parsers/metadata-fallback-parser";
import { parseZipReceipt } from "./parsers/zip-parser";

export type SourceParserInput = {
  body: Buffer;
  source: SourceRecord;
  sourceFile: SourceFileRecord;
};

export type SourceParserResult = {
  receiptSummary: SourceIngestReceiptSummary;
  warnings: SourceIngestMessage[];
};

type SourceParser = (input: SourceParserInput) => SourceParserResult;

const parserRegistry: Record<SourceParserKey, SourceParser> = {
  csv_tabular: parseCsvReceipt,
  markdown_text: parseMarkdownReceipt,
  metadata_fallback: parseMetadataFallbackReceipt,
  zip_inventory: parseZipReceipt,
};

export function runSourceParser(
  parserKey: SourceParserKey,
  input: SourceParserInput,
) {
  return parserRegistry[parserKey](input);
}
