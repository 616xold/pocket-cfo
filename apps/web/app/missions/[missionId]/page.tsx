import { notFound } from "next/navigation";
import { MissionCard } from "../../../components/mission-card";
import { getMissionDetail } from "../../../lib/api";

type MissionPageProps = {
  params: Promise<{ missionId: string }>;
};

export default async function MissionPage({ params }: MissionPageProps) {
  const { missionId } = await params;
  const mission = await getMissionDetail(missionId);

  if (!mission) {
    if (missionId === "demo-mission") {
      return (
        <main className="shell">
          <MissionCard
            mission={{
              id: "demo-mission",
              type: "build",
              status: "planned",
              title: "Implement passkeys for sign-in",
              objective: "Ship passkeys without breaking email login.",
              createdAt: new Date().toISOString(),
              primaryRepo: "web",
            }}
            tasks={[
              { id: "t1", role: "planner", status: "pending" },
              { id: "t2", role: "executor", status: "pending" },
            ]}
            proofBundle={{
              status: "placeholder",
              objective: "Ship passkeys without breaking email login.",
              changeSummary: "",
              verificationSummary: "",
              riskSummary: "",
              rollbackSummary: "",
              decisionTrace: [],
            }}
          />
        </main>
      );
    }

    notFound();
  }

  return (
    <main className="shell">
      <MissionCard
        mission={{
          id: mission.mission.id,
          type: mission.mission.type,
          status: mission.mission.status,
          title: mission.mission.title,
          objective: mission.mission.objective,
          createdAt: mission.mission.createdAt,
          primaryRepo: mission.mission.primaryRepo,
        }}
        tasks={mission.tasks.map((task) => ({
          id: task.id,
          role: task.role,
          status: task.status,
        }))}
        proofBundle={{
          status: mission.proofBundle.status,
          objective: mission.proofBundle.objective,
          changeSummary: mission.proofBundle.changeSummary,
          verificationSummary: mission.proofBundle.verificationSummary,
          riskSummary: mission.proofBundle.riskSummary,
          rollbackSummary: mission.proofBundle.rollbackSummary,
          decisionTrace: mission.proofBundle.decisionTrace,
        }}
      />
    </main>
  );
}
