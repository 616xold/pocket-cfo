import type {
  EvidenceIndexExtractionMethod,
  EvidenceIndexLimitationPosture,
} from "@pocket-cto/domain";
import { buildLimitation, dedupeLimitations } from "./limitations";
import type { EvidenceIndexBoundSourceInput } from "./types";

export function buildSourceLimitations(
  source: EvidenceIndexBoundSourceInput,
  method: EvidenceIndexExtractionMethod,
): EvidenceIndexLimitationPosture[] {
  const sourceId = source.source.id;
  const limitations = source.limitations.map((summary) =>
    buildLimitation({
      affectedSourceIds: [sourceId],
      code: "not_source_truth",
      severity: "warning",
      summary,
    }),
  );

  if (!source.binding.includeInCompile) {
    limitations.push(
      buildLimitation({
        affectedSourceIds: [sourceId],
        code: "source_not_indexed",
        severity: "blocking",
        summary:
          "This source binding is excluded from CFO Wiki compile and V2A indexing.",
      }),
    );
  }

  if (source.source.kind !== "document") {
    limitations.push(
      buildLimitation({
        affectedSourceIds: [sourceId],
        code: "source_kind_unsupported",
        severity: "blocking",
        summary: "V2A document maps only support explicit document sources.",
      }),
    );
  }

  if (!source.latestSnapshot) {
    limitations.push(
      buildLimitation({
        affectedSourceIds: [sourceId],
        code: "missing_source_snapshot",
        severity: "blocking",
        summary: "No source snapshot is available for this bound source.",
      }),
    );
  }

  if (!source.latestSourceFile) {
    limitations.push(
      buildLimitation({
        affectedSourceIds: [sourceId],
        code: "missing_source_file",
        severity: "blocking",
        summary: "No immutable source file is linked to the latest snapshot.",
      }),
    );
  }

  if (!source.latestExtract) {
    limitations.push(
      buildLimitation({
        affectedSourceIds: [sourceId],
        code: "missing_document_extract",
        severity: "blocking",
        summary: "No deterministic CFO Wiki document extract is available.",
      }),
    );
  }

  if (method.startsWith("unsupported_")) {
    limitations.push(
      buildLimitation({
        affectedSourceIds: [sourceId],
        code:
          method === "unsupported_pdf"
            ? "unsupported_pdf"
            : "unsupported_image_only",
        severity: "blocking",
        summary: "This source type is unsupported in the first V2A foundation.",
      }),
    );
  }

  if (source.latestExtract?.extractStatus === "failed") {
    limitations.push(
      buildLimitation({
        affectedSourceIds: [sourceId],
        code: "extraction_failed",
        severity: "blocking",
        summary:
          source.latestExtract.errorSummary ??
          "The deterministic CFO Wiki extract failed.",
      }),
    );
  }

  if (source.freshnessOverride?.state === "stale") {
    limitations.push(
      buildLimitation({
        affectedSourceIds: [sourceId],
        code: "stale_source",
        severity: "warning",
        summary: source.freshnessOverride.summary,
      }),
    );
  }

  return dedupeLimitations(limitations);
}
