import type {
  MissionRecord,
  MissionTaskRecord,
} from "@pocket-cto/domain";
import type { PersistenceSession } from "../../lib/persistence";
import type { MissionRepository } from "../missions/repository";
import type { ReplayService } from "../replay/service";
import type { ProofBundleAssemblyService } from "./proof-bundle-assembly";
import type { EvidenceArtifactDraft, EvidenceService } from "./service";

export type PreparedPullRequestLinkEvidence = {
  artifactDraft: EvidenceArtifactDraft;
  pr: {
    branchName: string;
    draft: boolean;
    prNumber: number;
    repoFullName: string;
  };
};

type PullRequestLinkDeps = {
  evidenceService: Pick<EvidenceService, "buildPullRequestArtifact">;
  missionRepository: Pick<
    MissionRepository,
    "saveArtifact"
  >;
  proofBundleAssembly?: Pick<ProofBundleAssemblyService, "refreshProofBundle">;
  replayService: Pick<ReplayService, "append">;
};

export function preparePullRequestLinkEvidence(input: {
  evidenceService: Pick<EvidenceService, "buildPullRequestArtifact">;
  mission: MissionRecord;
  publishedPullRequest: {
    baseBranch: string;
    branchName: string;
    commitMessage: string;
    commitSha: string;
    draft: boolean;
    headBranch: string;
    prBody: string;
    prNumber: number;
    prTitle: string;
    prUrl: string;
    publishedAt: string;
    repoFullName: string;
  };
  task: MissionTaskRecord;
}): PreparedPullRequestLinkEvidence | null {
  if (input.task.role !== "executor") {
    return null;
  }

  return {
    artifactDraft: input.evidenceService.buildPullRequestArtifact({
      mission: input.mission,
      pr: input.publishedPullRequest,
      task: input.task,
    }),
    pr: {
      branchName: input.publishedPullRequest.branchName,
      draft: input.publishedPullRequest.draft,
      prNumber: input.publishedPullRequest.prNumber,
      repoFullName: input.publishedPullRequest.repoFullName,
    },
  };
}

export async function persistPullRequestLinkEvidence(input: {
  deps: PullRequestLinkDeps;
  preparedEvidence: PreparedPullRequestLinkEvidence;
  session: PersistenceSession;
  task: MissionTaskRecord;
}): Promise<void> {
  if (input.task.role !== "executor") {
    return;
  }

  const artifact = await input.deps.missionRepository.saveArtifact(
    input.preparedEvidence.artifactDraft,
    input.session,
  );

  await input.deps.replayService.append(
    {
      missionId: input.task.missionId,
      taskId: input.task.id,
      type: "artifact.created",
      payload: {
        artifactId: artifact.id,
        kind: artifact.kind,
      },
    },
    input.session,
  );

  await input.deps.proofBundleAssembly?.refreshProofBundle({
    missionId: input.task.missionId,
    session: input.session,
    trigger: "pull_request_link",
  });
}
