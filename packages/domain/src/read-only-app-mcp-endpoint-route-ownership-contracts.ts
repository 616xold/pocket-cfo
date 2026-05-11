import { z } from "zod";
import {
  MCP_FORBIDDEN_TOOL_NAMES,
  MCP_TOOL_ALLOWLIST,
  McpForbiddenToolSchema,
  McpToolAllowlistSchema,
} from "./read-only-app-mcp-boundaries";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const ENDPOINT_ROUTE_OWNERSHIP_SCHEMA_VERSION =
  "v2y.endpoint-route-ownership.v1";

export const ENDPOINT_PUBLIC_MCP_PATH = "/mcp" as const;

export const FP0105_ENDPOINT_ROUTE_OWNERSHIP_PLAN_PATH =
  "plans/FP-0105-read-only-chatgpt-app-mcp-endpoint-route-ownership-transport-adapter-proof-contracts.md" as const;

export const ENDPOINT_ROUTE_OWNER_CANDIDATES = [
  "apps_control_plane_fastify",
  "apps_web_nextjs",
  "future_separate_mcp_server_package",
  "unresolved",
] as const;

export const ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS = [
  "evidence",
  "sourceAnchors",
  "freshness",
  "limitations",
  "refusalReason",
  "permittedNextActions",
  "capabilityBoundary",
] as const;

export const ENDPOINT_LOGGING_REDACTION_FIELDS = [
  "tokens",
  "rawPrompts",
  "rawSourceFiles",
  "privateFinanceData",
  "evidenceDumps",
  "cookies",
  "sessions",
  "oauthMaterial",
  "providerCredentials",
  "objectStoreDumps",
  "databaseDumps",
] as const;

export const EndpointRouteOwnerCandidateSchema = z.enum(
  ENDPOINT_ROUTE_OWNER_CANDIDATES,
);

export const EndpointRouteOwnershipContractKindSchema = z.enum([
  "EndpointRouteOwnershipProofContract",
  "EndpointRouteOwnerCandidateAnalysisBoundary",
  "EndpointRouteOwnerDecisionBoundary",
  "EndpointTransportAdapterBoundary",
  "EndpointMcpPathContractBoundary",
  "EndpointHandlerThinAdapterBoundary",
  "EndpointServiceDispatchBoundary",
  "EndpointReadOnlyToolDispatchBoundary",
  "EndpointRequestResponseEnvelopeAdapterBoundary",
  "EndpointRefusalAdapterBoundary",
  "EndpointAuthBoundaryDeferredBoundary",
  "EndpointLoggingRedactionBoundary",
  "EndpointDeploymentDeferredBoundary",
  "EndpointRollbackReadinessBoundary",
  "EndpointNoRouteImplementationBoundary",
  "EndpointNoRuntimeImplementationBoundary",
  "EndpointNoOauthTokenSessionBoundary",
  "EndpointNoRemoteMcpServerBoundary",
  "EndpointNoAppsSdkResourceBoundary",
  "EndpointNoOpenAiApiModelCallsBoundary",
]);

export const EndpointRouteOwnershipBaseSchema = z
  .object({
    schemaVersion: z.literal(ENDPOINT_ROUTE_OWNERSHIP_SCHEMA_VERSION),
    contractKind: EndpointRouteOwnershipContractKindSchema,
    localProofOnly: trueLiteral,
    readOnly: trueLiteral,
    publicAppImplemented: falseLiteral,
  })
  .strict();

export const EndpointRouteOwnershipProofContractSchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointRouteOwnershipProofContract"),
    routeOwnershipProofContractsOnly: trueLiteral,
    endpointImplementationAuthorized: falseLiteral,
    routeImplementationAuthorized: falseLiteral,
    webApiBackendControlPlaneRouteImplementationAuthorized: falseLiteral,
    oauthTokenSessionImplementationAuthorized: falseLiteral,
    remoteMcpServerImplementationAuthorized: falseLiteral,
    appsSdkResourceImplementationAuthorized: falseLiteral,
    publicAppImplementationAuthorized: falseLiteral,
    appSubmissionAuthorized: falseLiteral,
    openAiApiModelCallsAuthorized: falseLiteral,
    fp0106Created: falseLiteral,
  }).strict();

export const EndpointRouteOwnerCandidateAnalysisItemSchema = z
  .object({
    candidate: EndpointRouteOwnerCandidateSchema,
    authorityBoundaryCovered: trueLiteral,
    sourceEvidenceAccessBoundaryCovered: trueLiteral,
    financeTwinCfoWikiEvidenceIndexBoundaryCovered: trueLiteral,
    requestResponseEnvelopeBoundaryCovered: trueLiteral,
    authTokenSessionBoundaryCovered: trueLiteral,
    loggingRedactionBoundaryCovered: trueLiteral,
    routeThinnessCovered: trueLiteral,
    deploymentBoundaryCovered: trueLiteral,
    rollbackBoundaryCovered: trueLiteral,
    proofabilityCovered: trueLiteral,
    noRouteMayBeAddedInFp0105: trueLiteral,
    safeToOwnFutureRoute: z.boolean(),
  })
  .strict();

