import {
  collectForbiddenOpenAiExecutableMatches,
  hasAuthRuntimeSource,
  hasFinanceWriteSource,
  hasProviderExternalSource,
  hasSourceMutationSource,
  noDbSchemaMigrationChanges,
  noDeploymentPublicAssetRepositoryPaths,
  noPackageScriptChanges,
  normalizePath,
  normalizeSourceTextByPath,
  sortUnique,
} from "./read-only-app-mcp-protected-resource-metadata-route-input-inventory-rules";

export type McpTokenValidationTestDoubleInventoryMatch = {
  excerpt?: string;
  lineNumber?: number;
  path: string;
  patternName: string;
};

type McpTokenValidationTestDoubleSourceMatchBuckets = {
  bearerTokenMaterial: McpTokenValidationTestDoubleInventoryMatch[];
  invalidTokenChallengeRuntime: McpTokenValidationTestDoubleInventoryMatch[];
  jwtDecodingRuntime: McpTokenValidationTestDoubleInventoryMatch[];
  jwtLikeExamples: McpTokenValidationTestDoubleInventoryMatch[];
  oauthTokenSessionAuthRuntime: McpTokenValidationTestDoubleInventoryMatch[];
  realTokenExamples: McpTokenValidationTestDoubleInventoryMatch[];
  routeConsumesTestDoubles: McpTokenValidationTestDoubleInventoryMatch[];
  testDoubleRuntime: McpTokenValidationTestDoubleInventoryMatch[];
  tokenIntrospectionRuntime: McpTokenValidationTestDoubleInventoryMatch[];
  tokenParsingRuntime: McpTokenValidationTestDoubleInventoryMatch[];
  tokenValidationRuntime: McpTokenValidationTestDoubleInventoryMatch[];
};

export type McpTokenValidationTestDoubleRepositoryInventoryInput = {
  branchDiffPaths?: readonly string[];
  dirtyPaths?: readonly string[];
  repoPaths: readonly string[];
  sourceTextByPath?: Readonly<Record<string, string>>;
};

