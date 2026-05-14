import { z } from "zod";
import {
  EVIDENCE_TOOL_DISPATCH_ARGUMENT_SCHEMAS_BY_TOOL,
  McpToolNameSchema,
} from "@pocket-cto/domain";
import type { MCP_TOOL_ALLOWLIST } from "@pocket-cto/domain";

export const jsonRpcIdSchema = z.union([z.string(), z.number().int()]);

export const jsonRpcEnvelopeSchema = z
  .object({
    id: jsonRpcIdSchema.optional(),
    jsonrpc: z.literal("2.0"),
    method: z.string().min(1),
    params: z.unknown().optional(),
  })
  .strict();

const optionalEmptyParamsSchema = z.object({}).strict().optional();

export const initializeParamsSchema = z
  .object({
    capabilities: z.record(z.unknown()).optional(),
    clientInfo: z.record(z.unknown()).optional(),
    protocolVersion: z.string().optional(),
  })
  .strict()
  .optional();

export const pingParamsSchema = optionalEmptyParamsSchema;

export const toolsListParamsSchema = z
  .object({
    cursor: z.string().optional(),
  })
  .strict()
  .optional();

export const toolArgumentSchemas =
  EVIDENCE_TOOL_DISPATCH_ARGUMENT_SCHEMAS_BY_TOOL satisfies Record<
    (typeof MCP_TOOL_ALLOWLIST)[number],
    z.ZodType<Record<string, unknown>>
  >;

export const toolsCallParamsSchema = z
  .object({
    arguments: z.record(z.unknown()).optional(),
    name: McpToolNameSchema,
  })
  .strict();

export type McpOriginValidationResult =
  | {
      allowed: true;
      reason: "absent_origin" | "loopback_origin";
    }
  | {
      allowed: false;
      reason: "invalid_origin" | "multiple_origin_headers";
    };

export function validateLocalMcpOriginHeader(
  originHeader: string | string[] | undefined,
): McpOriginValidationResult {
  if (originHeader === undefined) {
    return {
      allowed: true,
      reason: "absent_origin",
    };
  }

  if (Array.isArray(originHeader)) {
    return {
      allowed: false,
      reason: "multiple_origin_headers",
    };
  }

  const trimmedOrigin = originHeader.trim();
  if (trimmedOrigin.length === 0) {
    return {
      allowed: false,
      reason: "invalid_origin",
    };
  }

  try {
    const parsed = new URL(trimmedOrigin);
    const hostname = parsed.hostname.toLowerCase();
    const protocolAllowed =
      parsed.protocol === "http:" || parsed.protocol === "https:";
    const loopbackHost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "[::1]";

    if (protocolAllowed && loopbackHost) {
      return {
        allowed: true,
        reason: "loopback_origin",
      };
    }
  } catch {
    return {
      allowed: false,
      reason: "invalid_origin",
    };
  }

  return {
    allowed: false,
    reason: "invalid_origin",
  };
}

export type JsonRpcEnvelope = z.infer<typeof jsonRpcEnvelopeSchema>;
export type JsonRpcId = z.infer<typeof jsonRpcIdSchema>;
export type ToolName = keyof typeof toolArgumentSchemas;
