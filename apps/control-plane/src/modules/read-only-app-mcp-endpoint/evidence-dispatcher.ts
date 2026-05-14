import {
  EVIDENCE_TOOL_DISPATCH_ARGUMENT_SCHEMAS_BY_TOOL,
  MCP_TOOL_ALLOWLIST,
  isMcpToolAllowed,
  type EvidenceIndexFreshnessPosture,
  type EvidenceIndexLimitationPosture,
  type EvidenceToolCitation,
  type EvidenceToolResponse,
  type McpToolName,
} from "@pocket-cto/domain";

export const READ_ONLY_EVIDENCE_DISPATCH_ADAPTER_SCHEMA_VERSION =
  "v2ac.read-only-app-mcp-evidence-dispatch-adapter.v1";
export const READ_ONLY_EVIDENCE_DISPATCH_TEXT_MIRROR_SCHEMA_VERSION =
  "v2ac.read-only-app-mcp-evidence-dispatch-text-mirror.v1";
export const READ_ONLY_EVIDENCE_DISPATCH_TEXT_MIRROR_MAX_CHARACTERS = 2000;

export type ReadOnlyEvidenceToolServicePort = {
  fetchCapabilityBoundaries(input: {
    requestedAction?: string | null;
  }): EvidenceToolResponse<unknown>;
  fetchCompanyPosture(): EvidenceToolResponse<unknown>;
  fetchDocumentMap(input: {
    documentMapId?: string;
    sourceId?: string;
  }): EvidenceToolResponse<unknown>;
  fetchEvidenceCard(input: {
    evidenceCardId: string;
  }): EvidenceToolResponse<unknown>;
  fetchSourceAnchor(input: {
    sourceAnchorId: string;
  }): EvidenceToolResponse<unknown>;
  fetchSourceCoverage(input: {
    sourceId: string;
  }): EvidenceToolResponse<unknown>;
  searchEvidence(input: {
    includeExcerpts?: boolean;
    limit?: number;
    query: string;
  }): EvidenceToolResponse<unknown>;
};

export type LocalReadOnlyEvidenceToolDispatchAdapterInput = {
  evidenceService: ReadOnlyEvidenceToolServicePort;
  expectedCompanyKey: string;
};

export type ReadOnlyEvidenceToolDispatcher = {
  dispatchTool(input: {
    arguments: Record<string, unknown>;
    toolName: string;
  }): ReadOnlyEvidenceToolDispatchResult;
};

export type ReadOnlyEvidenceToolDispatchResult = {
  content: Array<{ text: string; type: "text" }>;
  isError: boolean;
  structuredContent: Record<string, unknown> & {
    adapterSchemaVersion: string;
    capabilityBoundary: ReturnType<typeof capabilityBoundary>;
    citations: EvidenceToolCitation[];
    companyKey: string | null;
    evidence: EvidenceToolCitation[];
    freshness: EvidenceIndexFreshnessPosture;
    limitations: EvidenceIndexLimitationPosture[];
    permittedNextActions: Array<Record<string, unknown>>;
    redactions: Array<Record<string, unknown>>;
    refusalReason: string | null;
    result: unknown;
    sourceAnchors: EvidenceToolCitation[];
    toolName: string;
  };
};

export class LocalReadOnlyEvidenceToolDispatchAdapter implements ReadOnlyEvidenceToolDispatcher {
  private readonly evidenceService: ReadOnlyEvidenceToolServicePort;
  private readonly expectedCompanyKey: string;

  constructor(input: LocalReadOnlyEvidenceToolDispatchAdapterInput) {
    this.evidenceService = input.evidenceService;
    this.expectedCompanyKey = input.expectedCompanyKey;
  }

