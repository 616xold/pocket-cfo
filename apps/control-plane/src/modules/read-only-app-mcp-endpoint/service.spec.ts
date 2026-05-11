import { describe, expect, it } from "vitest";
import {
  MCP_TOOL_ALLOWLIST,
  buildMcpToolDescriptorContracts,
} from "@pocket-cto/domain";
import { ReadOnlyAppMcpEndpointService } from "./service";
import type { JsonRpcErrorResponse, JsonRpcSuccessResponse } from "./formatter";
import type { ToolName } from "./schema";

describe("read-only app MCP endpoint service", () => {
  it("handles initialize with read-only tool capabilities", () => {
    const service = new ReadOnlyAppMcpEndpointService();
    const response = service.handle({
      id: "init-1",
      jsonrpc: "2.0",
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
      },
    }) as JsonRpcSuccessResponse;

    expect(response.result).toMatchObject({
      capabilities: {
        tools: {
          listChanged: false,
        },
      },
      serverInfo: {
        name: "pocket-cfo-read-only-local-mcp",
      },
    });
  });

  it("handles ping with an empty JSON-RPC result", () => {
    const service = new ReadOnlyAppMcpEndpointService();
    const response = service.handle({
      id: "ping-1",
      jsonrpc: "2.0",
      method: "ping",
    }) as JsonRpcSuccessResponse;

    expect(response).toEqual({
      id: "ping-1",
      jsonrpc: "2.0",
      result: {},
    });
  });

  it("handles initialized notification without a response or mutation", () => {
    const service = new ReadOnlyAppMcpEndpointService();

    expect(
      service.handle({
        jsonrpc: "2.0",
        method: "notifications/initialized",
      }),
    ).toBeNull();
  });

  it("returns the exact V2G read-only tool allowlist and annotations", () => {
    const service = new ReadOnlyAppMcpEndpointService();
    const response = service.handle({
      id: 1,
      jsonrpc: "2.0",
      method: "tools/list",
    }) as JsonRpcSuccessResponse;
    const tools = response.result.tools as Array<{
      annotations: Record<string, unknown>;
      name: string;
    }>;

    expect(tools.map((tool) => tool.name)).toEqual([...MCP_TOOL_ALLOWLIST]);
    expect(tools.map((tool) => tool.annotations)).toEqual(
      buildMcpToolDescriptorContracts().map(
        (descriptor) => descriptor.annotations,
      ),
    );
  });

  it("fails closed for every allowed tools/call dispatch in this slice", () => {
    const service = new ReadOnlyAppMcpEndpointService();

    for (const toolName of MCP_TOOL_ALLOWLIST) {
      const response = service.handle({
        id: `call-${toolName}`,
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          arguments: validArgumentsFor(toolName),
          name: toolName,
        },
      }) as JsonRpcSuccessResponse;

      expect(response.result).toMatchObject({
        isError: true,
        structuredContent: {
          capabilityBoundary: {
            localRouteAdapterOnly: true,
            toolDispatchImplemented: false,
          },
          refusalReason: "tool_dispatch_not_implemented_until_later_finance_plan",
          toolName,
        },
      });
    }
  });

  it("rejects invalid JSON-RPC, unknown methods, invalid tools, and invalid arguments", () => {
    const service = new ReadOnlyAppMcpEndpointService();

    expect(
      service.handle({
        id: 1,
        method: "initialize",
      }),
    ).toMatchObject({
      error: {
        code: -32600,
      },
      id: null,
    });
    expect(
      service.handle({
        id: 2,
        jsonrpc: "2.0",
        method: "resources/list",
      }),
    ).toMatchObject({
      error: {
        code: -32601,
      },
      id: 2,
    });
    expect(
      service.handle({
        id: 3,
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          arguments: {},
          name: "send_report",
        },
      }) as JsonRpcErrorResponse,
    ).toMatchObject({
      error: {
        code: -32602,
      },
      id: 3,
    });
    expect(
      service.handle({
        id: 4,
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          arguments: {
            companyKey: "acme",
          },
          name: "search_evidence",
        },
      }) as JsonRpcErrorResponse,
    ).toMatchObject({
      error: {
        code: -32602,
      },
      id: 4,
    });
  });
});

function validArgumentsFor(toolName: ToolName) {
  switch (toolName) {
    case "search_evidence":
      return {
        companyKey: "acme",
        limit: 3,
        query: "cash posture",
      };
    case "fetch_evidence_card":
      return {
        companyKey: "acme",
        evidenceCardId: "evidence-card-1",
      };
    case "fetch_source_anchor":
      return {
        companyKey: "acme",
        sourceAnchorId: "source-anchor-1",
      };
    case "fetch_document_map":
      return {
        companyKey: "acme",
        documentMapId: "document-map-1",
      };
    case "fetch_source_coverage":
      return {
        companyKey: "acme",
        sourceId: "source-1",
      };
    case "fetch_company_posture":
      return {
        companyKey: "acme",
        periodKey: "2026-04",
      };
    case "fetch_capability_boundaries":
      return {
        companyKey: "acme",
      };
  }
}
