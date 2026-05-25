/* global console, process */

import {
  MCP_TOOL_ALLOWLIST,
  MCP_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_HEADER,
  buildMcpWwwAuthenticateLocalProofGatedMissingTokenChallengeDependency,
  buildProtectedResourceMetadataRouteInputEvidenceBundle,
  buildTokenValidationResultEnvelope,
  buildTokenValidationResultEnvelopeInputDescriptor,
  scanProofOnlyNoTokenLeakageText,
  validRouteInput,
} from "../packages/domain/src/index.ts";
import { buildApp } from "../apps/control-plane/src/app.ts";
import { createInMemoryContainer } from "../apps/control-plane/src/bootstrap.ts";
import {
  LocalReadOnlyEvidenceToolDispatchAdapter,
} from "../apps/control-plane/src/modules/read-only-app-mcp-endpoint/evidence-dispatcher.ts";
import { ReadOnlyAppMcpEndpointService } from "../apps/control-plane/src/modules/read-only-app-mcp-endpoint/service.ts";
import { READ_ONLY_APP_MCP_PROTECTED_RESOURCE_METADATA_ROUTE_PATH } from "../apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
import { withReadOnlyAppMcpAuthorizationParserLocalAdapter } from "../apps/control-plane/src/read-only-app-mcp-authorization-parser-local-adapter-app-construction.ts";

const LOCAL_COMPANY_KEY = "local-demo-company";
const SAFE_AUTHORIZATION_PRESENT_SENTINEL = "authorization-present-local-only";
const PARSER_DECISION_RESPONSE_PATTERN =
  /parser_route_decision_contract_version|authorization_scheme_classification|credential_material_observed|parser_failure_state|envelope_failure|token_fingerprint/u;
const SOURCE_EXPOSURE_PATTERN =
  /rawFullText|rawFileText|fullFileText|fileContents|rawSourceDump|privateField|generatedAdvice|modelGeneratedAdvice|writeAction|send_report|update_ledger|providerResponse|providerCallExecuted|sourceMutationExecuted|financeWriteExecuted/u;

const apps = [];
const writeStdout = process.stdout.write.bind(process.stdout);
let suppressInternalOutput = true;
process.stdout.write = (...args) => {
  if (suppressInternalOutput) return true;
  return writeStdout(...args);
};

try {
  const summary = await runLocalEvidenceAppDemoBridge();
  assertSummary(summary);
  const serialized = JSON.stringify(summary, null, 2);
  assertNoLeakage("harness summary", serialized);
  suppressInternalOutput = false;
  console.log(serialized);
} finally {
  await Promise.all(apps.splice(0).map((app) => app.close()));
  suppressInternalOutput = false;
  process.stdout.write = writeStdout;
}

