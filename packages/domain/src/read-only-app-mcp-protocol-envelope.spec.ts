import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  classifyMcpToolCandidate,
  MCP_TOOL_ALLOWLIST,
} from "./read-only-app-mcp";
import {
  FP0106_MCP_PROTOCOL_ENVELOPE_PLAN_PATH,
  MCP_PROTOCOL_ACCEPTED_METHODS,
  MCP_PROTOCOL_LIVENESS_METHOD,
  MCP_PROTOCOL_PUBLIC_PATH,
  MCP_PROTOCOL_REJECTED_METHODS,
  MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS,
  McpProtocolAcceptedMethodsBoundarySchema,
  McpProtocolArgumentValidationBoundarySchema,
  McpProtocolNoRouteImplementationBoundarySchema,
  McpProtocolPingBoundarySchema,
  McpProtocolProofSchema,
  McpProtocolReadOnlyToolAllowlistBoundarySchema,
  McpProtocolRejectedMethodsBoundarySchema,
  McpProtocolToolsCallBoundarySchema,
  buildMcpProtocolEnvelopeContracts,
  buildMcpProtocolProof,
} from "./read-only-app-mcp-protocol-envelope";
import { inspectEndpointRuntimeRepositoryInventory } from "./read-only-app-mcp-endpoint-architecture";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));