export function verifyMcpTokenValidationTestDoubleRepositoryInventory(
  input: McpTokenValidationTestDoubleRepositoryInventoryInput,
) {
  const branchDiffPaths = sortUnique(
    (input.branchDiffPaths ?? []).map(normalizePath),
  );
  const dirtyPaths = sortUnique((input.dirtyPaths ?? []).map(normalizePath));
  const combinedChangedPaths = sortUnique([...branchDiffPaths, ...dirtyPaths]);
  const repoPaths = sortUnique(input.repoPaths.map(normalizePath));
  const sourceTextByPath = normalizeSourceTextByPath(
    input.sourceTextByPath ?? {},
  );
  const proofSourceEntries = Object.entries(sourceTextByPath).filter(([path]) =>
    isMcpTokenValidationTestDoubleProofSourcePath(path),
  );
  const proofSourceText = proofSourceEntries
    .map(([path, source]) => `// ${path}\n${source}`)
    .join("\n");
  const pathMatches = collectRepositoryPathMatches(repoPaths);
  const sourceMatches = collectProofSourceMatches(proofSourceEntries);
  const openAiMatches =
    collectForbiddenOpenAiExecutableMatches(proofSourceText);
  const driftVerified =
    noDbSchemaMigrationChanges(combinedChangedPaths) &&
    noPackageScriptChanges(combinedChangedPaths) &&
    noDeploymentPublicAssetRepositoryPaths(combinedChangedPaths) &&
    !combinedChangedPaths.some(isDataOrSourcePackPath) &&
    !hasProviderExternalSource(proofSourceText) &&
    !hasSourceMutationSource(proofSourceText) &&
    !hasFinanceWriteSource(proofSourceText);
  const noTokenValidationTestDoubleRuntimeRepositoryInventoryVerified =
    pathMatches.testDoubleRuntime.length === 0 &&
    sourceMatches.testDoubleRuntime.length === 0;
  const noTokenParsingRuntimeRepositoryInventoryVerified =
    pathMatches.tokenParsingRuntime.length === 0 &&
    sourceMatches.tokenParsingRuntime.length === 0;
  const noTokenValidationRuntimeRepositoryInventoryVerified =
    pathMatches.tokenValidationRuntime.length === 0 &&
    sourceMatches.tokenValidationRuntime.length === 0;
  const noJwtDecodingRuntimeRepositoryInventoryVerified =
    pathMatches.jwtDecodingRuntime.length === 0 &&
    sourceMatches.jwtDecodingRuntime.length === 0;
  const noTokenIntrospectionRuntimeRepositoryInventoryVerified =
    pathMatches.tokenIntrospectionRuntime.length === 0 &&
    sourceMatches.tokenIntrospectionRuntime.length === 0;
  const noInvalidTokenChallengeRuntimeRepositoryInventoryVerified =
    pathMatches.invalidTokenChallengeRuntime.length === 0 &&
    sourceMatches.invalidTokenChallengeRuntime.length === 0;
  const noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified =
    sourceMatches.routeConsumesTestDoubles.length === 0;
  const noRealTokenExampleRepositoryInventoryVerified =
    pathMatches.realTokenExamples.length === 0 &&
    sourceMatches.realTokenExamples.length === 0;
  const noJwtLikeExampleRepositoryInventoryVerified =
    pathMatches.jwtLikeExamples.length === 0 &&
    sourceMatches.jwtLikeExamples.length === 0;
  const noBearerTokenMaterialRepositoryInventoryVerified =
    pathMatches.bearerTokenMaterial.length === 0 &&
    sourceMatches.bearerTokenMaterial.length === 0;
  const noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified =
    pathMatches.oauthTokenSessionAuthRuntime.length === 0 &&
    sourceMatches.oauthTokenSessionAuthRuntime.length === 0 &&
    !hasAuthRuntimeSource(proofSourceText);
  const noOpenAiApiSourceScanVerified = openAiMatches.length === 0;
  const proofSourceInventoryVerified = proofSourceEntries.length > 0;
  const tokenValidationTestDoubleRepositoryInventoryVerified =
    proofSourceInventoryVerified &&
    driftVerified &&
    noTokenValidationTestDoubleRuntimeRepositoryInventoryVerified &&
    noTokenParsingRuntimeRepositoryInventoryVerified &&
    noTokenValidationRuntimeRepositoryInventoryVerified &&
    noJwtDecodingRuntimeRepositoryInventoryVerified &&
    noTokenIntrospectionRuntimeRepositoryInventoryVerified &&
    noInvalidTokenChallengeRuntimeRepositoryInventoryVerified &&
    noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified &&
    noRealTokenExampleRepositoryInventoryVerified &&
    noJwtLikeExampleRepositoryInventoryVerified &&
    noBearerTokenMaterialRepositoryInventoryVerified &&
    noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified &&
    noOpenAiApiSourceScanVerified;

  return {
    branchDiffPaths,
    combinedChangedPaths,
    dirtyPaths,
    driftVerified,
    fp0133PostmergeProofDurabilityVerified:
      tokenValidationTestDoubleRepositoryInventoryVerified,
    noBearerTokenMaterialRepositoryInventoryVerified,
    noInvalidTokenChallengeRuntimeRepositoryInventoryVerified,
    noJwtDecodingRuntimeRepositoryInventoryVerified,
    noJwtLikeExampleRepositoryInventoryVerified,
    noOauthTokenSessionAuthRuntimeRepositoryInventoryVerified,
    noOpenAiApiSourceScanVerified,
    noRealTokenExampleRepositoryInventoryVerified,
    noRouteConsumesTokenValidationTestDoublesRepositoryInventoryVerified,
    noTokenIntrospectionRuntimeRepositoryInventoryVerified,
    noTokenParsingRuntimeRepositoryInventoryVerified,
    noTokenValidationRuntimeRepositoryInventoryVerified,
    noTokenValidationTestDoubleRuntimeRepositoryInventoryVerified,
    openAiMatches,
    pathMatches,
    proofSourceInventoryVerified,
    proofSourcePaths: proofSourceEntries.map(([path]) => path).sort(),
    sourceMatches,
    tokenValidationTestDoubleRepositoryInventoryVerified,
  };
}

