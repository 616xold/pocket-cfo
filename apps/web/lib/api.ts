import { MissionRecordSchema, MissionTaskRecordSchema, ProofBundleManifestSchema } from "@pocket-cto/domain";
import { z } from "zod";

const healthSchema = z.object({
  ok: z.boolean(),
  service: z.string(),
  now: z.string(),
});
type ControlPlaneHealth = z.output<typeof healthSchema>;

const missionDetailSchema = z.object({
  mission: MissionRecordSchema,
  tasks: z.array(MissionTaskRecordSchema),
  proofBundle: ProofBundleManifestSchema,
});
type MissionDetail = z.output<typeof missionDetailSchema>;

const controlPlaneUrl =
  process.env.NEXT_PUBLIC_CONTROL_PLANE_URL ??
  process.env.CONTROL_PLANE_URL ??
  "http://localhost:4000";

async function fetchJson<TSchema extends z.ZodTypeAny>(
  input: string,
  schema: TSchema,
): Promise<z.output<TSchema> | null> {
  try {
    const response = await fetch(`${controlPlaneUrl}${input}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    return schema.parse(json);
  } catch {
    return null;
  }
}

export async function getControlPlaneHealth(): Promise<ControlPlaneHealth> {
  return (await fetchJson("/health", healthSchema)) ?? {
    ok: false,
    service: "unreachable",
    now: new Date().toISOString(),
  };
}

export async function getMissionDetail(
  missionId: string,
): Promise<MissionDetail | null> {
  return fetchJson(`/missions/${missionId}`, missionDetailSchema);
}
