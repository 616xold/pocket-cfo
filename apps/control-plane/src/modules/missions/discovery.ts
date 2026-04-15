import type {
  CreateDiscoveryMissionInput,
  FinanceDiscoveryQuestion,
  MissionSpec,
  MissionSourceKind,
} from "@pocket-cto/domain";
import {
  CreateDiscoveryMissionInputSchema,
  FinanceDiscoveryQuestionSchema,
} from "@pocket-cto/domain";
import type { MissionCompilationResult } from "./compiler";

const DISCOVERY_INTAKE_COMPILER: MissionCompilationResult = {
  compilerName: "typed-discovery-intake",
  compilerVersion: "0.1.0",
  confidence: 100,
  spec: {
    type: "discovery",
    title: "placeholder",
    objective: "placeholder",
    repos: [],
    constraints: {
      mustNot: [],
      allowedPaths: [],
    },
    acceptance: ["placeholder"],
    riskBudget: {
      sandboxMode: "read-only",
      maxWallClockMinutes: 5,
      maxCostUsd: 1,
      allowNetwork: false,
      requiresHumanApprovalFor: [],
    },
    deliverables: ["discovery_answer", "proof_bundle"],
    evidenceRequirements: ["stored twin blast-radius answer"],
  },
};

export function buildDiscoveryMissionCreationInput(rawInput: CreateDiscoveryMissionInput) {
  const input = CreateDiscoveryMissionInputSchema.parse(rawInput);
  const question = FinanceDiscoveryQuestionSchema.parse({
    companyKey: input.companyKey.trim(),
    questionKind: input.questionKind,
    operatorPrompt: input.operatorPrompt?.trim() || null,
  });
  const spec = buildDiscoveryMissionSpec(question);

  return {
    compilation: {
      ...DISCOVERY_INTAKE_COMPILER,
      spec,
    } satisfies MissionCompilationResult,
    compilerOutput: {
      discoveryQuestion: question,
      spec,
    } satisfies Record<string, unknown>,
    createdBy: input.requestedBy,
    primaryRepo: null,
    rawText: JSON.stringify(question, null, 2),
    sourceKind: "manual_discovery" as MissionSourceKind,
    sourceRef: null,
    spec,
  };
}

function buildDiscoveryMissionSpec(input: FinanceDiscoveryQuestion): MissionSpec {
  const title = buildDiscoveryTitle(input.companyKey, input.questionKind);
  const objective = buildDiscoveryObjective(input.companyKey);

  return {
    type: "discovery",
    title,
    objective,
    repos: [],
    constraints: {
      mustNot: [
        "do not invoke the codex runtime",
        "do not resync the finance twin during execution",
        "do not recompile the CFO Wiki during execution",
        "do not add generic finance chat or freeform answer generation",
        "do not hide stale, partial, failed, or missing stored state",
      ],
      allowedPaths: [],
    },
    acceptance: [
      "persist one durable discovery answer artifact",
      "persist one finance-ready proof bundle",
      "surface freshness posture, limitations, related routes, related CFO Wiki pages, and structured evidence sections honestly",
    ],
    riskBudget: {
      sandboxMode: "read-only",
      maxWallClockMinutes: 5,
      maxCostUsd: 1,
      allowNetwork: false,
      requiresHumanApprovalFor: [],
    },
    deliverables: ["discovery_answer", "proof_bundle"],
    evidenceRequirements: [
      "stored finance-twin cash-posture route",
      "stored finance-twin bank-account inventory route",
      "stored CFO Wiki pages when present",
      "freshness and limitation posture",
    ],
    input: {
      discoveryQuestion: input,
    },
  };
}

function buildDiscoveryTitle(companyKey: string, questionKind: FinanceDiscoveryQuestion["questionKind"]) {
  switch (questionKind) {
    case "cash_posture":
      return `Assess cash posture for ${companyKey}`;
  }
}

function buildDiscoveryObjective(companyKey: string) {
  return `Answer the stored cash posture question for ${companyKey} from persisted Finance Twin and CFO Wiki state only.`;
}
