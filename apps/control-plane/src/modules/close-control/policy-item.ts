import {
  CloseControlChecklistItemSchema,
  type CloseControlChecklistItem,
  type CloseControlFreshnessState,
  type CloseControlProofPostureState,
  type CloseControlSourcePostureState,
} from "@pocket-cto/domain";
import type { CloseControlPolicyPosture } from "./types";
import { buildPolicyRefs, buildProofSummary, dedupe } from "./utils";

export function buildPolicyItem(posture: CloseControlPolicyPosture) {
  const threshold = readThresholdPosture(posture.policyPages);
  const state = analyzePolicyPosture(posture, threshold);

  return CloseControlChecklistItemSchema.parse({
    family: "policy_source_freshness_review",
    status: state.status,
    sourcePosture: {
      state: state.sourceState,
      summary: state.summary,
      refs: posture.policyPages.flatMap((entry) => buildPolicyRefs(entry)),
    },
    evidenceBasis: {
      basisKind: "stored_cfo_wiki_policy_posture",
      summary:
        "Derived from stored CFO Wiki policy-document bindings, deterministic extract posture, policy pages, and the policy-corpus page.",
      refs: posture.policyPages.flatMap((entry) => buildPolicyRefs(entry)),
    },
    freshnessSummary: {
      state: state.freshnessState,
      summary: state.freshnessSummary,
      latestObservedAt: posture.policyCorpusPage?.page.lastCompiledAt ?? null,
    },
    limitations: dedupe([
      ...posture.companySummary.limitations,
      ...posture.policySources.flatMap((source) => source.limitations),
      ...posture.policyPages.flatMap((entry) => entry.page?.limitations ?? []),
      ...threshold.issues,
      threshold.factCount === 0
        ? "No exact supported Pocket CFO threshold line is available in stored policy posture."
        : "",
      "Policy-source review does not interpret legal or policy obligations.",
    ]),
    humanReviewNextStep:
      "Review bound policy-document sources, deterministic extract status, policy-corpus freshness, and threshold-line posture before relying on policy close/control posture.",
    proofPosture: {
      state: state.proofState,
      summary: buildProofSummary(state.proofState, "CFO Wiki policy-source"),
    },
  });
}

function analyzePolicyPosture(
  posture: CloseControlPolicyPosture,
  threshold: ReturnType<typeof readThresholdPosture>,
): {
  freshnessState: CloseControlFreshnessState;
  freshnessSummary: string;
  proofState: CloseControlProofPostureState;
  sourceState: CloseControlSourcePostureState;
  status: CloseControlChecklistItem["status"];
  summary: string;
} {
  if (posture.policySources.length === 0) {
    return {
      freshnessState: "missing",
      freshnessSummary:
        "No included policy_document binding is stored for this company.",
      proofState: "limited_by_missing_source",
      sourceState: "missing_source",
      status: "blocked_by_evidence",
      summary:
        "Policy source posture is blocked because no included policy_document source is stored.",
    };
  }

  const sourceBlocked = posture.policySources.some(
    (source) =>
      !source.latestSnapshot ||
      !source.latestSourceFile ||
      !source.latestExtract ||
      source.latestExtract.extractStatus === "failed",
  );
  const pageBlocked = posture.policyPages.some(
    (entry) => entry.page?.freshnessSummary.state === "failed",
  );
  const hasSuccessfulCompile =
    posture.companySummary.latestSuccessfulCompileRun !== null;

  if (!hasSuccessfulCompile || sourceBlocked || pageBlocked) {
    return {
      freshnessState: "failed",
      freshnessSummary:
        "A required CFO Wiki policy source, deterministic extract, policy page, or compile run is missing or failed.",
      proofState: "limited_by_failed_source",
      sourceState: "failed_source",
      status: "blocked_by_evidence",
      summary:
        "Policy source posture is blocked by missing or failed stored CFO Wiki evidence.",
    };
  }

  const needsReview =
    !posture.policyCorpusPage ||
    posture.policyCorpusPage.freshnessSummary.state !== "fresh" ||
    posture.policyPages.some(
      (entry) =>
        !entry.page ||
        entry.page.freshnessSummary.state !== "fresh" ||
        entry.source.latestExtract?.extractStatus === "unsupported" ||
        entry.source.limitations.length > 0 ||
        (entry.page?.limitations.length ?? 0) > 0,
    ) ||
    threshold.issues.length > 0 ||
    threshold.factCount === 0;

  if (needsReview) {
    return {
      freshnessState: "mixed",
      freshnessSummary:
        "Stored CFO Wiki policy posture is present but stale, unsupported, limited, or missing exact supported threshold-line posture.",
      proofState:
        threshold.issues.length > 0
          ? "limited_by_data_quality_gap"
          : "limited_by_coverage_gap",
      sourceState: "limited_source",
      status: "needs_review",
      summary:
        "Policy source posture is present but needs review before close/control reliance.",
    };
  }

  return {
    freshnessState: "fresh",
    freshnessSummary:
      "Stored CFO Wiki policy posture is fresh and deterministic for included policy sources.",
    proofState: "source_backed",
    sourceState: "source_backed",
    status: "ready_for_review",
    summary:
      "Policy source posture is backed by fresh CFO Wiki policy-document sources and policy pages.",
  };
}

