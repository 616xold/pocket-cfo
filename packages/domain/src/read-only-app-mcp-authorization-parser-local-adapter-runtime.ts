import { classifyReadOnlyMcpAuthorizationHeader } from "./read-only-app-mcp-authorization-parser";
import {
  type ReadOnlyMcpAuthorizationParserRouteDecisionDependency,
  type ReadOnlyMcpAuthorizationParserRouteDecisionDependencyInput,
  deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness,
} from "./read-only-app-mcp-authorization-parser-route-decision-runtime";

export const MCP_AUTHORIZATION_PARSER_LOCAL_ADAPTER_RUNTIME_SCHEMA_VERSION =
  "v2bx.read-only-app-mcp-authorization-parser-local-adapter-runtime.v1";

export function createReadOnlyMcpAuthorizationParserRouteDecisionDependency(): ReadOnlyMcpAuthorizationParserRouteDecisionDependency {
  return function readOnlyMcpAuthorizationParserRouteDecision(
    input: ReadOnlyMcpAuthorizationParserRouteDecisionDependencyInput,
  ) {
    const classification = classifyReadOnlyMcpAuthorizationHeader({
      authorizationHeader: input.authorizationHeader,
    });

    return deriveReadOnlyMcpAuthorizationParserRouteDecisionReadiness({
      authorization_presence: classification.authorization_presence,
      authorization_scheme_classification:
        classification.authorization_scheme_classification,
      credential_material_observed:
        classification.credential_material_observed,
      failure_state: classification.failure_state,
    });
  };
}