describe("FP-0106 MCP protocol envelope and tool-dispatch proof contracts", () => {
  it("accepts exactly one FP-0106 path and keeps FP-0107 absent", () => {
    const paths = repoFilePaths();
    const fp0106Hits = paths.filter((path) => /(^|\/)FP-0106/u.test(path));
    const fp0107Hits = paths.filter((path) => /(^|\/)FP-0107/u.test(path));

    expect(fp0106Hits).toEqual([FP0106_MCP_PROTOCOL_ENVELOPE_PLAN_PATH]);
    expect(fp0107Hits).toEqual([]);
  });

  it("requires local/proof-only protocol envelope and tool-dispatch wording", () => {
    const normalized = readFileSync(
      join(repoRoot, FP0106_MCP_PROTOCOL_ENVELOPE_PLAN_PATH),
      "utf8",
    )
      .toLowerCase()
      .replace(/`/gu, "");

    for (const phrase of [
      "fp-0106 is not implementation",
      "local/proof-only/read-only mcp protocol envelope and tool-dispatch contract work",
      "does not authorize endpoint implementation",
      "does not authorize route implementation",
      "does not authorize oauth/token/session implementation",
      "does not authorize openai api/model calls",
      "keeps fp-0107 absent",
    ]) {
      expect(normalized).toContain(phrase);
    }
  });

  it("keeps /mcp future-only and creates no route file", () => {
    const contracts = buildMcpProtocolEnvelopeContracts();

    expect(contracts.pathBoundary.futurePublicChatGptFacingEndpointPath).toBe(
      MCP_PROTOCOL_PUBLIC_PATH,
    );
    expect(contracts.pathBoundary.pathFutureOnly).toBe(true);
    expect(contracts.pathBoundary.pathImplemented).toBe(false);
    expect(contracts.pathBoundary.routeFileCreated).toBe(false);
    expect(
      McpProtocolNoRouteImplementationBoundarySchema.safeParse({
        ...contracts.noRouteImplementationBoundary,
        routeFileCreated: true,
      }).success,
    ).toBe(false);
  });

  it("requires the exact future MCP method list and fail-closed rejection", () => {
    const contracts = buildMcpProtocolEnvelopeContracts();

    expect(contracts.acceptedMethodsBoundary.acceptedMethods).toEqual([
      ...MCP_PROTOCOL_ACCEPTED_METHODS,
    ]);
    expect(contracts.acceptedMethodsBoundary.livenessUtilityMethods).toEqual([
      MCP_PROTOCOL_LIVENESS_METHOD,
    ]);
    expect(
      McpProtocolAcceptedMethodsBoundarySchema.safeParse({
        ...contracts.acceptedMethodsBoundary,
        acceptedMethods: [...MCP_PROTOCOL_ACCEPTED_METHODS, "resources/list"],
      }).success,
    ).toBe(false);
    expect(MCP_PROTOCOL_REJECTED_METHODS).not.toContain(
      MCP_PROTOCOL_LIVENESS_METHOD,
    );
    expect(contracts.rejectedMethodsBoundary.allOtherMethodsFailClosed).toBe(
      true,
    );
    expect(
      McpProtocolRejectedMethodsBoundarySchema.safeParse({
        ...contracts.rejectedMethodsBoundary,
        rejectedMethods:
          contracts.rejectedMethodsBoundary.rejectedMethods.slice(1),
      }).success,
    ).toBe(false);
  });

  it("treats ping as future MCP liveness, not rejected method or tool dispatch", () => {
    const contracts = buildMcpProtocolEnvelopeContracts();

    expect(contracts.pingBoundary.methodName).toBe(
      MCP_PROTOCOL_LIVENESS_METHOD,
    );
    expect(contracts.pingBoundary.futureProtocolLivenessRequest).toBe(true);
    expect(contracts.pingBoundary.establishedSessionRequestOnlyFuture).toBe(
      true,
    );
    expect(
      contracts.pingBoundary.emptyJsonRpcResultRequiredForFutureRoute,
    ).toBe(true);
    expect(contracts.pingBoundary.implementedInFp0106).toBe(false);
    expect(contracts.pingBoundary.routeImplementationExists).toBe(false);
    expect(contracts.pingBoundary.dispatchesToTools).toBe(false);
    expect(contracts.pingBoundary.dispatchesToEvidenceServices).toBe(false);
    expect(contracts.pingBoundary.dispatchesToFinanceTwin).toBe(false);
    expect(contracts.pingBoundary.dispatchesToCfoWiki).toBe(false);
    expect(contracts.pingBoundary.sourceMutationAllowed).toBe(false);
    expect(contracts.pingBoundary.financeWritesAllowed).toBe(false);
    expect(contracts.pingBoundary.openAiApiModelCallsAllowed).toBe(false);
    expect(contracts.pingBoundary.externalCommunicationsAllowed).toBe(false);
  });

  it("fails proof contracts if ping is reclassified as rejected", () => {
    const contracts = buildMcpProtocolEnvelopeContracts();
    const proof = buildMcpProtocolProof();

    expect(
      McpProtocolRejectedMethodsBoundarySchema.safeParse({
        ...contracts.rejectedMethodsBoundary,
        rejectedMethods: [
          ...contracts.rejectedMethodsBoundary.rejectedMethods,
          MCP_PROTOCOL_LIVENESS_METHOD,
        ],
      }).success,
    ).toBe(false);
    expect(
      McpProtocolProofSchema.safeParse({
        ...proof,
        rejectedMethods: [
          ...proof.rejectedMethods,
          MCP_PROTOCOL_LIVENESS_METHOD,
        ],
      }).success,
    ).toBe(false);
  });

  it("fails ping proof if ping can dispatch tools or mutate state", () => {
    const contracts = buildMcpProtocolEnvelopeContracts();
    const proof = buildMcpProtocolProof();

    for (const key of [
      "dispatchesToTools",
      "dispatchesToEvidenceServices",
      "dispatchesToFinanceTwin",
      "dispatchesToCfoWiki",
      "sourceMutationAllowed",
      "financeWritesAllowed",
      "openAiApiModelCallsAllowed",
      "externalCommunicationsAllowed",
    ] as const) {
      expect(
        McpProtocolPingBoundarySchema.safeParse({
          ...contracts.pingBoundary,
          [key]: true,
        }).success,
      ).toBe(false);
    }
    expect(
      McpProtocolProofSchema.safeParse({
        ...proof,
        mcpProtocolPingBoundaryVerified: false,
      }).success,
    ).toBe(false);
  });

  it("keeps all non-ping unsupported methods fail-closed", () => {
    const contracts = buildMcpProtocolEnvelopeContracts();

    expect(contracts.rejectedMethodsBoundary.rejectedMethods).toContain(
      "resources/list",
    );
    expect(contracts.rejectedMethodsBoundary.rejectedMethods).toContain(
      "prompts/get",
    );
    expect(contracts.rejectedMethodsBoundary.rejectedMethods).toContain(
      "sampling/createMessage",
    );
    expect(contracts.rejectedMethodsBoundary.rejectedMethods).toContain(
      "completion/complete",
    );
    expect(contracts.rejectedMethodsBoundary.rejectedMethods).not.toContain(
      MCP_PROTOCOL_LIVENESS_METHOD,
    );
    expect(contracts.rejectedMethodsBoundary.allOtherMethodsFailClosed).toBe(
      true,
    );
    expect(
      contracts.rejectedMethodsBoundary.noBestEffortUnknownMethodHandling,
    ).toBe(true);
  });

  it("preserves exact V2G read-only tools and forbids dynamic tool drift", () => {
    const contracts = buildMcpProtocolEnvelopeContracts();

    expect(contracts.readOnlyToolAllowlistBoundary.allowedTools).toEqual([
      ...MCP_TOOL_ALLOWLIST,
    ]);
    expect(contracts.readOnlyToolAllowlistBoundary.dynamicToolsAllowed).toBe(
      false,
    );
    expect(
      McpProtocolReadOnlyToolAllowlistBoundarySchema.safeParse({
        ...contracts.readOnlyToolAllowlistBoundary,
        allowedTools: [...MCP_TOOL_ALLOWLIST, "send_report"],
      }).success,
    ).toBe(false);
  });

  it("fails closed for invalid tools and invalid arguments", () => {
    const contracts = buildMcpProtocolEnvelopeContracts();

    expect(contracts.toolsCallBoundary.invalidToolNamesFailClosed).toBe(true);
    expect(contracts.toolsCallBoundary.invalidArgumentsFailClosed).toBe(true);
    expect(classifyMcpToolCandidate("create mission").forbidden).toBe(true);
    expect(classifyMcpToolCandidate("pay vendor").forbidden).toBe(true);
    expect(
      McpProtocolToolsCallBoundarySchema.safeParse({
        ...contracts.toolsCallBoundary,
        invalidToolNamesFailClosed: false,
      }).success,
    ).toBe(false);
    expect(
      McpProtocolArgumentValidationBoundarySchema.safeParse({
        ...contracts.argumentValidationBoundary,
        invalidArgumentsFailClosed: false,
      }).success,
    ).toBe(false);
  });

  it("requires evidence, freshness, limitations, refusal, permitted actions, and capability boundary fields", () => {
    const contracts = buildMcpProtocolEnvelopeContracts();

    expect(
      contracts.evidenceEnvelopeBoundary.responseMustPreserveFields,
    ).toEqual([...MCP_PROTOCOL_RESPONSE_ENVELOPE_FIELDS]);
    expect(contracts.refusalEnvelopeBoundary.refusalReasonRequired).toBe(true);
    expect(contracts.refusalEnvelopeBoundary.permittedNextActionsRequired).toBe(
      true,
    );
    expect(contracts.refusalEnvelopeBoundary.capabilityBoundaryRequired).toBe(
      true,
    );
  });

  it("rejects endpoint, remote MCP, OAuth, Apps SDK, public app, submission, and OpenAI scope booleans", () => {
    const proof = buildMcpProtocolProof();

    for (const key of [
      "noEndpointImplementation",
      "noRouteImplementation",
      "noWebApiBackendControlPlaneRouteImplementation",
      "noRemoteMcpServerImplementation",
      "noOauthTokenSessionImplementation",
      "noAppsSdkResourceImplementation",
      "noPublicChatGptAppImplementation",
      "noAppSubmission",
      "noOpenAiApiCalls",
      "noModelCalls",
      "noOpenAiClientOrKeyUsage",
    ] as const) {
      expect(
        McpProtocolProofSchema.safeParse({
          ...proof,
          [key]: false,
        }).success,
      ).toBe(false);
    }
  });

  it("builds the machine-readable protocol proof and preserves prior boundaries", () => {
    const proof = buildMcpProtocolProof();

    expect(McpProtocolProofSchema.safeParse(proof).success).toBe(true);
    expect(proof.fp0106BoundaryVerified).toBe(true);
    expect(proof.fp0107Absent).toBe(true);
    expect(proof.mcpProtocolPingBoundaryVerified).toBe(true);
    expect(proof.mcpProtocolMethodCompatibilityWithOfficialSpecVerified).toBe(
      true,
    );
    expect(proof.fp0105RouteOwnershipBoundaryStillVerified).toBe(true);
    expect(proof.fp0104EndpointReadinessBoundaryStillVerified).toBe(true);
    expect(proof.fp0103EndpointArchitectureBoundaryStillVerified).toBe(true);
    expect(proof.fp0100PublicSecurityBoundaryStillVerified).toBe(true);
  });

  it("passes current endpoint runtime inventory and rejects simulated public runtime files", () => {
    const currentInventory = inspectEndpointRuntimeRepositoryInventory(
      repoFilePaths()
        .filter((path) => /\.(?:ts|tsx|js|mjs|json)$/u.test(path))
        .map((path) => ({ path, source: safeRead(path) })),
    );
    const simulatedInventory = inspectEndpointRuntimeRepositoryInventory([
      {
        path: "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts",
        source: "export async function POST() { return { endpoint: '/mcp' }; }",
      },
    ]);

    expect(currentInventory.endpointRuntimeRepositoryInventoryVerified).toBe(
      true,
    );
    expect(simulatedInventory.endpointRuntimeRepositoryInventoryVerified).toBe(
      false,
    );
  });
});

function repoFilePaths() {
  const results: string[] = [];
  const skippedDirectories = new Set([
    ".git",
    ".next",
    ".turbo",
    "coverage",
    "dist",
    "node_modules",
  ]);

  function walk(directory: string, prefix = "") {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && skippedDirectories.has(entry.name)) continue;
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath, relativePath);
      } else {
        results.push(relativePath);
      }
    }
  }

  walk(repoRoot);
  return results.sort();
}

function safeRead(path: string) {
  try {
    return readFileSync(join(repoRoot, path), "utf8");
  } catch {
    return "";
  }
}

expect(existsSync(repoRoot)).toBe(true);