  dispatchTool(input: {
    arguments: Record<string, unknown>;
    toolName: string;
  }): ReadOnlyEvidenceToolDispatchResult {
    if (!isMcpToolAllowed(input.toolName)) {
      return formatEvidenceDispatchLocalRefusal({
        refusalReason: "invalid_tool",
        toolName: input.toolName,
      });
    }

    const toolName = input.toolName as McpToolName;
    const parsedArguments = EVIDENCE_TOOL_DISPATCH_ARGUMENT_SCHEMAS_BY_TOOL[
      toolName
    ].safeParse(input.arguments);
    if (!parsedArguments.success) {
      return formatEvidenceDispatchLocalRefusal({
        refusalReason: "invalid_arguments",
        toolName,
      });
    }

    if (parsedArguments.data.companyKey !== this.expectedCompanyKey) {
      return formatEvidenceDispatchLocalRefusal({
        refusalReason: "company_key_mismatch",
        toolName,
      });
    }

    if (
      toolName === "fetch_company_posture" &&
      "periodKey" in parsedArguments.data &&
      parsedArguments.data.periodKey
    ) {
      return formatEvidenceDispatchLocalRefusal({
        refusalReason: "unsupported_argument",
        toolName,
      });
    }

    return formatEvidenceServiceToolResult(
      dispatchToService(this.evidenceService, toolName, parsedArguments.data),
    );
  }
}

function dispatchToService(
  service: ReadOnlyEvidenceToolServicePort,
  toolName: McpToolName,
  args: Record<string, unknown>,
): EvidenceToolResponse<unknown> {
  switch (toolName) {
    case "search_evidence":
      return service.searchEvidence({
        limit: args.limit as number | undefined,
        query: args.query as string,
      });
    case "fetch_evidence_card":
      return service.fetchEvidenceCard({
        evidenceCardId: args.evidenceCardId as string,
      });
    case "fetch_source_anchor":
      return service.fetchSourceAnchor({
        sourceAnchorId: args.sourceAnchorId as string,
      });
    case "fetch_document_map":
      return service.fetchDocumentMap({
        documentMapId: args.documentMapId as string,
      });
    case "fetch_source_coverage":
      return service.fetchSourceCoverage({
        sourceId: args.sourceId as string,
      });
    case "fetch_company_posture":
      return service.fetchCompanyPosture();
    case "fetch_capability_boundaries":
      return service.fetchCapabilityBoundaries({});
  }
}

function formatEvidenceServiceToolResult(
  response: EvidenceToolResponse<unknown>,
): ReadOnlyEvidenceToolDispatchResult {
  const refusalReason = refusalReasonFor(response);
  const isError = refusalReason !== null;
  const structuredContent = {
    adapterSchemaVersion: READ_ONLY_EVIDENCE_DISPATCH_ADAPTER_SCHEMA_VERSION,
    audit: response.audit,
    capabilityBoundaries: response.capabilityBoundaries,
    capabilityBoundary: capabilityBoundary(),
    citations: response.citations,
    companyKey: response.companyKey,
    evidence: refusalReason === null ? response.evidence : [],
    forbiddenActions: response.forbiddenActions,
    freshness: response.freshness,
    limitations: response.limitations,
    permittedNextActions: response.permittedNextActions,
    redactions: response.redactions,
    refusalReason,
    result: refusalReason === null ? response.result : null,
    schemaVersion: response.schemaVersion,
    sourceAnchors:
      refusalReason === null ? sourceAnchorCitations(response.citations) : [],
    toolName: response.toolName,
    unsupportedReason: response.unsupportedReason,
  };

  return formatDispatchResult({ isError, structuredContent });
}

