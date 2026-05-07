import type { EvidenceIndexLimitationPosture } from "@pocket-cto/domain";

type LimitationInput = {
  code: EvidenceIndexLimitationPosture["code"];
  severity: EvidenceIndexLimitationPosture["severity"];
  summary: string;
  affectedAnchorIds?: string[];
  affectedSourceIds?: string[];
};

export function buildLimitation(
  input: LimitationInput,
): EvidenceIndexLimitationPosture {
  return {
    affectedAnchorIds: input.affectedAnchorIds ?? [],
    affectedSourceIds: input.affectedSourceIds ?? [],
    code: input.code,
    severity: input.severity,
    summary: input.summary,
  };
}

export function dedupeLimitations(
  limitations: EvidenceIndexLimitationPosture[],
) {
  const seen = new Set<string>();
  return limitations.filter((limitation) => {
    const key = [
      limitation.code,
      limitation.severity,
      limitation.summary,
      limitation.affectedAnchorIds.join(","),
      limitation.affectedSourceIds.join(","),
    ].join("::");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function buildDefaultCapabilityBoundaries() {
  return [
    buildLimitation({
      code: "unsupported_pdf",
      severity: "blocking",
      summary: "V2A does not parse PDFs or claim PDF page precision.",
    }),
    buildLimitation({
      code: "unsupported_scan",
      severity: "blocking",
      summary: "V2A does not read scans or image-only documents.",
    }),
    buildLimitation({
      code: "unsupported_image_only",
      severity: "blocking",
      summary: "V2A does not read image-only documents.",
    }),
    buildLimitation({
      code: "unsupported_ocr_only",
      severity: "blocking",
      summary: "V2A does not use OCR-only evidence.",
    }),
    buildLimitation({
      code: "unsupported_vector_only",
      severity: "blocking",
      summary: "V2A does not use vector-only hits as evidence.",
    }),
    buildLimitation({
      code: "unsupported_pageindex",
      severity: "blocking",
      summary: "V2A does not use PageIndex or page-index adapters.",
    }),
    buildLimitation({
      code: "unsupported_llm",
      severity: "blocking",
      summary: "V2A does not use LLM extraction or summarization.",
    }),
    buildLimitation({
      code: "unsupported_table",
      severity: "blocking",
      summary:
        "V2A table regions are placeholders until a later adapter proves table semantics.",
    }),
    buildLimitation({
      code: "unsupported_figure",
      severity: "blocking",
      summary:
        "V2A figure and graphics regions are placeholders until a later adapter proves visual facts.",
    }),
    buildLimitation({
      code: "unsupported_graphics",
      severity: "blocking",
      summary:
        "V2A does not claim facts from graphics without a later deterministic adapter.",
    }),
    buildLimitation({
      code: "ambiguous_layout",
      severity: "blocking",
      summary:
        "V2A treats ambiguous document layout as unsupported instead of inferring structure.",
    }),
  ];
}
