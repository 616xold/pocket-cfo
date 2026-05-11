import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MCP_TOOL_ALLOWLIST } from "./read-only-app-mcp";
import {
  ENDPOINT_LOGGING_REDACTION_FIELDS,
  ENDPOINT_PUBLIC_MCP_PATH,
  ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS,
  EndpointNoRemoteMcpServerBoundarySchema,
  EndpointNoRuntimeImplementationBoundarySchema,
  EndpointRequestResponseEnvelopeAdapterBoundarySchema,
  EndpointRouteOwnerDecisionBoundarySchema,
  EndpointRouteOwnershipProofSchema,
  EndpointRouteOwnershipNoAppsSdkResourceBoundarySchema,
  EndpointRouteOwnershipNoOauthTokenSessionBoundarySchema,
  EndpointRouteOwnershipNoRouteImplementationBoundarySchema,
  FP0105_ENDPOINT_ROUTE_OWNERSHIP_PLAN_PATH,
  buildEndpointRouteOwnershipContracts,
  buildEndpointRouteOwnershipProof,
  inspectEndpointRouteOwnershipRepositoryInventory,
} from "./read-only-app-mcp-endpoint-route-ownership";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));

describe("FP-0105 endpoint route ownership proof contracts", () => {
  it("accepts exactly one FP-0105 and one FP-0106 plan path while keeping FP-0107 absent", () => {
    const fp0105Hits = repoFilePaths().filter((path) =>
      /(^|\/)FP-0105/u.test(path),
    );
    const fp0106Hits = repoFilePaths().filter((path) =>
      /(^|\/)FP-0106/u.test(path),
    );
    const fp0107Hits = repoFilePaths().filter((path) =>
      /(^|\/)FP-0107/u.test(path),
    );

    expect(fp0105Hits).toEqual([FP0105_ENDPOINT_ROUTE_OWNERSHIP_PLAN_PATH]);
    expect(fp0106Hits).toEqual([
      "plans/FP-0106-read-only-chatgpt-app-mcp-protocol-envelope-tool-dispatch-proof-contracts.md",
    ]);
    expect(fp0107Hits).toEqual([]);
  });

  it("builds route ownership contracts as local proof-only and read-only", () => {
    const contracts = buildEndpointRouteOwnershipContracts();

    expect(contracts.ownershipProofContract.localProofOnly).toBe(true);
    expect(contracts.ownershipProofContract.routeOwnershipProofContractsOnly).toBe(
      true,
    );
    expect(
      contracts.ownershipProofContract.endpointImplementationAuthorized,
    ).toBe(false);
    expect(
      contracts.ownershipProofContract.routeImplementationAuthorized,
    ).toBe(false);
    expect(contracts.ownershipProofContract.fp0106Created).toBe(false);
  });

  it("requires local/proof-only route ownership and transport-adapter posture", () => {
    const contracts = buildEndpointRouteOwnershipContracts();

    expect(
      contracts.candidateAnalysisBoundary.candidateAnalysisDocumentationOnly,
    ).toBe(true);
    expect(contracts.transportAdapterBoundary.transportImplemented).toBe(false);
    expect(
      contracts.transportAdapterBoundary.transportAdapterDocumentationProofOnly,
    ).toBe(true);
    expect(
      contracts.transportAdapterBoundary.financeLogicInTransportAllowed,
    ).toBe(false);
  });

  it("decides apps/control-plane as documentation-only owner while blocking implementation", () => {
    const contracts = buildEndpointRouteOwnershipContracts();
    const decision = contracts.routeOwnerDecisionBoundary;

    expect(EndpointRouteOwnerDecisionBoundarySchema.safeParse(decision).success).toBe(
      true,
    );
    expect(decision.decisionOutcome).toBe("decided");
    expect(decision.selectedRouteOwner).toBe("apps_control_plane_fastify");
    expect(decision.routeImplementationAuthorized).toBe(false);
    expect(decision.endpointImplementationBlockedUntilLaterPlan).toBe(true);
    expect(decision.futureRouteFilePathPatternDocumentationOnly).toBe(
      "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts",
    );
  });

  it("allows unresolved ownership only when implementation stays blocked and missing facts are named", () => {
    const contracts = buildEndpointRouteOwnershipContracts();
    const unresolved = {
      ...contracts.routeOwnerDecisionBoundary,
      decisionOutcome: "unresolved",
      futureRouteFilePathPatternDocumentationOnly: null,
      missingInformationToUnblockRouteOwner: ["deployment owner"],
      routeOwnershipUnresolved: true,
      selectedRouteOwner: null,
    };

    expect(EndpointRouteOwnerDecisionBoundarySchema.safeParse(unresolved).success).toBe(
      true,
    );
    expect(
      EndpointRouteOwnerDecisionBoundarySchema.safeParse({
        ...unresolved,
        missingInformationToUnblockRouteOwner: [],
      }).success,
    ).toBe(false);
  });

  it("keeps future /mcp as the only named public ChatGPT-facing path", () => {
    const contracts = buildEndpointRouteOwnershipContracts();

    expect(
      contracts.mcpPathContractBoundary.futurePublicChatGptFacingEndpointPath,
    ).toBe(ENDPOINT_PUBLIC_MCP_PATH);
    expect(
      contracts.mcpPathContractBoundary
        .onlyFuturePublicChatGptFacingEndpointPathCurrentlyNamed,
    ).toBe(true);
    expect(contracts.mcpPathContractBoundary.pathImplemented).toBe(false);
    expect(contracts.mcpPathContractBoundary.privateHealthPathFutureOnly).toBe(
      true,
    );
  });

  it("rejects route, runtime, web API, backend, and control-plane route implementation", () => {
    const contracts = buildEndpointRouteOwnershipContracts();
    const proof = buildEndpointRouteOwnershipProof();

    expect(
      EndpointRouteOwnershipNoRouteImplementationBoundarySchema.safeParse(
        contracts.noRouteImplementationBoundary,
      ).success,
    ).toBe(true);
    expect(
      EndpointNoRuntimeImplementationBoundarySchema.safeParse(
        contracts.noRuntimeImplementationBoundary,
      ).success,
    ).toBe(true);
    expect(
      EndpointRouteOwnershipNoRouteImplementationBoundarySchema.safeParse({
        ...contracts.noRouteImplementationBoundary,
        implemented: true,
      }).success,
    ).toBe(false);
    expect(
      EndpointRouteOwnershipProofSchema.safeParse({
        ...proof,
        noWebApiBackendControlPlaneRouteImplementation: false,
      }).success,
    ).toBe(false);
  });

  it("rejects remote MCP, OAuth/token/session, Apps SDK resource, and app-submission scope", () => {
    const contracts = buildEndpointRouteOwnershipContracts();
    const proof = buildEndpointRouteOwnershipProof();

    expect(
      EndpointNoRemoteMcpServerBoundarySchema.safeParse({
        ...contracts.noRemoteMcpServerBoundary,
        implemented: true,
      }).success,
    ).toBe(false);
    expect(
      EndpointRouteOwnershipNoOauthTokenSessionBoundarySchema.safeParse({
        ...contracts.noOauthTokenSessionBoundary,
        futureOnly: false,
      }).success,
    ).toBe(false);
    expect(
      EndpointRouteOwnershipNoAppsSdkResourceBoundarySchema.safeParse({
        ...contracts.noAppsSdkResourceBoundary,
        implemented: true,
      }).success,
    ).toBe(false);
    expect(
      EndpointRouteOwnershipProofSchema.safeParse({
        ...proof,
        noAppSubmission: false,
      }).success,
    ).toBe(false);
  });

  it("rejects executable OpenAI API, model, client, and key usage proof booleans", () => {
    const proof = buildEndpointRouteOwnershipProof();

    for (const key of [
      "noOpenAiApiCalls",
      "noModelCalls",
      "noOpenAiClientOrKeyUsage",
    ] as const) {
      expect(
        EndpointRouteOwnershipProofSchema.safeParse({
          ...proof,
          [key]: false,
        }).success,
      ).toBe(false);
    }
  });

  it("preserves the exact V2G read-only tool allowlist", () => {
    const contracts = buildEndpointRouteOwnershipContracts();

    expect(contracts.readOnlyToolDispatchBoundary.allowedTools).toEqual([
      ...MCP_TOOL_ALLOWLIST,
    ]);
    expect(
      contracts.readOnlyToolDispatchBoundary.exactV2gReadOnlyAllowlistRequired,
    ).toBe(true);
    expect(contracts.readOnlyToolDispatchBoundary.writeActionToolsAllowed).toBe(
      false,
    );
  });

  it("preserves response envelope fields, refusal posture, and logging redaction fields", () => {
    const contracts = buildEndpointRouteOwnershipContracts();

    expect(
      EndpointRequestResponseEnvelopeAdapterBoundarySchema.safeParse(
        contracts.requestResponseEnvelopeAdapterBoundary,
      ).success,
    ).toBe(true);
    expect(
      contracts.requestResponseEnvelopeAdapterBoundary
        .responseMustPreserveFields,
    ).toEqual([...ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS]);
    expect(contracts.refusalAdapterBoundary.refusalReasonRequired).toBe(true);
    expect(contracts.refusalAdapterBoundary.failClosed).toBe(true);
    expect(contracts.loggingRedactionBoundary.mustRedact).toEqual([
      ...ENDPOINT_LOGGING_REDACTION_FIELDS,
    ]);
  });

  it("builds a machine-readable proof and rejects false boundary booleans", () => {
    const proof = buildEndpointRouteOwnershipProof();

    expect(EndpointRouteOwnershipProofSchema.safeParse(proof).success).toBe(true);
    expect(proof.endpointRouteOwnershipProofContractsVerified).toBe(true);
    expect(proof.endpointRouteOwnerDecisionBoundaryVerified).toBe(true);
    expect(proof.endpointRouteOwnerDecidedOrImplementationBlockedVerified).toBe(
      true,
    );
    expect(proof.noEndpointImplementation).toBe(true);
    expect(proof.noRouteImplementation).toBe(true);
    expect(
      proof.fp0106AbsentOrLocalMcpProtocolEnvelopeToolDispatchContractsVerified,
    ).toBe(true);
    expect(proof.fp0107Absent).toBe(true);
    expect(
      EndpointRouteOwnershipProofSchema.safeParse({
        ...proof,
        fp0104EndpointReadinessBoundaryStillVerified: false,
      }).success,
    ).toBe(false);
  });

  it("passes endpoint runtime inventory for current repo truth", () => {
    const inventory = inspectEndpointRouteOwnershipRepositoryInventory(
      repoFilePaths()
        .filter((path) => /\.(?:ts|tsx|js|mjs|json)$/u.test(path))
        .map((path) => ({ path, source: safeRead(path) })),
    );

    expect(inventory.endpointRuntimeRepositoryInventoryVerified).toBe(true);
    expect(inventory.violations).toEqual([]);
  });

  it("fails endpoint runtime inventory when simulated public-app runtime files are present", () => {
    const inventory = inspectEndpointRouteOwnershipRepositoryInventory([
      {
        path: "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts",
        source:
          "fastify.post('/mcp', async () => ({ publicApp: 'read-only-app-mcp' }));",
      },
      {
        path: "apps/web/app/read-only-app-mcp/route.ts",
        source: "export async function POST() { return NextResponse.json({}); }",
      },
    ]);

    expect(inventory.endpointRuntimeRepositoryInventoryVerified).toBe(false);
    expect(inventory.violations).toEqual([
      "apps/control-plane/src/modules/read-only-app-mcp-endpoint/routes.ts",
      "apps/web/app/read-only-app-mcp/route.ts",
    ]);
  });
});

function repoFilePaths() {
  const skippedDirectories = new Set([
    ".git",
    ".next",
    ".turbo",
    "coverage",
    "dist",
    "node_modules",
  ]);
  const results: string[] = [];

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
  const absolutePath = join(repoRoot, path);
  if (!existsSync(absolutePath)) return "";
  return readFileSync(absolutePath, "utf8");
}