function formatEvidenceDispatchLocalRefusal(input: {
  refusalReason:
    | "company_key_mismatch"
    | "invalid_arguments"
    | "invalid_tool"
    | "unsupported_argument";
  toolName: string;
}): ReadOnlyEvidenceToolDispatchResult {
  return formatDispatchResult({
    isError: true,
    structuredContent: {
      adapterSchemaVersion: READ_ONLY_EVIDENCE_DISPATCH_ADAPTER_SCHEMA_VERSION,
      audit: null,
      capabilityBoundaries: [],
      capabilityBoundary: capabilityBoundary(),
      citations: [],
      companyKey: null,
      evidence: [],
      forbiddenActions: [],
      freshness: {
        checkedAt: "2026-05-14T00:00:00.000Z",
        compiledAt: null,
        extractedAt: null,
        sourceCapturedAt: null,
        state: "missing",
        summary:
          "No evidence service dispatch occurred for this failed request.",
      },
      limitations: [
        {
          affectedAnchorIds: [],
          affectedSourceIds: [],
          code: "not_source_truth",
          severity: "blocking",
          summary:
            "Invalid local read-only evidence tool dispatch request failed closed before any evidence service call.",
        },
      ],
      permittedNextActions: [
        {
          action: "request_human_review",
          label:
            "Use only the exact V2G read-only evidence tool names and arguments.",
          targetId: input.toolName,
        },
      ],
      redactions: [],
      refusalReason: input.refusalReason,
      result: null,
      schemaVersion: "v2c.evidence-tool.v1",
      sourceAnchors: [],
      toolName: input.toolName,
      unsupportedReason: "Invalid read-only evidence tool dispatch request.",
    },
  });
}

function formatDispatchResult(input: {
  isError: boolean;
  structuredContent: ReadOnlyEvidenceToolDispatchResult["structuredContent"];
}): ReadOnlyEvidenceToolDispatchResult {
  return {
    content: [
      {
        text: buildStructuredContentTextMirror({
          isError: input.isError,
          structuredContent: input.structuredContent,
        }),
        type: "text",
      },
    ],
    isError: input.isError,
    structuredContent: input.structuredContent,
  };
}

function buildStructuredContentTextMirror(input: {
  isError: boolean;
  structuredContent: ReadOnlyEvidenceToolDispatchResult["structuredContent"];
}) {
  const { structuredContent } = input;
  const mirror = {
    schemaVersion: READ_ONLY_EVIDENCE_DISPATCH_TEXT_MIRROR_SCHEMA_VERSION,
    adapterSchemaVersion: structuredContent.adapterSchemaVersion,
    toolName: structuredContent.toolName,
    companyKey: structuredContent.companyKey,
    isError: input.isError,
    refusalReason: structuredContent.refusalReason,
    freshness: {
      state: structuredContent.freshness.state,
      checkedAt: structuredContent.freshness.checkedAt,
      summary: structuredContent.freshness.summary,
    },
    counts: {
      citations: structuredContent.citations.length,
      evidence: structuredContent.evidence.length,
      limitations: structuredContent.limitations.length,
      permittedNextActions: structuredContent.permittedNextActions.length,
      redactions: structuredContent.redactions.length,
      sourceAnchors: structuredContent.sourceAnchors.length,
    },
    capabilityBoundary: {
      localDispatchAdapterOnly:
        structuredContent.capabilityBoundary.localDispatchAdapterOnly,
      readOnly: structuredContent.capabilityBoundary.readOnly,
      routeExpansionImplemented:
        structuredContent.capabilityBoundary.routeExpansionImplemented,
      sourceMutationPerformed:
        structuredContent.capabilityBoundary.sourceMutationPerformed,
      financeWritePerformed:
        structuredContent.capabilityBoundary.financeWritePerformed,
      providerCallsMade: structuredContent.capabilityBoundary.providerCallsMade,
      externalCommunicationsEmitted:
        structuredContent.capabilityBoundary.externalCommunicationsEmitted,
      openAiApiCallsMade:
        structuredContent.capabilityBoundary.openAiApiCallsMade,
      openAiClientOrKeyUsed:
        structuredContent.capabilityBoundary.openAiClientOrKeyUsed,
      modelCallsMade: structuredContent.capabilityBoundary.modelCallsMade,
    },
    resultSummary: summarizeStructuredResult(structuredContent.result),
  };
  const serialized = JSON.stringify(mirror);

  if (
    serialized.length <= READ_ONLY_EVIDENCE_DISPATCH_TEXT_MIRROR_MAX_CHARACTERS
  ) {
    return serialized;
  }

  return JSON.stringify({
    schemaVersion: READ_ONLY_EVIDENCE_DISPATCH_TEXT_MIRROR_SCHEMA_VERSION,
    adapterSchemaVersion: structuredContent.adapterSchemaVersion,
    bounded: true,
    companyKey: structuredContent.companyKey,
    counts: mirror.counts,
    isError: input.isError,
    refusalReason: structuredContent.refusalReason,
    toolName: structuredContent.toolName,
  });
}