async function runLocalEvidenceAppDemoBridge() {
  const defaultApp = await buildApp({ container: createInMemoryContainer() });
  apps.push(defaultApp);

  const defaultInitializeResponse = await defaultApp.inject({
    headers: authorizationPresentHeaders(),
    method: "POST",
    payload: {
      id: "mcp-evidence-demo-default-init",
      jsonrpc: "2.0",
      method: "initialize",
    },
    url: "/mcp",
  });
  const defaultToolCallResponse = await defaultApp.inject({
    method: "POST",
    payload: {
      id: "mcp-evidence-demo-default-call",
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        arguments: validArgumentsFor("search_evidence"),
        name: "search_evidence",
      },
    },
    url: "/mcp",
  });
  const defaultMetadataResponse = await defaultApp.inject({
    method: "GET",
    url: READ_ONLY_APP_MCP_PROTECTED_RESOURCE_METADATA_ROUTE_PATH,
  });

  const authLane = await runAuthBoundaryLane();
  const evidenceLane = await runEvidenceToolLane();

  const surfaceText = [
    collectResponseSurface(defaultInitializeResponse),
    collectResponseSurface(defaultToolCallResponse),
    collectResponseSurface(defaultMetadataResponse),
    authLane.surfaceText,
    evidenceLane.surfaceText,
  ].join("\n");
  assertNoLeakage("local bridge response bodies and headers", surfaceText);

  return {
    localOnly: true,
    authBoundaryLaneVerified: authLane.verified,
    evidenceToolLaneVerified: evidenceLane.verified,
    explicitHelperOnly: authLane.explicitHelperOnly,
    explicitEvidenceDispatchOnly: evidenceLane.explicitEvidenceDispatchOnly,
    defaultBehaviorPreserved:
      defaultInitializeResponse.statusCode === 200 &&
      defaultInitializeResponse.headers["www-authenticate"] === undefined &&
      defaultToolCallResponse.statusCode === 200 &&
      defaultToolCallResponse.json().result?.isError === true &&
      defaultToolCallResponse.json().result?.structuredContent
        ?.refusalReason ===
        "tool_dispatch_not_implemented_until_later_finance_plan" &&
      defaultMetadataResponse.statusCode === 404,
    missingAuthorizationChallengeVerified:
      authLane.missingAuthorizationChallengeVerified,
    authorizationPresentInvalidChallengeVerified:
      authLane.authorizationPresentInvalidChallengeVerified,
    metadataRouteVerified: authLane.metadataRouteVerified,
    searchEvidenceVerified: evidenceLane.searchEvidenceVerified,
    fetchEvidenceCardVerified: evidenceLane.fetchEvidenceCardVerified,
    fetchDocumentMapVerified: evidenceLane.fetchDocumentMapVerified,
    fetchSourceCoverageVerified: evidenceLane.fetchSourceCoverageVerified,
    fetchCompanyPostureVerified: evidenceLane.fetchCompanyPostureVerified,
    fetchCapabilityBoundariesVerified:
      evidenceLane.fetchCapabilityBoundariesVerified,
    companyKeyMismatchFailsClosed: evidenceLane.companyKeyMismatchFailsClosed,
    invalidToolFailsClosed: evidenceLane.invalidToolFailsClosed,
    invalidArgumentsFailClosed: evidenceLane.invalidArgumentsFailClosed,
    noCredentialMaterialExposed:
      !surfaceText.includes(SAFE_AUTHORIZATION_PRESENT_SENTINEL) &&
      scanProofOnlyNoTokenLeakageText(surfaceText).accepted,
    noParserDecisionObjectExposed:
      !PARSER_DECISION_RESPONSE_PATTERN.test(surfaceText),
    noRawSourceDumpExposed: !SOURCE_EXPOSURE_PATTERN.test(surfaceText),
    noWriteActionExposed:
      !/writeAction|send_report|update_ledger|financeWriteExecuted/u.test(
        surfaceText,
      ),
    productionTokenValidationImplemented: false,
    publicChatGptAppImplemented: false,
  };
}