function readThresholdPosture(
  policyPages: CloseControlPolicyPosture["policyPages"],
) {
  const factsByMetric = new Map<string, Set<string>>();
  const issues: string[] = [];

  for (const entry of policyPages) {
    for (const line of readPolicyThresholdCandidateLines(entry)) {
      const parsed = parseThresholdLine(line);
      if (parsed.status === "ok") {
        const signatures =
          factsByMetric.get(parsed.metricKey) ?? new Set<string>();
        signatures.add(
          buildThresholdSignature({
            comparator: parsed.comparator,
            unit: "percent",
            value: parsed.value,
          }),
        );
        factsByMetric.set(parsed.metricKey, signatures);
      } else {
        issues.push(parsed.summary);
      }
    }
  }

  for (const [metricKey, signatures] of factsByMetric.entries()) {
    if (signatures.size <= 1) {
      continue;
    }

    issues.push(
      `Stored policy threshold posture has conflicting exact threshold facts for ${metricKey}: ${[
        ...signatures,
      ]
        .sort()
        .map(formatThresholdSignature)
        .join("; ")}. F6H will not infer which threshold controls.`,
    );
  }

  return {
    factCount: factsByMetric.size,
    issues: dedupe(issues),
  };
}

function readPolicyThresholdCandidateLines(
  input: CloseControlPolicyPosture["policyPages"][number],
) {
  const chunks = [
    input.source.latestExtract?.extractedText ?? "",
    input.source.latestExtract?.renderedMarkdown ?? "",
    ...(input.source.latestExtract?.excerptBlocks.map((block) => block.text) ??
      []),
    input.page?.page.markdownBody ?? "",
  ];

  return chunks
    .flatMap((chunk) => chunk.split(/\r?\n/u))
    .map((line) => line.trim().replace(/^-\s+/u, ""))
    .filter((line) => line.startsWith("Pocket CFO threshold:"));
}

function parseThresholdLine(line: string):
  | {
      comparator: string;
      metricKey: string;
      status: "ok";
      value: number;
    }
  | { status: "issue"; summary: string } {
  const match =
    /^Pocket CFO threshold:\s+([a-z_]+)\s*(<=|<|>=|>)\s*([0-9]+(?:\.[0-9]+)?)\s+([A-Za-z]+)$/u.exec(
      line,
    );

  if (!match?.[1] || !match[2] || !match[3] || !match[4]) {
    return {
      status: "issue",
      summary: `Stored policy threshold line is outside the exact F6E grammar: ${line}`,
    };
  }

  if (
    match[1] !== "collections_past_due_share" &&
    match[1] !== "payables_past_due_share"
  ) {
    return {
      status: "issue",
      summary: `Stored policy threshold line uses unsupported F6E metric ${match[1]}.`,
    };
  }

  if (match[4].toLowerCase() !== "percent") {
    return {
      status: "issue",
      summary: `Stored policy threshold line uses unsupported F6E unit ${match[4]}.`,
    };
  }

  return {
    comparator: match[2],
    metricKey: match[1],
    status: "ok",
    value: Number(match[3]),
  };
}

function buildThresholdSignature(input: {
  comparator: string;
  unit: "percent";
  value: number;
}) {
  return `${input.comparator}:${input.value}:${input.unit}`;
}

function formatThresholdSignature(signature: string) {
  const [comparator, value, unit] = signature.split(":");

  return `${comparator} ${value} ${unit}`;
}
