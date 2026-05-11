import { isMcpToolAllowed } from "@pocket-cto/domain";
import {
  formatInitializeResult,
  formatJsonRpcError,
  formatJsonRpcResult,
  formatToolDispatchRefusalResult,
  formatToolsListResult,
  type JsonRpcResponse,
} from "./formatter";
import {
  initializeParamsSchema,
  jsonRpcEnvelopeSchema,
  pingParamsSchema,
  toolArgumentSchemas,
  toolsCallParamsSchema,
  toolsListParamsSchema,
  type JsonRpcEnvelope,
  type JsonRpcId,
  type ToolName,
} from "./schema";

export type ReadOnlyAppMcpEndpointResult = JsonRpcResponse | null;

export class ReadOnlyAppMcpEndpointService {
  handle(input: unknown): ReadOnlyAppMcpEndpointResult {
    const parsed = jsonRpcEnvelopeSchema.safeParse(input);
    if (!parsed.success) {
      return invalidRequest(null, "Invalid JSON-RPC 2.0 request envelope");
    }

    const envelope = parsed.data;
    if (envelope.method === "notifications/initialized") {
      return this.handleInitializedNotification(envelope);
    }

    if (envelope.id === undefined) {
      return invalidRequest(null, "JSON-RPC requests must include an id");
    }

    switch (envelope.method) {
      case "initialize":
        return this.handleInitialize(envelope.id, envelope.params);
      case "ping":
        return this.handlePing(envelope.id, envelope.params);
      case "tools/list":
        return this.handleToolsList(envelope.id, envelope.params);
      case "tools/call":
        return this.handleToolsCall(envelope.id, envelope.params);
      default:
        return methodNotFound(envelope.id, envelope.method);
    }
  }

  private handleInitialize(id: JsonRpcId, params: unknown): JsonRpcResponse {
    const parsed = initializeParamsSchema.safeParse(params);
    if (!parsed.success) {
      return invalidParams(id, "Invalid initialize params");
    }

    return formatJsonRpcResult(id, formatInitializeResult());
  }

  private handlePing(id: JsonRpcId, params: unknown): JsonRpcResponse {
    const parsed = pingParamsSchema.safeParse(params);
    if (!parsed.success) {
      return invalidParams(id, "Invalid ping params");
    }

    return formatJsonRpcResult(id, {});
  }

  private handleInitializedNotification(
    envelope: JsonRpcEnvelope,
  ): ReadOnlyAppMcpEndpointResult {
    if (envelope.id !== undefined) {
      return invalidRequest(envelope.id, "Initialized notifications must not include an id");
    }

    return null;
  }

  private handleToolsList(id: JsonRpcId, params: unknown): JsonRpcResponse {
    const parsed = toolsListParamsSchema.safeParse(params);
    if (!parsed.success) {
      return invalidParams(id, "Invalid tools/list params");
    }

    return formatJsonRpcResult(id, formatToolsListResult());
  }

  private handleToolsCall(id: JsonRpcId, params: unknown): JsonRpcResponse {
    const parsed = toolsCallParamsSchema.safeParse(params);
    if (!parsed.success) {
      return invalidParams(id, "Invalid tools/call params");
    }

    const toolName = parsed.data.name;
    if (!isMcpToolAllowed(toolName)) {
      return invalidParams(id, "Invalid read-only tool name");
    }

    const argumentSchema = toolArgumentSchemas[toolName as ToolName];
    const parsedArguments = argumentSchema.safeParse(parsed.data.arguments ?? {});
    if (!parsedArguments.success) {
      return invalidParams(id, "Invalid read-only tool arguments");
    }

    return formatJsonRpcResult(
      id,
      formatToolDispatchRefusalResult(toolName as ToolName),
    );
  }
}

function invalidRequest(
  id: JsonRpcId | null,
  message: string,
): JsonRpcResponse {
  return formatJsonRpcError({
    code: -32600,
    data: {
      failClosed: true,
      localRouteAdapterOnly: true,
      reason: "invalid_request",
    },
    id,
    message,
  });
}

function methodNotFound(id: JsonRpcId, method: string): JsonRpcResponse {
  return formatJsonRpcError({
    code: -32601,
    data: {
      failClosed: true,
      localRouteAdapterOnly: true,
      method,
      reason: "method_not_found",
    },
    id,
    message: "Method not found",
  });
}

function invalidParams(id: JsonRpcId, message: string): JsonRpcResponse {
  return formatJsonRpcError({
    code: -32602,
    data: {
      failClosed: true,
      localRouteAdapterOnly: true,
      reason: "invalid_params",
    },
    id,
    message,
  });
}