async function runAuthBoundaryLane() {
  const evidenceBundle =
    buildProtectedResourceMetadataRouteInputEvidenceBundle(validRouteInput);
  const helperContainer = withReadOnlyAppMcpAuthorizationParserLocalAdapter({
    ...createInMemoryContainer(),
    readOnlyAppMcpInvalidTokenChallengeResultEnvelope:
      buildTokenValidationResultEnvelope(
        buildTokenValidationResultEnvelopeInputDescriptor({
          outcome: "invalid_token",
        }),
      ),
    readOnlyAppMcpLocalProofGatedMissingTokenChallenge:
      buildMcpWwwAuthenticateLocalProofGatedMissingTokenChallengeDependency(),
    readOnlyAppMcpProtectedResourceMetadataRouteInputEvidenceBundle:
      evidenceBundle,
  });
  const app = await buildApp({ container: helperContainer });
  apps.push(app);

  const missingAuthorizationResponse = await app.inject({
    method: "POST",
    payload: {
      id: "mcp-evidence-demo-auth-missing",
      jsonrpc: "2.0",
      method: "initialize",
    },
    url: "/mcp",
  });
  const authorizationPresentResponse = await app.inject({
    headers: authorizationPresentHeaders(),
    method: "POST",
    payload: {
      id: "mcp-evidence-demo-auth-present",
      jsonrpc: "2.0",
      method: "initialize",
    },
    url: "/mcp",
  });
  const metadataResponse = await app.inject({
    method: "GET",
    url: READ_ONLY_APP_MCP_PROTECTED_RESOURCE_METADATA_ROUTE_PATH,
  });

  const surfaceText = [
    collectResponseSurface(missingAuthorizationResponse),
    collectResponseSurface(authorizationPresentResponse),
    collectResponseSurface(metadataResponse),
  ].join("\n");

  return {
    authorizationPresentInvalidChallengeVerified:
      authorizationPresentResponse.statusCode === 401 &&
      String(
        authorizationPresentResponse.headers["www-authenticate"] ?? "",
      ).includes('error="invalid_token"') &&
      authorizationPresentResponse.json().error === "invalid_token" &&
      authorizationPresentResponse.json().noTokenEcho === true,
    explicitHelperOnly: true,
    metadataRouteVerified:
      metadataResponse.statusCode === 200 &&
      metadataDocumentsMatch(
        metadataResponse.json(),
        evidenceBundle.builderOutput.document,
      ),
    missingAuthorizationChallengeVerified:
      missingAuthorizationResponse.statusCode === 401 &&
      missingAuthorizationResponse.headers["www-authenticate"] ===
        MCP_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_HEADER &&
      missingAuthorizationResponse.json().error === "authorization_required",
    surfaceText,
    verified: true,
  };
}

async function runEvidenceToolLane() {
  const evidenceService = syntheticEvidenceService();
  const endpointService = new ReadOnlyAppMcpEndpointService({
    evidenceToolDispatcher: new LocalReadOnlyEvidenceToolDispatchAdapter({
      evidenceService,
      expectedCompanyKey: LOCAL_COMPANY_KEY,
    }),
  });
  const app = await buildApp({
    container: {
      ...createInMemoryContainer(),
      readOnlyAppMcpEndpointService: endpointService,
    },
  });
  apps.push(app);

  const toolsListResponse = await postMcp(app, {
    id: "mcp-evidence-demo-tools-list",
    jsonrpc: "2.0",
    method: "tools/list",
  });
  const toolResponses = {};
  for (const toolName of MCP_TOOL_ALLOWLIST) {
    toolResponses[toolName] = await postMcp(app, {
      id: `mcp-evidence-demo-${toolName}`,
      jsonrpc: "2.0",
      method: "tools/call",
      params: {
        arguments: validArgumentsFor(toolName),
        name: toolName,
      },
    });
  }
  const companyMismatchResponse = await postMcp(app, {
    id: "mcp-evidence-demo-company-mismatch",
    jsonrpc: "2.0",
    method: "tools/call",
    params: {
      arguments: {
        companyKey: "other-local-demo-company",
        query: "synthetic posture",
      },
      name: "search_evidence",
    },
  });
  const invalidToolResponse = await postMcp(app, {
    id: "mcp-evidence-demo-invalid-tool",
    jsonrpc: "2.0",
    method: "tools/call",
    params: {
      arguments: {},
      name: "send_report",
    },
  });
  const invalidArgumentsResponse = await postMcp(app, {
    id: "mcp-evidence-demo-invalid-arguments",
    jsonrpc: "2.0",
    method: "tools/call",
    params: {
      arguments: {
        companyKey: LOCAL_COMPANY_KEY,
      },
      name: "search_evidence",
    },
  });

  const toolNames =
    toolsListResponse.json().result?.tools?.map((tool) => tool.name) ?? [];
  const allAllowedToolsVerified =
    sameList(toolNames, MCP_TOOL_ALLOWLIST) &&
    MCP_TOOL_ALLOWLIST.every((toolName) => toolOk(toolResponses[toolName], toolName));
  const surfaceText = [
    collectResponseSurface(toolsListResponse),
    ...Object.values(toolResponses).map(collectResponseSurface),
    collectResponseSurface(companyMismatchResponse),
    collectResponseSurface(invalidToolResponse),
    collectResponseSurface(invalidArgumentsResponse),
  ].join("\n");

  return {
    companyKeyMismatchFailsClosed:
      companyMismatchResponse.statusCode === 200 &&
      companyMismatchResponse.json().result?.isError === true &&
      companyMismatchResponse.json().result?.structuredContent
        ?.refusalReason === "company_key_mismatch" &&
      evidenceService.calls.searchEvidence === 1,
    explicitEvidenceDispatchOnly: true,
    fetchCapabilityBoundariesVerified: toolOk(
      toolResponses.fetch_capability_boundaries,
      "fetch_capability_boundaries",
    ),
    fetchCompanyPostureVerified: toolOk(
      toolResponses.fetch_company_posture,
      "fetch_company_posture",
    ),
    fetchDocumentMapVerified: toolOk(
      toolResponses.fetch_document_map,
      "fetch_document_map",
    ),
    fetchEvidenceCardVerified: toolOk(
      toolResponses.fetch_evidence_card,
      "fetch_evidence_card",
    ),
    fetchSourceCoverageVerified: toolOk(
      toolResponses.fetch_source_coverage,
      "fetch_source_coverage",
    ),
    invalidArgumentsFailClosed:
      invalidArgumentsResponse.statusCode === 200 &&
      invalidArgumentsResponse.json().error?.code === -32602,
    invalidToolFailsClosed:
      invalidToolResponse.statusCode === 200 &&
      invalidToolResponse.json().error?.code === -32602,
    searchEvidenceVerified: toolOk(
      toolResponses.search_evidence,
      "search_evidence",
    ),
    surfaceText,
    verified: allAllowedToolsVerified,
  };
}