export function isMcpTokenValidationTestDoubleProofSourcePath(path: string) {
  const normalized = normalizePath(path);
  if (/\.spec\.ts$/u.test(normalized)) return false;
  return (
    /^apps\/control-plane\/src\/modules\/read-only-app-mcp-endpoint\/.+/u.test(
      normalized,
    ) ||
    /^apps\/control-plane\/src\/modules\/evidence-index\/tools\/.+/u.test(
      normalized,
    ) ||
    /^packages\/domain\/src\/read-only-app-mcp-token-validation-test-double.*\.ts$/u.test(
      normalized,
    ) ||
    /^packages\/domain\/src\/read-only-app-mcp-token-validation-runtime.*\.ts$/u.test(
      normalized,
    ) ||
    /^packages\/domain\/src\/read-only-app-mcp-token-validation.*\.ts$/u.test(
      normalized,
    ) ||
    /^packages\/domain\/src\/read-only-app-mcp-invalid-token-challenge.*\.ts$/u.test(
      normalized,
    ) ||
    /^packages\/domain\/src\/read-only-app-mcp-www-authenticate.*\.ts$/u.test(
      normalized,
    ) ||
    /^packages\/domain\/src\/read-only-app-mcp-protected-resource-metadata.*\.ts$/u.test(
      normalized,
    ) ||
    /^tools\/read-only-mcp-token-validation.*\.mjs$/u.test(normalized) ||
    /^tools\/read-only-mcp-production-token-validation.*\.mjs$/u.test(
      normalized,
    ) ||
    /^tools\/read-only-mcp-invalid-token-challenge.*\.mjs$/u.test(normalized) ||
    /^tools\/read-only-mcp-invalid-token-app-wiring-proof\.mjs$/u.test(
      normalized,
    ) ||
    /^tools\/read-only-mcp-www-authenticate.*\.mjs$/u.test(normalized) ||
    /^tools\/read-only-mcp-protected-resource-metadata.*\.mjs$/u.test(
      normalized,
    )
  );
}

function collectRepositoryPathMatches(repoPaths: readonly string[]) {
  return {
    bearerTokenMaterial: repoPaths.filter(isBearerTokenMaterialExamplePath),
    invalidTokenChallengeRuntime: repoPaths.filter(
      isInvalidTokenChallengeRuntimePath,
    ),
    jwtDecodingRuntime: repoPaths.filter(isJwtDecodingRuntimePath),
    jwtLikeExamples: repoPaths.filter(isJwtLikeExamplePath),
    oauthTokenSessionAuthRuntime: repoPaths.filter(
      isOauthTokenSessionAuthRuntimePath,
    ),
    realTokenExamples: repoPaths.filter(isRealTokenExamplePath),
    testDoubleRuntime: repoPaths.filter(isTestDoubleRuntimePath),
    tokenIntrospectionRuntime: repoPaths.filter(
      isTokenIntrospectionRuntimePath,
    ),
    tokenParsingRuntime: repoPaths.filter(isTokenParsingRuntimePath),
    tokenValidationRuntime: repoPaths.filter(isTokenValidationRuntimePath),
  };
}

function collectProofSourceMatches(
  proofSourceEntries: readonly (readonly [string, string])[],
): McpTokenValidationTestDoubleSourceMatchBuckets {
  const matches: McpTokenValidationTestDoubleSourceMatchBuckets = {
    bearerTokenMaterial: [],
    invalidTokenChallengeRuntime: [],
    jwtDecodingRuntime: [],
    jwtLikeExamples: [],
    oauthTokenSessionAuthRuntime: [],
    realTokenExamples: [],
    routeConsumesTestDoubles: [],
    testDoubleRuntime: [],
    tokenIntrospectionRuntime: [],
    tokenParsingRuntime: [],
    tokenValidationRuntime: [],
  };

  for (const [path, sourceText] of proofSourceEntries) {
    let rejectionFixtureBlock = false;
    sourceText.split("\n").forEach((line, index) => {
      if (
        /\b(?:leakingExamples|forbiddenInputs|forbiddenExamples)\b.*\[/u.test(
          line,
        )
      ) {
        rejectionFixtureBlock = true;
      }
      if (!rejectionFixtureBlock && !isSafeProofScannerLine(path, line)) {
        collectLineMatches(path, line, index + 1, matches);
      }
      if (rejectionFixtureBlock && /^\s*\]\s*(?:[.;,)]|$)/u.test(line)) {
        rejectionFixtureBlock = false;
      }
    });
  }

  return matches;
}

