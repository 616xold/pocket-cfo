import type { SourceIngestMetadataFallbackReceiptSummary } from "@pocket-cto/domain";
import type { SourceParserInput, SourceParserResult } from "../parser-registry";

export function parseMetadataFallbackReceipt(
  input: SourceParserInput,
): SourceParserResult {
  const note =
    `No structured parser coverage is available for ${input.sourceFile.mediaType}; ` +
    "the ingest receipt records source metadata only.";
  const summary: SourceIngestMetadataFallbackReceiptSummary = {
    kind: "metadata_fallback",
    note,
  };

  return {
    receiptSummary: summary,
    warnings: [
      {
        code: "metadata_only_receipt",
        message: note,
      },
    ],
  };
}