async function postMcp(app, payload) {
  return await app.inject({
    method: "POST",
    payload,
    url: "/mcp",
  });
}

function authorizationPresentHeaders() {
  return Object.fromEntries([
    ["authorization", SAFE_AUTHORIZATION_PRESENT_SENTINEL],
  ]);
}

function validArgumentsFor(toolName) {
  switch (toolName) {
    case "search_evidence":
      return { companyKey: LOCAL_COMPANY_KEY, limit: 3, query: "synthetic posture" };
    case "fetch_evidence_card":
      return { companyKey: LOCAL_COMPANY_KEY, evidenceCardId: "synthetic-card-1" };
    case "fetch_source_anchor":
      return { companyKey: LOCAL_COMPANY_KEY, sourceAnchorId: "synthetic-anchor-1" };
    case "fetch_document_map":
      return { companyKey: LOCAL_COMPANY_KEY, documentMapId: "synthetic-map-1" };
    case "fetch_source_coverage":
      return { companyKey: LOCAL_COMPANY_KEY, sourceId: "synthetic-source-1" };
    case "fetch_company_posture":
      return { companyKey: LOCAL_COMPANY_KEY };
    case "fetch_capability_boundaries":
      return { companyKey: LOCAL_COMPANY_KEY };
  }
}

function syntheticEvidenceService() {
  const calls = {
    fetchCapabilityBoundaries: 0,
    fetchCompanyPosture: 0,
    fetchDocumentMap: 0,
    fetchEvidenceCard: 0,
    fetchSourceAnchor: 0,
    fetchSourceCoverage: 0,
    searchEvidence: 0,
  };

  return {
    calls,
    fetchCapabilityBoundaries(input) {
      calls.fetchCapabilityBoundaries += 1;
      return responseFor("fetch_capability_boundaries", {
        requestedActionAllowed: false,
        requestedAction: input.requestedAction ?? null,
        resultKind: "capability_boundaries",
      });
    },
    fetchCompanyPosture() {
      calls.fetchCompanyPosture += 1;
      return responseFor("fetch_company_posture", {
        companyKey: LOCAL_COMPANY_KEY,
        resultKind: "company_posture",
      });
    },
    fetchDocumentMap(input) {
      calls.fetchDocumentMap += 1;
      return responseFor("fetch_document_map", {
        artifactId: input.documentMapId ?? "synthetic-map-1",
        artifactKind: "synthetic_document_map",
      });
    },
    fetchEvidenceCard(input) {
      calls.fetchEvidenceCard += 1;
      return responseFor("fetch_evidence_card", {
        artifactId: input.evidenceCardId,
        artifactKind: "synthetic_evidence_card",
      });
    },
    fetchSourceAnchor(input) {
      calls.fetchSourceAnchor += 1;
      return responseFor("fetch_source_anchor", {
        artifactId: input.sourceAnchorId,
        artifactKind: "synthetic_source_anchor",
      });
    },
    fetchSourceCoverage(input) {
      calls.fetchSourceCoverage += 1;
      return responseFor("fetch_source_coverage", {
        sourceCoverageMatrix: {
          entries: [
            {
              coverageState: "synthetic",
              sourceId: input.sourceId,
            },
          ],
        },
      });
    },
    searchEvidence(input) {
      calls.searchEvidence += 1;
      return responseFor("search_evidence", [
        {
          documentMapId: "synthetic-map-1",
          evidenceCardId: "synthetic-card-1",
          query: input.query,
          sourceAnchorId: "synthetic-anchor-1",
        },
      ]);
    },
  };
}

