import { createHash } from "node:crypto";
import {
  EvidenceCardSchema,
  EvidenceClaimSchema,
  EvidenceTraceSchema,
  type DocumentMap,
  type EvidenceCard,
  type EvidenceClaim,
  type EvidenceIndexFinanceTwinRef,
  type EvidenceIndexWikiRef,
  type EvidenceTrace,
  type SourceAnchor,
} from "@pocket-cto/domain";
import { buildLimitation, dedupeLimitations } from "./limitations";
import type { EvidenceIndexBoundSourceInput } from "./types";

const FORBIDDEN_ACTIONS = [
  "mutate_raw_source",
  "write_finance_twin_fact",
  "write_accounting_record",
  "move_money_or_create_payment_instruction",
  "file_tax_or_create_legal_advice",
  "call_provider_or_create_provider_job",
  "send_or_release_external_communication",
  "certify_close_or_create_assurance",
  "run_llm_summarization",
  "run_ocr_or_vector_search",
  "take_autonomous_action",
];

export function buildEvidenceArtifacts(input: {
  companyKey: string;
  documentMaps: DocumentMap[];
  sources: EvidenceIndexBoundSourceInput[];
}) {
  const sourceById = new Map(
    input.sources.map((source) => [source.source.id, source] as const),
  );
  const claims: EvidenceClaim[] = [];
  const cards: EvidenceCard[] = [];
  const traces: EvidenceTrace[] = [];

  for (const documentMap of input.documentMaps) {
    const sourceInput = sourceById.get(documentMap.sourceDocument.sourceId);
    const sourceAnchors = anchorsForClaim(documentMap);
    const financeTwinRefs = sourceInput?.financeTwinRefs ?? [];
    const wikiRefs = sourceInput?.wikiRefs ?? [];
    const claim = buildClaim({
      companyKey: input.companyKey,
      documentMap,
      financeTwinRefs,
      sourceAnchors,
      wikiRefs,
    });
    const cardTraces = buildTraces({
      cardId: `${claim.id}:card`,
      claim,
      documentMap,
      financeTwinRefs,
      sourceAnchors,
      wikiRefs,
    });
    const card = EvidenceCardSchema.parse({
      claimText: claim.claimText,
      claimType: claim.claimType,
      companyKey: input.companyKey,
      confidence: claim.confidence,
      evidence: {
        evidenceTraces: cardTraces,
        financeTwinRefs,
        sourceAnchors,
        wikiRefs,
      },
      extractionMethod: claim.extractionMethod,
      financeTwinRefs,
      forbiddenActions: FORBIDDEN_ACTIONS,
      freshness: claim.freshness,
      id: `${claim.id}:card`,
      limitations: claim.limitations,
      permittedNextActions: buildPermittedActions({
        documentMap,
        financeTwinRefs,
        wikiRefs,
      }),
      sourceAnchors,
      wikiRefs,
    });

    claims.push(claim);
    cards.push(card);
    traces.push(...cardTraces);
  }

  return { cards, claims, traces };
}

function buildClaim(input: {
  companyKey: string;
  documentMap: DocumentMap;
  financeTwinRefs: EvidenceIndexFinanceTwinRef[];
  sourceAnchors: SourceAnchor[];
  wikiRefs: EvidenceIndexWikiRef[];
}) {
  const supported =
    input.documentMap.coverageStatus === "supported" ||
    input.documentMap.coverageStatus === "stale";
  const authorityBasis =
    input.financeTwinRefs.length > 0 || input.wikiRefs.length > 0
      ? "mixed_refs"
      : supported
        ? "raw_source_anchor"
        : "limitation_boundary";
  const claimType = supported ? "document_map_anchor" : "capability_boundary";

  return EvidenceClaimSchema.parse({
    authorityBasis,
    claimText: supported
      ? `Deterministic V2A source anchors are available for source ${input.documentMap.sourceDocument.sourceId}.`
      : `V2A EvidenceIndex did not index source content for source ${input.documentMap.sourceDocument.sourceId}.`,
    claimType,
    companyKey: input.companyKey,
    confidence: {
      method: input.documentMap.extractionMethod,
      summary: supported
        ? "Deterministic source metadata and persisted text extract were used."
        : "Only capability-boundary metadata is available for this source.",
    },
    extractionMethod: input.documentMap.extractionMethod,
    financeTwinRefs: input.financeTwinRefs,
    freshness: input.documentMap.sourceDocument.freshness,
    id: `${input.documentMap.id}:claim:${claimType}`,
    limitations: dedupeLimitations([
      ...input.documentMap.limitations,
      buildLimitation({
        affectedSourceIds: [input.documentMap.sourceDocument.sourceId],
        code: "not_source_truth",
        severity: "warning",
        summary:
          "EvidenceIndex cards are read-only anchors and traces; raw sources remain authoritative.",
      }),
    ]),
    sourceAnchorIds: input.sourceAnchors.map((anchor) => anchor.id),
    wikiRefs: input.wikiRefs,
  });
}

