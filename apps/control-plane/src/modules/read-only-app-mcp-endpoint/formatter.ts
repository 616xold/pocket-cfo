import {
  MCP_TOOL_ALLOWLIST,
  READ_ONLY_APP_MCP_SCHEMA_VERSION,
  buildMcpToolDescriptorContracts,
  type McpToolName,
} from "@pocket-cto/domain";
import type { JsonRpcId, ToolName } from "./schema";

export type JsonRpcSuccessResponse = {
  jsonrpc: "2.0";
  id: JsonRpcId;
  result: Record<string, unknown>;
};

export type JsonRpcErrorResponse = {
  jsonrpc: "2.0";
  id: JsonRpcId | null;
  error: {
    code: number;
    message: string;
    data?: Record<string, unknown>;
  };
};

export type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse;

export function formatJsonRpcResult(
  id: JsonRpcId,
  result: Record<string, unknown>,
): JsonRpcSuccessResponse {
  return {
    id,
    jsonrpc: "2.0",
    result,
  };
}

export function formatJsonRpcError(input: {
  code: number;
  data?: Record<string, unknown>;
  id: JsonRpcId | null;
  message: string;
}): JsonRpcErrorResponse {
  return {
    error: {
      code: input.code,
      data: input.data,
      message: input.message,
    },
    id: input.id,
    jsonrpc: "2.0",
  };
}

export function formatInitializeResult() {
  return {
    capabilities: {
      tools: {
        listChanged: false,
      },
    },
    protocolVersion: "2025-06-18",
    serverInfo: {
      name: "pocket-cfo-read-only-local-mcp",
      version: "fp-0107-local-route-adapter-shell",
    },
  };
}

export function formatToolsListResult() {
  return {
    tools: buildMcpToolDescriptorContracts().map((descriptor) => ({
      annotations: descriptor.annotations,
      description: toolDescription(descriptor.toolName),
      inputSchema: inputSchemaForTool(descriptor.toolName),
      name: descriptor.toolName,
      title: toolTitle(descriptor.toolName),
    })),
  };
}

export function formatToolDispatchRefusalResult(toolName: ToolName) {
  return {
    content: [
      {
        text: "Read-only tool dispatch is disabled in this local route adapter shell.",
        type: "text",
      },
    ],
    isError: true,
    structuredContent: {
      authorityBoundary: "raw_sources_finance_twin_and_cfo_wiki_remain_source_of_truth",
      capabilityBoundary: {
        appsSdkResourcesImplemented: false,
        localRouteAdapterOnly: true,
        remoteMcpDeploymentImplemented: false,
        toolDispatchImplemented: false,
      },
      evidence: [],
      forbiddenActions: [
        "source_mutation",
        "finance_write",
        "provider_call",
        "external_communication",
        "generated_finance_advice",
      ],
      freshness: {
        posture: "not_applicable",
        reason: "No evidence service dispatch occurs in FP-0107.",
      },
      limitations: [
        "FP-0107 validates protocol shape only.",
        "Read-only evidence tool dispatch requires a later Finance Plan.",
      ],
      noRuntimeBoundary: {
        modelCallsMade: false,
        openAiApiCallsMade: false,
        runtimeCodexFinanceOutputCreated: false,
      },
      permittedNextActions: ["plan_read_only_evidence_dispatch"],
      privacyBoundary: {
        rawFullFileDumpReturned: false,
        privateFinanceDataDumpReturned: false,
      },
      refusalReason: "tool_dispatch_not_implemented_until_later_finance_plan",
      schemaVersion: READ_ONLY_APP_MCP_SCHEMA_VERSION,
      sourceAnchors: [],
      toolName,
    },
  };
}

function inputSchemaForTool(toolName: McpToolName) {
  const properties: Record<string, Record<string, unknown>> = {
    companyKey: { minLength: 1, type: "string" },
  };
  const required = ["companyKey"];

  switch (toolName) {
    case "search_evidence":
      properties.query = { minLength: 1, type: "string" };
      properties.limit = { maximum: 25, minimum: 1, type: "integer" };
      required.push("query");
      break;
    case "fetch_evidence_card":
      properties.evidenceCardId = { minLength: 1, type: "string" };
      required.push("evidenceCardId");
      break;
    case "fetch_source_anchor":
      properties.sourceAnchorId = { minLength: 1, type: "string" };
      required.push("sourceAnchorId");
      break;
    case "fetch_document_map":
      properties.documentMapId = { minLength: 1, type: "string" };
      required.push("documentMapId");
      break;
    case "fetch_source_coverage":
      properties.sourceId = { minLength: 1, type: "string" };
      required.push("sourceId");
      break;
    case "fetch_company_posture":
      properties.periodKey = { minLength: 1, type: "string" };
      break;
    case "fetch_capability_boundaries":
      break;
  }

  return {
    additionalProperties: false,
    properties,
    required,
    type: "object",
  };
}

function toolTitle(toolName: McpToolName) {
  return toolName
    .split("_")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

function toolDescription(toolName: McpToolName) {
  if (!(MCP_TOOL_ALLOWLIST as readonly string[]).includes(toolName)) {
    return "Unknown read-only tool";
  }

  return `Local read-only Pocket CFO ${toolName} contract.`;
}
