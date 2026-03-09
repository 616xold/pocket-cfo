import type { MissionType } from "@pocket-cto/domain";

export type StackPack = {
  id: string;
  name: string;
  description: string;
  supportedMissionTypes: MissionType[];
  defaultRepos: string[];
  twinExtractors: string[];
  benchmarkMissionIds: string[];
  promptFragments: Partial<Record<MissionType, string>>;
};