function responseFor(toolName, result) {
  const citation = {
    checksumSha256: "b".repeat(64),
    citationType: "source_anchor",
    id: "synthetic-citation-1",
    locator: "synthetic section 1",
    sourceAnchorId: "synthetic-anchor-1",
    sourceId: "synthetic-source-1",
    sourceSnapshotId: "synthetic-snapshot-1",
    summary: "Synthetic local demo citation.",
  };

  return {
    appMode: "local_proof",
    audit: {
      appMode: "local_proof",
      artifactIds: ["synthetic-artifact-1"],
      companyKey: LOCAL_COMPANY_KEY,
      excerptCharacterCount: 0,
      forbiddenRequestBlocked: false,
      id: `audit:${toolName}`,
      normalizedQuery: toolName === "search_evidence" ? "synthetic posture" : null,
      redactionCount: 0,
      sourceAnchorIds: ["synthetic-anchor-1"],
      timestamp: "2026-05-25T00:00:00.000Z",
      toolName,
      unsupportedReason: null,
    },
    capabilityBoundaries: [
      {
        affectedAnchorIds: [],
        affectedSourceIds: [],
        code: "not_source_truth",
        severity: "warning",
        summary: "Synthetic local demo output is read-only proof material.",
      },
    ],
    citations: [citation],
    companyKey: LOCAL_COMPANY_KEY,
    evidence: [citation],
    forbiddenActions: [],
    freshness: {
      checkedAt: "2026-05-25T00:00:00.000Z",
      compiledAt: null,
      extractedAt: null,
      sourceCapturedAt: "2026-05-25T00:00:00.000Z",
      state: "fresh",
      summary: "Synthetic local demo evidence is deterministic.",
    },
    limitations: [],
    ok: true,
    permittedNextActions: [
      {
        action: "request_human_review",
        label: "Review the synthetic local demo result.",
        targetId: "synthetic-artifact-1",
      },
    ],
    redactions: [],
    result,
    schemaVersion: "v2c.evidence-tool.v1",
    toolName,
    unsupportedReason: null,
  };
}

