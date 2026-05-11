import { z } from "zod";
import { APP_REFUSAL_REASONS } from "./read-only-app-mcp-boundaries";
import {
  ENDPOINT_LOGGING_REDACTION_FIELDS,
  ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS,
  EndpointRouteOwnershipBaseSchema,
} from "./read-only-app-mcp-endpoint-route-ownership-contracts";

const trueLiteral = z.literal(true);
const falseLiteral = z.literal(false);

export const EndpointRequestResponseEnvelopeAdapterBoundarySchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointRequestResponseEnvelopeAdapterBoundary"),
    envelopeAdapterFutureOnly: trueLiteral,
    rawFullFileDumpsAllowed: falseLiteral,
    privateFinanceDataDumpsAllowed: falseLiteral,
    responseMustPreserveFields: z.tuple([
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[0]),
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[1]),
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[2]),
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[3]),
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[4]),
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[5]),
      z.literal(ENDPOINT_ROUTE_RESPONSE_ENVELOPE_FIELDS[6]),
    ]),
  }).strict();

export const EndpointRefusalAdapterBoundarySchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointRefusalAdapterBoundary"),
    refusalAdapterFutureOnly: trueLiteral,
    failClosed: trueLiteral,
    refusalReasonRequired: trueLiteral,
    permittedNextActionsRequired: trueLiteral,
    generatedFinanceAdviceAllowed: falseLiteral,
    existingRefusalReasonsPreserved: z.tuple([
      z.literal(APP_REFUSAL_REASONS[0]),
      z.literal(APP_REFUSAL_REASONS[1]),
      z.literal(APP_REFUSAL_REASONS[2]),
      z.literal(APP_REFUSAL_REASONS[3]),
      z.literal(APP_REFUSAL_REASONS[4]),
      z.literal(APP_REFUSAL_REASONS[5]),
      z.literal(APP_REFUSAL_REASONS[6]),
      z.literal(APP_REFUSAL_REASONS[7]),
      z.literal(APP_REFUSAL_REASONS[8]),
    ]),
  }).strict();

export const EndpointAuthBoundaryDeferredBoundarySchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointAuthBoundaryDeferredBoundary"),
    authBoundaryFutureOnly: trueLiteral,
    authMiddlewareImplemented: falseLiteral,
    oauthImplemented: falseLiteral,
    tokenImplementationAdded: falseLiteral,
    sessionImplementationAdded: falseLiteral,
    cookiesImplemented: falseLiteral,
    futureTokenRejectionRequired: trueLiteral,
    requiresLaterFinancePlan: trueLiteral,
  }).strict();

export const EndpointLoggingRedactionBoundarySchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointLoggingRedactionBoundary"),
    loggingImplementationFutureOnly: trueLiteral,
    rawPromptLoggingAllowed: falseLiteral,
    rawSourceFileLoggingAllowed: falseLiteral,
    privateFinanceDataLoggingAllowed: falseLiteral,
    evidenceDumpLoggingAllowed: falseLiteral,
    mustRedact: z.tuple([
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[0]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[1]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[2]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[3]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[4]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[5]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[6]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[7]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[8]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[9]),
      z.literal(ENDPOINT_LOGGING_REDACTION_FIELDS[10]),
    ]),
  }).strict();

export const EndpointDeploymentDeferredBoundarySchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointDeploymentDeferredBoundary"),
    deploymentFutureOnly: trueLiteral,
    stableHttpsHostFutureOnly: trueLiteral,
    tlsFutureOnly: trueLiteral,
    privateHealthPathFutureOnly: trueLiteral,
    remoteMcpDeploymentImplemented: falseLiteral,
    providerDeploymentImplemented: falseLiteral,
  }).strict();

export const EndpointRollbackReadinessBoundarySchema =
  EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal("EndpointRollbackReadinessBoundary"),
    rollbackReadinessFutureOnly: trueLiteral,
    routeRegistrationCanBeDisabledLater: trueLiteral,
    transportAdapterCanBeRolledBackLater: trueLiteral,
    noRollbackRuntimeImplementedNow: trueLiteral,
    noDeploymentImplementedNow: trueLiteral,
  }).strict();

function noImplementationBoundary(
  kind:
    | "EndpointNoRouteImplementationBoundary"
    | "EndpointNoRuntimeImplementationBoundary"
    | "EndpointNoOauthTokenSessionBoundary"
    | "EndpointNoRemoteMcpServerBoundary"
    | "EndpointNoAppsSdkResourceBoundary"
    | "EndpointNoOpenAiApiModelCallsBoundary",
) {
  return EndpointRouteOwnershipBaseSchema.extend({
    contractKind: z.literal(kind),
    implemented: falseLiteral,
    futureOnly: trueLiteral,
    requiresLaterFinancePlan: trueLiteral,
    failIfChangedRuntimeSurfaceAppears: trueLiteral,
  }).strict();
}

export const EndpointNoRouteImplementationBoundarySchema =
  noImplementationBoundary("EndpointNoRouteImplementationBoundary");
export const EndpointNoRuntimeImplementationBoundarySchema =
  noImplementationBoundary("EndpointNoRuntimeImplementationBoundary");
export const EndpointNoOauthTokenSessionBoundarySchema =
  noImplementationBoundary("EndpointNoOauthTokenSessionBoundary");
export const EndpointNoRemoteMcpServerBoundarySchema = noImplementationBoundary(
  "EndpointNoRemoteMcpServerBoundary",
);
export const EndpointNoAppsSdkResourceBoundarySchema =
  noImplementationBoundary("EndpointNoAppsSdkResourceBoundary");
export const EndpointNoOpenAiApiModelCallsBoundarySchema =
  noImplementationBoundary("EndpointNoOpenAiApiModelCallsBoundary");

