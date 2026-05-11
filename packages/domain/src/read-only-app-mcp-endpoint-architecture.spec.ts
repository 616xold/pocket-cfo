import { describe, expect, it } from "vitest";
import {
  MCP_FORBIDDEN_TOOL_NAMES,
  MCP_TOOL_ALLOWLIST,
} from "./read-only-app-mcp";
import {
  ENDPOINT_FAIL_CLOSED_REQUESTS,
  ENDPOINT_FUTURE_INVENTORY_FIELDS,
  ENDPOINT_RESPONSE_ENVELOPE_FIELDS,
  EndpointArchitectureProofSchema,
  EndpointInventoryDeferredBoundarySchema,
  EndpointNoOauthTokenSessionBoundarySchema,
  EndpointNoRemoteMcpDeploymentBoundarySchema,
  EndpointNoRouteImplementationBoundarySchema,
  EndpointNoWebApiBackendRouteBoundarySchema,
  EndpointReadOnlyToolAllowlistBoundarySchema,
  EndpointRequestResponseEnvelopeBoundarySchema,
  buildEndpointArchitectureContracts,
  buildEndpointArchitectureProof,
  inspectEndpointRuntimeRepositoryInventory,
} from "./read-only-app-mcp-endpoint-architecture";

describe("FP-0103 endpoint architecture proof contracts", () => {
  it("builds local proof-only endpoint architecture contracts", () => {
    const contracts = buildEndpointArchitectureContracts();

    expect(contracts.architectureProofContract.localProofOnly).toBe(true);
    expect(
      contracts.architectureProofContract
        .endpointArchitectureProofContractsOnly,
    ).toBe(true);
    expect(
      contracts.architectureProofContract.endpointImplementationAuthorized,
    ).toBe(false);
    expect(
      contracts.architectureProofContract.routeImplementationAuthorized,
    ).toBe(false);
    expect(contracts.architectureProofContract.fp0104Created).toBe(false);
  });

  it("keeps endpoint inventory future-only and requires path preconditions", () => {
    const contracts = buildEndpointArchitectureContracts();

    expect(
      EndpointInventoryDeferredBoundarySchema.safeParse(
        contracts.inventoryDeferredBoundary,
      ).success,
    ).toBe(true);
    expect(contracts.inventoryDeferredBoundary.endpointInventoryFutureOnly).toBe(
      true,
    );
    expect(contracts.inventoryDeferredBoundary.endpointInventoryImplemented).toBe(
      false,
    );
    expect(
      contracts.inventoryDeferredBoundary.requiredFutureInventoryFields,
    ).toEqual([...ENDPOINT_FUTURE_INVENTORY_FIELDS]);
    expect(contracts.pathInventoryPreconditions.noEndpointPathImplemented).toBe(
      true,
    );
  });

  it("rejects endpoint, route, API, backend, and control-plane implementation", () => {
    const contracts = buildEndpointArchitectureContracts();

    expect(
      EndpointNoRouteImplementationBoundarySchema.safeParse(
        contracts.noRouteImplementationBoundary,
      ).success,
    ).toBe(true);
    expect(
      EndpointNoWebApiBackendRouteBoundarySchema.safeParse(
        contracts.noWebApiBackendRouteBoundary,
      ).success,
    ).toBe(true);
    expect(
      EndpointNoRouteImplementationBoundarySchema.safeParse({
        ...contracts.noRouteImplementationBoundary,
        implemented: true,
      }).success,
    ).toBe(false);
    expect(
      EndpointNoWebApiBackendRouteBoundarySchema.safeParse({
        ...contracts.noWebApiBackendRouteBoundary,
        futureOnly: false,
      }).success,
    ).toBe(false);
  });

  it("keeps OAuth, token, session, and remote MCP implementation future-only", () => {
    const contracts = buildEndpointArchitectureContracts();

    expect(
      EndpointNoOauthTokenSessionBoundarySchema.safeParse(
        contracts.noOauthTokenSessionBoundary,
      ).success,
    ).toBe(true);
    expect(
      EndpointNoRemoteMcpDeploymentBoundarySchema.safeParse(
        contracts.noRemoteMcpDeploymentBoundary,
      ).success,
    ).toBe(true);
    expect(
      EndpointNoOauthTokenSessionBoundarySchema.safeParse({
        ...contracts.noOauthTokenSessionBoundary,
        implemented: true,
      }).success,
    ).toBe(false);
    expect(
      EndpointNoRemoteMcpDeploymentBoundarySchema.safeParse({
        ...contracts.noRemoteMcpDeploymentBoundary,
        implemented: true,
      }).success,
    ).toBe(false);
  });

  it("preserves request/response evidence, freshness, limitations, and refusal posture", () => {
    const contracts = buildEndpointArchitectureContracts();

    expect(
      EndpointRequestResponseEnvelopeBoundarySchema.safeParse(
        contracts.requestResponseEnvelopeBoundary,
      ).success,
    ).toBe(true);
    expect(
      contracts.requestResponseEnvelopeBoundary.responseMustPreserveFields,
    ).toEqual([...ENDPOINT_RESPONSE_ENVELOPE_FIELDS]);
    expect(
      contracts.refusalFailureModeBoundary.requiredFailClosedRequests,
    ).toEqual([...ENDPOINT_FAIL_CLOSED_REQUESTS]);
    expect(contracts.refusalFailureModeBoundary.failClosed).toBe(true);
    expect(
      contracts.refusalFailureModeBoundary.generatedFinanceAdviceAllowed,
    ).toBe(false);
  });

  it("keeps the existing V2G allowlist read-only", () => {
    const contracts = buildEndpointArchitectureContracts();

    expect(
      EndpointReadOnlyToolAllowlistBoundarySchema.safeParse(
        contracts.readOnlyToolAllowlistBoundary,
      ).success,
    ).toBe(true);
    expect(contracts.readOnlyToolAllowlistBoundary.allowedTools).toEqual([
      ...MCP_TOOL_ALLOWLIST,
    ]);
    expect(contracts.readOnlyToolAllowlistBoundary.forbiddenTools).toEqual([
      ...MCP_FORBIDDEN_TOOL_NAMES,
    ]);
    expect(
      contracts.readOnlyToolAllowlistBoundary.writeModifyActionToolsAllowed,
    ).toBe(false);
    expect(
      EndpointReadOnlyToolAllowlistBoundarySchema.safeParse({
        ...contracts.readOnlyToolAllowlistBoundary,
        allowedTools: [...MCP_TOOL_ALLOWLIST, "send_report"],
      }).success,
    ).toBe(false);
  });

  it("builds a machine-readable proof with FP-0104 docs-only readiness and FP-0105 absent", () => {
    const proof = buildEndpointArchitectureProof();

    expect(EndpointArchitectureProofSchema.safeParse(proof).success).toBe(true);
    expect(proof.endpointArchitectureProofContractsVerified).toBe(true);
    expect(proof.noEndpointImplementation).toBe(true);
    expect(proof.noRouteImplementation).toBe(true);
    expect(proof.noOauthTokenSessionImplementation).toBe(true);
    expect(proof.noRemoteMcpImplementationOrDeployment).toBe(true);
    expect(proof.noAppsSdkResourceImplementation).toBe(true);
    expect(proof.noAppSubmission).toBe(true);
    expect(proof.noOpenAiApiCalls).toBe(true);
    expect(proof.noModelCalls).toBe(true);
    expect(proof.noSourceMutation).toBe(true);
    expect(proof.noFinanceWrite).toBe(true);
    expect(proof.fp0102ArchitectureBoundaryStillVerified).toBe(true);
    expect(proof.fp0100PublicSecurityBoundaryStillVerified).toBe(true);
    expect(proof.exactlyOneFp0103PlanVerified).toBe(true);
    expect(
      proof.fp0104AbsentOrDocsOnlyEndpointImplementationReadinessBoundaryVerified,
    ).toBe(true);
    expect(proof.fp0105Absent).toBe(true);
    expect(proof.endpointRuntimeChangedFilesVerified).toBe(true);
    expect(proof.endpointRuntimeRepositoryInventoryVerified).toBe(true);
    expect(
      proof.fp0103EndpointArchitecturePostmergeProofDurabilityVerified,
    ).toBe(true);
  });

  it("rejects false endpoint architecture proof booleans", () => {
    const proof = buildEndpointArchitectureProof();

    expect(
      EndpointArchitectureProofSchema.safeParse({
        ...proof,
        noEndpointImplementation: false,
      }).success,
    ).toBe(false);
    expect(
      EndpointArchitectureProofSchema.safeParse({
        ...proof,
        noRouteImplementation: false,
      }).success,
    ).toBe(false);
    expect(
      EndpointArchitectureProofSchema.safeParse({
        ...proof,
        noOpenAiClientOrKeyUsage: false,
      }).success,
    ).toBe(false);
    expect(
      EndpointArchitectureProofSchema.safeParse({
        ...proof,
        fp0104AbsentOrDocsOnlyEndpointImplementationReadinessBoundaryVerified:
          false,
      }).success,
    ).toBe(false);
    expect(
      EndpointArchitectureProofSchema.safeParse({
        ...proof,
        fp0105Absent: false,
      }).success,
    ).toBe(false);
  });

  it("rejects simulated public-app endpoint runtime inventory", () => {
    const inventory = inspectEndpointRuntimeRepositoryInventory([
      {
        path: "apps/web/app/read-only-app-mcp/route.ts",
        source:
          "export async function POST() { return NextResponse.json({ publicApp: 'read-only-app-mcp' }); }",
      },
    ]);

    expect(inventory.endpointRuntimeRepositoryInventoryVerified).toBe(false);
    expect(inventory.violations).toEqual([
      "apps/web/app/read-only-app-mcp/route.ts",
    ]);
  });

  it("does not reject the shipped local preview route inventory", () => {
    const inventory = inspectEndpointRuntimeRepositoryInventory([
      {
        path: "apps/web/app/read-only-app-mcp-preview/page.tsx",
        source:
          "export default function ReadOnlyAppMcpPreviewPage() { return null; }",
      },
    ]);

    expect(inventory.endpointRuntimeRepositoryInventoryVerified).toBe(true);
    expect(inventory.violations).toEqual([]);
  });

  it("rejects simulated OAuth and Apps SDK resource runtime inventory", () => {
    const inventory = inspectEndpointRuntimeRepositoryInventory([
      {
        path: "apps/control-plane/src/modules/read-only-app-mcp/oauth-callback.ts",
        source:
          "export function tokenExchange() { return 'read-only-app-mcp OAuth callback'; }",
      },
      {
        path: "apps/control-plane/src/modules/read-only-app-mcp/resource.ts",
        source:
          "server.registerResource('ui://read-only-app-mcp/widget.html', {});",
      },
    ]);

    expect(inventory.endpointRuntimeRepositoryInventoryVerified).toBe(false);
    expect(inventory.violations).toEqual([
      "apps/control-plane/src/modules/read-only-app-mcp/oauth-callback.ts",
      "apps/control-plane/src/modules/read-only-app-mcp/resource.ts",
    ]);
  });
});