function collectLineMatches(
  path: string,
  line: string,
  lineNumber: number,
  matches: McpTokenValidationTestDoubleSourceMatchBuckets,
) {
  const push = (
    key: keyof McpTokenValidationTestDoubleSourceMatchBuckets,
    patternName: string,
  ) =>
    matches[key].push({
      excerpt: line.trim().slice(0, 160),
      lineNumber,
      path,
      patternName,
    });

  if (
    /\b(?:consumeTestDouble|runTestDouble|routeTestDouble|read-only-app-mcp-token-validation-test-double)\b/u.test(
      line,
    ) &&
    isRouteSourcePath(path)
  ) {
    push("routeConsumesTestDoubles", "route-consumes-test-double");
  }
  if (
    /\b(?:testDoubleRuntime|createTestDoubleRuntime|runTestDouble)\s*\(/u.test(
      line,
    )
  ) {
    push("testDoubleRuntime", "test-double-runtime-call");
  }
  if (/\b(?:decodeToken|parseToken|parseJwt)\s*\(/u.test(line)) {
    push("tokenParsingRuntime", "token-parsing-runtime-call");
  }
  if (/\b(?:decodeJwt|jwtDecode)\s*\(/u.test(line)) {
    push("jwtDecodingRuntime", "jwt-decoding-runtime-call");
  }
  if (/\b(?:jwtVerify|verifyJwt)\s*\(/u.test(line)) {
    push("jwtDecodingRuntime", "jwt-verification-runtime-call");
  }
  if (/\bintrospectToken\s*\(/u.test(line)) {
    push("tokenIntrospectionRuntime", "token-introspection-runtime-call");
  }
  if (/\b(?:validateToken|verifyToken|tokenValidator)\s*\(/u.test(line)) {
    push("tokenValidationRuntime", "token-validation-runtime-call");
  }
  if (
    /\b(?:invalidTokenChallenge|malformedToken|expiredToken|wrongAudience|wrongResource|wrongScope|wrongOrg|wrongCompany|revokedToken|replayedToken)\s*\(/u.test(
      line,
    )
  ) {
    push(
      "invalidTokenChallengeRuntime",
      "invalid-token-challenge-runtime-call",
    );
  }
  if (
    /\b(?:oauthCallback|authorizeUrl|tokenExchange|authorizationCode|pkceVerifier|authMiddleware|authorizationMiddleware|routeGuard|verifyBearer|requireAuth|authenticateRequest|tokenStore|sessionStore|sessionHandler|refreshTokenStore|setCookie)\s*\(/u.test(
      line,
    )
  ) {
    push(
      "oauthTokenSessionAuthRuntime",
      "oauth-token-session-auth-runtime-call",
    );
  }
  if (/\bauthorization\s*:\s*bearer\s+\S+/iu.test(line)) {
    push("bearerTokenMaterial", "authorization-bearer-material");
  }
  if (
    /\bbearer\s+(?!scheme\b|challenge\b|resource_metadata\b|parameter\b|parameters\b|token\b|material\b|proof-token-material\b|synthetic-token-material\b)[A-Za-z0-9._~+/-]{8,}={0,2}\b/iu.test(
      line,
    )
  ) {
    push("bearerTokenMaterial", "bearer-token-material");
  }
  if (lineHasJwtLikeMaterial(line)) {
    push("jwtLikeExamples", "jwt-like-three-segment-material");
  }
  if (
    /\b(?:access_token|refresh_token|client_secret|api_key|x-api-key|cookie|session)\s*[:=]\s*[A-Za-z0-9][A-Za-z0-9._~+/-]{7,}={0,2}\b/iu.test(
      line,
    )
  ) {
    push("realTokenExamples", "token-or-secret-material");
  }
}

function lineHasJwtLikeMaterial(line: string) {
  const tokenPattern =
    /[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/u;
  const trimmed = line.trim();
  const match = tokenPattern.exec(line);
  if (!match) return false;
  const token = match[0];
  const looksEncoded = /(?:^eyJ|[0-9_-])/u.test(token);
  if (!looksEncoded) return false;
  return (
    trimmed === token ||
    /["'`][^"'`]*[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}[^"'`]*["'`]/u.test(
      line,
    )
  );
}

function isSafeProofScannerLine(path: string, line: string) {
  const trimmed = line.trim();
  const normalized = trimmed.toLowerCase();
  if (!trimmed) return true;
  if (
    /(?:pattern\s*:|new RegExp|\.test\(|matchAll\(|collectLineMatches|collectForbiddenOpenAiExecutableMatches|scanTokenValidationNoLeakage)/u.test(
      trimmed,
    ) &&
    /(?:token|jwt|bearer|openai|authorization|session|cookie|secret)/iu.test(
      trimmed,
    )
  ) {
    return true;
  }
  if (/^(?:\/\/|\/\*|\*|["'`])/.test(trimmed)) {
    return /(?:no|not|never|without|does not|do not|must not|prohibit|prohibited|forbid|forbidden|reject|rejected|absence|absent|future-only)/u.test(
      normalized,
    );
  }
  return (
    /(?:proof|inventory|contract|validation|plan-boundary|\.spec\.ts$)/u.test(
      path,
    ) &&
    /^(?:no|not|never|without|does not|do not|must not|prohibit|prohibited|forbid|forbidden|reject|rejected|absence|absent|future-only)\b/u.test(
      normalized,
    )
  );
}

function isRouteSourcePath(path: string) {
  return /^apps\/control-plane\/src\/modules\/read-only-app-mcp-endpoint\//u.test(
    path,
  );
}

function isDataOrSourcePackPath(path: string) {
  return /(?:^|\/)(?:fixtures?|datasets?|source-packs?|sources)(?:\/|$)|\.(?:csv|xlsx|jsonl|parquet)$/iu.test(
    path,
  );
}

function isProofOrContractPath(path: string) {
  return (
    /(?:proof|contract|contracts|readiness|sequencing|planning|plan-boundary|inventory|types|builders|result-envelope|\.spec\.ts$)/u.test(
      path,
    ) ||
    /read-only-app-mcp-token-validation-test-double-validation\.ts$/u.test(
      path,
    ) ||
    /^packages\/domain\/src\/read-only-app-mcp-invalid-token-challenge\.ts$/u.test(
      path,
    ) ||
    /^apps\/control-plane\/src\/modules\/read-only-app-mcp-endpoint\/invalid-token-challenge\.ts$/u.test(
      path,
    ) ||
    /^plans\/FP-0141-read-only-chatgpt-app-mcp-invalid-token-challenge-local-runtime-implementation\.md$/u.test(
      path,
    ) ||
    /^plans\/FP-0135-read-only-chatgpt-app-mcp-invalid-token-challenge-sequencing-master-plan\.md$/u.test(
      path,
    ) ||
    /^plans\/FP-0136-read-only-chatgpt-app-mcp-invalid-token-challenge-contracts-foundation\.md$/u.test(
      path,
    ) ||
    /^plans\/FP-0138-read-only-chatgpt-app-mcp-token-validation-runtime-implementation-planning\.md$/u.test(
      path,
    ) ||
    /^plans\/FP-0144-read-only-chatgpt-app-mcp-production-token-validation-sequencing-master-plan\.md$/u.test(
      path,
    ) ||
    /^plans\/FP-0134-read-only-chatgpt-app-mcp-token-validation-test-double-local-implementation\.md$/u.test(
      path,
    )
  );
}

function isTestDoubleRuntimePath(path: string) {
  return (
    /token-validation-test-double.*(?:runtime|implementation|runner|adapter|middleware|service)/iu.test(
      path,
    ) && !isProofOrContractPath(path)
  );
}

function isTokenParsingRuntimePath(path: string) {
  return (
    /(?:token-parser|token-decoder|jwt-parser|parse-token|decode-token)/iu.test(
      path,
    ) && !isProofOrContractPath(path)
  );
}

function isJwtDecodingRuntimePath(path: string) {
  return (
    /(?:jwt-decoder|jwt-decode|jwt-verify|verify-jwt)/iu.test(path) &&
    !isProofOrContractPath(path)
  );
}

function isTokenIntrospectionRuntimePath(path: string) {
  return (
    /(?:token-introspection|introspect-token)/iu.test(path) &&
    !isProofOrContractPath(path)
  );
}

function isTokenValidationRuntimePath(path: string) {
  return (
    /(?:token-validation-runtime-(?:implementation|service|adapter|middleware)|token-validator|validate-token|verify-token)/iu.test(
      path,
    ) && !isProofOrContractPath(path)
  );
}

function isInvalidTokenChallengeRuntimePath(path: string) {
  return (
    /(?:invalid-token|malformed-token|expired-token|wrong-audience|wrong-resource|wrong-scope|wrong-org|wrong-company|revoked-token|replayed-token).*(?:runtime|challenge|route|middleware|service)/iu.test(
      path,
    ) && !isProofOrContractPath(path)
  );
}

function isOauthTokenSessionAuthRuntimePath(path: string) {
  return (
    /(?:oauth-callback|token-exchange|pkce|token-store|token-session|session-store|session-handler|refresh-token|access-token|auth-middleware|authorization-middleware|route-guard|verify-bearer|require-auth|authenticate-request)/iu.test(
      path,
    ) && !isProofOrContractPath(path)
  );
}

function isRealTokenExamplePath(path: string) {
  return (
    /(?:real-token|token-material|access-token|refresh-token|credential-example|secret-example)/iu.test(
      path,
    ) && !isProofOrContractPath(path)
  );
}

function isJwtLikeExamplePath(path: string) {
  return (
    /(?:jwt-like|jwt-example|decoded-jwt)/iu.test(path) &&
    !isProofOrContractPath(path)
  );
}

function isBearerTokenMaterialExamplePath(path: string) {
  return (
    /(?:bearer-token|authorization-header-example)/iu.test(path) &&
    !isProofOrContractPath(path)
  );
}