function toolOk(response, toolName) {
  if (!response || response.statusCode !== 200) return false;
  const body = response.json();
  return (
    body.result?.isError === false &&
    body.result?.structuredContent?.toolName === toolName &&
    body.result?.structuredContent?.companyKey === LOCAL_COMPANY_KEY &&
    body.result?.structuredContent?.refusalReason === null &&
    body.result?.structuredContent?.capabilityBoundary?.readOnly === true &&
    body.result?.structuredContent?.capabilityBoundary
      ?.localDispatchAdapterOnly === true &&
    body.result?.structuredContent?.capabilityBoundary
      ?.toolDispatchImplemented === true
  );
}

function collectResponseSurface(response) {
  return JSON.stringify({
    body: response.body,
    headers: relevantHeaders(response.headers),
    statusCode: response.statusCode,
  });
}

function relevantHeaders(headers) {
  return Object.fromEntries(
    ["www-authenticate", "content-type", "allow"]
      .filter((name) => headers[name] !== undefined)
      .map((name) => [name, headers[name]]),
  );
}

function metadataDocumentsMatch(actual, expected) {
  return (
    Array.isArray(actual.authorization_servers) &&
    Array.isArray(expected.authorization_servers) &&
    Array.isArray(actual.bearer_methods_supported) &&
    Array.isArray(expected.bearer_methods_supported) &&
    Array.isArray(actual.scopes_supported) &&
    Array.isArray(expected.scopes_supported) &&
    actual.resource === expected.resource &&
    actual.authorization_servers.join("\n") ===
      expected.authorization_servers.join("\n") &&
    actual.bearer_methods_supported.join("\n") ===
      expected.bearer_methods_supported.join("\n") &&
    actual.scopes_supported.join("\n") === expected.scopes_supported.join("\n")
  );
}

function assertNoLeakage(label, text) {
  const scan = scanProofOnlyNoTokenLeakageText(text);
  if (!scan.accepted) {
    throw new Error(
      `${label} leaked credential material: ${scan.rejectionReasons.join(", ")}`,
    );
  }
  if (text.includes(SAFE_AUTHORIZATION_PRESENT_SENTINEL)) {
    throw new Error(`${label} exposed the raw Authorization sentinel`);
  }
  if (PARSER_DECISION_RESPONSE_PATTERN.test(text)) {
    throw new Error(`${label} exposed parser decision material`);
  }
  if (SOURCE_EXPOSURE_PATTERN.test(text)) {
    throw new Error(`${label} exposed source/provider/write material`);
  }
}

function assertSummary(summary) {
  const expectedTrueFields = [
    "localOnly",
    "authBoundaryLaneVerified",
    "evidenceToolLaneVerified",
    "explicitHelperOnly",
    "explicitEvidenceDispatchOnly",
    "defaultBehaviorPreserved",
    "missingAuthorizationChallengeVerified",
    "authorizationPresentInvalidChallengeVerified",
    "metadataRouteVerified",
    "searchEvidenceVerified",
    "fetchEvidenceCardVerified",
    "fetchDocumentMapVerified",
    "fetchSourceCoverageVerified",
    "fetchCompanyPostureVerified",
    "fetchCapabilityBoundariesVerified",
    "companyKeyMismatchFailsClosed",
    "invalidToolFailsClosed",
    "invalidArgumentsFailClosed",
    "noCredentialMaterialExposed",
    "noParserDecisionObjectExposed",
    "noRawSourceDumpExposed",
    "noWriteActionExposed",
  ];

  for (const field of expectedTrueFields) {
    if (summary[field] !== true) {
      throw new Error(`FP-0158 local evidence app demo bridge failed: ${field}`);
    }
  }

  if (summary.productionTokenValidationImplemented !== false) {
    throw new Error(
      "FP-0158 bridge must not implement production token validation",
    );
  }
  if (summary.publicChatGptAppImplemented !== false) {
    throw new Error("FP-0158 bridge must not implement a public ChatGPT App");
  }
}

function sameList(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}
