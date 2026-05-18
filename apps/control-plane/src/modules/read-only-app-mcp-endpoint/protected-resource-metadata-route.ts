import type { FastifyInstance } from "fastify";
import {
  MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH,
  McpProtectedResourceMetadataBuilderDocumentSchema,
  assertProtectedResourceMetadataRouteInputEvidenceBundleAcceptedForLocalRouteRegistration,
  type McpProtectedResourceMetadataBuilderDocument,
  type McpProtectedResourceMetadataRouteInputEvidenceBundle,
} from "@pocket-cto/domain";

export const READ_ONLY_APP_MCP_PROTECTED_RESOURCE_METADATA_ROUTE_PATH =
  MCP_ROUTE_INPUT_EXPECTED_MCP_METADATA_ROUTE_PATH;

const BOUNDED_METADATA_FIELDS = [
  "authorization_servers",
  "bearer_methods_supported",
  "resource",
  "scopes_supported",
] as const;

export async function registerReadOnlyAppMcpProtectedResourceMetadataRoute(
  app: FastifyInstance,
  deps: {
    routeInputEvidenceBundle?: unknown;
  } = {},
) {
  if (deps.routeInputEvidenceBundle === undefined) return;

  const bundle = parseValidRouteInputEvidenceBundle(
    deps.routeInputEvidenceBundle,
  );
  const document = serializeBoundedMetadataDocument(bundle);

  app.get(
    READ_ONLY_APP_MCP_PROTECTED_RESOURCE_METADATA_ROUTE_PATH,
    { exposeHeadRoute: false },
    async (_request, reply) => reply.type("application/json").send(document),
  );
}

function parseValidRouteInputEvidenceBundle(
  input: unknown,
): McpProtectedResourceMetadataRouteInputEvidenceBundle {
  return assertProtectedResourceMetadataRouteInputEvidenceBundleAcceptedForLocalRouteRegistration(
    input,
  );
}

function serializeBoundedMetadataDocument(
  bundle: McpProtectedResourceMetadataRouteInputEvidenceBundle,
): McpProtectedResourceMetadataBuilderDocument {
  const document = McpProtectedResourceMetadataBuilderDocumentSchema.parse(
    bundle.builderOutput.document,
  );
  const responseDocument = {
    authorization_servers: [...document.authorization_servers],
    bearer_methods_supported: [...document.bearer_methods_supported],
    resource: document.resource,
    scopes_supported: [...document.scopes_supported],
  };

  assertBoundedMetadataDocument(responseDocument);
  return responseDocument;
}

function assertBoundedMetadataDocument(
  document: McpProtectedResourceMetadataBuilderDocument,
) {
  const actualFields = Object.keys(document).sort();
  if (actualFields.join("\n") !== BOUNDED_METADATA_FIELDS.join("\n")) {
    throw new Error("Protected-resource metadata route response is unbounded");
  }

  const serialized = JSON.stringify(document).toLowerCase();
  const forbiddenTerms = [
    "access_token",
    "auth_header",
    "authorization_header",
    "client_secret",
    "companykey",
    "cookie",
    "credential",
    "generated_advice",
    "internal",
    "password",
    "proof",
    "raw_finance",
    "raw_source",
    "refresh_token",
    "secret",
    "session",
  ];

  if (forbiddenTerms.some((term) => serialized.includes(term))) {
    throw new Error(
      "Protected-resource metadata route response contains private material",
    );
  }
}