function buildTraces(input: {
  cardId: string;
  claim: EvidenceClaim;
  documentMap: DocumentMap;
  financeTwinRefs: EvidenceIndexFinanceTwinRef[];
  sourceAnchors: SourceAnchor[];
  wikiRefs: EvidenceIndexWikiRef[];
}) {
  const traces: EvidenceTrace[] = [];

  for (const anchor of input.sourceAnchors) {
    traces.push(
      trace({
        claimId: input.claim.id,
        companyKey: input.claim.companyKey,
        fromId: input.documentMap.sourceDocument.id,
        fromKind: "source_document",
        relationshipKind: "raw_source_to_anchor",
        sourceAnchorId: anchor.id,
        sourceDocumentId: input.documentMap.sourceDocument.id,
        summary:
          "Raw source document metadata anchors a deterministic V2A locator.",
        toId: anchor.id,
        toKind: "source_anchor",
      }),
      trace({
        claimId: input.claim.id,
        companyKey: input.claim.companyKey,
        fromId: anchor.id,
        fromKind: "source_anchor",
        relationshipKind: "anchor_to_evidence_claim",
        sourceAnchorId: anchor.id,
        sourceDocumentId: input.documentMap.sourceDocument.id,
        summary:
          "Source anchor supports the evidence claim without becoming source truth.",
        toId: input.claim.id,
        toKind: "evidence_claim",
      }),
    );
  }

  for (const ref of input.financeTwinRefs) {
    traces.push(
      trace({
        claimId: input.claim.id,
        companyKey: input.claim.companyKey,
        fromId: ref.targetId,
        fromKind: `finance_twin:${ref.targetKind}`,
        relationshipKind: "finance_twin_ref_to_claim",
        summary: "Finance Twin ref remains authoritative for structured facts.",
        toId: input.claim.id,
        toKind: "evidence_claim",
      }),
    );
  }

  for (const ref of input.wikiRefs) {
    traces.push(
      trace({
        claimId: input.claim.id,
        companyKey: input.claim.companyKey,
        fromId: ref.pageKey,
        fromKind: "cfo_wiki_page",
        relationshipKind: "cfo_wiki_ref_to_claim",
        summary: "CFO Wiki ref remains compiled and derived context.",
        toId: input.claim.id,
        toKind: "evidence_claim",
      }),
    );
  }

  traces.push(
    trace({
      claimId: input.claim.id,
      companyKey: input.claim.companyKey,
      fromId: input.claim.id,
      fromKind: "evidence_claim",
      relationshipKind: "claim_to_evidence_card",
      summary:
        "Evidence claim is packaged into a human-reviewable EvidenceCard.",
      toId: input.cardId,
      toKind: "evidence_card",
    }),
  );

  return traces;
}

type TraceInput = Omit<
  EvidenceTrace,
  "id" | "limitations" | "sourceAnchorId" | "sourceDocumentId"
> & {
  sourceAnchorId?: string | null;
  sourceDocumentId?: string | null;
};

function trace(input: TraceInput): EvidenceTrace {
  return EvidenceTraceSchema.parse({
    ...input,
    id: `trace:${input.relationshipKind}:${stableTraceDigest(input)}`,
    limitations: [],
    sourceAnchorId: input.sourceAnchorId ?? null,
    sourceDocumentId: input.sourceDocumentId ?? null,
  });
}

function stableTraceDigest(input: TraceInput) {
  return createHash("sha256")
    .update(`${input.relationshipKind}:${input.fromId}:${input.toId}`)
    .digest("hex")
    .slice(0, 16);
}

function anchorsForClaim(documentMap: DocumentMap) {
  const sectionAnchors = documentMap.sourceAnchors.filter((anchor) =>
    anchor.id.includes(":section-"),
  );

  return sectionAnchors.length > 0 ? sectionAnchors : documentMap.sourceAnchors;
}

function buildPermittedActions(input: {
  documentMap: DocumentMap;
  financeTwinRefs: EvidenceIndexFinanceTwinRef[];
  wikiRefs: EvidenceIndexWikiRef[];
}) {
  return [
    {
      action: "inspect_source",
      label: "Inspect the registered source and immutable snapshot.",
      targetId: input.documentMap.sourceDocument.sourceId,
    },
    ...input.wikiRefs.map((ref) => ({
      action: "open_cfo_wiki_page" as const,
      label: "Open the derived CFO Wiki page.",
      targetId: ref.pageKey,
    })),
    ...input.financeTwinRefs.map((ref) => ({
      action: "open_finance_twin_ref" as const,
      label: "Open the authoritative Finance Twin structured ref.",
      targetId: ref.targetId,
    })),
    {
      action: "run_existing_source_pack_proof",
      label: "Run an existing source-pack proof if this source family has one.",
      targetId: input.documentMap.sourceDocument.sourceId,
    },
    {
      action: "request_human_review",
      label: "Request human review before using this evidence outside chat.",
      targetId: input.documentMap.sourceDocument.sourceId,
    },
  ];
}
