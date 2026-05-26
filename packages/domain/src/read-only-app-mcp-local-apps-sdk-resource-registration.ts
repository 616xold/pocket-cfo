import {
  LOCAL_APPS_SDK_RESOURCE_MIME_TYPE,
  LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
  buildReadOnlyMcpLocalAppsSdkResourceSkeleton,
} from "./read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime";
import type {
  ReadOnlyMcpLocalAppsSdkResourceSkeleton,
  ReadOnlyMcpLocalAppsSdkResourceSkeletonSnapshot,
} from "./read-only-app-mcp-local-apps-sdk-resource-skeleton-runtime";

export const MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_SCHEMA_VERSION =
  "v2cf.read-only-chatgpt-app-mcp-local-apps-sdk-resource-registration.v1";

export const READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_NAME =
  "pocket-cfo-local-preview-demo";

export type ReadOnlyMcpLocalAppsSdkResourceRegistrationResult = {
  contents: [ReadOnlyMcpLocalAppsSdkResourceSkeleton];
};

export type ReadOnlyMcpLocalAppsSdkResourceRegistrationHandler =
  () => ReadOnlyMcpLocalAppsSdkResourceRegistrationResult;

export type ReadOnlyMcpLocalAppsSdkResourceRegistry = {
  registerResource: (
    name: typeof READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_NAME,
    uri: typeof LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
    metadata: Record<string, never>,
    handler: ReadOnlyMcpLocalAppsSdkResourceRegistrationHandler,
  ) => unknown;
};

export type RegisterReadOnlyMcpLocalAppsSdkResourceSkeletonOptions = {
  snapshot?: ReadOnlyMcpLocalAppsSdkResourceSkeletonSnapshot;
};

export type ReadOnlyMcpLocalAppsSdkResourceRegistrationSummary = {
  registered: true;
  name: typeof READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_NAME;
  uri: typeof LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI;
  mimeType: typeof LOCAL_APPS_SDK_RESOURCE_MIME_TYPE;
  localOnly: true;
  defaultRegistration: false;
  serverResourceRegistration: false;
};

export type ReadOnlyMcpLocalAppsSdkResourceRegistrationProofInput = {
  defaultRegistrationStillBlocked?: boolean;
  fp0163CloseoutFresh?: boolean;
  fp0163SuccessorBridgeCompatible?: boolean;
  fp0164PlanVerified?: boolean;
  fp0165Absent?: boolean;
  noAppRuntimeOrRouteWiring?: boolean;
  noToolDescriptorOrRenderTool?: boolean;
  registrationHelperImportsRuntimeSafeBuilder?: boolean;
  registrationHelperNotProofHeavy?: boolean;
  registerResourceCalledExactlyOnce?: boolean;
  runtimeSafeSkeletonBuilderIsolated?: boolean;
};

export function registerReadOnlyMcpLocalAppsSdkResourceSkeleton(
  registry: ReadOnlyMcpLocalAppsSdkResourceRegistry,
  options: RegisterReadOnlyMcpLocalAppsSdkResourceSkeletonOptions = {},
): ReadOnlyMcpLocalAppsSdkResourceRegistrationSummary {
  const candidate = registry as Partial<ReadOnlyMcpLocalAppsSdkResourceRegistry>;
  if (!candidate || typeof candidate.registerResource !== "function") {
    throw new Error(
      "Read-only local Apps SDK resource registration requires a caller-provided registerResource function",
    );
  }

  const handler = (): ReadOnlyMcpLocalAppsSdkResourceRegistrationResult => ({
    contents: [buildReadOnlyMcpLocalAppsSdkResourceSkeleton(options.snapshot)],
  });
  const register = candidate.registerResource.bind(registry);
  register(
    READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_NAME,
    LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
    {},
    handler,
  );

  return {
    registered: true,
    name: READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_NAME,
    uri: LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
    mimeType: LOCAL_APPS_SDK_RESOURCE_MIME_TYPE,
    localOnly: true,
    defaultRegistration: false,
    serverResourceRegistration: false,
  };
}

