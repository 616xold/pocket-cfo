import {
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
import { READ_ONLY_APP_MCP_PROTECTED_RESOURCE_METADATA_ROUTE_PATH } from "../apps/control-plane/src/modules/read-only-app-mcp-endpoint/protected-resource-metadata-route.ts";
import { withReadOnlyAppMcpAuthorizationParserLocalAdapter } from "../apps/control-plane/src/read-only-app-mcp-authorization-parser-local-adapter-app-construction.ts";

const SAFE_AUTHORIZATION_PRESENT_SENTINEL = "authorization-present-local-only";
const PARSER_DECISION_RESPONSE_PATTERN =
  /parser_route_decision_contract_version|authorization_scheme_classification|credential_material_observed|parser_failure_state|envelope_failure/u;

const apps = [];
const writeStdout = process.stdout.write.bind(process.stdout);
let suppressInternalOutput = true;
process.stdout.write = (...args) => {
  if (suppressInternalOutput) return true;
  return writeStdout(...args);
};

try {
  const summary = await runLocalHarness();
  assertSummary(summary);
  suppressInternalOutput = false;
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await Promise.all(apps.splice(0).map((app) => app.close()));
  suppressInternalOutput = false;
  process.stdout.write = writeStdout;
}

async function runLocalHarness() {
  const defaultApp = await buildApp({ container: createInMemoryContainer() });
  apps.push(defaultApp);

  const defaultInitializeResponse = await defaultApp.inject({
    headers: authorizationPresentHeaders(),
    method: "POST",
    payload: {
      id: "mcp-auth-local-demo-default",
      jsonrpc: "2.0",
      method: "initialize",
    },
    url: "/mcp",
  });
  const defaultMetadataResponse = await defaultApp.inject({
    method: "GET",
    url: READ_ONLY_APP_MCP_PROTECTED_RESOURCE_METADATA_ROUTE_PATH,
  });

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
  const helperApp = await buildApp({ container: helperContainer });
  apps.push(helperApp);

  const missingAuthorizationResponse = await helperApp.inject({
    method: "POST",
    payload: {
      id: "mcp-auth-local-demo-missing-authorization",
      jsonrpc: "2.0",
      method: "initialize",
    },
    url: "/mcp",
  });
  const authorizationPresentResponse = await helperApp.inject({
    headers: authorizationPresentHeaders(),
    method: "POST",
    payload: {
      id: "mcp-auth-local-demo-authorization-present",
      jsonrpc: "2.0",
      method: "initialize",
    },
    url: "/mcp",
  });
  const metadataResponse = await helperApp.inject({
    method: "GET",
    url: READ_ONLY_APP_MCP_PROTECTED_RESOURCE_METADATA_ROUTE_PATH,
  });

  const responseText = [
    defaultInitializeResponse.body,
    defaultMetadataResponse.body,
    missingAuthorizationResponse.body,
    authorizationPresentResponse.body,
    metadataResponse.body,
  ].join("\n");
  const noCredentialMaterialExposed =
    !responseText.includes(SAFE_AUTHORIZATION_PRESENT_SENTINEL) &&
    scanProofOnlyNoTokenLeakageText(responseText).accepted;
  const noParserDecisionObjectExposed =
    !PARSER_DECISION_RESPONSE_PATTERN.test(responseText);

  return {
    localOnly: true,
    explicitHelperOnly: true,
    defaultBehaviorPreserved:
      defaultInitializeResponse.statusCode === 200 &&
      defaultInitializeResponse.headers["www-authenticate"] === undefined &&
      defaultMetadataResponse.statusCode === 404,
    missingAuthorizationChallengeVerified:
      missingAuthorizationResponse.statusCode === 401 &&
      missingAuthorizationResponse.headers["www-authenticate"] ===
        MCP_WWW_AUTHENTICATE_MISSING_TOKEN_CHALLENGE_HEADER &&
      missingAuthorizationResponse.json().error === "authorization_required",
    authorizationPresentInvalidChallengeVerified:
      authorizationPresentResponse.statusCode === 401 &&
      String(
        authorizationPresentResponse.headers["www-authenticate"] ?? "",
      ).includes('error="invalid_token"') &&
      authorizationPresentResponse.json().error === "invalid_token" &&
      authorizationPresentResponse.json().noTokenEcho === true,
    metadataRouteVerified:
      metadataResponse.statusCode === 200 &&
      metadataDocumentsMatch(
        metadataResponse.json(),
        evidenceBundle.builderOutput.document,
      ),
    noCredentialMaterialExposed,
    noParserDecisionObjectExposed,
    productionTokenValidationImplemented: false,
  };
}

function authorizationPresentHeaders() {
  return Object.fromEntries([
    ["authorization", SAFE_AUTHORIZATION_PRESENT_SENTINEL],
  ]);
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

function assertSummary(summary) {
  const expectedTrueFields = [
    "localOnly",
    "explicitHelperOnly",
    "defaultBehaviorPreserved",
    "missingAuthorizationChallengeVerified",
    "authorizationPresentInvalidChallengeVerified",
    "metadataRouteVerified",
    "noCredentialMaterialExposed",
    "noParserDecisionObjectExposed",
  ];

  for (const field of expectedTrueFields) {
    if (summary[field] !== true) {
      throw new Error(`FP-0157 local auth demo harness failed: ${field}`);
    }
  }

  if (summary.productionTokenValidationImplemented !== false) {
    throw new Error(
      "FP-0157 local auth demo harness must not implement production token validation",
    );
  }
}