export const EndpointRouteOwnerCandidateAnalysisBoundarySchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointRouteOwnerCandidateAnalysisBoundary"),
    candidateAnalysisDocumentationOnly: trueLiteral,
    candidates: z.tuple([
      EndpointRouteOwnerCandidateAnalysisItemSchema.extend({
        candidate: z.literal(ENDPOINT_ROUTE_OWNER_CANDIDATES[0]),
        safeToOwnFutureRoute: trueLiteral,
      }),
      EndpointRouteOwnerCandidateAnalysisItemSchema.extend({
        candidate: z.literal(ENDPOINT_ROUTE_OWNER_CANDIDATES[1]),
        safeToOwnFutureRoute: falseLiteral,
      }),
      EndpointRouteOwnerCandidateAnalysisItemSchema.extend({
        candidate: z.literal(ENDPOINT_ROUTE_OWNER_CANDIDATES[2]),
        safeToOwnFutureRoute: falseLiteral,
      }),
      EndpointRouteOwnerCandidateAnalysisItemSchema.extend({
        candidate: z.literal(ENDPOINT_ROUTE_OWNER_CANDIDATES[3]),
        safeToOwnFutureRoute: falseLiteral,
      }),
    ]),
  }).strict();

export const EndpointRouteOwnerDecisionBoundarySchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointRouteOwnerDecisionBoundary"),
    decisionOutcome: z.enum(["decided", "unresolved"]),
    selectedRouteOwner: EndpointRouteOwnerCandidateSchema.nullable(),
    routeOwnerFamilyDocumentationOnly: z.string().min(1),
    futureRouteFamilyDocumentationOnly: z.string().min(1),
    futureRouteFilePathPatternDocumentationOnly: z.string().min(1).nullable(),
    routeOwnershipUnresolved: z.boolean(),
    endpointImplementationBlockedUntilLaterPlan: trueLiteral,
    routeImplementationAuthorized: falseLiteral,
    missingInformationToUnblockRouteOwner: z.array(z.string()),
  })
    .strict()
    .superRefine((value, ctx) => {
      if (value.decisionOutcome === "decided") {
        if (value.selectedRouteOwner !== "apps_control_plane_fastify") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Decided route owner must be apps/control-plane.",
            path: ["selectedRouteOwner"],
          });
        }
        if (value.routeOwnershipUnresolved) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Decided route ownership cannot remain unresolved.",
            path: ["routeOwnershipUnresolved"],
          });
        }
        if (value.missingInformationToUnblockRouteOwner.length !== 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Decided route ownership must not list missing owner facts.",
            path: ["missingInformationToUnblockRouteOwner"],
          });
        }
      }
      if (value.decisionOutcome === "unresolved") {
        if (value.selectedRouteOwner !== null || !value.routeOwnershipUnresolved) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Unresolved route ownership must select no owner.",
            path: ["selectedRouteOwner"],
          });
        }
        if (value.missingInformationToUnblockRouteOwner.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Unresolved route ownership must name missing facts.",
            path: ["missingInformationToUnblockRouteOwner"],
          });
        }
      }
    });

export const EndpointMcpPathContractBoundarySchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointMcpPathContractBoundary"),
    futurePublicChatGptFacingEndpointPath: z.literal(ENDPOINT_PUBLIC_MCP_PATH),
    publicChatGptFacingEndpointPathsCurrentlyNamed: z.tuple([
      z.literal(ENDPOINT_PUBLIC_MCP_PATH),
    ]),
    onlyFuturePublicChatGptFacingEndpointPathCurrentlyNamed: trueLiteral,
    pathImplemented: falseLiteral,
    privateHealthPathFutureOnly: trueLiteral,
  }).strict();

export const EndpointTransportAdapterBoundarySchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointTransportAdapterBoundary"),
    transportAdapterDocumentationProofOnly: trueLiteral,
    transportImplemented: falseLiteral,
    adapterOwnsMcpTransportOnly: trueLiteral,
    handlerOwnsThinHttpAdapterOnly: trueLiteral,
    serviceOwnsReadOnlyDispatch: trueLiteral,
    financeLogicInTransportAllowed: falseLiteral,
    supportedFutureTransportFamilies: z.tuple([
      z.literal("streamable_http"),
      z.literal("http_sse"),
    ]),
  }).strict();

export const EndpointHandlerThinAdapterBoundarySchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointHandlerThinAdapterBoundary"),
    parsesInput: trueLiteral,
    callsService: trueLiteral,
    serializesOutput: trueLiteral,
    sqlInRouteAllowed: falseLiteral,
    ingestLogicInRouteAllowed: falseLiteral,
    financeMathInRouteAllowed: falseLiteral,
    promptAssemblyInRouteAllowed: falseLiteral,
    routeFileCreated: falseLiteral,
  }).strict();

export const EndpointServiceDispatchBoundarySchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointServiceDispatchBoundary"),
    serviceDispatchFutureOnly: trueLiteral,
    readOnlyDispatchRequired: trueLiteral,
    evidenceBackedDispatchRequired: trueLiteral,
    sourceMutationAllowed: falseLiteral,
    financeWriteAllowed: falseLiteral,
    generatedFinanceAdviceAllowed: falseLiteral,
  }).strict();

export const EndpointReadOnlyToolDispatchBoundarySchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointReadOnlyToolDispatchBoundary"),
    allowedTools: McpToolAllowlistSchema,
    forbiddenTools: z.array(McpForbiddenToolSchema).min(1),
    exactV2gReadOnlyAllowlistRequired: trueLiteral,
    dynamicToolsAllowed: falseLiteral,
    writeActionToolsAllowed: falseLiteral,
  })
    .strict()
    .superRefine((value, ctx) => {
      if (!sameList(value.allowedTools, MCP_TOOL_ALLOWLIST)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Allowed tools must match the exact V2G read-only allowlist.",
          path: ["allowedTools"],
        });
      }
      if (!sameList(value.forbiddenTools, MCP_FORBIDDEN_TOOL_NAMES)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Forbidden tools must match the exact V2G forbidden list.",
          path: ["forbiddenTools"],
        });
      }
    });

function sameList(left: readonly string[], right: readonly string[]): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
