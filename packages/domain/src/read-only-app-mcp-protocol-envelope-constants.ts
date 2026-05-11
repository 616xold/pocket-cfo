import { z } from "zod";
import { MCP_DESCRIPTOR_OUTPUT_REQUIRED_FIELDS } from "./read-only-app-mcp-descriptor";

export const MCP_PROTOCOL_ENVELOPE_SCHEMA_VERSION =
  "v2z.read-only-app-mcp-protocol-envelope.v1";

export const FP0106_MCP_PROTOCOL_ENVELOPE_PLAN_PATH =
  "plans/FP-0106-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts.md";

export const MCP_PROTOCOL_PUBLIC_PATH = "/mcp";

export const MCP_PROTOCOL_REQUIRED_FUTURE_METHODS = [
  "initialize",
  "notifications/initialized",
  "tools/list",
  "tools/call",
] as const;

export const MCP_PROTOCOL_ACCEPTED_METHODS =
  MCP_PROTOCOL_REQUIRED_FUTURE_METHODS;

export const MCP_PROTOCOL_LIVENESS_METHOD = "ping";

export const MCP_PROTOCOL_LIVENESS_METHODS = [
  MCP_PROTOCOL_LIVENESS_METHOD,
] as const;

export const MCP_PROTOCOL_REJECTED_METHODS = [
  "resources/list",
  "resources/read",
  "resources/subscribe",
  "prompts/list",
  "prompts/get",
  "sampling/createMessage",
  "roots/list",
  "completion/complete",
  "create_mission",
  "upload_source",
  "update_ledger",
  "send_report",
  "provider_connect",
  "certify_close",
  "contact_customer",
  "payment",
  "legal_advice",
  "audit_opinion",
  "tax_filing",
] as const;

export const MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS = [
  "evidence",
  "sourceAnchors",
  "freshness",
  "limitations",
  "refusalReason",
  "permittedNextActions",
  "capabilityBoundary",
] as const;

export const MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS = [
  "structuredContent",
  "evidence",
  "sourceAnchors",
  "freshness",
  "limitations",
  "capabilityBoundary",
] as const;

export const MCP_PROTOCOL_LOGGING_REDACTION_FIELDS = [
  "tokens",
  "rawPrompts",
  "rawSourceFiles",
  "privateFinanceData",
  "evidenceDumps",
  "cookies",
  "sessions",
  "oauthMaterial",
  "providerCredentials",
  "objectStoreDumps",
  "databaseDumps",
  "apiKeys",
] as const;

export const LivenessMethodSchema = z.enum(MCP_PROTOCOL_LIVENESS_METHODS);
export const RejectedMethodSchema = z.enum(MCP_PROTOCOL_REJECTED_METHODS);
export const ResponseEnvelopeFieldSchema = z.enum(
  MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS,
);
export const StructuredContentFieldSchema = z.enum(
  MCP_PROTOCOL_STRUCTURED_CONTENT_FIELDS,
);
export const LoggingRedactionFieldSchema = z.enum(
  MCP_PROTOCOL_LOGGING_REDACTION_FIELDS,
);

export function descriptorOutputFieldsForProtocol(): readonly string[] {
  return [...MCP_DESCRIPTOR_OUTPUT_REQUIRED_FIELDS];
}

export function sameMcpProtocolList(
  left: readonly string[],
  right: readonly string[],
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
