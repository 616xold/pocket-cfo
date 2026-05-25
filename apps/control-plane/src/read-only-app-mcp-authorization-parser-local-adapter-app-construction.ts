import { createReadOnlyMcpAuthorizationParserRouteDecisionDependency } from "@pocket-cto/domain/src/read-only-app-mcp-authorization-parser-local-adapter-runtime";
import type { AppContainer } from "./lib/types";

export const READ_ONLY_APP_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_APP_CONSTRUCTION_ERROR =
  "read-only MCP authorization parser local adapter requires invalid-token challenge, missing-token challenge, and protected-resource metadata co-registration";

export const READ_ONLY_APP_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_DOUBLE_INJECTION_ERROR =
  "read-only MCP authorization parser local adapter refuses to overwrite an existing parser route-decision dependency";

export function withReadOnlyAppMcpAuthorizationParserLocalAdapter(
  container: AppContainer,
): AppContainer {
  if (container.readOnlyAppMcpAuthorizationParserRouteDecision != null) {
    throw new Error(
      READ_ONLY_APP_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_DOUBLE_INJECTION_ERROR,
    );
  }

  if (
    container.readOnlyAppMcpInvalidTokenChallengeResultEnvelope == null ||
    container.readOnlyAppMcpLocalProofGatedMissingTokenChallenge == null ||
    container.readOnlyAppMcpProtectedResourceMetadataRouteInputEvidenceBundle ==
      null
  ) {
    throw new Error(
      READ_ONLY_APP_MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_APP_CONSTRUCTION_ERROR,
    );
  }

  return {
    ...container,
    readOnlyAppMcpAuthorizationParserRouteDecision:
      createReadOnlyMcpAuthorizationParserRouteDecisionDependency(),
  };
}