function summarizeStructuredResult(result: unknown) {
  if (result === null || typeof result !== "object") return null;
  if ("sourceCoverageMatrix" in result) {
    const matrix = result.sourceCoverageMatrix as { entries?: unknown[] };

    return {
      resultKind: "source_coverage",
      sourceCoverageEntryCount: Array.isArray(matrix.entries)
        ? matrix.entries.length
        : 0,
    };
  }
  if ("artifactKind" in result && "artifactId" in result) {
    return {
      artifactId: String(result.artifactId),
      artifactKind: String(result.artifactKind),
      resultKind: "fetch",
    };
  }
  if (Array.isArray(result)) {
    return {
      resultCount: result.length,
      resultKind: "list",
    };
  }
  if ("companyKey" in result) {
    return {
      resultKind: "company_posture",
    };
  }
  if ("requestedActionAllowed" in result) {
    return {
      resultKind: "capability_boundaries",
      requestedActionAllowed: Boolean(result.requestedActionAllowed),
    };
  }

  return {
    resultKind: "structured",
  };
}

function refusalReasonFor(response: EvidenceToolResponse<unknown>) {
  if (response.freshness.state === "stale") return "stale_evidence";
  if (response.freshness.state === "mixed") return "conflicting_evidence";
  if (response.freshness.state === "failed") return "unsupported_evidence";
  if (response.ok && response.evidence.length === 0) return "missing_evidence";
  if (response.ok && response.citations.length === 0) return "missing_citation";
  if (response.ok) return null;
  if (hasMissingEvidenceLimitation(response.limitations))
    return "missing_evidence";
  if (hasUnsupportedEvidenceLimitation(response.limitations)) {
    return "unsupported_evidence";
  }

  return response.freshness.state === "missing"
    ? "missing_evidence"
    : "unsupported_evidence";
}

function capabilityBoundary() {
  return {
    appsSdkResourcesImplemented: false,
    appSubmissionImplemented: false,
    authorityBoundary:
      "raw_sources_finance_twin_and_cfo_wiki_remain_source_of_truth",
    externalCommunicationsEmitted: false,
    financeWritePerformed: false,
    generatedFinanceAdviceEmitted: false,
    localDispatchAdapterOnly: true,
    modelCallsMade: false,
    modelOutputCanBecomeSourceTruth: false,
    openAiApiCallsMade: false,
    openAiClientOrKeyUsed: false,
    providerCallsMade: false,
    publicAssetsCreated: false,
    readOnly: true,
    remoteMcpDeploymentImplemented: false,
    routeExpansionImplemented: false,
    sourceMutationPerformed: false,
    toolDispatchImplemented: true,
  };
}

function sourceAnchorCitations(citations: EvidenceToolCitation[]) {
  return citations.filter(
    (citation) =>
      citation.citationType === "source_anchor" ||
      citation.sourceAnchorId !== null,
  );
}

function hasMissingEvidenceLimitation(
  limitations: EvidenceIndexLimitationPosture[],
) {
  return limitations.some((limitation) =>
    [
      "missing_document_extract",
      "missing_source_file",
      "missing_source_snapshot",
      "source_not_indexed",
    ].includes(limitation.code),
  );
}

function hasUnsupportedEvidenceLimitation(
  limitations: EvidenceIndexLimitationPosture[],
) {
  return limitations.some(
    (limitation) =>
      limitation.code.startsWith("unsupported_") ||
      limitation.code === "extraction_failed" ||
      limitation.code === "checksum_mismatch",
  );
}

export function exactEvidenceDispatchAdapterToolNames() {
  return [...MCP_TOOL_ALLOWLIST];
}
