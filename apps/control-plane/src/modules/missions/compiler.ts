import type { MissionSpec } from "@pocket-cto/domain";
import { MissionSpecSchema } from "@pocket-cto/domain";

export type MissionCompilationResult = {
  spec: MissionSpec;
  compilerName: string;
  compilerVersion: string;
  confidence: number;
};

export interface MissionCompiler {
  compileFromText(input: { text: string }): Promise<MissionCompilationResult>;
}

export class StubMissionCompiler implements MissionCompiler {
  async compileFromText(input: { text: string }): Promise<MissionCompilationResult> {
    const normalizedTitle = input.text.trim().replace(/\.$/, "");

    const spec = MissionSpecSchema.parse({
      type: "build",
      title: normalizedTitle,
      objective: normalizedTitle,
      repos: ["web"],
      acceptance: [
        "produce a plan",
        "materialize tasks",
        "attach proof bundle placeholder",
      ],
      riskBudget: {
        sandboxMode: "patch-only",
        maxWallClockMinutes: 60,
        maxCostUsd: 10,
        allowNetwork: false,
        requiresHumanApprovalFor: ["merge"],
      },
      deliverables: ["plan", "proof_bundle", "approval_card"],
      evidenceRequirements: ["test report"],
    });

    return {
      spec,
      compilerName: "stub-compiler",
      compilerVersion: "0.1.0",
      confidence: 30,
    };
  }
}