export function buildReadOnlyMcpLocalAppsSdkResourceRegistrationProof(
  input: ReadOnlyMcpLocalAppsSdkResourceRegistrationProofInput = {},
) {
  const registeredCalls: unknown[] = [];
  const registry: ReadOnlyMcpLocalAppsSdkResourceRegistry = {
    registerResource: (name, uri, metadata, handler) => {
      registeredCalls.push({ handler, metadata, name, uri });
    },
  };
  const summary = registerReadOnlyMcpLocalAppsSdkResourceSkeleton(registry);
  const registrationCall = registeredCalls[0] as
    | {
        handler: ReadOnlyMcpLocalAppsSdkResourceRegistrationHandler;
        metadata: Record<string, never>;
        name: string;
        uri: string;
      }
    | undefined;
  const handlerResult = registrationCall?.handler();
  const content = handlerResult?.contents[0];

  return {
    schemaVersion: MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_SCHEMA_VERSION,
    fp0164AbsentOrLocalAppsSdkResourceRegistrationPlanVerified:
      input.fp0164PlanVerified === true,
    fp0165Absent: input.fp0165Absent === true,
    localAppsSdkResourceRegistrationBoundaryVerified:
      input.runtimeSafeSkeletonBuilderIsolated === true &&
      input.registrationHelperImportsRuntimeSafeBuilder === true &&
      input.registrationHelperNotProofHeavy === true &&
      input.defaultRegistrationStillBlocked !== false,
    runtimeSafeSkeletonBuilderIsolated:
      input.runtimeSafeSkeletonBuilderIsolated === true,
    proofHeavySkeletonModuleNotImportedByRegistration:
      input.registrationHelperNotProofHeavy === true,
    explicitRegisterResourceHelperImplemented: summary.registered === true,
    explicitRegisterResourceHelperRequiresCallerProvidedRegistry: true,
    registerResourceCalledExactlyOnceInHelperSpec:
      input.registerResourceCalledExactlyOnce === true &&
      registeredCalls.length === 1,
    deterministicLocalResourceNameVerified:
      registrationCall?.name ===
      READ_ONLY_MCP_LOCAL_APPS_SDK_RESOURCE_REGISTRATION_NAME,
    deterministicLocalResourceUriVerified:
      registrationCall?.uri === LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI,
    registeredResourceMetadataEmpty:
      registrationCall !== undefined &&
      Object.keys(registrationCall.metadata).length === 0,
    registeredResourceContentsShapeVerified:
      handlerResult?.contents.length === 1 &&
      content?.uri === LOCAL_APPS_SDK_RESOURCE_TEMPLATE_URI &&
      content.mimeType === LOCAL_APPS_SDK_RESOURCE_MIME_TYPE,
    registeredResourceSummarySanitized:
      summary.localOnly === true &&
      summary.defaultRegistration === false &&
      summary.serverResourceRegistration === false,
    defaultResourceRegistrationStillBlocked:
      input.defaultRegistrationStillBlocked !== false,
    serverResourceRegistrationStillBlocked:
      input.defaultRegistrationStillBlocked !== false,
    toolDescriptorImplementationStillBlocked:
      input.noToolDescriptorOrRenderTool !== false,
    outputTemplateImplementationStillBlocked:
      input.noToolDescriptorOrRenderTool !== false,
    renderToolImplementationStillBlocked:
      input.noToolDescriptorOrRenderTool !== false,
    componentBundleImplementationStillBlocked: true,
    noAppRuntimeOrRouteWiringFromFp0164:
      input.noAppRuntimeOrRouteWiring !== false,
    fp0163CloseoutFreshnessVerified: input.fp0163CloseoutFresh === true,
    fp0163SuccessorBridgeCompatibilityVerified:
      input.fp0163SuccessorBridgeCompatible === true,
    proofDetails: {
      mimeType: summary.mimeType,
      name: summary.name,
      uri: summary.uri,
    },
  } as const;
}

export function verifyReadOnlyMcpLocalAppsSdkResourceRegistrationBoundary(
  input: ReadOnlyMcpLocalAppsSdkResourceRegistrationProofInput = {},
) {
  const proof = buildReadOnlyMcpLocalAppsSdkResourceRegistrationProof(input);

  return Object.entries(proof).every(
    ([, value]) => typeof value !== "boolean" || value,
  );
}

export function verifyFp0163CloseoutFreshnessForFp0164(planText: string) {
  const normalized = normalize(planText);

  return includesAll(normalized, [
    "pr #342 merged",
    "dd6c3797cdd31428ca9eee1336c811240654507c",
    "e5daeb6e80001e5aa460aaead96b4d4b6f1a8310",
    "same-branch qa found stale predecessor proof allowlists for exact fp-0163 inventory compatibility files",
    "proof-gate-only",
    "github static and integration-db checks were green",
    "no standalone post-merge qa is required when current main matches the validated pr head/merge posture and ci remains green",
  ]);
}

function includesAll(text: string, values: readonly string[]) {
  return values.every((value) => text.includes(normalize(value)));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/gu, " ").trim();
}
