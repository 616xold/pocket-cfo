import { z } from "zod";

export const ArtifactKindSchema = z.enum([
  "plan",
  "pr_link",
  "diff_summary",
  "test_report",
  "screenshot",
  "benchmark_report",
  "metrics_delta",
  "rollback_note",
  "approval_card",
  "proof_bundle_manifest",
  "replay_bundle",
  "log_excerpt",
]);

export const ArtifactRecordSchema = z.object({
  id: z.string().uuid(),
  missionId: z.string().uuid(),
  taskId: z.string().uuid().nullable(),
  kind: ArtifactKindSchema,
  uri: z.string(),
  mimeType: z.string().nullable(),
  sha256: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.string(),
});

export const ProofBundleManifestSchema = z.object({
  missionId: z.string().uuid(),
  objective: z.string(),
  changeSummary: z.string().default(""),
  verificationSummary: z.string().default(""),
  riskSummary: z.string().default(""),
  rollbackSummary: z.string().default(""),
  decisionTrace: z.array(z.string()).default([]),
  artifactIds: z.array(z.string().uuid()).default([]),
  replayEventCount: z.number().int().nonnegative().default(0),
  status: z.enum(["placeholder", "ready"]).default("placeholder"),
});

export type ArtifactKind = z.infer<typeof ArtifactKindSchema>;
export type ArtifactRecord = z.infer<typeof ArtifactRecordSchema>;
export type ProofBundleManifest = z.infer<typeof ProofBundleManifestSchema>;
